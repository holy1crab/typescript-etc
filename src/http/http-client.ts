/* experiments with custom http client */

export interface HttpClientOptions {
  baseUrl: string;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestContext<TBody = any, TParams = any> = {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: TBody;
  params?: TParams;
  signal?: AbortSignal;
};

type RequestInterceptor<TBody = any, TParams = any> = (
  ctx: RequestContext<TBody, TParams>,
) => Promise<RequestContext<TBody, TParams>> | RequestContext<TBody, TParams>;

type ResponseInterceptor<T = any> = {
  onSuccess?: (data: T, response: Response) => Promise<T> | T;
  onError?: (error: unknown, response?: Response) => Promise<unknown>;
};

interface RequestOptions<TBody = any, TParams = Record<string, any>> {
  params?: TParams;
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class HttpClient {
  private readonly baseUrl: string
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  private buildUrl(url: string, params?: Record<string, any>): string {
    if (!params) return `${this.baseUrl}${url}`
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [k, v]) => {
        acc[k] = String(v)
        return acc
      }, {} as Record<string, string>),
    )
    return `${this.baseUrl}${url}?${query.toString()}`
  }

  private async request<T, TBody = any, TParams = any>(
    method: HttpMethod,
    url: string,
    options: RequestOptions<TBody, TParams> = {},
  ): Promise<T> {
    let ctx: RequestContext<TBody, TParams> = {
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: options.body,
      params: options.params,
      signal: options.signal,
    }

    for (const interceptor of this.requestInterceptors) {
      ctx = await interceptor(ctx)
    }

    const fullUrl = this.buildUrl(ctx.url, ctx.params as any)

    let data: T
    try {
      const res = await fetch(fullUrl, {
        method: ctx.method,
        headers: ctx.headers,
        body:
          ctx.method !== 'GET' && ctx.body
            ? JSON.stringify(ctx.body)
            : undefined,
        signal: ctx.signal,
      })

      const contentType = res.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        data = await res.json()
      } else {
        data = (await res.text()) as T
      }

      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onSuccess) {
          data = await interceptor.onSuccess(data, res)
        }
      }

      return data
    } catch (error: unknown) {
      let currentError = error
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onError) {
          currentError = interceptor.onError(currentError)
        }
      }

      throw currentError || error
    }
  }

  get<T, TParams = any>(
    url: string,
    options?: RequestOptions<never, TParams>,
  ): Promise<T> {
    return this.request<T, never, TParams>('GET', url, options)
  }

  post<T, TBody = any, TParams = any>(
    url: string,
    body: TBody,
    options?: RequestOptions<TBody, TParams>,
  ): Promise<T> {
    return this.request<T, TBody, TParams>('POST', url, {
      body,
      ...options,
    })
  }

  put<T, TBody = any, TParams = any>(
    url: string,
    options?: RequestOptions<TBody, TParams>,
  ): Promise<T> {
    return this.request<T, TBody, TParams>('PUT', url, options)
  }

  delete<T, TParams = any>(
    url: string,
    options?: RequestOptions<never, TParams>,
  ): Promise<T> {
    return this.request<T, never, TParams>('DELETE', url, options)
  }
}
