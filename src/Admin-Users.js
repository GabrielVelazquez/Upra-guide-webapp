

import React, { useState, useEffect } from "react";
import { firestore } from "./firebase.config";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import "./Admin-Users.css"; 

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestore, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleToggleAdmin = async (userId, isAdmin) => {
    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        isAdmin: !isAdmin // Cambiar el valor de isAdmin
      });
      // Actualizar la lista de usuarios después de cambiar el estado de isAdmin
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            isAdmin: !isAdmin // Cambiar el valor de isAdmin localmente
          };
        }
        return user;
      });
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const userRef = doc(firestore, "users", userId);
      await deleteDoc(userRef);
      // Disable user account in Firebase Authentication
      // You can use the Firebase Admin SDK or the Firebase Authentication REST API to disable the user account.
      // Here's an example using the Firebase Admin SDK:
      // const user = await firestore.auth().getUser(userId);
      await firestore.auth().updateUser(userId, {
        disabled: true
      });
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="admin-users-page"> {/* Agregamos una clase para aplicar estilos */}
      <h1>Admin Users Page</h1>
      <h2 className="admin-users-header">Users List</h2>
      <div className="users-list-container"> {/* Agregamos una clase para aplicar estilos */}
        
        <div> {/*vertical look*/}
        <div className="admin-users-tips">
        <span>User email</span>
        <span>Admin management</span>
        <span>Discard account</span>
        </div>
          {users.map((user) => (
            
            <div className="listdivUsers" key={user.id}>
              {user.email}{" "}
              <button className={`MakeAdmin ${user.isAdmin ? "RevokeAdmin" : "MakeAdmin"}`} onClick={() => handleToggleAdmin(user.id, user.isAdmin)}>
              {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                </button>
              <button className="Discard" onClick={() => handleDeleteUser(user.id)}>Delete User</button>
            </div>
          ))}
        </div>
      </div>
    </div> /*vertical look*/
  );
};

export default AdminUsersPage;
