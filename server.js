const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('API Running'));

// Look for invironment port (for Heroku connection)
const PORT = process.env.PORT || 5000;

// npm run server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
