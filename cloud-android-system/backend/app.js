const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const users = require('./api/users');
const payments = require('./api/payments');
const emulator = require('./api/emulator');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/payments', payments);
app.use('/api/emulator', emulator);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
