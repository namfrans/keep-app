import React from "react";
import { FaGoogle } from "react-icons/fa";
import { AiFillFacebook } from "react-icons/ai";

const googleAuth = () =>{
    window.open(
        `${process.env.REACT_APP_API_URL}/auth/google/callback`,
        "_self"
    );
};

export default function Login() {
    // const [userLogin, setUserLogin] = useState({
    //     email:"",
    //     password:""
    // });

    // const handleChange = (event) =>{
    //     const {name, value} = event.target;
    //     setUserLogin((prevSignInfo)=>{
    //         return{
    //           ...prevSignInfo,
    //           [name]: value
    //         }
    //       })
    //       event.preventDefault();
    // }

    // const clientEP = axios.create({
    //     baseURL: `${process.env.REACT_APP_API_URL}`
    //   });
    
      // const handleLogin = async (userLogin) => {
      //   try {
      //     let response = clientEP.post('/login', {
      //       email: userLogin.email,
      //       password: userLogin.password,
      //     })
      //     console.log(response.data);
      //   } catch (err) {
      //     console.log(err);
      //   }
      // };  
    
  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700">
        <h2 className="text-3xl font-medium">Log In</h2>
        <div className="py-4">
            <h3 className="py-4">Be one of the first to try out our app.</h3>
            {/* <form>
                <input onChange={handleChange} name="email" placeholder="Email" type="email" value={userLogin.email}/>
                <input onChange={handleChange} name="password" placeholder="Password" type="password" value={userLogin.password}/>
                <button name="submitBtn" onClick={handleLogin} type="submit">Login</button>
            </form> */}
        </div>
        <div className="flex flex-col gap-4">
            <button onClick={googleAuth} className="text-white bg-gray-700 p-4 w-full font-medium rounded-lg flex align-middle gap-2">
                <FaGoogle className="text-2xl"/>Login with Google
            </button>
            <button className="text-white bg-gray-700 p-4 w-full font-medium rounded-lg flex align-middle gap-2">
                <AiFillFacebook className="text-2xl text-blue-400"/>Login with Facebook
            </button>
        </div>
    </div>
  );
}