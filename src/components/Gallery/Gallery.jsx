import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Gallery.module.css';

import GalleryItem from '../GalleryItem/GalleryItem';

import rowHeight from './rowHeight.json';

class Gallery extends Component {
  componentDidMount() {
    this.props.calculateViewportSize();
  }

  splitRows() {
    let structure = [],
      rowIndex = 0,
      minWidth = 0,
      maxWidth = 0,
      { minHeight, maxHeight } = this.resolveRowHeight();
    for (let i = 0, q = this.props.pictures.length; i < q; i++) {
      const picture = this.props.pictures[i];

      if (!(structure[rowIndex] instanceof Array)) {
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

  renderRow(rowData, key) {
    if (!rowData.pictures[0] || !rowData.pictures[1]) return null;
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
            onClick={() => this.props.focusPic(item.index)}
            key={item.name}
            height={rowData.height}
            width={(rowData.height / item.height) * item.width}
          />
        ))}
      </div>
    );
  }

  render() {
    if (!this.props.active) return null;

    if (this.props.mobile) {
      return (
        <div
          className={`
            ${styles.Gallery}
            ${styles.Mobile}
            ${this.props.orientation ? styles.Horizontal : styles.Vertical}
          `}
        >
          {
            this.props.pictures.map((item, i) => (
              <GalleryItem
                height={this.props.orientation ? this.props.height : (this.props.width / item.width) * item.height}
                width={this.props.orientation ? (this.props.height / item.height) * item.width : this.props.width}
                pictureUrl={`pictures/${item.name}`}
                onClick={() => this.props.focusPic(i)}
                key={item.name}
              />
            ))
          }
        </div>
      );
    }

    const structure = this.splitRows();

    return (
      <div className={styles.Gallery}>
        {structure.map((item, i) => this.renderRow(item, i))}
      </div>
    );
  }
}

Gallery.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  pictures: PropTypes.arrayOf(PropTypes.object).isRequired,
  focusPic: PropTypes.func.isRequired,
  calculateViewportSize: PropTypes.func.isRequired,
  orientation: PropTypes.bool.isRequired,
  mobile: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
};

export default Gallery;
