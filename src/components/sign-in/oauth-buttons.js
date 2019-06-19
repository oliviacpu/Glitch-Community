
import React from 'react';
import dayjs from 'dayjs';

import SignInButton from 'Components/buttons/sign-in-button';

import useDevToggle from 'State/dev-toggles';
import useLocalStorage from 'State/local-storage';

const OAuthButtons = () => {
  const slackAuthEnabled = useDevToggle('Slack Auth');
  
  const [, setDestination] = useLocalStorage('destinationAfterAuth');
  const onClick = () =>
    setDestination({
      expires: dayjs()
        .add(10, 'minutes')
        .toISOString(),
      to: {
        pathname: location.pathname,
        search: location.search,
      },
    });
  
  return (
    <>
      <SignInButton company="facebook" onClick={onClick} />
      <SignInButton company="github" onClick={onClick} />
      <SignInButton company="google" onClick={onClick} />
      {slackAuthEnabled && <SignInButton company="slack" onClick={onClick} />}
    </>
  )
}

export default OAuthButtons;