import { Env } from ".";

export default {
  async fetch(
    request: Request,
    env: Env
    // ctx: ExecutionContext
  ): Promise<Response> {

    const limit = 1000;
    let cursor = null;
    let list_complete = false;

    const values = [];
    while (!list_complete) {
      const list = await env.COUNTS.list({ limit, cursor });

      const keys = list.keys;

      for (let i = 0; i < keys.length; i++) {
        const name = keys[i].name;
        const count = await env.COUNTS.get(name);

        values.push({ name, count: Number(count) });
      }
      list_complete = list.list_complete;
      cursor = list.cursor;
    }

    const sorted = values.sort((a, b) => {
      if (a.count < b.count) {
        return 1;
      }
      if (a.count > b.count) {
        return -1;
      }
      return 0;
    });
    const result = sorted.map(({ name, count }) => `${count}\t${name}\n`)
      .join("");
    return new Response(result);
  }
};
