const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Qui scrivi i dati del tuo database MySQL:
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'francesca',   // cambia con la tua password MySQL
  database: 'turni_lavoro'    // cambia con il nome del tuo database
});

app.use(express.static('src'));
// Connessione al database MySQL

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
      res.status(500).send('Errore nel recupero degli utenti');
      return;
    }
    res.json(results);
  });
});

// Questo serve a rispondere alle richieste dei turni:
app.get('/api/turni', (req, res) => {
  connection.query('SELECT * FROM turni', (err, results) => {
    if (err) {
      res.status(500).send('Errore nel recupero dei turni');
      return;
    }
    res.json(results);
  });
});


app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
