const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from a directory named 'public'
//app.use(express.static('/nfs/stak/users/gonzayah/CS361/Milestone_1/my-audio-stream-server'));
app.use(express.static(path.join(__dirname, 'public')));

// Route for the homepage that serves the index.html file
app.get('/', (req, res) => {
  res.sendFile('/nfs/stak/users/gonzayah/CS361/Milestone_1/my-audio-stream-server/index.html');
});

// Route for starting the audio stream
app.get('/my-audio-stream-server', (req, res) => {
  // The path to the audio file you want to stream
  const audioPath = '/nfs/stak/users/gonzayah/CS361/Milestone_1/my-audio-stream-server/sample.mp3';

  // Set the appropriate headers for the audio stream
  res.set({
    'Content-Type': 'audio/mpeg',
    'Content-Disposition': 'inline; filename="sample.mp3"'
  });

  // Serve the audio file
  res.sendFile(audioPath);
});

// Start the server
server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // This will emit the message to all connected clients
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing'); // This will emit the typing event to all clients except the one typing
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

