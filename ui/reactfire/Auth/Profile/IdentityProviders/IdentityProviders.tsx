import DynamicIcon from '../../../../react-icons/DynamicIcon';
import getIconPropsForProviderId from '../../getIconPropsForProviderId';
import Spinner from '../../../../react-icons/Spinner';
import { loadingDelay } from '../../../../../utils/loadingDelay';
import getProviderForProviderId from '../../getProviderForProviderId';
import { supportedProvidersIds } from '../../supportedProviders';
import { useUser } from 'reactfire';
import { useCallback, useState } from 'react';
import { linkWithPopup, unlink, User, UserInfo } from 'firebase/auth';
import { useNotification } from '../../../../../hooks/useNotification';

const sortProviderIds = (a, b) =>
  supportedProvidersIds.indexOf(a) - supportedProvidersIds.indexOf(b);
const sortProviders = (a, b) => sortProviderIds(a.providerId, b.providerId);

interface Props {}

function IdentityProviders({}: Props): JSX.Element {
  const { data: user }: { data: User } = useUser();
  const notify = useNotification();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [providers, setProviders] = useState(user.providerData.sort(sortProviders));
  const [unusedProviderIds, setUnusedProviderIds] = useState<Array<string>>(
    supportedProvidersIds.filter((x) => !user.providerData.map((y) => y.providerId).includes(x)),
  );

  const onUnlink = useCallback(
    async (providerId) => {
      try {
        const action = notify.promise(unlink(user, providerId), {
          loading: 'Confirming...',
          error: `Unlinking failed. Please try again later.`,
          success: `Unlinked ${providerId} identity.`,
        });
        const result = await Promise.race([loadingDelay(), action]);

        if (result === 'loading') {
          setIsLoading(true);
          await action;
        }

        setProviders((current) => current.filter((provider) => provider.providerId !== providerId));
        setUnusedProviderIds((current) =>
          Array.from(new Set([...current, providerId])).sort(sortProviderIds),
        );
      } catch (error) {
        console.error('unhandled error', error);
      } finally {
        setIsLoading(false);
      }
    },
    [notify, user],
  );

  const onLink = useCallback(
    async (providerId) => {
      try {
        const provider = getProviderForProviderId(providerId);
        const action = notify.promise(linkWithPopup(user, provider), {
          loading: 'Waiting for response from identity provider.',
          error: (error) => `Unable to link identity provider. ${error}`,
          success: `Your can now use your ${providerId} identity.`,
        });

        let result = await Promise.race([loadingDelay(), action]);
        if (result === 'loading') {
          setIsLoading(true);
          result = await action;
        }

        setProviders((current) => [...current, result as UserInfo].sort(sortProviders));
        setUnusedProviderIds((current) => current.filter((id) => id !== providerId));
      } catch (error) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
          case 'auth/cancelled-popup-request':
            return; // No action required
          default:
            console.error('unhandled error', error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [notify, user],
  );

  return (
    <>
      {providers.length > 0 ? (
        <>
          <h2>Connected identities</h2>
          <ul>
            {providers.map(({ providerId }) => (
              <li
                key={providerId}
                className="flex items-center content-center p-2 border-y-[1px] border-opacity-10"
              >
                <DynamicIcon {...getIconPropsForProviderId(providerId)} className="mr-2" />
                <p>{providerId}</p>
                <span className="ml-auto text-xs">
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <button onClick={() => onUnlink(providerId)}> ❌ </button>
                  )}
                </span>{' '}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {unusedProviderIds.length > 0 ? (
        <>
          <h2>Not connected</h2>
          <ul className="text-gray-500">
            {unusedProviderIds.map((providerId) => (
              <li
                key={providerId}
                className="flex items-center content-center p-2 border-b-[1px] first:border-t-[1px] border-opacity-10"
              >
                <DynamicIcon {...getIconPropsForProviderId(providerId)} className="mr-2" />
                <p>{providerId}</p>
                <span className="ml-auto text-xs">
                  {isLoading ? <Spinner /> : <button onClick={() => onLink(providerId)}>➕</button>}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}

export default IdentityProviders;
