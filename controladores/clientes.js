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
        const query = 'SELECT * FROM clientes WHERE cpf = $1;';
        const cpfCadastrado = await conexao.query(query, [cpf]);

        if(cpfCadastrado.rowCount > 0){
            return res.status(400).json('CPF já cadastrado');
        }
        
        const query1 = `
        INSERT INTO clientes
        (nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
        const cadastrarCliente = await conexao.query(query1, [nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado]);

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
        const query = `SELECT 
                            cl.id, nome, email, telefone,
                            sum(valor) as cobrancas_feitas,
                            sum(case when s.id = 2 then valor end) as recebidas,
                            sum(case when cb.vencimento < now() and cb.status_id = 1 then valor end) as inadimplente
                        FROM 
                            clientes AS cl
                        LEFT JOIN
                            cobrancas AS cb ON cl.id = cb.cliente_id
                        LEFT JOIN
                            status AS s ON cb.status_id = s.id
                        GROUP BY 
                            cl.id
                        ORDER BY 
                            cl.nome;`;

        const listaClientes = await conexao.query(query);

        if(listaClientes.rowCount === 0){
            return res.status(400).json('Não foi possível listar os clientes');
        }

        return res.status(200).json(listaClientes.rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const detalheCliente = async (req, res) =>{
    const { id } = req.params;

    try {
        const query = 'SELECT * FROM clientes WHERE id = $1';
        const cliente = await conexao.query(query, [id]);

        if (cliente.rowCount === 0){
            return res.status(400).json('Cliente indisponível');
        }

        const query1 = 'SELECT * FROM cobrancas WHERE cliente_id = $1';
        const cobrancas = await conexao.query(query1, [id]);

        const detalheCliente = [cliente.rows, cobrancas.rows];

        return res.status(200).json(detalheCliente);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const editarCliente = async (req, res) =>{
    const { id } = req.params;
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
        const query = 'SELECT * FROM clientes WHERE id = $1';
        const cliente =  await conexao.query(query, [id]);
        
        if(cliente.rows[0].email != email){
            const query = 'SELECT * FROM clientes WHERE email = $1';
            const emailCadastrado =  await conexao.query(query, [email]);

            if(emailCadastrado.rowCount > 0){
                return res. status(400).json('Este email já foi cadastrado para outro cliente');
            }
        }

        if(cliente.rows[0].cpf != cpf){
            const query = 'SELECT * FROM clientes WHERE cpf = $1';
            const cpfCadastrado =  await conexao.query(query, [cpf]);

            if(cpfCadastrado.rowCount > 0){
                return res. status(400).json('Este CPF já foi cadastrado para outro cliente');
            }
        }
       
        const query1 = `
        UPDATE clientes
        SET nome = $1, email = $2, cpf = $3, telefone = $4, cep = $5, logradouro = $6, complemento = $7, bairro = $8, cidade = $9, estado = $10
        WHERE id = $11`;

        const clienteEditado = await conexao.query(query1, [ nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado, id])

        if(clienteEditado.rowCount === 0){
            return res.status(400).json('Não foi possível editar o cliente');
        }
        return res.status(200).json('Cliente atualizado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    };
};


module.exports = {
    cadastrarCliente,
    listarClientes,
    detalheCliente,
    editarCliente
}