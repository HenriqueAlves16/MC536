const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const db = new sqlite3.Database('./banco_de_dados.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite!');
    }
});

const sqlFilePath = path.join(__dirname, 'populate.sql');
const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

db.exec(sqlScript, (err) => {
    if (err) {
        console.error('Erro ao executar o script: ', err);
    } else {
        console.log('Script executado corretamente');
    }
    db.close();
});
