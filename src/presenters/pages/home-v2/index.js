import React from 'react'

import Button from 'Components/buttons/button'

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
      <Button type="cta">Check out fresh apps &rarr;</Button>
    </div>
    <BannerVideo />
  </header>
)

const FeatureCallout = () => (
  
)

const Home = () => (
  <Layout>
    <Banner />
  </Layout>
)

export default Home;
