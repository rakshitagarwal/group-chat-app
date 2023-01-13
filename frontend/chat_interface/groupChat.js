
const form__newGroup = document.getElementById('form__newGroup');
form__newGroup.addEventListener('submit', async(e) => {
    e.preventDefault();
    console.log('submitting new group');
    const newGroupData = {
        group__name: document.getElementById('newGroup__input').value
    }
    try {
        const response = await axios.post(`http://localhost:5000/newGroup`, newGroupData, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
        //console.log(response);
    } catch (err) {
        console.log(err);
    }
})

window.addEventListener('DOMContentLoaded', ready);



function ready() {
    //fetch All groups
    let groups = document.getElementById('groups');

    function addGroupContacts(contact) {
        //console.log(contact.id);
        let groupsDiv=`<div class="single__group" id="${contact.id}">
        <h5 >${contact.group__name}</h5>
        </div>`
        groups.innerHTML += groupsDiv;
    }

    axios.get(`http://localhost:5000/getGroups`, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then(res => {
            const groupArr = res.data.contacts;
            //console.log(groupArr);
            groupArr.forEach(element => {
                addGroupContacts(element);
            });

        })
        .catch(err => console.log(err));
    
    
        
        groups.addEventListener('click', (e) => {
        let chatSection = document.getElementsByClassName('chat__section')[0];
        let groupId = e.target.id;
        chatSection.innerHTML =`<div class="display__chat">
                    <h4 id="person__name">${e.target.textContent}</h4>
                    <div class="actual__chat">
                    
                        
                    </div>
                </div>
                <div class="send__message">
                  <form action="" method="post" id="send__message__form">
                    <input type="text" id="${groupId}" class="msgText" placeholder="Write Your Mesaage">
                    <button type="submit" id="message_send_button">➤</button>
                  </form>
                </div>`
                
                getAllMessagesOfThisGroup(groupId);
                
        // setInterval(() => {
        //     getAllMessagesOfThisConvo(contactId)
        // }, 1000);
        
                const submitForm = document.getElementById('send__message__form');
                submitForm.addEventListener('submit', (e)=> {
                    e.preventDefault();
                    let groupMsgData = {
                        message_text: document.getElementsByClassName('msgText')[0].value,
                        sent_to_groupNo: document.getElementsByClassName('msgText')[0].id
                    }
            
                    //console.log(msgData);
                    document.getElementsByClassName('msgText')[0].value = '';
                    axios.post(
                        "http://localhost:5000/sendGroupMessage",
                        groupMsgData,
                        { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
                    ).then(response => {
                        //console.log(response.data.messageInfo.message_text);
                        addMesaageToChat(response.data.messageInfo.message_text);
                      })
                });
        })
}

function addMesaageToChat(msg) {
    let actualChat = document.getElementsByClassName('actual__chat')[0];
    let sendersMessage=`<div class="my__message msgs">
                     <h4>${msg}</h4>
                     <p>timestamp</p></div>`
    actualChat.innerHTML += sendersMessage;
}


const getAllMessagesOfThisGroup = async(groupId) => {
    const response = await axios.get(`http://localhost:5000/getGroupMessages/${groupId}`, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
    console.log(response);
    let actualChat = document.getElementsByClassName('actual__chat')[0];
            const messageArr = response.data.messages;
            //console.log(messageArr);
            
            messageArr.forEach(messageData => {
                if (messageData.userId != response.data.reqUserId) {
                    //console.log('in recivers section');
                    let recieversMessage =`<div class="others__message msgs">
                     <h5 class="message_sender_name">${messageData.message_sender_name}:</h5>
                     <h4>${messageData.message_text}</h4>
                     <p>timestamp</p></div>`
                actualChat.innerHTML += recieversMessage;
                }
                else {
                    //console.log('in senders section');
                    let sendersMessage=`<div class="my__message msgs">
                     <h4>${messageData.message_text}</h4>
                     <p>timestamp</p></div>`
                    actualChat.innerHTML += sendersMessage;
                }
            })
    
}
