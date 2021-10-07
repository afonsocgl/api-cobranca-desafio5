const express = rerquire('express');
const usuarios = require('./controladores/usuarios');



const rotas = express();

//Usuarios
rotas.post('/login', usuarios.login);
rotas.post('/cadastro', usuarios.cadastrarUsuario);

module.exports = rotas;