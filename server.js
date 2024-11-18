// server.js
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const BaseRouter = require("./api_route/index");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(`/`, BaseRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// import express from 'express';
// import cors from 'cors';
// import BaseRouter from './api_route/index.js';

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(`/`, BaseRouter);

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });