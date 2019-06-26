import React from 'react';
import classnames from 'classnames';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import HiddenCheckbox from 'Components/fields/hidden-checkbox';

import styles from './styles.styl'

const privateText = 'Only members can view code';
const publicText = 'Visible to everyone';

export const PrivateIcon = ({ className, label, isPrivate }) => (
  <span
    className={classnames(className, styles.projectBadge, isPrivate ? styles.private : styles.public)}
    aria-label={label}
  />
);

export const PrivateBadge = () => (
  <TooltipContainer
    type="info"
    id="private-project-badge-tooltip"
    tooltip={privateText}
    target={<PrivateIcon isPrivate label={privateText} />}
  />
);

export const PrivateToggle = ({ isPrivate, setPrivate }) => (
  <TooltipContainer
    type="action"
    id="toggle-private-button-tooltip"
    tooltip={isPrivate ? privateText : publicText}
    target={
      <HiddenCheckbox value={isPrivate} onChange={setPrivate}>
        <PrivateIcon
          isPrivate
          className={`button button-tertiary`}
          label={privateText}
        />
      </HiddenCheckbox>
    }
  />
);
