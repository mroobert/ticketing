import axios, { AxiosInstance } from 'axios'
import { GetServerSidePropsContext } from 'next'

function createAxiosInstanceForSSR({
  req,
}: GetServerSidePropsContext): AxiosInstance {
  return axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers: req.headers,
  })
}

export { createAxiosInstanceForSSR }
