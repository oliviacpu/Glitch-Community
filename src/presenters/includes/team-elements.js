import React from 'react';
import PropTypes from 'prop-types';

import { debounce } from 'lodash';
import TooltipContainer from 'Components/tooltips/tooltip-container';
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

export const VerifiedBadge = () => {
  const image = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fverified.svg?1501783108220';
  const tooltip = 'Verified to be supportive, helpful people';

  return <TooltipContainer id="verified-team-tooltip" type="info" tooltip={tooltip} target={<img className="verified" src={image} alt="✓" />} />;
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
