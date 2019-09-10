import React from 'react';
import classnames from 'classnames';
import { Icon } from '@fogcreek/shared-components';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import HiddenCheckbox from 'Components/fields/hidden-checkbox';

import styles from './styles.styl';

const privateText = 'Only members can view code';
const publicText = 'Visible to everyone';

export const PrivateIcon = ({ className, label, inButton, isPrivate }) => (
  <span className={styles.privateBadge}>
    {isPrivate ? <Icon className={styles.private} icon="private" /> : <Icon className={styles.public} icon="public" /> }
  </span>
);

PrivateIcon.defaultProps = {
  label: privateText,
};

export const PrivateBadge = () => (
  <TooltipContainer type="info" tooltip={privateText} target={<Icon className={styles.private} icon="private" label={privateText} />} />
);

export const PrivateToggle = ({ isPrivate, setPrivate }) => (
  <TooltipContainer
    type="action"
    tooltip={isPrivate ? privateText : publicText}
    target={
      <HiddenCheckbox value={isPrivate} onChange={setPrivate}>
        <PrivateIcon isPrivate={isPrivate} className={styles.button} label={privateText} />
      </HiddenCheckbox>
    }
  />
);
