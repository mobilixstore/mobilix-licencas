const express = require('express')
const router = express.Router()
const { MercadoPagoConfig, Preference } = require('mercadopago')
const { getPlano } = require('../config/planos')

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })

router.post('/criar', async (req, res) => {
  try {
    const { planoId, email } = req.body
    const plano = getPlano(planoId || 'basico')

    const preference = new Preference(client)
    const resultado = await preference.create({
      body: {
        items: [
          {
            title: plano.nome,
            description: plano.descricao,
            quantity: 1,
            unit_price: plano.preco,
            currency_id: 'BRL',
          },
        ],
        metadata: {
          plano_id: plano.id, email_cliente: email || '',
        },
        back_urls: {
          // O download NUNCA vai aqui: ele so chega por e-mail, depois do pagamento aprovado
          success: 'https://mobilix-vitrine.onrender.com/obrigado.html',
          failure: 'https://mobilix-vitrine.onrender.com/erro-pagamento.html',
          pending: 'https://mobilix-vitrine.onrender.com/pendente.html',
        },
        auto_return: 'approved',
        notification_url: 'https://mobilix-licencas-nkce.onrender.com/webhook/mercadopago',
      },
    })

    res.json({ linkPagamento: resultado.init_point })
  } catch (err) {
    console.error('Erro ao criar checkout:', err.message)
    res.status(500).json({ erro: 'Não foi possível gerar o link de pagamento.' })
  }
})

module.exports = router