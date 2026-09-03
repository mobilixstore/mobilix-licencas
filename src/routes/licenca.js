const express = require('express')
const router = express.Router()
const db = require('../config/database')

router.post('/ativar', async (req, res) => {
  const { chave, idMaquina, nomeMaquina } = req.body

  if (!chave || !idMaquina) {
    return res.status(400).json({ erro: 'Chave de licença e identificação da máquina são obrigatórias.' })
  }

  try {
    const [licencas] = await db.query('SELECT * FROM licencas WHERE chave = ?', [chave.trim().toUpperCase()])

    if (licencas.length === 0) {
      return res.status(404).json({ erro: 'Chave de licença não encontrada. Verifique se digitou corretamente.' })
    }

    const licenca = licencas[0]

    if (licenca.status !== 'ativa') {
      return res.status(403).json({ erro: 'Esta licença está bloqueada. Entre em contato com a Mobilix.' })
    }

    const [maquinas] = await db.query(
      'SELECT * FROM licencas_maquinas WHERE licenca_id = ? AND id_maquina = ?',
      [licenca.id, idMaquina]
    )

    if (maquinas.length > 0) {
      return res.json({
        sucesso: true,
        mensagem: 'Licença já ativada nesta máquina.',
        cliente: licenca.nome_cliente,
        plano: licenca.plano_id,
      })
    }

    const [contagem] = await db.query(
      'SELECT COUNT(*) as total FROM licencas_maquinas WHERE licenca_id = ?',
      [licenca.id]
    )
    const maquinasUsadas = contagem[0].total

    if (maquinasUsadas >= licenca.maquinas_permitidas) {
      return res.status(403).json({
        erro: `Esta licença já está sendo usada no limite de ${licenca.maquinas_permitidas} computador(es). Para liberar mais máquinas, entre em contato com a Mobilix.`,
      })
    }

    await db.query(
      'INSERT INTO licencas_maquinas (licenca_id, id_maquina, nome_maquina) VALUES (?, ?, ?)',
      [licenca.id, idMaquina, nomeMaquina || 'Computador']
    )

    res.json({
      sucesso: true,
      mensagem: 'Licença ativada com sucesso!',
      cliente: licenca.nome_cliente,
      plano: licenca.plano_id,
    })
  } catch (err) {
    console.error('Erro ao ativar licença:', err.message)
    res.status(500).json({ erro: 'Erro interno ao validar a licença. Tente novamente.' })
  }
})

router.post('/verificar', async (req, res) => {
  const { chave, idMaquina } = req.body

  try {
    const [licencas] = await db.query('SELECT * FROM licencas WHERE chave = ?', [chave])
    if (licencas.length === 0 || licencas[0].status !== 'ativa') {
      return res.json({ valida: false })
    }

    const [maquinas] = await db.query(
      'SELECT * FROM licencas_maquinas WHERE licenca_id = ? AND id_maquina = ?',
      [licencas[0].id, idMaquina]
    )

    res.json({ valida: maquinas.length > 0 })
  } catch (err) {
    res.json({ valida: true, offline: true })
  }
})

module.exports = router