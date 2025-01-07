import React, { useCallback, useEffect, useState} from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"
import {io} from "socket.io-client"
import { useParams } from 'react-router-dom'

const SAVE_TIMER = 1000
const TOOLBAR_OPTIONS = [
[{size: [ 'small', false, 'large', 'huge' ]}],
[{font: []}],
[{list: "ordered"}, {list: "bullet"},{ 'list': 'check' }],
["bold", "italic", "underline","strike"],
[{color: []}, {background: []}],
[{script: "sub"}, {script: "super"}],
[{ 'indent': '-1'}, { 'indent': '+1' }], 
[{align: []}],
["image", "blockquote", "code-block"],
["clean"],

]
export default function TextEditor() {

  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  const {id: documentId} = useParams();
  
  //save document data after every change
  useEffect(() => {
    if (socket == null || quill == null) return;

    
    let timeoutId;

    const handleTextChange = () => {
        // Clear the previous debounce timer
        clearTimeout(timeoutId);

        // Set a new debounce timer
        timeoutId = setTimeout(() => {
            socket.emit("save-document", quill.getContents());
        }, SAVE_TIMER);
    };

    // Listen for text-change events in Quill
    quill.on("text-change", handleTextChange);

    return () => {
        // Cleanup: remove the listener and clear timeout on unmount
        quill.off("text-change", handleTextChange);
        clearTimeout(timeoutId);
    };
}, [socket, quill]);

//connect to the server
  useEffect(() =>{
    const server = io("http://localhost:3001")
    setSocket(server)
    return () =>{
        server.disconnect()
    }
  }, [])

  //load document data in the text editor
  useEffect(() =>{
        if(socket == null || quill == null) return

        socket.once("load-document", document =>{
            quill.setContents(document)
            quill.enable()
        })
        socket.emit('get-document', documentId)
  }, [socket, quill, documentId])

  //receive changes from the server and update document in real time
  useEffect(() => {
    if(socket ==null || quill == null) return
    const updateDocument = (delta) =>{
       quill.updateContents(delta)
    }
    socket.on('receive-changes', updateDocument)
    return() => {
        socket.off('receive-changes', updateDocument)
    }
   }, [socket, quill])

   //send data to the server whenever a user types
   useEffect(() => {
    if(socket ==null || quill == null) return
    const updateDocument = (delta, oldDelta, source) =>{
        if(source !== 'user') return //only send user made changes to the server
        socket.emit("send-changes", delta)

    }
    quill.on('text-change', updateDocument)
    return() => {
        quill.off('text-change', updateDocument)
    }
   }, [socket, quill])

 //set up quill text editor
  const setupQuillDOM
   = useCallback(quillWrapper=>{
  
  if(quillWrapper== null) return

  //Remove any existing Quill DOMs to avoid duplicates
  quillWrapper.innerHTML = ''

  //create a new div to act as the container for Quill instance
  const quillContainer = document.createElement('div')
  quillWrapper.append(quillContainer)

  // Initialize Quill editor instance in the container with the "snow" theme
  const quill_instance = new Quill(quillContainer, {theme: "snow", modules: {toolbar: TOOLBAR_OPTIONS}})
  quill_instance.disable()
  quill_instance.setText("Loading Document. Please Wait...")
  setQuill(quill_instance)
  },[])

  return <div className="quillWrapper" ref={setupQuillDOM}> </div>
  
}
