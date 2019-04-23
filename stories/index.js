import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import TextInput from 'Components/inputs/text-input';
import TextArea from 'Components/inputs/text-area';
import Image from 'Components/images/image';
import MaskImage from 'Components/images/mask-image';
import Text from 'Components/text/text';
import Heading from 'Components/text/heading';
import Markdown from 'Components/text/markdown';
import Badge from 'Components/badges/badge';
import SegmentedButtons from 'Components/buttons/segmented-buttons';
import ProjectItem from 'Components/project/project-item';
import SmallCollectionItem from 'Components/collection/small-collection-item';
import TeamItem from 'Components/team/team-item';
import UserItem from 'Components/user/user-item';
import SearchResultCoverBar from 'Components/blocks/search-result-cover-bar';
import Thanks from 'Components/blocks/thanks';
import Loader from 'Components/loaders/loader';
import NotFound from 'Components/errors/not-found';
import SearchResults from 'Components/search/search-results';
import StarterKitResult from 'Components/search/starter-kit-result';
import { Context as CurrentUserContext } from '../src/state/current-user';
import { Context as APIContext } from '../src/state/api';
import Embed from 'Components/project/embed';
import ProjectEmbed from 'Components/project/project-embed';
import FeaturedProject from 'Components/project/featured-project';
import CoverContainer from 'Components/containers/cover-container';
import ProfileList from 'Components/profile/profile-list';

// initialize globals
window.CDN_URL = 'https://cdn.glitch.com';
window.EDITOR_URL = 'https://glitch.com/edit/';
window.APP_URL = 'https://glitch.com';

const helloAlert = () => {
  alert('hello');
};

const withState = (initState, Component) => {
  const WrappedComponent = () => {
    const [state, setState] = useState(initState);
    return <Component state={state} setState={setState} />;
  };
  return () => <WrappedComponent />;
};

const provideContext = ({ currentUser = {}, api = {} } = {}, Component) => () => (
  <CurrentUserContext.Provider value={{ currentUser }}>
    <APIContext.Provider value={api}>
      <Component />
    </APIContext.Provider>
  </CurrentUserContext.Provider>
);

storiesOf('Button', module)
  .add('regular', () => <Button onClick={helloAlert}>Hello Button</Button>)
  .add('cta', () => (
    <Button type="cta" onClick={helloAlert}>
      CTA Button
    </Button>
  ))
  .add('small', () => (
    <Button size="small" onClick={helloAlert}>
      Small Button
    </Button>
  ))
  .add('tertiary', () => (
    <Button type="tertiary" size="small" onClick={helloAlert}>
      Tertiary (Small) Button
    </Button>
  ))
  .add('danger zone (red on hover)', () => (
    <Button type="dangerZone" size="small" onClick={helloAlert}>
      Destructive Action
    </Button>
  ))
  .add('link (click to a different page)', () => <Button href="https://support.glitch.com">Support</Button>)
  .add('with emoji', () => (
    <Button onClick={helloAlert}>
      <Emoji name="sunglasses" /> Show
    </Button>
  ))
  .add(`match background`, () => (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#F5F5F5' }}>
      <Button onClick={helloAlert} matchBackground={true}>
        Support <Emoji name="ambulance" />
      </Button>
    </div>
  ));

storiesOf('Emoji', module)
  .add('standard', () => <Emoji name="herb" />)
  .add('sunglasses', () => <Emoji name="sunglasses" />);

storiesOf('TooltipContainer', module)
  .add('action', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer type="action" id="a-unique-id" target={<Button>Hover or focus me</Button>} tooltip="I'm an action tooltip" />
    </div>
  ))
  .add('info', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer
        type="info"
        id="a-unique-id"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm an info tooltip"
      />
    </div>
  ))
  .add('persistent', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer
        type="info"
        id="a-unique-id"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm a persistent tooltip"
        persistent
      />
    </div>
  ))
  .add('left and top aligned', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer type="action" id="a-unique-id" target={<Button>Hover or focus me</Button>} tooltip="I'm a tooltip" align={['top', 'left']} />
    </div>
  ));

