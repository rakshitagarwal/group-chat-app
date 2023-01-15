function notifyUser(message) {
  const container = document.getElementById("container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerHTML = `<h4>${message}</h4>`;
  container.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2500);
}
const form__newGroup = document.getElementById("form__newGroup");
form__newGroup.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newGroupData = {
    group_name: document.getElementById("newGroup__input").value,
  };
  try {
    const response = await axios.post(`http://localhost:5000/newGroup`,newGroupData,
    { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    notifyUser(response.data.message);
  } catch (err) {
    console.log(err);
  }
});

window.addEventListener("DOMContentLoaded", ready);

function ready() {
   //----------fetch All groups
   let groups = document.getElementById("groups");
   function addYourGroupsToScreen(contact) {
    let groupsDiv = `<div class="single__group" id="${contact.groupId}">
        <h5 >${contact.group_name}</h5></div>`;
      groups.innerHTML += groupsDiv;}

  axios.get(`http://localhost:5000/getChatGroups`, {headers: { authorization: `Bearer ${localStorage.getItem("token")}` },})
    .then((res) => {
        const yourGroups = res.data.groupInfo;
        yourGroups.forEach((element) => {
        addYourGroupsToScreen(element);
      });
    }).catch((err) => console.log(err));
    
  //--------Group data and chat feature ------------//
    groups.addEventListener("click", (e) => {
    let chatSection = document.getElementsByClassName("chat__section")[0];
    if (e.target.classList.contains('single__group')) {
        let groupId = e.target.id;
        chatSection.innerHTML = `<div class="display__chat" id="display__chat">
                                    <h4 id="${groupId}" class="group__name">${e.target.textContent}</h4>
                                    <div class="actual__chat">
                                    </div>
                                  </div>
                                  <div class="send__message">
                                    <form action="" method="post" id="send__message__form">
                                    <input type="text" id="${groupId}" class="msgText" placeholder="Write Your Mesaage">
                                    <button type="submit" id="message_send_button">➤</button>
                                    </form>
                                  </div>`;
      //getAllMessagesOfThisGroup(groupId);

      const displaychat = document.getElementById('display__chat');
      displaychat.addEventListener('click', showGroupInfo);
    }
    else if (e.target.classList.contains('othersGroups')) {
        notifyUser('You are not part of this till Now. You can join this group by clicking on "join button"..');
      }
    
  
    const submitForm = document.getElementById("send__message__form");
    submitForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let groupMsgData = {
        message_text: document.getElementsByClassName("msgText")[0].value,
        sent_to_groupNo: document.getElementsByClassName("msgText")[0].id,
      };

      document.getElementsByClassName("msgText")[0].value = "";
      axios
        .post("http://localhost:5000/sendGroupMessage", groupMsgData, {headers: { authorization: `Bearer ${localStorage.getItem("token")}`},})
        .then((response) => {
          addMesaageToChat(response.data.messageInfo.message_text);
        });
    });
  });
}

function addMesaageToChat(msg) {
  let actualChat = document.getElementsByClassName("actual__chat")[0];
  let sendersMessage = `<div class="my__message msgs">
                     <h4>${msg}</h4>
                     <p>timestamp</p></div>`;
  actualChat.innerHTML += sendersMessage;
}

