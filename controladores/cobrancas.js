const conexao = require('../conexao');

const cadastrarCobranca = async (req, res) =>{
    const { cliente_id, descricao, status_id, valor, vencimento } = req.body;

    if(!cliente_id){
        return res.status(400).json('Necessário informar um cliente cadastrado');
    }
    
    if(!descricao){
        return res.status(400).json('Favor descrever a cobrança');
    }

    if(!status_id){
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

        const query1 = 'INSERT INTO cobrancas (cliente_id, descricao, status_id, valor, vencimento) VALUES ($1, $2, $3, $4, $5)';
        const cadastroCobranca = await conexao.query(query1, [cliente_id, descricao, status_id, valor, vencimento]);
    
        if(cadastroCobranca.rowCount === 0){
            return res.status(400).json('Não foi possível cadastrar essa cobrança');
        }
    
        return res.status(200).json('Cobrança cadastrada com sucesso')
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const listarCobrancas = async (req, res) =>{
        try {
        const query = `SELECT 
                            cb.id, cl.nome, cb.descricao, cb.valor, cb.vencimento, s.descricao,
                            case 
                                when cb.vencimento < now() and cb.status_id = 1 then true end as vencido
                        FROM
                            cobrancas AS cb
                        JOIN
                            clientes AS cl ON cl.id = cb.cliente_id
                        JOIN
                            status AS s ON cb.status_id = s.id
                        GROUP BY
                            cb.id, cl.nome, s.descricao
                        ORDER BY
                            cb.id;`;
        const listaDeCobrancas = await conexao.query(query);

        if(listaDeCobrancas.rowCount === 0){
            return res.status(400).json('Não foi possível carregar a lista de cobranças');
        }

        return res.status(200).json(listaDeCobrancas.rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const editarCobranca = async (req, res) =>{
    const { id } = req.params;
    const { cliente_id, descricao, status_id, valor, vencimento } = req.body;

    if(!cliente_id){
        return res.status(400).json('É necessário informar um cliente');
    }
    if(!descricao){
        return res.status(400).json('É necessário informar uma descrição para a cobrança');
    }
    if(!status_id){
        return res.status(400).json('É necessário informar um status válido');
    }
    if(!valor){
        return res.status(400).json('É necessário informar um valor para essa cobrança');
    }
    if(!vencimento){
        return res.status(400).json('É necessário informar uma data de vencimento para essa cobrança');
    }
    
    try {    
        const query = 'SELECT * FROM clientes WHERE id = $1';
        const cliente =  await conexao.query(query, [cliente_id]);
        
        if(cliente.rowCount === 0){
            return res.status(400).json('É necessário infromar um cliente cadastrado');
        }
       
        const query1 = `
        UPDATE cobrancas
        SET cliente_id = $1, descricao = $2, status_id = $3, valor = $4, vencimento = $5
        WHERE id = $6`;

        const cobrancaEditada = await conexao.query(query1, [cliente_id, descricao, status_id, valor, vencimento, id])

        if(cobrancaEditada.rowCount === 0){
            return res.status(400).json('Não foi possível editar a cobranca');
        }
        return res.status(200).json('Cobranca atualizada com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

const excluirCobranca = async (req, res) =>{
    const { id } = req.params;

    try {
        const query = 'SELECT * FROM cobrancas WHERE id = $1';
        const cobranca = await conexao.query(query, [id]);

        if(cobranca.rowCount === 0){
            return res.status(400).json('Cobranca não cadastrada');
        }

        if(cobranca.rows[0].status_id != '1'){
            return res.status(400).json('Não é possível excluir uma cobrança que não está com o status pendente');
        }

        if(cobranca.rows[0].vencimento < new Date()){
            return res.status(400).json('Não é possível excluir uma cobrança em atraso');
        }

        const query1 = 'DELETE FROM cobrancas WHERE id=$1';
        const cobrancaExcluida = await conexao.query(query1, [id]);

        if(cobrancaExcluida.rowCount === 0){
            return res.status(400).json('Não foi possível excluir essa cobrança')
        }

        return res.status(200).json('Cobrança excluida com sucesso!');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const contadorStatus = async (req, res) =>{
    
    try {
        const queryPrevistas = 'SELECT count(status_id) FROM cobrancas WHERE status_id = 1 and vencimento > now();'
        const previstas = await conexao.query(queryPrevistas);
    
        const queryVencidas = 'SELECT count(status_id) FROM cobrancas WHERE status_id = 1 and vencimento < now();'
        const vencidas = await conexao.query(queryVencidas);
    
        const queryPagas = 'SELECT count(status_id) FROM cobrancas WHERE status_id = 2;';
        const pagas = await conexao.query(queryPagas);

        const cobrancaStatus = {
            "Previstas": previstas.rows[0],
            "Vencidas": vencidas.rows[0],
            "Pagas": pagas.rows[0]
        };

        return res.status(200).json(cobrancaStatus);        
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    cadastrarCobranca,
    listarCobrancas,
    editarCobranca,
    excluirCobranca,
    contadorStatus
}

