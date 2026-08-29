// Script para criar as tabelas do banco de licenças automaticamente
require('dotenv').config()
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

if (!process.env.DATABASE_URL) {
  console.error('Erro: crie um arquivo .env com a variável DATABASE_URL antes de rodar este script.')
  process.exit(1)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function criarTabelas() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'criar_tabelas.sql'), 'utf-8')
    await pool.query(sql)
    console.log('Tabelas criadas com sucesso no banco de dados!')
  } catch (err) {
    console.error('Erro ao criar tabelas:', err.message)
  } finally {
    await pool.end()
  }
}

criarTabelas()