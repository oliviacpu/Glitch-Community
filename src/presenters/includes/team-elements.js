import React from 'react';
import PropTypes from 'prop-types';

import { debounce } from 'lodash';
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

export class WhitelistedDomainIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = { src: null };
  }

  componentDidMount() {
    this.load();
    this.load = debounce(this.load.bind(this), 250);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.domain !== this.props.domain) {
      // It can cause subtle bugs to use setState in componentDidUpdate, but maybe this is fine here?
      this.setState({ src: null }); // eslint-disable-line react/no-did-update-set-state
      this.load();
    }
  }

  componentWillUnmount() {
    this.load.cancel();
  }

  load() {
    this.setState({
      src: `https://favicon-fetcher.glitch.me/img/${this.props.domain}`,
    });
  }

  render() {
    const { domain } = this.props;
    if (this.state.src) {
      return <img className="whitelisted-domain" alt={domain} src={this.state.src} onError={() => this.setState({ src: null })} />;
    }
    return (
      <div className="whitelisted-domain" aria-label={domain}>
        {domain[0].toUpperCase()}
      </div>
    );
  }
}

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
