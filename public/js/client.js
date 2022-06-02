const socket = io();

let chats = document.querySelector('.textaria')
let user_send = document.querySelector("#user-send")
let user_msg = document.querySelector("#user-msg")
// console.log("chats");
// alert("hsgvbbhk")
let username

do {
    username = prompt("Enter Your name");
} while (!username);


// new user join
socket.emit("new-user-join", username);

socket.on('user-connected', (socket_name) => {
    userJoinLeft(socket_name, 'joined');
})


function userJoinLeft(name, status) {
    let div = document.createElement('div');
    div.classList.add('join-chat');
    let content = `<p><strong>${name}</strong> ${status} the Chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div)
    chats.scrollTop = chats.scrollHeight;
}

socket.on('user-disconnected', (user) => {
    userJoinLeft(user, 'Left');
})

socket.on('user-list', (users) => {
})


user_send.addEventListener('click', () => {
    let data = {
        user: username,
        msg: user_msg.value
    }
    if (user_msg.value != '') {
        appendMassage(data, 'outgoing');
        socket.emit('message', data);
        user_msg.value = '';
    }

});

function appendMassage(data, status) {
    let div = document.createElement('div');
    let addcal = ('outgoing' == status) ? 'd-flex  justify-content-end' : '';
    let addclass = ('outgoing' == status) ? 'send-msg' : 'resive-msg';

    let content = `
        <div class="${addcal}">
            <div class="${addclass}">
                <div class="message ${status}">
                    <h6>${data.user}</h6>
                    <p>${data.msg}</p>
                </div>
            </div>
        </div>
        `
    div.innerHTML = content;
    chats.appendChild(div)
    chats.scrollTop = chats.scrollHeight;
}


socket.on('message', (data) => {
    appendMassage(data, 'incomming')
})