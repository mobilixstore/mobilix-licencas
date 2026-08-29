const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/webhook', require('./src/routes/webhook'))
app.use('/licenca', require('./src/routes/licenca'))

app.get('/', (req, res) => {
  res.json({ msg: 'Servidor de Licenças MobilixStore - Mobilix Soluções Digitais' })
})

const PORTA = process.env.PORT || 3002
app.listen(PORTA, () => {
  console.log('Servidor de licenças rodando na porta ' + PORTA)
})
