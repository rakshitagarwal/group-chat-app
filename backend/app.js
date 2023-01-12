const dotenv=require('dotenv')
dotenv.config()

const express=require('express')
const bodyParser=require('body-parser')

const sequelize=require('./util/database')

const cors=require('cors')

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(cors());

app.use('/user', authRoutes);
app.use(contactRoutes);


sequelize.sync()
.then(()=>{
    app.listen(5000)
})
.catch(err=>{
    console.log(err)
})


