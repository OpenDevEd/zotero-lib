const WebSocket = require('ws');

var ws = new WebSocket('wss://stream.zotero.org');

ws.on('open', async () => {
  console.log('WebSocket connection opened');
  await ws.send(
    JSON.stringify({
      action: 'createSubscriptions',
      subscriptions: [
        {
          apiKey: '',
          topics: ['/groups/xxxxxxx'],
        },
      ],
    }),
  );
});

ws.on('message', (data) => {
  console.log('Received message:', data);
});
ws.on('error', (err) => {
  console.log('WebSocket error', err);
});
ws.on('close', () => {
  console.log('WebSocket connection closed');
});
