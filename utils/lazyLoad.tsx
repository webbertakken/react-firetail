import { ComponentType, lazy } from 'react';
import { simulateMinimumLoadingTime } from './sleep';

/**
 * Uses React.lazy to lazy load a module or component with a minimum delay.
 */
export const lazyLoad = (importFactory, minimumLoadingTime = 0) => {
  return lazy((): Promise<{ default: ComponentType<any> }> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('typeof importFactory', typeof importFactory, importFactory);
        const [module] = await Promise.all([
          importFactory(),
          simulateMinimumLoadingTime(minimumLoadingTime),
        ]);

        resolve(module);
      } catch (error) {
        console.error('Module resolution failed', error);
        reject(error);
      }
    });
  });
};
