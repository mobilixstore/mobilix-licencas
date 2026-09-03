const PLANOS = {
  basico: {
    id: 'basico',
    nome: 'MobilixStore Básico',
    maquinas: 1,
    preco: 297,
    descricao: 'Licença para uso em 1 computador',
  },
  pro: {
    id: 'pro',
    nome: 'MobilixStore Pro',
    maquinas: 3,
    preco: 497,
    descricao: 'Licença para uso em até 3 computadores',
  },
  premium: {
    id: 'premium',
    nome: 'MobilixStore Premium',
    maquinas: 10,
    preco: 997,
    descricao: 'Licença para uso em até 10 computadores (rede de lojas)',
  },
}

function getPlano(id) {
  return PLANOS[id] || PLANOS.basico
}

module.exports = { PLANOS, getPlano }