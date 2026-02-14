// Inisialisasi variabel global
let dataStaf = [];
const dbRef = firebase.database().ref('data-staf'); // Referensi ke Firebase

// CEK LOGIN
function cekLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Data akun login
    const akunLogin = [
        { username: "CEO", password: "whiterose123", role: "ceo" },
        { username: "BLACKPINK", password: "12345", role: "staf" }
    ];

    const akun = akunLogin.find(a => a.username === user && a.password === pass);
    if (!akun) {
        alert("Username/Password Salah!");
        return;
    }

    // Sembunyikan form login, tampilkan dashboard
    document.querySelector('.login-box').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    // Ambil data dari Firebase dan tampilkan
    bacaDataDariFirebase(akun.role);
}

// BACA DATA DARI FIREBASE
function bacaDataDariFirebase(role) {
    dbRef.on('value', function(snapshot) {
        dataStaf = [];
        const data = snapshot.val();
        
        // Jika data ada di Firebase
        if (data) {
            Object.keys(data).forEach(key => {
                dataStaf.push({
                    id: key,
                    nama: data[key].nama,
                    posisi: data[key].posisi,
                    omset: data[key].omset,
                    gaji: data[key].gaji
                });
            });
        } 
        // Jika belum ada data, buat data awal
        else {
            dataStaf = [
                { id: "1", nama: "Dea", posisi: "Team Creative", omset: "Rp 250.000.000", gaji: "Rp 50.000.000" },
                { id: "2", nama: "Budi Santoso", posisi: "Marketing Executive", omset: "Rp 180.000.000", gaji: "Rp 35.000.000" },
                { id: "3", nama: "Rina Wijaya", posisi: "Senior Marketing", omset: "Rp 300.000.000", gaji: "Rp 60.000.000" }
            ];
            // Simpan data awal ke Firebase
            simpanSemuaDataKeFirebase();
        }

        // Tampilkan data ke tabel
        tampilkanData(role);
    });
}

// TAMPILKAN DATA KE TABEL
function tampilkanData(role) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    dataStaf.forEach(s => {
        let action = '-';
        if (role === 'ceo') {
            action = `<button class="btn-edit" onclick="bukaEdit('${s.id}')">EDIT</button>`;
        }

        tbody.innerHTML += `
            <tr>
                <td>${s.nama}</td>
                <td>${s.posisi}</td>
                <td>${s.omset}</td>
                <td>${s.gaji}</td>
                <td>${action}</td>
            </tr>
        `;
    });
}

// BUKA FORM EDIT
function bukaEdit(id) {
    const staf = dataStaf.find(s => s.id === id);
    document.getElementById('edit-id').value = staf.id;
    document.getElementById('edit-nama').value = staf.nama;
    document.getElementById('edit-posisi').value = staf.posisi;
    document.getElementById('edit-omset').value = staf.omset;
    document.getElementById('edit-gaji').value = staf.gaji;
    document.getElementById('edit-form').style.display = 'block';
}

// SIMPAN EDIT KE FIREBASE
function simpanEdit() {
    const id = document.getElementById('edit-id').value;
    const stafBaru = {
        nama: document.getElementById('edit-nama').value,
        posisi: document.getElementById('edit-posisi').value,
        omset: document.getElementById('edit-omset').value,
        gaji: document.getElementById('edit-gaji').value
    };

    dbRef.child(id).set(stafBaru)
        .then(() => {
            alert("Data Berhasil Disimpan Secara Permanen!");
            document.getElementById('edit-form').style.display = 'none';
            bacaDataDariFirebase('ceo'); // Atau 'staf' sesuai peran
        })
        .catch((error) => {
            alert("Gagal menyimpan data: " + error.message);
        });
}

// SIMPAN SEMUA DATA AWAL KE FIREBASE
function simpanSemuaDataKeFirebase() {
    dataStaf.forEach(staf => {
        dbRef.child(staf.id).set(staf);
    });
}

// TUTUP FORM EDIT
function tutupForm() {
    document.getElementById('edit-form').style.display = 'none';
}

// JALANKAN FUNGSI SAAT WEBSITE DIBUKA
window.onload = function() {
    console.log("Sistem siap, tunggu koneksi Firebase...");
};
