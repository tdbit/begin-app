const arc = require("@architect/functions");

const { google } = require("googleapis");
const customsearch = google.customsearch("v1");

async function search(event) {
  let { email } = event;

  // Get maxImages images or maxSerps search result pages
  let results = [];
  let maxSerps = 1;
  let maxImages = maxSerps * 5;
  let startIndex = 1;

  let secrets = {
    auth: process.env.GOOGLE_IMAGES_API_KEY,
    cx: process.env.GOOGLE_IMAGES_CSE_ID,
  };

  let query = {
    searchType: "image",
    startIndex: startIndex,
    imgSize: "medium",
    q: email,
  };

  let params = { ...secrets, ...query };

  while (results.length < maxImages && startIndex < maxSerps * 10) {
    let response = await customsearch.cse.list(params);
    let results = response.data.items || [];
    let onlySquare = true;

    results.forEach((result) => {
      // Filter for only square images
      if (onlySquare && result.image.height != result.image.width) return;

      let name = "analyse";
      let payload = { query, result };
      arc.events.publish({ name, payload });
    });

    startIndex += 10;
  }
}

exports.handler = arc.events.subscribe(search);
