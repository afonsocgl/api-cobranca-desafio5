CREATE DATABASE api_cobranca;

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios(
    id serial primary key,
    nome varchar(50) not null,
    email varchar(60) not null,
    senha char(300) not null,
    cpf varchar(14),
    telefone varchar(14)
);


DROP TABLE IF EXISTS clientes;
CREATE TABLE clientes(
    id serial primary key,
    nome varchar(50) not null,
    email varchar(60) not null,
    cpf varchar(20) not null,
    telefone varchar(20) not null,
    cep varchar(10),
    logradouro varchar(100),
    complemento varchar(30),
    bairro varchar(50),
    cidade varchar(50),
    estado varchar(20)
);

DROP TABLE IF EXISTS status;
CREATE TABLE status(
  id serial primary key,
  descricao varchar(10) not null
);

DROP TABLE IF EXISTS cobrancas;
CREATE TABLE COBRANCAS(
  id serial primary key,
  cliente_id int references clientes (id),
  descricao varchar(300) not null,
  status_id int references status (id),
  valor int not null,
  vencimento date not null
);