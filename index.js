const express = require('express');
const app = express();
exports.app = app;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");
const Database = require("@replit/database")
const db = new Database();
const bodyParser = require('body-parser');
// const process = require('process');
// //Автоматичне перезавантаження серверу методом вбивання проуесів
// process.once('SIGUSR2', function () {
//   process.kill(process.pid, 'SIGUSR2');
// });
// process.on('SIGINT', function () {
//   // this is only called on ctrl+c, not restart
//   process.kill(process.pid, 'SIGINT');
// });

// var reload = require('auto-reload');
// reload('/index.js', 3000); // reload every 3 secs
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.post('/login', function(req, res) {
  db.get(req.body.username).then((lo) => {
    if (lo && lo === req.body.password) {
      res.redirect("/games?user="+req.body.username);
    } else {
      res.sendFile(__dirname + "/public/login/error/");
    }
  });
});
app.post('/logup', function(req, res) {
  db.set(req.body.email, req.body.password).then(() => {
    res.redirect("/");
  });
});
app.get("/game/:room", function(req, res) {
  console.log(req.params.room);
  res.redirect("/game?room="+req.params.room);
});
app.use(express.static(__dirname + "/public/login"));

    var hiroom = io.of('/hi');
    hiroom.on('connection', function(socket) {
      console.log('someone connected');
      hiroom.emit('hi', 'Hello everyone!');
    });
    //--------------ROOM----------------

io.on('connection', function (resp) {
  resp.on("create", (data) => {
    let Id = data.room;
    let IdSock = resp.id;
    // let room = `
    // var ${Id}room = io.of('/${Id}');
    // ${Id}room.on('connection', function(socket) {
    //   console.log('someone connected');
    //   ${Id}room.emit('hi', 'Hello everyone!');
    // });
    // //--------------ROOM----------------`;
    // let datas = fs.readFileSync('index.js', 'utf8');
    // fs.writeFile('index.js', datas.replace("//--------------ROOM----------------", room), err => {
    //   if (err) {
    //     console.error(err);
    //   }
    // });
    let infoGames = JSON.parse(fs.readFileSync("rooms.json"));
    let newRoom = {};
    newRoom.roomId = Id;
    newRoom.admin = data.user;
    newRoom.countGames = data.countGames;
    infoGames["rooms"].push(newRoom);
    let d = JSON.stringify(infoGames, null, "  ");
        fs.writeFile("rooms.json", d, err => {
      if (err) {
        console.error(err);
      } else {
        io.to(IdSock).emit("success", "Кімната створена успішно");
      }
    });
  });
  resp.on("request", () => {
    let id = resp.id;
    fs.readFile('rooms.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        io.to(id).emit("response", data);
      }
    })
  });
  resp.on("delete", (data) => {
    let id = resp.id;
    let cnt = data.count;
    let room = data.roomId;
    let admin = data.user;
    let y = {};
    y.roomId = room;
    y.admin = admin;
    y.countGames = cnt;
    let d = JSON.parse(fs.readFileSync("rooms.json"));
    for (let u of d.rooms) {
      if (u.roomId == room) {
        delete u.roomId;
        delete u.admin;
        delete u.countGames;
        break;
      }
    }
    fs.writeFile("rooms.json", JSON.stringify(d, null, "  "), err => {
      if (err) {
        console.error(err);
      } else {
        io.to(id).emit("successDel");
      }
    });
  });
  resp.on("loose", (data) => {
    io.emit("ooh", data);
  });
  resp.on("position", (data) => {
    io.emit("get", data);
  });
  resp.on("load", (data) => {
    io.emit("reload", data);
  });
});

server.listen(2000, function() {
  console.log('listening on 3000');
});
