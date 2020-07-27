const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect DB by colling 'connectDB' method from config/db.js
connectDB();

// Init Middleware (express includes bodyParser)
// That allows get data in req.body
app.use(express.json({ extended: false }));

// Define Routes (make possibility access to the routes)
// For example: Go to 'users' by http://localhost:5000/api/users
// and then we have all requests that in routes/api/users.js file
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.get('/', (req, res) => res.send('API Running'));

// Look for invironment port (for Heroku connection)
const PORT = process.env.PORT || 5000;

// npm run server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//  Natalia123
// nabtab45dom

// mongodb+srv://Natalia123:nabtab45dom@humanconnector.fvw0h.mongodb.net/PrivateConnections?retryWrites=true&w=majority
