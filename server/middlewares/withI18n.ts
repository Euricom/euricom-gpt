import { NextFetchEvent, NextRequest } from "next/server"
import { MiddlewareFactory } from "./types"
import { i18nRouter } from "next-i18n-router"
import i18nConfig from "../../i18nConfig"

export const withI18n: MiddlewareFactory = next => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const i18nResult = i18nRouter(request, i18nConfig)
    console.log("i18nResult", i18nResult)
    if (i18nResult) return i18nResult
    return await next(request, _next)
  }
}
