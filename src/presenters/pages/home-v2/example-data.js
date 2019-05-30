const featureCallout = [
  {
    id: 'discover',
    label: 'Discover the best stuff on the web',
    description: 'Over a million free apps you’ll only find on Glitch.  All instantly remixable and created by people like you.',
    cta: 'Our favorite new apps →',
    imgSrc: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fdiscover-animation.svg?1559245019429',
    backgroundSrc: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fdiscover-background.svg?1559244637952',
    href: '#apps-we-love',
    color: 'yellow',
  },
  {
    id: 'dev',
    label: 'Code the app of your dreams',
    description: 'No servers, no setup, no worries. Glitch is so easy that it’s beloved by expert developers and brand new coders.',
    cta: 'Glitch for devs →',
    imgSrc: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fcreators-animation.svg?1559245019111',
    backgroundSrc: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fcreators-background.svg?1559244638269',
    href: '/create',
    color: 'pink',
  },
  {
    id: 'team',
    label: 'Build with your team',
    description: 'Real-time collaboration features packaged with curated apps, designed to boost your team’s productivity.',
    cta: 'Glitch for teams →',
    imgSrc: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fteam-animation.svg?1559245019268',
    backgroundSrc: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fteams-background.svg?1559244638129',
    href: '/teams',
    color: 'aquamarine'
  }
]

const unifiedStories = {
  hed: 'AOC says algorithms are biased.\n\nHere’s how a software developer proved it.',
  dek: 'Algorithms and bias',
  featuredImage: 'https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2Fwayback_importer.png?1536570052496',
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

const users = {
  modernserf: {
    id: 271885,
    avatarUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/560e4b07-a70b-4f87-b8d4-699d738792d0-large.jpg',
    avatarThumbnailUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/560e4b07-a70b-4f87-b8d4-699d738792d0-small.jpg',
    login: 'modernserf',
    name: 'Justin Falcone',
    location: 'Brooklyn, NY',
    color: '#ea6996',
    description:
      'programmer & writer\n\n[🐦](https://twitter.com/modernserf) [🐙](https://github.com/modernserf) [🏠](https://justinfalcone.com) [☄](http://pronoun.is/they/.../themselves)',
    hasCoverImage: true,
    coverColor: 'rgb(84,138,53)',
    thanksCount: 1,
    utcOffset: -240,
    featuredProjectId: '22a883dc-a45d-4257-b44c-a43b6b8cabe9',
  },
  pirijan: {
    id: 2,
    avatarUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/2ea4260e-b6aa-4b23-b867-503fdcdf175d-large.png',
    avatarThumbnailUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/2ea4260e-b6aa-4b23-b867-503fdcdf175d-small.png',
    login: 'pirijan',
    name: 'Pirijan',
    location: 'New York',
    color: '#f2c48c',
    description:
      'I make the interface of Glitch. Here are some [tweets](https://twitter.com/pketh), some [words](http://pketh.org), and some [feels](http://frogfeels.com). (cover by [mushbuh](https://twitter.com/mushbuh/status/940675887116173312))',
    hasCoverImage: true,
    coverColor: 'rgb(4,4,4)',
    thanksCount: 21,
    utcOffset: -240,
    featuredProjectId: null,
  },
  whimsicallyson: {
    id: 9,
    avatarUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/096df579-e72b-44df-8469-cd93f8edae48-large.png',
    avatarThumbnailUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/096df579-e72b-44df-8469-cd93f8edae48-small.png',
    login: 'whimsicallyson',
    name: 'allyson',
    location: 'Pittsburgh, PA',
    color: '#d8adf7',
    description: 'this is my profile field',
    hasCoverImage: false,
    coverColor: 'rgb(37,15,14)',
    thanksCount: 6,
    utcOffset: -240,
    featuredProjectId: null,
  },
  _gw: {
    id: 11,
    avatarUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/755fa7c0-ae97-4782-9b54-5e49b95e053f-large.png',
    avatarThumbnailUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/755fa7c0-ae97-4782-9b54-5e49b95e053f-small.png',
    login: '_gw',
    name: 'Gareth',
    location: null,
    color: '#8bf9cf',
    description:
      '1x developer turned evil marketer. working on [glitch](https://glitch.com). curate [devrel.io](https://devrel.io). [🤳🏼.ws](http://🤳🏼.ws)',
    hasCoverImage: true,
    coverColor: 'rgb(156,28,236)',
    thanksCount: 186,
    utcOffset: 60,
    featuredProjectId: 'd2baacc0-73e4-4fb1-8fad-a682accdc36a',
  },
  TimKingtonFC: {
    id: 18,
    avatarUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/5a52db65-0d61-4adc-9109-cd3809fca27e-large.png',
    avatarThumbnailUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/5a52db65-0d61-4adc-9109-cd3809fca27e-small.png',
    login: 'TimKingtonFC',
    name: 'Tim Kington',
    location: null,
    color: '#aef28c',
    description: 'I work at Glitch.',
    hasCoverImage: true,
    coverColor: 'rgb(81,78,66)',
    thanksCount: 16,
    utcOffset: -240,
    featuredProjectId: null,
  },
  anildash: {
    id: 21,
    avatarUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/cb0f7d08-d1e4-47de-be5c-b75d5f122135-large.png',
    avatarThumbnailUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/cb0f7d08-d1e4-47de-be5c-b75d5f122135-small.png',
    login: 'anildash',
    name: 'Anil Dash',
    location: 'NYC',
    color: '#f9bbd4',
    description: "I'm the CEO of 🎏 Glitch! And I am fighting for more ethical, humane and just tech. https://anildash.com/",
    hasCoverImage: true,
    coverColor: 'rgb(4,12,10)',
    thanksCount: 18,
    utcOffset: -240,
    featuredProjectId: 'f0e649a1-3610-45f3-885a-217df0379e77',
  },
  Greg: {
    id: 97325,
    avatarUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/78e39bd1-b5b0-4393-8b3a-1b12867d7fb4-large.jpg',
    avatarThumbnailUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/78e39bd1-b5b0-4393-8b3a-1b12867d7fb4-small.jpg',
    login: 'Greg',
    name: 'Greg Weil',
    location: null,
    color: '#bfeeff',
    description: '_Hi!_',
    hasCoverImage: false,
    coverColor: 'rgb(148,76,52)',
    thanksCount: 11,
    utcOffset: -240,
    featuredProjectId: '89ad7cb1-b44e-4e54-a61b-74eff6677de5',
  },
}

const curatedCollections = [
  {
    title: 'Glitch This Week',
    description: 'Just a few projects that caught our eye this week on Glitch',
    fullUrl: 'glitch/glitch-this-week-may-29-2019',
    users: Object.values(users),
    count: 11,
    collectionStyle: 'wavey',
  },
  {
    title: 'Colorful Creations',
    description: 'A rainbow of apps for finding and enjoying colors 🌈',
    fullUrl: 'glitch/colorful-creations',
    users: Object.values(users),
    count: 13,
    collectionStyle: 'diagonal',
  },
  {
    title: 'Draw With Music',
    description: 'Use these apps to draw with music. Waveforms, visualizations, & more! 🎧🎶',
    fullUrl: 'glitch/draw-with-music',
    users: Object.values(users),
    count: 9,
    collectionStyle: 'triangle',
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