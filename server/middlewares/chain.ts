import { NextMiddleware, NextResponse } from 'next/server';
import { MiddlewareFactory } from './types';

/**
 * Original source:
 * https://reacthustle.com/blog/how-to-chain-multiple-middleware-functions-in-nextjs
 *
 * Chain one or more middleware functions together.
 * - We pass an array of MiddlewareFactory functions.
 * - We get the current middleware factory using the index.
 * If it exists, first we get the next middleware by using recursion.
 * This would go on until the last middleware factory.
 * - If there is no middleware factory, we just return a middleware function that returns NextResponse.next()
 */
export const chain = (middlewares: MiddlewareFactory[] | [], index = 0): NextMiddleware => {
  const current = middlewares[index];

  if (current) {
    const next = chain(middlewares, index + 1);
    return current(next);
  }

  return () => NextResponse.next();
};
