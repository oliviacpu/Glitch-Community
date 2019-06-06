import React from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import { throttle } from 'lodash';
import { getContrastWithDarkText, getContrastWithLightText } from 'Models/collection';

import TextInput from 'Components/inputs/text-input';
import PopoverWithButton from './popover-with-button';

const validHex = (hex) => {
  const re = /[0-9A-Fa-f]{6}/g;
  if (re.test(hex)) {
    return true;
  }
  return false;
};

const isGoodColorContrast = (hex) => {
  return getContrastWithDarkText(hex) >= 4.5 || getContrastWithLightText(hex) >= 4.5;
};

class EditCollectionColorPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: this.props.initialColor,
      color: this.props.initialColor,
      error: null,
    };

    this.onClick = this.onClick.bind(this);
    this.handleChange = this.handleChange.bind(this); // for when user enters in custom hex
    this.keyPress = this.keyPress.bind(this); // handles enter key for custom hex
    this.getRandomColor = this.getRandomColor.bind(this); // gets random color
    this.changeColor = throttle(this.changeColor.bind(this), 100); // get update from system color picker
    this.update = this.props.updateColor;
  }

  onClick() {
    this.props.togglePopover();
  }

  getRandomColor() {
    const newCoverColor = randomColor({ luminosity: 'light' });
    if (!isGoodColorContrast(newCoverColor)) {
      this.getRandomColor();
      return;
    }
    this.setState({ color: newCoverColor, query: newCoverColor, error: null });
    this.update(newCoverColor);
  }

  handleChange(query) {
    this.setState({ error: null, query });
    if (query && query.length <= 7) {
      const hexIsValid = validHex(query);
      if (!hexIsValid) {
        this.setState({ error: 'Invalid Hex' });
        return;
      }
      const hexIsGoodColorContrast = isGoodColorContrast(query);
      if (!hexIsGoodColorContrast) {
        this.setState({ error: 'This color might make text hard to read, try another!' });
        return;
      }

      if (query[0] !== '#') {
        query = `#${query}`;
      }
      this.setState({ color: query, error: null });
      this.update(query);
    } else {
      // user has cleared the input field
      this.setState({ error: 'Invalid Hex' });
    }
  }

  keyPress(e) {
    if (e.which === 13 || e.keyCode === 13) {
      // enter key pressed - dismiss pop-over
      this.props.togglePopover();
    } else {
      this.setState({ error: null });
    }
  }

  changeColor(color) {
    this.setState({ color });
    this.setState({ query: color });
    this.update(color);
  }

  render() {
    return (
      <dialog className="pop-over edit-collection-color-pop" ref={this.props.focusFirstElement}>
        <section className="pop-over-info">
          <input
            className="color-picker"
            type="color"
            value={this.state.color}
            onChange={(e) => this.changeColor(e.target.value)}
            style={{ backgroundColor: this.state.color }}
            id="color-picker"
          />

          <div className="custom-color-input">
            <TextInput
              opaque
              value={this.state.query}
              onChange={this.handleChange}
              onKeyPress={this.keyPress}
              placeholder="Hex"
              labelText="Custom color hex"
              error={this.state.error || null}
            />
          </div>
        </section>

        <section className="pop-over-info">
          <button className="random-color-btn button-tertiary" onClick={this.getRandomColor}>
            Random <span className="emoji bouquet" />
          </button>
        </section>
      </dialog>
    );
  }
}

EditCollectionColorPop.propTypes = {
  updateColor: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired,
  focusFirstElement: PropTypes.func.isRequired,
};

const EditCollectionColor = ({ update, initialColor, ...props }) => (
  <PopoverWithButton containerClass="edit-collection-color-btn" buttonClass="add-project" buttonText="Color">
    {({ togglePopover, focusFirstElement }) => (
      <EditCollectionColorPop
        {...props}
        updateColor={update}
        initialColor={initialColor}
        togglePopover={togglePopover}
        focusFirstElement={focusFirstElement}
      />
    )}
  </PopoverWithButton>
);

EditCollectionColor.propTypes = {
  update: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired,
};

export default EditCollectionColor;
