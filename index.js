const fs = require('fs')
const https = require('https')

const axios = require('axios')

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