const getAllMessagesOfThisGroup = async (groupId) => {
  const response = await axios.get(
    `http://localhost:5000/getGroupMessages/${groupId}`,
    { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  console.log(response);
  let actualChat = document.getElementsByClassName("actual__chat")[0];
  const messageArr = response.data.messages;
  //console.log(messageArr);

  messageArr.forEach((messageData) => {
    if (messageData.userId != response.data.reqUserId) {
      //console.log('in recivers section');
      let recieversMessage = `<div class="others__message msgs">
                     <h5 class="message_sender_name">${messageData.message_sender_name}:</h5>
                     <h4>${messageData.message_text}</h4>
                     <p>timestamp</p></div>`;
      actualChat.innerHTML += recieversMessage;
    } else {
      //console.log('in senders section');
      let sendersMessage = `<div class="my__message msgs">
                     <h4>${messageData.message_text}</h4>
                     <p>timestamp</p></div>`;
      actualChat.innerHTML += sendersMessage;
    }
  });
};


//----group info-----and Add Members to group(Admin Access)----
function showGroupInfo(e) {
  if (e.target.id === "person__name") {
    console.log('No Group Selected');
    return
  }
  else if (e.target.classList.contains("group__name")) {
    const groupId = e.target.id;
    document.getElementsByClassName('actual__chat')[0].style.display = 'none';
    let displayChatArea = e.target.parentElement;
    let detailsArea = `
    <div id='groupDetail__section'>
      <div class="groupMembers">
       <h4> Members of the group</h4>
      </div>
     <div class="add_new_member">
       <form action='#' method="post" id="add_new_memberForm" >
        <input type="text" id="${groupId}" class="add_member_mobile" placeholder="Enter Valid Mobile Number">
        <input type="submit" value="Add Member" >
       </form>
       <button class="leave__group" id="${groupId}"> Leave Group </button>
     </div>
    </div>`
    displayChatArea.innerHTML += detailsArea;
    
    
    axios.get(`http://localhost:5000/getGroupMembers/${groupId}`, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(res => {
        const members = res.data.groupMembers;
        members.forEach((member) => {
          let groupMembers = document.getElementsByClassName('groupMembers')[0];
          let groupMember= `<div class="groupMember">
            <h5>User Id: ${member.userId}</h5>
            <button class="adminBtn ${member.isAdmin}" id="${member.userId}"> ${member.isAdmin ? "Admin" : "Make Admin"} </buuton>
            <button class="removeUser" id="${member.userId}"> Remove User </buuton>
            </div>`
          groupMembers.innerHTML +=groupMember;
        })
      }).catch(err => console.log(err))
    
    const groupDetail__section = document.getElementById("groupDetail__section");
    groupDetail__section.addEventListener('click', (e) => {
      if (e.target.classList.contains('adminBtn') && e.target.classList.contains('false')) {
        axios.post('http://localhost:5000/makeAdmin', { targetId: e.target.id ,groupId:groupId}, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } })
          .then(res => console.log(res))
          .catch(err=>console.log(err))
        
      }

      if (e.target.classList.contains('adminBtn') && e.target.classList.contains('true')) {
        axios.post('http://localhost:5000/removeAdmin', { targetId:e.target.id ,groupId:groupId}, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } })
          .then(res => console.log(res))
          .catch(err=>console.log(err))
      }

      if (e.target.classList.contains('removeUser')) {
        console.log('remove user clicked', e.target.id);
        axios.post('http://localhost:5000/removeMember', { targetId: e.target.id ,groupId:groupId}, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } })
          .then(res => console.log(res.data.message))
          .catch(err=>console.log(err))
      }

      if (e.target.classList.contains('leave__group')) {
        axios.post('http://localhost:5000/leaveGroup', {groupId:groupId}, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } })
          .then(res => console.log(res.data.message))
          .catch(err=>console.log(err))
      }

     // console.log('admin btn clicked', e.target.classList, e.target.id);
    })
    
    
    const add_new_memberForm = document.getElementById('add_new_memberForm');
    add_new_memberForm.addEventListener('submit',(e)=> {
      e.preventDefault();
      const mobileNo = document.getElementsByClassName('add_member_mobile')[0].value;
      const groupId = document.getElementsByClassName('add_member_mobile')[0].id;
      document.getElementsByClassName('add_member_mobile')[0].value=''
      axios.post("http://localhost:5000/addNewMember", { mobileNo: mobileNo, groupId:groupId }, {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then(res => console.log(res)).catch(err => console.log(err));
      
    })
  }
}
