const io = require('socket.io')(6999);
const fs = require('fs');
const path = require('path');

const chunkSize = 4;
const folderPath = path.resolve('./drive_data/velodyne_points/data/');
const folderGPSPath = path.resolve('./drive_data/oxts/data/');
const filePaths = [];
const gpsFilePaths = [];

fs.readdirSync(folderPath).forEach((file) => {
  const fp = path.join(folderPath, file);
  filePaths.push(fp);
});
fs.readdirSync(folderGPSPath).forEach((file) => {
  const fp = path.join(folderGPSPath, file);
  gpsFilePaths.push(fp);
});

const sendPosition = (filePath, gpsPath) => new Promise((rs) => {
  console.log(`load file ${filePath}`);
  const readStream = fs.createReadStream(filePath);
  readStream.on('data', (fileBuffer) => {
    io.emit('position', fileBuffer);
  }).on('end', () => {
    console.time('readfileSync GPS text');
    const gpsText = fs.readFileSync(gpsPath, 'utf8');
    console.timeEnd('readfileSync GPS text');
    io.emit('end', gpsText.split(' ', 2));
    // io.emit('end');
    rs();
  });
});

io.on('connection', (socket) => {
  socket.on('getPosition', (fileIndex) => {
    console.log('getPosition: ', fileIndex);
    sendPosition(filePaths[fileIndex], gpsFilePaths[fileIndex]);
  });
  console.log('connection success');
});

