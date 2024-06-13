import { NextRequest, NextResponse } from 'next/server';
import type Link from 'next/link';
import { pathToRegexp } from 'path-to-regexp';

type WithPathPatternWildcard<T> = `${T & string}(.*)`;
type NextTypedRoute<T = Parameters<typeof Link>['0']['href']> = T extends string ? T : never;

// For extra safety, we won't recommend using a `/(.*)` route matcher.
type ExcludeRootPath<T> = T extends '/' ? never : T;

// We want to show suggestions but also allow for free-text input
// the (string & {}) type prevents the TS compiler from merging the typed union with the string type
// https://github.com/Microsoft/TypeScript/issues/29729#issuecomment-505826972
type RouteMatcherWithNextTypedRoutes =
  | WithPathPatternWildcard<ExcludeRootPath<NextTypedRoute>>
  | NextTypedRoute
  | (string & {});

export type RouteMatcherParam =
  | Array<RegExp | RouteMatcherWithNextTypedRoutes>
  | RegExp
  | RouteMatcherWithNextTypedRoutes
  | ((req: NextRequest) => boolean);

export const toRegexp = (path: string) => {
  try {
    return pathToRegexp(path);
  } catch (e: any) {
    throw new Error(
      `Invalid path: ${path}.\nConsult the documentation of path-to-regexp here: https://github.com/pillarjs/path-to-regexp.\n${e.message}`,
    );
  }
};

/**
 * Create a function that matches a request against the specified routes.
 * Pre-computes the glob matchers for the public routes, so we don't have to
 * recompile the regular expressions on every request.
 */
export const createRouteMatcher = (routes: RouteMatcherParam) => {
  if (typeof routes === 'function') {
    return (req: NextRequest) => routes(req);
  }

  const routePatterns = [routes || ''].flat().filter(Boolean);
  const matchers = preComputePathRegex(routePatterns);
  return (req: NextRequest) => matchers.some((matcher) => matcher.test(req.nextUrl.pathname));
};

export const redirectTo = (url: string, baseUrl: string) => NextResponse.redirect(new URL(url, baseUrl));

const preComputePathRegex = (patterns: Array<string | RegExp>) => {
  return patterns.map((pattern) => (pattern instanceof RegExp ? pattern : toRegexp(pattern)));
};
