import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  where,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWp5otOhMP-waHYc3gGsttwd2K3Dql6P8",
  authDomain: "event-management-app-7322b.firebaseapp.com",
  projectId: "event-management-app-7322b",
  storageBucket: "event-management-app-7322b.appspot.com",
  messagingSenderId: "941526771959",
  appId: "1:941526771959:web:481232381d5dd4d7d58bf2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const colRef = collection(db, "users");
const storage = getStorage(app);

const signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const target = e.target;
  const fullName = target.fullname.value;
  const email = target.email.value;
  const password = target.password.value;
  const signUpBtn = target.signUpBtn;

  if (!fullName || !email || !password) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: "Please fill all the fields",
    });
    return;
  }

  try {
    signUpBtn.value = "Signing Up...";

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await addDoc(colRef, {
      fullName,
      email,
      password,
      uid: userCredential.user.uid,
    });

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Welcome ${fullName}!`,
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      window.location = "dashboard.html";
    });
  } catch (error) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: error.message,
      showConfirmButton: false,
      timer: 2500,
    });
  } finally {
    signUpBtn.value = "Sign Up";
  }
});

const loginForm = document.getElementById("signInForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const target = e.target;
  const email = target.siemail.value;
  const password = target.sipassword.value;
  const loginBtn = target.signInBtn;

  if (!email || !password) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: "Please fill all the fields",
    });
    return;
  }

  try {
    loginBtn.value = "Signing In...";

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const currentUser = await getLoggedInUser(userCredential.user.uid);

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Welcome back ${currentUser.fullName}!`,
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      window.location = "dashboard.html";
    });
  } catch (error) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: error.message,
      showConfirmButton: false,
      timer: 2500,
    });
  } finally {
    loginBtn.value = "Sign In";
  }
});

// Function to get logged-in user data
const getLoggedInUser = async (id) => {
  try {
    const q = query(colRef, where("uid", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();
      console.log("User found: ", user);
      return user;
    } else {
      console.log("No user found");
      return null;
    }
  } catch (error) {
    console.log("Error fetching user: ", error);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in");
  } else {
    console.log("User is signed out");
  }
});
