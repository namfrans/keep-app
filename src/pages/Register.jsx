import React from "react";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiFillFacebook } from "react-icons/ai";

const googleAuth = () =>{
    window.open(
        `${process.env.REACT_APP_API_URL}/auth/google/callback`,
        "_self"
    );

};

export default function Register() {
  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700">
        <h2 className="text-3xl font-medium">Register</h2>
        <div className="py-4">
            <h3 className="py-4">Be one of the first to try out our app.</h3>
        </div>
        <div className="flex flex-col gap-4">
            <button onClick={googleAuth} className="text-white bg-gray-700 p-4 w-full font-medium rounded-lg flex align-middle gap-2">
                <FaGoogle className="text-2xl"/>Signup with Google
            </button>
            <button className="text-white bg-gray-700 p-4 w-full font-medium rounded-lg flex align-middle gap-2">
                <AiFillFacebook className="text-2xl text-blue-400"/>Signup with Facebook
            </button>
        </div>
    </div>
  );
}