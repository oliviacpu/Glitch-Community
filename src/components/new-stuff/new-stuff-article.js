import React from 'react';
import PropTypes from 'prop-types';

import Link from '../link';
import Markdown from '../text/markdown';
import Text from '../text/text';

import styles from './new-stuff-article.styl';

const NewStuffArticle = ({ title, body, link }) => (
  <article className={styles.article}>
    <h2 className={styles.title}>{title}</h2>
    <div className="body">
      <Markdown>{body}</Markdown>
    </div>
    {!!link && (
      <Text>
        <Link className="link" to={link}>
          Read the blog post →
        </Link>
      </Text>
    )}
  </article>
);

NewStuffArticle.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  link: PropTypes.string,
};

NewStuffArticle.defaultProps = {
  link: null,
};

export default NewStuffArticle;