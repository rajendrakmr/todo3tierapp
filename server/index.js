const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root', // 👈 Replace with your actual MySQL password
    database: 'todo_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/todos', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM todos');
    res.json(rows);
});

app.post('/todos', async (req, res) => {
    const { text } = req.body;
    const [result] = await pool.query('INSERT INTO todos (text) VALUES (?)', [text]);
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
});

app.put('/todos/:id', async (req, res) => {
    await pool.query('UPDATE todos SET done = NOT done WHERE id = ?', [req.params.id]);
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
        res.json(rows[0]);
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

app.put('/todos/:id/edit', async (req, res) => {
    const { text } = req.body;
    await pool.query('UPDATE todos SET text = ? WHERE id = ?', [text, req.params.id]);
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  });
  
app.delete('/todos/:id', async (req, res) => {
    await pool.query('DELETE FROM todos WHERE id = ?', [req.params.id]);
    res.status(204).end();
});

app.listen(5000, () => console.log('Server is running on port 5000'));
