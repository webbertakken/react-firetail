import { FACEBOOK_ID, GOOGLE_ID, TWITTER_ID } from './supportedProviders';

export interface IconProps {
  icon: string;
  [key: string]: any;
}

const getIconPropsForProviderId = (provider: string): IconProps => {
  switch (provider) {
    case GOOGLE_ID:
      return { icon: 'FcGoogle' };
    case FACEBOOK_ID:
      return { icon: 'FaFacebook', color: '#3b5998' };
    case TWITTER_ID:
      return { icon: 'FaTwitter', color: '#00acee' };
    default:
      return { icon: 'FcUnlock' };
  }
};

export default getIconPropsForProviderId;
