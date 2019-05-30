import React from 'react'
import Pluralize from 'react-pluralize';

import Button from 'Components/buttons/button'
import Row, { RowContainer, RowItem } from 'Components/containers/row'
import ProfileList, { ProfileItem } from 'Components/profile-list'
import Embed from 'Components/project/embed'
import MaskImage from 'Components/images/mask-image'
import { createAPIHook } from 'State/api'

import Layout from '../../layout';
import data from './example-data';
import styles from './styles.styl';

const FourBlock = ({ items, children }) => (
  <RowContainer count={2} className={styles.fourBlock}>
    <RowContainer as={RowItem} count={2}>
      <RowItem>{children(items[0])}</RowItem>
      <RowItem>{children(items[1])}</RowItem>
    </RowContainer>
    <RowContainer as={RowItem} count={2}>
      <RowItem>{children(items[2])}</RowItem>
      <RowItem>{children(items[3])}</RowItem>
    </RowContainer>
  </RowContainer>
)


const BannerVideo = () => (
  <div className={styles.bannerVideoWrap}>
    <div className={styles.bannerVideoChrome}> 
      <div className={styles.bannerVideoInnerWrap}>
        <div className={styles.bannerVideo}/>
      </div>
    </div>  
  </div>
)

const Mark = ({ color, children }) => (
  <span className={styles.markWrap}>
    <span className={styles.mark} style={{ '--mark-color': color }}>
      <span role="presentation">{children}</span>
    </span>
    <span className={styles.markText}>{children}</span>
  </span>
) 

const Unmarked = ({ children }) => (<span className={styles.unmarked}>{children}</span>)

const Banner = () => (
  <header id="banner" className={styles.banner}>
    <div className={styles.bannerCopy}>
      <h1>
        <Unmarked>Glitch is the</Unmarked><br/> 
        <Mark color="blue">friendly community</Mark><br/>
        <Unmarked>where anyone can</Unmarked><br/>
        <Mark color="green">create the web</Mark>
      </h1>
      <p>The easiest way to build, ship, and share apps on the web, for free.</p>
      <Button type="cta" href="#top-picks">Check out fresh apps →</Button>
    </div>
    <BannerVideo />
  </header>
)

const FeatureCallouts = ({ content }) => (
  <section id="feature-callouts" className={styles.featureCalloutsContainer}>
    <Row items={content} className={styles.featureCallloutsRow}>
      {({ label, description, cta, imgSrc, backgroundSrc, href, color }) => (
        <a href={href} className={styles.plainLink}>
          <div style={{ backgroundImage: `url('${backgroundSrc}')` }} className={styles.featureCalloutsImageWrap}>
            <img src={imgSrc} alt="" className={styles.featureCalloutsImage}/>
          </div>
          <h2><Mark color={color}>{label}</Mark></h2>
          <p>{description}</p>
          <Button decorative>{cta}</Button>
        </a>
      )}
    </Row>
  </section>
)

const TextLines = ({ text, children }) => {
  const [lines, setLines] = useState(null)
}

