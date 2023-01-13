import routes from "./bootstrap-routes";

const defaultRedirect = "https://www.v01.io";

export interface Env {
  REDIRECTS: KVNamespace,
  COUNTS: KVNamespace,
  REFERERS: KVNamespace,
}

export default {
  async fetch(
    request: Request,
    env: Env
    // ctx: ExecutionContext
  ): Promise<Response> {

    const url = request.url;
    let redirect = await env.REDIRECTS.get(url);

    if (!redirect) {
      const lookup = routes.find(item => url.indexOf(item[0]) !== -1);
      redirect = lookup?.[1] ?? defaultRedirect;
      await env.REDIRECTS.put(url, redirect);
    }

    let count = Number(await env.COUNTS.get(url));
    if (!count) {
      count = 0;
    }
    count++;

    await env.COUNTS.put(url, String(count));

    const referer = request.headers.get("REFERER");
    if (referer && referer.length > 0 && referer.indexOf(defaultRedirect) === -1) {
      await env.REFERERS.put(new Date().toISOString(), referer);
    }


    // return new Response(` ${JSON.stringify(request.headers.get("Referer"))} ${url} ${redirect} ${count} !`);
    return Response.redirect(redirect, 301);
  }
};
