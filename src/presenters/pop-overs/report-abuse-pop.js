import React from 'react';
import PropTypes from 'prop-types';
import { parseOneAddress } from 'email-addresses';
import { debounce, trimStart } from 'lodash';
import axios from 'axios';
import TextArea from 'Components/inputs/text-area';
import Loader from 'Components/loader';
import InputText from 'Components/inputs/text-input';
import PopoverWithButton from './popover-with-button';
import { captureException } from '../../utils/sentry';
import { getAbuseReportTitle, getAbuseReportBody } from '../../utils/abuse-reporting';

import { useCurrentUser } from '../../state/current-user';

const Success = () => (
  <>
    <section className="pop-over-info">
      <h1 className="pop-title">Report Abuse</h1>
    </section>
    <section className="pop-over-actions">
      <div className="notification notifySuccess">Report Sent</div>
      <p className="pop-description tight-line">
        Thanks for helping to keep Glitch a safe, friendly community <span className="emoji park" role="img" aria-label="" />
      </p>
    </section>
  </>
);

const Failure = ({ value }) => (
  <>
    <section className="pop-over-info">
      <h1 className="pop-title">
        {'Failed to Send '}
        <span className="emoji sick" role="img" aria-label="" />
      </h1>
    </section>
    <section className="pop-over-info">
      <p className="info-description">
        But you can still send us your message by emailing the details below to <b>support@glitch.com</b>
      </p>
    </section>
    <section className="pop-over-actions">
      <textarea className="content-editable tall-text traditional" value={value} readOnly />
    </section>
  </>
);

function getDefaultReason(reportedType) {
  if (reportedType === 'user') {
    return "This user profile doesn't seem appropriate for Glitch because...";
  }
  if (reportedType === 'home') {
    return "[Something here] doesn't seem appropriate for Glitch because...";
  }
  return `This ${reportedType} doesn't seem appropriate for Glitch because...`;
}

function validateNotEmpty(value, errorField, fieldDescription) {
  let errorObj;
  if (value === '') {
    errorObj = { [errorField]: `${fieldDescription} is required` };
  } else {
    errorObj = { [errorField]: '' };
  }
  return errorObj;
}

function validateReason(reason, reportedType) {
  const defaultReason = getDefaultReason(reportedType);
  let errorObj = validateNotEmpty(reason, 'reasonError', 'A description of the issue');
  if (errorObj.reasonError === '' && reason === defaultReason) {
    errorObj = { reasonError: 'Reason is required' };
  }
  return errorObj;
}

function validateEmail(email) {
  if (this.props.currentUser.login) {
    return { emailError: '' };
  }

  let errors = validateNotEmpty(email, 'emailError', 'Email');
  if (errors.emailError !== '') {
    return errors;
  }

  const parsedEmail = parseOneAddress(email);
  if (!parsedEmail) {
    errors = { emailError: 'Please enter a valid email' };
  } else {
    errors = { emailError: '' };
  }
  return errors;
}

class ReportAbusePop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reason: getDefaultReason(props.reportedType),
      email: '',
      emailError: '',
      reasonError: '',
      submitted: false,
      loading: false,
      status: 'ready', // ready -> loading -> success | error
    };

    this.debouncedValidateEmail = debounce(() => this.setState(({ email }) => validateEmail(email)), 200);
    this.debouncedValidateReason = debounce(() => this.setState(({ reason }) => validateReason(reason, this.props.reportedType)), 200);
  }

  render() {
    const { currentUser, reportedType, reportedModel } = this.props;
    const { email, emailError, reason, reasonError, status } = this.state;

    const formatRaw = () => getAbuseReportBody(currentUser, email, reportedType, reportedModel, reason);

    const reasonOnChange = (value) => {
      this.setState({
        reason: value,
      });
      this.debouncedValidateReason();
    };

    const emailOnChange = (value) => {
      this.setState({
        email: value,
      });
      this.debouncedValidateEmail();
    };

    const submitReport = async (e) => {
      e.preventDefault();
      try {
        const emailErrors = validateEmail(email);
        const reasonErrors = validateReason(reason, reportedType);
        if (emailErrors.emailError !== '' || reasonErrors.reasonError !== '') {
          return;
        }
        this.setState({ status: 'loading' });

        await axios.post('https://support-poster.glitch.me/post', {
          raw: formatRaw(),
          title: getAbuseReportTitle(reportedModel, reportedType),
        });
        this.setState({ status: 'success' });
      } catch (error) {
        captureException(error);
        this.setState({ status: 'error' });
      }
    };
    
    if (status === 'success') return <Success />;
    if (status === 'error') return <Failure value={trimStart(formatRaw())} />;

    return (
      <form onSubmit={submitReport}>
        <section className="pop-over-info">
          <h1 className="pop-title">Report Abuse</h1>
        </section>
        <section className="pop-over-actions">
          <TextArea
            value={reason}
            onChange={reasonOnChange}
            onBlur={this.debouncedValidateReason}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            error={reasonError}
          />
        </section>
        {currentUser.login ? (
          <section className="pop-over-info">
            <p className="info-description right">
              from <strong>{currentUser.login}</strong>
            </p>
          </section>
        ) : (
          <section className="pop-over-info">
            <InputText
              value={email}
              onChange={emailOnChange}
              onBlur={() => this.debouncedValidateEmail()}
              placeholder="your@email.com"
              error={emailError}
              type="email"
            />
          </section>
        )}
        <section className="pop-over-actions">
          {status === 'loading' ? (
            <Loader />
          ) : (
            <button className="button button-small" onClick={submitReport} type="button">
              Submit Report
            </button>
          )}
        </section>
      </form>
    );
  }
}

const ReportAbusePopButton = (props) => {
  const { currentUser } = useCurrentUser();
  return (
    <div className="report-abuse-button-wrap">
      <PopoverWithButton buttonClass="button-small button-tertiary margin" buttonText="Report Abuse">
        {() => (
          <dialog className="pop-over wide-pop top-right report-abuse-pop">
            <ReportAbusePop currentUser={currentUser} reportedType={props.reportedType} reportedModel={props.reportedModel} />
          </dialog>
        )}
      </PopoverWithButton>
    </div>
  );
};
ReportAbusePopButton.propTypes = {
  reportedType: PropTypes.oneOf(['project', 'collection', 'user', 'team', 'home']).isRequired,
  reportedModel: PropTypes.object, // the actual model, or null if no model (like for the home page)
};

ReportAbusePopButton.defaultProps = {
  reportedModel: null,
};

export default ReportAbusePopButton;
