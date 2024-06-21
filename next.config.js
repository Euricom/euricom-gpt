const webpack = require("webpack")

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})
//changes Euricom (remove pwa)
module.exports = withBundleAnalyzer({
  images: {
    unoptimized: true
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1"
      },
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ["sharp", "onnxruntime-node"]
  },
  webpack: config => {
    // Polyfills for Node.js core modules
    // Ensure there's a fallback configuration object
    config.resolve.fallback = config.resolve.fallback || {}
    Object.assign(config.resolve.fallback, {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      http: false, // Mock or false if not used directly
      https: false, // Mock or false if not used directly
      querystring: require.resolve("query-string")
      // Add other polyfills you need here
    })

    // Return the altered config
    return config
  }
})
