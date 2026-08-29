-- Script para criar as tabelas do sistema de licenças do MobilixStore
-- Rode esse script no banco PostgreSQL criado no Render
-- (No painel do Render, vá em "Shell" ou use um cliente como o pgAdmin/DBeaver)

CREATE TABLE IF NOT EXISTS licencas (
  id SERIAL PRIMARY KEY,
  chave VARCHAR(30) NOT NULL UNIQUE,
  email_cliente VARCHAR(150) NOT NULL,
  nome_cliente VARCHAR(150),
  plano_id VARCHAR(50) NOT NULL DEFAULT 'basico',
  maquinas_permitidas INT NOT NULL DEFAULT 1,
  id_pagamento VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'bloqueada', 'cancelada')),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS licencas_maquinas (
  id SERIAL PRIMARY KEY,
  licenca_id INT NOT NULL REFERENCES licencas(id) ON DELETE CASCADE,
  id_maquina VARCHAR(200) NOT NULL,
  nome_maquina VARCHAR(150),
  ativado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (licenca_id, id_maquina)
);
