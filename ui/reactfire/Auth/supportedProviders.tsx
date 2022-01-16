import {
  AuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';
import getIconPropsForProviderId, { IconProps } from './getIconPropsForProviderId';

export const GOOGLE_ID = 'google.com';
export const TWITTER_ID = 'twitter.com';
export const FACEBOOK_ID = 'facebook.com';

export const supportedProvidersIds = [GOOGLE_ID, TWITTER_ID, FACEBOOK_ID];

export interface Provider {
  id: string;
  name: string;
  provider: AuthProvider;
  icon: IconProps;
}

export const supportedProviders: Provider[] = [
  {
    id: GOOGLE_ID,
    name: 'Google',
    provider: new GoogleAuthProvider(),
    icon: getIconPropsForProviderId(GOOGLE_ID),
  },
  {
    id: TWITTER_ID,
    name: 'Twitter',
    provider: new TwitterAuthProvider(),
    icon: getIconPropsForProviderId(TWITTER_ID),
  },
  {
    id: FACEBOOK_ID,
    name: 'Facebook',
    provider: new FacebookAuthProvider(),
    icon: getIconPropsForProviderId(FACEBOOK_ID),
  },
];
