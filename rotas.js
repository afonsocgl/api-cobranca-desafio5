const express = require('express');
const usuarios = require('./controladores/usuarios');
const clientes = require('./controladores/clientes');
const cobrancas = require('./controladores/cobrancas');
const verificacao = require('./filtros/verificaLogin');


const rotas = express();

//Usuarios
rotas.post('/login', usuarios.login);
rotas.post('/cadastro', usuarios.cadastrarUsuario);
rotas.put('/perfil', verificacao, usuarios.editarUsuario);

//Clientes
rotas.post('/cadastrocliente', verificacao, clientes.cadastrarCliente);
rotas.get('/clientes', verificacao, clientes.listarClientes);
rotas.get('/clientes/:id', verificacao, clientes.detalheCliente);
rotas.put('/clientes/:id', verificacao, clientes.editarCliente);

//Cobranças
rotas.post('/cobrancas', verificacao, cobrancas.cadastrarCobranca);

module.exports = rotas;