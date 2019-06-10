import React, { useEffect, useState } from 'react';
import get from 'lodash/get';

import Text from 'Components/text/text';
import Emoji from 'Components/images/emoji';
import Button from 'Components/buttons/button';
import { Overlay, OverlaySection, OverlayTitle } from 'Components/overlays';
import { useCurrentUser } from 'State/current-user';
import { useAPI } from 'State/api';

import PopoverContainer from '../../presenters/pop-overs/popover-container';
import PasswordSettings from './password-settings';
import TwoFactorSettings from './two-factor-settings';
import styles from './styles.styl';

const AccountSettingsOverlay = () => {
  const { currentUser } = useCurrentUser();
  const api = useAPI();

  const [page, setPage] = useState('password');
  const [userHasPassword, setUserHasPassword] = useState(false);

  const primaryEmail = currentUser.emails.find((email) => email.primary);

  useEffect(() => {
    async function hasSetPassword() {
      const response = await api.get(`/users/${currentUser.id}/hasSetPassword`);
      setUserHasPassword(get(response, 'data.hasSetPassword'));
    }

    hasSetPassword();
  }, []);

  return (
    <Overlay className="account-settings-overlay">
      <OverlaySection type="info">
        <OverlayTitle>
          Account Settings <Emoji name="key" />
        </OverlayTitle>
      </OverlaySection>

      <OverlaySection type="actions">
        <div className={styles.accountSettings}>
          <div className={styles.accountSettingsActions}>
            <Button size="small" onClick={() => setPage('password')}>
              Password
            </Button>
            <Button size="small" onClick={() => setPage('2fa')}>
              Two-Factor Authentication
            </Button>
          </div>
          <div className={styles.accountSettingsContent}>
            {page === 'password' ? <PasswordSettings userHasPassword={userHasPassword} /> : null}
            {page === '2fa' ? <TwoFactorSettings /> : null}
          </div>
        </div>
      </OverlaySection>
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
