import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { getOwnerLink } from 'Models/collection';
import Button from 'Components/buttons/button';
import Image from 'Components/images/image';
import Loader from 'Components/loader';
import { PopoverDialog, PopoverActions, PopoverTitle, ActionDescription, PopoverWithButton } from 'Components/popover';
import { deleteCollection } from 'State/collection';
import { useNotifications } from 'State/notifications';
import { useAPI } from 'State/api';

const DeleteCollectionPop = withRouter(({ history, collection }) => {
  const api = useAPI();
  const { createNotification } = useNotifications();
  const [collectionIsDeleting, setCollectionIsDeleting] = useState(false);
  const illustration = 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fdelete-team.svg?1531267699621';

  async function deleteThisCollection() {
    if (collectionIsDeleting) return;
    setCollectionIsDeleting(true);
    console.log(collectionIsDeleting);
    try {
      console.log('try');
      deleteCollection(api, collection);
      history.push(getOwnerLink(collection));
    } catch (error) {
      console.log('catch');
      createNotification('Something went wrong, try refreshing?', { type: 'error' });
      setCollectionIsDeleting(false);
    }
  }

  return (
    <PopoverDialog focusOnDialog align="left">
      <PopoverTitle>Delete {collection.name}</PopoverTitle>
      <PopoverActions>
        <Image height="98px" width="auto" src={illustration} alt="" />
        <ActionDescription>
          Deleting {collection.name} will remove this collection. No projects will be deleted
        </ActionDescription>
      </PopoverActions>
      <PopoverActions type="dangerZone">
        <Button size="small" type="dangerZone" emoji="bomb" onClick={deleteThisCollection}>
          Delete {collection.name}
          {collectionIsDeleting && <Loader />}
        </Button>
      </PopoverActions>
    </PopoverDialog>
  );
});

const DeleteCollection = ({ collection }) => (
  <PopoverWithButton buttonProps={{ size: 'small', type: 'dangerZone', emoji: 'bomb' }} buttonText={`Delete ${collection.name}`}>
    {() => <DeleteCollectionPop collection={collection} />}
  </PopoverWithButton>
);

DeleteCollection.propTypes = {
  collection: PropTypes.shape({
    team: PropTypes.object,
    user: PropTypes.object,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default DeleteCollection;
