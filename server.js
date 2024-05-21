const express = require('express');
const app = express();
const port = 3000; // Choose your desired port

app.get('/', (req, res) => {
  res.send('Hello World!'); // Basic response
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
