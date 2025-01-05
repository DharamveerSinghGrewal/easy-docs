import React, { useCallback, useEffect, useState} from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"
import {io} from "socket.io-client"

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
[{align: []}],
["image", "blockquote", "code-block"],
["clean"],

]
export default function TextEditor() {

  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  useEffect(() =>{
    const server = io("http://localhost:3001")
    setSocket(server)
    return () =>{
        server.disconnect()
    }
  }, [])

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
  setQuill(quill_instance)
  },[])

  return <div className="quillWrapper" ref={setupQuillDOM}> </div>
  
}
