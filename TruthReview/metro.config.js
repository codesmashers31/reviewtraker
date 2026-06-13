// Monkey-patch crypto.createHash to redirect MD4 to MD5 (for Node.js 17+ / Node 24 OpenSSL compatibility)
const crypto = require("crypto");
try {
  const origCreateHash = crypto.createHash;
  crypto.createHash = (alg, opts) => {
    return origCreateHash(alg === "md4" ? "md5" : alg, opts);
  };
} catch (e) {
  console.warn("Failed to monkey-patch crypto.createHash:", e);
}

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./src/global.css" });
