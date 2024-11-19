const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');  // Importando o CORS

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao banco de dados SQLite (ou criar um novo)
const db = new sqlite3.Database('./banco_de_dados.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite!');
    }
});

// Criar as tabelas se não existem
db.run(`
    CREATE TABLE IF NOT EXISTS  municipio (
        id_municipio INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_municipio VARCHAR(100) NOT NULL,
        estado VARCHAR(2) NOT NULL,
        populacao INT NOT NULL,
        taxa_consultas FLOAT NULL,
        natalidade FLOAT NULL,
        mortalidade FLOAT NULL,
        cobertura_vacinal FLOAT NULL
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS  profissional_saude (
        cpf_profissional BIGINT PRIMARY KEY,
        nome_profissional VARCHAR(255) NOT NULL,
        reg_profissional INT NOT NULL,
        tipo_profissional VARCHAR(10) NOT NULL
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS doenca (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_doenca TEXT NOT NULL,
        letalidade REAL NOT NULL,
        contagioso BOOLEAN NOT NULL
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS  paciente (
        cpf_paciente BIGINT PRIMARY KEY,
        nome_paciente VARCHAR(255) NOT NULL,
        genero VARCHAR(10) NULL,
        idade INT NULL
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS  unidade_saude (
        id_unidade INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_unidade VARCHAR(255) NOT NULL,
        capacidade INT NOT NULL,
        ref_municipio INT NOT NULL,
        FOREIGN KEY (ref_municipio) REFERENCES municipio(id_municipio)
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS  investimento (
        codigo_investimento INTEGER PRIMARY KEY AUTOINCREMENT,
        ref_municipio_investimento INT NOT NULL,
        valor_investimento FLOAT NOT NULL,
        data_investimento DATE NOT NULL,
        FOREIGN KEY (ref_municipio_investimento) REFERENCES municipio(id_municipio)
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS  diagnostico (
        id_diagnostico INTEGER PRIMARY KEY AUTOINCREMENT,
        ref_paciente BIGINT NOT NULL,
        ref_doenca VARCHAR(100) NULL,
        FOREIGN KEY (ref_paciente) REFERENCES paciente(cpf_paciente),
        FOREIGN KEY (ref_doenca) REFERENCES doenca(nome_doenca)
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS  atuacao (
        id_atuacao INTEGER PRIMARY KEY AUTOINCREMENT,
        ref_unidade INT NOT NULL,
        ref_profissional BIGINT NOT NULL,
        cargo VARCHAR(100) NULL,
        horas_trabalho int NULL,
        FOREIGN KEY (ref_profissional) REFERENCES profissional_saude(cpf_profissional),
        FOREIGN KEY (ref_unidade) REFERENCES unidade_saude(id_unidade)
        );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS  atendimento (
        ref_paciente_atendimento BIGINT NOT NULL,
        data_atendimento DATETIME NOT NULL,
        ref_unidade_atendimento INT NOT NULL,
        ref_profissional_atendimento BIGINT NOT NULL,
        FOREIGN KEY (ref_paciente_atendimento) REFERENCES paciente(cpf_paciente),
        FOREIGN KEY (ref_unidade_atendimento) REFERENCES unidade_saude(id_unidade),
        FOREIGN KEY (ref_profissional_atendimento) REFERENCES profissional_saude(cpf_profissional),
        PRIMARY KEY (ref_paciente_atendimento, data_atendimento)
    );
`);


