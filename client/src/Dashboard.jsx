import {React, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import {io} from "socket.io-client";
export default function Dashboard() {
    const navigate = useNavigate();
    const handleCreateDoc = () => {
      navigate(`/documents/${uuidV4()}`); // Navigate to the dynamic route
    };
    const [documents, setDocuments] = useState([]);
    useEffect(() => {
        const server = io("http://localhost:3001");
    
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

  return (
    <div className='dash_wrapper'>
    <div className='create_doc' onClick={handleCreateDoc}>
        <div className='create_text'><h2>Create Blank Document</h2></div>
    </div>

    <div className='created_docs'>
<h2>Documents History</h2>
        <ul>
          {documents.map((doc) => (
            <li key={doc._id} onClick={() => openDocument(doc._id)}>
              <div className="document_item">Document ID: {doc._id}</div>
            </li>
          ))}
        </ul>
    </div>
    </div>
  )
}
