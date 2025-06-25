CREATE DATABASE loja;

USE loja;

CREATE TABLE produtos (
    id_prod INT AUTO_INCREMENT PRIMARY KEY,
    nome_prod VARCHAR(100) NOT NULL,
    quant_prod INT NOT NULL,
    preco_prod FLOAT NOT NULL
);
