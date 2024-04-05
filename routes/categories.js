const express = require('express');
const router = express.Router();
const multer = require('multer');
const connectDb = require('../models/db');
const upload = multer({ dest: '../public/images/' }); 


router.get('/',async(req,res,next)=>{
  const db = await connectDb();
  const categoriesCollection = db.collection('categories');
  const categories = await categoriesCollection.find().toArray();
  res.render('cateShow',{categories})
});
// // POST thêm danh mục

router.get('/add', function(req,res,next){
  res.render('addCate');
});
router.post('/add', upload.single('img'),async (req, res,next) => {
  const db = await connectDb();
  const categoriesCollection=  db.collection('categories');
  let {ten_loai} = req.body;
  let img = req.file.originalname;
  let lastCate = await categoriesCollection.find().sort({id:-1}).limit(1).toArray();
  let id = lastCate[0] ? lastCate[0].id + 1 :1;
  let newCate = {id,ten_loai,img};
  await categoriesCollection.insertOne(newCate);
  res.redirect("/categories");
});
// // Xóa sản phẩm
router.get('/delete/:id', async (req, res) => {
  let id = req.params.id;
  const db = await connectDb();
  let categoriesCollection = db.collection('categories');
  await categoriesCollection.deleteOne({id:parseInt(id)});
  res.redirect("/categories");
});

// // Sửa danh mục
router.get('/edit/:id', async (req, res,next) => {
  const db = await connectDb();
  const categoriesCollection=  db.collection('categories');
  let id = req.params.id;
  let category = await categoriesCollection.findOne({id:parseInt(id)});
  // res.render('editPro', { product, categories });
  res.render('editCate', { category});
});

// // Post để sửa danh mục
router.post('/edit', upload.single('img'), async (req, res,next) => {
  const db = await connectDb();
  let categoriesCollection = db.collection('categories');
  let { ten_loai, id } = req.body;
  let img = req.file ? req.file.originalname : req.body.imgOld;
  let editCate = { ten_loai, img };
  await categoriesCollection.updateOne({ id: parseInt(id) }, { $set: editCate });
  res.redirect("/categories");
});




// CODE NÀy cũ rồi
// const categories = [
//     { id: 1, name: "category 1", img: "ca.png"},
//     { id: 2, name: "category 2", img: "img1.jpg"},
//     { id: 3, name: "category 3", img: "img1.jpg"},
// ];

// router.get('/', (req, res) => {
//   res.render('cateShow', { categories });
// });
// router.get('/add', (req, res) => {
//   res.render('addCate');
// });
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/images')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// });
// const upload = multer({ storage: storage});
// router.post('/add', upload.single('imgCate'), (req, res) => {
//   let name = req.body.nameCate;
//   let img = req.file.originalname;
//   let id = categories.length + 1; // Tạo ID mới bằng cách tăng ID cao nhất lên 1
//   categories.push({ id, name , img});
//   res.redirect("/categories");
// });

// router.get('/:id', function(req, res, next) {
//   let id = req.params.id;
//   let categorie = categories.find(p => p.id == id);
//   if (categorie) {
//     res.send(`
//       <h1>${categorie.name}</h1>
//       <p>${categorie.id}</p>
//       <img src="/images/${categorie.img}" alt="" width="200px">
//     `);
//   } else {
//     res.send("Không tìm thấy danh mục!");
//   }
// });
// // Get để hiển thị trang sửa sản phẩm
// router.get('/edit/:id', (req, res) => {
//   let id = req.params.id;
//   let categorie = categories.find(p => p.id == id);
//   res.render('editCate', { categorie });
// });
// router.get('/delete/:id', (req, res) => {
//   let id = req.params.id;
//   let cateDel = categories.findIndex(p => p.id == id);
//   categories.splice(cateDel, 1);
//   res.redirect("/categories");
// });
// router.post('/edit', upload.single('imgCate'), (req, res) => {
//   let id = req.body.idCate;
//   let name = req.body.nameCate;
//   let img = req.file ? req.file.originalname : req.body.imgOld;
//   let index = categories.findIndex(p => p.id == id);
//   categories[index] = { id, name, img };
//   res.redirect("/categories");
// });
module.exports = router;
