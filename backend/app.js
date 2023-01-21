const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const fileUpload = require('express-fileupload');

const sequelize = require("./util/database");

const cors = require("cors");

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contacts");
const conversationRoutes = require("./routes/conversation");
const groupConversationRoutes = require('./routes/groupConversation');

const app = express();
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(fileUpload());



app.use(cors());

const User = require("./models/user");
const Message = require("./models/message");
const ChatGroup = require("./models/chatgroup");
const GroupMember = require("./models/groupMembers");

//relation between tables
User.hasMany(Message);
Message.belongsTo(User);

ChatGroup.hasMany(Message);
Message.belongsTo(ChatGroup);

User.belongsToMany(ChatGroup, { through: GroupMember });
ChatGroup.belongsToMany(User, { through: GroupMember });

app.use("/user", authRoutes);
app.use(contactRoutes);
app.use(conversationRoutes);
app.use(groupConversationRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
