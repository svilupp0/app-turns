const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'francesca',
  database: 'turni_lavoro'
});

app.use(cors());
app.use(express.static('src'));

connection.connect(err => {
  if (err) {
    console.error('Errore di connessione: ' + err.stack);
    return;
  }
  console.log('Connesso al database MySQL');
});

app.get('/api/utenti', (req, res) => {
  connection.query('SELECT * FROM utenti', (err, results) => {
    if (err) {
      console.error('Errore recupero utenti:', err);
      res.status(500).send('Errore nel recupero degli utenti');
      return;
    }
    res.json(results);
  });
});

app.get('/api/turni', (req, res) => {
  connection.query('SELECT * FROM turni', (err, results) => {
    if (err) {
      console.error('Errore recupero turni:', err);
      res.status(500).send('Errore nel recupero dei turni');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
