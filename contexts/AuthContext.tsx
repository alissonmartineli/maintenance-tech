import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { createContext, useState, FC } from 'react'
import { SignInRequest } from '../services/auth'
import Router from 'next/router'
import { api } from '../services/api'

type SignInData = {
  username: string
  password: string
  remember: boolean
}

type AuthContextType = {
  isAuthenticated: boolean
  signIn: (data: SignInData) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext({} as AuthContextType)

export const AuthProvider: FC = ({ children }) => {
  const { 'onthego.dash.token': cookieToken } = parseCookies()

  const [token, setToken] = useState<string | null>(cookieToken)

  const isAuthenticated = !!token

  const signIn = async ({ username, password, remember }: SignInData) => {
    const { token: requestToken } = await SignInRequest({
      username,
      password
    })

    setCookie(null, 'onthego.dash.token', requestToken, {
      maxAge: 60 * 60 * 24 * (remember ? 7 : 1) // 7 or 1 day
    })

    api.defaults.headers.common.token = requestToken

    setToken(requestToken)

    Router.push('/projetos')
  }

  const logout = () => {
    destroyCookie(null, 'onthego.dash.token')
    setToken(null)
    Router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
