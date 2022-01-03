import cx from 'classnames';
import { Link } from 'react-router-dom';
import { useSigninCheck } from 'reactfire';

interface Props {
  className?: string;
}

function ProfileIcon({ className }: Props): JSX.Element {
  const { status, data } = useSigninCheck();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  console.log(status);

  const { displayName, photoURL } = data?.user || { displayName: '', photoURL: '' };

  const initials = '🧑';
  const hasUnreadNotifications = false;

  return (
    <Link
      to="#profile"
      replace
      className={cx(
        'w-10 h-10 bg-cover bg-center rounded-full bg-gray-800 flex items-center justify-center z-20 border-[1px] border-gray-600 shadow-md',
        className,
      )}
    >
      <div className="wrapper relative">
        {(!photoURL && (
          <p className={`uppercase text-[#41c43c] ${initials.length <= 1 ? 'text-s' : 'text-xs'}`}>
            {initials}
          </p>
        )) || (
          <img
            alt={displayName}
            src={photoURL}
            className="h-full w-full overflow-hidden object-cover rounded-full"
          />
        )}
        {hasUnreadNotifications && (
          <div className="h-2 w-2 bg-green-400 absolute right-0 bottom-0 mt-2 mr-1 border border-white" />
        )}
      </div>
    </Link>
  );
}

export default ProfileIcon;
