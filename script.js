/* ==========================================================================
   1. DATA JADWAL DESA KECAMATAN PASAWAHAN (10.00 - 16.00 WIB & ATURAN 3 JAM)
   ========================================================================== */
const VILLAGE_RULES = {
    "Paniis":              { day: "Senin & Selasa", session: "Sesi Pagi (10.00 – 13.00 WIB)", cutoff: "07.00 WIB" },
    "Cibuntu":             { day: "Senin & Selasa", session: "Sesi Pagi (10.00 – 13.00 WIB)", cutoff: "07.00 WIB" },
    "Cirea":               { day: "Senin & Selasa", session: "Sesi Siang (13.00 – 16.00 WIB)", cutoff: "10.00 WIB" },
    "Singkup":             { day: "Rabu & Kamis",   session: "Sesi Pagi (10.00 – 13.00 WIB)", cutoff: "07.00 WIB" },
    "Pasawahan":           { day: "Rabu & Kamis",   session: "Sesi Pagi (10.00 – 13.00 WIB)", cutoff: "07.00 WIB" },
    "Padamatang":          { day: "Rabu & Kamis",   session: "Sesi Siang (13.00 – 16.00 WIB)", cutoff: "10.00 WIB" },
    "Ciwiru":              { day: "Jumat & Sabtu",  session: "Sesi Pagi (10.00 – 13.00 WIB)", cutoff: "07.00 WIB" },
    "Kaduela":             { day: "Jumat & Sabtu",  session: "Sesi Pagi (10.00 – 13.00 WIB)", cutoff: "07.00 WIB" },
    "Cidahu":              { day: "Jumat & Sabtu",  session: "Sesi Siang (13.00 – 16.00 WIB)", cutoff: "10.00 WIB" },
    "Cimara (Sesi Pagi)":  { day: "Hari Minggu",    session: "Sesi Pagi (10.00 – 13.00 WIB)", cutoff: "07.00 WIB" },
    "Cimara (Sesi Siang)": { day: "Hari Minggu",    session: "Sesi Siang (13.00 – 16.00 WIB)", cutoff: "10.00 WIB" }
};

/* ==========================================================================
   2. DATA KATALOG 6 JENIS SAMPAH DAUR ULANG
   ========================================================================== */
const WASTE_CATALOG = [
    { id: 1, category: "Plastik", badge: "Plastik Daur Ulang", condition: "Bersih & Lepas Tutup", name: "Botol Plastik Air Mineral (PET)", desc: "Botol plastik bening bekas air minum. Pastikan sudah kosong dan bersih.", price: 4500, unit: "kg", icon: "🧴" },
    { id: 2, category: "Kertas", badge: "Kertas / Kardus", condition: "Dilipat Rapi & Kering", name: "Kardus Bekas Paket / Karton", desc: "Kotak kardus bekas belanja paket, dus mie instan, atau kemasan kering.", price: 2800, unit: "kg", icon: "📦" },
    { id: 3, category: "Logam", badge: "Logam Bernilai", condition: "Kosong & Bersih", name: "Kaleng Minuman Aluminium", desc: "Kaleng bekas minuman ringan, susu cair, atau sarden yang sudah dibilas.", price: 14000, unit: "kg", icon: "🥫" },
    { id: 4, category: "Minyak jelantah", badge: "Minyak Jelantah", condition: "Disaring dari Ampas", name: "Minyak Goreng Bekas Pakai", desc: "Minyak goreng sisa dapur yang dimasukkan ke dalam botol/jerigen tertutup.", price: 6000, unit: "liter", icon: "💧" },
    { id: 5, category: "Kertas", badge: "Kertas / Kardus", condition: "Tidak Basah / Berminyak", name: "Buku Tulis Lama & Kertas HVS", desc: "Buku sekolah yang sudah tidak terpakai, kertas dokumen, atau majalah.", price: 3200, unit: "kg", icon: "📄" },
    { id: 6, category: "Plastik", badge: "Plastik Daur Ulang", condition: "Buka Tutup Plastiknya", name: "Gelas Plastik Minuman Bening", desc: "Gelas plastik bekas air mineral kemasan gelas yang sudah dibilas kering.", price: 5000, unit: "kg", icon: "🥤" }
];

