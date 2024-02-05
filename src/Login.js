import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";
import lobo_icon from "./images/lobo-upra_icon.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userType = "user";

        if (userType === "admin") {
          navigate("/admin-home");
        } else if (userType === "user") {
          navigate("/");
        } else {
          console.error("Invalid user type:", userType);
        }
      })
      .catch((error) => {
        alert("Invalid email or password");
        console.error(error);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSignIn();
    }
  };

  return (
    <div className="login">
      <h2>Log into your account</h2>
      <img
        src={lobo_icon}
        alt="UPRA logo"
        className="mascot-image" // Aplica una clase de estilo CSS
      />
      <div className="input-container">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      <div className="input-container">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      <button className="sign-in-button" onClick={handleSignIn}>
        SIGN IN
      </button>
      <p className="signup-link">
        <Link to="/SignUp">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
