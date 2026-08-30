import { useAuthStore } from "@/features/auth/store"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, data: unknown, message: string) {
    super(message)
    this.status = status
    this.data = data
  }
}

function extractErrorMessage(data: unknown): string {
  if (data && typeof data === "object") {
    const [firstValue] = Object.values(data as Record<string, unknown>)
    if (Array.isArray(firstValue) && typeof firstValue[0] === "string") return firstValue[0]
    if (typeof firstValue === "string") return firstValue
  }
  return "Something went wrong. Please try again."
}

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
  token?: string
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
  isRetry = false,
): Promise<T> {
  const { method = "GET", body, auth = true, token } = options
  const headers: Record<string, string> = { "Content-Type": "application/json" }

  if (auth) {
    const accessToken = token ?? useAuthStore.getState().accessToken
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && auth && !token && !isRetry) {
    const refreshed = await useAuthStore.getState().refreshAccessToken()
    if (refreshed) return request<T>(path, options, true)
    useAuthStore.getState().logout()
  }

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => undefined)

  if (!res.ok) {
    throw new ApiError(res.status, data, extractErrorMessage(data))
  }

  return data as T
}
