const net = require("net");

const conn = net.createConnection({
  host: "4.tcp.ngrok.io",
  port: 11881,
});

conn.setEncoding("utf8"); // interpret data as text

conn.on("data", (data) => {
  console.log("Server says: ", data);
});

conn.on("connect", () => {
  conn.write("Hello from client!");
});