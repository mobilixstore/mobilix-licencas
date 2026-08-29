const { Pool } = require('pg')

// O Render fornece uma "Connection String" única (DATABASE_URL) para o PostgreSQL.
// Copie ela do painel do Render e cole na variável DATABASE_URL do .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // necessário para conectar no PostgreSQL do Render
})

// Função auxiliar que imita o formato do mysql2 (retorna [rows]),
// assim o resto do código continua igual e mais fácil de entender
async function query(texto, parametros) {
  // PostgreSQL usa $1, $2, $3... em vez de ? para os parâmetros
  let indice = 0
  const textoConvertido = texto.replace(/\?/g, () => '$' + (++indice))
  const resultado = await pool.query(textoConvertido, parametros)
  return [resultado.rows]
}

module.exports = { query }
