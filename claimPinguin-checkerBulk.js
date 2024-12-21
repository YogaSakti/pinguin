/* eslint-disable max-lines-per-function */
/* eslint-disable no-sync */
const fetch = require('node-fetch').default;
const rfetch = require('node-fetch-retry')
const solanaWeb3 = require('@solana/web3.js');
const { Connection, Keypair, PublicKey, sendAndConfirmTransaction, LAMPORTS_PER_SOL, SystemProgram, Transaction, VersionedMessage, VersionedTransaction } = solanaWeb3
const { sign } = require('tweetnacl');
const { decodeUTF8 } = require('tweetnacl-util');
const bs58 = require('bs58');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key')
const fs = require('fs');
const delay = require('delay');

const { fetcher } = require('./utils/index')

const key = ''
const rpcUrl = `https://rpc.helius.xyz?api-key=${key}`

const connection = new Connection(rpcUrl, 'confirmed');

// get message using fetcher
const getMessage = () => fetcher('https://api.clusters.xyz/v0.1/airdrops/pengu/auth/message?', 'GET', {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'Referer': 'https://claim.pudgypenguins.com/',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
})

//   message example
// {
//     "message": "$PENGU Claim\n\nThis is a gasless signature to prove ownership of your wallet address.\n\nAlways ensure you are on the correct website URL: claim.pudgypenguins.com.\n\n2024-12-17T16:49:40.203Z",
//     "signingDate": "2024-12-17T16:49:40.203Z"
// }

const doAuth = (signature, signingDate, wallet) => fetcher('https://api.clusters.xyz/v0.1/airdrops/pengu/auth/token?', 'POST', {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'Referer': 'https://claim.pudgypenguins.com/',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
}, {
    signature,
    signingDate,
    'type': 'solana',
    wallet
})

// token response example
// {
//     "token": "eyJpZCI6InBlbmd1Iiwic2lnbmF0dXJlIjoiMHgzZDliNzBiOTgxYmZmYzM4YzJkMWY2YmU2ODVjYTkzYzRkZWQyM2RmY2IwODYyYjE1OTU1OTQ2NDI2ZTAxMDc5MjczZDkyNGY3YTUyNzMzZTIxZGI1YjMwY2M4MmIyZDNmODJiOGE4Y2ViNGI2YTRkMTExNGM1ZDcyNjk1OTgwOSIsInNpZ25pbmdEYXRlIjoiMjAyNC0xMi0xN1QxNjo0OTo0MC4yMDNaIiwidHlwZSI6InNvbGFuYSIsIndhbGxldCI6IkRyblRtWk5OeUdvY0hubWtMS0cxRWs0UXY1YUY4UkNNUEdrM1U5RGhCdFF5In0=",
//     "isValid": true
// }

const cekElig = (address) => fetcher(`https://api.clusters.xyz/v0.1/airdrops/pengu/eligibility/${address}?`, 'GET', {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'Referer': 'https://claim.pudgypenguins.com/',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
}).then((res) => {
    if (res.total == 0) return false

    return true
})

//   sign message example
// claim.pudgypenguins.com wants you to
// sign in with your Solana account:
// drnTmZNNyGocHnmkLKGIEk4Qv5aF8RC
// mPGk3U9Dh8tQy

// getClaim Data
const getClaim = (address) => fetcher(`https://api.clusters.xyz/v0.1/airdrops/pengu/claim/${address}?`, 'GET', {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'Referer': 'https://claim.pudgypenguins.com/',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
})

// bulk eligibility check
const cekEligBulk = (addresses) => fetcher('https://api.clusters.xyz/v0.1/airdrops/pengu/eligibility', 'POST', {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'Referer': 'https://claim.pudgypenguins.com/',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
}, addresses)


