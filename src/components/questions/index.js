import React from 'react';
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
import styles from '../questions.styl';

const kaomojis = ['八(＾□＾*)', '(ノ^_^)ノ', 'ヽ(*ﾟｰﾟ*)ﾉ', '♪(┌・。・)┌', 'ヽ(๏∀๏ )ﾉ', 'ヽ(^。^)丿'];

// TODO: story
export const QuestionTimer = ({ animating, callback }) => (
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

async function load() {
    try {
      const { data } = await this.props.api.get('projects/questions');
      const questions = data
        .map((q) => JSON.parse(q.details))
        .filter((q) => !!q)
        .slice(0, this.props.max)
        .map((question) => {
          const [colorInner, colorOuter] = randomColor({
            luminosity: 'light',
            count: 2,
          });
          return { colorInner, colorOuter, ...question };
        });
      this.setState({
        kaomoji: sample(kaomojis),
        questions,
        loading: false
      });
    } catch (error) {
      console.error(error);
      captureException(error);
    }
    
  }

class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kaomoji: '',
      loading: true,
      questions: [],
    };
  }

  componentDidMount() {
    this.load();
  }

  async load() {
        this.setState({ loading: true });
    await load()
    this.setState({ loading: false });
  }

  render() {
    const { kaomoji, loading, questions } = this.state;
    return (
      <section className="questions">
        <Heading tagName="h2">
          <Link to="/questions">Help Others, Get Thanks →</Link> <QuestionTimer animating={!loading} callback={() => this.load()} />
        </Heading>
        <article className="projects">
          {questions.length ? (
            <ErrorBoundary>
              <ul className="projects-container">
                {questions.map((question) => (
                  <li key={question.questionId}>
                    <QuestionItem {...question} />
                  </li>
                ))}
              </ul>
            </ErrorBoundary>
          ) : (
            <>
              {kaomoji} Looks like nobody is asking for help right now.{' '}
              <Link className="general-link" to="/help/how-can-i-get-help-with-code-in-my-project/">
                Learn about helping
              </Link>
            </>
          )}
        </article>
      </section>
    );
  }
}
Questions.propTypes = {
  max: PropTypes.number,
};
Questions.defaultProps = {
  max: 3,
};

const QuestionsWrap = (props) => {
  const api = useAPI();
  return <Questions {...props} api={api} />;
};

export default QuestionsWrap;
