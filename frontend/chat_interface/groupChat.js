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
  //console.log('submitting new group');
  const newGroupData = {
    group_name: document.getElementById("newGroup__input").value,
  };
  try {
    const response = await axios.post(
      `http://localhost:5000/newGroup`,
      newGroupData,
      { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    console.log(response);
    notifyUser(response.data.message);
  } catch (err) {
    console.log(err);
  }
});

window.addEventListener("DOMContentLoaded", ready);

function ready() {
   //fetch All groups
   let groups = document.getElementById("groups");

   function addGroupContacts(contact) {
    //console.log(contact.id);
    let groupsDiv = `<div class="single__group yourGroups" id="${contact.id}">
        <h5 >${contact.group_name}</h5>
        </div>`;
    groups.innerHTML += groupsDiv;
    }
    
    function addOthersGroup(contact) {
        //console.log(contact.id);
        let groupsDiv = `<div class="single__group othersGroups" id="${contact.id}">
            <h5 >${contact.group_name}</h5>
            <button id="${contact.id}" class='joingroup__Btn'>Join Group</button>
            </div>`;
        groups.innerHTML += groupsDiv;
      }

  axios
    .get(`http://localhost:5000/getGroups`, {
      headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
        const groupArr = res.data.yourGroups;
        const othersGroups = res.data.othersGroups;
      //console.log(res);
      groupArr.forEach((element) => {
        console.log(element);
        addGroupContacts(element);
      });
        othersGroups.forEach((group) => {
            console.log(group.id);
            addOthersGroup(group);
        })
    })
        .catch((err) => console.log(err));
    
    
    

  groups.addEventListener("click", (e) => {
    let chatSection = document.getElementsByClassName("chat__section")[0];
    if (e.target.classList.contains('yourGroups')) {
        let groupId = e.target.id;
        chatSection.innerHTML = `<div class="display__chat">
                        <h4 id="person__name">${e.target.textContent}</h4>
                        <div class="actual__chat"></div></div>
                    <div class="send__message">
                      <form action="" method="post" id="send__message__form">
                        <input type="text" id="${groupId}" class="msgText" placeholder="Write Your Mesaage">
                        <button type="submit" id="message_send_button">➤</button>
                      </form>
                    </div>`;
        getAllMessagesOfThisGroup(groupId);
    }
    else if (e.target.classList.contains('othersGroups')) {
        notifyUser('You are not part of this till Now. You can join this group by clicking on "join button"..');
      }
    else if (e.target.textContent == 'Join Group') {
        console.log('groupID:', e.target.id);
        axios.post(`http://localhost:5000/joinGroup`, { joinGroupId: `${e.target.id}` }, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } })
            .then(res  =>console.log(res))
            .catch(err =>console.log(err))
    }
    

    // setInterval(() => {
    //     getAllMessagesOfThisConvo(contactId)
    // }, 1000);

    const submitForm = document.getElementById("send__message__form");
    submitForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let groupMsgData = {
        message_text: document.getElementsByClassName("msgText")[0].value,
        sent_to_groupNo: document.getElementsByClassName("msgText")[0].id,
      };

      //console.log(msgData);
      document.getElementsByClassName("msgText")[0].value = "";
      axios
        .post("http://localhost:5000/sendGroupMessage", groupMsgData, {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          //console.log(response.data.messageInfo.message_text);
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
