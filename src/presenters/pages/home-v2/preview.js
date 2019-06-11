import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import DataLoader from 'Components/data-loader';
import Button from 'Components/buttons/button';
import { useAPI } from 'State/api';

import Layout from '../../layout';
import { Home } from './index';
import styles from './styles.styl';

const PreviewBanner = withRouter(({ history, data }) => {
  const api = useAPI();
  const onPublish = async () => {
    try {
      await api.post(`${window.location.origin}/api/home`, data);
      history.push('/home-v2');
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className={styles.previewBanner}>
      <p>This is a live preview of your edits to the home page.</p>
      <Button type="cta" onClick={onPublish}>
        Publish
      </Button>
    </div>
  );
});

const HomePreview = () => (
  <Layout>
    <DataLoader get={() => axios.get('https://ablaze-peacock.glitch.me/home.json').then((res) => res.data)}>
      {(data) => (
        <>
          <PreviewBanner data={data} />
          <Home data={data} />
        </>
      )}
    </DataLoader>
  </Layout>
);

export default HomePreview;
