import React, { useState } from 'react';
import classnames from 'classnames';
import Pluralize from 'react-pluralize';
import { withRouter } from 'react-router-dom';

import Button from 'Components/buttons/button';
import TransparentButton from 'Components/buttons/transparent-button';
import Row from 'Components/containers/row';
import ProfileList from 'Components/profile-list';
import Embed from 'Components/project/embed';
import MaskImage from 'Components/images/mask-image';
import Markdown from 'Components/text/markdown';
import Text from 'Components/text/text';
import Questions from 'Components/questions';
import RecentProjects from 'Components/recent-projects';
import ReportButton from 'Components/report-abuse-pop';
import Layout from 'Components/layout';
import Mark from 'Components/mark';
import PreviewContainer from 'Components/containers/preview-container';
import { useCurrentUser } from 'State/current-user';
import { getEditorUrl, getAvatarUrl } from 'Models/project';
import { useAPI } from 'State/api';

import Banner from './banner';
import CuratedCollectionContainer from './collection-container';
import { Discover, Dreams, Teams } from './feature-callouts';
import compiledData from '../../../curated/home.json';
import styles from './styles.styl';

const Arrow = () => <span aria-hidden="true">→</span>;

const calloutImages = {
  apps: () => <Discover />,
  create: () => <Dreams />,
  teams: () => <Teams />,
};

const FeatureCallouts = ({ content }) => (
  <section id="feature-callouts" className={styles.featureCalloutsContainer}>
    <Row items={content} className={styles.featureCalloutsRow} minWidth="175px">
      {({ label, description, backgroundSrc, href, color, id }) => (
        <>
          <header className={styles.featureCalloutsHeader}>
            <a href={href} style={{ backgroundImage: `url('${backgroundSrc}')` }} className={styles.featureCalloutsImage}>
              {calloutImages[id]()}
            </a>
            <h2 className={styles.featureCalloutsTitle}>
              <Mark color={color}>{label}</Mark>
            </h2>
          </header>
          <p>{description}</p>
        </>
      )}
    </Row>
  </section>
);

const TopPicks = ({ children }) => (
  <section id="top-picks">
    <h2 className={styles.h2}>
      <Mark color="#BCFCFF">Today's top picks</Mark>
    </h2>
    <p className={styles.subtitle}>Apps you’ll only find here on Glitch, built by our community of creators.</p>
    {children}
  </section>
);

