import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import { throttle } from 'lodash';

import TextInput from 'Components/inputs/text-input';
import { PopoverWithButton, PopoverDialog } from 'Components/popover';

const validHex = (hex) => {
  const re = /[0-9A-Fa-f]{6}/g;
  if (re.test(hex)) {
    return true;
  }
  return false;
};

function EditCollectionColorPop({ initialColor, updateColor, togglePopover }) {
  const [color, setColor] = useState(initialColor);
  const [hex, setHex] = useState(initialColor);
  const [hexInvalid, setHexInvalid] = useState(false);

  const changeColor = useMemo(() =>
    throttle((color) => {
      setColor(color);
      setHex(color);
      updateColor(color);
    }, []),
  );

  const setRandomColor = () => {
    changeColor(randomColor({ luminosity: 'light' }));
  };

  const changeHex = (hex) => {
    setHex(hex)
    setHexInvalid(false)
    if (hex && hex.length <= 7) {
      if (validHex(hex)) {
        hex = hex.replace(/^#/,'')
        setColor(hex)
        update(hex)
      } else {
        this.setState({ error: true });
      }
    } else {
      // user has cleared the input field
      this.setState({ error: true });
    }
  };

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      togglePopover();
    } else {
      setHexInvalid(false);
    }
  };

  return (
    <PopoverDialog>
      <PopoverInfo>
        <input
          className="color-picker"
          type="color"
          value={color}
          onChange={(e) => changeColor(e.target.value)}
          style={{ backgroundColor: color }}
          id="color-picker"
        />

        <div className="custom-color-input">
          <TextInput
            opaque
            value={hex}
            onChange={changeHex}
            onKeyPress={keyPress}
            placeholder="Hex"
            labelText="Custom color hex"
            error={hexInvalid ? 'Invalid Hex' : null}
          />
        </div>
      </PopoverInfo>

      <PopoverActions>
        <Button size="small" type="tertiary" onClick={setRandomColor}>
          Random <Emoji name="bouquet" />
        </Button>
      </PopoverActions>
    </PopoverDialog>
  );
}

class _EditCollectionColorPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: this.props.initialColor,
      color: this.props.initialColor,
      error: false,
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

  handleChange(query) {
    this.setState({ error: false, query });
    if (query && query.length <= 7) {
      if (validHex(query)) {
        if (query[0] !== '#') {
          query = `#${query}`;
        }
        this.setState({ color: query });
        this.update(query);
      } else {
        this.setState({ error: true });
      }
    } else {
      // user has cleared the input field
      this.setState({ error: true });
    }
  }

  keyPress(e) {
    if (e.which === 13 || e.keyCode === 13) {
      // enter key pressed - dismiss pop-over
      this.props.togglePopover();
    } else {
      this.setState({ error: false });
    }
  }

  changeColor(color) {
    this.setState({ color });
    this.setState({ query: color });
    this.update(color);
  }

  render() {
    return;
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
CollectionColor;
