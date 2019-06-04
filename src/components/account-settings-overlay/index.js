import React from 'react';

import Text from 'Components/text/text';
import Emoji from 'Components/images/emoji';
import Button from 'Components/buttons/button';
import { Overlay, OverlaySection, OverlayTitle } from 'Components/overlays';
import { useCurrentUser } from 'State/current-user';

import PopoverContainer from '../../presenters/pop-overs/popover-container';
import PasswordSettings from './password-settings';

const AccountSettingsOverlay = () => {
  const { currentUser } = useCurrentUser();
  const primaryEmail = currentUser.emails.find((email) => email.primary);
  return (
    <Overlay>
      <OverlaySection type="info">
        <OverlayTitle>
          Account Settings <Emoji name="key" />
        </OverlayTitle>
      </OverlaySection>
      <div>
        <div data-cy="account-settings-options">
          <Button type="primary" size="small">
            Password
          </Button>
          <Button type="primary" size="small">
            Two-Factor Authentication
          </Button>
        </div>
        <OverlaySection type="actions">
          <PasswordSettings />
        </OverlaySection>
      </div>
      <OverlaySection type="info">
        <Text>
          Email notifications are sent to <b>{primaryEmail.email}</b>
        </Text>
      </OverlaySection>
    </Overlay>
  );
};

const AccountSettings = ({ children }) => (
  <PopoverContainer>
    {({ visible, setVisible }) => (
      <details onToggle={(evt) => setVisible(evt.target.open)} open={visible} className="overlay-container">
        <summary>{children}</summary>
        <AccountSettingsOverlay />
      </details>
    )}
  </PopoverContainer>
);

export default AccountSettings;
