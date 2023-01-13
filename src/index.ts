import routes from "./bootstrap-routes";

const defaultRedirect = "https://www.v01.io";

// export interface Env {

// }

export default {
  async fetch(
    request: Request
    // env: Env
    // ctx: ExecutionContext
  ): Promise<Response> {
    const url = request.url;
    const lookup = routes.find(item => url.indexOf(item[0]) !== -1);
    const redirect = lookup?.[1] ?? defaultRedirect;

    // return new Response(` ${JSON.stringify(request.headers.get("Referer"))} ${url} ${redirect} ${count} !`);
    return Response.redirect(redirect, 301);
  }
};
