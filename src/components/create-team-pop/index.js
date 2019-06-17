import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import TextInput from 'Components/inputs/text-input';
import Loader from 'Components/loader';
import { MultiPopoverTitle, PopoverDialog, PopoverSection, PopoverInfo, PopoverActions, InfoDescription } from 'Components/popover';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import { getPredicates, getTeamPair } from 'Models/words';
import { getLink } from 'Models/team';
import { useAPI } from 'State/api';
import { useTracker } from 'State/segment-analytics';

import styles from './styles.styl';

// Create Team 🌿

const CreateTeamSubmitButton = () => {
  const onClick = useTracker('Create Team submitted');
  return (
    <Button size="small" emoji="thumbsUp" onClick={onClick}>
      Create Team
    </Button>
  );
};

function CreateTeamPopBase(props) {
  const [state, setState] = useState({
    teamName: '',
    isLoading: false,
    error: '',
  });

  const validate = async (name) => {
    if (name) {
      const url = _.kebabCase(name);
      let error = null;

      try {
        const { data } = await props.api.get(`userId/byLogin/${url}`);
        if (data !== 'NOT FOUND') {
          error = 'Name in use, try another';
        }
      } catch (exception) {
        if (!(exception.response && exception.response.status === 404)) {
          throw exception;
        }
      }

      try {
        const { data } = await props.api.get(`teamId/byUrl/${url}`);
        if (data !== 'NOT FOUND') {
          error = 'Team already exists, try another';
        }
      } catch (exception) {
        if (!(exception.response && exception.response.status === 404)) {
          throw exception;
        }
      }

      if (error) {
        setState(({ teamName }) => (name === teamName ? { error } : {}));
      }
    }
  };

  const debouncedValidate = _.debounce(validate, 200);
  useEffect(() => {
    let isMounted = true;
    const getName = async () => {
      const teamName = await getTeamPair();
      setState({ teamName });
    };
    if (isMounted) {
      getName();
    }
    
    return () => isMounted = false;
  }, []);

  const handleChange = async (newValue) => {
    setState({
      teamName: newValue,
      error: '',
    });

    await debouncedValidate(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ isLoading: true });
    try {
      let description = 'A team that makes things';
      try {
        const predicates = await getPredicates();
        description = `A ${predicates[0]} team that makes ${predicates[1]} things`;
      } catch (error) {
        // Just use the plain description
      }
      const { data } = await props.api.post('teams', {
        name: state.teamName,
        url: _.kebabCase(state.teamName),
        hasAvatarImage: false,
        coverColor: '',
        location: '',
        description,
        backgroundColor: '',
        hasCoverImage: false,
        isVerified: false,
      });
      props.history.push(getLink(data));
    } catch (error) {
      const message = error && error.response && error.response.data && error.response.data.message;
      setState({
        isLoading: false,
        error: message || 'Something went wrong',
      });
    }
  };

  const placeholder = 'Your Team Name';

  return (
    <PopoverDialog align="right" className={styles.createTeamPop}>
      <PopoverSection>
        <MultiPopoverTitle>
          Create Team <Emoji name="herb" inTitle />
        </MultiPopoverTitle>
      </PopoverSection>

      <PopoverInfo>
        <InfoDescription>Showcase your projects in one place, manage collaborators, and view analytics</InfoDescription>
      </PopoverInfo>

      <PopoverActions>
        <form onSubmit={handleSubmit}>
          <TextInput autoFocus labelText={placeholder} value={state.teamName} onChange={handleChange} placeholder={placeholder} error={state.error} />
          <div className={styles.teamUrlPreview}>/@{_.kebabCase(state.teamName || placeholder)}</div>

          {state.isLoading ? <Loader /> : <CreateTeamSubmitButton />}
        </form>
      </PopoverActions>
      <PopoverInfo>
        <InfoDescription>You can change this later</InfoDescription>
      </PopoverInfo>
    </PopoverDialog>
  );
}

CreateTeamPopBase.propTypes = {
  api: PropTypes.any.isRequired,
};

const CreateTeamPop = withRouter((props) => {
  const api = useAPI();

  return <CreateTeamPopBase api={api} {...props} />;
});

export default CreateTeamPop;
