const { Pool } = require('pg');

const pool = new Pool({
    user: 'istapowdfadyft',
    host: 'ec2-54-166-120-40.compute-1.amazonaws.com',
    database: 'dau1h546gi3dnq',
    password: 'cd27e349fd1fc1747d3946bb4b9a3bd630ed7fb25c7a75c9600b6ff82b657b51',
    port: 5432,
    ssl:{
        rejectUnauthorized: false
    }
});

const query = (text, param) =>{
    return pool.query(text, param);
};

module.exports ={
    query
};


