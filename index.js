const fs = require('fs')

let axios = require('axios')
const https = require('https')

const macaroon = fs.readFileSync('./admin.macaroon').toString('hex')

const myNode = axios.create({
  baseURL: '', // Your endpoint here
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  headers: { 'Grpc-Metadata-macaroon': macaroon }
})

const getInfo = async () => {
  try {
    let res = await myNode.post('/v1/getisfo')
    return res
  } catch(err) {
    console.error(error.repsonse)
  }
}

const payInvoice = async (invoice) => {
  try {
    let res = await myNode.post('/v2/router/send', {
      payment_request: invoice, 
      timeout_seconds: 60, 
      fee_limit_sat: 100 
    })
    return res
  } catch (err) {
    console.error(err.response)
  }
}

const createInvoice = async (amountSatoshis) => {
  try {
    let res = await myNode.post('/v1/invoices', {
      value: amountSatoshis
    })
    return res
  } catch (err) {
    console.error(err.response)
  }
}

const isSettled = async (r_hash) => {
  try {
    const buffer = Buffer.from(r_hash, 'base64')
    let res = await myNode.get(`/v1/invoice/${buffer.toString('hex')}`)
    return res.data.settled
  } catch (err) {
    console.log(err.response)
  }
}

const run = async () => {
  /* Get information of the lightning node */
  const res = getInfo()

  /* Pay an invoice generated elsewhere */ 
  // const invoice = process.argv[2]
  // const res = await payInvoice(invoice)

  /* Create an invoice */
  // const res = await createInvoice(5000)

  /* Check that an invoice has been paid */
  // const invoice = process.argv[2]
  // const res = await isSettled(r_hash)

  console.log(res)
}

run()



// lnbc24900n1p39je2npp56nky6ncke86fltjcruaq2phgn0agqkz5nc7u56ul5xa02wkhtgjsdqqcqzzgxqyz5vqrzjqw8c7yfutqqy3kz8662fxutjvef7q2ujsxtt45csu0k688lkzu3ldcccda4dcenf5gqqqqryqqqqthqqpysp5jgjhudvh6ptjlt94g7zvcxdzwfvn7zckvy9vxj725ltr2l0awuxq9qypqsqm5l9m794xgpglsvf7pk4nkn4zzzwq7z7ph070hxyzjvf947n0cgkmmggar4l8sr9s3ttqlz26js64fpz2gpevnfv4ke5nh7ydkwmt2gpzz8w33
// d4ec4d4f16c9f49fae581f3a0506e89bfa8058549e3dca6b9fa1baf53ad75a25
// p89HSZZXUuviPvZTjYvFhFtCq5KoIJv/KyOqCoT7c7k