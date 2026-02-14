// Import dari firebase.js
import { db, ref, get, update, set } from './firebase.js';

// Variabel Global
const tabelKaryawan = document.getElementById('tabel-karyawan');
const formEdit = document.getElementById('form-edit');
const overlay = document.getElementById('overlay');
let idKaryawanAktif = "";

// ======================
// 1. TAMPILKAN SEMUA KARYAWAN
// ======================
async function tampilkanKaryawan() {
  tabelKaryawan.innerHTML = `
    <tr>
      <th>NAMA KARYAWAN</th>
      <th>POSISI</th>
      <th>OMSET BULAN INI</th>
      <th>GAJI SAAT INI</th>
      <th>ACTION</th>
    </tr>
  `;

  const refKaryawan = ref(db, "Karyawan");
  const snapshot = await get(refKaryawan);

  if (snapshot.exists()) {
    const dataKaryawan = snapshot.val();
    for (let id in dataKaryawan) {
      const karyawan = dataKaryawan[id];
      
      // Hitung gaji otomatis (bisa disesuaikan rumusnya)
      // Contoh rumus: Gaji = 10% dari omset (bisa kamu ganti sesuai kebijakan)
      const omsetAngka = parseInt(karyawan.omset.replace(/[^0-9]/g, ''));
      const gajiHitung = omsetAngka * 0.10;
      const gajiFormat = `Rp ${gajiHitung.toLocaleString('id-ID')}`;

      const baris = document.createElement('tr');
      baris.innerHTML = `
        <td>${karyawan.nama}</td>
        <td>${karyawan.posisi}</td>
        <td>${karyawan.omset}</td>
        <td>${gajiFormat}</td>
        <td><button class="btn-edit" onclick="bukaFormEdit('${id}')">EDIT DATA</button></td>
      `;
      tabelKaryawan.appendChild(baris);
    }
  } else {
    tabelKaryawan.innerHTML += `<tr><td colspan="5" style="text-align:center; color:#ff69b4;">Belum ada data karyawan</td></tr>`;
  }
}

// ======================
// 2. BUKA FORM EDIT
// ======================
window.bukaFormEdit = async function(id) {
  idKaryawanAktif = id;
  const refData = ref(db, `Karyawan/${id}`);
  const snapshot = await get(refData);

  if (snapshot.exists()) {
    const karyawan = snapshot.val();
    document.getElementById('edit-nama').value = karyawan.nama;
    document.getElementById('edit-posisi').value = karyawan.posisi;
    document.getElementById('edit-omset').value = karyawan.omset;
    
    // Tampilkan form dan overlay
    formEdit.style.display = "block";
    overlay.style.display = "block";
  }
}

// ======================
// 3. SIMPAN PERUBAHAN DATA
// ======================
window.simpanPerubahan = async function() {
  const namaBaru = document.getElementById('edit-nama').value;
  const posisiBaru = document.getElementById('edit-posisi').value;
  const omsetBaru = document.getElementById('edit-omset').value;

  // Validasi input
  if (!namaBaru || !omsetBaru) {
    alert("Nama dan Omset tidak boleh kosong!");
    return;
  }

  const dataBaru = {
    nama: namaBaru,
    posisi: posisiBaru,
    omset: omsetBaru
  };

  const refUpdate = ref(db, `Karyawan/${idKaryawanAktif}`);
  await update(refUpdate, dataBaru);
  
  alert("Data berhasil diupdate! Gaji akan otomatis dihitung berdasarkan omset.");
  tutupFormEdit();
  tampilkanKaryawan();
}

// ======================
// 4. TUTUP FORM EDIT
// ======================
window.tutupFormEdit = function() {
  formEdit.style.display = "none";
  overlay.style.display = "none";
}

// ======================
// 5. TAMBAH KARYAWAN BARU
// ======================
window.tambahKaryawanBaru = async function() {
  const nama = prompt("Masukkan Nama Karyawan Baru:");
  const posisi = prompt("Masukkan Posisi Karyawan:");
  
  if (!nama || !posisi) {
    alert("Nama dan Posisi harus diisi!");
    return;
  }

  // Buat ID unik untuk karyawan baru
  const idBaru = "karyawan_" + Date.now();
  const dataBaru = {
    nama: nama,
    posisi: posisi,
    omset: "Rp 0"
  };

  const refTambah = ref(db, `Karyawan/${idBaru}`);
  await set(refTambah, dataBaru);
  
  alert("Karyawan baru berhasil ditambahkan!");
  tampilkanKaryawan();
}

// ======================
// JALANKAN PROGRAM SAAT WEBSITE DIBUKA
// ======================
tampilkanKaryawan();