import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

import styles from './App.module.css';

import { getViewport } from '../../store/actions';
import Gallery from '../Gallery/Gallery';
import Slideshow from '../Slideshow/Slideshow';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

class App extends Component {
  componentWillMount() {
    this.props.getViewport();
    window.addEventListener('resize', debounce(this.props.getViewport, 500), false);
  }

  renderLoading() {
    if (this.props.pictures[0]) return null;
    return (
      <div className={styles.LoadingContainer}>
        <p className={styles.LoadingText}>Пожалуйста, подождите</p>
        <LoadingIndicator />
      </div>
    );
  }

  render() {
    const width = this.props.mobile ? this.props.realWidth : this.props.width;

    return (
      <div className={styles.App}>
        {this.renderLoading()}
        {this.props.screen === 'slideshow' && (
          <Slideshow
            width={width}
            height={this.props.height}
            mobile={this.props.mobile}
            orientation={this.props.orientation}
          />
        )}
        {this.props.screen === 'gallery' && (
          <Gallery
            width={width}
            height={this.props.height}
            mobile={this.props.mobile}
            orientation={this.props.orientation}
          />
        )}
      </div>
    );
  }
}

App.propTypes = {
  pictures: PropTypes.arrayOf(PropTypes.object).isRequired,
  realWidth: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  orientation: PropTypes.bool.isRequired,
  mobile: PropTypes.bool.isRequired,
  screen: PropTypes.string.isRequired,
  getViewport: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return ({
    pictures: state.pictures.pictures,
    realWidth: state.appearance.width,
    width: state.appearance.width - 24,
    height: state.appearance.height,
    orientation: state.appearance.orientation,
    mobile: state.appearance.mobile,
    screen: state.appearance.screen,
  });
}

export default connect(mapStateToProps, { getViewport })(App);
