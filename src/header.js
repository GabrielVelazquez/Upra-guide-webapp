import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./images/upra-guide-logoV2.png";
import close from "./images/close_icon_yellow.png";
//import open from './images/close_icon_yellow.png';
import "./header.css";
import { auth } from "./firebase.config";
import "firebase/auth";


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const [accountOpen, setAccountOpen] = useState(false);
  const toggleAccount = () => {
    setAccountOpen(!accountOpen);
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Usuario deslogueado correctamente");
      })
      .catch((error) => {
        console.error("Error al desloguear:", error.message);
      });
  };

  const renderAccountDropdown = () => {
    const user = auth.currentUser;

    if (user) {
      // User is logged in
      return (
        <div className="menu-DD">
          <Link
            className="menu-text2"
            to="/account"
            onClick={() => {
              toggleMenu();
              toggleAccount();
            }}
          >
            View Account
          </Link>
          <Link
            className="menu-text2"
            to="/"
            onClick={() => {
              handleLogout();
              toggleMenu();
              toggleAccount();
            }}
          >
            Logout
          </Link>
        </div>
      );
    } else {
      // User is not logged in
      return (
        <div className="menu-DD">
          <Link
            className="menu-text"
            to="/signup"
            onClick={() => {
              toggleMenu();
              toggleAccount();
            }}
          >
            Sign Up
          </Link>
          <Link
            className="menu-text"
            to="/login"
            onClick={() => {
              toggleMenu();
              toggleAccount();
            }}
          >
            Log In
          </Link>
        </div>
      );
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Usuario autenticado:", user.uid);
      } else {
        console.log("No hay usuario autenticado");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
 

  
  return (
    <div className="Upra-header">
      <Link to="/">
        <img src={logo} className="logo-header" alt="Upra Guide" />
      </Link>



      <div className={`menu ${menuOpen ? "open" : ""}`}>
        {/*borde del menu burger top*/}
        <img src={close} alt="X" className="close-icon" onClick={toggleMenu} />
        {/* </div> */}


        <Link className="menu-text" to="/" onClick={toggleMenu}>
          Home
        </Link>

        <hr className="hr-burgermenu" />
        <Link className="menu-text" to="/maps2" onClick={toggleMenu}>
          Map
        </Link>
        {/*<button className="menu-item">Maps</button>*/}
        <hr className="hr-burgermenu" />
        <Link className="menu-text" to="/events" onClick={toggleMenu}>
          Events
        </Link>
        {/*<button className="menu-item">Events</button>*/}
        <hr className="hr-burgermenu" />
        <Link className="menu-text" to="/about" onClick={toggleMenu}>
          About
        </Link>
        <hr className="hr-burgermenu" />

        {/* <Link className='menu-text' to="/account"  onClick={toggleMenu}>Account </Link>
        <hr className='hr-burgermenu'/>
        */}
        <div className="menu-text">
          <div className="account-header" onClick={toggleAccount}>
            <span>Account</span>
            <span className={`dropdown-arrow ${accountOpen ? "openv" : ""}`}>
              {" "}
              <img
                className="dropdown-arrow"
                src="https://icons.veryicon.com/png/o/miscellaneous/decon/dropdown-1.png"
                alt="Dropdown Arrow"
              ></img>
            </span>{" "}
          </div>
          {accountOpen && renderAccountDropdown()}
        </div>
        <hr className="hr-burgermenu" />
      </div>

      <img
        src="https://cdn.icon-icons.com/icons2/2596/PNG/512/hamburger_button_menu_icon_155296.png"
        alt="Open"
        className="open-icon"
        onClick={toggleMenu}
      />
    </div>
  );
};

export default Header;
