import { useAuth, useUser } from 'reactfire';
import HashModal from '../../../../tailwind/Modal/HashModal';
import SignInForm from '../../../../../../shared/ui/SignInForm/SignInForm';
import UserDetails from '../UserDetails';
import UserContentWrapper from '../../UserContentWrapper/UserContentWrapper';
import { useCallback } from 'react';
import { deleteUser, User } from 'firebase/auth';
import { useNotification } from '../../../../../hooks/useNotification';

interface Props {}

function ProfileModal({}: Props): JSX.Element {
  const auth = useAuth();
  const { data: user }: { data: User } = useUser();
  const notify = useNotification();

  const signOut = useCallback(
    async (successCallback) => {
      await notify.promise(auth.signOut(), {
        loading: 'Signing out...',
        error: (error) => `An error occurred while signing out. ${error}`,
        success: `Signed out`,
      });
      successCallback();
    },
    [auth, notify],
  );

  const deleteAccount = useCallback(
    async (successCallback) => {
      if (window.confirm('This will permanently delete all your data. Are you sure?')) {
        await notify.promise(deleteUser(user), {
          loading: 'Deleting account...',
          error: (error) => `An error occurred while deleting your account account. ${error}`,
          success: `Account deleted.`,
        });
        successCallback();
      }
    },
    [notify, user],
  );

  return (
    <HashModal
      hash="#profile"
      title="Profile"
      Content={() => (
        <UserContentWrapper fallback={<SignInForm />}>
          <UserDetails />
        </UserContentWrapper>
      )}
      Footer={({ closeModal }: any) => (
        <>
          <button
            className="text-red-500 background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => deleteAccount(closeModal)}
          >
            Delete account
          </button>
          <div className="flex-grow" />
          <button
            className="text-white background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => signOut(closeModal)}
          >
            Sign out
          </button>
        </>
      )}
    />
  );
}

export default ProfileModal;
