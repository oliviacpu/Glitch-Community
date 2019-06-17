import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Expander = ({ children, height, minSlide }) => {
  const ref = useRef()
  
  const [scrollHeight, setScrollHeight] = useState(Infinity)
  const updateHeight = () => {
    setScrollHeight(ref.current.scrollHeight)
  }
  useEffect(updateHeight, [children]);
  
  useEffect(() => {
    ref.current.addEventListener('load', updateHeight, {
      capture: true,
    });
    window.addEventListener('resize', updateHeight, { passive: true });
    return () => {
      
    }
  }, [])
}


export default class Expander extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedExpanding: false,
      doneExpanding: false,
      scrollHeight: Infinity,
    };
    this.ref = React.createRef();
    this.updateHeight = this.updateHeight.bind(this);
  }

  componentDidMount() {
    this.updateHeight();
    this.ref.current.addEventListener('load', this.updateHeight, {
      capture: true,
    });
    window.addEventListener('resize', this.updateHeight, { passive: true });
  }

  componentDidUpdate() {
    this.updateHeight();
  }

  componentWillUnmount() {
    this.ref.current.removeEventListener('load', this.updateHeight, {
      capture: true,
    });
    window.removeEventListener('resize', this.updateHeight, { passive: true });
  }

  onExpandEnd(evt) {
    if (evt.propertyName === 'max-height') {
      this.setState({ doneExpanding: true });
    }
  }

  expand() {
    this.updateHeight();
    this.setState({ startedExpanding: true });
  }

  updateHeight() {
    const { scrollHeight } = this.ref.current;
    if (scrollHeight !== this.state.scrollHeight) {
      this.setState({ scrollHeight });
    }
  }

  render() {
    const { startedExpanding, doneExpanding, scrollHeight } = this.state;
    const aboveLimit = scrollHeight > this.props.height;
    const limitHeight = aboveLimit ? this.props.height - this.props.minSlide : this.props.height;
    const maxHeight = startedExpanding ? scrollHeight : limitHeight;
    const style = !doneExpanding ? { maxHeight } : null;
    return (
      <div ref={this.ref} className="expander" style={style} onTransitionEnd={startedExpanding ? this.onExpandEnd.bind(this) : null}>
        {this.props.children}
        {!doneExpanding && aboveLimit && (
          <div className="expander-mask">
            {!startedExpanding && (
              <button onClick={this.expand.bind(this)} className="expander-button button-small button-tertiary">
                Show More
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}

Expander.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.number.isRequired,
  minSlide: PropTypes.number,
};

Expander.defaultProps = {
  minSlide: 50,
};
