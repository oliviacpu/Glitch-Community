import React from 'react';
import PropTypes from 'prop-types';
import { getAvatarUrl } from 'Models/project';
import Button from 'Components/buttons/button';

const TrackedButton = ({ label, onClick }) => {
  const trackedOnClick = useTrackedFunc(onClick, label);
  return (
    <Button size="small" type="tertiary" onClick={trackedOnClick}>
      {label}
    </Button>
  );
};

const TrackedButtonGroup = ({ items }) => (
  <>
    {Object.entries(items)
      .filter(([, onClick]) => onClick)
      .map(([label, onClick]) => (
        <TrackedButton key={label} label={label} onClick={onClick} />
      ))}
  </>
);

const ProfileContainer = ({ item, type, children, avatarActions, coverActions, teams }) => (
  <CoverContainer type={type} item={item} buttons={<TrackedButtonGroup items={coverActions} />}>
    <div className={styles.profileWrap}>
      <div className={styles.avatarContainer}>
        <div className={classnames(styles.avatar, styles[type])} style={getStyle[type](item)} />
        <div className={styles.avatarButtons}>
          <TrackedButtonGroup items={avatarActions} />
        </div>
      </div>
      <div className={styles.profileInfo}>{children}</div>
    </div>
    {!!teams && !!teams.length && (
      <div className={styles.teamsContainer}>
        <ProfileList layout="block" teams={teams} />
      </div>
    )}
  </CoverContainer>
);


const ProjectProfileContainer = ({ project, children, avatarActions }) => (
  <div className={styles.profileWrap}>
    <div className={styles.avatarContainer}>
      <div className={classnames(styles.avatar, styles[type])} style={{ backgroundImage: `url('${getAvatarUrl(project.id)}')` }} />
      <div className={styles.avatarButtons}>
          <TrackedButtonGroup items={avatarActions} />
        </div>
    </div>
    <div className={styles.profileInfo}>{children}</div>
  </div>
);
ProjectProfileContainer.propTypes = {
  style: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  buttons: PropTypes.element,
};
ProjectProfileContainer.defaultProps = {
  buttons: null,
};

export default ProjectProfileContainer;