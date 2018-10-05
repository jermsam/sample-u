/* eslint-disable no console */
import feathers from '@feathersjs/client';

import io from 'socket.io-client';

// require('dotenv').config();

const url =
  process.env.NODE_ENV === 'production'
    ? 'remote_server_url'
    : 'http://localhost:3030';

console.log(process.env.NODE_ENV);

// Socket.io is exposed as the `io` global.
const socket = io(url);

// @feathersjs/client is exposed as the `feathers` global.
const app = feathers();

// Connect to a different URL

const socketsClient = feathers.socketio(socket, {
  timeout: 20000
});

// Configure socket client
app
  .configure(socketsClient)
  // incase we later have to do authentication
  .configure(
    feathers.authentication({
      storage: window.localStorage,
      timeout: 20000
    })
  );

const bucket = 'https://s3.us-east-2.amazonaws.com/tav-s32';

export { app, url, bucket };
