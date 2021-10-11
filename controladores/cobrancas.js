const conexao = require('../conexao');

const cadastrarCobranca = async (req, res) =>{
    const { cliente_id, descricao, status, valor, vencimento } = req.body;

    if(!cliente_id){
        return res.status(400).json('Necessário informar um cliente cadastrado');
    }
    
    if(!descricao){
        return res.status(400).json('Favor descrever a cobrança');
    }

    if(!status){
        return res.status(400).json('Qual status desta cobrança? Pago ou Pendente');
    }
    
    if(!valor){
        return res.status(400).json('Necessário informar o valor da cobrança');
    }
    
    if(!vencimento){
        return res.status(400).json('Necessário informar vencimento da cobrança');
    }

    
    try {
        const query = 'SELECT * FROM clientes WHERE id = $1'
        const clienteCadastrado = await conexao.query(query, [cliente_id]);

        if(clienteCadastrado.rowCount === 0){
            return res.status(400).json('O cliente informado deve ser cadastrado previamente');
        }

        const query1 = 'INSERT INTO cobrancas (cliente_id, descricao, status, valor, vencimento) VALUES ($1, $2, $3, $4, $5)';
        const cadastroCobranca = await conexao.query(query1, [cliente_id, descricao, status, valor, vencimento]);
    
        if(cadastroCobranca.rowCount === 0){
            return res.status(400).json('Não foi possível cadastrar essa cobrança');
        }
    
        return res.status(200).json('Cobrança cadastrada com sucesso')
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    cadastrarCobranca
}

