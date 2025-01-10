import {React, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import {io} from "socket.io-client";

import { BACKEND_URL } from './config';
export default function Dashboard() {
    const navigate = useNavigate();
    const handleCreateDoc = () => {
      navigate(`/documents/${uuidV4()}`); // Navigate to the dynamic route
    };
    const [documents, setDocuments] = useState([]);
    const [socket, setSocket] = useState();
    const [docStatus, setDocStatus] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
const [selectedDoc, setSelectedDoc] = useState(null);

const handleDelete = (docId) => {
  setSelectedDoc(docId);
  setShowConfirm(true);
};

const confirmDelete = () => {
  deleteDocument(selectedDoc);
  setShowConfirm(false);
};

    useEffect(() => {
        const server = io(BACKEND_URL);
        setSocket(server);
        // Fetch list of documents
        server.emit("get-documents");
        server.on("documents-list", (docs) => {
          if(!docs || docs.length === 0){
            setDocStatus(false);
          }
          else{
            setDocuments(docs);
            setDocStatus(true)
          }
          
        });
    
        return () => {
          server.disconnect();
        };
      }, []);
      const openDocument = (id) => {
        navigate(`/documents/${id}`); // Open existing document
      };
      const deleteDocument = (id) => {
        
          socket.emit("delete-document", id);
          setDocuments((prev) => prev.filter((doc) => doc._id !== id));
        
      };
  return (
    <>
    <header>
    <h1>Real-Time Document Collaboration</h1>
    <p>Create, edit, and collaborate on documents effortlessly.</p>
  </header>
    <div className='container'>
    <button className="button create" onClick={handleCreateDoc}>+ Create Blank Document</button>
    <h2>Documents History</h2>
    {docStatus ? (
  <ul className='document-list'>
  {documents.map((doc) => (
    <li key={doc._id} className="document-item"
        onClick={() => openDocument(doc._id)}>
         <span>
         {doc.name || "Untitled"}</span>
         <button  onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the document opening
          handleDelete(doc._id);
        }} className="delete-button">Delete</button>


    </li>
    
  ))}
  {showConfirm && (
      <div className="modal">
        <p>Are you sure you want to delete this document?</p>
        <button className="confirm_delete" onClick={confirmDelete}>Yes</button>
        <button className="abort_delete" onClick={() => setShowConfirm(false)}>No</button>
      </div>
    )}
</ul>
) : (
  <p>Your created documents will show here</p>
)}
   
    </div>
    </>
  )
}
