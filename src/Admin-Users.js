import React, { useState, useEffect } from "react";
import { firestore } from "./firebase.config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "./admin-home2.css"; // Asegúrate de tener el archivo CSS correspondiente para el estilo de esta página

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

  return (
    <div className="admin-users-page"> {/* Agregamos una clase para aplicar estilos */}
      <h2>Admin Users Page</h2>
      <div className="users-list-container"> {/* Agregamos una clase para aplicar estilos */}
        <h3>Users List</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.email}{" "}
              <button onClick={() => handleToggleAdmin(user.id, user.isAdmin)}>
                {user.isAdmin ? "Revoke Admin" : "Make Admin"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminUsersPage;
