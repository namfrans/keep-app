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
    baseURL: `${process.env.REACT_APP_API_URL}/notes`
  });

  const handleAddNote = async (note) => {
    try {
      let response = clientEP.post('', {
        title: note.title,
        content: note.content,
      })
      setNotes([response.data, ...notes]);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };  

  const handleGetNotes = async () => {
    try {
      let response = await clientEP.get('/show');
      setNotes(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const response = await clientEP.delete(`${id}`);
      setNotes(
         notes.filter((note) => {
            return note.id !== id;
         })
      );
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
