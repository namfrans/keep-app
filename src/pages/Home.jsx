import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateNote from "./components/CreateNoteArea";
import axios from 'axios';

function Home() {
  const [notes, setNotes] = useState([]);
  
  const handleLogout = () =>{
    window.open(
        `${process.env.REACT_APP_API_URL}/logout`,
        "_self"
    );
  };

  const clientEP = axios.create({
    withCredentials: true,
    baseURL: `${process.env.REACT_APP_API_URL}`
  });

  const handleAddNote = async (note) => {
    try {
      let response = clientEP.post('/notes', {
        title: note.title,
        content: note.content,
      })
      
      response.data && setNotes( prevNotes =>{
        return [response.data, ...prevNotes]
      })

      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };  

  const handleGetNotes = async () => {
    try {
      let response = await clientEP.get('/notes/show');
      response.data && setNotes(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const response = await clientEP.delete(`/notes/${id}`);
      setNotes(prevNotes => {
        return prevNotes.filter((note, index) => {
              return index !== id;
          }
        )
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetNotes();
  });

  return (
    <div>
      <Header onLogout={handleLogout}/>
      <CreateNote onAddNote={handleAddNote}/>
      {notes.map((note, index) => (
        <Note 
          key={index}
          id={index}
          noteTitle={note.title}
          noteContent={note.content}
          onDelete={handleDeleteNote}
        />
      ))}
      <Footer />
    </div>
  );
}

export default Home;
