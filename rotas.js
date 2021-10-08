const express = rerquire('express');
const usuarios = require('./controladores/usuarios');
const clientes = require('./controladores/clientes');



const rotas = express();

//Usuarios
rotas.post('/login', usuarios.login);
rotas.post('/cadastro', usuarios.cadastrarUsuario);

//Clientes

module.exports = rotas;