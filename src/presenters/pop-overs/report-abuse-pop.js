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

class ReportAbusePop extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.reportedType === 'user') {
      this.defaultReason = "This user profile doesn't seem appropriate for Glitch because...";
    } else if (this.props.reportedType === 'home') {
      this.defaultReason = "[Something here] doesn't seem appropriate for Glitch because...";
    } else {
      this.defaultReason = `This ${props.reportedType} doesn't seem appropriate for Glitch because...`;
    }

    this.state = {
      reason: this.defaultReason,
      email: '',
      emailError: '',
      reasonError: '',
      submitted: false,
      loading: false,
    };
    this.submitReport = this.submitReport.bind(this);
    this.reasonOnChange = this.reasonOnChange.bind(this);
    this.formatRaw = this.formatRaw.bind(this);
    this.getUserInfoSection = this.getUserInfoSection.bind(this);
    this.emailOnChange = this.emailOnChange.bind(this);
    this.validateNotEmpty = this.validateNotEmpty.bind(this);
    this.validateReason = this.validateReason.bind(this);
    this.validateEmail = this.validateEmail.bind(this);

    this.debouncedValidateEmail = debounce(() => this.validateEmail(), 200);
    this.debouncedValidateReason = debounce(() => this.validateReason(), 200);
  }

  getUserInfoSection() {
    if (this.props.currentUser.login) {
      return (
        <section className="pop-over-info">
          <p className="info-description right">
            from <strong>{this.props.currentUser.login}</strong>
          </p>
        </section>
      );
    }
    return (
      <section className="pop-over-info">
        <InputText
          value={this.state.email}
          onChange={this.emailOnChange}
          onBlur={() => this.debouncedValidateEmail()}
          placeholder="your@email.com"
          error={this.state.emailError}
          type="email"
        />
      </section>
    );
  }

  formatRaw() {
    return getAbuseReportBody(this.props.currentUser, this.state.email, this.props.reportedType, this.props.reportedModel, this.state.reason);
  }

  async submitReport() {
    try {
      const emailErrors = this.validateEmail();
      const reasonErrors = this.validateReason();
      if (emailErrors.emailError !== '' || reasonErrors.reasonError !== '') {
        return;
      }
      this.setState({ loading: true });

      await axios.post('https://support-poster.glitch.me/post', {
        raw: this.formatRaw(),
        title: getAbuseReportTitle(this.props.reportedModel, this.props.reportedType),
      });
      this.setState({ submitted: true, submitSuccess: true, loading: false });
    } catch (error) {
      captureException(error);
      this.setState({ submitted: true, submitSuccess: false, loading: false });
    }
  }

  validateNotEmpty(stateField, errorField, fieldDescription) {
    let errorObj;
    if (this.state[stateField] === '') {
      errorObj = { [errorField]: `${fieldDescription} is required` };
    } else {
      errorObj = { [errorField]: '' };
    }
    this.setState(errorObj);
    return errorObj;
  }

  validateReason() {
    let errorObj = this.validateNotEmpty('reason', 'reasonError', 'A description of the issue');
    if (errorObj.reasonError === '' && this.state.reason === this.defaultReason) {
      errorObj = { reasonError: 'Reason is required' };
      this.setState(errorObj);
    }
    return errorObj;
  }

  validateEmail() {
    if (this.props.currentUser.login) {
      return { emailError: '' };
    }

    let errors = this.validateNotEmpty('email', 'emailError', 'Email');
    if (errors.emailError !== '') {
      return errors;
    }

    const email = parseOneAddress(this.state.email);
    if (!email) {
      errors = { emailError: 'Please enter a valid email' };
    } else {
      errors = { emailError: '' };
    }
    this.setState(errors);
    return errors;
  }

  reasonOnChange(value) {
    this.setState({
      reason: value,
    });
    this.debouncedValidateReason();
  }

  emailOnChange(value) {
    this.setState({
      email: value,
    });
    this.debouncedValidateEmail();
  }

  render() {
    let content;
    if (this.state.submitted) {
      if (!this.state.submitSuccess) {
        return <Failure value={trimStart(this.formatRaw())} />;
      }
      return <Success />;
    }

    return (
      <>
        <section className="pop-over-info">
          <h1 className="pop-title">Report Abuse</h1>
        </section>
        <section className="pop-over-actions">
          <TextArea
            value={this.state.reason}
            onChange={this.reasonOnChange}
            onBlur={this.debouncedValidateReason}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            error={this.state.reasonError}
          />
        </section>
        {this.getUserInfoSection()}
        <section className="pop-over-actions">
          {this.state.loading ? (
            <Loader />
          ) : (
            <button className="button button-small" onClick={this.submitReport} type="button">
              Submit Report
            </button>
          )}
        </section>
      </>
    );
  }
}

ReportAbusePop.propTypes = {
  reportedType: PropTypes.string.isRequired, // 'project', 'collection', 'user', 'team'
  reportedModel: PropTypes.object.isRequired, // the actual model
  currentUser: PropTypes.object.isRequired,
};

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
  reportedType: PropTypes.string.isRequired, // 'project', 'collection', 'user', 'team'
  reportedModel: PropTypes.object, // the actual model, or null if no model (like for the home page)
};

ReportAbusePopButton.defaultProps = {
  reportedModel: null,
};

export default ReportAbusePopButton;
