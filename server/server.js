//Mongo DB integration
const mongoose = require("mongoose")
const Document = require("./Document")
mongoose.connect('mongodb://localhost/documents_database', {})
//cors (cross origin request support) is used as server and client are on different ports
const io = require('socket.io')(3001, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },

})

const initialValue = ""
io.on("connection", socket =>{
      // Fetch all document IDs when requested
      socket.on("get-documents", async () => {
            const documents = await Document.find({}, "_id");
            socket.emit("documents-list", documents); // Send list of document IDs
        
    });

    //Fetch a single document and emit all its data
    socket.on('get-document', async documentId => {
        const document = await createOrLookUpDoc(documentId)
        socket.join(documentId)
        socket.emit('load-document', document.data)
        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, {data})
        })
    })
    
})

async function createOrLookUpDoc(id){
    if(id == null) return

    const document = await Document.findById(id)
    if(document) return document
    return await Document.create({_id: id, data: initialValue})
}