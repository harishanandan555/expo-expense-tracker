// api_route/index.js
const { Router } = require('express');
// const stripe = require('./stripe');
const categories = require('./categories');

const router = Router();

// router.use('/stripe', stripe);
router.use('/categories', categories);

module.exports = router;




// import { Router } from 'express';
// // import stripe from './stripe';
// import categories from './categories.js';

// const router = Router();

// // router.use('/stripe', stripe);         
// router.use('/categories', categories); 

// export default router;