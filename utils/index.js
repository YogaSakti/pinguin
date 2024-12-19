/* eslint-disable no-prototype-builtins */
/* eslint-disable init-declarations */
/* eslint-disable new-cap */
/* eslint-disable max-params */
/* eslint-disable no-param-reassign */


const { CurlGenerator } = require('curl-generator')
const shell = require('shelljs');
const baseProgram = `${process.cwd()}/utils/curl_impersonate -sS`
const Uas = require('user-agents');
const userAgent = new Uas({ deviceCategory: 'desktop' });

const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    
    return true;
}

// const proxy = 'proxy.hideiqxshlgvjk.com:5050';
// const proxyAuth = 'dappradar-type-residential:abuser';

const fetcher = (url, method, headers, body) => new Promise((resolve, reject) => {
    const params = {
        url,
        method,
        headers,
        redirect: 'follow'
    }
    if (body) params.body = body
    const generatedCommand = CurlGenerator(params, { silent: true, compressed: true })

    const result = shell.exec(`${baseProgram} ${generatedCommand}`, { async: false, silent: true }).stdout;

    if (isJsonString(result)) {
        resolve(JSON.parse(result))
    } else {
        console.log(params);
        reject(result)
    }
})

module.exports = {
    fetcher,
    isJsonString
}

// let defaultOptions = (method, authorization, body) => {
//     const params = {
//         method,
//         headers: {
//             'accept': '*/*',
//             'accept-language': 'en-US,en;q=0.9,id;q=0.8,id-ID;q=0.7',
//             'content-type': 'application/json',
//             'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
//             'sec-ch-ua-mobile': '?0',
//             'sec-ch-ua-platform': '"Windows"',
//             'sec-fetch-dest': 'empty',
//             'sec-fetch-mode': 'cors',
//             'sec-fetch-site': 'same-origin',
//             'Referer': 'https://layer3.xyz/',
//             'Referrer-Policy': 'strict-origin-when-cross-origin'
//         },
//         redirect: 'follow'
//     }

//     if (authorization) params.headers.authorization = `Bearer ${authorization}`
//     if (body) params.body = body

//     return params
// }

// let defaultHeaders = {
//     'accept': '*/*',
//     'accept-language': 'en-US,en;q=0.9,id;q=0.8,id-ID;q=0.7',
//     'content-type': 'application/json',
//     'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
//     'sec-ch-ua-mobile': '?0',
//     'sec-ch-ua-platform': '"Windows"',
//     'sec-fetch-dest': 'empty',
//     'sec-fetch-mode': 'cors',
//     'sec-fetch-site': 'same-origin',
//     'Referer': 'https://layer3.xyz/',
//     'Referrer-Policy': 'strict-origin-when-cross-origin'
// }

// layer3

// const getAuthCode = () => {
//     const postData = { '0': { 'json': null, 'meta': { 'values': ['undefined'] } }, '1': { 'json': { 'connectIntentId': 'k982gzY0n8lMRQ93qCOYe', 'data': { 'strategy': 'injected', 'buttonName': 'OKX Wallet', 'browser': 'Chrome', 'os': 'Windows', 'didConnect': true, 'connectedWalletConnector': 'INJECTED', 'connectedWalletName': 'OKX Wallet' } } } }
    
//     return fetcher('https://layer3.xyz/api/trpc/auth.getWalletSignatureNonce,track.walletModal?batch=1', 'POST', defaultHeaders, postData)
//     .then((response) => {
//         if (response?.error) throw new Error(response.error.json.message)
    
//         return response
//     }).catch((errors) => errors);
// }


// (async () => {
//     try {
//         const response = await getAuthCode()
//         console.log(response);
//     } catch (error) {
//         console.log(error);
//     }
// })()


// 

// const getAirdrop = (authorization) => new Promise((resolve, reject) => {
//     const command = createCurlCommand('https://backoffice-new.dappradar.com/airdrops?page=1&itemsPerPage=100', 'GET', authorization, '');
//     let response = shell.exec(`${baseProgram} ${command}`, { async: false, silent: true }).stdout;
//     if (isJsonString(response)) {
//         response = JSON.parse(response)
//         if (response.hasOwnProperty('message') || response.hasOwnProperty('errors')) {
//             reject(response)
//         } else {
//             resolve(response)
//         }
//     } else {
//         reject(response)
//     }
// })

// const joinAirdrop = (authorization, id, address, email) => new Promise((resolve, reject) => {
//     const command = `${createCurlCommand(`https://backoffice-new.dappradar.com/airdrops/${id}/participate`, 'POST', authorization, { email, address }).split('curl ')[1]} -x ${proxy} -U ${proxyAuth}`
//     // const command = `${createCurlCommand(`https://backoffice-new.dappradar.com/airdrops/${id}/participate`, 'POST', authorization, { email, address }).split('curl ')[1]}`
//     // console.log(command);
//     let response = shell.exec(`${baseProgram} ${command}`, { async: false, silent: true }).stdout;
//     // console.log(response);
//     if (isJsonString(response)) {
//         response = JSON.parse(response)
//         if (response.hasOwnProperty('message') || response.hasOwnProperty('errors')) {
//             reject(response)
//         } else {
//             resolve(response)
//         }
        
//     } else {
//         reject(response)
//     }
// })


// const getAirdropWinner = (authorization, id) => fetch(`https://backoffice-new.dappradar.com/airdrops/${id}/winners?fiat=USD`, defaultOptions('GET', authorization))
//     .then((response) => response.json())
//     .then((result) => result)
//     .catch((err) => err)
        

// const getIdentity = (authorization) => new Promise((resolve, reject) => {
//     const command = createCurlCommand('https://auth.dappradar.com/apiv4/users/identify', 'GET', authorization)
//     let response = shell.exec(`${baseProgram} ${command}`, { async: false, silent: true }).stdout;
//     if (isJsonString(response)) {
//         response = JSON.parse(response)
//         if (response.hasOwnProperty('message') || response.hasOwnProperty('errors')) {
//             reject(response)
//         } else {
//             resolve(response)
//         }
//     } else {
//         reject(response)
//     }
// })