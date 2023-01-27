import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateNote from "./CreateNoteArea";

function App() {
  const [notes, setNotes] = useState([]);

  const addNote = (note) =>{
    setNotes( prevNotes =>{
      return [...prevNotes, note]
    })
  }

  const deleteNote = (id) =>{
    setNotes( prevNotes =>{
      return notes.filter((note, index)=>{
        return index !== id;
      })
    })
  }

  return (
    <div>
      <Header />
      <CreateNote onAddNote={addNote}/>
      {
        notes.map((note, index)=>{
            return(
                <Note 
                    key = {index}
                    id = {index}
                    noteTitle = {note.title}
                    noteContent = {note.content}
                    onDelete = {deleteNote}
                />
            );
        })
      }
      <Footer />
    </div>
  );
}

export default App;
