const { v4: uuidv4 } = require('uuid')

// Gera uma chave de licença no formato: MOBX-XXXX-XXXX-XXXX-XXXX
// Fácil de digitar e ler, mas praticamente impossível de adivinhar
function gerarChaveLicenca() {
  const uuid = uuidv4().replace(/-/g, '').toUpperCase()
  const blocos = [
    uuid.slice(0, 4),
    uuid.slice(4, 8),
    uuid.slice(8, 12),
    uuid.slice(12, 16),
  ]
  return 'MOBX-' + blocos.join('-')
}

module.exports = { gerarChaveLicenca }
