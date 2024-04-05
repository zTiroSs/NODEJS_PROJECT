var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 
var apiRouter=require('./routes/api');
// Tạo router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
var userManagerRouter = require('./routes/user-manager');
var adminRouter = require('./routes/admin');
var shopRouter = require('./routes/shop');
var app = express();
app.use(session({
  secret: 'your-secret-key', // Chuỗi bí mật để ký và mã hóa session ID cookie
  resave: false, // Không lưu lại phiên làm việc nếu không có sự thay đổi nào
  saveUninitialized: true, // Lưu lại phiên làm việc ngay cả khi chưa được sử dụng
}));
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

// view engine setup
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Log use router
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('stylesheets'));
app.use('/api',apiRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/user-manager', userManagerRouter);
app.use('/admin', adminRouter);
app.use('/shop', shopRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

