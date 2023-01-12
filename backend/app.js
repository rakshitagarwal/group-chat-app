const dotenv=require('dotenv')
dotenv.config()

const express=require('express')
const bodyParser=require('body-parser')

const sequelize=require('./util/database')

const cors=require('cors')

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const conversationRoutes = require('./routes/conversation');
const groupConversationRoutes = require('./routes/groupConversation');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(cors());

const User = require('./models/user');
const Message = require('./models/message')
const Group = require('./models/group')
const GroupMessage = require('./models/groupMessage')


//relation between tables
User.hasMany(Message);
Message.belongsTo(User);
User.hasMany(Group);
Group.hasMany(GroupMessage);


app.use('/user', authRoutes);
app.use(contactRoutes);
app.use(conversationRoutes);
app.use(groupConversationRoutes);


sequelize.sync(
)
.then(()=>{
    app.listen(5000)
})
.catch(err=>{
    console.log(err)
})


