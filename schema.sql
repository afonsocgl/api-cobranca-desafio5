CREATE DATABASE api_cobranca;

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios(
    id serial primary key,
    nome varchar(50) not null,
    email varchar(60) not null,
    senha varchar(15) not null,
    cpf varchar(14),
    telefone varchar(14)
);


DROP TABLE IF EXISTS clientes;
CREATE TABLE clientes(
    id serial primary key,
    nome varchar(50) not null,
    email varchar(60) not null,
    cpf varchar(14) not null,
    telefone varchar(14) not null,
    cep varchar(10),
    logradouro varchar(100),
    complemento varchar(30),
    bairro varchar(50),
    cidade varchar(50),
    estado varchar(20)
);
