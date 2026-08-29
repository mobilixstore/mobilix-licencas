const express = require('express')
const router = express.Router()
const { MercadoPagoConfig, Payment } = require('mercadopago')
const db = require('../config/database')
const { getPlano } = require('../config/planos')
const { gerarChaveLicenca } = require('../utils/gerarChave')
const { enviarEmailLicenca } = require('../utils/enviarEmail')

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })

// POST /webhook/mercadopago
// O Mercado Pago chama essa rota automaticamente quando um pagamento é aprovado
router.post('/mercadopago', async (req, res) => {
  try {
    const { type, data } = req.body

    // Só nos interessa notificação de pagamento
    if (type !== 'payment') {
      return res.status(200).send('ok')
    }

    const paymentClient = new Payment(client)
    const pagamento = await paymentClient.get({ id: data.id })

    // Só processa se o pagamento foi realmente aprovado
    if (pagamento.status !== 'approved') {
      return res.status(200).send('ok')
    }

    const email = pagamento.payer?.email
    const nomeCliente = pagamento.payer?.first_name || 'Cliente'
    const planoId = pagamento.metadata?.plano_id || 'basico'
    const idPagamento = String(pagamento.id)

    if (!email) {
      console.error('Pagamento aprovado sem email do comprador:', idPagamento)
      return res.status(200).send('ok')
    }

    // Evita gerar licença duplicada se o webhook for chamado mais de uma vez
    const [existente] = await db.query(
      'SELECT id FROM licencas WHERE id_pagamento = ?',
      [idPagamento]
    )
    if (existente.length > 0) {
      return res.status(200).send('ja processado')
    }

    const plano = getPlano(planoId)
    const chave = gerarChaveLicenca()

    await db.query(
      `INSERT INTO licencas (chave, email_cliente, nome_cliente, plano_id, maquinas_permitidas, id_pagamento, status)
       VALUES (?, ?, ?, ?, ?, ?, 'ativa')`,
      [chave, email, nomeCliente, plano.id, plano.maquinas, idPagamento]
    )

    const linkDownload = process.env.LINK_DOWNLOAD_SISTEMA || 'https://mobilixsaas.com.br/download'

    await enviarEmailLicenca({
      destinatario: email,
      nomeCliente,
      chaveLicenca: chave,
      plano,
      linkDownload,
    })

    console.log('Licença gerada e enviada com sucesso:', chave, 'para', email)
    res.status(200).send('ok')
  } catch (err) {
    console.error('Erro ao processar webhook:', err.message)
    // Sempre responde 200 para o Mercado Pago não ficar reenviando o mesmo evento
    res.status(200).send('erro tratado')
  }
})

module.exports = router
