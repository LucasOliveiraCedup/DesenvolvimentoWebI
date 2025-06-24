//Dependências //Executar da primeira vez
//npm init -y
//npm install express mysql2 dotenv
//npm install cors

//Para executar o servidor
//nodemon server.js

const cors = require('cors');

const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || 3000;

// Rota GET - Listar Produtos
app.get('/listarProd', (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

//Rota POST - Cadastrar um novo produto
app.post('/cadProd', (req, res) => {
  // As variáveis dentro dos {} recebem os dados que vieram do front-end
  const { nome_prod, quant_prod, preco_prod } = req.body;

  //Se os dados que vieram do font-end forem em branco
  if (!nome_prod || !quant_prod || !preco_prod) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  //Realiza a inserção dos dados recebidos no banco de dados
  const sql = 'INSERT INTO produtos (nome_prod, quant_prod, preco_prod) VALUES (?, ?, ?)';
  db.query(sql, [nome_prod, quant_prod, preco_prod], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Produto já está cadastrado' });
      }
      return res.status(500).json({ error: err.message });
    }

    // Em caso de sucesso encaminha uma mensagem e o id do produto
    res.status(201).json({ message: 'O produto foi cadastrado com sucesso', id: result.insertId });
  });
});

// Rota POST - Verifica um produto pelo nome e retorna a sua quantidade
// Usamos uma rota POST porque não é possível receber dados do front-end na rota GET
app.post('/verificaDisp', (req, res) => {
  const { nome_prod } = req.body;

  if (!nome_prod) {
    return res.status(400).json({ error: 'O nome do produto não pode ser em branco' });
  }

  // Realiza a consulta no banco de dados
  const sql = 'SELECT quant_prod FROM produtos WHERE nome_prod = ?';
  db.query(sql, [nome_prod], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // quanto achou o resultado
    const produto = results[0];
    res.json({
      message: 'Produto encontrado',
      produto: {
        quant_prod: produto.quant_prod
      }
    });
  });
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});