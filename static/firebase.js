// Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfMf7Pboae9Afanzs8gsxEHAEbp-vIvkU",
  authDomain: "cloudvault-fbf1c.firebaseapp.com",
  projectId: "cloudvault-fbf1c",
  storageBucket: "cloudvault-fbf1c.firebasestorage.app",
  messagingSenderId: "44465898140",
  appId: "1:44465898140:web:814c7a1a8160f42fc0a359"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Gmail Validation Function
function isValidGmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}

// ================= REGISTER =================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!isValidGmail(email)) {
            alert("Please enter a valid Gmail address.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {

            await createUserWithEmailAndPassword(auth, email, password);

            alert("Registration Successful!");

            window.location.href = "/dashboard";

        }

        catch (error) {

            switch (error.code) {

                case "auth/email-already-in-use":
                    alert("This Gmail is already registered.");
                    break;

                case "auth/weak-password":
                    alert("Password should be at least 6 characters.");
                    break;

                case "auth/invalid-email":
                    alert("Invalid Gmail address.");
                    break;

                default:
                    alert(error.message);

            }

        }

    });

}

// ================= LOGIN =================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!isValidGmail(email)) {
            alert("Please enter a valid Gmail address.");
            return;
        }

        try {

            await signInWithEmailAndPassword(auth, email, password);

            alert("Login Successful!");

            window.location.href = "/dashboard";

        }

        catch (error) {

            switch (error.code) {

                case "auth/invalid-credential":
                    alert("Invalid Gmail or Password.");
                    break;

                case "auth/user-not-found":
                    alert("No account found with this Gmail.");
                    break;

                case "auth/wrong-password":
                    alert("Incorrect password.");
                    break;

                case "auth/invalid-email":
                    alert("Invalid Gmail address.");
                    break;

                default:
                    alert(error.message);

            }

        }

    });

}

// ================= SHOW USER =================

onAuthStateChanged(auth, (user) => {

    const emailText = document.getElementById("userEmail");

    if (user && emailText) {

        emailText.innerHTML = "Logged in as : " + user.email;

    }

});

// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            alert("Logged Out Successfully!");

            window.location.href = "/login";

        }

        catch (error) {

            alert(error.message);

        }

    });

}