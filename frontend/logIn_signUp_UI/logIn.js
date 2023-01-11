const form = document.getElementById("input__form");

function notifyUser(message) {
  const container = document.getElementById("container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerHTML = `<h4>${message}</h4>`;
  container.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 1500);
}

window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("input__form");

    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        console.log('submit clicked');
        const phone=document.getElementById('mobile')
        const password=document.getElementById('password')
        const obj={ 
            phone:phone.value,
            password:password.value
        }
    
        phone.value=''
        password.value=''
        axios.post('http://localhost:5000/user/login',obj)
          .then(res => {
            notifyUser(res.data.message);
            localStorage.setItem('token', `${res.data.token}`);
              if (res.data.success) {
                  window.location.href = '../chat_interface/chat.html';
              }
            }).catch(err => {
                notifyUser(err.response.data.message);
        })
    })
    
})
