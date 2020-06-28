// System manipulation
const { exec } = require('child_process');
const process = require('process');

//lock the system
function lock(){
  return new Promise((resolve, reject) => {
    switch (process.platform) {
      case "win32":
        var cmd = "rundll32.exe user32.dll,LockWorkStation";
        break;
      case "linux":
        var cmd = "gnome-screensaver --lock";
        break;
    }
    exec(cmd, (err) => {
      if (!err) {
        resolve("Success.");
      } else {
        reject("ERROR: " + err);
      };
    });
  });
}

//reboot the system
function reboot(){
  switch (process.platform) {
    case "win32":
      var cmd = 'shutdown /s /r /t 0';
      break;
    case "linux":
      var cmd = "reboot";
      break;
  }
  exec(cmd, (err) => {
    if (err) {
      console.error("ERROR: " + err);
    } else {
      console.log("DEBUG: System sleep init by sleep");
    }
  });
}

module.exports = {
  lock
  //reboot
}
