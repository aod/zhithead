import {
  createContext,
  PropsWithChildren,
  RefObject,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

const Breakpoints = ["sm", "md", "lg", "xl", "2xl"] as const;
type Breakpoint = typeof Breakpoints[number];

interface BreakpointsContext {
  (breakpoint: Breakpoint): boolean;
}

export const BreakpointsContext = createContext<BreakpointsContext>(
  {} as BreakpointsContext
);

export default function BreakpointsProvider(props: PropsWithChildren) {
  const [width, setWidth] = useState(window.innerWidth);
  const [, startTransition] = useTransition();

  useEffect(() => {
    function onResize() {
      startTransition(() => {
        setWidth(window.innerWidth);
      });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const refs = useRef<Record<Breakpoint, RefObject<HTMLDivElement>>>({
    sm: useRef(null),
    md: useRef(null),
    lg: useRef(null),
    xl: useRef(null),
    "2xl": useRef(null),
  });

  const isVisible = useCallback(
    (el?: HTMLElement | null) => !!el?.offsetParent,
    []
  );

  const deferredWidth = useDeferredValue(width);
  const isBreakpoint = useCallback(
    (breakpoint: Breakpoint) => {
      return isVisible(refs.current[breakpoint].current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isVisible, deferredWidth]
  );

  return (
    <BreakpointsContext.Provider value={isBreakpoint}>
      <div
        ref={refs.current.sm}
        className="h-0 w-0 md:hidden lg:hidden xl:hidden 2xl:hidden"
      />
      <div
        ref={refs.current.md}
        className="hidden h-0 w-0 sm:hidden md:block lg:hidden xl:hidden 2xl:hidden"
      />
      <div
        ref={refs.current.lg}
        className="hidden h-0 w-0 sm:hidden md:hidden lg:block xl:hidden 2xl:hidden"
      />
      <div
        ref={refs.current.xl}
        className="hidden h-0 w-0 sm:hidden md:hidden lg:hidden xl:block 2xl:hidden"
      />
      <div
        ref={refs.current["2xl"]}
        className="hidden h-0 w-0 sm:hidden md:hidden lg:hidden xl:hidden 2xl:block"
      />
      {props.children}
    </BreakpointsContext.Provider>
  );
}
