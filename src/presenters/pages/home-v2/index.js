import React from 'react'

import Button from 'Components/buttons/button'
import Row from 'Components/containers/row'
import ProfileList from 'Components/profile-list'
import Embed from 'Components/project/embed'
import { createAPIHook } from 'State/api'

import Layout from '../../layout';

const BannerVideo = () => <div>TODO video</div>

const Mark = ({ color, children }) => (
  <span style={{ backgroundColor: color }}>{children}</span>
) 

const Banner = () => (
  <header id="banner">
    <div>
      <h1>
        Glitch is the<br/> 
        <Mark color="blue">friendly community</Mark><br/>
        where anyone can<br/>
        <Mark color="green">create the web</Mark>
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
  <section id="feature-callouts">
    <Row items={content}>
      {({ label, description, cta, imgSrc, href, color }) => (
        <a href={href}>
          <img src={imgSrc} alt="" />
          <h2><Mark color={color}>{label}</Mark></h2>
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
  <section id="unified-stories">
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

const TopPicks = ({ children}) => (
  <section id="top-picks">
    <h2><Mark color="turquoise">Our top picks</Mark></h2>
    <p>Apps you’ll only find here on Glitch, built by our community of creators.</p>
    {children}
  </section>
)

const featuredEmbedContent = {
  domain: 'deface-the-moon',
  title: "Deface the moon",
  description: "Recreate the iconic moon defacement from the animated series based on The Tick.",
}

const useProjectMembers = createAPIHook(async(api, domain) => {
  const { data } = await api.get(`v1/projects/by/domain/users?domain=${domain}&limit=100`)
  return data.items
})

const ProjectMembers = ({ domain }) => {
  const { value: users } = useProjectMembers(domain)
  return <ProfileList layout="row" users={users} />
}

const FeaturedEmbed = ({ content: { domain, title, description } }) => (
  <figure>
    <Embed domain={domain}/>
    <figcaption>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <ProjectMembers domain={domain} />
    </figcaption>
  </figure>
)

const appsWeLoveContent = [
  {
    domain: 'magic-eye',
    title: 'Magic Eye',
    description: 'Draw Your Own Magic Eye Art',
    img: 'https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2Fmagic-eye_GLITCH.png?1543234498314',
    
  },  
  {
    domain: 'shouldidoit',
    title: 'Take On Another Project?',
    description: 'A handy exercise for figuring out whether or not you should take on a new project.',
    img: 'https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2Fshould-i-do-it.jpg?1538392879435',
  },
  {
    domain: 'turn-off-retweets',
    title: 'Turn Off Retweets',
    description: 'Turn off retweets for every person you follow on Twitter.',
    img: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fturn-off-retweets.png?1535971899505',
  }
]

const AppsWeLove = ({ content }) => (
  <section id="apps-we-love">
    <h3><Mark color="salmon">Apps we love</Mark></h3>
    <Row items={content.map(data => ({ ...data, id: data.domain }))}>
      {({ domain, title, description, img }) => (
        <>
          <ProjectMembers domain={domain} />
          <a href={`${domain}.glitch.me`}>
            <img src={img} alt=""/>
            <h4>{title}</h4>
            <p>{description}</p>
          </a>
        </>
      )}
    </Row>
  </section>
)


const Home = () => (
  <Layout>
    <Banner />
    <FeatureCallouts content={featureCalloutContent} />
    <UnifiedStories content={unifiedStoriesContent} />
    <TopPicks>
      <FeaturedEmbed content={featuredEmbedContent} />
      <AppsWeLove content={appsWeLoveContent} />
    </TopPicks>
  </Layout>
)

export default Home;
