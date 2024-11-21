const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const schoolRoutes = require('./routes/schoolroutes');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api', schoolRoutes);

app.get('/', (req, res) => {
    res.send("welcome to list of schools");
})