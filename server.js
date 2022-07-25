const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");

const port = 3080;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const publicFolder = path.join(__dirname, "public");

app.use(express.static(publicFolder));
app.use(cors());
app.set("views", publicFolder);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", (req, res) => {
    res.render("index.html");
});

app.get("/messages", (req, res) => {
    res.json(messages)
})

let messages = [];

io.on("connection", (socket) => {
    console.log(`Novo socket conectado! ${socket.id}`);
    socket.emit("previousMessages", messages);

    socket.on("sendMessage", (data) => {
        console.log(data)
        messages.push(data);
        socket.broadcast.emit("receivedMessage", data);
    });
});

server.listen(port, () => {
    console.log(`Servidor iniciado na porta: ${port}`);
});
