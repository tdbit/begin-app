const arc = require("@architect/functions");
const data = require("@begin/data");

const { google } = require("googleapis");
const customsearch = google.customsearch("v1");

async function search(event) {
  let { email } = event;

  // See if we have some results...
  // let table = "images";
  // let key = email;

  // Get maxImages images or maxSerps search result pages
  let maxSerps = 3;
  let maxImages = maxSerps * 10;
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

  let results = [];
  let allResults = [];
  while (results.length < maxImages && startIndex < maxSerps * 10) {
    let response = await customsearch.cse.list(params);
    let results = response.data.items || [];
    let onlySquare = !event.showAll; // should take from event payload

    for (let index = 0; index < results.length; index++) {
      const result = results[index];

      // Filter for only square images if requested
      // if (onlySquare && result.image.height != result.image.width) return;

      // Dispatch the query and result to analyse
      let name = "analyse";
      let payload = { query, result };
      arc.events.publish({ name, payload });
    }

    startIndex += 10;
    allResults.push(...results);
  }

    // Save every result keyed by search query
    let table = "queries";
    let key = email;
    await data.set({ table, key, results:allResults });

}

exports.handler = arc.events.subscribe(search);
