
- clone repo
`git clone https://github.com/YogaSakti/pinguin`

- masuk ke folder
`cd pinguin`

- ubah permission
`chmod +x utils/curl_impersonate && chmod +x utils/curl-impersonate-chrome`

- install modul
`npm i`

pastikan file wallet mu formatnya sama dengan test.json

ubah nama file wallet jsonmu di file "claimPinguin-walletGenerator.js" jika diperlukan

- generate wallet
`node claimPinguin-walletGenerator.js`

setelah command diatas dijalankan akan muncul file bernama "claimPinguin-wallet.json" jika tidak muncul maka ada yang error atau formatnya salah

PERHATIKAN setiap PARENT harus ada saldo SOLnya minimal 0.0025-0.003 karena setiap run akan claim 10 wallet sekaligus
buka file "claimPinguin-address-parent.txt" jika kamu mau send secara bulk

daftar helius buat dapetin RPC KEY SOLANA abis itu masukin ke bagian key di file "claimPinguin-byGroup.js"

- run botnya
`node claimPinguin-byGroup.js`