const AppsWeLove = ({ content }) => {
  const [featuredDomain, setFeaturedDomain] = useState(content[0].domain);

  return (
    <section id="apps-we-love" className={styles.appsWeLoveContainer}>
      <div className={styles.appsWeLoveSmallLayout}>
        {content.map(({ id, title, description, domain }) => (
          <a key={id} href={`/~${domain}`} className={classnames(styles.plainLink, styles.appItem)}>
            <img src={getAvatarUrl(id)} alt="" className={styles.appAvatar} />
            <div className={styles.appContent}>
              <h4 className={styles.h4}>{title}</h4>
              <p>{description}</p>
            </div>
          </a>
        ))}
      </div>
      <div className={styles.appsWeLoveBigLayout}>
        <ul className={styles.appsWeLoveList}>
          {content.map(({ id, title, description, domain, users }) => (
            <li key={id} className={classnames(styles.appItemWrap, featuredDomain === domain && styles.active)}>
              <TransparentButton onClick={() => setFeaturedDomain(domain)} className={styles.appItem}>
                <img src={getAvatarUrl(id)} alt="" className={styles.appAvatar} />
                <span className={styles.appContent}>
                  <span className={styles.profileListPlaceholder} />
                  <h4 className={styles.h4}>{title}</h4>
                  <p>{description}</p>
                </span>
              </TransparentButton>
              <div className={styles.appsWeLoveProfileWrap}>
                <div className={styles.appsWeLoveProfile}>
                  <ProfileList layout="row" users={users} />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.appsWeLoveEmbed}>
          <Embed domain={featuredDomain} />
        </div>
      </div>
    </section>
  );
};

const CuratedCollections = ({ content }) => (
  <section id="curated-collections" className={styles.curatedCollectionsContainer}>
    <h3 className={styles.h3}>Curated collections</h3>
    <Row items={content.map((data) => ({ ...data, id: data.fullUrl }))} className={styles.curatedCollectionRow}>
      {({ title, description, fullUrl, users, count, collectionStyle }) => (
        <CuratedCollectionContainer collectionStyle={collectionStyle} users={users} href={`/@${fullUrl}`}>
          <h4 className={styles.h4}>{title}</h4>
          <p>{description}</p>
          <Button decorative>
            View <Pluralize count={count} singular="project" /> <Arrow />
          </Button>
        </CuratedCollectionContainer>
      )}
    </Row>
  </section>
);

const UnifiedStories = ({ content: { hed, dek, featuredImage, featuredImageDescription, summary, href, cta, relatedContent } }) => (
  <section id="unified-stories" className={styles.unifiedStories}>
    <div className={styles.unifiedStoriesContainer}>
      <div className={styles.unifiedStoriesHeadline}>
        {hed
          .trim()
          .split('\n')
          .map((line, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <h2 key={i}>
              <Mark color="white">{line}</Mark>
            </h2>
          ))}
        <img src={featuredImage} alt={featuredImageDescription} />
      </div>
      <div className={styles.unifiedStoriesPreview}>
        <div className={styles.unifiedStoriesFeatureLabel}>Feature</div>
        <h3 className={styles.h3}>{dek}</h3>
        <Markdown>{summary}</Markdown>
        <Button href={href}>
          {cta} <Arrow />
        </Button>
      </div>
      <div className={styles.unifiedStoriesRelatedContent}>
        <h3>Stories</h3>
        <ul>
          {relatedContent.map((related) => (
            <li key={related.href}>
              <a href={related.href} className={styles.plainLink}>
                <h4>{related.title}</h4>
                <p>{related.source}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

const CultureZine = ({ content }) => (
  <section id="culture-zine" className={styles.cultureZine}>
    <div className={styles.cultureZineContainer}>
      <h2 className={styles.h2}>
        <Mark color="#CBC3FF">Where tech meets culture</Mark>
      </h2>
      <p className={styles.subtitle}>Code is shaping the world around us. We’ll help you understand where it’s going.</p>
      <Row count={2} items={[{ id: 0, content: content.slice(0, 2) }, { id: 1, content: content.slice(2, 4) }]}>
        {({ content: cultureZineItems }) => (
          <Row items={cultureZineItems} count={2} className={styles.cultureZineRow}>
            {({ title, primary_tag: source, feature_image: img, url }) => (
              <a href={`/culture${url}`} className={styles.plainLink}>
                <div className={styles.cultureZineImageWrap}>
                  <MaskImage src={img} />
                </div>
                <div className={styles.cultureZineText}>
                  <h4 className={styles.h4}>{title}</h4>
                  {source && <p>{source.name}</p>}
                </div>
              </a>
            )}
          </Row>
        )}
      </Row>
    </div>
  </section>
);

const BuildingOnGlitch = ({ content }) => (
  <section id="building-on-glitch" className={styles.buildingOnGlitch}>
    <h2 className={styles.h2}>
      <Mark color="#FCF3B0">Start building on Glitch</Mark>
    </h2>
    <div className={styles.buildingOnGlitchRow}>
      {content.map(({ href, img, title, description, cta }) => (
        <a key={href} href={href} className={styles.plainLink}>
          <img src={img} alt="" />
          <h3>{title}</h3>
          <p>{description}</p>
          <Button decorative>
            {cta} <Arrow />
          </Button>
        </a>
      ))}
    </div>
  </section>
);

const MadeInGlitch = () => (
  <section className="made-in-glitch">
    <Text>Of course, this site was made on Glitch too</Text>
    <Button href={getEditorUrl('community')} emoji="carpStreamer">
      View Source
    </Button>
  </section>
);

// loggedIn and hasProjects are passed as props instead of pulled from context
// because we want the preview to show what an anonymous user would see
export const Home = ({ data, loggedIn, hasProjects }) => (
  <div className={styles.homeContainer}>
    {!loggedIn && <Banner />}
    {!loggedIn && <FeatureCallouts content={data.featureCallouts} />}
    {hasProjects && <RecentProjects />}
    {loggedIn && <Questions />}
    <UnifiedStories content={data.unifiedStories} />
    <TopPicks>
      <AppsWeLove content={data.appsWeLove} />
      <CuratedCollections content={data.curatedCollections} />
    </TopPicks>
    <CultureZine content={data.cultureZine} />
    <BuildingOnGlitch content={data.buildingOnGlitch} />
    <MadeInGlitch />
    <ReportButton reportedType="home" />
  </div>
);

export const HomePreview = withRouter(({ history }) => {
  const api = useAPI();
  const onPublish = async (data) => {
    try {
      await api.post(`${window.location.origin}/api/home`, data);
      history.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout>
      <PreviewContainer
        get={() => api.get('https://community-home-editor.glitch.me/home.json').then((res) => res.data)}
        onPublish={onPublish}
        previewMessage={
          <>
            This is a live preview of edits done with <a href="https://community-home-editor.glitch.me">Community Home Editor.</a>
          </>
        }
      >
        {(data) => <Home data={{ ...data, cultureZine: window.ZINE_POSTS.slice(0, 4) }} />}
      </PreviewContainer>
    </Layout>
  );
});

const HomeWithProductionData = () => {
  const { currentUser } = useCurrentUser();
  return (
    <Layout>
      <Home
        data={{ ...compiledData, cultureZine: window.ZINE_POSTS.slice(0, 4) }}
        loggedIn={!!currentUser.login}
        hasProjects={currentUser.projects.length > 0}
      />
    </Layout>
  );
};
export default HomeWithProductionData;
