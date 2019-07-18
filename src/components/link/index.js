import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink, withRouter } from 'react-router-dom';

import { getLink as getCollectionLink } from 'Models/collection';
import { getLink as getProjectLink } from 'Models/project';
import { getLink as getTeamLink } from 'Models/team';
import { getLink as getUserLink } from 'Models/user';
import { useGlobals } from 'State/globals';
import WrappingLink from './wrapping-link';
import TrackedExternalLink from './tracked-external-link';

export { WrappingLink, TrackedExternalLink };

const Link = withRouter(React.forwardRef(({ to, children, history, location, match, staticContext, ...props }, ref) => {
  const { origin, EXTERNAL_ROUTES } = useGlobals();
  if (typeof to === 'string') {
    const currentUrl = new URL(location.pathname + location.search + location.hash, origin);
    const targetUrl = new URL(to, currentUrl);
    if (targetUrl.origin !== currentUrl.origin || EXTERNAL_ROUTES.some((route) => targetUrl.pathname.startsWith(route))) {
      return (
        <a href={to} {...props} ref={ref}>
          {children}
        </a>
      );
    }

    to = {
      pathname: targetUrl.pathname,
      search: targetUrl.search,
      hash: targetUrl.hash,
    };
  }
  return (
    <RouterLink to={to} {...props} innerRef={ref}>
      {children}
    </RouterLink>
  );
}));
Link.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  children: PropTypes.node.isRequired,
};

export const CollectionLink = ({ collection, children, ...props }) => (
  <Link to={getCollectionLink(collection)} {...props} aria-label={collection.name}>
    {children}
  </Link>
);
CollectionLink.propTypes = {
  collection: PropTypes.oneOfType([
    PropTypes.shape({
      fullUrl: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      team: PropTypes.PropTypes.shape({
        url: PropTypes.string.isRequired,
      }).isRequired,
      url: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      user: PropTypes.PropTypes.shape({
        id: PropTypes.number.isRequired,
        login: PropTypes.string,
      }).isRequired,
      url: PropTypes.string.isRequired,
    }),
  ]).isRequired,
};

export const ProjectLink = ({ project, children, ...props }) => {
  if (project.suspendedReason) {
    return <span {...props}>{children}</span>;
  }
  return (
    <Link to={getProjectLink(project)} {...props}>
      {children}
    </Link>
  );
};
ProjectLink.propTypes = {
  project: PropTypes.shape({
    domain: PropTypes.string.isRequired,
  }).isRequired,
};

export const TeamLink = ({ team, children, ...props }) => (
  <Link to={getTeamLink(team)} {...props}>
    {children}
  </Link>
);
TeamLink.propTypes = {
  team: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export const UserLink = ({ user, children, ...props }) => (
  <Link to={getUserLink(user)} {...props}>
    {children}
  </Link>
);
UserLink.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
  }).isRequired,
};

export default Link;
