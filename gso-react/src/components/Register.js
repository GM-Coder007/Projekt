import { useState } from 'react';

function Register() {
   
    const [email, setEmail] = useState([]);
    const [password, setPassword] = useState([]);
    const [error, setError] = useState([]);

    async function Register(e){
        e.preventDefault();
        const res = await fetch("http://localhost:3001/user/register", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            window.location.href="/login";
        }
        else{
            setUsername("");
            setPassword("");
            setEmail("");
            setError("Registration failed");
        }
    }

    return(
        <form onSubmit={Register}>
            <input type="text" name="email" placeholder="Email" value={email} onChange={(e)=>(setEmail(e.target.value))} /> <br/> <br/>
            <input type="password" name="password" placeholder="Geslo" value={password} onChange={(e)=>(setPassword(e.target.value))} /> <br/> <br/>
            <input class="btn btn-success" type="submit" name="submit" value="Registracija" />
            <label>{error}</label>
        </form>
    );
}

export default Register;
