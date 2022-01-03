import { FC } from 'react';
import { IconContext } from 'react-icons';
import loadable from '@loadable/component';

interface Props extends IconContext {
  icon: string;
  className?: string;
}

const DynamicIcon: FC<Props> = ({ icon, className, ...iconContext }) => {
  const library = icon?.match(/[A-Z][a-z]+/g)[0].toLowerCase();
  const fallback = <div>•</div>;

  if (!library || !icon) return fallback;

  const Icon = loadable(
    () => import(/* webpackPrefetch: true */ `react-icons/${library}/index.js`),
    {
      resolveComponent: (element: JSX.Element) => element[icon as keyof JSX.Element],
    },
  );

  return (
    <IconContext.Provider value={iconContext}>
      <Icon className={className} />
    </IconContext.Provider>
  );
};

export default DynamicIcon;
