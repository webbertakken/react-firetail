import * as React from 'react';
import { useUser } from 'reactfire';
import { User } from 'firebase/auth';
import ProfileIcon from './Icon/ProfileIcon';

const UserDetails = () => {
  const { data } = useUser();
  const user = data as User;

  return (
    <>
      <div className="group flex items-center justify-center pb-6">
        <ProfileIcon className="relative mr-4 w-16 h-16" />
        <input value={user.displayName} className="h-10 px-2 rounded bg-white bg-opacity-10" />
      </div>
      <div>
        <h2>Connected identities</h2>
        <ul>
          {user.providerData?.map((profile) => (
            <li key={profile?.providerId}>- {profile?.providerId}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UserDetails;
