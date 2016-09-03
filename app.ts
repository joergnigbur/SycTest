
var Syc = require('syc');
import * as moment from 'moment';

moment.locale("de");
var start = moment();

var serverState = {message:"", time:""};

var io = require('socket.io').listen(3000);

var clientSockets = [], clientIds = [];

function registerClient(socket){
    clientSockets.push(socket);
    clientIds.push(socket.id);
}

function unRegisterClient(socket){
    clientSockets.splice(clientSockets.indexOf(socket), 1);
    clientIds.splice(clientIds.indexOf(socket.id), 1);
}


function setServerMessage(msg){

    serverState.message = msg;
    serverState.time = moment().format("HH:mm:ss");

}
setServerMessage("");


Syc.sync("clients", clientIds);
Syc.sync("server-state", serverState);


io.sockets.on('connection', function (socket) {
    if(clientSockets.indexOf(socket) == -1){
        registerClient(socket);
        setServerMessage(socket.id + " verbunden");
        Syc.connect(socket);
    }
    socket.on("disconnect", function(){

        unRegisterClient(socket);
        setServerMessage(socket.id+" getrennt");
    })

});

setInterval(function () {

    var secsGone = moment().subtract(start.minutes(),"minutes").subtract(start.seconds(), "seconds").format("mm:ss");

    setServerMessage("Online seit "+secsGone+" Minuten");


}, 1000)






