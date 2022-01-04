import { useAuth } from 'reactfire';
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { loadingDelay } from '../../../../utils/loadingDelay';
import Spinner from 'core/ui/react-icons/Spinner';

const ProviderButton = ({ name, provider, icon }) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signInWithProvider = async () => {
    try {
      const action = signInWithPopup(auth, provider);
      const result = await Promise.race([loadingDelay(), action]);

      if (result === 'loading') {
        setIsLoading(true);
        await action;
      }
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
        {isLoading ? <Spinner /> : icon}
        <span>{name}</span>
      </button>
    </div>
  );
};

export default ProviderButton;
