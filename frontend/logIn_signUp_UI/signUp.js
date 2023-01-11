function notifyUser(message){
    const container = document.getElementById('container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}</h4>`;
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
        },2500)
}

document.addEventListener('DOMContentLoaded',()=>{
    const form=document.getElementById('input__form')
    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        console.log('submit called')
        const name=document.getElementById('username')
        const password=document.getElementById('password')
        const phone=document.getElementById('mobile')
        const obj={ 
            name:name.value,
            phone:phone.value,
            password:password.value,
            
        }
        name.value=''
        password.value=''
        phone.value=''
        axios.post('http://localhost:5000/user/signup',obj)
            .then(res => {
                console.log(res.data.message);
            notifyUser(res.data.message)
        })
        .catch(err=>{
            console.log(err)
        })
    })


})