import { Server } from "socket.io";
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "googledocs",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function connectDb() {
  try {
    await pool.query("SELECT 1"); // A simple query to check the connection
    console.log("Connected to MySQL database");
  } catch (error) {
    console.error("Error connecting to MySQL:", error.message);
  }
}

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const defaultValue = " ";

io.on("connection", async (socket) => {
  //checking the connection for DB
  await connectDb();

  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await updateDocument(documentId, data);
    });
  });
});

async function findOrCreateDocument(id) {
  if (id === null) return;
  const [rows] = await pool.query("SELECT * FROM `documents` WHERE `id` = ?", [
    id,
  ]);

  if (rows.length > 0) {
    return { _id: id, data: rows[0].data };
  } else {
    await pool.query("INSERT INTO `documents` (`id`, `data`) VALUES (?, ?)", [
      id,
      defaultValue,
    ]);
    return { _id: id, data: defaultValue };
  }
}

async function updateDocument(id, data) {
  if (id === null) return;
  try {
    const newData = await data;
    const idValue = id;
    await pool.query("UPDATE documents SET `data` = ? WHERE `id` = ?", [
      newData,
      idValue,
    ]);
  } catch (error) {
    console.error("Error updating document:", error);
  } 
}
