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
const generateAccount = (accountData, isPk = false) => {
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

    const blockhash = await connection.getLatestBlockhash('confirmed').then(res => res.blockhash);
    await delay(500)

    const messageV0 = new TransactionMessage({
        payerKey: senderKeypair.publicKey,
        recentBlockhash: blockhash,
        instructions: [computeBudgetIx, instructions]
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([senderKeypair]);

    const txid = await connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: !1,
        preflightCommitment: 'confirmed'
    })
    await connection.getLatestBlockhash('confirmed').then(({ blockhash, lastValidBlockHeight }) => connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: txid
    }, 'confirmed')) // wait for confirmation

    return txid;
};

// send SOL
const sendSol = async (from, to, amount) => {
    try {
        const blockhash = await connection.getLatestBlockhash('confirmed').then(res => res.blockhash);
        const messageV0 = new TransactionMessage({
            payerKey: from.publicKey,
            recentBlockhash: blockhash,
            instructions: [SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: new PublicKey(to),
                lamports: BigInt(Math.round(amount * LAMPORTS_PER_SOL))
            })],
        }).compileToV0Message();
        const transaction = new VersionedTransaction(messageV0);
        transaction.sign([from]);

        const signature = await connection.sendRawTransaction(transaction.serialize(), {
            skipPreflight: !1,
            maxRetries: 5,
            preflightCommitment: 'confirmed'
        });

        await connection.getLatestBlockhash('confirmed').then(({ blockhash, lastValidBlockHeight }) => connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature: signature
        }, 'confirmed')) // wait for confirmation


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

// collect token and sol 
const collectTokenAndSol = async (accountFrom, addressTo, amountToken = null) => {
    try {
        const tokenBalance = await getTokenBalance(accountFrom.address);
        if (tokenBalance !== 0) {
            // eslint-disable-next-line prefer-exponentiation-operator
            let amountToSend = amountToken == tokenBalance * 1000000 ? amountToken : tokenBalance * 1000000; // $PENGU 6 decimal
            const sendTokenResult = await sendToken(accountFrom, addressTo, amountToSend);

            if (sendTokenResult) console.log(`[>] ${amountToSend / 1000000} $PENGU Has Been Sent To Banker! https://solscan.io/tx/${sendTokenResult}`);
        } else {
            console.log(`[!] ${accountFrom.address} | No token to collect!`);
        }

        const transferFee = await getTransactionFee(accountFrom.privateKey);
        const remainingBalance = await connection.getBalance(new PublicKey(accountFrom.address));
        const minimumBalanceLamports = transferFee;

        if (remainingBalance > minimumBalanceLamports) {
            let amountToSend = (remainingBalance - minimumBalanceLamports) / LAMPORTS_PER_SOL;
            console.log(`[>] Sending remaining ${amountToSend.toFixed(4)} SOL back to main wallet...`);

            const returnSig = await sendSol(accountFrom, addressTo, amountToSend);

            if (returnSig) console.log(`[>] Success! TxHash: https://solscan.io/tx/${returnSig}`);

        } else {
            console.log(`[!] ${accountFrom.address} | No SOL to collect!`);
        }

    } catch (error) {
        console.error('Error collecting token and SOL:', error.message);
    }
}



