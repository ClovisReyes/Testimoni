// ==========================================
// PENGATURAN UTAMA (Silakan ganti bagian ini)
// ==========================================
const username = 'ClovisReyes';
const repo = 'Testimoni';
const baseFolder = 'Testi'; // Nama folder utama Anda di GitHub

// ==========================================
// MESIN OTOMATIS (Tidak perlu diedit)
// ==========================================
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-btn');

// Fungsi Buka Tutup Sidebar
toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('hidden');
});

// Fungsi Memuat Foto Otomatis
async function loadPhotos(folderName, element) {
    // Efek ganti warna pada tab yang dipilih
    if(element) {
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
        
        // Otomatis tutup sidebar di mode HP setelah klik menu
        if (window.innerWidth <= 768) {
            sidebar.classList.add('hidden');
        }
    }

    document.getElementById('folder-name').innerText = folderName;
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '<p style="padding:20px;">Memuat data dari GitHub...</p>';

    // Memanggil API GitHub menggunakan variabel baseFolder dan folderName
    const url = `https://api.github.com/repos/${username}/${repo}/contents/${baseFolder}/${folderName}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Folder belum dibuat');
        const files = await response.json();
        gallery.innerHTML = '';

        files.forEach(file => {
            if (file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
                const card = document.createElement('div');
                card.className = 'card';
                
                // Sistem Caption Otomatis dari Nama File
                const nameParts = file.name.split('_');
                const caption = nameParts[0].replace(/-/g, ' ');
                const date = nameParts[1] ? nameParts[1].split('.')[0] : 'Tanggal tidak ada';

                // Klik gambar untuk buka di tab baru
                card.innerHTML = `
                    <img src="${file.download_url}" loading="lazy" onclick="window.open(this.src, '_blank')">
                    <div class="info">
                        <b>${caption}</b>
                        <span class="date">📅 Posted: ${date}</span>
                    </div>
                `;
                gallery.appendChild(card);
            }
        });
    } catch (e) { 
        gallery.innerHTML = `<p style="padding:20px; color:#ff6b6b;">Folder "${baseFolder}/${folderName}" kosong atau belum Anda buat di GitHub.</p>`; 
    }
}

// Menjalankan fungsi klik pertama kali secara otomatis saat website dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadPhotos('Fish It!', document.querySelector('.chat-item.active'));
});
