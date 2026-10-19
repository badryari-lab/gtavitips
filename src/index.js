// Custom request handler in front of the static assets (hub/).
//
// Why this exists: Cloudflare's built-in `assets.html_handling:
// "drop-trailing-slash"` strips a trailing slash, but does so with a 307
// (temporary) redirect. A 307 tells search engines not to trust the
// destination as permanent, so Google was refusing to consolidate the
// slash/no-slash variants of a page into one indexed URL (seen in Search
// Console as "Crawled - currently not indexed").
//
// Fix: intercept the request ourselves and issue a real 301 (permanent)
// redirect for any trailing slash before falling through to the asset
// handler. `html_handling: "drop-trailing-slash"` stays in wrangler.jsonc
// as a harmless fallback, but with this handler in front of it, it will
// never actually fire for a normal request.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
