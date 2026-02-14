// INISIALISASI
let currentUser = null;
const db = firebase.database().ref('staffData');

// LOGIN
function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // DATA AKUN
    const accounts = [
        { username: "CEO", password: "whiterose123", role: "admin" },
        { username: "BLACKPINK", password: "bp123", role: "staff" }
    ];

    const found = accounts.find(acc => acc.username === user && acc.password === pass);
    if (found) {
        currentUser = found;
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        loadData();
    } else {
        alert("Username/Password SALAH!");
    }
}

// AMBIL DATA DARI FIREBASE
function loadData() {
    db.on('value', snapshot => {
        const data = snapshot.val();
        const table = document.getElementById('staffData');
        table.innerHTML = '';

        if (data) {
            Object.keys(data).forEach(key => {
                const staff = data[key];
                table.innerHTML += `
                    <tr>
                        <td>${staff.name}</td>
                        <td>${staff.position}</td>
                        <td>${staff.omset}</td>
                        <td>${staff.salary}</td>
                        <td><button class="edit-btn" onclick="openEdit('${key}')">EDIT</button></td>
                    </tr>
                `;
            });
        }
    });
}

// FORM EDIT
let editKey = null;
function openEdit(key) {
    editKey = key;
    db.child(key).once('value', snapshot => {
        const staff = snapshot.val();
        document.getElementById('editName').value = staff.name;
        document.getElementById('editPosition').value = staff.position;
        document.getElementById('editOmset').value = staff.omset;
        document.getElementById('editSalary').value = staff.salary;
        document.getElementById('editForm').style.display = 'block';
    });
}

// SIMPAN EDIT KE FIREBASE
function saveEdit() {
    const data = {
        name: document.getElementById('editName').value,
        position: document.getElementById('editPosition').value,
        omset: document.getElementById('editOmset').value,
        salary: document.getElementById('editSalary').value
    };
    db.child(editKey).update(data);
    document.getElementById('editForm').style.display = 'none';
    alert("DATA BERHASIL DISIMPAN PERMANEN!");
}

function closeEditForm() {
    document.getElementById('editForm').style.display = 'none';
}

// LOAD DATA SAAT DASHBOARD BUKA
function loadData() {
    loadData();
}
