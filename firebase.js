// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, update, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// KONFIGURASI FIREBASE KAMU (GANTI SAMA DATA DI FIREBASE CONSOLE)
const firebaseConfig = {
  apiKey: "ISI_DENGAN_API_KEY_KAMU",
  authDomain: "dashboard-whiterose.firebaseapp.com",
  databaseURL: "https://dashboard-whiterose-default-rtdb.firebaseio.com",
  projectId: "dashboard-whiterose",
  storageBucket: "dashboard-whiterose.appspot.com",
  messagingSenderId: "ISI_DENGAN_SENDER_ID_KAMU",
  appId: "ISI_DENGAN_APP_ID_KAMU"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Export fungsi agar bisa dipakai di file lain
export { db, ref, get, update, set };