window.addEventListener('DOMContentLoaded', ready);



function ready() {
    let singleContacts = document.getElementById('single__contacts');

    function addSingleContacts(contact) {
        console.log(contact.id);
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
    
    const contactsArea = document.getElementsByClassName('contacts')[0];
    contactsArea.addEventListener('click', (e) => {
        let chatSection = document.getElementsByClassName('chat__section')[0];
        let contactId = e.target.id;
        chatSection.innerHTML =`<div class="display__chat">
                    <h4 id="person__name">${e.target.textContent}</h4>
                    <div class="actual__chat">
                        <div class="my__message msgs">
                            <h4> this message is from Rakshit</h4>
                            <p>timestamp</p>
                        </div>
                        <div class="others__message msgs">
                            <h4> this message is from Others</h4>
                            <p>timestamp</p>
                        </div>
                        
                    </div>
                </div>
                <div class="send__message">
                  <form action="chat.html" method="post" id="send__message__form">
                    <input type="text" id="${e.target.id}" class="msgText" placeholder="Write Your Mesaage">
                    <button type="submit" id="message_send_button">➤</button>
                  </form>
                </div>`
    })
   
    function sendMessage(e) {
        e.preventDefault();
        const msgData = {
            message_text: document.getElementsByClassName('msgText')[0].value,
            sent_to: document.getElementsByClassName('msgText')[0].id
        }

        console.log(msgData);
        // axios.post(
        //     "http://localhost:5000/sendMessage",
        //     expenseData,
        //     { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
        //   );
    }

    const submitForm = document.getElementById('send__message__form');
    submitForm.addEventListener('submit', sendMessage);

    






}

function checkData(id) {
    axios.get(`http://localhost:5000/getDetails`, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } })
    
}