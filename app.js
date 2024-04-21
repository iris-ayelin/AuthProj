  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
  import { getFirestore, collection, setDoc, getDocs, doc, deleteDoc} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';

  const firebaseConfig = {
    apiKey: "AIzaSyCiMtYjZ37V5OXPTiX3IxkxCHcdZBOXMKw",
    authDomain: "auth-proj-64f1a.firebaseapp.com",
    projectId: "auth-proj-64f1a",
    storageBucket: "auth-proj-64f1a.appspot.com",
    messagingSenderId: "146128400032",
    appId: "1:146128400032:web:3c18bcbb362d6aaaf363c5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const fetchUsers = async () => {
  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(usersRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const displayUsers = async () => {
  const users = await fetchUsers();
  const userTableData = document.getElementById("userTable");
  userTableData.innerHTML = '';

  users.forEach(user => {
    const row = document.createElement('tr');
    //row.id = user.uid;

    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
      <button onclick="deleteUser('${user.uid}')">Delete</button>
      </td>
    `;

    userTableData.appendChild(row);
  });
}

// Function to handle user deletion
 const deleteUser = async (userId) => {
   try {
    // Delete user from Firestore
  
      await deleteDoc(doc(db, "users", userId));
      // Remove the row from the table
      const row = document.getElementById(userId);
    
      row.remove();
 //     alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user: ", error);
      alert("Error deleting user");
   }
  }


document.addEventListener('DOMContentLoaded', () => {
  displayUsers();
});



const signUp = async () => {
    const signUpEmail = document.getElementById("email").value;
    const signUpPassword = document.getElementById("password").value;
    const name = document.getElementById("name").value;

    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      const user = userCredential.user;
      console.log(user);
      alert("User created successfully");

      
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        uid: user.uid, 
        email: signUpEmail,
        password:signUpPassword,
      });

    } catch (error) {
       const errorCode = error.code;
       const errorMessage = error.message;
       console.log(errorCode, errorMessage);
      alert(error);
    }
  }

// Function to handle user sign in
const signIn = async () => {
  const signInEmail = document.getElementById("email").value;
    const signInPassword = document.getElementById("password").value;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
      const user = userCredential.user;
      console.log(user);
      alert("User signed in successfully");
      // Redirect to signIn.html
      window.location.href = 'signIn.html';
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      alert(errorMessage);
    }
  }


document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const signUpBtn = document.getElementById("signUpBtn");
  const signInBtn = document.getElementById("signInBtn");
  const homeButton = document.getElementById("homeButton");

  // Add event listeners
  if (signUpBtn) {
    signUpBtn.addEventListener('click', signUp);
  }
  if (signInBtn) {
    signInBtn.addEventListener('click', signIn);
  }
  if (homeButton) {
    homeButton.addEventListener('click', function() {
      // Redirect to the home page
      window.location.href = 'home.html';
    });
  }
});

