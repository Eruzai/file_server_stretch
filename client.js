const net = require("net");
const fs = require('fs');
const readline = require('readline');
const constants = require('fs');

const writeFile = function(filePath, data) { // function to write the URL page to a location on the local drive
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.log("❌ Invalid filepath", err); // if the file path isn't valid prints this message to the console
    } else {
      console.log(`✅ Downloaded and saved ${data.length} bytes to ${filePath}`); // prints the size and location of the downloaded page
    }
  });
};

const accessSaveLocation = function (filePath, body) {
  fs.access(filePath, constants.F_OK, (err) => {
    if (err) {
      writeFile(filePath, body); // if the path doesn't exist (the file doesn't exist) creates and writes to the file
    } else {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question("🛑 The file exists at this location! Hit enter to cancel or enter 'Y' to overwrite. ", (answer) => {
        if (answer.toUpperCase() === 'Y') { // if the file exists a prompt is generated to ask the user for direction
          writeFile(filePath, body);
        }
        rl.close();
      });
    }
  });
};

const fetchFileFromServerTCP = function() {
  const conn = net.createConnection({
    host: "localhost",
    port: 3000,
  });
 
  conn.on("connect", () => {
    let filePath = './downloaded_files/';
    let requestedFile = null;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    rl.question("❓ What file do you require? ", (answer) => {
      requestedFile = answer;
      conn.write(`${answer}`);
      rl.close()
    });

    conn.setEncoding("utf8"); // interpret data as text
    
    conn.on("data", (data) => {
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    
      rl.question("❓ Where would you like to save your file? Hit enter to accept default location (./file_downloads) ", (answer) => {
        if (answer) {
          filePath = answer + requestedFile;
          rl.close();
          accessSaveLocation(filePath, data);
        } else {
          filePath += requestedFile;
          rl.close();
          accessSaveLocation(filePath, data);
        }
      });
     });
  });
};

fetchFileFromServerTCP();