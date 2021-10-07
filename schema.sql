CREATE DATABASE api_cobranca;

DROP TABLE IF EXISTS usuarios:
CREATE TABLE usuarios(
    id serial primary key,
    nome varchar(50) not null,
    email varchar(60) not null,
    senha varchar(15) not null
    cpf varchar(14),
    telefone varchar(14)
);

