import React, { useCallback} from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"

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
  new Quill(quillContainer, {theme: "snow"})
  },[])

  return <div id="quillWrapper" ref={setupQuillDOM

  }> </div>
  
}
