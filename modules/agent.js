const process = require('process');

// ---------------- Init ----------------
function getPid(){
  return new Promise((resolve, reject) =>{
    const pid = process.pid;
    resolve(pid);
  });
}

module.exports = {
  getPid
}