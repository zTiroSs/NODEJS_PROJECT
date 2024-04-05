const express = require('express');
const router = express.Router();
const multer = require('multer');
const connectDb = require('../models/db');
const path = require('path');
// Quản lí khách hàng
router.get('/', async(req, res, next) => {
    const db = await connectDb();
    const userCollection = db.collection('users');
    const users = await userCollection.find().toArray();
    res.render('user-manager', { users});
  });

  router.get('/edit/:id', async (req, res,next) => {
    const db = await connectDb();
    const userCollection = db.collection('users');
    let id = req.params.id;
    let user = await userCollection.findOne({id:parseInt(id)});
    res.render('editUser', { user });
});
router.post('/edit', async (req, res, next) => {
      const db = await connectDb();
      const { id, name, email, trangthai, vaitro } = req.body;
      const userCollection = db.collection('users');
      await userCollection.findOneAndUpdate(
          { id: parseInt(id) },
          { $set: { name, email, trangthai, vaitro } }
      );
});


module.exports = router;
