import { useSigninCheck } from 'reactfire';
import React, { useMemo } from 'react';

interface Props extends React.PropsWithChildren<{ fallback?: JSX.Element }> {}

const UserContentWrapper = ({ children, fallback: userFallback }: Props): JSX.Element => {
  const { data: signInCheckResult } = useSigninCheck();

  let fallback = useMemo(
    () => userFallback || <span>Sign in to use this component</span>,
    [userFallback],
  );

  if (!children) {
    throw new Error('Children must be provided');
  }

  return signInCheckResult.signedIn === true ? (children as JSX.Element) : fallback;
};

export default UserContentWrapper;
