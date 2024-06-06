/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConfidentialClientApplication } from "@azure/msal-node"
import { FetchError, FetchOptions, xFetch } from "./xfetch"

// // ESM issue with odata-query
// // little hack to fix is (peterc)
// // https://github.com/techniq/odata-query/issues/106
// import _buildQuery from 'odata-query';
// const buildODataQuery = (_buildQuery as unknown as { default: typeof _buildQuery }).default;

export const pca = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.AZURE_AD_CLIENT_ID ?? "",
    authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}`,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET
  }
  /* system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        log.warn(`msal: [${level}] - `, message);
      },
    },
  }, */
})

export const getAccessToken = async (): Promise<string> => {
  const response = await pca.acquireTokenByClientCredential({
    scopes: ["https://graph.microsoft.com/.default"]
  })
  if (!response) throw new Error("Failed to acquire graph access token.")
  return response.accessToken
}

export const omitOData = <TData extends object>(source: TData): TData => {
  if (typeof source === "object" && source !== null) {
    const newObj = { ...source }
    if ("@odata.type" in newObj) delete newObj["@odata.type"]
    if ("@odata.context" in newObj) delete newObj["@odata.context"]
    return newObj
  }
  return source
}

export class GraphError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public cause: any
  ) {
    super(message)
  }
}

const createGraphError = (error: Error) => {
  if (error instanceof FetchError) {
    // graph API is sending most of the error info in the body
    // rethrow error with this extra info
    let cause = error.data as { message: string }
    if ("error" in error.data) {
      cause = error.data.error
    }
    return new GraphError(
      `${cause.message}`,
      error.status,
      error.statusText,
      cause
    )
  }

  return error
}

export const api = {
  /**
   * Fetch function to POST Graph API data, automatically adds the access token
   * @param url
   * @param body
   */
  async post<TResult>(url: string, body: any) {
    //
    // THIS CODE IS NOT YET TESTED, TAKE INTO ACCOUNT WHEN USING (PeterC)
    //
    const accessToken = await getAccessToken()
    const fullUrl = `https://graph.microsoft.com/v1.0${url}`
    return xFetch<TResult>(fullUrl, {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).catch((err: Error) => {
      throw createGraphError(err)
    })
  },

  async delete<TResult>(url: string) {
    const accessToken = await getAccessToken()
    const fullUrl = `https://graph.microsoft.com/v1.0${url}`
    return xFetch<TResult>(fullUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).catch((err: Error) => {
      throw createGraphError(err)
    })
  },

  /**
   * Fetch function to GET Graph API data, automatically adds the access token
   * @param url - graph API url, more info see [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer).
   */
  async get<TResult>(url: string, options?: FetchOptions) {
    const accessToken = await getAccessToken()
    const fullUrl = `https://graph.microsoft.com/v1.0${url}`
    return xFetch<TResult>(fullUrl, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${accessToken}`
      }
    }).catch((err: Error) => {
      throw createGraphError(err)
    })
  },

  /**
   * Wrapper around 'get' to receive and transform image to buffer
   * @param url
   */
  async getImage(url: string): Promise<Buffer> {
    const response = await api.get<Response>(url, {
      raw: true,
      next: { revalidate: 0 },
      cache: "no-store"
    })
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }
}
