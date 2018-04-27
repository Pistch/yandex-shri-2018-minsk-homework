import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchNext, selectPicture, closeSlideshow } from '../../store/actions';

import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import Swiper from '../Swiper/Swiper';
import KeyboardHandler from '../KeyboardHandler/KeyboardHandler';

import styles from './Slideshow.module.css';

class Slideshow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moveX: 0,
      moveY: 0,
    };
    this.nextPicture = this.nextPicture.bind(this);
    this.previousPicture = this.previousPicture.bind(this);
    this.close = this.close.bind(this);
    this.changeSlidePosition = this.changeSlidePosition.bind(this);
    this.setGesture = this.setGesture.bind(this);
  }

  componentWillMount() {
    if (!this.props.pictures[0]) this.props.fetchNext(0, this.props.picturesToLoad);
  }

  setGesture(gesture) {
    this.setState({ gesture });
  }

  changeSlidePosition(position) {
    this.setState(position);
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
        <KeyboardHandler
          onArrowDown={this.nextPicture}
          onArrowRight={this.nextPicture}
          onArrowUp={this.previousPicture}
          onArrowLeft={this.previousPicture}
          onEscape={this.close}
        />
        <div className={styles.SlideshowOverlay}>
          {this.renderPictureSequence()}
        </div>
        <Swiper
          className={`${styles.Controls}
            ${mobile ? styles.Mobile : styles.Desktop}
            ${orientation ? styles.Horizontal : styles.Vertical}
           `}
          onSwipeRight={this.previousPicture}
          onSwipeLeft={this.nextPicture}
          onSwipeUp={this.close}
          setGesture={this.setGesture}
          touchMoveRelativePosition={this.changeSlidePosition}
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
        </Swiper>
        <button onClick={this.close} className={`${styles.Button} ${styles.CloseButton}`}>&times;</button>
      </React.Fragment>
    );
  }
}

Slideshow.propTypes = {
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

export const TestSlideshow = Slideshow;
