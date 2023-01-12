
const form__newGroup = document.getElementById('form__newGroup');
form__newGroup.addEventListener('submit', async(e) => {
    e.preventDefault();
    console.log('submitting new group');
    const newGroupData = {
        group__name: document.getElementById('newGroup__input').value
    }
    try {
        const response = await axios.post(`http://localhost:5000/newGroup`, newGroupData, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
        console.log(response);
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
            console.log(groupArr);
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
                
                //getAllMessagesOfThisConvo(group);
                
        // setInterval(() => {
        //     getAllMessagesOfThisConvo(contactId)
        // }, 1000);
        
                const submitForm = document.getElementById('send__message__form');
                submitForm.addEventListener('submit', (e)=> {
                    e.preventDefault();
                    let groupMsgData = {
                        message_text: document.getElementsByClassName('msgText')[0].value,
                        sent_to: document.getElementsByClassName('msgText')[0].id
                    }
            
                    //console.log(msgData);
                    document.getElementsByClassName('msgText')[0].value = '';
                    axios.post(
                        "http://localhost:5000/sendMessage",
                        msgData,
                        { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
                    ).then(response => {
                        console.log(response.data.messageInfo.message_text);
                        addMesaageToChat(response.data.messageInfo.message_text);
                      })
                });
        })
    
    





}