import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import randomColor from 'randomcolor';
import { sample } from 'lodash';

import Heading from 'Components/text/heading';
import Link from 'Components/link';
import QuestionItem from './item';

import ErrorBoundary from '../../presenters/includes/error-boundary';
import { captureException } from '../../utils/sentry';
import { useAPI } from '../../state/api';
import styles from './questions.styl';

const kaomojis = ['八(＾□＾*)', '(ノ^_^)ノ', 'ヽ(*ﾟｰﾟ*)ﾉ', '♪(┌・。・)┌', 'ヽ(๏∀๏ )ﾉ', 'ヽ(^。^)丿'];

const QuestionTimer = ({ animating, callback }) => (
  <div className={styles.loaderPie} title="Looking for more questions...">
    <div className={styles.leftSide}>
      <div className={classnames(styles.slice, animating && styles.animated)} onAnimationEnd={callback} />
    </div>
    <div className={styles.rightSide}>
      <div className={classnames(styles.slice, animating && styles.animated)} />
    </div>
  </div>
);
QuestionTimer.propTypes = {
  animating: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
};

async function load(api, max) {
  try {
    const { data } = await api.get('projects/questions');
    const questions = data
      .map((q) => JSON.parse(q.details))
      .filter((q) => !!q)
      .slice(0, max)
      .map((question) => {
        const [colorInner, colorOuter] = randomColor({
          luminosity: 'light',
          count: 2,
        });
        return { colorInner, colorOuter, ...question };
      });
    return {
      kaomoji: sample(kaomojis),
      questions,
      loading: false,
    };
  } catch (error) {
    console.error(error);
    captureException(error);
    return { loading: false };
  }
}

function useRepeatingEffect(effectHandler, dependencies) {
  const [counter, setCounter] = useState(0);
  useEffect(effectHandler, [...dependencies, counter]);
  const increment = () => setCounter((x) => x + 1);
  return increment;
}

function Questions({ max }) {
  const api = useAPI();
  const [{ kaomoji, loading, questions }, setState] = useState({
    kaomoji: '',
    loading: true,
    questions: [],
  });
  const reload = useRepeatingEffect(() => {
    load(api, max).then(setState);
  }, []);

  return (
    <section className={styles.container}>
      <Heading tagName="h2">
        <Link to="/questions">Help Others, Get Thanks →</Link> <QuestionTimer animating={!loading} callback={reload} />
      </Heading>
      <div>
        {questions.length ? (
          <ErrorBoundary>
            <ul className={styles.questionsContainer}>
              {questions.map((question) => (
                <li key={question.questionId}>
                  <QuestionItem {...question} />
                </li>
              ))}
            </ul>
          </ErrorBoundary>
        ) : (
          <>
            {kaomoji} Looks like nobody is asking for help right now. {/* TODO: 'general' prop on Link? */}
            <Link className="general-link" to="/help/how-can-i-get-help-with-code-in-my-project/">
              Learn about helping
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

Questions.propTypes = {
  max: PropTypes.number,
};
Questions.defaultProps = {
  max: 3,
};

export default Questions;
