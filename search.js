const fetch = require('node-fetch');
const fs = require('fs');
//const promiseLimit = require('promise-limit');
//const limit = promiseLimit(1);

async function getTotalCount(ntag, cookie) {
    const total_result_json = await fetch("https://www.nordnet.se/api/2/instrument_search/query/fundlist?sort_attribute=yield_1y&sort_order=desc&limit=50&offset=0&free_text_search=", {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9,sv;q=0.8,da;q=0.7",
        "client-id": "NEXT",
        "ntag": + ntag,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-nn-href": "https://www.nordnet.se/marknaden/fondlistor",
		"cookie": "_ga=GA1.2.2043169788.1522314173; accepted_cookies=1; coid=1073550482; sv-uts=\"NTI1YWIzMDAtOGMzMi0xMWU5LWE5OWMtMDA1MDU2YjcwMGI1IzUjMTU2NjQ5NjQwNjYyMg==\"; nnanon=0d304650-13b4-11ea-b542-23a41990b521; __qca=P0-29952391-1594118770307; nntheme=a11y; _gid=GA1.2.1217256637.1595067687; JSESSIONID=FC85B924EA9BC8B4172A7D7B0AB6A768; webapp-cmse-next=!Bz/qAoh4PAVWfM6/H48idC6JYNNOng3mcN7fKRfCKlfex8XalKNCAx5siZ1VCzcX5UB2QezxYqf6rqnZdGoYFPrQ8Y2Ix160yo2gS3B3MA==; _csrf=zuSi6ub4HT_F_2Sy9OMVvJGD; NEXT=" + cookie + "; _gat_UA-58430789-7=1"
      },
      "referrer": "https://www.nordnet.se/",
      "referrerPolicy": "origin",
      "body": null,
      "method": "GET",
      "mode": "cors"
    });

      async function TotalCount() {
        var result_json1 = await total_result_json.json();
        var totalhits = result_json1.total_hits;
        console.log(totalhits);
        return totalhits;
    };    
    var TotalCount =  TotalCount()
    return TotalCount;

}

async function getData(TotalPages, ntag, cookie) {
	console.log("TotalPages = " + TotalPages + ' ntag = '+ ntag + " cookie = " + cookie);
    for(page = 0; page < TotalPages; page++) {
//    	await new Promise(r => setTimeout(r, 5000));
    	
        fs.writeFile('./Nordnet/Result/IDs_' + page + '.txt', 'ID@isin@Name@Category@Type@Fee@Risk_int@Risk@w1@m1@m3@d1@y1' + '\r\n', function(err) { 
            console.log(err);
          });
          
        let offset = page * 50;
        let result_json = await fetch("https://www.nordnet.se/api/2/instrument_search/query/fundlist?sort_attribute=name&sort_order=asc&limit=50&offset=" + offset + "&free_text_search=", {
          "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9,sv;q=0.8,da;q=0.7",
            "client-id": "NEXT",
			"ntag": + ntag,
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-nn-href": "https://www.nordnet.se/marknaden/fondlistor?sortField=name&sortOrder=desc&selectedTab=overview&page=" + page,
			"cookie": "_ga=GA1.2.2043169788.1522314173; accepted_cookies=1; coid=1073550482; sv-uts=\"NTI1YWIzMDAtOGMzMi0xMWU5LWE5OWMtMDA1MDU2YjcwMGI1IzUjMTU2NjQ5NjQwNjYyMg==\"; nnanon=0d304650-13b4-11ea-b542-23a41990b521; __qca=P0-29952391-1594118770307; nntheme=a11y; _gid=GA1.2.1217256637.1595067687; JSESSIONID=FC85B924EA9BC8B4172A7D7B0AB6A768; webapp-cmse-next=!Bz/qAoh4PAVWfM6/H48idC6JYNNOng3mcN7fKRfCKlfex8XalKNCAx5siZ1VCzcX5UB2QezxYqf6rqnZdGoYFPrQ8Y2Ix160yo2gS3B3MA==; _csrf=zuSi6ub4HT_F_2Sy9OMVvJGD; NEXT=" + cookie + "; _gat_UA-58430789-7=1"
          },
          "referrer": "https://www.nordnet.se/",
          "referrerPolicy": "origin",
          "body": null,
          "method": "GET",
          "mode": "cors"
        });


        async function waitForJson(page) {
            var result_json1 = await result_json.json();
//            console.log(result_json1);
            var totalhits = result_json1.total_hits;
            var pagehits = result_json1.rows;
            for (i = 0; pagehits - 1; i++) {  
//				try {
	                var id = result_json1.results[i].instrument_info.instrument_id;
	                var isin = result_json1.results[i].instrument_info.isin;
	                var name = result_json1.results[i].instrument_info.name;
	                var category = result_json1.results[i].fund_info.fund_category;
	                var type = result_json1.results[i].fund_info.fund_type;
	                var yearlyfee = result_json1.results[i].fund_info.fund_yearly_fee;
	                var risk_int = result_json1.results[i].fund_info.fund_raw_risk;
	                var risk = result_json1.results[i].fund_info.fund_risk_group;
	                var w1 = result_json1.results[i].historical_returns_info.yield_1w;
	                var m1 = result_json1.results[i].historical_returns_info.yield_1m;
	                var m3 = result_json1.results[i].historical_returns_info.yield_3m;
	                var d1 = result_json1.results[i].historical_returns_info.yield_1d;
	                var y1 = result_json1.results[i].historical_returns_info.yield_1y;
	                console.log(pagehits);
	                console.log(id);
	                console.log(isin);
	                console.log(name);
	                console.log(category);
	                console.log(type);
	                console.log(yearlyfee);
	                console.log(risk_int);
	                console.log(risk);
	                console.log(w1);
	                console.log(m1);
	                console.log(m3);
	                console.log(d1);
	                console.log(y1);
	 
	                fs.writeFile('./Nordnet/Result/IDs_' + page + '.txt', id +'@'+ isin +'@'+ name +'@'+ category +'@'+ type +'@'+ yearlyfee +'@'+ risk_int + '@' + risk +'@'+ w1 +'@'+ m1 +'@'+ m3 +'@'+ d1 +'@'+ y1 + '\r\n', {flag: 'a'}, function(err) { 
	                    console.log(err);
	                });
//				}
//				catch (error) {
//	                console.log('Error @ ' + i + ' @ ' + error);	
//				}	
            }   
        }
   
    waitForJson(page);
    }
};

var data = fs.readFileSync('./Nordnet/ntag.txt', 'utf-8');
var ntag = data.slice(0,36);
var cookie = data.slice(37);
console.log(ntag);
console.log(cookie);



Promise.all([getTotalCount(ntag, cookie)])
.then(result => {
  console.log('Result = ' + result);
  var TotalPages = Math.ceil(result/50);
  console.log('TotalPages = ' + TotalPages);
  getData(TotalPages, ntag, cookie)
});