// Função genérica para inserção no banco de dados
function inserirDados(tableName, fields, values, res) {
    const placeholders = fields.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders})`;

    db.run(sql, values, function (err) {
        if (err) {
            console.error(`Erro ao inserir dados na tabela ${tableName}:`, err.message);
            res.status(500).send(`Erro ao inserir dados na tabela ${tableName}.`);
        } else {
            res.send('Dados inseridos com sucesso!');
        }
    });
}

app.post('/inserir_municipio', (req, res) => {
    const { nome_municipio, estado, populacao, taxa_consultas, natalidade, mortalidade, cobertura_vacinal } = req.body;
    inserirDados('municipio', ['nome_municipio', 'estado', 'populacao', 'taxa_consultas', 'natalidade', 'mortalidade', 'cobertura_vacinal'], [nome_municipio, estado, populacao, taxa_consultas, natalidade, mortalidade, cobertura_vacinal], res);
});

app.post('/inserir_profissional_saude', (req, res) => {
    const { cpf_profissional, nome_profissional, reg_profissional, tipo_profissional } = req.body;
    inserirDados('profissional_saude', ['cpf_profissional', 'nome_profissional', 'reg_profissional', 'tipo_profissional'], [cpf_profissional, nome_profissional, reg_profissional, tipo_profissional], res);
});

app.post('/inserir_doenca', (req, res) => {
    const { nome_doenca, letalidade, contagioso } = req.body;
    inserirDados('doenca', ['nome_doenca', 'letalidade', 'contagioso'], [nome_doenca, letalidade, contagioso], res);
});

app.post('/inserir_paciente', (req, res) => {
    const { cpf_paciente, nome_paciente, genero, idade } = req.body;
    inserirDados('paciente', ['cpf_paciente', 'nome_paciente', 'genero', 'idade'], [cpf_paciente, nome_paciente, genero, idade], res);
});

app.post('/inserir_unidade_saude', (req, res) => {
    const { nome_unidade, capacidade, ref_municipio } = req.body;
    inserirDados('unidade_saude', ['nome_unidade', 'capacidade', 'ref_municipio'], [nome_unidade, capacidade, ref_municipio], res);
});

app.post('/inserir_investimento', (req, res) => {
    const { ref_municipio_investimento, valor_investimento, data_investimento } = req.body;
    inserirDados('investimento', ['ref_municipio_investimento', 'valor_investimento', 'data_investimento'], [ref_municipio_investimento, valor_investimento, data_investimento], res);
});

app.post('/inserir_diagnostico', (req, res) => {
    const { ref_paciente, ref_doenca } = req.body;
    inserirDados('diagnostico', ['ref_paciente', 'ref_doenca'], [ref_paciente, ref_doenca], res);
});

app.post('/inserir_atuacao', (req, res) => {
    const { ref_unidade, ref_profissional, cargo, horas_trabalho } = req.body;
    inserirDados('atuacao', ['ref_unidade', 'ref_profissional', 'cargo', 'horas_trabalho'], [ref_unidade, ref_profissional, cargo, horas_trabalho], res);
});

app.post('/inserir_atendimento', (req, res) => {
    const { ref_paciente_atendimento, data_atendimento, ref_unidade_atendimento, ref_profissional_atendimento } = req.body;
    inserirDados('atendimento', ['ref_paciente_atendimento', 'data_atendimento', 'ref_unidade_atendimento', 'ref_profissional_atendimento'], [ref_paciente_atendimento, data_atendimento, ref_unidade_atendimento, ref_profissional_atendimento], res);
});

app.get('/search', (req, res) => {
    const query = req.query.q;
    
    // Evitar SQL Injection com parâmetro de busca seguro
    db.all(`SELECT * FROM municipio WHERE nome_municipio LIKE ?`, [`%${query}%`], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Função genérica para criar rotas de visualização
function criarRotaVisualizacao(entidade) {
    app.get(`/visualizar_${entidade}`, (req, res) => {
        db.all(`SELECT * FROM ${entidade}`, [], (err, rows) => {
            if (err) {
                console.error(`Erro ao consultar ${entidade}:`, err.message);
                return res.status(500).json({ error: `Erro ao consultar ${entidade}.` });
            }
            res.status(200).json(rows);
        });
    });
}

// Lista de entidades
const entidades = [
    "municipio", "profissional_saude", "doenca", "paciente", "unidade_saude",
    "investimento", "diagnostico", "atuacao", "atendimento"
];

// Criar rotas dinamicamente
entidades.forEach(entidade => criarRotaVisualizacao(entidade));

// Mapeamento de entidades para os campos específicos
const entidadeMap = new Map([
    ['municipio', 'id_municipio'],
    ['profissional_saude', 'cpf_profissional'],
    ['doenca', 'id'],
    ['paciente', 'cpf_paciente'],
    ['unidade_saude', 'id_unidade'],
    ['investimento', 'codigo_investimento'],
    ['diagnostico', 'id_diagnostico'],
    ['atuacao', 'id_atuacao'],
]);

// DELETE - Deletar uma linha
app.delete('/delete/:entidade/:id', (req, res) => {
    const { entidade, id } = req.params;

    const campo = entidadeMap.get(entidade);
    if (!campo) {
        return res.status(400).json({ error: 'Entidade inválida.' });
    }

    const query = `DELETE FROM ${entidade} WHERE ${campo} = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao excluir registro.' });
        }
        res.status(200).json({ message: 'Registro excluído com sucesso!' });
    });
});

// PUT - Atualizar uma linha
app.put('/update/:entidade/:id', (req, res) => {
    const { entidade, id } = req.params;

    const campo = entidadeMap.get(entidade);
    if (!campo) {
        return res.status(400).json({ error: 'Entidade inválida.' });
    }

    const updates = req.body; // Expecta um objeto com os campos a serem atualizados
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const query = `UPDATE ${entidade} SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE ${campo} = ?`;

    db.run(query, [...values, id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao atualizar registro.' });
        }
        res.status(200).json({ message: 'Registro atualizado com sucesso!' });
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})
