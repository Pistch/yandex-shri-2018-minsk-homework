import React from 'react';
import PropTypes from 'prop-types';

import styles from './GalleryItem.module.css';

function GalleryItem({
  height, width, pictureUrl, onClick,
}) {
  return (
    <div style={{ height, width }} className={styles.PreviewContainer} onClick={onClick}>
      <img src={pictureUrl} alt="" className={styles.Preview} />
    </div>
  );
}

GalleryItem.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  pictureUrl: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

GalleryItem.defaultProps = {
  height: 100,
  width: 100,
  onClick: () => {},
};

export default GalleryItem;
