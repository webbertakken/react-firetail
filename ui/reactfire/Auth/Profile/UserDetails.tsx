import IdentityProviders from './IdentityProviders/IdentityProviders';
import ProfileIconAndDisplayName from './ProfileIconAndDisplayName/ProfileIconAndDisplayName';

const UserDetails = () => {
  return (
    <>
      <ProfileIconAndDisplayName />
      <IdentityProviders />
    </>
  );
};

export default UserDetails;
