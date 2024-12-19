const fs = require('fs');

(async () => {
    // load file
    const wallets = JSON.parse(fs.readFileSync('test.json', 'utf8'))

    // parent child creator
    const totalPerGroup = 10; // total mnemonic per grup (1 parent + sisa child)
    const groupedData = [];
    let index = 0;

    while (index < wallets.length) {
        // ambil elemen grup sebanyak totalPerGroup
        const group = wallets.slice(index, index + totalPerGroup).map((obj) => obj.mnemonic || obj.Mnemonic);

        // tentukan parent dan children
        const [parent] = group; // elemen pertama adalah parent
        const children = group.slice(1); // sisanya adalah children

        groupedData.push({ parent, children });

        // pindahkan index ke setelah grup saat ini
        index += totalPerGroup;
    }

    fs.writeFileSync('claimPinguin-wallet.json', JSON.stringify(groupedData, null, 2));

    const parentAddress = []
    for (let i = 0; i < groupedData.length; i++) {
        // find parent address from mnemonic in wallets array
        const parent = wallets.find((obj) => obj.mnemonic === groupedData[i].parent || obj.Mnemonic === groupedData[i].parent);
        parentAddress.push(parent.address || parent.Address);
    }

    // parent only
    fs.writeFileSync('claimPinguin-address-parent.txt', parentAddress.join('\n'));
})()