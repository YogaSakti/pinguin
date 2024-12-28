/* eslint-disable no-prototype-builtins */
/* eslint-disable init-declarations */
/* eslint-disable new-cap */
/* eslint-disable max-params */
/* eslint-disable no-param-reassign */

const fetch = require('node-fetch');
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
        console.log(result);
        reject(result)
    }
})

module.exports = {
    fetcher,
    isJsonString
}