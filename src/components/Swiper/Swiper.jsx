import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Swiper extends Component {
  constructor(props) {
    super(props);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.touchMove = this.touchMove.bind(this);
  }

  touchStart(e) {
    this.setState({
      touchInitialPositionX: e.touches[0].clientX,
      touchInitialPositionY: e.touches[0].clientY,
    });
  }

  touchMove(e) {
    if (!this.state.gesture) {
      return this.resolveGesture(
        e.touches[0].clientX,
        e.touches[0].clientY,
      );
    }

    const relativeMove = {
      moveX: e.touches[0].clientX - this.state.touchInitialPositionX,
      moveY: e.touches[0].clientY - this.state.touchInitialPositionY,
    };

    this.props.touchMoveRelativePosition(relativeMove);
    this.setState(relativeMove);
  }

  resolveGesture(x, y) {
    if (!this.state.dX && !this.state.dY) {
      return this.setState({
        dX: x - this.state.touchInitialPositionX,
        dY: y - this.state.touchInitialPositionY,
      });
    }

    const dX = Math.abs(this.state.dX),
      dY = Math.abs(this.state.dY);

    const verticalGestureFlag = dY > dX * 1.7,
      horizontalGestureFlag = dX > dY * 1.7;

    if (!verticalGestureFlag && !horizontalGestureFlag) {
      return this.setState({
        dX: x - this.state.touchInitialPositionX,
        dY: y - this.state.touchInitialPositionY,
      });
    }

    const gesture = verticalGestureFlag ? 'VERTICAL_SWIPE' : 'HORIZONTAL_SWIPE';

    this.props.setGesture(gesture);

    this.setState({
      gesture,
      dX: undefined,
      dY: undefined,
      moveX: x - this.state.touchInitialPositionX,
      moveY: y - this.state.touchInitialPositionY,
    });
  }

  touchEnd() {
    const horizontalSwipeFunction = this.state.moveX > 0 ? this.props.onSwipeRight : this.props.onSwipeLeft,
      verticalSwipeFunction = this.state.moveY < 0 ? this.props.onSwipeUp : this.props.onSwipeDown,
      { gesture } = this.state,
      verticalThreshold = (this.touchContainer.clientHeight || this.props.style.height) / 3,  // Why? For teh glory
      horizontalThreshold = (this.touchContainer.clientWidth || this.props.style.width) / 3;  // of satan, of course...

    if (gesture === 'HORIZONTAL_SWIPE' && Math.abs(this.state.moveX) > horizontalThreshold) {
      horizontalSwipeFunction();
    }

    if (gesture === 'VERTICAL_SWIPE' && Math.abs(this.state.moveY) > verticalThreshold) {
      verticalSwipeFunction();
    }

    this.props.setGesture(undefined);
    this.props.touchMoveRelativePosition({
      moveX: 0,
      moveY: 0,
    });

    this.setState({
      touchInitialPositionX: undefined,
      moveX: 0,
      moveY: 0,
      gesture: undefined,
    });
  }

  render() {
    return (
      <div
        className={this.props.className}
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}
        onTouchEnd={this.touchEnd}
        ref={(c) => { this.touchContainer = c; }}
        style={this.props.style}
      >
        {this.props.children}
      </div>
    );
  }
}

Swiper.propTypes = {
  className: PropTypes.string,
  touchMoveRelativePosition: PropTypes.func,
  setGesture: PropTypes.func,
  onSwipeRight: PropTypes.func,
  onSwipeLeft: PropTypes.func,
  onSwipeUp: PropTypes.func,
  onSwipeDown: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  style: PropTypes.shape({    // mock for tests
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

Swiper.defaultProps = {
  className: '',
  onSwipeRight: () => {},
  onSwipeLeft: () => {},
  onSwipeUp: () => {},
  onSwipeDown: () => {},
  touchMoveRelativePosition: () => {},
  setGesture: () => {},
  children: null,
  style: null,
};

export default Swiper;