const generateAccount = (mnemonic) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const path = 'm/44\'/501\'/0\'/0\'';
    const derivedSeed = derivePath(path, seed.toString('hex')).key;
    const keypair = Keypair.fromSeed(derivedSeed)
    if (!keypair) throw new Error('Invalid secret key')
    const account = {
        address: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
        secretKey: keypair.secretKey
    };

    return account
};

const signMessage = (message, account) => {
    const { address } = account
    const bufSecretKey = account.secretKey
    const messageBytes = decodeUTF8(message);
    const signatureRaw = sign.detached(messageBytes, bufSecretKey);
    const buffer = Buffer.from(signatureRaw);
    const hexString = buffer.toString('hex');
    const signature = `0x${hexString}`

    return { address, signature, message }
};

const saveGroupToFile = (fileName, groupData) => {
    const existingData = fs.existsSync(fileName) ? JSON.parse(fs.readFileSync(fileName, 'utf8')) : [];
    existingData.push(groupData);
    fs.writeFileSync(fileName, JSON.stringify(existingData, null, 2));
};

const saveParentToFile = (fileName, parent) => {
    const existingParents = fs.existsSync(fileName) ? JSON.parse(fs.readFileSync(fileName, 'utf8')) : [];
    existingParents.push(parent);
    fs.writeFileSync(fileName, JSON.stringify(existingParents, null, 2));
};

// do auth
const getToken = async (wallet) => {
    const message = await getMessage();
    const { message: messageContent, signingDate } = message;
    const account = generateAccount(wallet);
    const { address } = account;
    const { signature } = signMessage(messageContent, account);
    const authResult = await doAuth(signature, signingDate, address);

    return { token: authResult.token, address };
};

const totalPerGroup = 50; // total mnemonic per grup (1 parent + sisa child)

const createGroupedData = async (wallets, groupFile, parentFile = '') => {
    let currentGroup = [];
    let groupIndex = 1;

    for (let wallet of wallets) {

        const { token, address } = await getToken(wallet.mnemonic);
        await delay(1000);
        
        let isEligible = await cekEligBulk([token]);
        isEligible = isEligible.totalUnclaimed > 0;
        await delay(1000);
        

        if (isEligible) {
            currentGroup.push(wallet.mnemonic);
            console.log(`Wallet ${wallet.address} is eligible.`);
            // saveGroupToFile('claimPinguin-shadow-auth.json', { ...wallet, token });
        } else {
            console.log(`Wallet ${wallet.address} is not eligible.`);
            // saveGroupToFile('claimPinguin-shadow-auth.json', { ...wallet, token });
        }

        // if current group reaches totalPerGroup, finalize and reset the group
        if (currentGroup.length === totalPerGroup) {
            const [parent] = currentGroup; // first wallet as parent
            const children = currentGroup.slice(1); // remaining as children
            const groupData = { parent, children };

            // save current group to JSON file
            saveGroupToFile(groupFile, groupData);
            // saveParentToFile(parentFile, parent);

            console.log(`Group ${groupIndex} saved.`);
            groupIndex += 1;

            currentGroup = []; // reset group
        }

        await delay(500);
    }

    // add remaining wallets if any, even if the group is incomplete
    if (currentGroup.length > 0) {
        const [parent] = currentGroup;
        const children = currentGroup.slice(1);
        const groupData = { parent, children };

        saveGroupToFile(groupFile, groupData);

        // const parentAddress = wallets.find((obj) => obj.mnemonic === parent || obj.Mnemonic === parent);
        // saveParentToFile(parentFile, parentAddress.privateKey);

        console.log(`Group ${groupIndex} saved.`);
    }
};



(async () => {

    // NAMA FILENYA
    const fileName = 'DRiP.shadow.json';

    // load file
    let wallets = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    console.log(`Total wallets: ${wallets.length}`);


    // INI NAMA FILE HASILNYA
    const groupFile = 'claimPinguin-mnemonic.json';
    
    // create grouped data and save to files incrementally
    await createGroupedData(wallets, groupFile);
})();
