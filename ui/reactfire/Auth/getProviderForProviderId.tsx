import { GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';

const getProviderForProviderId = (provider: string) => {
  switch (provider) {
    case 'google.com':
      return new GoogleAuthProvider();
    case 'facebook.com':
      return new FacebookAuthProvider();
    case 'twitter.com':
      return new TwitterAuthProvider();
    default:
      throw new Error(`Invalid authentication provider: ${provider}`);
  }
};

export default getProviderForProviderId;
