# **PINGUIN AUTO CLAIM FIXED 2.0** 

![Log Running](https://github.com/user-attachments/assets/dc101776-ba47-4154-8898-928e3645a4ce)


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
- Format file wallet Anda harus sesuai dengan contoh yang ada di dalam file `test.json`.
- Jika dirasa sudah sesuai maka copas dan masukan kedalam file `test.json`

### **6. Generate Group dan Checker**
Jalankan perintah berikut untuk membuat file wallet:
```bash
node claimPinguin-checkerBulk.js
```
- Setelah menjalankan perintah ini, file bernama **`claimPinguin-mnemonic.json`** akan muncul.
- Jika file tersebut tidak muncul, periksa kembali format wallet Anda atau cek error yang terjadi.

### **7. AUTO Send Sol dan AUTO Send Token**
- Setiap *parent wallet* harus memiliki saldo SOL minimal **0.0025 - 0.003**.
- Masukan privake key untuk send sol ke wallet parent secara otomatis di file `claimPinguin-byGroup.js` baris 501
- Masukan privake key untuk fee payer pengiriman SOl dan TOKEN secara otomatis di file `claimPinguin-byGroup.js` baris 505
- Private key keduanya boleh sama!

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
