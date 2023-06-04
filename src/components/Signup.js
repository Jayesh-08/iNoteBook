import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })

    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem('token', json.authtoken)
      navigate("/");
      props.showAlert("Account created successfully", "success");
    }
    else {
      props.showAlert(json.error?json.error:json.errors[0].msg, "danger");
    }
  }

  const pswrd_1 = document.querySelector("#password");
  const pswrd_2 = document.querySelector("#cpassword");
  const showBtn = document.querySelector(".sho");



  const active_2 = () => {

    if (pswrd_2.value !== "") {
      showBtn.style.display = "block";
      showBtn.onclick = function () {
        if ((pswrd_1.type === "password") && (pswrd_2.type === "password")) {
          pswrd_1.type = "text";
          pswrd_2.type = "text";
          this.textContent = "Hide";
        } else {
          pswrd_1.type = "password";
          pswrd_2.type = "password";
          this.textContent = "Show";
        }
      }
    } else {
      showBtn.style.display = "none";
    }

    const validatePassword = ()=> {
      if (pswrd_1.value !== pswrd_2.value) {
        pswrd_2.setCustomValidity("Passwords Don't Match");
      } else {
        pswrd_2.setCustomValidity('');
      }
    }

    pswrd_1.onchange = validatePassword;
    pswrd_2.onchange = validatePassword;
  }
  return (
    <div className='container mt-2'>
      <h2 className='my-2'>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="my-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name='name' aria-describedby="emailHelp" onChange={handleChange} />
        </div>
        <div className="my-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={handleChange} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="my-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' onChange={handleChange} minLength={5} required />
        </div>
        <div className="my-3 field">
          <label htmlFor="cpassword" className="form-label ">Confirm Password</label>
          <input type="password" className="form-control" onKeyUp={active_2} id="cpassword" name='cpassword' onChange={handleChange} minLength={5} required />
          <div className="sho">
            SHOW
          </div>

        </div>
        <button type="submit" className="btn btn-primary">Submit</button>

      </form>
    </div>
  )
}

export default Signup