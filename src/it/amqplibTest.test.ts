// Access the callback-based API

const rabbit = require("amqplib").connect();

describe('emit 100 messages and consume them', () => {

  afterAll(cb => {
    rabbit.close();
  });

  it('create exchange and channel and push 100 messages', () => {
    rabbit.then(function(connection) {
      const ok = connection.createChannel();
      ok.then(function(channel) {
        // durable: true is set by default
        channel.assertExchange("incoming");
        channel.assertQueue("messages");
        channel.bindQueue("messages", "incoming", "mda");
        for (let i = 0; i < 100; i++){
          console.log(`publish message - Hello ${i}`);
          channel.publish("incoming", "mda", new Buffer("Hello " + i), {deliveryMode: true})
        }
      });
      return ok
    }).then(null, console.log);
  });

  it('consume 100 message', () => {
    rabbit.then(function(connection) {
      let ok = connection.createChannel();
      ok.then(function(channel) {
        // durable: true is set by default
        channel.assertQueue("messages");
        channel.assertExchange("incoming");
        channel.bindQueue("messages", "incoming", "mda");
        channel.consume("messages", function(message) {
          console.log('->', message.content.toString());
          channel.ack(message)
        })
      });
      return ok
    }).then(null, console.log)
  });
});
