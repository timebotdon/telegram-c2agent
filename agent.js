/* Define required modules */
const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');

/* Define variables */
var token = '';
var chatID = '';
var bot = new TelegramBot(token, {polling: true});


// Help
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(chatID, "Available commands:\n/help - This help screen.\n/exec - Execute arbitrary commands.\n/lock - Lock the system. (win32 only)");
});


// Lock PC - Windows Only
bot.onText(/\/lock/, (msg) => {
  bot.sendMessage(chatID, "Locking the system.");
  var cmd = 'rundll32.exe user32.dll,LockWorkStation'
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
     console.log(`stdout: ${stdout}`);
     console.log(`stderr: ${stderr}`);
    }
  });
});


// Execute an arbitrary command
bot.onText(/\/exec (.+)/, (msg, match) => {
  const cmd = match[1];
  runcmd = exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
     console.log(`stdout: ${stdout}`);
     console.log(`stderr: ${stderr}`);
    }
  });
  bot.sendMessage(chatID, "Process created.\nPID: " + runcmd.pid)
});
