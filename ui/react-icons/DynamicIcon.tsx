import { FC } from 'react';
import { IconContext } from 'react-icons';
import loadable from '@loadable/component';

interface Props extends IconContext {
  icon: string;
  className?: string;
}

interface LibraryIconProps {
  library: string;
  icon: string;
  className?: string;
}

const LibraryIcon = loadable<LibraryIconProps>(
  ({ library }) => import(/* webpackPrefetch: true */ `react-icons/${library}/index.js`),
  {
    cacheKey: ({ library }) => library,
    resolveComponent: (iconLibrary, { icon }) => iconLibrary[icon],
  },
);

const DynamicIcon: FC<Props> = ({ icon, className, ...iconContext }) => {
  const library = icon?.match(/[A-Z][a-z]+/g)?.[0].toLowerCase();

  if (!library) return <div>•</div>;

  return (
    <IconContext.Provider value={iconContext}>
      <LibraryIcon library={library} icon={icon} className={className} />
    </IconContext.Provider>
  );
};

export default DynamicIcon;
