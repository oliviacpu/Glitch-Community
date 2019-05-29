import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.styl';

const sectionTypes = ['primary', 'secondary', 'dangerZone'];
export const PopoverSection = ({ className, children, type }) => (
  <section className={classnames(styles.popoverSection, styles[type], className)}>{children}</section>
);

PopoverSection.propTypes = {
  type: PropTypes.oneOf(sectionTypes),
  children: PropTypes.node.isRequired,
};

PopoverSection.defaultProps = {
  type: 'primary',
};

export const PopoverActions = ({ ...props }) => <PopoverSection {...props} className={styles.popoverActions} />;
export const PopoverInfo = ({ ...props }) => <PopoverSection type="secondary" {...props} className={styles.popoverInfo} />;
export const PopoverTitle = ({ ...props }) => <PopoverSection type="secondary" {...props} className={styles.popoverTitle} />;
export const InfoDescription = ({ children }) => <p className={styles.infoDescription}>{children}</p>;
export const ActionDescription = ({ children }) => <p className={styles.actionDescription}>{children}</p>;
