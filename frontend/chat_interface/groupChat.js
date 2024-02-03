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
    const response = await axios.post(
      `http://localhost:5000/newGroup`,
      newGroupData,
      { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    notifyUser(response.data.message);
  } catch (err) {
    console.log(err);
  }
});

window.addEventListener("DOMContentLoaded", ready);

function ready() {
  let groups = document.getElementById("groups");
  function addYourGroupsToScreen(contact) {
    let groupsDiv = `<div class="single__group" id="${contact.groupId}">
        <h5 >${contact.group_name}</h5></div>`;
    groups.innerHTML += groupsDiv;
  }

  axios
    .get(`http://localhost:5000/getChatGroups`, {
      headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      const yourGroups = res.data.groupInfo;
      yourGroups.forEach((element) => {
        addYourGroupsToScreen(element);
      });
    })
    .catch((err) => console.log(err));

  groups.addEventListener("click", (e) => {
    let chatSection = document.getElementsByClassName("chat__section")[0];
    if (e.target.classList.contains("single__group")) {
      let groupId = e.target.id;
      chatSection.innerHTML = `<div class="display__chat" id="display__chat">
                                    <h4 id="${groupId}" class="group__name">${e.target.textContent}</h4>
                                    <div class="actual__chat">
                                    </div>
                                  </div>

                                  <div class="send_MediaOrMsg">
                                    <button id="showSendMediaForm">✉</button>
                                    <div class="send__media" id="sendMediaSection" >
                                      <form action="" method="post" id="media__form">
                                        <input type="file" id="real_file" class="${groupId}" name="file" >
                                        <input type="submit" value="⇑" id="${groupId}" >
                                      </form>
                                    </div>
                                    <div class="send__message">
                                      <form action="" method="post" id="send__message__form">
                                        <input type="text" id="${groupId}" class="msgText" placeholder="Write Your Mesaage">
                                        <button type="submit" id="message_send_button">➤</button>
                                      </form>
                                     </div>
                                  </div>`;
      getAllMessagesOfThisGroup(groupId);
      const displaychat = document.getElementById("display__chat");
      displaychat.addEventListener("click", showGroupInfo);
    }

    const showSendMediaFormBtn = document.getElementById("showSendMediaForm");
    showSendMediaFormBtn.addEventListener("click", (e) => {
      const showSendMediaForm = document.getElementById("sendMediaSection");
      console.log("media button clicked");
      showSendMediaForm.classList.toggle("mediaFormActive");
    });

    const fileInput = document.getElementById("real_file");
    var filesToUpload;
    fileInput.addEventListener("change", (e) => {
      filesToUpload = e.target.files[0];
    });

    const sendMediaForm = document.getElementById("media__form");
    sendMediaForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const groupId = document.getElementById("real_file").className;
      if (!filesToUpload) {
        console.log("No file selected !!");
        return;
      } else {
        try {
          let formData = new FormData();
          formData.append("file", filesToUpload);
            
          for (let key of formData.keys()) {
            console.log('data inside form data', formData.get(key));
          }   
          const response = await axios.post(`http://localhost:5000/postMedia/${groupId}`, formData, { headers: { authorization: `Bearer ${localStorage.getItem("token")}`}});
          console.log("response", response);
        } catch (err) {
          console.log('from error', err);
        }
      }
    });

    const submitForm = document.getElementById("send__message__form");
    submitForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let groupMsgData = {
        message_text: document.getElementsByClassName("msgText")[0].value,
        sent_to_groupNo: document.getElementsByClassName("msgText")[0].id,
      };

      const groupId = document.getElementsByClassName("msgText")[0].id;

      document.getElementsByClassName("msgText")[0].value = "";
      axios
        .post("http://localhost:5000/sendGroupMessage", groupMsgData, {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          const msgStoredInLocalStorage = JSON.parse(
            localStorage.getItem(`${groupId}`) || "[]"
          );
          msgStoredInLocalStorage.push(response.data.messageInfo);
          localStorage.setItem(
            `${response.data.messageInfo.sent_to_groupId}`,
            JSON.stringify(msgStoredInLocalStorage)
          );
          addMesaageToChat(response.data.messageInfo.message_text);
        })
        .catch((err) => console.log(err));
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
  const msgStoredInLocalStorage = JSON.parse(
    localStorage.getItem(`${groupId}`) || "[]"
  );
  const yourUserId = localStorage.getItem("userId");

  console.log(yourUserId);
  if (msgStoredInLocalStorage.length > 0) {
    msgStoredInLocalStorage.forEach((messageData) => {
      showGroupMsgOnScreen(messageData, yourUserId);
    });
  }

  newMessagesFromNetworkCall(groupId);
};

