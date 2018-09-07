import feathers from '@feathersjs/client';

import io from 'socket.io-client';

const host = 'http://localhost:3030';

// Socket.io is exposed as the `io` global.
const socket = io(host);

// @feathersjs/client is exposed as the `feathers` global.
const client = feathers();

// Connect to a different URL

const socketsClient = feathers.socketio(socket, {
  timeout: 20000
});

// Configure socket client
client
  .configure(socketsClient)
  // incase we later have to do authentication
  .configure(
    feathers.authentication({
      storage: window.localStorage,
      timeout: 20000
    })
  );
const imghost = 'https://s3.us-east-2.amazonaws.com/s3sample';

export { client, imghost };

/**  */
