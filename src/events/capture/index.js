const arc = require("@architect/functions");

async function capture(event) {
  console.log(event);
}

exports.handler = arc.events.subscribe(capture);
