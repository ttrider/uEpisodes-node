
import * as sio from "socket.io";
import * as clientio from "socket.io-client";

var io = sio(8080);

setTimeout(() => {

    

    io.on('connection', (socket) => {

        console.info("connection");

        socket.on('message', (d) => {
            console.info(d);
        });
        socket.on('disconnect', () => {
            console.info("disconnect");
        });
    });

    
    

}, 500);

setInterval(()=>{

    io.emit("news", "foooo");

}, 1000);

setTimeout(() => {

    const socket = clientio.connect('http://localhost:8080');
    

    socket.on('news', (data: any) => {
        console.log(data);
        socket.emit('message', { my: 'data' });
    });

    socket.connect();

}, 1000);

