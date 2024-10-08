import { useEffect } from 'react';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "./firebase.config";
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword} from "firebase/auth";
import "./Login.css";
import lobo_icon from "./images/lobo-upra_icon.png";

const Login = ({setIsAdmin}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(firestore, "users", userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        /* ORIGINAL
        if (userData.isAdmin) {      
          console.log(userData.isAdmin)  
          setIsAdmin(true); // Update isAdmin state
          navigate("/admin-home");        
        */

          /*
          {else{}
           console.log(userData.isAdmin)
          setIsAdmin(false); // Update isAdmin state
          navigate("/");   
        }        
          */
        if (userData.isAdmin) {
          setIsAdmin(true); //si es admin = true
          localStorage.setItem('isAdmin', 'true'); //guarda el valor de bool local
          navigate("/admin-home");
        } else {
          setIsAdmin(false);
          localStorage.setItem('isAdmin', 'false');//guarda falso
          navigate("/");
        }
      } else {
        // El usuario no tiene información en Firestore, podría ser un problema
        console.error("El usuario no tiene información en Firestore");
        alert("Cuenta inhabilitada, contacte al administrador");
        // Aquí puedes decidir cómo manejar esta situación
      }
    } catch (error) {
      alert("Correo o contraseña incorrectos");
      console.error(error);
    }
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
