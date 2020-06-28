//exfiltrate files & directories

const fs = require('fs');
const archiver = require('archiver');


//zip a given directory
function zipDir(dirName){
  return new Promise((resolve, reject) => {
    //grab date/time
    getDateTime().then((dateString) => {
      var outputPath = __dirname + "/export-" + dateString + '.zip'
      var output = fs.createWriteStream(outputPath);
      var archive = archiver('zip');
  
        output.on('close', () => {
          resolve([outputPath, "Final size: " + (archive.pointer()/1024).toFixed(2) + ' KB']); //file size calculated to KB, 2 decimals.
        });
    
        archive.on('error', (error) => {
          reject(error);
        });
    
        archive.pipe(output);
    
        archive
        .directory(dirName, false)
        //.directory(__dirname + dirName, dirName)
        .finalize();
    });
  });
}

/* 
function zipFile(dirName){
  return new Promise((resolve, reject) => {
    var output = fs.createWriteStream(__dirname + '/export.zip');
    var archive = archiver('zip');

    output.on('close', () => {
      //console.log('archiver has been finalized and the output file descriptor has closed.');
      resolve('"' + dirName + '"' + " zipped. Final size: " + archive.pointer()/1024 + ' KB');
      //resolve(message);
    });

    archive.on('error', (error) => {
      reject(error);
    });

    archive.pipe(output);

    archive
    .file('file1.txt')
    .finalize();
  })
}
*/

//calculate current date and time, format it accordingly
function getDateTime(){
  return new Promise((resolve, reject) => {
    const d = new Date();
    const yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 1)
    if (mm < 10){
      var mm = "0" + (d.getMonth() + 1).toString();
    }
    var dd = d.getDate().toString();
    if (dd < 10){
      var dd = "0" + (d.getDate() + 1).toString();
    }
    var hh = d.getHours().toString();
    if (hh < 10){
      var hh = "0" + d.getHours().toString();
    }
    var mn = d.getMinutes().toString();
    if (mn < 10){
      var mn = "0" + d.getMinutes().toString();
    }
    var ss = d.getSeconds().toString();
    if (ss < 10){
      var ss = "0" + d.getSeconds().toString();
    }
    const dateString = yyyy + mm + dd + hh + mn + ss;
    resolve(dateString);
  });
}


module.exports = {
  zipDir
  //zipFile
}