import React, {useState} from "react";
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import AddIcon from '@mui/icons-material/Add';

function CreateNote(props) {
  const [note, setNote] = useState({
    title:"",
    content:""
  });
  const [isExpanded, setExpansion] = useState(false);
    
  const handleChange = (event) =>{
    const {name, value} = event.target;

    setNote((prevNote)=>{
      return{
        ...prevNote,
        [name]: value
      }
    })
    event.preventDefault();
  }


  const expand = () =>{
    setExpansion(true);
  }

  return (
    <div>
      <form>
        <input onChange={handleChange} name="title" placeholder="Title" type={isExpanded ? "text" : "hidden"} value={note.title}/>
        <textarea onChange={handleChange} onClick={expand} name="content" placeholder="Take a note..." value={note.content} rows={isExpanded ? "3" : "1"}/>
        <Zoom in={isExpanded}>
          <Fab color="#130f40" aria-label="add" onClick={()=>{props.onAddNote(note, setNote({title:"", content:""}));}} >
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateNote;
