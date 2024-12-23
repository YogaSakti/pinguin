# **PINGUIN AUTO CLAIM FIXED 2.0**  

## **Langkah-langkah Instalasi dan Penggunaan**

### **1. Clone Repository**
Jalankan perintah berikut untuk mengunduh repository:
```bash
git clone https://github.com/YogaSakti/pinguin
```

### **2. Masuk ke Direktori**
Pindah ke folder hasil clone:
```bash
cd pinguin
```

### **3. Atur Izin Eksekusi**
Pastikan file utilitas memiliki izin eksekusi:
```bash
chmod +x utils/curl_impersonate
chmod +x utils/curl-impersonate-chrome
```

### **4. Install Modul**
Pasang dependensi Node.js:
```bash
npm install
```

### **5. Pastikan Format Wallet**
- Format file wallet Anda harus sesuai dengan `test.json`.
- Jika diperlukan, ubah nama file wallet JSON Anda di **`claimPinguin-walletGenerator.js`**.

### **6. Generate Wallet**
Jalankan perintah berikut untuk membuat file wallet:
```bash
node claimPinguin-walletGenerator.js
```
- Setelah menjalankan perintah ini, file bernama **`claimPinguin-wallet.json`** akan muncul.
- Jika file tersebut tidak muncul, periksa kembali format wallet Anda atau cek error yang terjadi.

### **7. Saldo Minimum**
- Setiap *parent wallet* harus memiliki saldo SOL minimal **0.0025 - 0.003**.
- Bot akan melakukan klaim untuk 10 wallet sekaligus.
- Gunakan file **`claimPinguin-address-parent.txt`** untuk mengatur pengiriman secara *bulk*.

### **8. Daftar Helius**
- Daftar ke [Helius](https://www.helius.xyz/) untuk mendapatkan **RPC Key** Solana.
- Masukkan **RPC Key** ke file **`claimPinguin-byGroup.js`** pada bagian key.

### **9. Jalankan Bot**
Eksekusi bot dengan perintah:
```bash
node claimPinguin-byGroup.js
```

---

Jika terdapat masalah, pastikan Anda:
1. Memeriksa kembali konfigurasi file JSON.
2. Menyesuaikan pengaturan sesuai langkah-langkah di atas.
3. Menghubungi pengembang atau merujuk ke dokumentasi resmi repository.
