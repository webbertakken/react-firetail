import { useAuth, useUser } from 'reactfire';
import { useState } from 'react';
import styles from './ProviderButton.module.scss';
import DynamicIcon from '../../../react-icons/DynamicIcon';
import { useDispatch } from 'react-redux';
import { userSignedIn } from '../../../../../user/logic/ducks/authDuck';
import { signInWithPopup } from 'firebase/auth';

const loadingDelay = async (delayMs = 100) => {
  return new Promise((resolve) => setTimeout(() => resolve('loading'), delayMs));
};

const ProviderButton = ({ name, provider, icon }) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  if (!auth) return <p>test</p>;

  const signInWithProvider = async () => {
    try {
      const action = signInWithPopup(auth, provider);
      const result = await Promise.race([loadingDelay()]);

      if (result === 'loading') setIsLoading(true);
      const credential = await action;

      console.log(credential);
      dispatch(userSignedIn(credential));
    } catch (error) {
      switch (error.code) {
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
          return; // No action required
        default:
          console.error('unhandled error', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button className="social" onClick={signInWithProvider}>
        {isLoading ? <DynamicIcon icon="VscLoading" className={styles.spin} /> : icon}
        <span>{name}</span>
      </button>
    </div>
  );
};

export default ProviderButton;
