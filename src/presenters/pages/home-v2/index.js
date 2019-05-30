import React from 'react'

import Button from 'Components/buttons/button'
import Row from 'Components/containers/row'

import Layout from '../../layout';

const BannerVideo = () => <div>TODO video</div>

const Mark = 'span'

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
      <Button type="cta">Check out fresh apps →</Button>
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
    href: '',
    color: ""
  },
  {
    id: 'dev',
    label: 'Code the app of your dreams',
    description: 'No servers, no setup, no worries. Glitch is so easy that it’s beloved by expert developers and brand new coders.',
    cta: 'Glitch for devs →',
    imgSrc: '',
    href: '/create',
  },
  {
    id: 'team',
    label: 'Build with your team',
    description: 'Real-time collaboration features packaged with curated apps, designed to boost your team’s productivity.',
    cta: 'Glitch for teams →',
    imgSrc: '',
    href: '/teams',
  }
]

const FeatureCallout = ({ label, description, cta, imgSrc, href }) => (
  <a href={href}>
    <img src={imgSrc} alt="" />
    <h2><Mark>{label}</Mark></h2>
    <p>{description}</p>
    <Button decorative>{cta}</Button>
  </a>
)

const FeatureCallouts = () => (
  <section>
    <Row items={featureCalloutContent}>
      {(props) => <FeatureCallout {...props} />}
    </Row>
  </section>
)

const Home = () => (
  <Layout>
    <Banner />
    <FeatureCallouts />
  </Layout>
)

export default Home;
