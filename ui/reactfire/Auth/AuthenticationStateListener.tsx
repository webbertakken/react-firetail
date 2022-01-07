import { useEffect } from 'react';
import { useAuth } from 'reactfire';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { cloneDeep } from '../../../utils/object';

export function AuthenticationStateListener({ actionCreator = null }) {
  const auth = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => actionCreator && dispatch(actionCreator(cloneDeep(user))),
    );
    return () => unsubscribe();
  }, [actionCreator, auth, dispatch]);

  return null;
}
