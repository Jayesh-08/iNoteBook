import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Login = (props) => {

    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })

        });
        const json = await response.json();
        if (json.success) {
            localStorage.setItem('token', json.authtoken)
            props.showAlert("Logged in successfully", "success");
            navigate("/");
        }
        else {
            props.showAlert(json.error?json.error:json.errors[0].msg, "danger");
        }
    }

    const pswrd_1 = document.querySelector("#password");
    const showBtn = document.querySelector(".sho");

    const active_2 = ()=>{
        if (pswrd_1.value !== "") {
            showBtn.style.display = "block";
            showBtn.onclick = function () {
                if (pswrd_1.type === "password") {
                    pswrd_1.type = "text";
                    this.textContent = "Hide";
                } else {
                    pswrd_1.type = "password";
                    this.textContent = "Show";
                }
            }
        } else {
            showBtn.style.display = "none";
        }
    }


    return (
        <div className='mt-3'>
            <h2>Login to continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' value={credentials.email} onChange={handleChange} aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3 field">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={handleChange} onKeyUp={active_2}/>
                    <div className="sho">
                        SHOW
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login