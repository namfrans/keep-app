import {BrowserRouter as Router, Routes, Route, Navigate, Link} from "react-router-dom";
import { useEffect, useState } from "react";
import NoteIcon from '@mui/icons-material/Note';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App(){
    const [user, setUser] = useState(null);

    const getUser = async () => {
        try{
            const url = `${process.env.REACT_APP_API_URL}/login/success`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            setUser(data.user);
        }catch(err){
            console.error(err);
        }
    };
    
    
    useEffect(()=>{
        getUser();
    }, []);

    useEffect(()=>{
        console.log("I work but fix me somehow")
        console.log(user);
    }, [user]);
    return (
        <Router>
            <div>
                {user === null &&
                    <header>
                        <Link to="/"><h1><NoteIcon /> Notepad.io</h1></Link>
                    </header>
                }
                <Routes>
                    <Route 
                        exact path="/"
                        element={user ? <Home userDetails={user}/> : <Navigate to="/login"/>}
                    ></Route>
                    <Route 
                        exact path="/login"
                        element={user ? <Navigate to="/" /> : <Login />}
                    ></Route>
                    <Route 
                        exact path="/register"
                        element={user ? <Navigate to="/" /> : <Register />}
                    ></Route>
                </Routes>
            </div>
        </Router>
    )
}