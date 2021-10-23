import axios from 'axios'
import Router from 'next/router'
import { parseCookies } from 'nookies'

const { 'maintenancetech.token': token } = parseCookies()

export const api = axios.create()

if (token) {
  api.defaults.headers.common.token = token
}

api.interceptors.response.use(response => {
  if (response.status === 401) {
    Router.push('/login')
    return Promise.reject(response.statusText)
  }

  return response
})
