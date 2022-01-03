import * as React from 'react';
import { useAuth, useUser } from 'reactfire';
import { User } from 'firebase/auth';
import { useCallback } from 'react';
import ProfileIcon from '../../../../../user/ui/Profile/Icon/ProfileIcon';

const UserDetails = () => {
  const auth = useAuth();
  const { data } = useUser();
  const user = data as User;

  const signOut = useCallback(async () => {
    await auth.signOut();
  }, [auth]);

  return (
    <>
      <div className="group flex">
        <ProfileIcon className="relative mr-3" />
        <div>{user.displayName}</div>
      </div>
      <div>
        <ul>
          {user.providerData?.map((profile) => (
            <li key={profile?.providerId}>{profile?.providerId}</li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={signOut}>Sign out</button>
      </div>
    </>
  );
};

export default UserDetails;
