const express = require('express');
const usuarios = require('./controladores/usuarios');
const clientes = require('./controladores/clientes');
const verificacao = require('./filtros/verificaLogin');


const rotas = express();

//Usuarios
rotas.post('/login', usuarios.login);
rotas.post('/cadastro', usuarios.cadastrarUsuario);

//Clientes
rotas.post('cadastrocliente', verificacao, clientes.cadastrarCliente);

module.exports = rotas;