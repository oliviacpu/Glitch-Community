import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { parseOneAddress } from 'email-addresses';
import { debounce, trimStart } from 'lodash';
import axios from 'axios';

import TextArea from 'Components/inputs/text-area';
import Loader from 'Components/loader';
import InputText from 'Components/inputs/text-input';
import { PopoverWithButton, PopoverDialog, PopoverInfo, PopoverActions } from 'Components/popover'; 
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';
import { getAbuseReportTitle, getAbuseReportBody } from 'Utils/abuse-reporting';

import useDebouncedValue from '../../hooks/use-debounced-value';

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

const Success = () => (
  <>
    <PopoverInfo>
      <h1 className="pop-title">Report Abuse</h1>
    </PopoverInfo>
    <PopoverActions>
      <div className="notification notifySuccess">Report Sent</div>
      <p className="pop-description tight-line">
        Thanks for helping to keep Glitch a safe, friendly community <span className="emoji park" role="img" aria-label="" />
      </p>
    </PopoverActions>
  </>
);

const Failure = ({ value }) => (
  <>
    <PopoverInfo>
      <h1 className="pop-title">
        {'Failed to Send '}
        <span className="emoji sick" role="img" aria-label="" />
      </h1>
    </PopoverInfo>
    <PopoverInfo>
      <p className="info-description">
        But you can still send us your message by emailing the details below to <b>support@glitch.com</b>
      </p>
    </PopoverInfo>
    <PopoverActions>
      <textarea className="content-editable tall-text traditional" value={value} readOnly />
    </PopoverActions>
  </>
);

function ReportAbusePop({ reportedType, reportedModel }) {
  const { currentUser } = useCurrentUser();
  const [status, setStatus] = useState('ready'); // ready -> loading -> success | error

  const [reason, setReason] = useState(getDefaultReason(reportedType));
  const [reasonError, setReasonError] = useDebouncedValue('', 200);
  const reasonOnChange = (value) => {
    setReason(value);
    setReasonError(validateReason(value, reportedType));
  };

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useDebouncedValue('', 200);
  const emailOnChange = (value) => {
    setEmail(value);
    setEmailError(validateEmail(value, currentUser));
  };

  const formatRaw = () => getAbuseReportBody(currentUser, email, reportedType, reportedModel, reason);

  const submitReport = async (e) => {
    e.preventDefault();
    try {
      const emailErr = validateEmail(email, currentUser);
      const reasonErr = validateReason(reason, reportedType);
      if (emailErr || reasonErr) {
        setEmailError(emailErr);
        setReasonError(reasonErr);
        return;
      }

      setStatus('loading');

      await axios.post('https://support-poster.glitch.me/post', {
        raw: formatRaw(),
        title: getAbuseReportTitle(reportedModel, reportedType),
      });
      setStatus('success');
    } catch (error) {
      captureException(error);
      setStatus('error');
    }
  };

  if (status === 'success') return <Success />;
  if (status === 'error') return <Failure value={trimStart(formatRaw())} />;

  return (
    <form onSubmit={submitReport}>
      <PopoverInfo>
        <h1 className="pop-title">Report Abuse</h1>
      </PopoverInfo>
      <PopoverActions>
        <TextArea
          value={reason}
          onChange={reasonOnChange}
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          error={reasonError}
        />
      </PopoverActions>
      {currentUser.login ? (
        <PopoverInfo type="secondary">
          <p className="info-description right">
            from <strong>{currentUser.login}</strong>
          </p>
        </PopoverInfo>
      ) : (
        <PopoverInfo>
          <InputText value={email} onChange={emailOnChange} placeholder="your@email.com" error={emailError} type="email" />
        </PopoverInfo>
      )}
      <PopoverActions>
        {status === 'loading' ? (
          <Loader />
        ) : (
          <button className="button button-small" onClick={submitReport} type="button">
            Submit Report
          </button>
        )}
      </PopoverActions>
    </form>
  );
}

const ReportAbusePopButton = ({ reportedType, reportedModel }) => (
  <div className="report-abuse-button-wrap">
    <PopoverWithButton buttonProps={{ size: 'small', type: 'tertiary' }} buttonText="Report Abuse">
      {() => (
        <PopoverDialog align="left" wide>
          <ReportAbusePop reportedType={reportedType} reportedModel={reportedModel} />
        </PopoverDialog>
      )}
    </PopoverWithButton>
  </div>
);

ReportAbusePopButton.propTypes = {
  reportedType: PropTypes.oneOf(['project', 'collection', 'user', 'team', 'home']).isRequired,
  reportedModel: PropTypes.object, // the actual model, or null if no model (like for the home page)
};

ReportAbusePopButton.defaultProps = {
  reportedModel: null,
};

export default ReportAbusePopButton;
