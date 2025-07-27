const express = require("express")
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");

const io = socketio(server);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket){
  socket.on("send-location", function (data){
    io.emit("receive-location" , {id: socket.id , ...data});
  });
  console.log("connected")
  // You can handle socket events here if needed
});


app.get("/",(req,res) => {
  res.render("index");
})

server.listen(3000);