import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Markdown from 'Components/text/markdown';
import TransparentButton from 'Components/buttons/transparent-button';
import Button from 'Components/buttons/button';
import { ProfileItem } from 'Components/profile-list';
import { ResultItem, ResultName, ResultDescription } from 'Components/results-list';
import VisibilityContainer from 'Components/visibility-container';
import { createAPIHook } from 'State/api';
import { getSingleItem } from 'Shared/api';

import CollectionAvatar from '../../presenters/includes/collection-avatar';
import styles from './collection-result-item.styl';

const useCurator = createAPIHook(async (api, collection) => {
  if (collection.userIDs.length) {
    const id = collection.userIDs[0];
    const user = await getSingleItem(api, `/v1/users/by/id?id=${id}`, id);
    return { user };
  }
  if (collection.teamIDs.length) {
    const id = collection.teamIDs[0];
    const team = await getSingleItem(api, `/v1/teams/by/id?id=${id}`, id);
    return { team };
  }
  return {};
});

const ProfileItemWithData = ({ collection }) => {
  const { value: curator } = useCurator(collection);
  return <ProfileItem {...curator} size="small" />;
};

const ProfileItemWrap = ({ project }) => (
  <div className={styles.profileItemWrap}>
    <VisibilityContainer>
      {({ wasEverVisible }) => (
        wasEverVisible ? <ProfileItemWithData project={project} /> : <ProfileItem size="small" />
      )}
    </VisibilityContainer>
  </div>
);


const CollectionResultItem = ({ onClick, collection, active }) => (
  <ResultItem
    active={styles.active}
    href={href={`/@${collection.fullUrl}`}}
    label={`Add to collection: ${collection.name} by ${collection.team ? collection.team.name : collection.user.name}, collection description: ${collection.description}`}
    >
    <div className={styles.avatarWrap}>
      <CollectionAvatar color={collection.coverColor} />
    </div>
    
  </ResultItem>
  
  
  <div 
    className={classnames(styles.collectionResult, active && styles.active)}
    aria-label=
  >
    <TransparentButton onClick={onClick}>
      <div className={styles.resultWrap}>
        
        <div className={styles.resultInfo}>
          <div className={styles.resultName}>{collection.name}</div>
          {collection.description.length > 0 && (
            <div className={styles.resultDescription}>
              <Markdown renderAsPlaintext>{collection.description}</Markdown>
            </div>
          )}
          <div className={styles.profileListWrap}>
            <ProfileItem team={collection.team} user={collection.user} size="small" />
          </div>
        </div>
      </div>
    </TransparentButton>
    <div className={styles.linkButtonWrap}>
      <Button size="small" href={`/@${collection.fullUrl}`} newTab>
        View →
      </Button>
    </div>
  </div>
);

CollectionResultItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  active: PropTypes.bool,
};

CollectionResultItem.defaultProps = {
  active: false,
};

export default CollectionResultItem;
