import React from 'react';
import Pluralize from 'react-pluralize';

import Button from 'Components/buttons/button';
import Row from 'Components/containers/row';
import ProfileList from 'Components/profile-list';
import Embed from 'Components/project/embed';
import MaskImage from 'Components/images/mask-image';

import Layout from '../../layout';
import CuratedCollectionContainer from './collection-container';
import compiledData from '../../../curated/home.json';
import styles from './styles.styl';

const Arrow = () => <span aria-hidden="true">→</span>;

const BannerVideo = () => (
  <div className={styles.bannerVideoWrap}>
    <div className={styles.bannerVideoChrome}>
      <div className={styles.bannerVideoInnerWrap}>
        <div className={styles.bannerVideo} />
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
    <div className={styles.bannerCopy}>
      <h1>
        <Unmarked>Glitch is the</Unmarked>
        <br />
        <Mark color="blue">friendly community</Mark>
        <br />
        <Unmarked>where anyone can</Unmarked>
        <br />
        <Mark color="green">create the web</Mark>
      </h1>
      <p>The easiest way to build, ship, and share apps on the web, for free.</p>
      <Button type="cta" href="#top-picks">
        Check out fresh apps <Arrow />
      </Button>
    </div>
    <BannerVideo />
  </header>
);

const FeatureCallouts = ({ content }) => (
  <section id="feature-callouts" className={styles.featureCalloutsContainer}>
    <Row items={content} className={styles.featureCalloutsRow}>
      {({ label, description, cta, imgSrc, backgroundSrc, href, color }) => (
        <a href={href} className={styles.plainLink}>
          <div style={{ backgroundImage: `url('${backgroundSrc}')` }} className={styles.featureCalloutsImageWrap}>
            <img src={imgSrc} alt="" className={styles.featureCalloutsImage} />
          </div>
          <div className={styles.featureCalloutsText}>
            <h2>
              <Mark color={color}>{label}</Mark>
            </h2>
            <p>{description}</p>
            <Button decorative>
              {cta} <Arrow />
            </Button>
          </div>
        </a>
      )}
    </Row>
  </section>
);

const UnifiedStories = ({ content: { hed, dek, featuredImage, featuredImageDescription, summary, href, cta, relatedContent } }) => (
  <section id="unified-stories" className={styles.unifiedStories}>
    <div className={styles.unifiedStoriesHeadline}>
      <div className={styles.unifiedStoriesFeatureLabel}>Feature</div>
      {hed.trim().split('\n').map((line, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <h2 key={i}>
          <Mark color="white">{line}</Mark>
        </h2>
      ))}
      <img src={featuredImage} alt={featuredImageDescription} />
    </div>
    <div className={styles.unifiedStoriesPreview}>
      <h3>{dek}</h3>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: summary }} />
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
      <Mark color="turquoise">Our top picks</Mark>
    </h2>
    <p>Apps you’ll only find here on Glitch, built by our community of creators.</p>
    {children}
  </section>
);

const FeaturedEmbed = ({ content: { domain, title, description, users, href } }) => (
  <figure className={styles.featuredEmbed}>
    <div className={styles.featuredEmbedWrap}>
      <Embed domain={domain} />
    </div>
    <figcaption className={styles.featuredEmbedCaption}>
      <div className={styles.featuredEmbedText}>
        <h3>
          <a href={href} className={styles.plainLink}>
            {title}
          </a>
        </h3>
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>
      {/* users are included in the embed now, we don't need them in this block */}
    </figcaption>
  </figure>
);

const AppsWeLove = ({ content }) => (
  <section id="apps-we-love" className={styles.appsWeLoveContainer}>
    <h3 className={styles.h3}>
      <Mark color="salmon">Apps we love</Mark>
    </h3>
    <Row items={content.map((data) => ({ ...data, id: data.domain }))} className={styles.appsWeLoveRow}>
      {({ domain, title, description, img, users }) => (
        <>
          <div className={styles.appsWeLoveProfile}>
            <ProfileList layout="row" users={users} />
          </div>
          <a href={`https://${domain}.glitch.me`} className={styles.plainLink}>
            <MaskImage maskClass="speechBubble" src={img} alt="" />
            <h4>{title}</h4>
            <p>{description}</p>
          </a>
        </>
      )}
    </Row>
  </section>
);

const CuratedCollections = ({ content }) => (
  <section id="curated-collections">
    <h3 className={styles.h3}>
      <Mark color="skyblue">Curated collections</Mark>
    </h3>
    <Row items={content.map((data) => ({ ...data, id: data.fullUrl }))}>
      {({ title, description, fullUrl, users, count, collectionStyle }) => (
        <CuratedCollectionContainer collectionStyle={collectionStyle} users={users} href={`/@${fullUrl}`}>
          <h4>{title}</h4>
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
  <section id="enter-our-universe" className={styles.cultureZine}>
    <h2 className={styles.h2}>
      <Mark color="lavender">Enter our universe</Mark>
    </h2>
    <p>Our thoughts on the intersection of tech and culture — on Glitch and beyond.</p>
    <Row count={2} items={[{ id: 'left', items: content.slice(0, 2) }, { id: 'right', items: content.slice(2, 4) }]}>
      {({ items }) => (
        <Row count={2} items={items}>
          {({ title, source, img, url }) => (
            <a href={`/culture${url}`} className={styles.plainLink}>
              <div className={styles.cultureZineImageWrap}>
                <MaskImage src={img} />
              </div>
              <div className={styles.cultureZineText}>
                <h3>{title}</h3>
                <p>{source}</p>
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
      <Mark color="yellow">Start building on Glitch</Mark>
    </h2>
    <div className={styles.buildingOnGlitchRow}>
      {content.map(({ href, img, title, description }) => (
        <a key={href} href={href} className={styles.plainLink}>
          <img src={img} alt="" />
          <h3>
            {title} <Arrow />
          </h3>
          <p>{description}</p>
        </a>
      ))}
    </div>
  </section>
);

export const Home = ({ data }) => (
  <>
    <Banner />
    <FeatureCallouts content={data.featureCallouts} />
    <UnifiedStories content={data.unifiedStories} />
    <TopPicks>
      <FeaturedEmbed content={data.featuredEmbed} />
      <AppsWeLove content={data.appsWeLove} />
      <CuratedCollections content={data.curatedCollections} />
    </TopPicks>
    <CultureZine content={data.cultureZine} />
    <BuildingOnGlitch content={data.buildingOnGlitch} />
  </>
);

const HomeWithProductionData = () => (
  <Layout>
    <Home data={compiledData} />
  </Layout>
);

export default HomeWithProductionData;
