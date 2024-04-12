import './SignUp.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase.config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
// import {collection, addDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [department, setDepartment] = useState(''); // Estado para el departamento
  const [association, setAssociation] = useState(''); // Estado para el departamento
  const navigate = useNavigate();

  const firestoreDB = getFirestore(); // Get Firestore instance

  const handleSignUp = () => {
    // Validar contraseñas
    if (!email || !password || !name) {
      alert('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      alert('Password should be at least 6 characters long');
      return;
    }

    if (studentNumber && studentNumber.length !== 11) {
      alert('Student number should be 9 digits');
      return;
    }

// Crear usuario en la autenticación
createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  const user = userCredential.user;

  const userData = {
    name: name,
    email: email,
    studentNumber: studentNumber,
    department: department,
    association: association,
    isAdmin: false,
  };

  // Agregar datos del usuario a Firestore
  const userDocRef = doc(collection(firestoreDB, 'users'), user.uid);
  setDoc(userDocRef, userData)
    .then(() => {
      console.log('User data saved in Firestore');
      navigate('/account');
    })
    .catch((error) => {
      console.error('Error saving user data in Firestore:', error);
    });
})
.catch((error) => {
  console.error('Error signing up user:', error);
});
};

  const departmentOptions = [
    'Select department',
    'Ciencias en Computadoras',
    'Ciencias Naturales',
    'Ciencias Sociales',
    'Humanidades',
    'Matemáticas',
    'Física',
    'Química',
    'Biología',
    'Ingeniería',
    'Educación',
    'Administración de Empresas',
    'Ciencias de la Salud',
    'Artes y Comunicación',
  ];
  const AssociationOptions = [
    'N/A',
    'AEC',
    'JCA',
    'Clase Graduanda',
    'CEMA',
    'NeuroBoricuas',
    'ANSA',
    'BTMOC',
    'MED LIFE',
    'AEB',
    'CEFTM-UPRA',
    'BIOVET',
    'CSSA',
    'AETV',
    'PRPDA',
    'AEPIO',
    'PRCA',
    'NAHJ',
    'PAEICA',
    'ACTE',
    'ANEDE',
    'LIONS',
    'NAUPRA',
    'ACS',
    'CQPR-UPRA',
    'FPA',
    'ROTARACT',
    'GTIPA',
    'AEPA',
    'NSLS',
    'SILENT LEXICON',
    'LPJ',
    'PHI ETA MU',
    'ALA',
    'AULLIDO VERDE',
    'AEDU',
  ];

  return (
    <div className="sign-up">
      <h2>Create an account</h2>
      <div className="input-container">
        <label>Email</label>
        <input className='input-box' type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="input-container">
        <label>Password</label>
        <input
          className='input-box'
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password.length > 0 && password.length < 6 && (
          <p className="password-warning">
            Password should be at least 6 characters long.
          </p>
        )}
      </div>
      <div className="input-container">
        <label>Confirm Password</label>
        <input required lassName='input-box' type="password" id="confirmpassword" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
      <div className="input-container">
        <label>Name</label>
        <input required className='input-box' type="text" id="name" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="input-container">
        <label>Student Number (Optional)</label>
        <input className='input-box' type="text" id="studentNumber" placeholder="Enter your student number: 840-XX-XX" value={studentNumber} onChange={(e) => {
      const input = e.target.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
      if (input.length <= 9) { // Limitar a 9 caracteres
        let formattedInput = input;
        if (input.length > 5) {
          formattedInput =
            input.slice(0, 3) + '-' + input.slice(3, 5) + '-' + input.slice(5, 9);
        } else if (input.length > 3) {
          formattedInput = input.slice(0, 3) + '-' + input.slice(3, 5);
        }
        setStudentNumber(formattedInput);
      }
    }}
    maxLength={12} // Restringir la longitud máxima a 12 caracteres (con guiones)
  />
</div>
      <div className="input-container">
        <label>Department (Optional)</label>
        <select className='select-dept' id="department" value={department} onChange={(e) => setDepartment(e.target.value)}>
          {departmentOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="input-container">
        <label>Association (Optional)</label>
        <select className='select-dept' id="association" value={association} onChange={(e) => setAssociation(e.target.value)}>
          {AssociationOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <button className="sign-up-button" onClick={handleSignUp}>
        SIGN UP
      </button>
      <p className="login-link">
        <Link to="/login">Already have an account?</Link>
      </p>
    </div>
  );
}

export default SignUp;
