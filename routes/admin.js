const express = require('express');
const router = express.Router();
const multer = require('multer');
const connectDb = require('../models/db');

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function fetchData(collectionName) {
    try {
        await client.connect();
        const database = client.db('DB_ASM');
        const collection = database.collection(collectionName);
        const data = await collection.find().toArray();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
router.get('/', async (req, res, next) => {
    const db = await connectDb();
    const usersData = db.collection('users');
    const productsData = db.collection('products');
    const categoriesData = db.collection('categories');
    const users = await usersData.find().toArray();
    const products = await productsData.find().toArray();
    const categories = await categoriesData.find().toArray();
    res.render('admin', { users, products, categories });
});
module.exports = router;
