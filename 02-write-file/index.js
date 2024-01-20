const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);

function exitMessage() {
  stdout.write('Than you\n');
  stdout.write('Good bye!');
  exit();
}

stdout.write('Hello!\n');
stdout.write('(enter "exit" for end typing)\n');
stdout.write('Please, input your information:\n');

stdin.on('data', (data) => {
  const exitKey = data.toString().toLowerCase().trim();
  if (exitKey === 'exit') {
    exitMessage();
  }
  writeStream.write(data);
});

process.on('SIGINT', exitMessage);
