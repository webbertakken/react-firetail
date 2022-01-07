import { useAuth } from 'reactfire';
import { ComponentType, useMemo, useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { loadingDelay } from '../../../../utils/loadingDelay';
import Spinner from '../../../react-icons/Spinner';
import DynamicIcon from '../../../react-icons/DynamicIcon';
import getIconPropsForProviderId from '../getIconPropsForProviderId';
import { AuthProvider } from 'firebase/auth';
import { useNotification } from '../../../../hooks/useNotification';

interface Props {
  name: string;
  provider: AuthProvider;
  button?: ComponentType<any>;
}

/**
 * Button that signs you in using an IdentityProvider.
 *
 * Usage example:
 *    import { GoogleAuthProvider } from 'firebase/auth';
 *    <AuthProviderButton name="Google" provider={new GoogleAuthProvider()} />
 */
const ProviderButton = ({ name, provider, button }: Props) => {
  const auth = useAuth();
  const notify = useNotification();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signInWithProvider = async () => {
    try {
      const action = notify.promise(signInWithPopup(auth, provider), {
        loading: 'Waiting for response from identity provider.',
        error: (error) => `Unable to sign in. ${error}`,
        success: `Signed in.`,
      });
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

  const providerIcon = <DynamicIcon {...getIconPropsForProviderId(provider.providerId)} />;
  const Component = useMemo(() => button || ((props) => <button {...props} />), [button]);

  return (
    <div>
      <Component onClick={signInWithProvider}>
        {isLoading ? <Spinner /> : providerIcon}
        <span>{name}</span>
      </Component>
    </div>
  );
};

export default ProviderButton;
