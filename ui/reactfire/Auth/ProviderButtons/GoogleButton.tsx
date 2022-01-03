import ProviderButton from './ProviderButton';
import { useAuth } from 'reactfire';
import DynamicIcon from '../../../react-icons/DynamicIcon';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';

const GoogleButton = () => {
  const provider = new GoogleAuthProvider();

  return (
    <ProviderButton name="Google" provider={provider} icon={<DynamicIcon icon="FcGoogle" />} />
  );
};

export default GoogleButton;
