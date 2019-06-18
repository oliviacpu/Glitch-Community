import React from 'react';
import PropTypes from 'prop-types';
import markdownIt from 'markdown-it';
import markdownEmoji from 'markdown-it-emoji';
import markdownHeadings from 'markdown-it-github-headings';
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
  if (linkifyHeadings) {
    return mdIt.use(markdownHeadings).use(markdownEmoji).use(markdownSanitizer);
  }
  return 
};

const stripHtml = (html) => {
  const regex = /<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi;
  return html ? html.replace(regex, '').trim() : '';
};

/**
 * Markdown Component
 */
const Markdown = ({ children, length, allowImages, renderAsPlaintext, linkifyHeadings }) => {
  let rendered;
  if (linkifyHeadings) {
    renderede = md.({ allowImages }).render(children || '');
  }
  let rendered = md({ allowImages }).render(children || '');
  let className = styles.markdownContent;

  if (length > 0) {
    rendered = truncate(rendered, length, { ellipsis: '…' });
  }

  if (renderAsPlaintext) {
    rendered = stripHtml(rendered);
    className = '';
  }

  return (
    <span
      className={className}
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