async function newMessagesFromNetworkCall(groupId) {
  const msgStoredInLocalStorage = JSON.parse(
    localStorage.getItem(`${groupId}`) || "[]"
  );
  const lastMsgId =
    msgStoredInLocalStorage.length === 0
      ? 0
      : msgStoredInLocalStorage[msgStoredInLocalStorage.length - 1].id;

  const response = await axios.get(
    `http://localhost:5000/getGroupMessages/${groupId}?lastMsgId=${lastMsgId}`,
    { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  localStorage.setItem("userId", response.data.reqUserId);

  const newMessageArr = response.data.messages;
  const nowAllMsgsArr = [...msgStoredInLocalStorage, ...newMessageArr];
  localStorage.setItem(`${groupId}`, JSON.stringify(nowAllMsgsArr));

  console.log(newMessageArr);

  if (newMessageArr.length > 0) {
    newMessageArr.forEach((messageData) => {
      showGroupMsgOnScreen(messageData, response.data.reqUserId);
    });
  }
}

function showGroupMsgOnScreen(messageData, yourUserId) {
  let actualChat = document.getElementsByClassName("actual__chat")[0];

  if (messageData.userId != yourUserId) {
    let recieversMessage = `<div class="others__message msgs">
                   <h5 class="message_sender_name">${messageData.message_sender_name}:</h5>
                   <h4>${messageData.message_text}</h4>
                   <p>timestamp</p></div>`;
    actualChat.innerHTML += recieversMessage;
  } else {
    let sendersMessage = `<div class="my__message msgs">
                   <h4>${messageData.message_text}</h4>
                   <p>timestamp</p></div>`;
    actualChat.innerHTML += sendersMessage;
  }
}

function showGroupInfo(e) {
  if (e.target.id === "person__name") {
    console.log("No Group Selected");
    return;
  } else if (e.target.classList.contains("group__name")) {
    const groupId = e.target.id;
    document.getElementsByClassName("actual__chat")[0].style.display = "none";
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
    </div>`;
    displayChatArea.innerHTML += detailsArea;

    axios
      .get(`http://localhost:5000/getGroupMembers/${groupId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const members = res.data.groupMembers;
        members.forEach((member) => {
          let groupMembers = document.getElementsByClassName("groupMembers")[0];
          let groupMember = `<div class="groupMember">
            <h5>User Id: ${member.userId}</h5>
            <button class="adminBtn ${member.isAdmin}" id="${member.userId}"> ${
            member.isAdmin ? "Admin" : "Make Admin"
          } </buuton>
            <button class="removeUser" id="${
              member.userId
            }"> Remove User </buuton>
            </div>`;
          groupMembers.innerHTML += groupMember;
        });
      })
      .catch((err) => console.log(err));

    const groupDetail__section = document.getElementById(
      "groupDetail__section"
    );
    groupDetail__section.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("adminBtn") &&
        e.target.classList.contains("false")
      ) {
        axios
          .post(
            "http://localhost:5000/makeAdmin",
            { targetId: e.target.id, groupId: groupId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }

      if (
        e.target.classList.contains("adminBtn") &&
        e.target.classList.contains("true")
      ) {
        axios
          .post(
            "http://localhost:5000/removeAdmin",
            { targetId: e.target.id, groupId: groupId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }

      if (e.target.classList.contains("removeUser")) {
        console.log("remove user clicked", e.target.id);
        axios
          .post(
            "http://localhost:5000/removeMember",
            { targetId: e.target.id, groupId: groupId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => console.log(res.data.message))
          .catch((err) => console.log(err));
      }

      if (e.target.classList.contains("leave__group")) {
        axios
          .post(
            "http://localhost:5000/leaveGroup",
            { groupId: groupId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => console.log(res.data.message))
          .catch((err) => console.log(err));
      }
    });

    const add_new_memberForm = document.getElementById("add_new_memberForm");
    add_new_memberForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const mobileNo =
        document.getElementsByClassName("add_member_mobile")[0].value;
      const groupId =
        document.getElementsByClassName("add_member_mobile")[0].id;
      document.getElementsByClassName("add_member_mobile")[0].value = "";
      axios
        .post(
          "http://localhost:5000/addNewMember",
          { mobileNo: mobileNo, groupId: groupId },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    });
  }
}
