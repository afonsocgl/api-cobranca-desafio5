const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');


const verificacao = async (req, res, next) =>{
    const { authorization } = req.headers;
    
    if(!authorization){
        return res.status(400).json('Necessário fazer login');
    }

    try {
        const token = authorization.replace('Bearer', '').trim();
        const verificacao = jwt.verify(token, jwtSecret);
        const query = 'SELECT * FROM usuarios WHERE id=$1';
        const { rows, rowCount } = await conexao.query(query, [verificacao.id]);

        if(rowCount === 0){
            return res.status(404).json('Usuário não encontrado');
        }

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = verificacao;