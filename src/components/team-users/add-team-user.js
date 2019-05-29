import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { uniqBy } from 'lodash';
import { parseOneAddress } from 'email-addresses';
import randomColor from 'randomcolor';

import { UserAvatar } from 'Components/images/avatar';
import { UserLink } from 'Components/link';
import WhitelistedDomainIcon from 'Components/whitelisted-domain';
import Thanks from 'Components/thanks';
import { PopoverWithButton, PopoverDialog, PopoverSearch, PopoverInfo, InfoDescription } from 'Components/popover';
import { ResultItem, ResultInfo, ResultName, ResultDescription } from 'Components/containers/results-list';
import { getDisplayName } from 'Models/user';
import { captureException } from 'Utils/sentry';
import { useTracker } from 'State/segment-analytics';
import useDevToggle from 'State/dev-toggles';
import { useAlgoliaSearch } from 'State/search';

import useDebouncedValue from '../../hooks/use-debounced-value';

const WhitelistEmailDomain = ({ result: domain, active, onClick }) => (
  <ResultItem onClick={onClick} active={active}>
    <WhitelistedDomainIcon domain={domain} />
    <ResultInfo>Allow anyone with an @{domain} email to join</ResultInfo>
  </ResultItem>
);

const UserResult = ({ result: user, active, onClick }) => (
  <ResultItem onClick={onClick} active={active}>
    <UserAvatar user={user} />
    <ResultInfo>
      <ResultName>{getDisplayName(user)}</ResultName>
      {!!user.name && <ResultDescription>@{user.login}</ResultDescription>}
      <Thanks short count={user.thanksCount} />
    </ResultInfo>
  </ResultItem>
);

const InviteByEmail = ({ result: email, active, onClick }) => {
  const { current: color } = useRef(randomColor({ luminosity: 'light' }));
  return (
    <ResultItem onClick={onClick} active={active}>
      <UserAvatar user={{ color }} />
      <ResultInfo>
        <ResultName>Invite {email}</ResultName>
      </ResultInfo>
    </ResultItem>
  );
};

const getDomain = (query) => {
  if (!query) return null;
  const email = parseOneAddress(query.replace('@', 'test@'));
  if (email && email.domain.includes('.')) {
    return email.domain.toLowerCase();
  }
  return null;
};

function useCheckedDomains(query) {
  const [checkedDomains, setCheckedDomains] = useState({ 'gmail.com': true, 'yahoo.com': true });
  useEffect(() => {
    const domain = getDomain(query);
    if (!domain || domain in checkedDomains) return undefined;

    let isCurrentRequest = true;
    axios.get(`https://freemail.glitch.me/${domain}`).then(({ data }) => {
      if (!isCurrentRequest) return;
      setCheckedDomains((domains) => ({ ...domains, [domain]: !data.free }));
    }, captureException);

    return () => {
      isCurrentRequest = false;
    };
  }, [query, checkedDomains]);
  return checkedDomains;
}

function AddTeamUserPop({ members, inviteEmail, inviteUser, setWhitelistedDomain, whitelistedDomain, allowEmailInvites }) {
  const [value, onChange] = useState('');
  const debouncedValue = useDebouncedValue(value, 200);
  const checkedDomains = useCheckedDomains(debouncedValue);

  const { user: retrievedUsers, status } = useAlgoliaSearch(
    debouncedValue,
    {
      filterTypes: ['user'],
    },
    [],
  );

  const results = useMemo(() => {
    const memberSet = new Set(members);
    const filteredUsers = retrievedUsers.filter((user) => !memberSet.has(user.id));
    const out = [];

    const email = parseOneAddress(debouncedValue);
    if (email && allowEmailInvites) {
      out.push({
        id: 'invite-by-email',
        result: email.address,
        onClick: () => inviteEmail(email.address),
        component: InviteByEmail,
      });
    }

    if (setWhitelistedDomain && !whitelistedDomain) {
      const domain = getDomain(debouncedValue);
      if (domain && checkedDomains[domain]) {
        out.push({
          id: 'whitelist-email-domain',
          result: domain,
          onClick: () => setWhitelistedDomain(domain),
          component: WhitelistEmailDomain,
        });
      }
    }

    // now add the actual search results
    out.push(
      ...filteredUsers.map((user) => ({
        id: user.id,
        result: user,
        onClick: () => inviteUser(user),
        component: UserResult,
      })),
    );

    return out;
  }, [debouncedValue, retrievedUsers, members, whitelistedDomain]);

  return (
    <PopoverDialog align="left">
      <PopoverSearch
        value={value}
        onChange={onChange}
        results={results}
        status={status}
        onSubmit={(result) => result.onClick()}
        labelText="User name"
        placeholder="Search for a user"
        renderItem={({ item: { onClick, result, component: Component }, active }) => <Component active={active} result={result} onClick={onClick} />}
      />
      {!value && !!setWhitelistedDomain && !whitelistedDomain && (
        <PopoverInfo>
          <InfoDescription>You can also whitelist with @example.com</InfoDescription>
        </PopoverInfo>
      )}
    </PopoverDialog>
  );
}