const UnifiedStories = ({ content: { hed, dek, featuredImage, featuredImageDescription, summary, href, cta, relatedContent } }) => (
  <section id="unified-stories" className={styles.unifiedStories}>
    <div className={styles.unifiedStoriesHeadline}>
      <div className={styles.unifiedStoriesFeatureLabel}>Feature</div>
      <h2><Mark color="white">{hed}</Mark></h2>
      <img src={featuredImage} alt={featuredImageDescription} />
    </div>
    <div className={styles.unifiedStoriesPreview}>
      <h3>{dek}</h3>
      <p>{summary}</p>
      <Button href={href}>{cta}</Button>
    </div>
    <div className={styles.unifiedStoriesRelatedContent}>
      <h3>Featuring</h3>
      <ul>
        {relatedContent.map(({ id, title, source, href }) => (
          <li key={id}>
            <a href={href} className={styles.plainLink}>
              <h4>{title}</h4>
              <p>{source}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

const TopPicks = ({ children}) => (
  <section id="top-picks">
    <h2><Mark color="turquoise">Our top picks</Mark></h2>
    <p>Apps you’ll only find here on Glitch, built by our community of creators.</p>
    {children}
  </section>
)

const useProjectMembers = createAPIHook(async(api, domain) => {
  const { data } = await api.get(`v1/projects/by/domain/users?domain=${domain}&limit=100`)
  return data.items
})

// TODO: should this data be loaded at compile-time?
const ProjectMembers = ({ domain }) => {
  const { value: users } = useProjectMembers(domain)
  return <ProfileList layout="row" users={users} />
}

const FeaturedEmbed = ({ content: { domain, title, description } }) => (
  <figure className={styles.featuredEmbed}>
    <div className={styles.featuredEmbedWrap}>
      <Embed domain={domain}/>
    </div>
    <figcaption className={styles.featuredEmbedCaption}>
      <div className={styles.featuredEmbedText}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.featuredEmbedProfileWrap}>
        <ProjectMembers domain={domain} />
      </div>
    </figcaption>
  </figure>
)

const AppsWeLove = ({ content }) => (
  <section id="apps-we-love" className={styles.appsWeLoveContainer}>
    <h3><Mark color="salmon">Apps we love</Mark></h3>
    <Row items={content.map(data => ({ ...data, id: data.domain }))} className={styles.appsWeLoveRow}>
      {({ domain, title, description, img }) => (
        <>
          <ProjectMembers domain={domain} />
          <a href={`${domain}.glitch.me`} className={styles.plainLink}>
            <MaskImage maskClass="speechBubble" src={img} alt=""/>
            <h4>{title}</h4>
            <p>{description}</p>
          </a>
        </>
      )}
    </Row>
  </section>
)

const CuratedCollectionContainer = ({ collectionStyle, users, children }) => (
  <div>{children}</div>
)

const CuratedCollections = ({ content }) => (
  <section id="curated-collections">
    <h3><Mark color="skyblue">Curated collections</Mark></h3>
    <Row items={content.map(data => ({ ...data, id: data.fullUrl }))}>
      {({ title, description, fullUrl, users, count, collectionStyle }) => (
        <CuratedCollectionContainer collectionStyle={collectionStyle} users={users}>
          <h4>{title}</h4>
          <p>{description}</p>
          <Button href={`/@${fullUrl}`}>
            View <Pluralize count={count} singular="project" /> →
          </Button>
        </CuratedCollectionContainer>
      )}
    </Row>
  </section>
)

const CultureZine = ({ content }) => (
  <section id="enter-our-universe" className={styles.cultureZine}>
    <h2><Mark color="lavender">Enter our universe</Mark></h2>
    <p>Our thoughts on the intersection of tech and culture — on Glitch and beyond.</p>
    <FourBlock items={content}>
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
    </FourBlock>
  </section>
)

const BuildingOnGlitch = () => (
  <section id="building-on-glitch" className={styles.buildingOnGlitch}>
    <h2><Mark color="yellow">Start building on Glitch</Mark></h2>
    <div className={styles.buildingOnGlitchRow}>
      <a href="/create" className={styles.plainLink}>
        <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FfirstWebsite.svg?1492031604409" alt=""/>
        <h3>Developers →</h3>
        <p>Whether you’re learning how to code or building a production-level app, find out how Glitch can power your next idea.</p>
      </a>
      <a href="/teams"className={styles.plainLink}>
        <img src="https://cdn.glitch.com/02ae6077-549b-429d-85bc-682e0e3ced5c%2Fcollaborate.svg?1540583258925" alt=""/>
        <h3>Teams →</h3>
        <p>Collaborate on apps with your teammates, create starter apps for your next hackathon, or use Glitch for managing your classroom.</p>
      </a>
    </div>
  </section>
)

const Home = () => (
  <Layout>
    <Banner />
    <FeatureCallouts content={data.featureCallout} />
    <UnifiedStories content={data.unifiedStories} />
    <TopPicks>
      <FeaturedEmbed content={data.featuredEmbed} />
      <AppsWeLove content={data.appsWeLove} />
      <CuratedCollections content={data.curatedCollections} />
    </TopPicks>
    <CultureZine content={data.cultureZine} />
    <BuildingOnGlitch/>
  </Layout>
)

export default Home;
