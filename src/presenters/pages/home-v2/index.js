import React from 'react';
import Pluralize from 'react-pluralize';

import Button from 'Components/buttons/button';
import Row from 'Components/containers/row';
import ProfileList from 'Components/profile-list';
import Embed from 'Components/project/embed';
import MaskImage from 'Components/images/mask-image';
import Markdown from 'Components/text/markdown';
import Link from 'Components/link';
import Text from 'Components/text/text';
import Questions from 'Components/questions';
import RecentProjects from 'Components/recent-projects';
import ReportButton from 'Components/report-abuse-pop';
import Layout from 'Components/layout';
import { useCurrentUser } from 'State/current-user';

import { getEditorUrl } from 'Models/project';

import CuratedCollectionContainer from './collection-container';
import { Discover, Dreams, Teams } from './feature-callouts';
import compiledData from '../../../curated/home.json';
import styles from './styles.styl';

const Arrow = () => <span aria-hidden="true">→</span>;

const Video = ({ className, src, poster })) => {
  const [playing, setPlaying] = useState(false);
  return (
    <video>
      <source></source>
    </video>
  )
} 

const BannerVideo = () => (
  <div className={styles.bannerVideoWrap}>
    <div className={styles.bannerVideoChrome}>
      <div className={styles.bannerVideoInnerWrap}>
        <Video
          className={styles.bannerVideo}
          poster="https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fjenn_poster_small.jpg?v=1561584125641"
          src="https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fhomepage_v4.mp4?v=1561583730313"
        >
      </div>
    </div>
  </div>
);

const Mark = ({ color, children }) => (
  <span className={styles.mark} style={{ '--mark-color': color }}>
    <span className={styles.markText}>{children}</span>
  </span>
);

const Unmarked = ({ children }) => <span className={styles.unmarked}>{children}</span>;

const Banner = () => (
  <header id="banner" className={styles.banner}>
    <div className={styles.bannerCopyContainer}>
      <div className={styles.bannerCopy}>
        <h1>
          <Unmarked>Glitch is the</Unmarked>
          <br />
          <Mark color="#1D9AF9">friendly community</Mark>
          <br />
          <Unmarked>where everyone can</Unmarked>
          <br />
          <Mark color="#18B576">create the web</Mark>
        </h1>
        <p>Discover, build, and share millions of apps and websites — for free</p>
        <div className={styles.bannerBtnWrap}>
          <Button type="cta" href="#top-picks">
            Start Creating <Arrow />
          </Button>
          <div className={styles.watchVideoBtnWrap}>
            <Button decorative>Watch video</Button>
          </div>
        </div>
      </div>
    </div>
    <BannerVideo />
  </header>
);

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
          <a href={href}  style={{ backgroundImage: `url('${backgroundSrc}')` }} className={styles.featureCalloutsImageWrap}>
            {calloutImages[id]()}
          </a>
          <div className={styles.featureCalloutsText}>
            <h2>
              <Mark color={color}>{label}</Mark>
            </h2>
            <p>{description}</p>
          </div>
        </>
      )}
    </Row>
  </section>
);

const UnifiedStories = ({ content: { hed, dek, featuredImage, featuredImageDescription, summary, href, cta, relatedContent } }) => (
  <section id="unified-stories" className={styles.unifiedStories}>
    <div className={styles.unifiedStoriesHeadline}>
      <div className={styles.unifiedStoriesFeatureLabel}>Feature</div>
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
      <h3 className={styles.h3}>{dek}</h3>
      <Markdown>{summary}</Markdown>
      <Button href={href}>
        {cta} <Arrow />
      </Button>
    </div>
    <div className={styles.unifiedStoriesRelatedContent}>
      <h3>Featuring</h3>
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

const FeaturedEmbed = ({ content: { domain, title, description, href, image } }) => (
  <figure className={styles.featuredEmbed}>
    <a href={href} className={styles.plainLink}>
      <img className={styles.featuredEmbedImg} src={image} alt="" />
    </a>
    <figcaption className={styles.featuredEmbedCaption}>
      <div className={styles.featuredEmbedText}>
        <h3 className={styles.h3}>{title}</h3>
        <Markdown>{description}</Markdown>
      </div>
    </figcaption>
    <div className={styles.featuredEmbedWrap}>
      <Embed domain={domain} />
    </div>
  </figure>
);

const AppsWeLove = ({ content }) => (
  <section id="apps-we-love" className={styles.appsWeLoveContainer}>
    <h3 className={styles.h3}>Apps we love</h3>
    <Row items={content.map((data) => ({ ...data, id: data.domain }))} className={styles.appsWeLoveRow} minWidth="235px">
      {({ domain, title, description, img, users }) => (
        <>
          <div className={styles.appsWeLoveProfile}>
            <ProfileList layout="row" users={users} />
          </div>
          <a href={`https://${domain}.glitch.me`} className={styles.plainLink}>
            <MaskImage maskClass="speechBubble" src={img} alt="" />
            <h4 className={styles.h4}>{title}</h4>

            <p>{description}</p>
          </a>
        </>
      )}
    </Row>
  </section>
);

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

const CultureZine = ({ content }) => (
  <section id="culture-zine" className={styles.cultureZine}>
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
    <Link to={getEditorUrl('community')} className="button button-link has-emoji">
      View Source <span className="emoji carp_streamer" />
    </Link>
  </section>
);

// loggedIn and hasProjects are passed as props instead of pulled from context
// because we want the preview to show what an anonymous user would see
export const Home = ({ data, loggedIn, hasProjects }) => (
  <>
    {!loggedIn && <Banner />}
    {!loggedIn && <FeatureCallouts content={data.featureCallouts} />}
    {hasProjects && <RecentProjects />}
    {loggedIn && <Questions />}
    <UnifiedStories content={data.unifiedStories} />
    <TopPicks>
      <FeaturedEmbed content={data.featuredEmbed} />
      <AppsWeLove content={data.appsWeLove} />
      <CuratedCollections content={data.curatedCollections} />
    </TopPicks>
    <CultureZine content={window.ZINE_POSTS.slice(0, 4)} />
    <BuildingOnGlitch content={data.buildingOnGlitch} />
    <MadeInGlitch />
    <ReportButton reportedType="home" />
  </>
);

const HomeWithProductionData = () => {
  const { currentUser } = useCurrentUser();
  return (
    <Layout>
      <Home data={compiledData} loggedIn={!!currentUser.login} hasProjects={currentUser.projects.length > 0} />
    </Layout>
  );
};
export default HomeWithProductionData;
