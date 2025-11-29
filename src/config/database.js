const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/**
 * Função para executar uma query no banco de dados.
 * @param {string} text - A query SQL.
 * @param {Array} params - Os parâmetros da query.
 * @returns {Promise<Object>} - O resultado da query.
 */
const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
  // Função de inicialização do DB para criar as tabelas
  async initializeDatabase() {
    console.log('Verificando e criando tabelas...');
    try {
      // Cria a tabela Order
      await query(`
        CREATE TABLE IF NOT EXISTS "Order" (
          orderId VARCHAR(255) PRIMARY KEY,
          value NUMERIC(10, 2) NOT NULL,
          creationDate TIMESTAMP WITH TIME ZONE NOT NULL
        );
      `);

      // Cria a tabela Items, com chave estrangeira para Order
      await query(`
        CREATE TABLE IF NOT EXISTS "Items" (
          id SERIAL PRIMARY KEY,
          orderId VARCHAR(255) REFERENCES "Order"(orderId) ON DELETE CASCADE,
          productId VARCHAR(255) NOT NULL,
          quantity INTEGER NOT NULL,
          price NUMERIC(10, 2) NOT NULL
        );
      `);
      console.log('Tabelas "Order" e "Items" verificadas/criadas com sucesso.');
    } catch (err) {
      console.error('Erro ao inicializar o banco de dados:', err);
      // O processo deve parar se o DB não puder ser inicializado.
      process.exit(1); 
    }
  }
};