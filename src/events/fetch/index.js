const arc = require("@architect/functions");
const data = require("@begin/data");
const sha1 = require("sha1");

const { createCanvas, loadImage } = require("canvas");

async function fetch(event) {
  let { image, thumbnail } = event;
  // console.log("Fetching image: ", link);

  // Fetch the thumbnail and store that because the image itself is too large for begin
  const canvas = createCanvas(thumbnail.width, thumbnail.height);
  const ctx = canvas.getContext("2d");
  const img = await loadImage(thumbnail.link);

  ctx.drawImage(img, 0, 0);

  let table = "images";
  let key = sha1(`${image.link}`);
  let resource = {
    link: image.link,
    width: image.width,
    height: image.height,
    thumbnail: {
      ...thumbnail,
      data: canvas.toDataURL(),
    },
  };

  await data.set({ table, key, image: resource });
}

exports.handler = arc.events.subscribe(fetch);
