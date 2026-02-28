// ==========================================
// PENGATURAN UTAMA (Silakan ganti bagian ini)
// ==========================================
const username = 'ClovisReyes';
const repo = 'Testimoni';
const baseFolder = 'Testi'; // Nama folder utama Anda di GitHub

// ==========================================
// LOGIKA WEBSITE & SIDEBAR
// ==========================================
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-btn');

toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('hidden');
});

async function loadPhotos(folderName, element) {
    if(element) {
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
        if (window.innerWidth <= 768) {
            sidebar.classList.add('hidden');
        }
    }

    document.getElementById('folder-name').innerText = folderName;
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '<p style="padding:20px;">Memuat data dari GitHub...</p>';

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
                
                // SISTEM CAPTION MULTI-BARIS (UPDATE TERBARU)
                const nameParts = file.name.split('_');
                
                // 1. Ganti strip (-) jadi spasi
                let caption = nameParts[0].replace(/-/g, ' '); 
                
                // 2. Ganti tilde (~) jadi Enter (<br>)
                caption = caption.replace(/~/g, '<br>'); 
                
                const date = nameParts[1] ? nameParts[1].split('.')[0] : 'Tanggal tidak ada';

                card.innerHTML = `
                    <img src="${file.download_url}" loading="lazy" onclick="openModal(this.src)">
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

// ==========================================
// FUNGSI POPUP GAMBAR (LAYAR PENUH)
// ==========================================
function openModal(imageSrc) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    modalImg.src = imageSrc;
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('image-modal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    loadPhotos('Fish It!', document.querySelector('.chat-item.active'));
});

const mainContent = document.querySelector('.main-content');

// Fungsi untuk toggle sidebar
toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation(); // Mencegah trigger klik ke mainContent
    sidebar.classList.toggle('hidden');
    if (window.innerWidth <= 768) {
        mainContent.classList.toggle('sidebar-open');
    }
});
const mainContent = document.querySelector('.main-content');
const toggleBtn = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

// 1. Fungsi Klik Tombol Menu
toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Mencegah klik tembus ke mainContent
    sidebar.classList.toggle('hidden');
    if (window.innerWidth <= 768) {
        mainContent.classList.toggle('sidebar-active');
    }
});

// 2. Fungsi Klik Luar (Area Konten) untuk Tutup Sidebar
mainContent.addEventListener('click', () => {
    if (window.innerWidth <= 768 && !sidebar.classList.contains('hidden')) {
        sidebar.classList.add('hidden');
        mainContent.classList.remove('sidebar-active');
    }
});

// Pastikan saat pilih menu di sidebar, sidebar juga tertutup di HP
function loadPhotos(folderName, element) {
    // ... kode loadPhotos Anda yang sudah ada ...
    
    if (window.innerWidth <= 768) {
        sidebar.classList.add('hidden');
        mainContent.classList.remove('sidebar-active');
    }
}
// ==========================================
// KEAMANAN (ANTI KLIK KANAN & ANTI INSPECT)
// ==========================================
document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function(e) {
    if(e.keyCode == 123) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) return false;
}
