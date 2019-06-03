import React from 'react';

import { getAvatarStyle, getDisplayName } from 'Models/user';

import styles from './styles.styl';

const Defs = ({ prefix, users, widths }) => (
  <defs>
    {users.slice(0, widths.length + 1).map((user, i) => (
      <pattern key={user.id} id={`${prefix}-${i}`} height={widths[i]} width={widths[i]}>
        <image xlinkHref={users[i].avatarUrl} width={widths[i]} />
      </pattern>
    ))}
  </defs>
);

const UserMask = ({ users, config }) => (
  <div className={styles.userMask} 
    style={{ paddingBottom: `${100 * config.height / config.width}%` }}>
    {config.points.slice(0, users.length).map((point, i)=> (
      <div key={users[i].id} 
        className={styles.userMaskBubbleWrap}
        aria-label={getDisplayName(users[i])}
        style={{
          left: `${(100 * point.x) / config.width}%`,
          top: `${(100 * point.y) / config.height}%`,
          width: `${(100 * point.d) / config.width}%`,
        }}
      >
        <div className={styles.userMaskBubble} style={getAvatarStyle(users[i])} />
      </div>
    ))}
  </div>
);

const collectionStyles = {
  wavey: {
    color: 'lightblue',
    texture: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fwavey.svg?1559249088863',
    width: 109,
    height: 153,
    points: [
      {"x":35,"y":0,"d":40},
      {"x":77,"y":29,"d":32},
      {"x":10,"y":40,"d":32},
      {"x":42,"y":65,"d":32},
      {"x":0,"y":86,"d":42},
      {"x":49,"y":102,"d":51}
    ]
  },
  diagonal: {
    color: 'yellow',
    texture: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fdiagonal.svg?1559249088716',
    width: 116,
    height: 178,
    points: [
      { x: 0, y: 1, d: 40 },
      { x: 40, y: 41, d: 32 },
      { x: 84, y: 41, d: 32 },
      { x: 0, y: 85, d: 42 },
      { x: 52, y: 95, d: 32 },
      { x: 65, y: 127, d: 51 },
    ],
  },
  triangle: {
    color: 'salmon',
    texture: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Ftriangle.svg?1559249088542',
    width: 102,
    height: 161,
    points: [
      { x: 2, y: 6, d: 40 },
      { x: 51, y: 1, d: 51 },
      { x: 17, y: 62, d: 42 },
      { x: 70, y: 71, d: 32 },
      { x: 0, y: 120, d: 30 },
      { x: 45, y: 129, d: 32 },
    ],
  },
};

const CuratedCollectionContainer = ({ collectionStyle, users, children }) => (
  <div className={styles.curatedCollectionContainer} style={{ backgroundColor: collectionStyles[collectionStyle].color }}>
    <img src={collectionStyles[collectionStyle].texture} alt="" className={styles.curatedCollectionTexture} />
    <div className={styles.curatedCollectionText}>{children}</div>
    <div className={styles.curatedCollectionUsers}>
      <UserMask config={collectionStyles[collectionStyle]} users={users} />
    </div>
  </div>
);

export default CuratedCollectionContainer;
