const hostname = "batmudder.com";
const REDIRECT_MAP = new Map([
  ["moonlord", "www.anvianet.fi/moonlord/batmud/barbarian.html"],
  ["milk", "taikajuoma.ovh/bat/"],
  ["batshoppe", "batshoppe.dy.fi/index.php"],
  ["eq", "batshoppe.dy.fi/index.php"],
  ["wiki", "taikajuoma.ovh/wiki/Main_Page"],
  ["jeskko", "jeskko.pupunen.net/map"],
  ["dest.batmudder.com", "taikajuoma.ovh/wiki/Desters"],
  ["marvin.batmudder.com", "batmarvin.000webhostapp.com"]
]);
const someURLToRedirectTo = "https://" + hostname;

/**
 * redirectResponse returns a redirect Response
 * @param {Request} url where to redirect the response
 * @param {number?=301|302} type permanent or temporary redirect
 */
async function redirectResponse(url, type = 301) {
  return Response.redirect(url, type); //await fetch(request)
}

/**
 * sets up routes and redirects them to a location based on a map
 * @param {Request} request
 * @param {Map<string, string>} redirectMap
 */
async function bulkRedirects(request, redirectMap) {
  let requestURL = new URL(request.url);
  // https://nodejs.org/api/url.html#url_url_hostname
  let protocol = requestURL.protocol;
  let subdomain = requestURL.hostname.split(".")[0];
  let location = redirectMap.get(subdomain);
  console.log("\nlocation:" + location);

  if (location) {
    let full_location = protocol + "//" + location;
    return Response.redirect(full_location, 302);
  }
  // If not in map, return the original request
  return fetch(request);
}

/**
 * Example of how redirect methods above can be used in an application
 *  */
addEventListener("fetch", async event => {
  const { request } = event;
  const { url, method } = request;
  const protocol = new URL(url).protocol;
  console.log("\nprotocol:" + protocol);
  const subdomain = new URL(url).hostname.split(".")[0];
  console.log("\nsubdomain:" + subdomain);

  event.respondWith(bulkRedirects(request, REDIRECT_MAP));

  // if (subdomain.includes('workertest*'))
  //     console.log('match!')
  //     event.respondWith(bulkRedirects(request, REDIRECT_MAP))
  // // if (subdomain.includes('workertest2'))
  // //     event.respondWith(redirectResponse(someURLToRedirectTo))

  // // if doesn't match above return a dummy response for demonstration purposes
  // event.respondWith(new Response('some random response for ' + url))
});

// server_name www.batmudder.com;
// return 302 $scheme://batmudder.com$request_uri;

// server_name  moonlord.batmudder.com;
// return 302 $scheme://www.anvianet.fi/moonlord/batmud/barbarian.html;
// # http://www.anvianet.fi/moonlord/batmud/compare.htm

// server_name  milk.batmudder.com;
// return 302 $scheme://taikajuoma.ovh/bat/;

// server_name  batshoppe.batmudder.com eq.batmudder.com;
// return 302 $scheme://batshoppe.dy.fi/index.php;

// server_name  wiki.batmudder.com;
// return 302 $scheme://taikajuoma.ovh/wiki/Main_Page;

// server_name  jeskko.batmudder.com;
// return 302 $scheme://jeskko.pupunen.net/map;

// ### NO LONGER NEEDED - DIRECT DNS LINK
// server_name  nepos.batmudder.com;
// return 302 $scheme://nepos.dtdns.net;
// ####

// server_name  dest.batmudder.com;
// return 302 $scheme://taikajuoma.ovh/wiki/Desters;

// server_name  marvin.batmudder.com;
// return 302 $scheme://batmarvin.000webhostapp.com;
