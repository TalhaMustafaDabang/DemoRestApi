const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const users = require('./api/routes/users');
const mongoose = require('mongoose');
const contact = require('./api/routes/contact');

mongoose.connect("mongodb+srv://talha:"+process.env.MONGO_ATLAS_PASS+"@cluster0-g7n2k.mongodb.net/test?retryWrites=true&w=majority",{useMongoClient:true});
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin',"*");
    res.header('Access-Control-Allow-Headers',"Origin,X-Requested-With,Content-Type,Accept,Authorization");
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
})




app.use('/users',users);
app.use('/contact',contact);





app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status(404);
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.stauts || 500)
    .json({
        error: {
            message: error.message
        }
    });
})


module.exports = app;