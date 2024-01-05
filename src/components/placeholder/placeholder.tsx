import styles from './placeholder.module.css';
import preloader from '../../../public/img/preloader.svg';

import { useEffect } from 'react';

function PlaceHolder(): JSX.Element | null {

  function handleDocumentClick(event: MouseEvent) {
    event.preventDefault();
  }

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return (() => document.removeEventListener('click', handleDocumentClick));
  }, []);


  return (

    <div className={styles.preloader}>
      <img src={preloader} alt="Preloader" />
    </div>

  );
}

export { PlaceHolder };
