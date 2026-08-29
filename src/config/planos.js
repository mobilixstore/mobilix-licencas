// ============================================================
// CONFIGURAÇÃO DOS PLANOS DE VENDA DO MOBILIXSTORE
// ============================================================
// Para adicionar um novo plano, basta adicionar um novo item aqui.
// "id" deve ser igual ao identificador do produto configurado no Mercado Pago.
// "maquinas" define quantos computadores podem usar a mesma licença.
// ============================================================

const PLANOS = {
  basico: {
    id: 'basico',
    nome: 'MobilixStore Básico',
    maquinas: 1,
    descricao: 'Licença para uso em 1 computador',
  },

  // Exemplo de como adicionar mais planos no futuro:
  // pro: {
  //   id: 'pro',
  //   nome: 'MobilixStore Pro',
  //   maquinas: 3,
  //   descricao: 'Licença para uso em até 3 computadores',
  // },
  // premium: {
  //   id: 'premium',
  //   nome: 'MobilixStore Premium',
  //   maquinas: 10,
  //   descricao: 'Licença para uso em até 10 computadores (rede de lojas)',
  // },
}

function getPlano(id) {
  return PLANOS[id] || PLANOS.basico
}

module.exports = { PLANOS, getPlano }
