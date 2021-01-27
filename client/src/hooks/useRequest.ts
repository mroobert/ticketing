import { useState } from 'react'
import axios, { AxiosError, Method } from 'axios'

interface RequestConfig<TRequest, TResponse> {
  method: Method
  body?: TRequest
  onSuccess: (responseData: TResponse) => void
}

interface RequestClient<TRequest, TResponse> {
  makeRequest: (
    config: RequestConfig<TRequest, TResponse>
  ) => Promise<TResponse | void>
  apiError?: Error
}

interface Error {
  errors: ApiError[]
}

interface ApiError {
  message: string
  field?: string
}

function useRequest<TRequest, TResponse>(
  url: string
): RequestClient<TRequest, TResponse> {
  const [apiError, setApiErrors] = useState<Error | undefined>()

  async function makeRequest({
    method,
    body,
    onSuccess,
  }: RequestConfig<TRequest, TResponse>): Promise<TResponse | undefined> {
    try {
      setApiErrors(undefined)
      const response = await axios({
        url,
        method,
        data: body,
      })
      const data = response.data as TResponse
      if (onSuccess) {
        onSuccess(data)
      }
      return data
    } catch (err) {
      if (err.message === 'Network Error') {
        setApiErrors({ errors: [{ message: 'Network error.' }] })
      } else {
        const error = err as AxiosError<Error>
        error.response
          ? setApiErrors(error.response.data)
          : setApiErrors({ errors: [{ message: 'An error has occured.' }] })
      }
    }
  }

  return { makeRequest, apiError }
}

export { useRequest }
