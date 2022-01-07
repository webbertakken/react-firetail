import React from 'react';
import { useUser } from 'reactfire';
import { User, updateProfile } from 'firebase/auth';
import ProfileIcon from '../Icon/ProfileIcon';
import { useCallback, useState } from 'react';
import { debounce } from '../../../../../utils/debounce';
import { useNotification } from '../../../../../hooks/useNotification';
import { useDispatch } from 'react-redux';
// Todo - remove nuclear option
import { profileUpdated } from '../../../../../../user/logic/ducks/profileDuck';

interface Props {}

function ProfileIconAndDisplayName({}: Props): JSX.Element {
  const { data: user }: { data: User } = useUser();
  const [displayName, setDisplayName] = useState<string>(user.displayName);
  const notify = useNotification();
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const persistDisplayName = useCallback(
    debounce(async (displayName) => {
      await notify.promise(updateProfile(user, { displayName }), {
        loading: 'Updating display name',
        success: 'Display name updated',
        error: 'Display name was not updated',
      });
      await dispatch(profileUpdated({ displayName }));
    }, 500),
    [user, debounce],
  );

  const updateDisplayName = (event) => {
    const { value } = event.target;
    setDisplayName(value);
    if (value !== '') persistDisplayName(value);
  };

  return (
    <div className="group flex items-center justify-center pb-6">
      <ProfileIcon className="relative mr-4 w-20 h-20" />
      <input
        value={displayName}
        onChange={updateDisplayName}
        className="h-10 px-3 rounded bg-white bg-opacity-10"
      />
    </div>
  );
}

export default ProfileIconAndDisplayName;
