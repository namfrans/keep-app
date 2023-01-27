import React, {useState} from "react";


function CreateNote(props) {
  const [note, setNote] = useState({
    title:"",
    content:""
  });

  const handleChange = (event) =>{
    event.preventDefault();
    const {name, value} = event.target;

    setNote((prevNote)=>{
      return{
        ...prevNote,
        [name]: value
      }
    })
  }

  return (
    <div>
      <form>
        <input onChange={handleChange} name="title" placeholder="Title" value={note.title}/>
        <textarea onChange={handleChange} name="content" placeholder="Take a note..." value={note.content} rows="3" />
        <button onClick={()=>{
          props.onAddNote(note, setNote({title:"", content:""}));
        }} >
          Add
        </button>
      </form>
    </div>
  );
}

export default CreateNote;
