const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const users = require('./api/routes/users');
const mongoose = require('mongoose');
const contact = require('./api/routes/contact');
const incident = require('./api/routes/incident');
const cors = require('cors');
var whitelist = ['http://localhost4200/*', '*']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors({origin: '*'}));
const dotenv = require('dotenv');
dotenv.config();
try{
mongoose.connect("mongodb+srv://talha:"+process.env.MONGO_ATLAS_PASS+"@cluster0-g7n2k.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true });
}catch(e){console.log(e)}
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin',"*");
//     res.header('Access-Control-Allow-Headers',"Origin,X-Requested-With,Content-Type,Accept,Authorization");
    // if(req.method==='OPTIONS'){
        // res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        // return res.status(200).json({});
    // }
// })



app.use('/incident',incident)
app.use('/users',users);
app.use('/contact',contact);




// let error;
app.use((req,res,next)=>{
    // error = new Error("Not Found");
    // error['message']("Not Found");
    // const error = new Error('Not Found');
    // error.status(404);
    next();
})

app.use((error,req,res,next)=>{
   return res.status(error.status || 500)
    .json({
        error: {
            message: error.message
        }
    });
})


module.exports = app;