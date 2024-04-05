const express = require('express');
const router = express.Router();
const session = require('express-session');
const connectDb = require('../models/db');
const { log } = require('debug/src/browser');

/* GET Hiện trang user (test) */
router.get('/', function(req, res, next) {
  res.send('Đây là trang USER!');
});
// Hiện trang đăng kí 
router.get('/sign-in', async (req, res, next) => {
  const db = await connectDb();
  res.render('sign-in',{error: null})
});
// POST - thêm tài khoản (ĐĂNG KÍ)
router.post('/sign-in', async (req,res,next)=>{
  const db = await connectDb();
  const userCollection = db.collection('users');
  let {name, username, email, password, passwordR} = req.body;
  let lastUser = await userCollection.find().sort({id:-1}).limit(1).toArray();
  let id = lastUser[0] ? lastUser[0].id + 1 :1;
  // SET 2 cái thuộc tính này = 1 cho là mặc định của user
  let trangthai = "1";
  let vaitro = "1";
  let newUser = {id,name,username,email,password,trangthai,vaitro};
  await userCollection.insertOne(newUser);
  const user = newUser;
  // Lưu dữ liệu vào session nếu đăng kí thành công
  req.session.user = user; 
  // Về trang chủ Tức là trang index ở mục view -> index.ejs
  res.redirect("/");
})


// Hiện trang đăng nhập
router.get('/log-in', async(req, res, next) => {
  const db = await connectDb();
  const userCollection = db.collection('users');
  const users = await userCollection.find().toArray();
  res.render('log-in', { users, error: null });
});
// Thực hiện chức năng đăng nhập
router.post('/log-in', async(req, res, next) => {
  const db = await connectDb();
  const { username, password } = req.body;
  const userCollection = db.collection('users');
  // Phần này là kiểm tra xem thông tin từ form có khớp với thông tin trong DB không
  const user = await userCollection.findOne({ username: username, password: password });
  if (!user) {
    // Điều kiện không (báo lỗi)
    res.render('log-in', { error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
  } else {
    // Nếu có thì thông tin được lưu vào session ở dạng cookie
    req.session.user = user; 
    // console.log(user);
    res.redirect('/'); 
  }
});


// Đăng xuất
router.get('/log-out', (req, res) => {
  // Hủy bỏ phiên làm việc hiện tại bằng cách xóa thông tin người dùng khỏi session
  req.session.destroy(err => {
    if (err) {
      console.error('Lỗi khi đăng xuất:', err);
    } else {
      // Chuyển hướng người dùng đến trang đăng nhập hoặc trang chính sau khi đăng xuất thành công
      res.redirect('/');
    }
  });
});
module.exports = router;
