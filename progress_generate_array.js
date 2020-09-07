const fs = require('fs');
const fsPromises = require('fs').promises

function filesinfolder (folder, encoding) {
    return new Promise(function(resolve, reject) {
        fs.readdir(folder, encoding, function(err, filenames){
            if (err) 
                reject(err); 
            else 
                var filenames2 = filenames.filter(file => file.substring(0, 4) == 'IDs_'); 
                resolve(filenames2);
        });
    });
};

function readfiles(files, encoding){
    return Promise.all(
        files.map(file => fsPromises.readFile("./Nordnet/Result/" +  file, 'utf-8'))
    )
};


function stripresultfromfiles(array) {
    var string = array.toString();
    var string2 = string.replace(/,/g, '|');
    var array2 = string2.split("\r\n");
    var array3 = array2.filter(value => value.length > 3);
    var array4 = array3.filter(value => Number.isInteger(value));
    var ids = [];          
    for (i = 1; i < array3.length; i++) {
        id = array3[i].split('@');
        ids.push(id[0]);    
    } 
    var ids2 = ids.filter(value => !isNaN(value));
    return ids2;
};

async function buildfinalarray(id) {
   await fs.writeFile('./Nordnet/Result/FinalArray.txt', id + '\r\n', {flag: 'a'}, function(err) { 
        console.log(err);
    });
};

fs.writeFile('./Nordnet/Result/Errors.txt', 'id@error' + '\r\n', function(err) { 
    console.log(err);
});


filesinfolder("./Nordnet/Result", "utf8")
.then((files) => readfiles(files, "utf8"))
.then((filedata) => stripresultfromfiles(filedata)) 
.then((ids) => ids.map(id => buildfinalarray(id)))
.catch((error) => console.log(error));
