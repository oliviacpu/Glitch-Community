import React, { useState }  from 'react';
import PropTypes from 'prop-types';
import { parseOneAddress } from 'email-addresses';
import { debounce, trimStart } from 'lodash';
import axios from 'axios';

import TextArea from 'Components/inputs/text-area';
import Loader from 'Components/loader';
import InputText from 'Components/inputs/text-input';
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';
import { getAbuseReportTitle, getAbuseReportBody } from 'Utils/abuse-reporting';

import PopoverWithButton from './popover-with-button';
import { useDebouncedState }

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

function validateNotEmpty(value, fieldDescription) {
  if (value === '') return `${fieldDescription} is required`;
  return '';
}

function validateReason(reason, reportedType) {
  const err = validateNotEmpty(reason, 'A description of the issue');
  if (err) return err;
  if (reason === getDefaultReason(reportedType)) return 'Reason is required';
  return '';
}

function validateEmail(email, currentUser) {
  if (currentUser.login) return '';

  const err = validateNotEmpty(email, 'Email');
  if (err) return err;

  if (!parseOneAddress(email)) return 'Please enter a valid email';
  return '';
}

function ReportAbusePop({ currentUser, reportedType, reportedModel }) {
  const [status, setStatus] = useState('ready'); // ready -> loading -> success | error
  const [reason, setReason] = useState(getDefaultReason(reportedType));
  const [reasonError, setReasonError] = useDebouncedState('', 200);
  const reasonOnChange = (value) => {
    setReason(value);
    setReasonError(validateReason(value, reportedType));
  };

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useDebouncedState('', 200);
  const emailOnChange = (value) => {
    setEmail(value);
    setEmailError(validateEmail(value, currentUser));
  };

  const formatRaw = () => getAbuseReportBody(currentUser, email, reportedType, reportedModel, reason);

  const submitReport = async (e) => {
    e.preventDefault();
    try {
      if (!validateEmail(email, currentUser) || !validateReason(reason, reportedType)) return;

      setStatus({ status: 'loading' });

      await axios.post('https://support-poster.glitch.me/post', {
        raw: formatRaw(),
        title: getAbuseReportTitle(reportedModel, reportedType),
      });
      setStatus({ status: 'success' });
    } catch (error) {
      captureException(error);
      setStatus({ status: 'error' });
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
            onBlur={this.debouncedValidateEmail}
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
