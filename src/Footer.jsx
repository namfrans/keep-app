import React from "react";

function Footer(){
    let date = new Date();
    return(
        <footer>
            <p>&copy; Fr Binaries Inc, {date.getFullYear()}</p>
        </footer>
    )
}

export default Footer