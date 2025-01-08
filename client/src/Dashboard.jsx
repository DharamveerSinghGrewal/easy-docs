import {React, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import {io} from "socket.io-client";
import logo from "./assets/logo.png";
import doc_logo from "./assets/doc_logo.png";
import del_logo from "./assets/delete.png";
import { BACKEND_URL } from './config';
export default function Dashboard() {
    const navigate = useNavigate();
    const handleCreateDoc = () => {
      navigate(`/documents/${uuidV4()}`); // Navigate to the dynamic route
    };
    const [documents, setDocuments] = useState([]);
    const [socket, setSocket] = useState();
    
    useEffect(() => {
        const server = io(BACKEND_URL);
        setSocket(server);
        // Fetch list of documents
        server.emit("get-documents");
        server.on("documents-list", (docs) => {
          setDocuments(docs);
        });
    
        return () => {
          server.disconnect();
        };
      }, []);
      const openDocument = (id) => {
        navigate(`/documents/${id}`); // Open existing document
      };
      const deleteDocument = (id) => {
        if (window.confirm("Are you sure you want to delete this document?")) {
          socket.emit("delete-document", id);
          setDocuments((prev) => prev.filter((doc) => doc._id !== id));
        }
      };
  return (
    <div className='dash_wrapper'>
        <div className="dashboard_header">
        <div className="logo_wrapper">
        <img src={logo} alt="Logo" className="dashboard_logo" />
        <h1>Real-Time Document Collaboration Hub</h1>
      </div>
    <p>Create, edit, and manage your documents effortlessly with real-time collaboration. Work on the same document with others simultaneously, and watch changes appear instantly. Organize your work, open saved documents, or delete outdated ones—all in one place.
    </p>
  </div>
    <div className='create_doc' onClick={handleCreateDoc}>
        <div className='create_text'><h2>Create Blank Document</h2></div>
    </div>

    <div className='created_docs'>
<h1>Documents History</h1>
<ul>
  {documents.map((doc) => (
    <li key={doc._id} className="document_item"
        onClick={() => openDocument(doc._id)}>
         <img src={doc_logo} alt="doc_logo" className="dashboard_logo" />
         {doc.name || "Untitled"}
      <img src={del_logo}
        className="dashboard_logo del_logo"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the document opening
          deleteDocument(doc._id);
        }} />
      
       
    </li>
  ))}
</ul>

    </div>
    </div>
  )
}
