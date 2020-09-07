const request = require('request');
const fs = require('fs');

headers = {
    'Connection': 'keep-alive',
    'Content-Length': '0',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    'Origin': 'https://www.nordnet.se',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
    'ntag': 'NO_NTAG_RECEIVED_YET',
    'content-type': 'application/x-www-form-urlencoded',
    'accept': 'application/json',
    'client-id': 'NEXT',
    'DNT': '1',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Referer': 'https://www.nordnet.se/se',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8,tr;q=0.7',
}

const options = {
    url: 'https://www.nordnet.se/api/2/login/anonymous',
    method: 'POST',
    headers: {
        'Connection': 'keep-alive',
        'Content-Length': '0',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Origin': 'https://www.nordnet.se',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
        'ntag': 'NO_NTAG_RECEIVED_YET',
        'content-type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
        'client-id': 'NEXT',
        'DNT': '1',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Referer': 'https://www.nordnet.se/se',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8,tr;q=0.7',
    }
};

async function getSession() {
    await request(options, function(err, res, body) {
        console.log(res.caseless.dict['set-cookie']);
        var cookie = res.caseless.dict['set-cookie'];
        var cookieastext = JSON.stringify(cookie);
        console.log(cookieastext);
        let re_next = /(?==)(.*?)(?=;)/g;
        var next = cookieastext.match(re_next);
        console.log(next[0]);
        var next2 = next[0].slice(1);
        console.log(next2);
        fs.writeFile('./Nordnet/ntag.txt', res.caseless.dict.ntag + '@' + next2, function(err) { 
            console.log(err);
          });

    });
}
getSession()
