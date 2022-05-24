import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext); 

    async function Login(e){
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            userContext.setUserContext(data);
        } else {
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
        }
    }

    return (
        <form onSubmit={Login}>
            {userContext.user ? <Navigate replace to="/" /> : ""}
            <input type="text" name="username" placeholder="Uporabniško ime"
             value={username} onChange={(e)=>(setUsername(e.target.value))}/> <br/> <br/>
             <input type="password" name="password" placeholder="Geslo"
             value={password} onChange={(e)=>(setPassword(e.target.value))}/> <br/> <br/>
             <input class="btn btn-success" type="submit" name="submit" value="Prijava"/> <br/> <br/>
             <label>{error}</label>
        </form>
    );
}

export default Login;