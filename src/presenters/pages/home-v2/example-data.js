const featureCallout = [
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

const unifiedStories = {
  hed: 'AOC says algorithms are biased.\n Here’s how a software developer proved it.',
  dek: 'Algorithms and bias',
  featuredImage: '',
  featuredImageDescription: '',
  summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta sit amet velit suscipit rhoncus. Nulla et ante bibendum, lacinia urna in, tincidunt erat. Fusce sollicitudin consequat mi eu rhoncus. Etiam arcu sapien, gravida vel libero vel, facilisis tempor nibh. Cras euismod tincidunt maximus. Nulla at nunc porttitor, mollis eros eu, interdum ipsum. Proin et hendrerit velit, ut gravida ligula. Integer congue est id massa sollicitudin, in efficitur ligula facilisis.',
  cta: 'The Whole Story →',
  href: '/culture',
  relatedContent: [
    {
      id: 'the-filter-bubble',
      title: 'The Filter Bubble',
      source: 'On the Blog',
      href: ''
    },
    {
      id: 'i-made-racist-software',
      title: 'I Made Racist Software',
      source: 'Function Podcast',
      href: ''
    },
    {
      id: 'tensorflow-starters',
      title: 'TensorFlow Starters',
      source: 'App Collection',
      href: ''
    },
    {
      id: 'uncovering-search',
      title: 'Uncovering Search',
      source: 'On the Blog',
      href: ''
    },
  ]
}

const featuredEmbed = {
  domain: 'deface-the-moon',
  title: "Deface the moon",
  description: "Recreate the iconic moon defacement from the animated series based on The Tick.",
}

const appsWeLove = [
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

const curatedCollections = [
  {
    title: 'Glitch This Week (May 29, 2019)',
    description: 'Just a few projects that caught our eye this week on Glitch',
    fullUrl: 'glitch/glitch-this-week-may-29-2019',
    users: [],
    count: 11,
    collectionStyle: 'blue',
  },
  {
    title: 'Colorful Creations',
    description: 'A rainbow of apps for finding and enjoying colors 🌈',
    fullUrl: 'glitch/colorful-creations',
    users: [],
    count: 13,
    collectionStyle: 'yellow',
  },
  {
    title: 'Draw With Music',
    description: 'Use these apps to draw with music. Waveforms, visualizations, & more! 🎧🎶',
    fullUrl: 'glitch/draw-with-music',
    users: [],
    count: 9,
    collectionStyle: 'red',
  }
]

const cultureZine = [
  {
    "id": "5cc884da8ce5b5009ac694f0",
    "title": "Episode 296: Shar Biggers",
    "url": "/revisionpath-shar-biggers/",
    "img": "/culture/content/images/2019/04/glitch-shar-biggers.jpg",
    "source": "Revision Path",
  },
  {
    "id": "5c52e7f067c3dc007a6b1101",
    "title": "An Intro to WebVR",
    "url": "/an-intro-to-webvr/",
    "img": "/culture/content/images/2019/04/WebVR-Starter-Kit.-Part-1_-Intro-to-WebVR-1.png",
    "source": "Starter Kit",
  },
  {
    "id": "5bb66cc271231c026d7771fb",
    "title": "Fun Apps, and Meaningful Change with Patrick Weaver",
    "url": "/making-fun-apps-and-meaningful-change-with-patrick-weaver-a-glitch-creator-profile/",
    "img": "/culture/content/images/2018/10/PatrickPhoto2-2.jpg",
    "source": "Creator Profile",

  },
  {
    "id": "5bb66cc271231c026d777209",
    "title": "Making Web Apps with React",
    "url": "/you-got-this-zine-2/",
    "img": "/culture/content/images/2018/10/ygt-zine-react.jpg",
    "source": "You Got This! Zine",
  }
]

export default {
  featureCallout,
  unifiedStories,
  featuredEmbed,
  appsWeLove,
  curatedCollections,
  cultureZine,
}