// Execute an arbitrary command
const { spawn } = require('child_process');


//exec headless
function noHead(cmd){
  return new Promise((resolve, reject) => {
    const subprocess = spawn(cmd, {
      detached: true,
      stdio: 'ignore'
    });
    subprocess.unref();
    resolve("Process created.\nPID: " + subprocess.pid)
  });
}


//exec with parent process
function head(cmd){
  return new Promise((resolve, reject) => {
    const subprocess = spawn(cmd);
    subprocess.unref();
    resolve("Process created.\nPID: " + subprocess.pid)
  });
}

module.exports = {
  noHead,
  head
}