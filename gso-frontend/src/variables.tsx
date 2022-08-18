export function getAPIEndpoint() {
  return process.env.API_ENDPOINT || "https://api-gso.gradic.net";
}

export function get2FAEndpoint() {
  return process.env.TWO_FA_ENDPOINT || "https://twofa-gso.gradic.net";
}
