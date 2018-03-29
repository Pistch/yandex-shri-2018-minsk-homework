import React, { Component } from 'react';
import { debounce } from 'lodash';

import styles from './App.module.css';

import Gallery from '../Gallery/Gallery';
import Slideshow from '../Slideshow/Slideshow';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedPic: null,
      pictures: [],
    };
  }

  componentWillMount() {
    this.loadPictures();
    this.getViewport();
    window.addEventListener('resize', debounce(this.getViewport.bind(this), 500), false);
  }

  getViewport() {
    this.setState({
      realWidth: document.documentElement.clientWidth,
      width: document.documentElement.clientWidth - 24,
      height: document.documentElement.clientHeight,
    });
  }

  async loadPictures() {
    const picturesQuery = await fetch('pictures.json'),
      pictures = await picturesQuery.json();

    this.setState({ pictures });
  }

  focusPic(no) {
    let newPictureIndex = no;
    if (newPictureIndex === this.state.pictures.length) newPictureIndex = 0;
    if (newPictureIndex === -1) newPictureIndex = this.state.pictures.length - 1;

    this.setState({
      focusedPic: newPictureIndex,
    });
  }

  unfocusPic() {
    this.setState({
      focusedPic: null,
    });
  }

  render() {
    const mobile = this.state.realWidth < 768,
      width = mobile ? this.state.realWidth : this.state.width;

    return (
      <div className={styles.App}>
        {this.state.focusedPic !== null && (
          <Slideshow
            pictures={this.state.pictures}
            selectedPictureIndex={this.state.focusedPic}
            nextPicture={this.focusPic.bind(this, this.state.focusedPic + 1)}
            previousPicture={this.focusPic.bind(this, this.state.focusedPic - 1)}
            close={this.unfocusPic.bind(this)}
            width={width}
            height={this.state.height}
            mobile={mobile}
            orientation={this.state.width > this.state.height}
          />
        )}
        <Gallery
          pictures={this.state.pictures}
          focusPic={this.focusPic.bind(this)}
          width={width}
          height={this.state.height}
          mobile={mobile}
          orientation={this.state.width > this.state.height}
          calculateViewportSize={this.getViewport.bind(this)}
          active={this.state.focusedPic === null}
        />
      </div>
    );
  }
}

export default App;