AddTeamUserPop.propTypes = {
  inviteEmail: PropTypes.func.isRequired,
  inviteUser: PropTypes.func.isRequired,
  members: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  setWhitelistedDomain: PropTypes.func,
  whitelistedDomain: PropTypes.string,
  allowEmailInvites: PropTypes.bool.isRequired,
};

AddTeamUserPop.defaultProps = {
  setWhitelistedDomain: () => {},
  whitelistedDomain: '',
};

const AddTeamUser = ({ inviteEmail, inviteUser, setWhitelistedDomain, members, invitedMembers, whitelistedDomain }) => {
  const [invitee, setInvitee] = useState('');
  const [newlyInvited, setNewlyInvited] = useState([]);

  const alreadyInvitedAndNewInvited = uniqBy(invitedMembers.concat(newlyInvited), (user) => user.id);
  const track = useTracker('Add to Team clicked');
  const allowEmailInvites = useDevToggle('Email Invites');

  const onSetWhitelistedDomain = async (togglePopover, domain) => {
    togglePopover();
    await setWhitelistedDomain(domain);
  };

  const onInviteUser = async (togglePopover, user) => {
    togglePopover();
    setNewlyInvited((invited) => [...invited, user]);
    try {
      await inviteUser(user);
      setInvitee(getDisplayName(user));
    } catch (error) {
      setNewlyInvited((invited) => invited.filter((u) => u.id !== user.id));
      captureException(error);
    }
  };

  const onInviteEmail = async (togglePopover, email) => {
    togglePopover();
    setInvitee(email);
    try {
      await inviteEmail(email);
    } catch (error) {
      captureException(error);
    }
  };

  const removeNotifyInvited = () => {
    setInvitee('');
  };

  return (
    <div>
      <PopoverWithButton buttonProps={{ size: 'small', type: 'tertiary' }} buttonText="Add" onOpen={track}>
        {({ togglePopover }) => (
          <AddTeamUserPop
            allowEmailInvites={allowEmailInvites}
            members={alreadyInvitedAndNewInvited.map((user) => user.id).concat(members)}
            whitelistedDomain={whitelistedDomain}
            setWhitelistedDomain={setWhitelistedDomain ? (domain) => onSetWhitelistedDomain(togglePopover, domain) : null}
            inviteUser={inviteUser ? (user) => onInviteUser(togglePopover, user) : null}
            inviteEmail={inviteEmail ? (email) => onInviteEmail(togglePopover, email) : null}
          />
        )}
      </PopoverWithButton>
      {!!invitee && (
        <div className="notification notifySuccess inline-notification" onAnimationEnd={removeNotifyInvited}>
          Invited {invitee}
        </div>
      )}
    </div>
  );
};
AddTeamUser.propTypes = {
  invitedMembers: PropTypes.array.isRequired,
  inviteEmail: PropTypes.func,
  inviteUser: PropTypes.func,
  members: PropTypes.array.isRequired,
  setWhitelistedDomain: PropTypes.func,
};
AddTeamUser.defaultProps = {
  setWhitelistedDomain: null,
  inviteUser: null,
  inviteEmail: null,
};

export default AddTeamUser;
