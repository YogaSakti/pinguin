/* eslint-disable no-continue */
/* eslint-disable no-undefined */
/* eslint-disable max-lines */
const solanaWeb3 = require('@solana/web3.js');
const { Connection, Keypair, PublicKey, VersionedMessage, VersionedTransaction } = solanaWeb3
const { sign } = require('tweetnacl');
const { decodeUTF8 } = require('tweetnacl-util');
const bs58 = require('bs58');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key')
const fs = require('fs');
const delay = require('delay');

const { fetcher } = require('./utils/index')
const readline = require('readline');

const askQuestion = async (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}


const key = ''
const rpcUrl = `https://rpc.helius.xyz?api-key=${key}`
// const rpcUrl = 'https://solana-mainnet.g.alchemy.com/v2/1pxyGNF9cGAlQFNMmp4Hov1i5kdWo93r'

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
//     "token": "eyJpZCI6InBlbmd1Iiwic2lnbmF0d............",
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

// link to parent wallet
const linkChildToParent = (authorization, addressParent) => fetcher('https://api.clusters.xyz/v0.1/airdrops/pengu/link?', 'POST', {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'authorization': `Bearer ${authorization}`,
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
    'address': addressParent,
    'type': 'solana',
    'isPrivate': false
})



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

const getToken = async (wallet) => {
    const message = await getMessage();
    const { message: messageContent, signingDate } = message;
    const account = generateAccount(wallet);
    const { address } = account;
    const { signature } = signMessage(messageContent, account);
    const authResult = await doAuth(signature, signingDate, address);

    return { token: authResult.token, address };
};

(async () => {

    // load file
    const wallets = JSON.parse(fs.readFileSync('claimPinguin-wallet.json', 'utf8'))

    for (let i = 0; i < wallets.length; i++) {

        console.log('==================================================================================================================')

        const walletParent = wallets[i].parent;
        let walletChild = wallets[i].children;

        // load parent wallet
        const accountParent = generateAccount(walletParent);
        console.log(`[${i + 1}] ${accountParent.address} | Loaded parent wallet!`);

        const addressParent = accountParent.address;

        // load all child wallets
        const accountChildren = walletChild.map((childMnemonic) => generateAccount(childMnemonic));

        // eligibility check
        const addressesToCheck = [accountParent.address, ...accountChildren.map((child) => child.address)];
        const eligibilityCheck = await cekEligBulk(addressesToCheck);
        if (eligibilityCheck.total === 0) {
            console.log(`[${i + 1}] Not eligible!`);
            continue;
        } else if (eligibilityCheck.totalUnclaimed === 0) {
            console.log(`[${i + 1}] Already claimed!`);
            continue;
        } else {
            console.log(`[${i + 1}] Eligible! Total: ${eligibilityCheck.total} $PENGU | Unclaimed: ${eligibilityCheck.totalUnclaimed} $PENGU`);
        }

        // remove children wallet if not in eligibility check category items
        const eligibleAddresses = eligibilityCheck.categories[0].items.map((item) => item.address);
        walletChild = walletChild.filter((_, index) => eligibleAddresses.includes(accountChildren[index].address));

        // get token for children
        const childrenTokens = [];
        for (const [index, childMnemonic] of walletChild.entries()) {
            const { token, address } = await getToken(childMnemonic).catch((err) => {
                console.error(`[${i + 1}] Error getting token for child ${index + 1}: ${err.message}`);

                return {};
            });

            if (token) {
                console.log(`[${i + 1}] ${address} | Loaded child ${index + 1} wallet!`);
            }
            childrenTokens.push({ token, address });
            await delay(1000);
        }

        // link children to parent
        for (const [index, { token }] of childrenTokens.entries()) {
            if (token) {
                const linkResult = await linkChildToParent(token, addressParent);
                if (linkResult === 201) {
                    console.log(`[${i + 1}] Success link Child ${index + 1} to Parent!`);
                }
                await delay(1000);
            }
        }

        const balance = await connection.getBalance(new PublicKey(addressParent));
        // if balance is less than required amount, prompt user for input
        if (balance < 4000000) {
            console.log(`[${i}] Address ${addressParent} doesn't have enough balance! | Balance: ${balance / 1e9} SOL`);

            const answer = await askQuestion(`[${i}] Do you want to continue? (y/n): `);

            if (answer.toLowerCase() !== 'y') {
                console.log(`[${i}] Exiting the process as per user request.`);
                // eslint-disable-next-line no-process-exit
                process.exit(0);
            } else {
                console.log(`[${i}] Continuing the process as per user request.`);
            }
        }



        await delay(1000)

        // get claim data from parent
        const claimParent = await getClaim(addressParent)
        // console.log(JSON.stringify(claimParent, null, 2))

        for (let x = 0; x < claimParent.length; x++) {
            const { data, signatures } = claimParent[x];
            const txMessage = VersionedMessage.deserialize(Buffer.from(data, 'base64'));
            const transaction = new VersionedTransaction(txMessage);
            transaction.signatures = signatures.map((x) => Buffer.from(x, 'base64'));

            // sign transaction
            transaction.sign([Keypair.fromSecretKey(accountParent.secretKey)]);

            // send transaction
            const sendTx = await connection.sendRawTransaction(transaction.serialize(), {
                skipPreflight: !1,
                maxRetries: 3,
                preflightCommitment: 'confirmed'
            }).catch((err) => console.error(`[${i + 1}] Transaction ${x + 1} failed: ${err.message}`));

            console.log(`[${i + 1}] ${addressParent} | Transaction ${x + 1} | ${sendTx}`)
            await delay(3000)
        }

        console.log(`[${i + 1}] Done!`)
    }
})()