import React from 'react';

import styles from './LoadingIndicator.module.css';
import bc from './bc.svg';

function LoadingIndicator() {
  return (
    <div className={styles.container}>
      <div className={styles.oneCircleContainer}>
        <img src={bc} alt="" />
      </div>
      <div className={styles.oneCircleContainer}>
        <img src={bc} alt="" />
      </div>
      <div className={styles.oneCircleContainer}>
        <img src={bc} alt="" />
      </div>
      <div className={styles.oneCircleContainer}>
        <img src={bc} alt="" />
      </div>
      <div className={styles.oneCircleContainer}>
        <img src={bc} alt="" />
      </div>
    </div>
  );
}

export default LoadingIndicator;
