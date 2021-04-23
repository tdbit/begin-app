// Respond with successful resource creation, CORS enabled
const arc = require("@architect/functions");
const begin = require("@begin/data");
const sha1 = require("sha1");

let head = `
<head>
  <meta charset=utf-8>
  <title>results</title>
  <style>
    ul { list-style: none}
    li { display: inline-block; padding-right: 20px; }
    .avatar { border-radius: 100%; height: 80px; width: 80px;}
  </style>
</head>
`;

async function http(req) {
  // let images = faces.map((item) => {
  //   return `<li><img src="${item.data}" class="avatar" onerror=""/></li>`;
  // });
  let table = "queries";
  let key = req.queryStringParameters.email || "tom@heavybit.com";
  let response = await begin.get({ table, key });
  if (!response) {
    const name = "search";
    const payload = { email: key };
    arc.events.publish({ name, payload });
    return {
      statusCode: 202,
      json: { working: "on it" },
    };
  }

  // Get unique links
  let links = Array.from(new Set(response.results.map((r) => r.link)));
  let results = links.map((link) =>
    response.results.find((r) => r.link === link)
  );
  console.log(links);

  // Multi doc get
  table = "images";
  console.log(
    results.map((result) => ({
      table,
      key: sha1(result.link),
      link: result.link,
    }))
  );
  gets = results.map((result) => ({ table, key: sha1(result.link) }));
  // console.log(gets);
  let items = await begin.get(gets);
  console.log(items);
  let thumbnails = items.map(
    ({ image }) =>
      `<li>
      <div class="avatar"
        style="background-size:cover; background-image: url(${image.data});">
              </div></li>`
    // background-position: left ${item.face.x} top ${item.face.y};">
  );

  let html = `
<!doctype html>
<html lang=en>
${head}
  <body>
  <ul>${thumbnails.join("")}</ul>
    
  <pre style="font-size:7pt">
  ${JSON.stringify(items, null, 4)}
  </pre>
  </body>
</html>`;

  return {
    headers: {
      "content-type": "text/html; charset=utf8",
      "cache-control":
        "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
    },
    body: html,
    statusCode: 200,
  };
}

exports.handler = arc.http.async(http);
