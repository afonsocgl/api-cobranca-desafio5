const conexao = require('../conexao');


const cadastrarCliente = async (req, res) =>{
    const { nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado } = req.body;

    if(!nome){
        return res.status(400).json('É necessário informar nome do cliente');
    }
    if(!email){
        return res.status(400).json('É necessário informar um email para o cliente');
    }
    if(!cpf){
        return res.status(400).json('É necessário informar o CPF do cliente');
    }
    if(!telefone){
        return res.status(400).json('É necessário informar o telefone do cliente');
    }

    try {
        const query = `
        INSERT INTO clientes
        (nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
        const cadastrarCliente = await conexao.query(query, [nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado]);

        if(cadastrarCliente.rowCount === 0){
            return res.status(400).json('Não foi possível cadastrar o cliente');
        }
        
        return res.status(200).json('Cliente cadastrado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const listarClientes = async (req, res) =>{
    try {
        const query = `SELECT nome, email, telefone, status, sum(valor) as divida FROM clientes
                        JOIN cobrancas ON clientes.id = cobrancas.cliente_id
                        GROUP BY nome, email, telefone, status`;

        const listaClientes = await conexao.query(query);

        if(listaClientes.rowCount === 0){
            return res.status(400).json('Não foi possível listar os clientes');
        }

        return res.status(200).json(listaClientes.rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};


module.exports = {
    cadastrarCliente,
    listarClientes
}