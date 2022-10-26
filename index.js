const hostname = "batmudder.com";
// Organize sites by http only, https only or either protocol
const REDIRECT_HASHTABLE = {
  moonlord: {
    url: "https://web.archive.org/web/20180826203131/http://www.anvianet.fi/moonlord/batmud/barbarian.html",
    protocol: "https:"
  },
  batshoppe: { url: "batshoppe.dy.fi/index.php", protocol: "https:" },
  eq: { url: "batshoppe.dy.fi/index.php", protocol: "https:" },
  jeskko: { url: "jeskko.pupunen.net/map", protocol: "http:" },
  gmap: { url: "jeskko.pupunen.net/map", protocol: "http:" },
  milk: { url: "taikajuoma.ovh/bat/", protocol: "https:" },
  wiki: { url: "taikajuoma.ovh/wiki/Main_Page", protocol: "https:" },
  dest: { url: "taikajuoma.ovh/wiki/Desters", protocol: "https:" },
  ggrmaps: { url: "tnsp.org/maps/", protocol: "https:" },
  ggrtf: { url: "tnsp.org/~ccr/ggrtf/", protocol: "https:" },
  tazliel: { url: "sites.google.com/site/battazliel/", protocol: "https:" }
};

/**
 * redirectResponse returns a redirect Response
 * @param {Request} url where to redirect the response
 * @param {number?=301|302} type permanent or temporary redirect
 */
async function redirectResponse(url, type = 302) {
  return Response.redirect(url, type); //await fetch(request)
}

/**
 * sets up routes and redirects them to a location based on a map
 * @param {Request} request
 * @param {Map<string, string>} redirectMap
 */
async function bulkRedirects(request, redirectMap) {
  let requestURL = new URL(request.url);
  let subdomain = requestURL.hostname.split(".")[0];
  if (subdomain in redirectMap) {
    let subUrl = redirectMap[subdomain]["url"];
    let subProtocol = redirectMap[subdomain]["protocol"];
    if (subProtocol != "either") {
      let redirectURL = subProtocol + "//" + subUrl;
      return Response.redirect(redirectURL, 302);
    } else if (subProtocol == "either") {
      // If site supports either, use the requested protocol
      let redirectURL = requestURL.protocol + "//" + subUrl;
      return Response.redirect(redirectURL, 302);
    }
  }
  return fetch(request);
}

/**
 * Redirect based on information in the hashtable
 *  */
addEventListener("fetch", async event => {
  const { request } = event;
  const { url, method } = request;
  event.respondWith(bulkRedirects(request, REDIRECT_HASHTABLE));
});
