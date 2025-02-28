export const isFirefox = navigator.userAgent.includes("Firefox");
export const algorithm: HmacKeyGenParams = {
    name: "HMAC",
    hash: { name: "SHA-512" }
};