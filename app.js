const express = require('express');
const app = express();
const path = require('path')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const fs = require('fs');
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





// Page 404 
app.use((req, res, next) => {
    res.status(404);
    fs.readFile(path.join(__dirname,  './404.html'), 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading 404 page:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send(data);
    });
  });



app.listen(PORT , (req,res)=>{
    console.log(`http://localhost:`+PORT)
})

module.exports = app; 
