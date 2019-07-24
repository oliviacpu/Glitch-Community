import React from 'react';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';

import PreviewContainer from 'Components/containers/preview-container';
import Link from 'Components/link';

import { useAPI } from 'State/api';
import { useGlobals } from 'State/globals';

import { NewStuffOverlay } from 'Components/new-stuff';

const PupdatesPreview = withRouter(({ history }) => {
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
    <main>
      <Helmet title="Glitch Pupdates Previewer" />
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
    </main>
  );
});

export default PupdatesPreview;
