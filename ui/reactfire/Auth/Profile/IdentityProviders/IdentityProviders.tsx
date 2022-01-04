import DynamicIcon from '../../../../react-icons/DynamicIcon';
import getIconPropsForProviderId from '../../getIconPropsForProviderId';
import Spinner from '../../../../react-icons/Spinner';
import { loadingDelay } from '../../../../../utils/loadingDelay';
import getProviderForProviderId from '../../getProviderForProviderId';
import { supportedProviders } from '../../supportedProviders';
import { useUser } from 'reactfire';
import { useCallback, useState } from 'react';
import { linkWithPopup, unlink, User, UserInfo } from 'firebase/auth';

const sortProviderIds = (a, b) => supportedProviders.indexOf(a) - supportedProviders.indexOf(b);
const sortProviders = (a, b) => sortProviders(a.providerId, b.providerId);

interface Props {}

function IdentityProviders({}: Props): JSX.Element {
  const { data: user }: { data: User } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [providers, setProviders] = useState(user.providerData.sort(sortProviders));
  const [unusedProviderIds, setUnusedProviderIds] = useState<Array<string>>(
    supportedProviders.filter((x) => !user.providerData.map((y) => y.providerId).includes(x)),
  );

  const onUnlink = useCallback(
    async (providerId) => {
      try {
        const action = unlink(user, providerId);
        const result = await Promise.race([loadingDelay(), action]);

        if (result === 'loading') {
          setIsLoading(true);
          await action;
        }

        setProviders((providers) =>
          providers.filter((provider) => provider.providerId !== providerId),
        );

        setUnusedProviderIds((providers) =>
          Array.from(new Set([...providers, providerId])).sort(sortProviderIds),
        );
      } catch (error) {
        console.error('unhandled error', error);
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  const onLink = useCallback(
    async (providerId) => {
      try {
        const provider = getProviderForProviderId(providerId);
        const action = linkWithPopup(user, provider);
        let result = await Promise.race([loadingDelay(), action]);

        if (result === 'loading') {
          setIsLoading(true);
          result = await action;
        }

        setProviders((providers) => [...providers, result as UserInfo].sort(sortProviders));
        setUnusedProviderIds((providers) => providers.filter((id) => id !== providerId));
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
    [user],
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
