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
      ref.current.removeEventListener('load', updateHeight, {
        capture: true,
      });
      window.removeEventListener('resize', updateHeight, { passive: true });
    }
  }, [])
  
  const [expandState, setExpandState] = useState('init') // init | expanding | complete
  const expand = () => {
    updateHeight()
    setExpandState('expanding')
  }
  const onExpandEnd = ({ propertyName }) => {
    setExpandState(currentExpandState => {
      if (currentExpandState === 'expanding' && propertyName === 'max-height') {
        return 'complete'
      }
      return currentExpandState
    })
  }
  
  const aboveLimit = scrollHeight > height;
  const limitHeight = aboveLimit ? height - minSlide : height;
  const style = {
    init: { maxHeight: limitHeight },
    expanding: { maxHeight: scrollHeight },
    complete: null
  }[expandState]

  return (
    <div ref={ref} className="expander" style={style} onTransitionEnd={onExpandEnd}>
      {children}
      {expandState !== 'complete' && aboveLimit && (
        <div className="expander-mask">
          {expandState !== 'expanding' && (
            <button onClick={expand} className="expander-button button-small button-tertiary">
              Show More
            </button>
          )}
        </div>
      )}
    </div>
  );
}

Expander.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.number.isRequired,
  minSlide: PropTypes.number,
};

Expander.defaultProps = {
  minSlide: 50,
};

export default Expander;
