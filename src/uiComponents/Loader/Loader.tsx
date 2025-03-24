import React from 'react';
import { PuffLoader } from 'react-spinners';
import styles from './loader.module.css';

interface LoaderProps {
  size?: number;
  color?: string;
  loading?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 40,
  color = 'var(--color-purple)',
  loading = true,
}) => {
  return (
    <div className={styles.loaderContainer}>
      <PuffLoader color={color} size={size} loading={loading} aria-label="Loading Spinner" />
    </div>
  );
};

export default Loader;
