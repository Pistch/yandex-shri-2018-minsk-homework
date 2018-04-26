import React, { Component } from 'react';
import PropTypes from 'prop-types';

class KeyboardHandler extends Component {
  constructor(props) {
    super(props);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onKeyPress);
  }

  onKeyPress(e) {
    const { keyCode } = e;

    switch (keyCode) {
      case 37:
        return this.props.onArrowLeft();
      case 38:
        return this.props.onArrowUp();
      case 39:
        return this.props.onArrowRight();
      case 40:
        return this.props.onArrowDown();
      case 27:
        return this.props.onEscape();
      default:
        return null;
    }
  }

  render() {
    if (this.props.mockElem) return <div onKeyUp={this.onKeyPress}>123</div>;
    return null;
  }
}

KeyboardHandler.propTypes = {
  onArrowRight: PropTypes.func,
  onArrowLeft: PropTypes.func,
  onArrowUp: PropTypes.func,
  onArrowDown: PropTypes.func,
  onEscape: PropTypes.func,
  mockElem: PropTypes.bool,
};

KeyboardHandler.defaultProps = {
  onArrowRight: () => {},
  onArrowLeft: () => {},
  onArrowUp: () => {},
  onArrowDown: () => {},
  onEscape: () => {},
  mockElem: false,
};

export default KeyboardHandler;
