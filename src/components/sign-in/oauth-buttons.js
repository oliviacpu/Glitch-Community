
import React, { useState, useMemo } from 'react';

const OAuthButtons = () => {
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