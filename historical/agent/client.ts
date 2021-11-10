import * as io from "socket.io-client";

const socket = io.connect('http://localhost:3000')

function registerHandler() {
    socket.on("message", (data:any)=>{
        console.info(data);
    })
}

function unregisterHandler() {
    socket.off("message");
}

socket.on("error", (err: any) => {
    console.log('received socket error:');
    console.log(err);
})


registerHandler();

socket.emit("get-config", (config:any, err:Error)=>{

    console.info(config);
});


// socket.on('error', (err: any) => {
//     console.log('received socket error:')
//     console.log(err)
// })

// function register(name:string, cb:any) {
//     socket.emit('register', name, cb)
// }

// function join(chatroomName:string, cb:any) {
//     socket.emit('join', chatroomName, cb)
// }

// function leave(chatroomName:string, cb:any) {
//     socket.emit('leave', chatroomName, cb)
// }

// function message(chatroomName:string, msg:string, cb:any) {
//     socket.emit('message', { chatroomName, message: msg }, cb)
// }

// function getChatrooms(cb:any) {
//     socket.emit('chatrooms', null, cb)
// }

// function getAvailableUsers(cb:any) {
//     socket.emit('availableUsers', null, cb)
// }