import axios from 'axios'
import https from 'https'

const buildClient = async ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    })
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    })
  }

  //  const newAxios =  axios.create({
  //   baseUrl: 'https://pcbuilder.dev',
  //   httpsAgent: new https.Agent({
  //     rejectUnauthorized: false,
  //   }),
  // });

  // axios.defaults.baseURL = 'https://pcbuilder.dev'
  // axios.defaults.httpsAgent = new https.Agent({
  //   rejectUnauthorized: false,
  // })

  // return axios
}

export { buildClient }
