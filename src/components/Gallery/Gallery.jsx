import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './Gallery.module.css';

import GalleryItem from '../GalleryItem/GalleryItem';
import { fetchNext, selectPicture, openSlideshow } from '../../store/actions';
import rowHeight from './rowHeight.json';

class Gallery extends Component {
  constructor(props) {
    super(props);

    this.selectPicture = this.selectPicture.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillMount() {
    if (!this.props.pictures[0] && !this.props.loading) this.props.fetchNext(0, this.props.picturesToLoad);
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const
      scroll = !this.props.orientation ? window.pageYOffset : window.pageXOffset,
      possibleScroll = !this.props.orientation ? this.scrollContainer.scrollHeight : this.scrollContainer.scrollWidth,
      leftToScroll = !this.props.orientation ?
        possibleScroll - scroll - this.props.height :
        possibleScroll - scroll - this.props.width,
      threshold = this.props.mobile ? this.props.height * 2 : (this.props.height / 3);

    if (!this.props.loading && leftToScroll < threshold) {
      this.props.fetchNext(this.props.pictures.length, this.props.picturesToLoad);
    }
  }

  splitRows() {
    let structure = [],
      rowIndex = 0,
      minWidth = 0,
      maxWidth = 0,
      { minHeight, maxHeight } = this.resolveRowHeight();
    for (let i = 0, q = this.props.pictures.length; i < q; i++) {
      const picture = this.props.pictures[i];

      if (!structure[rowIndex]) {
        structure.push({
          height: 0,
          pictures: [],
        });
      }

      structure[rowIndex].pictures.push({ ...picture, index: i });

      if (maxWidth < this.props.width || i === q - 1) {
        minWidth += (picture.width + 14) * (minHeight / picture.height);
        maxWidth += (picture.width + 14) * (maxHeight / picture.height);
      }

      if (maxWidth >= this.props.width || i === q - 1) {
        structure[rowIndex].height = (this.props.width / minWidth) * minHeight;
        minWidth = 0;
        maxWidth = 0;
        rowIndex++;
      }
    }
    return structure;
  }

  resolveRowHeight() {
    let { width } = this.props,
      widthFit = Object.keys(rowHeight).map(item => parseInt(item, 10)).filter(item => item <= width);

    return rowHeight[Math.max(...widthFit)];
  }

  selectPicture(i) {
    this.props.selectPicture(i);
    this.props.openSlideshow();
  }

  renderRow(rowData, key) {
    if (!rowData.pictures[0]) return null;
    return (
      <div
        className={styles.GalleryRow}
        key={key}
        style={{
          width: this.props.width,
        }}
      >
        {rowData.pictures.map(item => (
          <GalleryItem
            pictureUrl={`pictures/${item.name}`}
            onClick={() => this.selectPicture(item.index)}
            key={item.name}
            height={rowData.height}
            width={(rowData.height / item.height) * item.width}
          />
        ))}
      </div>
    );
  }

  render() {
    if (this.props.mobile) {
      return (
        <div
          className={`
            ${styles.Gallery}
            ${styles.Mobile}
            ${this.props.orientation ? styles.Horizontal : styles.Vertical}
          `}
          ref={(c) => { this.scrollContainer = c; }}
        >
          {
            this.props.pictures.map((item, i) => (
              <GalleryItem
                height={this.props.orientation ? this.props.height : (this.props.width / item.width) * item.height}
                width={this.props.orientation ? (this.props.height / item.height) * item.width : this.props.width}
                pictureUrl={`pictures/${item.name}`}
                onClick={() => this.selectPicture(i)}
                key={`${item.name}${Math.random()}`}
              />
            ))
          }
        </div>
      );
    }

    const structure = this.splitRows();

    return (
      <div className={styles.Gallery} ref={(c) => { this.scrollContainer = c; }}>
        {structure.map((item, i) => this.renderRow(item, i))}
      </div>
    );
  }
}

Gallery.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  pictures: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectPicture: PropTypes.func.isRequired,
  fetchNext: PropTypes.func.isRequired,
  openSlideshow: PropTypes.func.isRequired,
  orientation: PropTypes.bool.isRequired,
  mobile: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  picturesToLoad: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return ({
    pictures: state.pictures.pictures,
    loading: state.pictures.fetching,
    selectedPictureIndex: state.pictures.selectedPictureIndex,
    picturesToLoad: state.appearance.mobile ? 5 : 15,
  });
}

export default connect(mapStateToProps, { fetchNext, selectPicture, openSlideshow })(Gallery);

export const TestGallery = Gallery;
