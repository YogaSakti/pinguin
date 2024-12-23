/* eslint-disable max-lines-per-function */
/* eslint-disable no-sync */
/* eslint-disable no-continue */
/* eslint-disable no-undefined */
/* eslint-disable max-lines */
const solanaWeb3 = require('@solana/web3.js');
// eslint-disable-next-line no-unused-vars
const { Connection, ComputeBudgetProgram, Keypair, PublicKey, Transaction, LAMPORTS_PER_SOL, SystemProgram, TransactionMessage, VersionedMessage, VersionedTransaction } = solanaWeb3
const { sign } = require('tweetnacl');
const { decodeUTF8 } = require('tweetnacl-util');
const bs58 = require('bs58');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key')
const fs = require('fs');
const delay = require('delay');
const { fetcher } = require('./utils/index')
const readline = require('readline');
const SplToken = require('@solana/spl-token');
const { getOrCreateAssociatedTokenAccount } = SplToken

const PENGU_TOKEN_ADDRESS = new PublicKey('2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv');

const askQuestion = (query) => {
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


const key = 'fe70b82c-1886-4b14-b8bc-d72678880f9d'
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

// ENDPOINTS DEAD
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


// bulk eligibility check using token? so dumb
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

// get txData by server
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

// link child wallet to parent wallet
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

// generate account from private key or mnemonic
const generateAccount = (accountData, isPk) => {
    let account = null,
        keypair = null
    if (isPk) {
        keypair = Keypair.fromSecretKey(bs58.decode(accountData))
    } else {
        const seed = bip39.mnemonicToSeedSync(accountData);
        const path = 'm/44\'/501\'/0\'/0\'';
        const derivedSeed = derivePath(path, seed.toString('hex')).key;
        keypair = Keypair.fromSeed(derivedSeed)
    }

    if (!keypair) throw new Error('Invalid secret key')
    account = {
        publicKey: keypair.publicKey,
        secretKey: keypair.secretKey,
        // aditional data below
        address: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
    }

    return account
};

// sign message
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

// get token from wallet
const getToken = async (wallet) => {
    const message = await getMessage();
    const { message: messageContent, signingDate } = message;
    const account = generateAccount(wallet);
    const { address } = account;
    const { signature } = signMessage(messageContent, account);
    const authResult = await doAuth(signature, signingDate, address);

    return { token: authResult.token, address };
};


// get SPL token balance
const getTokenBalance = async (address) => {
    const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(new PublicKey(address), { mint: new PublicKey(PENGU_TOKEN_ADDRESS) });

    if (parsedTokenAccounts.value.length === 0) {
        return 0;
    }

    return parsedTokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
};

// send SPL token 
const sendToken = async (from, to, amount) => {
    const TokenAddress = PENGU_TOKEN_ADDRESS
    const recipientAddress = new PublicKey(to);
    const senderKeypair = Keypair.fromSecretKey(from.secretKey);
    const recipient = await getOrCreateAssociatedTokenAccount(
        connection,
        senderKeypair,
        TokenAddress,
        recipientAddress
    );
    const sender = await getOrCreateAssociatedTokenAccount(
        connection,
        senderKeypair,
        TokenAddress,
        senderKeypair.publicKey
    );

    const instructions = SplToken.createTransferInstruction(
        sender.address,
        recipient.address,
        senderKeypair.publicKey,
        amount,
        [],
        SplToken.TOKEN_PROGRAM_ID
    )

    // add compute budget instruction for priority fee
    const computeBudgetIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 0.00015 * LAMPORTS_PER_SOL
    });
    await delay(500)

    const blockhash = await connection.getLatestBlockhash('confirmed');
    await delay(500)

    const messageV0 = new TransactionMessage({
        payerKey: senderKeypair.publicKey,
        recentBlockhash: blockhash.blockhash,
        instructions: [computeBudgetIx, instructions]
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([senderKeypair]);

    const txid = await connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: !1,
        preflightCommitment: 'confirmed'
    })

    return txid;
};

// send SOL
const sendSol = async (from, to, amount) => {
    try {
        const transaction = new Transaction().add(SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: new PublicKey(to),
            lamports: amount * LAMPORTS_PER_SOL
        }));

        const signature = await connection.sendTransaction(transaction, [from]);

        await connection.confirmTransaction(signature);

        return signature;
    } catch (error) {
        console.error('Error sending SOL:', error);

        return null;
    }
};

