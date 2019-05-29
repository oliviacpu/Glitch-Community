import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { debounce, uniqBy } from 'lodash';
import { parseOneAddress } from 'email-addresses';
import randomColor from 'randomcolor';

import Thanks from 'Components/thanks';
import Loader from 'Components/loader';
import { UserAvatar } from 'Components/images/avatar';
import { UserLink } from 'Components/link';
import TransparentButton from 'Components/buttons/transparent-button';
import WhitelistedDomainIcon from 'Components/whitelisted-domain';
import { ANON_AVATAR_URL, getAvatarThumbnailUrl, getDisplayName } from 'Models/user';
import { captureException } from 'Utils/sentry';
import { useTracker } from 'State/segment-analytics';
import useDevToggle from 'State/dev-toggles';
import { useAPI } from 'State/api';
import { useAlgoliaSearch } from 'State/search';

import useDebouncedValue from '../../hooks/use-debounced-value';
import PopoverWithButton from './popover-with-button';

const WhitelistEmailDomain = ({ domain, onClick }) => (
  <TransparentButton onClick={onClick} className="result">
    <div className="add-team-user-pop__whitelist-email-domain">
      <div className="add-team-user-pop__whitelist-email-image">
        <WhitelistedDomainIcon domain={domain} />
      </div>
      <div>Allow anyone with an @{domain} email to join</div>
    </div>
  </TransparentButton>
);

const UserResultItem = ({ user, action }) => {
  const name = getDisplayName(user);

  return (
    <TransparentButton onClick={action} className="result result-user">
      <img className="avatar" src={getAvatarThumbnailUrl(user)} alt="" />
      <div className="result-info">
        <div className="result-name" title={name}>
          {name}
        </div>
        {!!user.name && <div className="result-description">@{user.login}</div>}
        <Thanks short count={user.thanksCount} />
      </div>
    </TransparentButton>
  );
};

UserResultItem.propTypes = {
  user: PropTypes.shape({
    avatarThumbnailUrl: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
  }).isRequired,
  action: PropTypes.func.isRequired,
};

const InviteByEmail = ({ email, onClick }) => {
  const { current: backgroundColor } = useRef(randomColor({ luminosity: 'light' }));
  return (
    <TransparentButton onClick={onClick} className="result result-user">
      <img className="avatar" src={ANON_AVATAR_URL} style={{ backgroundColor }} alt="" />
      <div className="result-info">
        <div className="result-name">Invite {email}</div>
      </div>
    </TransparentButton>
  );
};

InviteByEmail.propTypes = {
  email: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const getDomain = (query) => {
  const email = parseOneAddress(query.replace('@', 'test@'));
  if (email && email.domain.includes('.')) {
    return email.domain.toLowerCase();
  }
  return null;
};

function useValidDomains (domain) {
  const 
  
}


async function validateDomain(query) {
  const domain = getDomain(query);
  if (!domain || this.state.validDomains[domain] !== undefined) {
    return;
  }

  this.setState((prevState) => ({
    validDomains: { ...prevState.validDomains, [domain]: null },
  }));

  let valid = !['gmail.com', 'yahoo.com'].includes(domain); // Used if we can't reach freemail

  try {
    const { data } = await axios.get(`https://freemail.glitch.me/${domain}`);
    valid = !data.free;
  } catch (error) {
    captureException(error);
  }

  this.setState((prevState) => ({
    validDomains: { ...prevState.validDomains, [domain]: valid },
  }));
}

function AddTeamUserPop({ inviteEmail, inviteUser, setWhitelistedDomain, whitelistedDomain, allowEmailInvites }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 200);

  const { user: retrievedUsers, status } = useAlgoliaSearch(
    debouncedQuery,
    {
      filterTypes: ['user'],
    },
    [],
  );

  const results = [];

  const email = parseOneAddress(query);
  if (email && this.props.allowEmailInvites) {
    results.push({
      key: 'invite-by-email',
      item: <InviteByEmail email={email.address} onClick={() => inviteEmail(email.address)} />,
    });
  }

  if (setWhitelistedDomain && !whitelistedDomain) {
    const domain = getDomain(query);
    if (domain && this.state.validDomains[domain]) {
      results.push({
        key: 'whitelist-email-domain',
        item: <WhitelistEmailDomain domain={domain} onClick={() => setWhitelistedDomain(domain)} />,
      });
    }
  }

  // now add the actual search results
  results.push(
    ...retrievedUsers.map((user) => ({
      key: user.id,
      item: <UserResultItem user={user} action={() => inviteUser(user)} />,
    })),
  );

  return (
    <dialog className="pop-over add-team-user-pop">
      <section className="pop-over-info">
        <input
          id="team-user-search"
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          value={query}
          onChange={this.handleChange}
          className="pop-over-input search-input pop-over-search"
          placeholder="Search for a user"
          aria-label="Search for a user"
        />
      </section>
      {!query && !!setWhitelistedDomain && !whitelistedDomain && <aside className="pop-over-info">You can also whitelist with @example.com</aside>}
      {query.length > 0 && status === 'loading' && (
        <section className="pop-over-actions last-section">
          <Loader />
        </section>
      )}
      {query.length > 0 && status === 'ready' && results.length === 0 && (
        <section className="pop-over-actions last-section">
          Nothing found{' '}
          <span role="img" aria-label="">
            💫
          </span>
        </section>
      )}
      {query.length > 0 && status === 'ready' && results.length > 0 && (
        <section className="pop-over-actions last-section results-list">
          <ul className="results">
            {results.map(({ key, item }) => (
              <li key={key}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </dialog>
  );
}

AddTeamUserPop.propTypes = {
  api: PropTypes.func.isRequired,
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
  const api = useAPI();
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
    <span className="add-user-container">
      <ul className="users">
        {alreadyInvitedAndNewInvited.map((user) => (
          <li key={user.id}>
            <UserLink user={user} className="user">
              <UserAvatar user={user} />
            </UserLink>
          </li>
        ))}
      </ul>
      <span className="add-user-wrap">
        <PopoverWithButton buttonClass="button-small button-tertiary add-user" buttonText="Add" onOpen={track}>
          {({ togglePopover }) => (
            <AddTeamUserPop
              api={api}
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
      </span>
    </span>
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