storiesOf('Image', module)
  .add('regular', () => <Image src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch Logo" />)
  .add('background Image', () => (
    <Image backgroundImage={true} src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch Logo" />
  ))
  .add('srcSet', () => (
    <Image
      src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg"
      srcSet={[
        'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg?x=2 1000w',
        'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg?x=1 2000w',
      ]}
      alt="Glitch Logo"
    />
  ))
  .add('width & height', () => (
    <Image src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch Logo" width="200" height="200" />
  ))
  .add('width & height with background image', () => (
    <Image
      src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg"
      backgroundImage
      alt="Glitch Logo"
      width="200px"
      height="200px"
    />
  ));
storiesOf('Heading', module)
  .add('h1 ', () => <Heading tagName="h1">H1, 22px</Heading>)
  .add('h2', () => <Heading tagName="h2">H2, 18px</Heading>)
  .add('h3', () => <Heading tagName="h3">H3, 16px</Heading>)
  .add('h4', () => <Heading tagName="h4">H4, 14px</Heading>);

storiesOf('Text', module).add('regular ', () => <Text>Regular, 20px</Text>);

storiesOf('Markdown', module)
  .add('regular', () => <Markdown>Some __Markdown__</Markdown>)
  .add('truncated', () => <Markdown length={35}>35 characters of rendered __Markdown__ (and a little **more**)</Markdown>);

storiesOf('Badge', module)
  .add('regular', () => <Badge>Regular</Badge>)
  .add('success', () => <Badge type="success">Success</Badge>)
  .add('warning', () => <Badge type="warning">Warning</Badge>)
  .add('error', () => <Badge type="error">Error</Badge>);

storiesOf('Segmented-Buttons', module)
  .add(
    'regular',
    withState('a', ({ state, setState }) => (
      <SegmentedButtons
        value={state}
        onChange={setState}
        buttons={[{ name: 'a', contents: 1 }, { name: 'b', contents: 2 }, { name: 'c', contents: 3 }]}
      />
    )),
  )
  .add(
    'jsx contents',
    withState('a', ({ state, setState }) => (
      <SegmentedButtons
        value={state}
        onChange={setState}
        buttons={[
          {
            name: 'a',
            contents: (
              <>
                <Badge>Normal</Badge> Badge
              </>
            ),
          },
          {
            name: 'b',
            contents: (
              <>
                <Badge type="error">Error</Badge> Badge
              </>
            ),
          },
        ]}
      />
    )),
  );

const users = {
  modernserf: {
    isSupport: false,
    isInfrastructureUser: false,
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
    createdAt: '2017-03-21T00:14:37.651Z',
    updatedAt: '2019-04-03T13:34:21.147Z',
    features: [],
  },
};

storiesOf('ProjectItem', module).add(
  'base',
  provideContext({ currentUser: {} }, () => (
    <div style={{ margin: '2em', width: '25%' }}>
      <ProjectItem
        project={{
          id: 'foo',
          domain: 'judicious-pruner',
          description: 'a judicious project that does pruner things',
          private: false,
          showAsGlitchTeam: false,
          users: [users.modernserf],
          teams: [],
        }}
      />
    </div>
  )),
);

const mockAPI = {
  async get(url) {
    return { data: this.responses[url] };
  },
  responses: {
    '/v1/users/by/id/?id=271885': { 271885: users.modernserf },
  },
};

storiesOf('SmallCollectionItem', module).add(
  'with user',
  provideContext({ currentUser: {}, api: mockAPI }, () => (
    <div style={{ margin: '2em', width: '25%' }}>
      <SmallCollectionItem
        collection={{
          id: 12345,
          name: 'Cool Projects',
          description: 'A collection of cool projects',
          coverColor: '#efe',
          user: users.modernserf,
          projects: [{}],
        }}
      />
    </div>
  )),
);

storiesOf('UserItem', module).add('base', () => (
  <div style={{ margin: '2em', width: '25%' }}>
    <UserItem user={users.modernserf} />
  </div>
));

storiesOf('TeamItem', module).add('base', () => (
  <div style={{ margin: '2em', width: '25%' }}>
    <TeamItem
      team={{
        id: 12345,
        coverColor: '#efe',
        description: 'An example team',
        hasAvatarImage: false,
        hasCoverImage: false,
        isVerified: false,
        name: ['Example Team'],
        url: 'example-team',
        users: [users.modernserf],
      }}
    />
  </div>
));

storiesOf('SearchResultCoverBar', module)
  .add('user', () => (
    <div style={{ margin: '2em', width: '25%' }}>
      <SearchResultCoverBar type="user" item={users.modernserf} size="medium" />
    </div>
  ))
  .add('user without cover', () => (
    <div style={{ margin: '2em', width: '25%' }}>
      <SearchResultCoverBar type="user" item={{ id: 123, login: 'nobody' }} size="medium" />
    </div>
  ));

storiesOf('Thanks', module).add('variations', () => (
  <div>
    <Thanks count={1} />
    <Thanks count={2} />
    <Thanks count={3} />
    <Thanks count={3} short />
  </div>
));

storiesOf('Loader', module).add('loader', () => <Loader />);

storiesOf('NotFound', module).add('not found', () => <NotFound name="any results" />);

storiesOf('SearchResults', module).add(
  'results',
  provideContext(
    { currentUser: {}, api: mockAPI },
    withState('all', ({ state, setState }) => (
      <SearchResults
        query="modernserf"
        activeFilter={state}
        setActiveFilter={setState}
        searchResults={{
          status: 'ready',
          totalHits: 2,
          topResults: [{ ...users.modernserf, type: 'user', isExactMatch: true }],
          team: [],
          user: [{ ...users.modernserf, type: 'user', isExactMatch: true }],
          project: [
            {
              type: 'project',
              id: 'foo',
              domain: 'modernserf-zebu',
              description: 'a modernserf project that does zebu things',
              private: false,
              showAsGlitchTeam: false,
              users: [users.modernserf],
              teams: [],
            },
          ],
          collection: [],
        }}
      />
    )),
  ),
);

storiesOf('MaskImage', module)
  .add('random mask', () => <MaskImage src="https://glitch.com/culture/content/images/2018/10/react-starter-kit-1.jpg" />)
  .add(
    'select mask',
    withState('mask1', ({ state, setState }) => (
      <div>
        <MaskImage maskClass={state} src="https://glitch.com/culture/content/images/2018/10/react-starter-kit-1.jpg" />
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="mask1">Mask 1</option>
          <option value="mask2">Mask 2</option>
          <option value="mask3">Mask 3</option>
          <option value="mask4">Mask 4</option>
        </select>
      </div>
    )),
  );

storiesOf('StarterKit', module).add('react', () => (
  <StarterKitResult
    result={{
      id: 1,
      type: 'starter-kit',
      keywords: ['react'],
      imageURL: 'https://glitch.com/culture/content/images/2018/10/react-starter-kit-1.jpg',
      name: 'Build a Web App with React',
      url: 'https://glitch.com/culture/react-starter-kit/',
      description: 'A free, 5-part video course with interactive code examples that will help you learn React.',
      coverColor: '#f0fcff',
    }}
  />
));

storiesOf('Embed', module).add('regular', () => <Embed domain="community-staging" />);

const TopLeft = <h2>This project is bananas</h2>;
const TopRight = <button>I am on top</button>;
const BottomRight = (
  <>
    <button>one</button>
    <button>two</button>
  </>
);
const BottomLeft = <button>Everything you own in a box to the left</button>;
const addProjectToCollection = () => {};

storiesOf('ProjectEmbed', module)
  .add(
    'does not own project, not logged in',
    provideContext({ currentUser: {} }, () => (
      <ProjectEmbed
        project={{ id: '123', domain: 'community-staging' }}
        isAuthorized={false}
        currentUser={{ login: null }}
        addProjectToCollection={addProjectToCollection}
      />
    )),
  )
  .add(
    'does not own project, is logged in',
    provideContext({ currentUser: { login: '@sarahzinger' } }, () => (
      <ProjectEmbed
        project={{ id: '123', domain: 'community-staging' }}
        isAuthorized={false}
        currentUser={{ login: '@sarahzinger' }}
        addProjectToCollection={addProjectToCollection}
      />
    )),
  )
  .add('owns project, is logged in', () => (
    <ProjectEmbed
      project={{ id: '123', domain: 'community-staging' }}
      isAuthorized={true}
      currentUser={{ login: '@sarahzinger' }}
      addProjectToCollection={addProjectToCollection}
    />
  ));

const unfeatureProject = () => {};

storiesOf('FeaturedProject', module)
  .add(
    'owns featured project',
    provideContext({ currentUser: {} }, () => (
      <FeaturedProject
        featuredProject={{ id: '123', domain: 'community-staging' }}
        isAuthorized={true}
        currentUser={{ login: '@sarahzinger' }}
        addProjectToCollection={addProjectToCollection}
        unfeatureProject={unfeatureProject}
      />
    )),
  )
  .add(
    'does not own featured project',
    provideContext({ currentUser: { login: '@sarahzinger' } }, () => (
      <FeaturedProject featuredProject={{ id: '123', domain: 'community-staging' }} isAuthorized={false} currentUser={{ login: '@sarahzinger' }} />
    )),
  );

const team = {
  backgroundColor: 'rgb(116,236,252)',
  coverColor: 'rgb(12,84,124)',
  hasCoverImage: true,
  name: 'Glitch',
  id: 74,
};

const buttons = (
  <>
    <button>one</button>
    <button>two</button>
  </>
);
storiesOf('CoverContainer', module)
  .add('when passed a user', () => (
    <CoverContainer item={users.modernserf} type="user">
      <div style={{ backgroundColor: 'white' }}>We are the children</div>
    </CoverContainer>
  ))
  .add('when passed a team', () => (
    <CoverContainer item={team} type="team">
      <div style={{ backgroundColor: 'white' }}>We are the children</div>
    </CoverContainer>
  ))
  .add('when passed buttons', () => (
    <CoverContainer item={team} type="team" buttons={buttons}>
      <div style={{ backgroundColor: 'white' }}>
        <p>We are the children</p>
        <p>Notice the buttons are up and to the right</p>
      </div>
    </CoverContainer>
  ));

const ProfileListWrap = ({ children }) => <div style={{ width: 100 }}>{children}</div>;

const glitchTeam = [
 {
      "id": 2,
      "avatarUrl": "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/2ea4260e-b6aa-4b23-b867-503fdcdf175d-large.png",
      "avatarThumbnailUrl": "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/2ea4260e-b6aa-4b23-b867-503fdcdf175d-small.png",
      "login": "pirijan",
      "name": "Pirijan",
      "location": "New York",
      "color": "#f2c48c",
      "description": "I make the interface of Glitch. Here are some [tweets](https://twitter.com/pketh), some [words](http://pketh.org), and some [feels](http://frogfeels.com). (cover by [mushbuh](https://twitter.com/mushbuh/status/940675887116173312))",
      "hasCoverImage": true,
      "coverColor": "rgb(4,4,4)",
    },
    {
      "isSupport": false,
      "isInfrastructureUser": false,
      "id": 9,
      "avatarUrl": "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/096df579-e72b-44df-8469-cd93f8edae48-large.png",
      "avatarThumbnailUrl": "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/096df579-e72b-44df-8469-cd93f8edae48-small.png",
      "login": "whimsicallyson",
      "name": "allyson",
      "location": "Pittsburgh, PA",
      "color": "#d8adf7",
      "description": "this is my profile field",
      "hasCoverImage": false,
      "coverColor": "rgb(37,15,14)",
      "thanksCount": 6,
      "utcOffset": -240,
      "featuredProjectId": null,
      "createdAt": "2015-10-19T15:37:04.449Z",
      "updatedAt": "2019-04-23T00:32:02.257Z",
      "features": [
        {
          "id": 411,
          "name": "custom_domains",
          "data": null,
          "expiresAt": "2118-10-27T15:13:46.985Z"
        }
      ],
      "teamPermission": {
        "userId": 9,
        "teamId": 74,
        "accessLevel": 30,
        "createdAt": "2018-08-06T18:14:08.426Z",
        "updatedAt": "2018-11-06T15:55:09.628Z"
      }
    },
    {
      "isSupport": true,
      "isInfrastructureUser": false,
      "id": 11,
      "avatarUrl": "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/755fa7c0-ae97-4782-9b54-5e49b95e053f-large.png",
      "avatarThumbnailUrl": "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/755fa7c0-ae97-4782-9b54-5e49b95e053f-small.png",
      "login": "_gw",
      "name": "Gareth",
      "location": null,
      "color": "#8bf9cf",
      "description": "1x developer turned evil marketer. working on [glitch](https://glitch.com). curate [devrel.io](https://devrel.io). [🤳🏼.ws](http://🤳🏼.ws)",
      "hasCoverImage": true,
      "coverColor": "rgb(156,28,236)",
      "thanksCount": 186,
      "utcOffset": 60,
      "featuredProjectId": "d2baacc0-73e4-4fb1-8fad-a682accdc36a",
      "createdAt": "2015-10-22T17:02:25.858Z",
      "updatedAt": "2019-04-23T12:31:18.347Z",
      "features": [
        {
          "id": 27,
          "name": "super_user",
          "data": null,
          "expiresAt": "2019-10-15T14:30:23.229Z"
        },
        {
          "id": 765,
          "name": "custom_domains",
          "data": null,
          "expiresAt": "2118-10-27T15:13:46.985Z"
        }
      ],
      "teamPermission": {
        "userId": 11,
        "teamId": 74,
        "accessLevel": 30,
        "createdAt": "2018-04-04T16:16:57.162Z",
        "updatedAt": "2018-07-31T14:52:58.949Z"
      }
    },
    {
      "isSupport": true,
      "isInfrastructureUser": false,
      "id": 18,
      "avatarUrl": "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/5a52db65-0d61-4adc-9109-cd3809fca27e-large.png",
      "avatarThumbnailUrl": "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/5a52db65-0d61-4adc-9109-cd3809fca27e-small.png",
      "login": "TimKingtonFC",
      "name": "Tim Kington",
      "location": null,
      "color": "#aef28c",
      "description": "I work at Glitch.",
      "hasCoverImage": true,
      "coverColor": "rgb(81,78,66)",
      "thanksCount": 16,
      "utcOffset": -240,
      "featuredProjectId": null,
      "createdAt": "2015-11-12T16:07:36.913Z",
      "updatedAt": "2019-04-22T14:01:40.271Z",
      "features": [
        {
          "id": 29,
          "name": "super_user",
          "data": null,
          "expiresAt": "2019-10-15T14:31:18.837Z"
        },
        {
          "id": 839,
          "name": "custom_domains",
          "data": null,
          "expiresAt": "2118-10-27T15:13:46.985Z"
        }
      ],
      "teamPermission": {
        "userId": 18,
        "teamId": 74,
        "accessLevel": 30,
        "createdAt": "2018-04-04T16:17:01.282Z",
        "updatedAt": "2018-04-04T16:17:01.282Z"
      }
    },
    {
      "isSupport": false,
      "isInfrastructureUser": false,
      "id": 21,
      "avatarUrl": "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/cb0f7d08-d1e4-47de-be5c-b75d5f122135-large.png",
      "avatarThumbnailUrl": "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/cb0f7d08-d1e4-47de-be5c-b75d5f122135-small.png",
      "login": "anildash",
      "name": "Anil Dash",
      "location": "NYC",
      "color": "#f9bbd4",
      "description": "I'm the CEO of 🎏 Glitch! And I am fighting for more ethical, humane and just tech. https://anildash.com/",
      "hasCoverImage": true,
      "coverColor": "rgb(4,12,10)",
      "thanksCount": 18,
      "utcOffset": -240,
      "featuredProjectId": "f0e649a1-3610-45f3-885a-217df0379e77",
      "createdAt": "2016-01-14T18:14:41.608Z",
      "updatedAt": "2019-04-23T03:26:43.636Z",
      "features": [
        {
          "id": 791,
          "name": "custom_domains",
          "data": null,
          "expiresAt": "2118-10-27T15:13:46.985Z"
        }
      ],
      "teamPermission": {
        "userId": 21,
        "teamId": 74,
        "accessLevel": 30,
        "createdAt": "2018-04-04T16:17:12.177Z",
        "updatedAt": "2018-04-04T16:17:12.177Z"
      }
    },
    {
      "isSupport": false,
      "isInfrastructureUser": false,
      "id": 97325,
      "avatarUrl": "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/78e39bd1-b5b0-4393-8b3a-1b12867d7fb4-large.jpg",
      "avatarThumbnailUrl": "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/78e39bd1-b5b0-4393-8b3a-1b12867d7fb4-small.jpg",
      "login": "Greg",
      "name": "Greg Weil",
      "location": null,
      "color": "#bfeeff",
      "description": "_Hi!_",
      "hasCoverImage": false,
      "coverColor": "rgb(148,76,52)",
      "thanksCount": 11,
      "utcOffset": -240,
      "featuredProjectId": "89ad7cb1-b44e-4e54-a61b-74eff6677de5",
      "createdAt": "2016-07-08T18:51:40.548Z",
      "updatedAt": "2019-04-23T14:33:19.290Z",
      "features": [
        {
          "id": 842,
          "name": "custom_domains",
          "data": null,
          "expiresAt": "2118-10-27T15:13:46.985Z"
        }
      ],
      "teamPermission": {
        "userId": 97325,
        "teamId": 74,
        "accessLevel": 30,
        "createdAt": "2018-07-25T21:02:19.601Z",
        "updatedAt": "2018-08-14T18:58:58.067Z"
      }
    },
]

storiesOf('ProfileList', module)
  .add('loading', () => (
    <ProfileListWrap>
      <ProfileList users={[]} />
    </ProfileListWrap>
  ))
  .add('row', () => (
    <ProfileListWrap>
      <ProfileList layout="row" teams={[team]} users={[users.modernserf]} />
    </ProfileListWrap>
  ))
  .add('grid', () => (
    <ProfileListWrap>
      <ProfileList layout="grid" teams={[team]} users={[users.modernserf]} />
    </ProfileListWrap>
  ))
  .add('glitchTeam', () => (
    <ProfileListWrap>
      <ProfileList layout="grid" glitchTeam teams={[team]} users={[users.modernserf]} />
    </ProfileListWrap>
  ));
