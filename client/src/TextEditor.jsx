import React, { useCallback} from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"

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
  const setupQuillDOM
   = useCallback(quillWrapper=>{
  
  if(quillWrapper== null) return

  //Remove any existing Quill DOMs to avoid duplicates
  quillWrapper.innerHTML = ''

  //create a new div to act as the container for Quill instance
  const quillContainer = document.createElement('div')
  quillWrapper.append(quillContainer)

  // Initialize Quill editor instance in the container with the "snow" theme
  new Quill(quillContainer, {theme: "snow", modules: {toolbar: TOOLBAR_OPTIONS}})
  },[])

  return <div className="quillWrapper" ref={setupQuillDOM}> </div>
  
}
