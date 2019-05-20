import React from 'react';
import PropTypes from 'prop-types';
import Text from 'Components/text/text';
import Link from 'Components/link';

export const TeamMarketing = () => {
  const forPlatformsIcon = 'https://cdn.glitch.com/be1ad2d2-68ab-404a-82f4-6d8e98d28d93%2Ffor-platforms-icon.svg?1506442305188';
  return (
    <section className="team-marketing">
      <Text>
        <img className="for-platforms-icon" src={forPlatformsIcon} alt="fishing emoji" />
        Want your own team page, complete with detailed app analytics?
      </Text>
      <Link to="/teams" className="button button-link has-emoji">
        About Teams <span className="emoji fishing_pole" role="img" aria-label="emoji" />
      </Link>
    </section>
  );
};

// temp
export const AdminOnlyBadge = ({ ...props }) => (
  <>
    {props.currentUserIsTeamAdmin === false && (
      <div className="status-badge">
        <span className="status admin">Admin</span>
      </div>
    )}
  </>
);

AdminOnlyBadge.propTypes = {
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
};
