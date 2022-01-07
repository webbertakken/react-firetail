import { useSigninCheck } from 'reactfire';
import React, { useMemo } from 'react';

interface Props extends React.PropsWithChildren<{ fallback?: JSX.Element }> {}

const UserContentWrapper = ({ children, fallback: userFallback }: Props): JSX.Element => {
  const { data: signInCheckResult } = useSigninCheck();

  let fallback = useMemo(() => {
    // users fallback function may be null, which is also valid for returning
    if (typeof userFallback !== 'undefined') return userFallback;

    return <span>You must be signed in to use this component.</span>;
  }, [userFallback]);

  if (!children) {
    throw new Error('Children must be provided');
  }

  if (signInCheckResult.signedIn !== true) return fallback;
  return children as JSX.Element;
};

export default UserContentWrapper;
