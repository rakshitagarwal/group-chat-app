
window.addEventListener('DOMContentLoaded', ready);



function ready() {
    let singleContacts = document.getElementById('single__contacts');

    function addSingleContacts(contact) {
        //console.log(contact.id);
        let single__contactsDiv=`<div class="single__contact" id="${contact.id}">
        <h5 >${contact.name}</h5>
        </div>`
        singleContacts.innerHTML += single__contactsDiv;
    }

    axios.get(`http://localhost:5000/getContacts`, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then(res => {
            const contactArr = res.data.contacts;
            contactArr.forEach(element => {
                addSingleContacts(element);
            });

        })
        .catch(err => console.log(err));
    
    const single__contacts = document.getElementsByClassName('single__contacts')[0];
    single__contacts.addEventListener('click', (e) => {
        let chatSection = document.getElementsByClassName('chat__section')[0];
        let contactId = e.target.id;
        chatSection.innerHTML =`<div class="display__chat">
                    <h4 id="person__name">${e.target.textContent}</h4>
                    <div class="actual__chat">
                    
                        
                    </div>
                </div>
                <div class="send__message">
                  <form action="" method="post" id="send__message__form">
                    <input type="text" id="${e.target.id}" class="msgText" placeholder="Write Your Mesaage">
                    <button type="submit" id="message_send_button">➤</button>
                  </form>
                </div>`
                
                getAllMessagesOfThisConvo(contactId);
                
        // setInterval(() => {
        //     getAllMessagesOfThisConvo(contactId)
        // }, 1000);
        
                const submitForm = document.getElementById('send__message__form');
                submitForm.addEventListener('submit', (e)=> {
                    e.preventDefault();
                    let msgData = {
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


function getAllMessagesOfThisConvo(contactId) {
    axios.get(`http://localhost:5000/getMessages/${contactId}`, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then((response) => {
            let actualChat = document.getElementsByClassName('actual__chat')[0];
            const messageArr = response.data.messages;
            //console.log(messageArr);
            
            messageArr.forEach(messageData => {
                if (messageData.userId == contactId) {
                    //console.log('in recivers section');
                     let recieversMessage=`<div class="others__message msgs">
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

        })
        .catch(err => console.log(err));
        
    
}

function addMesaageToChat(msg) {
    let actualChat = document.getElementsByClassName('actual__chat')[0];
    let sendersMessage=`<div class="my__message msgs">
                     <h4>${msg}</h4>
                     <p>timestamp</p></div>`
    actualChat.innerHTML += sendersMessage;
}