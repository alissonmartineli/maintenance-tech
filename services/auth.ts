import { api } from './api'

type SignInRequestData = {
  username: string
  password: string
}

type SignInReturnedData = {
  token: string
  message?: string
}

export async function SignInRequest({
  username,
  password
}: SignInRequestData): Promise<SignInReturnedData> {
  const response = await api.post<SignInReturnedData>('/auth', {
    username,
    password
  })

  if (response.status !== 200) {
    throw new Error(response.data.message)
  }

  return response.data
}
