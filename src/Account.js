
import {React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Account.css'
import { firestore } from './firebase.config';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { auth } from './firebase.config'; 
const Account = () => {
  const [userData, setUserData] = useState(null);
  const firestoreDB = firestore;
  //const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userEditMode, setUserEditMode] = useState(false); 
  const [courseEditMode, setCourseEditMode] = useState(false); 
  const [courseAddMode, setCourseAddMode] = useState(false); 
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);


  const [newCourse, setNewCourse] = useState({
    courseName: '',
    day: '',
    hour: '',
    room: '',
    section: '',
  });
  

//UseEffect para verificar si hay algún usuario autenticado.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Usuario autenticado:', user.uid);
       
      } else {
        console.log('No hay usuario autenticado');
      }
    });

    // Para detener la escucha de cambios de autenticación cuando el componente se desmonta
    return () => {
      unsubscribe();
    };
  }, []);

  //UseEffect para leer la data del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const userDocRef = doc(firestoreDB, 'users', userId);
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const userDataFromFirestore = userDoc.data();
            if (userDataFromFirestore) {
              setUserData(userDataFromFirestore);
              sessionStorage.setItem('userData', JSON.stringify(userDataFromFirestore));
            } else {
              console.log('El documento está vacío');
            }
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
    if (storedUserData) {
      setUserData(storedUserData);
    } else {
      fetchUserData();
    }

    return () => {
      sessionStorage.removeItem('userData');
    };
  }, [firestoreDB]);

 useEffect(() => {
  if (userData) {
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }
}, [userData]);

// Recuperar datos de userData desde sessionStorage al cargar el componente
useEffect(() => {
  const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
  if (storedUserData) {
    setUserData(storedUserData);
  }
}, []);

  //logica para editar la información del usuario
  const handleUserEditClick = () => {
    setUserEditMode(true); // Cambiar al modo de edición al hacer clic en el botón "Edit"
  };

  const handleCancelClick = () => {
    setUserEditMode(false); 
    setCourseEditMode(false);
    setCourseAddMode(false);
  };

  const handleUserSaveClick = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userDocRef = doc(firestoreDB, 'users', userId);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
  
          // Actualizar el documento en Firestore con los nuevos datos editados
          await updateDoc(userDocRef, {
            name: userData.name,
            email: userData.email,
            studentNumber: userData.studentNumber,
            department: userData.department,
            association: userData.association,
          });
  
          setUserEditMode(false); // Salir del modo de edición después de guardar
        }
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };
 
  const handleCourseAddClick = () => {
    setCourseAddMode(true); // Cambiar al modo de edición al hacer clic en el botón "Edit"
  };
  
  const handleCourseSaveClick = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
  
        const coursesRef = collection(firestoreDB, 'courses');
        const newCourseData = {
          courseName: newCourse.courseName,
          day: newCourse.day,
          hour: newCourse.hour,
          room: newCourse.room,
          section: newCourse.section,
          userId: userId,
        };
  
        const newCourseDocRef = await addDoc(coursesRef, newCourseData); // Obtener referencia al nuevo documento
  
        const newCourseWithId = { ...newCourseData, courseId: newCourseDocRef.id }; // Agregar courseId al objeto del curso
        setCourses([...courses, newCourseWithId]); // Actualizar el estado local con el nuevo curso
  
        setNewCourse({
          courseName: '',
          day: '',
          hour: '',
          room: '',
          section: '',
        });
  
        setCourseAddMode(false); // Salir del modo de edición después de guardar
      }
    } catch (error) {
      console.error('Error saving course data:', error);
    }
  };
  

  const handleCourseUpdateClick = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser && selectedCourse && selectedCourse.courseId) {
        const courseId = selectedCourse.courseId;
        const courseDocRef = doc(firestoreDB, 'courses', courseId);
        const courseDoc = await getDoc(courseDocRef);
  
        if (courseDoc.exists()) {
          // Usar el objeto selectedCourse actualizado para actualizar los campos en Firebase
          await updateDoc(courseDocRef, {
            courseName: selectedCourse.courseName,
            day: selectedCourse.day,
            hour: selectedCourse.hour,
            room: selectedCourse.room,
            section: selectedCourse.section,
          });
  
          // Obtener el ID del usuario actual
          const userId = currentUser.uid;
  
          // Obtener los cursos actualizados después de la edición desde Firebase
          const updatedCoursesRef = collection(firestoreDB, 'courses');
          const updatedQuery = query(updatedCoursesRef, where('userId', '==', userId));
          const updatedQuerySnapshot = await getDocs(updatedQuery);
  
          const updatedCoursesData = [];
          updatedQuerySnapshot.forEach((doc) => {
            const courseData = doc.data();
            const courseWithId = { ...courseData, courseId: doc.id };
            updatedCoursesData.push(courseWithId);
          });
  
          setCourses(updatedCoursesData); // Actualizar el estado local con los cursos actualizados
  
          setCourseEditMode(false); // Salir del modo de edición después de guardar
          setSelectedCourse(null); // Limpiar el curso seleccionado
        } else {
          console.log('Course document does not exist');
        }
      }
    } catch (error) {
      console.error('Error updating course data:', error);
    }
  };
  
  const handleCourseDeleteClick = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser && selectedCourse && selectedCourse.courseId) {
        const courseId = selectedCourse.courseId;
        const courseDocRef = doc(firestoreDB, 'courses', courseId);
        const courseDoc = await getDoc(courseDocRef);
  
        if (courseDoc.exists()) {
          // Eliminar el curso de Firestore
          await deleteDoc(courseDocRef);
  
          // Actualizar el estado local excluyendo el curso eliminado
          const updatedCourses = courses.filter(course => course.courseId !== selectedCourse.courseId);
          setCourses(updatedCourses);

          sessionStorage.removeItem('courses');
  
          // Actualizar el curso seleccionado para reflejar que ya no existe
          setSelectedCourse(null);
          setCourseEditMode(false); // Salir del modo de edición después de eliminar
        } else {
          console.log('Course document does not exist');
        }
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  
  const handleCourseSelect = (course) => {
    if (course.courseId) {
      setSelectedCourse(course); // Establecer el curso seleccionado para la edición
      setCourseEditMode(true); // Cambiar al modo de edición al seleccionar un curso
    } else {
      console.error('El curso seleccionado no tiene un ID válido.');
    }
  };
  
  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const coursesRef = collection(firestoreDB, 'courses');
          const q = query(coursesRef, where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          
          const coursesData = [];
          
          querySnapshot.forEach((doc) => {
            const courseData = doc.data();
            const courseWithId = { ...courseData, courseId: doc.id }; // Asignar doc.id como courseId
            coursesData.push(courseWithId);
            
          });
          
          if (coursesData.length === 0) {
            // Si no hay cursos, actualiza el estado local con una lista vacía
            setCourses([]);
          } else {
            setCourses(coursesData);
            sessionStorage.setItem('courses', JSON.stringify(coursesData));
          }
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
  
    const storedCourses = JSON.parse(sessionStorage.getItem('courses'));
    if (storedCourses) {
      setCourses(storedCourses);
    } else {
      fetchCourses();
    }
  }, [firestoreDB]);
  

  // Guardar datos de courses en sessionStorage cuando cambien
