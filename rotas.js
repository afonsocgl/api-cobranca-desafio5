const express = rerquire('express');
const usuarios = require('./controladores/usuarios');



const rotas = express();

//Usuarios

rotas.post('/login', usuarios.login);

module.exports = rotas;