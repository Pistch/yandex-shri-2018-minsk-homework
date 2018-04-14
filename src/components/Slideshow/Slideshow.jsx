import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchNext, selectPicture, closeSlideshow } from '../../store/actions';

import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

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
    this.nextPicture = this.nextPicture.bind(this);
    this.previousPicture = this.previousPicture.bind(this);
    this.close = this.close.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
  }

  componentWillMount() {
    if (!this.props.pictures[0]) this.props.fetchNext(0, this.props.picturesToLoad);
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
        return this.previousPicture();
      case 39:
      case 40:
        return this.nextPicture();
      case 27:
        return this.close();
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
    const changeSlideFunction = this.state.moveX > 0 ? this.previousPicture : this.nextPicture,
      { gesture } = this.state;

    if (gesture === 'HORIZONTAL_SWIPE' && Math.abs(this.state.moveX) > this.props.width / 3) {
      changeSlideFunction();
    }

    if (gesture === 'VERTICAL_SWIPE' && -this.state.moveY > this.props.height / 3) {
      return this.close();
    }

    this.setState({
      touchInitialPositionX: undefined,
      moveX: 0,
      moveY: 0,
      gesture: undefined,
    });
  }

  nextPicture() {
    if (this.props.pictures.length - 1 === this.props.selectedPictureIndex) return;
    if (!this.props.loading &&
      this.props.pictures.length < this.props.selectedPictureIndex + this.props.picturesToLoad) {
      this.props.fetchNext(this.props.pictures.length);
    }
    this.props.selectPicture(this.props.selectedPictureIndex + 1, this.props.picturesToLoad);
  }

  previousPicture() {
    if (!this.props.selectedPictureIndex) return;
    this.props.selectPicture(this.props.selectedPictureIndex - 1, this.props.picturesToLoad);
  }

  close() {
    this.props.closeSlideshow();
  }

  renderPictureSequence() {
    const { pictures, selectedPictureIndex } = this.props,
      picturesQuantity = pictures.length,
      moveX = this.state.gesture === 'HORIZONTAL_SWIPE' ? this.state.moveX : 0,
      positiveMoveY = this.state.moveY < 0 ? this.state.moveY : 0,
      moveY = this.state.gesture === 'VERTICAL_SWIPE' ? positiveMoveY : 0,
      translateString = `calc(${-(100 * (selectedPictureIndex / picturesQuantity))}% + ${moveX}px), ${moveY}px`,
      opacity = this.state.gesture === 'VERTICAL_SWIPE' ? 1 + (moveY / this.props.height) : 1;

    const row = pictures.map((picture, i) => (
      <div className={styles.PictureContainer} key={`${picture.name}${Math.random()}`}>
        <img
          src={Math.abs(i - selectedPictureIndex) <= 1 ? `pictures/${picture.name}` : ''}
          alt=""
          className={styles.Picture}
          style={{ opacity }}
        />
      </div>
    ));

    if (this.props.loading) {
      row.push((
        <div className={styles.PictureContainer} key={Math.random()}>
          <LoadingIndicator />
        </div>
      ));
    }

    return (
      <div
        className={styles.PictureSequenceContainer}
        style={{
          width: `${100 * picturesQuantity}%`,
          transform: `translate(${translateString})`,
        }}
      >
        {row}
      </div>
    );
  }

  render() {
    const { mobile, orientation, selectedPictureIndex } = this.props,
      picsQuantity = this.props.pictures.length;

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
          onTouchStart={this.touchStart}
          onTouchMove={this.touchMove}
          onTouchEnd={this.touchEnd}
        >
          {
            selectedPictureIndex ?
              (<button onClick={this.previousPicture} className={styles.Button}>&larr;</button>) :
              (<span />)
          }
          {
            selectedPictureIndex !== picsQuantity - 1 ?
              (<button onClick={this.nextPicture} className={styles.Button}>&rarr;</button>) :
              (<span />)
          }
        </div>
        <button onClick={this.close} className={`${styles.Button} ${styles.CloseButton}`}>&times;</button>
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
  loading: PropTypes.bool.isRequired,
  closeSlideshow: PropTypes.func.isRequired,
  orientation: PropTypes.bool.isRequired,
  mobile: PropTypes.bool.isRequired,
  fetchNext: PropTypes.func.isRequired,
  selectPicture: PropTypes.func.isRequired,
  picturesToLoad: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return ({
    pictures: state.pictures.pictures,
    loading: state.pictures.fetching,
    selectedPictureIndex: state.pictures.selectedPictureIndex,
    picturesToLoad: state.appearance.mobile ? 3 : 5,
  });
}

export default connect(mapStateToProps, { fetchNext, selectPicture, closeSlideshow })(Slideshow);
