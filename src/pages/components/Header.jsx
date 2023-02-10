import React from "react";
import NoteIcon from '@mui/icons-material/Note';



function Header(props){
    return(
        <div>
            <header>
                <h1><NoteIcon /> Notepad.io</h1>
                <button onClick={()=>{props.onLogout()}} className="header_login_button">
                    Logout
                </button>
            </header>
        </div>
    );
}

export default Header;