// get transaction fee
const getTransactionFee = async (pkFee) => {
    try {
        const feeAccountChecker = generateAccount(pkFee, true);
        const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const transaction = new Transaction();

        transaction.recentBlockhash = recentBlockhash;
        transaction.feePayer = feeAccountChecker.publicKey;

        transaction.add(SystemProgram.transfer({
            fromPubkey: feeAccountChecker.publicKey,
            toPubkey: new PublicKey('MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa'), // transferring to itself just to simulate
            lamports: 10
        }));

        const message = transaction.compileMessage();
        const response = await connection.getFeeForMessage(
            message,
            'confirmed'
        );
        const feeInLamports = response.value;

        return feeInLamports;
    } catch (error) {
        console.error(error);
    }
};

// CONFIG ===========================================================================

// PK utama untuk mengirim SOL
const pkBank = 'ini PK Banker Gan'
const bankAccount = generateAccount(pkBank, true);

// Mnemonic utama untuk mengirim SOL
// const mnemonicBank = 'anu gede banget gan'
// const bankAccount = generateAccount(mnemonicBank, false);

const SEND_AMOUNT_SOL = 0.006;

// wallet list
const wallets = JSON.parse(fs.readFileSync('./claimPinguin-shadow-mnemonic.json', 'utf8'))


    // END CONFIG ===========================================================================

    (async () => {
        for (let i = 0; i < wallets.length; i++) {

            // skip until index 19
            if (i <= 75) {
                continue
            }

            console.log('==================================================================================================================')

            const walletParent = wallets[i].parent;
            let walletChild = wallets[i].children;

            // load parent wallet
            const accountParent = generateAccount(walletParent);

            const addressParent = accountParent.address;

            // login to parent wallet
            const loginParent = await getToken(walletParent).catch((err) => {
                console.error(`[${i + 1}] Error logging in to parent wallet: ${err.message}`);
            });

            if (!loginParent.token) {
                console.error(`[${i + 1}] Error logging in to parent wallet!`);
                continue;
            }

            console.log(`[${i + 1}] ${addressParent} | Logged in to parent wallet!`);
            let eligibilityCheckParent = await cekEligBulk([loginParent.token]);
            if (eligibilityCheckParent.total === 0) {
                console.log(`[${i + 1}] Not eligible!`);
                await delay(2000)
                continue
            } else if (eligibilityCheckParent.totalUnclaimed === 0) {
                console.log(`[${i + 1}] Already claim ${eligibilityCheckParent.total} $PENGU!`);

                const tokenBalance = await getTokenBalance(addressParent);
                if (tokenBalance === 0) {
                    // console.log(`[${i + 1}] ${addressParent} | No token balance on parent wallet!`);
                    await delay(1000)
                    continue;
                } else {
                    // eslint-disable-next-line prefer-exponentiation-operator
                    const amountToSend = tokenBalance * 1000000; // $PENGU 6 decimal
                    const sendTokenResult = await sendToken(accountParent, bankAccount.address, amountToSend)
                        .catch((err) => console.error(`[${i + 1}] Error sending token from parent to ${bankAccount.address}: ${err.message}`));

                    if (sendTokenResult) console.log(`[${i + 1}] ${addressParent} | Token sent! https://solscan.io/tx/${sendTokenResult}`);
                }
                await delay(1000)
                continue;
            } else {
                console.log(`[${i + 1}] Eligible! Total: ${eligibilityCheckParent.total} $PENGU | Unclaimed: ${eligibilityCheckParent.totalUnclaimed} $PENGU`);
            }

            await delay(1000)

            // get token for children
            const childrenTokens = [];
            for (const [index, childMnemonic] of walletChild.entries()) {
                const { token, address } = await getToken(childMnemonic).catch((err) => {
                    console.error(`[${i + 1} | ${index + 1}] Error getting token for child ${index + 1}: ${err.message}`);

                    return {};
                });

                await delay(750);
                if (token) {
                    const linkResult = await linkChildToParent(token, addressParent);
                    if (linkResult === 201) {
                        console.log(`[${i + 1} | ${index + 1}] Success Load & Link Child ${index + 1} to Parent!`);
                    }
                }
                childrenTokens.push({ token, address });
                await delay(750);
            }

            await delay(1000)

            eligibilityCheckParent = await cekEligBulk([loginParent.token]);
            if (eligibilityCheckParent.total === 0) {
                console.log(`[${i + 1}] Not eligible!`);
            } else if (eligibilityCheckParent.totalUnclaimed === 0) {
                console.log(`[${i + 1}] Already claim ${eligibilityCheckParent.total} $PENGU!`);
            } else {
                console.log(`[${i + 1}] Eligible! Total: ${eligibilityCheckParent.total} $PENGU | Unclaimed: ${eligibilityCheckParent.totalUnclaimed} $PENGU`);
            }


            // check parent balance and send SOL if needed
            try {
                const balance = await connection.getBalance(new PublicKey(addressParent));
                // if balance is less than required amount, prompt user for input
                if (balance < SEND_AMOUNT_SOL * LAMPORTS_PER_SOL) {
                    console.log(`[>] Address ${addressParent} doesn't have enough balance! | Sending SOL to parent wallet...`);
                    // send SOL to parent wallet
                    const sendSolResult = await sendSol(bankAccount, addressParent, SEND_AMOUNT_SOL)

                    if (sendSolResult) {
                        console.log(`[${i + 1}] SOL sent! Tx: https://solscan.io/tx/${sendSolResult}`);
                    } else {
                        console.log(`[${i + 1}] Failed to send SOL to parent wallet`);
                        process.exit(9);
                    }

                    let parentBalance = 0;
                    do {
                        parentBalance = await connection.getBalance(new PublicKey(addressParent));
                        if (parentBalance >= SEND_AMOUNT_SOL * LAMPORTS_PER_SOL) {
                            break;
                        }
                        await delay(1000);
                    } while (parentBalance <= SEND_AMOUNT_SOL * LAMPORTS_PER_SOL);

                    // eslint-disable-next-line no-await-in-loop
                    await delay(1000);
                }

            } catch (error) {
                console.error('Error sending SOL:', error.message);
            }

            await delay(1000)

            try {
                // get claim data from parent
                const claimParent = await getClaim(addressParent)
                // console.log(JSON.stringify(claimParent, null, 2))

                if (claimParent.error) {
                    console.error(`[${i + 1}] Error getting claim data for parent: ${claimParent.error}`);
                    continue;
                }

                for (let x = 0; x < claimParent.length; x++) {
                    const { data, signatures } = claimParent[x];
                    const txMessage = VersionedMessage.deserialize(Buffer.from(data, 'base64'));
                    const transaction = new VersionedTransaction(txMessage);
                    transaction.signatures = signatures.map((y) => Buffer.from(y, 'base64'));

                    // sign transaction
                    transaction.sign([Keypair.fromSecretKey(accountParent.secretKey)]);

                    // send transaction
                    const sendTx = await connection.sendRawTransaction(transaction.serialize(), {
                        skipPreflight: !1,
                        preflightCommitment: 'confirmed'
                    })

                    console.log(`[${i + 1}] ${addressParent} | Transaction ${x + 1} | ${sendTx}`)
                    await delay(1000);
                }
            } catch (error) {
                console.error('Error sending claim transaction:', error.message);
            }


            // transfer Token to main wallet
            try {
                let tokenBalance = 0;
                do {

                    tokenBalance = await getTokenBalance(addressParent);
                    if (tokenBalance > 53000) {
                        console.log(`[${i + 1}] ${addressParent} | Token balance: ${tokenBalance} $PENGU | Sending token to Master DRiP...`);
                        break;
                    }
                    await delay(1000);
                } while (tokenBalance < 53000);

                const from = generateAccount(walletParent);
                // eslint-disable-next-line prefer-exponentiation-operator
                const amountToSend = tokenBalance * 1000000; // $PENGU 6 decimal
                const sendTokenResult = await sendToken(accountParent, bankAccount.address, amountToSend)
                    .catch((err) => console.error(`[${i + 1}] Error sending token from parent to ${bankAccount.address}: ${err.message}`));

                console.log(`[${i + 1}] ${addressParent} | Token sent! https://solscan.io/tx/${sendTokenResult}`);
            } catch (error) {
                console.error('Error sending token:', error.message);
            }

            // transfer remaining SOL back to main wallet
            try {
                const transferFee = await getTransactionFee();
                const remainingBalance = await connection.getBalance(new PublicKey(accountParent.address));
                const minimumBalanceLamports = transferFee

                if (remainingBalance > minimumBalanceLamports) {
                    const amountToSend = (remainingBalance - minimumBalanceLamports) / LAMPORTS_PER_SOL;
                    console.log(`[${i + 1}] ${addressParent} | Sending remaining ${amountToSend.toFixed(4)} SOL back to main wallet...`);

                    const returnSig = await sendSol(accountParent, bankAccount.address, amountToSend)

                    if (returnSig) {
                        console.log(`[${i + 1}] ${addressParent} | Remaining SOL sent! Tx: https://solscan.io/tx/${returnSig}`);
                    } else {
                        console.log(`[${i + 1}] ${addressParent} | Failed to send remaining SOL`);
                    }
                } else {
                    console.log(`[${i + 1}] ${addressParent} | Insufficient remaining balance to transfer! Balance: ${remainingBalance / 1e9} SOL`);
                }
            } catch (error) {
                console.error('Error returning remaining SOL:', error.message);
            }

            await delay(3000);


            console.log(`[${i + 1}] Done!`)
        }
    })()
