const fetch = require('node-fetch');
const fs = require('fs');
const promiseLimit = require('promise-limit');
 
const limit = promiseLimit(1);

fs.writeFile('./Nordnet/Result/Nordnet_Progress.txt', 'ID@2w@d2@d3' + '\r\n', function(err) { 
  console.log(err);
});

fs.writeFile('./Nordnet/Result/Nordnet_ProgressErrors.txt', 'ID@Error' + '\r\n', function(err) { 
  console.log(err);
});


async function getData(ID, ntag, cookie) {
  console.log(ID + ' started with ntag = ' + ntag + ' and cookie = ' + cookie);
  
    
    /////////////////////////////////////////////
    //Get progress for 2Weeks + 2 and 3 days from json string
    ////////////////////////////////////////////
    var ID2 = ID.split('-');
    var IDOnly = ID2[0];
    const result_json1m = await fetch("https://www.nordnet.se/api/2/instruments/" + IDOnly + "/fund/timeseries?period=m1", {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9,sv;q=0.8,da;q=0.7",
        "client-id": "NEXT",
        "ntag": + ntag,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-nn-href": "https://www.nordnet.se/marknaden/fondlistor/" + ID + "-a",
        "cookie": "_ga=GA1.2.2043169788.1522314173; accepted_cookies=1; coid=1073550482; sv-uts=\"NTI1YWIzMDAtOGMzMi0xMWU5LWE5OWMtMDA1MDU2YjcwMGI1IzUjMTU2NjQ5NjQwNjYyMg==\"; nnanon=0d304650-13b4-11ea-b542-23a41990b521; __qca=P0-29952391-1594118770307; nntheme=a11y; _gid=GA1.2.1217256637.1595067687; JSESSIONID=FC85B924EA9BC8B4172A7D7B0AB6A768; webapp-cmse-next=!Bz/qAoh4PAVWfM6/H48idC6JYNNOng3mcN7fKRfCKlfex8XalKNCAx5siZ1VCzcX5UB2QezxYqf6rqnZdGoYFPrQ8Y2Ix160yo2gS3B3MA==; _csrf=zuSi6ub4HT_F_2Sy9OMVvJGD; NEXT=" + cookie + "; _gat_UA-58430789-7=1"
      },
      "referrer": "https://www.nordnet.se/",
      "referrerPolicy": "origin",
      "body": null,
      "method": "GET",
      "mode": "cors"
    });



    async function waitForJson1m(ID) {
		try {
		    var result_json_1m = await result_json1m.json();
		    var id = result_json_1m[0].instrument_id;
		    var result_15 = result_json_1m[0].yield_points[15].percentage_yield;
		    var result_27 = result_json_1m[0].yield_points[27].percentage_yield;
		    var result_28 = result_json_1m[0].yield_points[28].percentage_yield;
		    var result_30 = result_json_1m[0].yield_points[30].percentage_yield;
		    var w2 = Number(result_30 - result_15);
		    var d2 = Number(result_30 - result_28);
		    var d3 = Number(result_30 - result_27);
		    
		    return [id, w2, d2, d3];
		}
    	catch (error) {
		fs.writeFile('./Nordnet/Result/Nordnet_ProgressErrors.txt', error  + '\r\n', {flag: 'a'}, function(err) { 
	         console.log(err);
        });
	}	
    };
    
    Promise.all([waitForJson1m()])
      .then(result => {
        console.log('Result = ' + result);
        try {
	        fs.writeFile('./Nordnet/Result/Nordnet_Progress.txt', result[0][0] +'@'+ result[0][1]  +'@'+ result[0][2]  +'@'+ result[0][3]  + '\r\n', {flag: 'a'}, function(err) { 
	          console.log(err);
	        });
        }
		catch (error) {
			fs.writeFile('./Nordnet/Result/Nordnet_ProgressErrors.txt', result + '@' + error  + '\r\n', {flag: 'a'}, function(err) { 
		         console.log(err);
	        });	
		}
      });
}
//fs.readFile('./Nordnet/ID.txt', 'utf-8', function(err, data) { 
fs.readFile('./Nordnet/Result/FinalArray.txt', 'utf-8', function(err, data) { 
  if(err) throw err;
  var IDs = data.toString().split('\r\n');
  console.log(IDs);
  fs.readFile('./Nordnet/ntag.txt', 'utf-8',  function(err, data) {
    if (err) throw err;
    const ntag = data.slice(0,36);
    const cookie = data.slice(37);
	Promise.all(IDs.map((ID => {
	    return limit(() => getData(ID, ntag, cookie))
	  }))).then(results => {
	    console.log('I think I\'m done');
	  })  
	});
});
