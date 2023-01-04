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
      redirect = routes.get(url) ?? defaultRedirect;
      await env.REDIRECTS.put(url, redirect);
    }

    let count = Number(await env.COUNTS.get(url));
    if (!count) {
      count = 0;
    }
    count++;

    await env.COUNTS.put(url, String(count));

    await env.REFERERS.put(new Date().toISOString(), request.headers.get("REFERER") ?? "");

    // return new Response(` ${JSON.stringify(request.headers.get("Referer"))} ${url} ${redirect} ${count} !`);
    return Response.redirect(redirect, 301);
  }
};
