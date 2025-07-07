const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const filePath = path.join(__dirname, 'parole5lettere.txt');
    console.log(__dirname)
    const parole = fs.readFileSync(filePath, 'utf8').split('\n').map(p => p.trim());

    const random = parole[Math.floor(Math.random() * parole.length)];

    return {
      statusCode: 200,
      body: JSON.stringify({
        secret: random.toUpperCase(),
        wordList: parole
      }),
    };
  } catch (err) {
    console.error('Errore funzione get-word:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};