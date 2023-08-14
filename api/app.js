var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var carrerasRouter = require('./routes/carreras');
var materiasRouter = require('./routes/materias');
var profesoresRouter = require('./routes/profesores');
var horariosRouter = require('./routes/horarios');
var jwt = require("jsonwebtoken");

var app = express();

// jwt

//clave secreta traida de variable de entorno local

const claveSecreta = process.env.clave_secreta;

app.post("/registro", (req , res) => {
  const usuario = {
    id: 1,
    nombre: "admin"
  }

  jwt.sign({user: usuario},claveSecreta,{expiresIn:'180s'},(err,token)=>{
    res.json({
      token
    })
  });
})


// Autorización
function verificar(req,res,next){
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
    /* si es distinto a undefined guardo solamente el token sin el Bearer <token>*/
    const tokenVerificado = bearerHeader.split(" ")[1];
    req.token = tokenVerificado;
    next();
  }else{
    res.sendStatus(403);
  }
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/mat',materiasRouter);
app.use('/car',carrerasRouter);
app.use('/pro',profesoresRouter);
app.use('/hor',horariosRouter);

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
