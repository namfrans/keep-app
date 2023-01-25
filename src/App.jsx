import React from "react"
import Hearder from "./Hearder";
import Footer from "./Footer"
import Note from "./Note"
import notes from "./notestore"


const createCard = (note) => {
    return(
        <Note 
            noteTitle = {note.title}
            noteContent = {note.content}
        />
    );
}


function App(){
    return(
        <div>
            <Hearder />
            {notes.map(createCard)}
            <Footer />
        </div>
    )
}

export default App