const express = require('express');
const app = express();
const path = require('path')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
dotenv.config();
const bodyParser = require('body-parser');


const PORT = 8080;
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join (__dirname , 'assets')))

// Database
const db = require('./lib/db')


const IndexController = require('./Controllers/IndexController')
app.use('/' , IndexController)

const LoginController = require('./Controllers/LoginController')
app.use('/' , LoginController)


const RegisterController = require('./Controllers/RegisterController')
app.use('/' , RegisterController)

const CheckListsController = require('./Controllers/CheckListsController')
app.use('/' , CheckListsController)

const ResetPassController = require('./Controllers/ResetPass')
app.use('/' , ResetPassController)

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});








app.listen(PORT , (req,res)=>{
    console.log(`http://localhost:`+PORT)
})

module.exports = app; 
