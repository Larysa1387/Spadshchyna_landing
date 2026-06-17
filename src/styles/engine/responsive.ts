import {
  breakpointMaxQueries,
  breakpointOrder,
  breakpoints,
  type Breakpoint,
} from '../tokens/breakpoints';

export function getActiveBreakpoint(width = window.innerWidth): Breakpoint {
  if (width >= breakpoints.desktop) {
    return 'desktop';
  }

  if (width >= breakpoints.tablet) {
    return 'tablet';
  }

  return 'mobile';
}

export function matchesBreakpoint(
  breakpoint: Breakpoint,
  width = window.innerWidth,
): boolean {
  switch (breakpoint) {
    case 'mobile':
      return width < breakpoints.tablet;
    case 'tablet':
      return width >= breakpoints.tablet && width < breakpoints.desktop;
    case 'desktop':
      return width >= breakpoints.desktop;
  }
}

export function subscribeToBreakpointChanges(
  callback: (breakpoint: Breakpoint) => void,
): () => void {
  const mediaQueries = breakpointOrder.map((breakpoint) => ({
    breakpoint,
    query: window.matchMedia(breakpointMaxQueries[breakpoint]),
  }));

  const notify = () => {
    callback(getActiveBreakpoint());
  };

  mediaQueries.forEach(({ query }) => {
    query.addEventListener('change', notify);
  });

  notify();

  return () => {
    mediaQueries.forEach(({ query }) => {
      query.removeEventListener('change', notify);
    });
  };
}

export function resolveResponsiveValue<T>(
  values: Record<Breakpoint, T>,
  width = window.innerWidth,
): T {
  return values[getActiveBreakpoint(width)];
}
