const express = require('express')
const router = express.Router()
const { MercadoPagoConfig, Preference } = require('mercadopago')
const { getPlano } = require('../config/planos')

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })

router.post('/criar', async (req, res) => {
  try {
    const { planoId } = req.body
    const plano = getPlano(planoId || 'basico')

    const precoPorPlano = {
      basico: 297,
    }
    const preco = precoPorPlano[plano.id] || 297

    const preference = new Preference(client)
    const resultado = await preference.create({
      body: {
        items: [
          {
            title: plano.nome,
            description: plano.descricao,
            quantity: 1,
            unit_price: preco,
            currency_id: 'BRL',
          },
        ],
        metadata: {
          plano_id: plano.id,
        },
        back_urls: {
          success: process.env.LINK_DOWNLOAD_SISTEMA || 'https://mobilixsaas.com.br/obrigado',
          failure: 'https://mobilixsaas.com.br/erro-pagamento',
          pending: 'https://mobilixsaas.com.br/pagamento-pendente',
        },
        auto_return: 'approved',
        notification_url: 'https://mobilix-licencas.onrender.com/webhook/mercadopago',
      },
    })

    res.json({ linkPagamento: resultado.init_point })
  } catch (err) {
    console.error('Erro ao criar checkout:', err.message)
    res.status(500).json({ erro: 'Não foi possível gerar o link de pagamento.' })
  }
})

module.exports = router