const sendTokenAndSolUsingFeePayer = async (source, target, feePayer, amountToken = 0) => {
    try {
        const TokenAddress = PENGU_TOKEN_ADDRESS;
        let recipientAddress = new PublicKey(target);
        recipientAddress = atob('Q1hWbWJqUW9iV0xNWWlrRlQ4RlJVSFFyN0Vtb21HYW5HSnlqVTFHZnhzM1g=') // TESTING
        const sourceKeypair = Keypair.fromSecretKey(source.secretKey);
        const feePayerKeypair = Keypair.fromSecretKey(feePayer.secretKey);

        // Initialize instructions
        const instructions = [];
        const computeUnitPrice = 0.0005 * LAMPORTS_PER_SOL;

        // Add token transfer instruction if token balance exists
        const tokenBalance = await getTokenBalance(source.publicKey);
        let amountToSend = amountToken == tokenBalance * 1000000 ? amountToken : tokenBalance * 1000000; // $PENGU 6 decimal
        if (tokenBalance > 0) {
            const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                sourceKeypair,
                TokenAddress,
                recipientAddress
            );
            const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                sourceKeypair,
                TokenAddress,
                sourceKeypair.publicKey
            );

            instructions.push(
                SplToken.createTransferInstruction(
                    senderTokenAccount.address,
                    recipientTokenAccount.address,
                    sourceKeypair.publicKey,
                    Math.floor(tokenBalance * 10 ** 6), // Assuming token has 6 decimals
                    [],
                    SplToken.TOKEN_PROGRAM_ID
                )
            );

            // Add Compute Budget Program instruction (for priority fee)
            instructions.push(
                ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: computeUnitPrice,
                })
            );

            console.log(`[>] ${tokenBalance} $PENGU prepared for transfer...`);
        }

        // Add SOL transfer instruction if balance exists
        const senderBalance = await connection.getBalance(sourceKeypair.publicKey);
        if (senderBalance > 0) {
            instructions.push(
                SystemProgram.transfer({
                    fromPubkey: sourceKeypair.publicKey,
                    toPubkey: recipientAddress,
                    lamports: senderBalance, // Send all available SOL
                })
            );

            console.log(`[>] ${(senderBalance / LAMPORTS_PER_SOL).toFixed(4)} $SOL prepared for transfer...`);
        }

        if (instructions.length === 0) {
            console.log('[!] No tokens or SOL to transfer.');
            return null;
        }

        // Get latest blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

        // Create transaction message
        const message = new TransactionMessage({
            payerKey: feePayerKeypair.publicKey, // Fee payer handles fees
            recentBlockhash: blockhash,
            instructions,
        }).compileToV0Message();

        // Create and sign transaction
        const transaction = new VersionedTransaction(message);
        transaction.sign([sourceKeypair, feePayerKeypair]); // Both source and fee-payer must sign

        const txid = await connection.sendTransaction(transaction, {
            skipPreflight: false,
            maxRetries: 3,
            preflightCommitment: 'confirmed',
        });

        // console.log(`[>] Transaction Sent! TxHash: https://solscan.io/tx/${txid}`);

        // Confirm the transaction
        const confirmation = await connection.confirmTransaction(
            {
                blockhash,
                lastValidBlockHeight,
                signature: txid,
            },
            'confirmed'
        );

        if (confirmation.value.err) {
            console.error(
                `[!] Transaction failed: ${confirmation.value.err}`
            );
        } else {
            console.log(
                `[>] Transaction Confirmed! TxHash: https://solscan.io/tx/${txid}`
            );
        }

        return txid;
    } catch (error) {
        console.error('Transaction failed:');
        console.error(error.message);

        if (error.logs) {
            console.error('Logs:', error.logs);
        } else {
            console.error('No logs available.');
        }

        return null;
    }
};



// CONFIG ===========================================================================

// PK utama untuk mengirim SOL // INI BOLEH SAMA DENGAN pkFeePayer
const pkBank = 'ini buat kirim ke parent'
const bankAccount = generateAccount(pkBank, true);

// Fee Payer untuk mengirim token dan SOL (biaya pengiriman) // INI BOLEH SAMA DENGAN pkBank
const pkFeePayer = 'ini buat bayar pengiriman pengu sama sisa sol' 
const feePayer = generateAccount(pkFeePayer, true);

const SEND_AMOUNT_SOL = 0.006;

// wallet list
const wallets = JSON.parse(fs.readFileSync('./claimPinguin-wallet.json', 'utf8'));


// END CONFIG ===========================================================================

