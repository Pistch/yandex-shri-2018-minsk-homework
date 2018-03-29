import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Slideshow.module.css';

class Slideshow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moveX: 0,
      touchInitialPositionX: undefined,
      gesture: undefined,
    };
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentWillMount() {
    window.addEventListener('keyup', this.onKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onKeyPress);
  }

  onKeyPress(e) {
    const { keyCode } = e;

    switch (keyCode) {
      case 37:
      case 38:
        return this.props.previousPicture();
      case 39:
      case 40:
        return this.props.nextPicture();
      case 27:
        return this.props.close();
      default:
        return null;
    }
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

    this.setState({
      moveX: e.touches[0].clientX - this.state.touchInitialPositionX,
      moveY: e.touches[0].clientY - this.state.touchInitialPositionY,
    });
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

    this.setState({
      gesture,
      dX: undefined,
      dY: undefined,
    });
  }

  touchEnd() {
    const changeSlideFunction = this.state.moveX > 0 ? this.props.previousPicture : this.props.nextPicture,
      { gesture } = this.state;

    if (gesture === 'HORIZONTAL_SWIPE' && Math.abs(this.state.moveX) > this.props.width / 3) {
      changeSlideFunction();
    }

    if (gesture === 'VERTICAL_SWIPE' && -this.state.moveY > this.props.height / 3) {
      return this.props.close();
    }

    this.setState({
      touchInitialPositionX: undefined,
      moveX: 0,
      moveY: 0,
      gesture: undefined,
    });
  }

  renderPictureSequence() {
    const { pictures, selectedPictureIndex } = this.props,
      picturesQuantity = pictures.length,
      moveX = this.state.gesture === 'HORIZONTAL_SWIPE' ? this.state.moveX : 0,
      postiveMoveY = this.state.moveY < 0 ? this.state.moveY : 0,
      moveY = this.state.gesture === 'VERTICAL_SWIPE' ? postiveMoveY : 0,
      translateString = `calc(${-(100 * (selectedPictureIndex / picturesQuantity))}% + ${moveX}px), ${moveY}px`,
      opacity = this.state.gesture === 'VERTICAL_SWIPE' ? 1 + (moveY / this.props.height) : 1;

    return (
      <div
        className={styles.PictureSequenceContainer}
        style={{
          width: `${100 * picturesQuantity}%`,
          transform: `translate(${translateString})`,
        }}
      >
        {
          pictures.map((picture, i) => (
            <div className={styles.PictureContainer} key={picture.name}>
              <img
                src={Math.abs(i - selectedPictureIndex) <= 1 ? `pictures/${picture.name}` : ''}
                alt=""
                className={styles.Picture}
                style={{ opacity }}
              />
            </div>
          ))
        }
      </div>
    );
  }

  render() {
    const {
      nextPicture,
      previousPicture,
      close,
      mobile,
      orientation,
    } = this.props;

    return (
      <React.Fragment>
        <div className={styles.SlideshowOverlay}>
          {this.renderPictureSequence()}
        </div>
        <div
          className={`${styles.Controls}
            ${mobile ? styles.Mobile : styles.Desktop}
            ${orientation ? styles.Horizontal : styles.Vertical}
           `}
          onTouchStart={this.touchStart.bind(this)}
          onTouchMove={this.touchMove.bind(this)}
          onTouchEnd={this.touchEnd.bind(this)}
        >
          <button onClick={previousPicture} className={styles.Button}>&larr;</button>
          <button onClick={nextPicture} className={styles.Button}>&rarr;</button>
        </div>
        <button onClick={close} className={`${styles.Button} ${styles.CloseButton}`}>&times;</button>
      </React.Fragment>
    );
  }
}

Slideshow.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  selectedPictureIndex: PropTypes.number.isRequired,
  pictures: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  })).isRequired,
  previousPicture: PropTypes.func.isRequired,
  nextPicture: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  orientation: PropTypes.bool.isRequired,
  mobile: PropTypes.bool.isRequired,
};

export default Slideshow;
