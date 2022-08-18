export function getAPIEndpoint() {
  return process.env.API_ENDPOINT || "http://gso.gradic.net:4000";
}

export function get2FAEndpoint() {
  return process.env.TWO_FA_ENDPOINT || "http://gso.gradic.net:5000";
}
