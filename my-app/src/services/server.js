const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.use(cors());
app.use(express.json());

//mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Unable to connect to MongoDB", err));

//router
const userRoutes = require('./routes/userRoutes.js');
const shiftRoutes = require('./routes/shiftRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');

app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/ai', aiRoutes);

app.listen(5000, () => {
    console.log('Server running on port 5000');
})