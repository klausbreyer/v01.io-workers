const baseURL = "https://www.unixtime.app";
const masURL =
  "https://apps.apple.com/de/app/unixtime-app/id1627321235?l=en&mt=12";
const mssURL =
  "https://apps.microsoft.com/store/detail/unixtimeapp/9NXBTRZH3ZQN?hl=de-de&gl=de";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const agg = {};

  const limit = 1000;
  let cursor = null;
  let list_complete = false;
  while (!list_complete) {
    const list = await REFS.list({ limit, cursor });
    const keys = list.keys;

    console.log(JSON.stringify(list));

    for (let i = 0; i < keys.length; i++) {
      const name = keys[i].name;
      const day = name.substr(0, "2002-01-01".length);
      const value = await REFS.get(name);

      const index = `${day}\t${value}`;

      if (!agg[index]) {
        agg[index] = [];
      }
      agg[index].push(name);
    }

    list_complete = list.list_complete;
    cursor = list.cursor;
  }

  const result = Object.entries(agg)
    .map(([key, value]) => `${key}\t${value.length}\n`)
    .join("");
  return new Response(result);
}
