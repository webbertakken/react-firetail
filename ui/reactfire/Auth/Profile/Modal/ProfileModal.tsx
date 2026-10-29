import { useAuth, useUser } from 'reactfire';
import HashModal from '../../../../tailwind/Modal/HashModal';
import SignInForm from '../../../../../../shared/ui/SignInForm/SignInForm';
import UserDetails from '../UserDetails';
import UserContentWrapper from '../../UserContentWrapper/UserContentWrapper';
import { useCallback } from 'react';
import { deleteUser, User } from 'firebase/auth';
import { useNotification } from '../../../../../hooks/useNotification';

interface CloseInjected {
  closeModal: (event?: Event) => void;
}

function ProfileContent(): JSX.Element {
  return (
    <UserContentWrapper fallback={<SignInForm />}>
      <UserDetails />
    </UserContentWrapper>
  );
}

function ProfileFooter({ closeModal }: CloseInjected): JSX.Element {
  const auth = useAuth();
  const { data: user }: { data: User } = useUser();
  const notify = useNotification();

  const signOut = useCallback(async () => {
    await notify.promise(auth.signOut(), {
      loading: 'Signing out...',
      error: (error) => `An error occurred while signing out. ${error}`,
      success: `Signed out`,
    });
    closeModal();
  }, [auth, notify, closeModal]);

  const deleteAccount = useCallback(async () => {
    if (window.confirm('This will permanently delete all your data. Are you sure?')) {
      await notify.promise(deleteUser(user), {
        loading: 'Deleting account...',
        error: (error) => `An error occurred while deleting your account account. ${error}`,
        success: `Account deleted.`,
      });
      closeModal();
    }
  }, [notify, user, closeModal]);

  return (
    <>
      <button
        className="text-red-500 background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={deleteAccount}
      >
        Delete account
      </button>
      <div className="flex-grow" />
      <button
        className="text-white background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={signOut}
      >
        Sign out
      </button>
    </>
  );
}

function ProfileModal(): JSX.Element {
  return (
    <HashModal hash="#profile" title="Profile" Content={ProfileContent} Footer={ProfileFooter} />
  );
}

export default ProfileModal;
