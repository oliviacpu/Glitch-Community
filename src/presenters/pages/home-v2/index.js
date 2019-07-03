import React, { useState } from 'react';
import classnames from 'classnames';
import Pluralize from 'react-pluralize';
import { withRouter } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Button from 'Components/buttons/button';
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
import DataLoader from 'Components/data-loader';
import Arrow from 'Components/arrow';
import { useCurrentUser } from 'State/current-user';
import { getEditorUrl, getAvatarUrl } from 'Models/project';
import { useAPI } from 'State/api';

import Banner from './banner';
import CuratedCollectionContainer from './collection-container';
import { Discover, Dreams, Teams } from './feature-callouts';
import styles from './styles.styl';

const calloutGraphics = {
  apps: {
    component: Discover,
    color: 'yellow',
  },
  create: {
    component: Dreams,
    color: 'pink',
  },
  teams: {
    component: Teams,
    color: 'aquamarine',
  }
}

const FeatureCallouts = ({ content }) => (
  <section id="feature-callouts" className={styles.featureCalloutsContainer}>
    <Row items={content} className={styles.featureCalloutsRow} minWidth="175px">
      {({ label, description, backgroundSrc, href, id }) => (
        <>
          <header className={styles.featureCalloutsHeader}>
            <a href={href} style={{ backgroundImage: `url('${backgroundSrc}')` }} className={styles.featureCalloutsImage}>
              {React.createElement(calloutGraphics[id].component)}
            </a>
            <h2 className={styles.featureCalloutsTitle}>
              <Mark color={calloutGraphics[id].color}>{label}</Mark>
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
      <Mark color="#BCFCFF">Fresh apps</Mark>
    </h2>
    <p className={styles.subtitle}>The latest and greatest projects on Glitch, built by our community of creators.</p>
    {children}
  </section>
);

const AppsWeLove = ({ content }) => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <section id="apps-we-love" className={styles.appsWeLoveContainer}>
      <div className={styles.appsWeLoveSmallLayout}>
        {content.map(({ id, title, description, domain }) => (
          <a key={id} href={`/~${domain}`} className={classnames(styles.plainLink, styles.appItemMini)}>
            <img src={getAvatarUrl(id)} alt="" className={styles.appAvatar} />
            <div className={styles.appContent}>
              <h4 className={styles.h4}>{title}</h4>
              <p>{description}</p>
            </div>
          </a>
        ))}
      </div>
      <Tabs forceRenderTabPanel selectedIndex={currentTab} onSelect={(index) => setCurrentTab(index)} className={styles.appsWeLoveBigLayout}>
        <TabList className={styles.appsWeLoveList}>
          {content.map(({ id, domain, title, description, users }, i) => (
            <Tab key={domain} className={styles.appsWeLoveListItem}>
              <div className={styles.appsWeLoveProfileWrap}>
                <div className={styles.appsWeLoveProfile}>
                  <ProfileList layout="row" users={users} />
                </div>
              </div>
              <div className={classnames(styles.appItem, i === currentTab && styles.active)}>
                <span className={styles.appContent}>
                  <h4 className={styles.h4}>{title}</h4>
                  <p>{description}</p>
                </span>
                <img src={getAvatarUrl(id)} alt="" className={styles.appAvatar} />
              </div>
            </Tab>
          ))}
        </TabList>
        {content.map(({ domain }, i) => (
          <TabPanel key={domain} className={styles.appsWeLoveEmbed} hidden={currentTab !== i}>
            <Embed domain={domain} />
          </TabPanel>
        ))}
      </Tabs>
    </section>
  );
};

const collectionStyles = ['wavey', 'diagonal', 'triangle'];

const CuratedCollections = ({ content }) => (
  <section id="curated-collections" className={styles.curatedCollectionsContainer}>
    <h3 className={styles.h3}>Curated collections</h3>
    <Row items={content.map((data) => ({ ...data, id: data.fullUrl }))} className={styles.curatedCollectionRow}>
      {({ title, description, fullUrl, users, count }, i) => (
        <CuratedCollectionContainer collectionStyle={collectionStyles[i]} users={users} href={`/@${fullUrl}`}>
          <h4 className={styles.h4}>{title}</h4>
          <p>{description}</p>
          <span className={styles.curatedCollectionButtonWrap}>
            <Button decorative>
              View <Pluralize count={count} singular="Project" /> <Arrow />
            </Button>
          </span>
        </CuratedCollectionContainer>
      )}
    </Row>
  </section>
);

const UnifiedStories = ({ content: { hed, dek, featuredImage, featuredImageDescription, summary, href, cta, relatedContent } }) => (
  <section id="unified-stories" className={styles.unifiedStories}>
    <div className={styles.unifiedStoriesContainer}>
      <div className={styles.unifiedStoriesHeadline}>
        <div className={styles.unifiedStoriesContentWrap}>
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
      </div>
      <div className={styles.unifiedStoriesPreview}>
        <div className={styles.unifiedStoriesContentWrap}>
          <h3 className={styles.h3}>{dek}</h3>
          <Markdown>{summary}</Markdown>
          <Button href={href}>
            {cta} <Arrow />
          </Button>
        </div>
      </div>
      <div className={styles.unifiedStoriesRelatedContent}>
        <div className={styles.unifiedStoriesContentWrap}>
          <h3>Related</h3>
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
    </div>
  </section>
);

const CultureZine = ({ content }) => (
  <section id="culture-zine" className={styles.cultureZine}>
    <div className={styles.cultureZineContainer}>
      <h2 className={styles.h2}>
        <Mark color="#CBC3FF">Where tech meets culture</Mark>
      </h2>
      <p className={styles.subtitle}>
        Code is shaping the world around us. We’ll help you understand where it’s going.
      </p>
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
      <div className={styles.readMoreLink}>
        <Button href="https://glitch.com/culture/">
          Read More on Culture <Arrow />
        </Button>
      </div>
    </div>
  </section>
);

const buildingImageMasks = [
  'https://cdn.glitch.com/c258d08b-9412-4115-816c-30444c24e1eb%2Fdevelopers-mask.svg?v=1561647984894',
  'https://cdn.glitch.com/c258d08b-9412-4115-816c-30444c24e1eb%2Fteams-mask.svg?v=1561647985925',
];

const BuildingOnGlitch = ({ content }) => (
  <section id="building-on-glitch" className={styles.buildingOnGlitch}>
    <h2 className={styles.h2}>
      <Mark color="#FCF3B0">Start building on Glitch</Mark>
    </h2>
    <div className={styles.buildingOnGlitchRow}>
      {content.map(({ href, img, title, description, cta }, index) => (
        <a key={href} href={href} className={styles.plainLink}>
          <div className={styles.startBuildingImageWrap} style={{ backgroundImage: `url(${buildingImageMasks[index]})` }}>
            <img src={img} alt="" />
          </div>
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
    <Text>Of course, this site was made on Glitch too.</Text>
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
    <DataLoader get={(api) => api.get(`${window.location.origin}/api/home`)} renderLoader={() => null}>
      {({ data }) => (
        <Layout>
          <Home
            data={{ ...data, cultureZine: window.ZINE_POSTS.slice(0, 4) }}
            loggedIn={!!currentUser.login}
            hasProjects={currentUser.projects.length > 0}
          />
        </Layout>
      )}
    </DataLoader>
  );
};
export default HomeWithProductionData;
