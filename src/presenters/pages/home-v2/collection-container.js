import React from 'react'

import styles from './styles.styl';

const Defs = ({ prefix, users, widths }) => (
  <defs>
    {users.slice(0, widths.length + 1).map((user, i) => (
      <pattern
        key={user.id}
        id={`${prefix}-${i}`}              
        height={widths[i]} 
        width={widths[i]}>
        <image xlinkHref={users[i].avatarUrl} width={widths[i]} />
      </pattern>
    ))}
  </defs>
)

const collectionStyles = {
  wavey: {
    color: 'lightblue',
    texture: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fwavey.svg?1559249088863',
    userMask: ({ users }) => (    
      <svg viewBox="0 0 109 153">
        <Defs prefix="wavey" users={users} widths={[40, 32, 32, 32, 42, 51]} />
        <g transform="translate(49.000000, 102.000000)" fill="#D8D8D8" fillRule="nonzero">
          <rect fill="url(#wavey-5)" x="0" y="0" width="51" height="51" rx="25.5"></rect>
          <rect fill="url(#wavey-4)" x="-49" y="-16" width="42" height="42" rx="21"></rect>
          <rect fill="url(#wavey-3)" x="-7" y="-37" width="32" height="32" rx="16"></rect>
          <rect fill="url(#wavey-2)" x="-39" y="-62" width="32" height="32" rx="16"></rect>
          <rect fill="url(#wavey-1)" x="28" y="-73" width="32" height="32" rx="16"></rect>
          <rect fill="url(#wavey-0)" x="-15" y="-102" width="40" height="40" rx="20"></rect>
        </g>
      </svg>
    )
  },
  diagonal: {
    color: 'yellow',
    texture: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fdiagonal.svg?1559249088716',
    userMask: ({ users }) => (
      <svg viewBox="0 0 116 178">
        <Defs prefix="diagonal" users={users} widths={[40, 32, 32, 42, 32, 51]} />
        <g id="user-avatar-mask-2" transform="translate(65.000000, 126.750000)">
          <rect fill="url(#diagonal-5)" x="0" y="0" width="51" height="51" rx="25.5"></rect>
          <rect fill="url(#diagonal-4)" x="-13" y="-32" width="32" height="32" rx="16"></rect>
          <rect fill="url(#diagonal-3)" x="-65" y="-42" width="42" height="42" rx="21"></rect>
          <rect fill="url(#diagonal-2)" x="19" y="-86" width="32" height="32" rx="16"></rect>
          <rect fill="url(#diagonal-1)" x="-25" y="-86" width="32" height="32" rx="16"></rect>
          <rect fill="url(#diagonal-0)" x="-65" y="-126" width="40" height="40" rx="20"></rect>
        </g>
      </svg>
    )
  },
  triangle: {
    color: 'salmon',
    texture: 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Ftriangle.svg?1559249088542',
    userMask: ({ users }) => (
      <svg  viewBox="0 0 102 161">
        <Defs prefix="triangle" users={users} widths={[40, 51, 42, 32, 30, 32]} />
        <g id="user-avatar-mask-3" transform="translate(45.000000, 128.500000)">
          <rect fill="url(#triangle-5)" x="0" y="0" width="32" height="32" rx="16"></rect>
          <rect fill="url(#triangle-4)" x="-45" y="-9" width="30" height="30" rx="15"></rect>
          <rect fill="url(#triangle-3)" x="25" y="-58" width="32" height="32" rx="16"></rect>
          <rect fill="url(#triangle-2)" x="-28" y="-67" width="42" height="42" rx="21"></rect>
          <rect fill="url(#triangle-1)" x="6" y="-128.5" width="51" height="51" rx="25.5"></rect>
          <rect fill="url(#triangle-0)" x="-43" y="-123" width="40" height="40" rx="20"></rect>
        </g>
      </svg>
    )
  }
}

const CuratedCollectionContainer = ({ collectionStyle, users, children }) => (
  <div className={styles.curatedCollectionContainer} style={{ backgroundColor: collectionStyles[collectionStyle].color }}>
    <img src={collectionStyles[collectionStyle].texture} alt="" className={styles.curatedCollectionTexture} />
    <div className={styles.curatedCollectionText}>
      {children}
    </div>
    <div className={styles.curatedCollectionUsers}>
      {React.createElement(collectionStyles[collectionStyle].userMask, { users })}
    </div>
  </div>
)

export default CuratedCollectionContainer;

