// ==========================================
// PENGATURAN UTAMA
// ==========================================
const username = 'ClovisReyes';
const repo = 'Testimoni';
const baseFolder = 'Testi'; 

// ==========================================
// LOGIKA WEBSITE & SIDEBAR
// ==========================================
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-btn');
const mainContent = document.querySelector('.main-content');

// Fungsi Tombol Menu
toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation(); // Mencegah klik tembus
    sidebar.classList.toggle('hidden');
    if (window.innerWidth <= 768) {
        mainContent.classList.toggle('sidebar-active');
    }
});

// Klik layar gelap di HP untuk menutup sidebar
mainContent.addEventListener('click', function() {
    if (window.innerWidth <= 768 && !sidebar.classList.contains('hidden')) {
        sidebar.classList.add('hidden');
        mainContent.classList.remove('sidebar-active');
    }
});

// Fungsi memuat gambar 
async function loadPhotos(folderName, element) {
    // Styling menu aktif
    if(element) {
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
        
        // Tutup otomatis sidebar di HP setelah diklik
        if (window.innerWidth <= 768) {
            sidebar.classList.add('hidden');
            mainContent.classList.remove('sidebar-active');
        }
    }

    const folderTitle = document.getElementById('folder-name');
    folderTitle.innerText = `${folderName} (Menghitung...)`;
    
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '<p style="padding:20px;">Memuat data dari GitHub...</p>';

    const url = `https://api.github.com/repos/${username}/${repo}/contents/${baseFolder}/${folderName}`;
    
    try {
        const response = await fetch(url);
        
        if (response.status === 403) throw new Error('Limit_API');
        if (!response.ok) throw new Error('Not_Found');

        const files = await response.json();
        gallery.innerHTML = '';
        
        // HITUNG OTOMATIS: Memisahkan file gambar dan menghitung jumlahnya
        const images = files.filter(file => file.name.match(/\.(jpg|jpeg|png|webp)$/i));
        const totalTesti = images.length;
        
        // Munculkan jumlah HANYA di Header Atas
        folderTitle.innerText = `${folderName} - ${totalTesti} Testimoni`;

        // Jika foldernya kosong / tidak ada gambar
        if (totalTesti === 0) {
            gallery.innerHTML = `<p style="padding:20px;">Tidak ada gambar di folder ini.</p>`;
            return;
        }

        // Tampilkan semua gambar
        images.forEach(file => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // SISTEM CAPTION
            const fileNameTanpaExt = file.name.replace(/\.[^/.]+$/, ""); // Buang .jpg
            const nameParts = fileNameTanpaExt.split('_');
            
            let caption = nameParts[0].replace(/-/g, ' '); // Ganti strip jadi spasi
            caption = caption.replace(/~/g, '<br>'); // Ganti tilde jadi baris baru
            
            const date = nameParts[1] ? nameParts[1] : 'Tanggal tidak ada';

            card.innerHTML = `
                <img src="${file.download_url}" loading="lazy" onclick="openModal(this.src)">
                <div class="info">
                    <b>${caption}</b>
                    <span class="date">📅 Posted: ${date}</span>
                </div>
            `;
            gallery.appendChild(card);
        });

    } catch (e) { 
        if (e.message === 'Limit_API') {
            gallery.innerHTML = `<p style="padding:20px; color:#ff6b6b;">Mencapai limit API GitHub. Tunggu sebentar lalu refresh.</p>`;
            folderTitle.innerText = `${folderName} (Error Limit)`;
        } else {
            gallery.innerHTML = `<p style="padding:20px; color:#ff6b6b;">Folder "${baseFolder}/${folderName}" kosong atau belum Anda buat di GitHub.</p>`; 
            folderTitle.innerText = `${folderName} (0 Testimoni)`;
        }
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

// Menjalankan otomatis saat web pertama kali dibuka
document.addEventListener('DOMContentLoaded', () => {
    const activeItem = document.querySelector('.chat-item.active');
    if(activeItem) {
        // Mengambil nama folder dari tulisan bold di dalam menu aktif
        const folderName = activeItem.querySelector('b').innerText;
        loadPhotos(folderName, activeItem);
    }
});

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
