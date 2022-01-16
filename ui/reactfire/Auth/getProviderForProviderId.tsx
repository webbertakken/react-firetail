import { GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { FACEBOOK_ID, GOOGLE_ID, TWITTER_ID } from './supportedProviders';

const getProviderForProviderId = (provider: string) => {
  switch (provider) {
    case GOOGLE_ID:
      return new GoogleAuthProvider();
    case TWITTER_ID:
      return new TwitterAuthProvider();
    case FACEBOOK_ID:
      return new FacebookAuthProvider();

    default:
      throw new Error(`Invalid authentication provider: ${provider}`);
  }
};

export default getProviderForProviderId;