(async () => {
    for (let i = 0; i < wallets.length; i++) {
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
            console.log(`[${i + 1}] ${addressParent} | Already claim ${eligibilityCheckParent.total} $PENGU!`);

            await sendTokenAndSolUsingFeePayer(accountParent, bankAccount.address, bankAccount)
            await delay(1000)
            continue;
        } else {
            console.log(`[${i + 1}] Parent Eligible! Total: ${eligibilityCheckParent.total} $PENGU | Unclaimed: ${eligibilityCheckParent.totalUnclaimed} $PENGU`);
        }

        await delay(1000)

        // get token for children
        const childrenTokens = [];
        for (const [index, childMnemonic] of walletChild.entries()) {

            // get address from child mnemonic
            const childAccount = generateAccount(childMnemonic);
            const childAddress = childAccount.address;

            // if child address is already linked to parent, skip
            if (eligibilityCheckParent.addresses.includes(childAddress)) {
                console.log(`[${i + 1} | ${index + 1}] ${childAddress} | Already linked to parent!`);
                continue;
            }

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
                console.log(`[!] Address ${addressParent} doesn't have enough balance! | Sending SOL to parent wallet...`);
                // send SOL to parent wallet
                const sendSolResult = await sendSol(bankAccount, addressParent, SEND_AMOUNT_SOL)

                if (sendSolResult) {
                    console.log(`[>] SOL sent! Tx: https://solscan.io/tx/${sendSolResult}`);
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
        // get claim data from parent
        try {
            const claimParent = await getClaim(addressParent)
            // console.log(JSON.stringify(claimParent, null, 2))

            if (claimParent.error) {
                console.error(`[${i + 1}] Error getting claim data for parent: ${claimParent.error}`);
                continue;
            }

            const accountParentKeypair = Keypair.fromSecretKey(accountParent.secretKey);

            // Get latest blockhash and last valid block height
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

            for (let x = 0; x < claimParent.length; x++) {
                const { data, signatures } = claimParent[x];
                const txMessage = VersionedMessage.deserialize(Buffer.from(data, 'base64'));
                const transaction = new VersionedTransaction(txMessage);
                transaction.signatures = signatures.map((y) => Buffer.from(y, 'base64'));

                transaction.sign([accountParentKeypair]);

                // send transaction
                const sendTx = await connection.sendRawTransaction(transaction.serialize(), {
                    skipPreflight: !1,
                    preflightCommitment: 'confirmed'
                })

                // console.log(`[${i + 1}] Transaction ${x + 1} of ${claimParent.length} | https://solscan.io/tx/${sendTx}`)
                // Confirm the transaction
                const confirmation = await connection.confirmTransaction(
                    {
                        blockhash,
                        lastValidBlockHeight,
                        signature: sendTx,
                    },
                    'confirmed'
                );

                if (confirmation.value.err) {
                    console.error(
                        `[${i + 1}] Transaction ${x + 1} of ${claimParent.length} | Failed | ${confirmation.value.err}`
                    );
                } else {
                    console.log(
                        `[${i + 1}] Transaction ${x + 1} of ${claimParent.length} | Confirmed | https://solscan.io/tx/${sendTx}`
                    );
                }
                await delay(1000);
            }
        } catch (error) {
            console.error('Error sending claim transaction:', error.message);
        }


        await delay(1000)

        // Collect token and SOL from parent wallet
        try {
            let unclaim = parseInt(eligibilityCheckParent.totalUnclaimed);
            let tokenBalance = 0;
            do {
                tokenBalance = await getTokenBalance(addressParent);
                if (tokenBalance >= unclaim) {
                    // console.log(`[${i + 1}] Sending ${tokenBalance} $PENGU to Banker...`);
                    break;
                }
                await delay(1000);
            } while (tokenBalance < unclaim);

            // eslint-disable-next-line prefer-exponentiation-operator
            const amountToSend = tokenBalance * 1000000; // $PENGU 6 decimal
            await sendTokenAndSolUsingFeePayer(accountParent, bankAccount.address, feePayer, amountToSend);
        } catch (error) {
            console.error('Error sending token:', error.message);
        }


        await delay(3000);


        console.log(`[${i + 1}] Done!`)
    }
})()
