const featureCallouts = [
  {
    label: 'Discover the best stuff on the web',
    description: 'Over a million free apps you’ll only find on Glitch.  All instantly remixable and created by people like you.',
    cta: 'Our favorite new apps',
    imgSrc: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fdiscover-animation.svg?1559245019429',
    backgroundSrc: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fdiscover-background.svg?1559244637952',
    href: '#apps-we-love',
    color: 'yellow',
  },
  {
    label: 'Code the app of your dreams',
    description: 'No servers, no setup, no worries. Glitch is so easy that it’s beloved by expert developers and brand new coders.',
    cta: 'Glitch for devs',
    imgSrc: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fcreators-animation.svg?1559245019111',
    backgroundSrc: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fcreators-background.svg?1559244638269',
    href: '/create',
    color: 'pink',
  },
  {
    label: 'Build with your team',
    description: 'Real-time collaboration features packaged with curated apps, designed to boost your team’s productivity.',
    cta: 'Glitch for teams',
    imgSrc: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fteam-animation.svg?1559245019268',
    backgroundSrc: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fteams-background.svg?1559244638129',
    href: '/teams',
    color: 'aquamarine',
  },
];

const buildingOnGlitch = [
  {
    href: '/create',
    img: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FfirstWebsite.svg?1492031604409',
    title: 'Developers',
    description: 'Whether you’re learning how to code or building a production-level app, find out how Glitch can power your next idea.'
  },
  {
    href: '/teams',
    img: 'https://cdn.glitch.com/02ae6077-549b-429d-85bc-682e0e3ced5c%2Fcollaborate.svg?1540583258925',
    title: 'Teams',
    description: 'Collaborate on apps with your teammates, create starter apps for your next hackathon, or use Glitch for managing your classroom.'
  }
]

module.exports = { featureCallouts, buildingOnGlitch }