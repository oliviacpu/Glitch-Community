import React from 'react';
import PropTypes from 'prop-types';
import markdownIt from 'markdown-it';
import markdownEmoji from 'markdown-it-emoji';
import markdownSanitizer from 'markdown-it-sanitizer';
import truncate from 'html-truncate';
import styles from './markdown.styl';

const md = ({ allowImages }) => {
  const mdIt = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  }).disable('smartquotes');

  if (!allowImages) {
    mdIt.disable('image');
  }
  const md = mdIt.use(markdownEmoji).use(markdownSanitizer);
  console.log('md', md);
  console.log('md.innerText', md.innerText);
  return md;
};

/**
 * Markdown Component
 */
const Markdown = ({ children, length, allowImages }) => {
  let rendered = md({ allowImages }).render(children || '');
  console.log(rendered);
  if (length > 0) {
    rendered = truncate(rendered, length, { ellipsis: '…' });
  }
  return (
    <span
      className={styles.markdownContent}
      dangerouslySetInnerHTML={{ __html: rendered }} // eslint-disable-line react/no-danger
    />
  );
};

Markdown.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** length to truncate rendered Markdown to */
  length: PropTypes.number,
  allowImages: PropTypes.bool,
};

Markdown.defaultProps = {
  length: -1,
  allowImages: true,
};

export default Markdown;