/* ==========================================================================
   3. STATE APLIKASI (USER LOGIN, KALKULATOR, & RIWAYAT TERPISAH PER AKUN)
   ========================================================================== */
let currentUser = null;
let pendingOpenHistoryAfterLogin = false;
let activeCategory = "semua";
let calcTotalRupiah = 0;
let calcTotalWeight = 0;

let pickupHistory = [
    {
        id: "PS-301",
        owner: "iisayffiy",
        nama: "iisayffiy",
        wa: "081234567890",
        desa: "Paniis",
        jenis: "Logam",
        berat: 5,
        alamat: "Jl. Raya Pasawahan No. 14, Desa Paniis",
        lockedByCutoff: false
    },
    {
        id: "PS-289",
        owner: "Budi Santoso",
        nama: "Budi Santoso",
        wa: "081398765432",
        desa: "Cirea",
        jenis: "Campuran Terpilah",
        berat: 6,
        alamat: "Blok Mekar RT 02/04, Desa Cirea",
        lockedByCutoff: true
    }
];

/* Mengambil hanya riwayat milik user yang sedang login */
function getMyHistory() {
    if (!currentUser) return [];
    return pickupHistory.filter(
        item => item.owner.toLowerCase() === currentUser.username.toLowerCase()
    );
}

/* ==========================================================================
   4. FUNGSI RENDER KATALOG & KALKULATOR SIMULASI
   ========================================================================== */
