interface IconProps {
  icon: string;
  [key: string]: any;
}

const getIconPropsForProviderId = (provider: string): IconProps => {
  switch (provider) {
    case 'google.com':
      return { icon: 'FcGoogle' };
    case 'facebook.com':
      return { icon: 'FaFacebook', color: '#3b5998' };
    case 'twitter.com':
      return { icon: 'FaTwitter', color: '#00acee' };
    default:
      return { icon: 'FcUnlock' };
  }
};

export default getIconPropsForProviderId;
