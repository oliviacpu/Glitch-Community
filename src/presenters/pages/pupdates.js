import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';


import { Overlay, OverlaySection, OverlayTitle, OverlayBackground } from 'Components/overlays';
import CheckboxButton from 'Components/buttons/checkbox-button';
import Button from 'Components/buttons/button';
import PreviewContainer from 'Components/containers/preview-container';
import Link from 'Components/link';
import { PopoverContainer } from 'Components/popover';

import { useAPI } from 'State/api';
import { useGlobals } from 'State/globals';
import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import useUserPref from 'State/user-prefs';

import pupdates from '../../curated/pupdates.json';
import NewStuffArticle from './new-stuff-article';
import NewStuffPrompt from './new-stuff-prompt';
import NewStuffPup from './new-stuff-pup';
import styles from './styles.styl';


export const PupdatesPreview = withRouter(({ history }) => {
  const api = useAPI();
  const { origin } = useGlobals();
  const onPublish = async (data) => {
    try {
      await api.post(`${origin}/api/home`, data);
      history.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    
    <PreviewContainer
      get={() => api.get('https://buttercup-room.glitch.me/pupdate.json').then((res) => res.data)}
      onPublish={onPublish}
      previewMessage={
        <>
          This is a live preview of edits done with the <Link to="https://buttercup-room.glitch.me">Pupdates Editor.</Link>
        </>
      }
    >
      {(data) => <NewStuffOverlay showNewStuff setShowNewStuff={null} newStuff={data} closePopover={null} />}
    </PreviewContainer>
  );
});











return (
    <main className={styles.secretPage}>
      <Helmet title="Glitch - It's a secret to everybody." />
      <VisuallyHidden as={Heading} tagName="h1">Glitch - It's a secret to everybody</VisuallyHidden>
      <ul>
        {toggleData.map(({ name, description }) => (
          <li key={name} className={isEnabled(name) ? styles.lit : ''}>
            <Button title={description} ariaPressed={isEnabled(name) ? 'true' : 'false'} onClick={() => toggleTheToggle(name)}>
              {name}
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );