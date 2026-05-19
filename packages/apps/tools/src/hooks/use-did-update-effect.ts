import { useEffect, useRef } from 'react';

const useDidUpdateEffect = (fn: () => void, inputs: unknown[]): boolean => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);

  return true;
};

export default useDidUpdateEffect;
