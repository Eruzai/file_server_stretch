const net = require("net");
const fs = require('fs');

const server = net.createServer();

server.on("connection", (client) => {
  console.log("New client connected!");
  
  client.setEncoding("utf8"); // interpret data as text

  client.on("data", (data) => {
    console.log("Client is asking for: ", data);

    fs.readFile(`./server_files/${data}`, (err, data) => {
      if (err) {
        client.write("There was an error: ", err);
      }
      console.log("Found the data!");
      client.write(data);
    })
  });
});

server.listen(3000, () => {
  console.log("Server listening on port 3000!");
});