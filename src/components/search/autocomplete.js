import React from 'react';
import classnames from 'classnames';
import MaskImage from 'Components/images/mask-image';
import { TeamAvatar, UserAvatar } from 'Components/images/avatar';
import { Link, TeamLink, UserLink, ProjectLink } from '../../presenters/includes/link';
import ProjectAvatar from '../../presenters/includes/project-avatar';
import CollectionAvatar from '../../presenters/includes/collection-avatar';
import styles from './autocomplete.styl';

const getContainerClass = ({ selected }) => classnames(styles.resultContainer, selected && styles.selected)

const StarterKitResult = ({ value: starterKit }) => (
  <a href={starterKit.url} className={getContainerClass(starterKit)}>
    <div className={styles.avatarContainer}>
      <MaskImage src={starterKit.imageURL} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{starterKit.name}</div>
      <div className={styles.infoSecondary}>{starterKit.description}</div>
    </div>
  </a>
);

const TeamResult = ({ value: team }) => (
  <TeamLink team={team} className={getContainerClass(team)}>
    <div className={styles.avatarContainer}>
      <TeamAvatar hideTooltip team={{ ...team, hasAvatarImage: true }} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{team.name}</div>
      <div className={styles.infoSecondary}>@{team.url}</div>
    </div>
  </TeamLink>
);

const UserResult = ({ value: user }) => (
  <UserLink user={user} className={getContainerClass(user)}>
    <div className={styles.avatarContainer}>
      <UserAvatar hideTooltip user={user} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{user.name}</div>
      <div className={styles.infoSecondary}>@{user.login}</div>
    </div>
  </UserLink>
);

const ProjectResult = ({ value: project }) => (
  <ProjectLink project={project} className={getContainerClass(project)}>
    <div className={styles.avatarContainer}>
      <ProjectAvatar {...project} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{project.domain}</div>
      <div className={styles.infoSecondary}>{project.description}</div>
    </div>
  </ProjectLink>
);

const CollectionLink = ({ collection, children, ...props }) => (
  <a href={`/@${collection.fullUrl}`} {...props}>
    {children}
  </a>
);

const CollectionResult = ({ value: collection }) => (
  <CollectionLink collection={collection} className={getContainerClass(collection)}>
    <div className={styles.avatarContainer}>
      <CollectionAvatar {...collection} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{collection.name}</div>
      <div className={styles.infoSecondary}>@{collection.fullUrl}</div>
    </div>
  </CollectionLink>
);

const SeeAllResults = ({ query }) => (
  <Link to={`/search?q=${query}`} className={styles.seeAllResults}>
    See all results →
  </Link>
);

const resultComponents = {
  starterKit: StarterKitResult,
  team: TeamResult,
  user: UserResult,
  project: ProjectResult,
  collection: CollectionResult,
};

const Result = ({ value }) => {
  const Component = resultComponents[value.type];
  if (!Component) return null;
  return <Component value={value} />;
};

const Autocomplete = ({ query, results }) => (
  <div className={styles.container}>
    <ul>
      {results.map(({ id, label, items }) => (
        <li key={id}>
          <header className={styles.resultGroupHeader}>{label}</header>
          <ul>
            {items.map((item) => (
              <li key={item.id} className={styles.resultItem}>
                <Result value={item} />
              </li>
            ))}
          </ul>
        </li>
      ))}
      <li>
        <SeeAllResults query={query} />
      </li>
    </ul>
  </div>
);

export default Autocomplete;
