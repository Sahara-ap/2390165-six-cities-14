import styles from './placeholder.module.css';

import { useEffect } from 'react';

function PlaceHolder(): JSX.Element | null {
  const message = 'Loading...';

  function handleDocumentClick(event: MouseEvent) {
    event.preventDefault();
  }

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return(() => document.removeEventListener('click', handleDocumentClick));
  }, []);

  return (
    <p className={`${styles.message}`}>{message}</p>
  );
}

export { PlaceHolder };
