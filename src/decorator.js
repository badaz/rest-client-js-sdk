// @flow
/* eslint-disable import/prefer-default-export */

// memoize promise returning function so that it returns
// the same promise if called again before resolve / reject
type MemoizedPromise = (parameters: Array<any>) => Promise<any>;

export function memoizePromise(callback: MemoizedPromise) {
  const cache = {};
  function memoized(...parameters: any) {
    const cacheKey = JSON.stringify(parameters);

    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    // Get and add the value to the cache
    const value = callback.apply(this, parameters);
    cache[cacheKey] = value;

    const isPromise = !!value && typeof value.then === 'function';
    if (!isPromise) {
      throw new Error('Memoization Error, Async function returned non-promise value');
    }

    // Delete the value regardless of whether it resolves or rejects
    return value.then((internalValue) => {
      cache[cacheKey] = false;
      return internalValue;
    }, (err) => {
      cache[cacheKey] = false;
      throw err;
    });
  }

  memoized.cache = cache;
  return memoized;
}
