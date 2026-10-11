
let keranjang = [];

function tambahKeranjang(nama, harga) {
    const itemAda = keranjang.find(item => item.nama === nama);

    if (itemAda) {
        itemAda.jumlah++;
    } else {
        keranjang.push({
            nama: nama,
            harga: harga,
            jumlah: 1
        });
    }

    tampilkanKeranjang();
}

function tampilkanKeranjang() {
    const daftar = document.getElementById("daftar-keranjang");
    const totalHarga = document.getElementById("total-harga");
    const jumlahKeranjang = document.getElementById("jumlah-keranjang");
    const totalItem = keranjang.reduce(function(total, item) {
    return total + item.jumlah;
}, 0);

jumlahKeranjang.textContent = totalItem;

    daftar.innerHTML = "";

    let total = 0;

    keranjang.forEach(function(item, index) {
        const baris = document.createElement("div");
        baris.className = "cart-item";

        const subtotal = item.harga * item.jumlah;
        total += subtotal;

        baris.innerHTML = `
            <div>
                <strong>${item.nama}</strong>
                <p>Rp${item.harga.toLocaleString("id-ID")} x ${item.jumlah}</p>
                <p>Subtotal: Rp${subtotal.toLocaleString("id-ID")}</p>
            </div>

            <div class="cart-actions">
                <button onclick="ubahJumlah(${index}, -1)">−</button>
                <span>${item.jumlah}</span>
                <button onclick="ubahJumlah(${index}, 1)">+</button>
                <button onclick="hapusItem(${index})">Hapus</button>
            </div>
        `;

        daftar.appendChild(baris);
    });

    if (keranjang.length === 0) {
        daftar.textContent = "Belum ada pesanan.";
    }

    totalHarga.textContent = total.toLocaleString("id-ID");
}

function ubahJumlah(index, perubahan) {
    keranjang[index].jumlah += perubahan;

    if (keranjang[index].jumlah <= 0) {
        keranjang.splice(index, 1);
    }

    tampilkanKeranjang();
}

function hapusItem(index) {
    keranjang.splice(index, 1);
    tampilkanKeranjang();
}

document.getElementById("form-checkout").addEventListener("submit", function(event) {
    event.preventDefault();

    const hasil = document.getElementById("hasil-checkout");

    if (keranjang.length === 0) {
        hasil.textContent = "Keranjang masih kosong. Silakan pilih makanan terlebih dahulu.";
        return;
    }

    const nama = document.getElementById("nama-pelanggan").value.trim();
    const telepon = document.getElementById("telepon").value.trim();
    const alamat = document.getElementById("alamat").value.trim();
    const pembayaran = document.getElementById("metode-pembayaran").value;

    if (!nama || !telepon || !alamat || !pembayaran) {
        hasil.textContent = "Mohon lengkapi semua data checkout.";
        return;
    }

    let total = 0;
    const ringkasan = keranjang.map(function(item) {
        const subtotal = item.harga * item.jumlah;
        total += subtotal;

        return `${item.nama} x ${item.jumlah} = Rp${subtotal.toLocaleString("id-ID")}`;
    });

    const nomorPesanan = "FO-" + Date.now().toString().slice(-8);

    hasil.replaceChildren();

    const judul = document.createElement("h3");
    judul.textContent = "Pesanan berhasil dikonfirmasi!";
    hasil.appendChild(judul);

    const detail = [
        "Nomor pesanan: " + nomorPesanan,
        "Nama: " + nama,
        "Telepon: " + telepon,
        "Alamat: " + alamat,
        "Pembayaran: " + pembayaran,
        "",
        "Rincian pesanan:",
        ...ringkasan,
        "Total: Rp" + total.toLocaleString("id-ID"),
        "",
        "Catatan: Ini konfirmasi simulasi. Pesanan belum dikirim ke penjual."
    ];

    detail.forEach(function(teks) {
        const baris = document.createElement("p");
        baris.textContent = teks || "\u00A0";
        hasil.appendChild(baris);
    });
});

