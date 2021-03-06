const conexao = require('../conexao');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const pwd = securePassword();

const cadastrarUsuario = async (req, res) =>{
    const { nome, email, senha } = req.body;

    if(!nome){
        return res.status(400).json('O campo nome é obrigatório');
    }

    if(!email){
        return res.status(400).json('O campo email é obrigatório');
    }

    if(!senha){
        return res.status(400).json('O campo senha é obrigatório');
    }

    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1'
        const emailJaCadastrado = await conexao.query(query, [email]);

        if(emailJaCadastrado.rowCount > 0){
            return res.status(400).json('Email já cadastrado');
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const query1 = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)';
        const usuario = await conexao.query(query1, [nome, email, hash]);
        
        if(usuario.rowCount === 0){
            return res.status(400).json('Não foi possível cadastar o usuário');
        }

        return res.status(200).json('Usuário cadastrado com sucesso');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const login = async (req, res) =>{
    const { email, senha } = req.body;
    
    if (!email){
        return res.status(400).json('O campo e-mail é obrigatório!');
    }
    if(!senha){
        return res.status(400).json('O campo senha é obrigatório!');
    }

    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const usuarios = await conexao.query(query, [email]);
        
        if (usuarios.rowCount === 0){
            return res.status(400).json('Usuário não cadastrado');
        }
        
        const usuario = usuarios.rows[0];
        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json('E-mail e/ou senha incorretos');
            case securePassword.VALID:                
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
                    const query = 'UPDATE usuarios SET senha = $1 WHERE email = $2';
                    await conexao.query(query, [hash, email]);
                } catch (error) {
                }
        }
        const token = jwt.sign({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }, jwtSecret);

        return res.send(token);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const editarUsuario = async (req, res) =>{
    const { nome, email, senha, cpf, telefone } = req.body;
    const { usuario } = req;

    if(!nome){
        return res.status(400).json("Necessário informar um nome");
    }
    
    if(!email){
        return res.status(400).json("Necessário informar um email");
    }
    
    if(!senha){
        return res.status(400).json("Necessário informar uma senha");
    }
    
    try {
        if(email != usuario.email){
            const query = 'SELECT * FROM usuarios WHERE email = $1';
            const testeEmail = await conexao.query(query, [email]);
            
            if(testeEmail.rowCount > 0){
                return res.status(400).json('Email já cadastrado');
            }
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const query1 = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3, cpf = $4, telefone = $5 WHERE id = $6';
        const editarUsuario = await conexao.query(query1, [nome, email, hash, cpf, telefone, usuario.id]);

        if(editarUsuario.rowCount === 0){
            return res.status(400).json('Não foi possível atualizar o usuário');
        }

        return res.status(200).json('Usuário atualizado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    login,
    cadastrarUsuario,
    editarUsuario
};