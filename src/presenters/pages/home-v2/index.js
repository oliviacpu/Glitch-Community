import React from 'react'

import Button from 'Components/buttons/button'
import Row from 'Components/containers/row'

import Layout from '../../layout';

const BannerVideo = () => <div>TODO video</div>

const Mark = ({ color, children }) => (
  <span style={{ backgroundColor: color }}>{children}</span>
) 

const Banner = () => (
  <header>
    <div>
      <h1>
        Glitch is the<br/> 
        <Mark>friendly community</Mark><br/>
        where anyone can<br/>
        <Mark>create the web</Mark>
      </h1>
      <p>The easiest way to build, ship, and share apps on the web, for free.</p>
      <Button type="cta" href="/apps">Check out fresh apps →</Button>
    </div>
    <BannerVideo />
  </header>
)

const featureCalloutContent = [
  {
    id: 'app',
    label: 'Discover the best stuff on the web',
    description: 'Over a million free apps you’ll only find on Glitch.  All instantly remixable and created by people like you.',
    cta: 'Our favorite new apps →',
    imgSrc: '',
    href: '/apps',
    color: 'yellow',
  },
  {
    id: 'dev',
    label: 'Code the app of your dreams',
    description: 'No servers, no setup, no worries. Glitch is so easy that it’s beloved by expert developers and brand new coders.',
    cta: 'Glitch for devs →',
    imgSrc: '',
    href: '/create',
    color: 'pink',
  },
  {
    id: 'team',
    label: 'Build with your team',
    description: 'Real-time collaboration features packaged with curated apps, designed to boost your team’s productivity.',
    cta: 'Glitch for teams →',
    imgSrc: '',
    href: '/teams',
    color: 'teal'
  }
]

const FeatureCallouts = ({ content }) => (
  <section>
    <Row items={content}>
      {({ label, description, cta, imgSrc, href }) => (
        <a href={href}>
          <img src={imgSrc} alt="" />
          <h2><Mark>{label}</Mark></h2>
          <p>{description}</p>
          <Button decorative>{cta}</Button>
        </a>
      )}
    </Row>
  </section>
)

const unifiedStoriesContent = {
  hed: 'AOC says algorithms are biased.\n Here’s how a software developer proved it.',
  dek: 'Algorithms and bias',
  featuredImage: '',
  featuredImageDescription: '',
  summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta sit amet velit suscipit rhoncus. Nulla et ante bibendum, lacinia urna in, tincidunt erat. Fusce sollicitudin consequat mi eu rhoncus. Etiam arcu sapien, gravida vel libero vel, facilisis tempor nibh. Cras euismod tincidunt maximus. Nulla at nunc porttitor, mollis eros eu, interdum ipsum. Proin et hendrerit velit, ut gravida ligula. Integer congue est id massa sollicitudin, in efficitur ligula facilisis.',
  cta: 'The Whole Story →',
  href: '/culture',
  relatedContent: [
    {
      label: 'The Filter Bubble',
      source: 'On the Blog',
      href: ''
    },
    {
      label: 'I Made Racist Software',
      source: 'Function Podcast',
      href: ''
    },
    {
      label: 'TensorFlow Starters',
      source: 'App Collection',
      href: ''
    },
    {
      label: 'Uncovering Search',
      source: 'On the Blog',
      href: ''
    },
  ]
}

const UnifiedStories = ({ content: { hed, dek, featuredImage, featuredImageDescription, summary, href, cta, relatedContent } }) => (
  <section>
    <div>
      <h2><Mark color="white">{hed}</Mark></h2>
      <img src={featuredImage} alt={featuredImageDescription}/>
    </div>
    <div>
      <h3>{dek}</h3>
      <p>{summary}</p>
      <Button href={href}>{cta}</Button>
    </div>
    <div>
      <h3>Featuring</h3>
      <ul>
        {relatedContent.map(({ label, source, href }) => (
          <li key={label}>
            <a href={href}>
              <h4>{label}</h4>
              <p>{source}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

const Home = () => (
  <Layout>
    <Banner />
    <FeatureCallouts content={featureCalloutContent} />
    <UnifiedStories content={unifiedStoriesContent} />
  </Layout>
)

export default Home;