useEffect(() => {
  if (courses.length > 0) {
    sessionStorage.setItem('courses', JSON.stringify(courses));
  }
}, [courses]);

// Recuperar datos de courses desde sessionStorage al cargar el componente
useEffect(() => {
  const storedCourses = JSON.parse(sessionStorage.getItem('courses'));
  if (storedCourses) {
    setCourses(storedCourses);
  }
}, []);

  
  
  

  const departmentOptions = [
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
<div className="Account-full">

<h1>Account</h1>

{/*info box profile*/}

<div className='bubble-profile'>{/*caja blanca*/}
<Link className='bubble-top-button' to="/account" onClick={handleUserEditClick} >Edit</Link> {/*boton en borde*/}
<div className='bubble-top'>{/*borde amarillo*/}
<div className='bubble-top-text'> {/*titulo en borde*/}
   Profile
</div>
</div>


{userData && (
         <div className="user">
         {/* Campos editables */}
         <div className="Account-info-text">
           <p className='Account-info-title'>Name</p>
           {userEditMode ? (
             <input className="text-box"
               type="text"
               value={userData.name}
               onChange={(e) => setUserData({ ...userData, name: e.target.value })}
             />
           ) : (
             <p>{userData.name}</p>
           )}
         </div>

         <div className="Account-info-text">
           <p className='Account-info-title'>Email</p>
             <p>{userData.email}</p>
         </div>

         <div className="Account-info-text">
         <p className='Account-info-title'>Student Num.</p>
  {userEditMode ? (
    <input
      className="text-box"
      type="text"
      value={userData.studentNumber}
      onChange={(e) => {
        const input = e.target.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
        if (input.length <= 9) { // Limitar a 9 caracteres
          let formattedInput = input;
          if (input.length > 5) {
            formattedInput =
              input.slice(0, 3) + '-' + input.slice(3, 5) + '-' + input.slice(5, 9);
          } else if (input.length > 3) {
            formattedInput = input.slice(0, 3) + '-' + input.slice(3, 5);
          }
          setUserData({ ...userData, studentNumber: formattedInput });
        }
      }}
      maxLength={12} // Restringir la longitud máxima a 12 caracteres (con guiones)
    />
  ) : (
    <p>{userData.studentNumber}</p>
  )}
</div>
         
         <div className="Account-info-text">
      <p className='Account-info-title'>Department</p>
      {userEditMode ? (
        <select className="select-box"
          value={userData.department}
          onChange={(e) => setUserData({ ...userData, department: e.target.value })}
        >
          {departmentOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <p>{userData.department}</p>
      )}
    </div>
    <div className="Account-info-text">
      <p className='Account-info-title'>Association</p>
      {userEditMode ? (
        <select className="select-box"
          value={userData.association}
          onChange={(e) => setUserData({ ...userData, association: e.target.value })}
        >
          {AssociationOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <p>{userData.association}</p>
      )}
    </div>

     {/* Botón de guardar visible solo en el modo de edición */}
     {userEditMode && (
          <button className="edit-btns" onClick={handleCancelClick}>Cancel</button>
        )}

        {/* Botón de guardar visible solo en el modo de edición */}
        {userEditMode && (
          <button className="edit-btns" onClick={handleUserSaveClick}>Save</button>
        )}

        
      </div>
    )}
</div>

{/*info box*/}

{/*info box cursos*/}

<div className='bubble-My-Courses'>
  <Link  className='bubble-top-button' to="/account" onClick={handleCourseAddClick} >Add</Link>
  <div className='bubble-top'>
    <div className='bubble-top-text'>
      My Courses
    </div>
  </div>
  
  {!courseAddMode && !courseEditMode && (
  <>
    {courses.map((course, index) => (
      <p key={index} className="Account-info-text-course" onClick={() => handleCourseSelect(course)}>
        {`${course.courseName} ${course.section} ${course.day} ${course.hour}`}
      </p>
    ))}
  </>
)}


  {courseAddMode && (
    <div>
      <div className="Account-info-text">
        <p className='Account-info-title'>Course Name</p>
        <input
          placeholder='Ex: COUR 3001'
          className="text-box"
          type="text"
          value={newCourse.courseName}
          onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
        />
      </div>

      <div className="Account-info-text">
        <p className='Account-info-title'>Section</p>
        <input
          placeholder='Ex: L10'
          className="text-box"
          type="text"
          value={newCourse.section}
          onChange={(e) => setNewCourse({ ...newCourse, section: e.target.value })}
        />
      </div>

      <div className="Account-info-text">
        <p className='Account-info-title'>Day(s)</p>
        <input
          placeholder='Ex: LW'
          className="text-box"
          type="text"
          value={newCourse.day}
          onChange={(e) => setNewCourse({ ...newCourse, day: e.target.value })}
        />
      </div>
      
      <div className="Account-info-text">
        <p className='Account-info-title'>Hour</p>
        <input
          placeholder='Ex: 1:00pm-2:30pm'
          className="text-box"
          type="text"
          value={newCourse.hour}
          onChange={(e) => setNewCourse({ ...newCourse, hour: e.target.value })}
        />
      </div>

      <div className="Account-info-text">
        <p className='Account-info-title'>Location</p>
        <input
          placeholder='Ex: AC 102'
          className="text-box"
          type="text"
          value={newCourse.room}
          onChange={(e) => setNewCourse({ ...newCourse, room: e.target.value })}
        />
        
      </div>
        
     
          <button className="edit-btns" onClick={handleCancelClick}>Cancel</button>
       
      
      <button className="edit-btns" onClick={handleCourseSaveClick}>Save</button>
    </div>
  )}
  {courseEditMode && selectedCourse && (
    <div>
      <div className="Account-info-text">
        <p className='Account-info-title'>Course Name</p>
        <input
          className="text-box"
          type="text"
          value={selectedCourse.courseName}
          onChange={(e) => setSelectedCourse({ ...selectedCourse, courseName: e.target.value })}
        />
      </div>

      <div className="Account-info-text">
        <p className='Account-info-title'>Section</p>
        <input
          className="text-box"
          type="text"
          value={selectedCourse.section}
          onChange={(e) => setSelectedCourse({ ...selectedCourse, section: e.target.value })}
        />
      </div>

      <div className="Account-info-text">
        <p className='Account-info-title'>Day(s)</p>
        <input
          className="text-box"
          type="text"
          value={selectedCourse.day}
          onChange={(e) => setSelectedCourse({ ...selectedCourse, day: e.target.value })}
        />
      </div>
      
      <div className="Account-info-text">
        <p className='Account-info-title'>Hour</p>
        <input
          className="text-box"
          type="text"
          value={selectedCourse.hour}
          onChange={(e) => setSelectedCourse({ ...selectedCourse, hour: e.target.value })}
        />
      </div>

      <div className="Account-info-text">
        <p className='Account-info-title'>Location</p>
        <input
          className="text-box"
          type="text"
          value={selectedCourse.room}
          onChange={(e) => setSelectedCourse({ ...selectedCourse, room: e.target.value })}
        />
      </div>
      
      {/* Botón de guardar visible solo en el modo de edición */}
      <button className="edit-btns" onClick={handleCancelClick}>Cancel</button>
      <button className="edit-btns" onClick={handleCourseDeleteClick}>Delete</button>
      <button className="edit-btns" onClick={handleCourseUpdateClick}>Save</button>
      
    </div>
  )}

  
</div>


{/*info box*/}



    </div>
   );
 }
 
 
 export default Account;