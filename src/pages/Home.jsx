import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateNote from "./components/CreateNoteArea";

function Home(props) {
  const [notes, setNotes] = useState([]);
  
  const handleLogout = () =>{
    window.open(
        `${process.env.REACT_APP_API_URL}/logout`,
        "_self"
    );
  };

  const handleAddNote = async (note) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/notes`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: props.userDetails['googleId'],
          title: note.title,
          content: note.content
        })
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetNotes = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/users/notes`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data);
      setNotes(data.notes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/notes/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleGetNotes();
  }, []);

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
