import React from "react";
import PropTypes from "prop-types";
import PopoverWithButton from "./popover-with-button";
import ReactDOM from 'react-dom';

// https://github.com/trendmicro-frontend/react-dropdown/blob/master/src/DropdownMenu.jsx

class DropdownMenu extends React.Component {
  constructor(props){
    super(props);
    this.getFocusableMenuItems = this.getFocusableMenuItems.bind(this);
  }
  
  componentDidMount(){
    this.getFocusableMenuItems();
  }
  
  getFocusableMenuItems(){
    const node = ReactDOM.findDomNode(this);
    console.log('node', node);
    return Array.from(node.querySelectorAll
  }
  
  render(){
    const { contents, handleKeyPress, selected, togglePopover, updateSelected } = this.props;
    
    return (
      <ul className="pop-over mini-pop" tabIndex="0">
        {contents.map((item, index) => (
          <li
            className={
              "mini-pop-action" + (index === selected ? " selected" : "")
            }
            key={index}
            aria-selected={index == selected}
            onClick={() => {
              updateSelected(index);
              togglePopover();
            }}
            onKeyPress={() => {handleKeyPress()}}
            tabIndex="-1"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }
};

DropdownMenu.propTypes = {
  contents: PropTypes.node.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  selected: PropTypes.number.isRequired, // the index of the selected item
  togglePopover: PropTypes.func, // added dynamically from PopoverWithButton
  updateSelected: PropTypes.func.isRequired,
};

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      buttonContents: this.props.buttonContents
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateSelected = this.updateSelected.bind(this);
  }

  componentDidMount() {
    // set default menu item here
    // TO DO - set default menu item based on whether we're on a user or team page
  }

  handleKeyPress(e) {
    const { selected } = this.state;
    const { menuContents } = this.props.menuContents;

    if (e.keyCode === 38 && selected > 0) {
      console.log("pressed key down");
    } else if (e.keyCode === 40 && selected < menuContents.length - 1) {
      console.log("pressed key up");
    }
  }

  updateSelected(itemIndex) {
    this.setState({
      selected: itemIndex,
      buttonContents: this.props.menuContents[itemIndex]
    });
    // pass selected button back to onUpdate
    this.props.onUpdate(this.props.menuContents[itemIndex]);
  }

  render() {
    return (
      <PopoverWithButton
        buttonClass="button-small dropdown-btn user-or-team-toggle has-emoji"
        buttonText={this.state.buttonContents}
        containerClass="dropdown"
        dropdown={true}
        passToggleToPop
        onKeyDown={this.handleKeyPress}
      >
        <DropdownMenu
          contents={this.props.menuContents}
          selected={this.state.selected}
          updateSelected={this.updateSelected}
          handleKeyPress={this.handleKeyPress}
        />
      </PopoverWithButton>
    );
  }
}

Dropdown.propTypes = {
  buttonContents: PropTypes.node.isRequired,
  menuContents: PropTypes.node.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default Dropdown;
