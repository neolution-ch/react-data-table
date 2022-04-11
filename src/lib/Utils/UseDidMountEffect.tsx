import { DependencyList, useEffect, useRef } from "react";

type EmptyFunction = () => void;

const useDidMountEffect = (func: EmptyFunction, deps: DependencyList | undefined) => {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};
export default useDidMountEffect;
