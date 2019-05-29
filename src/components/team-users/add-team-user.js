import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { uniqBy } from 'lodash';
import { parseOneAddress } from 'email-addresses';
import randomColor from 'randomcolor';

import Thanks from 'Components/thanks';
import Loader from 'Components/loader';
import { UserAvatar } from 'Components/images/avatar';
import { UserLink } from 'Components/link';
import TransparentButton from 'Components/buttons/transparent-button';
import WhitelistedDomainIcon from 'Components/whitelisted-domain';
import TextInput from 'Components/inputs/text-input';
import Emoji from 'Components/images/emoji';
import { PopoverWithButton, PopoverDialog, PopoverActions, PopoverInfo, PopoverSection, InfoDescription } from 'Components/popover';
import ResultsList, { ScrollResult, useActiveIndex } from 'Components/containers/results-list';
import { ANON_AVATAR_URL, getAvatarThumbnailUrl, getDisplayName } from 'Models/user';
import { captureException } from 'Utils/sentry';
import { useTracker } from 'State/segment-analytics';
import useDevToggle from 'State/dev-toggles';
import { useAlgoliaSearch } from 'State/search';

import useDebouncedValue from '../../hooks/use-debounced-value';

const WhitelistEmailDomain = ({ result: domain, onClick }) => (
  <TransparentButton onClick={onClick} className="result">
    <div className="add-team-user-pop__whitelist-email-domain">
      <div className="add-team-user-pop__whitelist-email-image">
        <WhitelistedDomainIcon domain={domain} />
      </div>
      <div>Allow anyone with an @{domain} email to join</div>
    </div>
  </TransparentButton>
);

const ProjectResultItemBase = ({ project, active, onClick, teams, users }) => (
  <div className={classnames(styles.projectResult, project.isPrivate && styles.private, active && styles.active)}>
    <TransparentButton onClick={onClick}>
      <div className={styles.resultWrap}>
        <ProjectAvatar {...project} />
        <div className={styles.resultInfo}>
          <div className={styles.resultName}>{project.domain}</div>
          {project.description.length > 0 && (
            <div className={styles.resultDescription}>
              <Markdown renderAsPlaintext>{project.description}</Markdown>
            </div>
          )}
          <div className={styles.profileListWrap}>
            <ProfileList teams={teams} users={users} layout="row" size="small" />
          </div>
        </div>
      </div>
    </TransparentButton>
    <div className={styles.linkButtonWrap}>
      <Button size="small" href={getLink(project)} newTab>
        View →
      </Button>
    </div>
  </div>
);



const InviteByEmail = ({ result: email, onClick }) => {
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
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 200);
  const checkedDomains = useCheckedDomains(debouncedQuery);

  const { user: retrievedUsers, status } = useAlgoliaSearch(
    debouncedQuery,
    {
      filterTypes: ['user'],
    },
    [],
  );

  const results = useMemo(() => {
    const memberSet = new Set(members);
    const filteredUsers = retrievedUsers.filter((user) => !memberSet.has(user.id));
    const results = [];

    const email = parseOneAddress(query);
    if (email && allowEmailInvites) {
      results.push({
        id: 'invite-by-email',
        result: email.address,
        onClick: () => inviteEmail(email.address),
        component: InviteByEmail,
      });
    }

    if (setWhitelistedDomain && !whitelistedDomain) {
      const domain = getDomain(query);
      if (domain && checkedDomains[domain]) {
        results.push({
          id: 'whitelist-email-domain',
          result: domain,
          onClick: () => setWhitelistedDomain(domain),
          component: WhitelistEmailDomain,
        });
      }
    }

    // now add the actual search results
    results.push(
      ...filteredUsers.map((user) => ({
        id: user.id,
        result: user,
        onClick: () => inviteUser(user),
        component: UserResultItem,
      })),
    );

    return results;
  }, [query, retrievedUsers, members, whitelistedDomain]);

  const { activeIndex, onKeyDown } = useActiveIndex(results, (result) => result.onClick());

  return (
    <PopoverDialog align="left">
      <PopoverInfo>
        <TextInput
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          labelText="User name"
          value={query}
          onChange={setQuery}
          onKeyDown={onKeyDown}
          opaque
          placeholder="Search for a user"
          type="search"
        />
      </PopoverInfo>
      {!query && !!setWhitelistedDomain && !whitelistedDomain && (
        <PopoverInfo>
          <InfoDescription>You can also whitelist with @example.com</InfoDescription>
        </PopoverInfo>
      )}
      {query.length > 0 && status === 'loading' && (
        <PopoverActions>
          <Loader />
        </PopoverActions>
      )}
      {query.length > 0 && status === 'ready' && results.length === 0 && (
        <PopoverActions>
          <InfoDescription>
            Nothing found <Emoji name="sparkles" />
          </InfoDescription>
        </PopoverActions>
      )}
      {query.length > 0 && status === 'ready' && results.length > 0 && (
        <PopoverSection>
          <ResultsList scroll items={results}>
            {({ onClick, result, component: Component }, i) => (
              <ScrollResult active={i === activeIndex}>
                <Component active={i === activeIndex} result={result} onClick={onClick} />
              </ScrollResult>
            )}
          </ResultsList>
        </PopoverSection>
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
