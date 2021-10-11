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
    cpf varchar(14) not null,
    telefone varchar(14) not null,
    cep varchar(10),
    logradouro varchar(100),
    complemento varchar(30),
    bairro varchar(50),
    cidade varchar(50),
    estado varchar(20)
);

DROP TABLE IF EXISTS cobrancas;
CREATE TABLE COBRANCAS(
  id serial primary key,
  cliente_id int references clientes (id),
  descricao varchar(300) not null,
  status varchar(8) not null,
  valor int not null,
  vencimento date not null
);