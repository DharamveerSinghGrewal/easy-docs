//cors (cross origin request support) is used as server and client are on different ports
const io = require('socket.io')(3001, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },

})

io.on("connection", socket =>{
    socket.on("send-changes", delta => {
        socket.broadcast.emit("receive-changes", delta)
    })
})