function renderCatalog() {
    const grid = document.getElementById("catalogGrid");
    const keyword = document.getElementById("searchInput").value.toLowerCase();

    const filtered = WASTE_CATALOG.filter(item => {
        const matchCat = activeCategory === "semua" || item.category === activeCategory;
        const matchKey = item.name.toLowerCase().includes(keyword) || item.category.toLowerCase().includes(keyword);
        return matchCat && matchKey;
    });

    grid.innerHTML = filtered.map(item => `
        <article class="waste-card">
            <div>
                <div class="waste-card-top">
                    <div class="waste-icon-box">${item.icon}</div>
                    <div class="waste-badges">
                        <span class="waste-cat-pill">• ${item.badge}</span>
                        <span class="waste-cond">✨ ${item.condition}</span>
                    </div>
                </div>
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
            </div>
            <div class="waste-dock">
                <div class="waste-dock-price">
                    <small>Nilai Tukar</small>
                    <strong>Rp ${item.price.toLocaleString("id-ID")} /${item.unit}</strong>
                </div>
                <div class="waste-dock-actions">
                    <button type="button" class="btn-calc-add" onclick="addToCalculator(${item.price}, '${item.category}')">
                        + Hitung (1 ${item.unit})
                    </button>
                    <button type="button" class="btn-card-pickup" onclick="chooseWasteForForm('${item.category}')">
                        Jemput ↗
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

function filterCatalog(category, btnElement) {
    activeCategory = category;
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    btnElement.classList.add("active");
    renderCatalog();
}

function addToCalculator(price, category) {
    if (!currentUser) {
        openAuthModal("login", true);
        return;
    }
    calcTotalRupiah += price;
    calcTotalWeight += 1;
    document.getElementById("calcTotalValue").textContent = "Rp " + calcTotalRupiah.toLocaleString("id-ID");
    document.getElementById("calcSummaryText").textContent = `Simulasi Tabungan Sampahmu (${calcTotalWeight} kg / liter dipilih)`;
    document.getElementById("fJenis").value = category;
    document.getElementById("fBerat").value = Math.max(3, calcTotalWeight);
}

function resetCalculator() {
    calcTotalRupiah = 0;
    calcTotalWeight = 0;
    document.getElementById("calcTotalValue").textContent = "Rp 0";
    document.getElementById("calcSummaryText").textContent = "Simulasi Tabungan Sampahmu (0 kg / liter dipilih)";
}

function chooseWasteForForm(category) {
    if (!currentUser) {
        openAuthModal("login", true);
        return;
    }
    document.getElementById("fJenis").value = category;
    document.getElementById("jemput").scrollIntoView({ behavior: "smooth" });
}

function applyCalcToForm() {
    if (!currentUser) {
        openAuthModal("login", true);
        return;
    }
    document.getElementById("jemput").scrollIntoView({ behavior: "smooth" });
}

/* ==========================================================================
   5. FUNGSI JADWAL DESA KEC. PASAWAHAN & MODAL INFO
   ========================================================================== */
function updateVillageRuleBanner() {
    const selectedDesa = document.getElementById("fDesa").value;
    const rule = VILLAGE_RULES[selectedDesa];
    const banner = document.getElementById("villageRuleBanner");

    if (rule) {
        banner.innerHTML = `
            <strong>📌 Info Jadwal Desa ${selectedDesa}:</strong> Hari <strong>${rule.day}</strong> pukul <strong>${rule.session}</strong>.
            Warga dapat input/edit/batal (CRUD) dari pagi hingga <strong>paling lambat pukul ${rule.cutoff}</strong> (3 jam sebelum penjemputan).
        `;
    }
}

function openScheduleModal() {
    document.getElementById("scheduleModal").classList.add("open");
}

function closeScheduleModal() {
    document.getElementById("scheduleModal").classList.remove("open");
}

function selectVillageFromModal(desaName) {
    document.getElementById("fDesa").value = desaName;
    updateVillageRuleBanner();
    closeScheduleModal();
    document.getElementById("jemput").scrollIntoView({ behavior: "smooth" });
}

/* ==========================================================================
   6. FUNGSI AUTENTIKASI (LOGIN, SIGN UP, LUPA SANDI, & SHOW/HIDE PASSWORD)
   ========================================================================== */
function openAuthModal(tab = "login", showGuardNotice = false) {
    document.getElementById("authGuardNotice").classList.toggle("hidden", !showGuardNotice);
    document.getElementById("authModal").classList.add("open");
    switchAuthTab(tab);
}

function closeAuthModal() {
    document.getElementById("authModal").classList.remove("open");
    pendingOpenHistoryAfterLogin = false;
}

function switchAuthTab(tab) {
    document.getElementById("panelLogin").classList.toggle("hidden", tab !== "login");
    document.getElementById("panelSignup").classList.toggle("hidden", tab !== "signup");
    document.getElementById("panelForgot").classList.toggle("hidden", tab !== "forgot");
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === "password" ? "text" : "password";
}

function requireAuthForForm(event) {
    if (!currentUser) {
        event.target.blur();
        openAuthModal("login", true);
    }
}

function quickLoginAs(username, wa) {
    setLoggedInUser(username, wa);
    closeAuthModal();
}

function submitLogin(e) {
    e.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    setLoggedInUser(user, "081234567890");
    closeAuthModal();
}

function submitSignup(e) {
    e.preventDefault();
    const pass = document.getElementById("regPass").value;
    const confirm = document.getElementById("regConfirmPass").value;
    if (pass !== confirm) {
        alert("Konfirmasi password tidak cocok!");
        return;
    }
    const user = document.getElementById("regUser").value.trim();
    const wa = document.getElementById("regWa").value.trim();
    setLoggedInUser(user, wa);
    closeAuthModal();
}

function submitForgot(e) {
    e.preventDefault();
    alert("Password berhasil diperbarui! Silakan login.");
    switchAuthTab("login");
}

function setLoggedInUser(username, wa) {
    currentUser = { username, wa };
    document.getElementById("fNama").value = username;
    document.getElementById("fWa").value = wa;

    document.getElementById("navAuthArea").innerHTML = `
        <span style="font-weight:700; font-size:0.9rem; margin-right:8px;">Halo, ${username}</span>
        <button type="button" class="nav-item" style="text-decoration:underline;" onclick="logoutUser()">Keluar</button>
    `;

    updateHistoryBadges();

    if (pendingOpenHistoryAfterLogin) {
        pendingOpenHistoryAfterLogin = false;
        openHistoryDrawer();
    }
}

function logoutUser() {
    currentUser = null;
    document.getElementById("fNama").value = "";
    document.getElementById("fWa").value = "";
    closeHistoryDrawer();
    updateHistoryBadges();

    document.getElementById("navAuthArea").innerHTML = `
        <button type="button" class="btn-auth-pill" onclick="openAuthModal('login')">
            Masuk / Daftar <span class="arrow-circle">↗</span>
        </button>
    `;
}

/* ==========================================================================
   7. FUNGSI FORM SUBMIT & RIWAYAT CRUD (TERKUNCI JIKA BELUM LOGIN)
   ========================================================================== */
function handleFormSubmit(e) {
    e.preventDefault();
    if (!currentUser) {
        openAuthModal("login", true);
        return;
    }

    const desa = document.getElementById("fDesa").value;
    const rule = VILLAGE_RULES[desa];
    const newItem = {
        id: "PS-" + Math.floor(100 + Math.random() * 900),
        owner: currentUser.username,
        nama: document.getElementById("fNama").value,
        wa: document.getElementById("fWa").value,
        desa: desa,
        jenis: document.getElementById("fJenis").value,
        berat: document.getElementById("fBerat").value,
        alamat: document.getElementById("fAlamat").value,
        lockedByCutoff: false
    };

    pickupHistory.unshift(newItem);
    updateHistoryBadges();

    document.getElementById("successSummaryBox").innerHTML = `
        <strong>Nama Warga:</strong> ${newItem.nama}<br>
        <strong>Desa & Jadwal:</strong> Desa ${newItem.desa} (${rule.day} • ${rule.session})<br>
        <strong>Batas Edit/Batal:</strong> Pukul ${rule.cutoff}<br>
        <strong>Jenis & Berat:</strong> ${newItem.jenis} (${newItem.berat} Kg/Liter)<br>
        <strong>Lokasi Jemput:</strong> ${newItem.alamat}
    `;
    document.getElementById("successModal").classList.add("open");
}

function closeSuccessModal() {
    document.getElementById("successModal").classList.remove("open");
}

function finishSuccessAndOpenHistory() {
    closeSuccessModal();
    openHistoryDrawer();
}

function updateHistoryBadges() {
    const navBadge = document.getElementById("navHistoryCount");
    const formBadge = document.getElementById("formHistoryCount");

    if (!currentUser) {
        navBadge.classList.add("hidden");
        formBadge.classList.add("hidden");
        return;
    }

    const myCount = getMyHistory().length;
    navBadge.textContent = myCount;
    formBadge.textContent = myCount;
    navBadge.classList.remove("hidden");
    formBadge.classList.remove("hidden");
}

/* User TIDAK BISA melihat riwayat jika belum login */
function openHistoryDrawer() {
    if (!currentUser) {
        pendingOpenHistoryAfterLogin = true;
        openAuthModal("login", true);
        return;
    }
    renderHistoryList();
    document.getElementById("historyModal").classList.add("open");
}

function closeHistoryDrawer() {
    document.getElementById("historyModal").classList.remove("open");
}

function renderHistoryList() {
    const container = document.getElementById("historyListContainer");
    const myItems = getMyHistory();

    document.getElementById("historyUserEyebrow").textContent =
        `RIWAYAT AKUN: ${currentUser.username.toUpperCase()} • ATURAN 3 JAM SEBELUM JEMPUT`;

    if (myItems.length === 0) {
        container.innerHTML = `
            <div class="history-card" style="grid-column: 1 / -1; text-align:center; padding:32px;">
                <strong>Belum ada riwayat penjemputan untuk akun ${currentUser.username}.</strong>
                <p style="color:#53685A; font-size:0.9rem; margin-top:6px;">Silakan ajukan penjemputan sampah melalui formulir di halaman utama.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = myItems.map(item => {
        const rule = VILLAGE_RULES[item.desa] || { day: "Senin & Selasa", session: "10.00–13.00", cutoff: "07.00 WIB" };
        return `
            <div class="history-card">
                <div class="history-top">
                    <span class="id-badge">#${item.id}</span>
                    <span class="status-pill ${item.lockedByCutoff ? 'locked' : 'open'}">
                        ${item.lockedByCutoff ? '🔒 Terkunci (Lewat ' + rule.cutoff + ')' : '⏳ Bisa Edit/Batal (Sebelum ' + rule.cutoff + ')'}
                    </span>
                </div>

                <div style="text-align:right; margin-bottom:8px;">
                    <button type="button" class="filter-btn" style="font-size:0.75rem; padding:4px 10px;" onclick="toggleCutoffLock('${item.id}')">
                        ⏱️ ${item.lockedByCutoff ? 'Reset ke Sebelum ' + rule.cutoff : 'Simulasi Lewat ' + rule.cutoff}
                    </button>
                </div>

                <div class="history-body">
                    <strong>${item.nama}</strong> (${item.wa})<br>
                    <strong>Desa ${item.desa}</strong> • ${rule.day}<br>
                    <span>Jadwal: ${rule.session} (Batas CRUD: ${rule.cutoff})</span><br>
                    <span>Sampah: ${item.jenis} (${item.berat} Kg/L) — ${item.alamat}</span>
                </div>

                <div class="history-actions">
                    <button type="button" class="btn-edit" ${item.lockedByCutoff ? 'disabled' : ''} onclick="openEditModal('${item.id}')">
                        ✏️ Ubah
                    </button>
                    <button type="button" class="btn-delete" ${item.lockedByCutoff ? 'disabled' : ''} onclick="deleteHistoryItem('${item.id}')">
                        🗑️ Batalkan
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function toggleCutoffLock(id) {
    const item = pickupHistory.find(x => x.id === id);
    if (item) {
        item.lockedByCutoff = !item.lockedByCutoff;
        renderHistoryList();
    }
}

function openEditModal(id) {
    const item = pickupHistory.find(x => x.id === id);
    if (!item || item.lockedByCutoff) return;

    document.getElementById("editId").value = item.id;
    document.getElementById("editNama").value = item.nama;
    document.getElementById("editDesa").value = item.desa;
    document.getElementById("editJenis").value = item.jenis;
    document.getElementById("editBerat").value = item.berat;
    document.getElementById("editAlamat").value = item.alamat;
    document.getElementById("editModal").classList.add("open");
}

function closeEditModal() {
    document.getElementById("editModal").classList.remove("open");
}

function saveEditedItem(e) {
    e.preventDefault();
    const id = document.getElementById("editId").value;
    const item = pickupHistory.find(x => x.id === id);
    if (item && !item.lockedByCutoff) {
        item.nama = document.getElementById("editNama").value;
        item.desa = document.getElementById("editDesa").value;
        item.jenis = document.getElementById("editJenis").value;
        item.berat = document.getElementById("editBerat").value;
        item.alamat = document.getElementById("editAlamat").value;
    }
    closeEditModal();
    renderHistoryList();
}

function deleteHistoryItem(id) {
    pickupHistory = pickupHistory.filter(x => x.id !== id);
    updateHistoryBadges();
    renderHistoryList();
}

/* Inisialisasi awal saat halaman selesai dimuat */
document.addEventListener("DOMContentLoaded", () => {
    renderCatalog();
    updateVillageRuleBanner();
    updateHistoryBadges();
    document.getElementById("fTanggal").valueAsDate = new Date();
});