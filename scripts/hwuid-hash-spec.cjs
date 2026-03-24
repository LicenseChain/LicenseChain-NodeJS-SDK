const assert = require("node:assert/strict");
const { LicenseService } = require("../dist/services/license-service.js");

async function main() {
  const calls = [];
  const mockClient = {
    post: async (endpoint, body) => {
      calls.push({ endpoint, body });
      return { valid: true };
    },
  };

  const service = new LicenseService(mockClient);
  const provided = "  a".repeat(64).replace(/\s/g, "");

  const ok = await service.validate("test-license-key", `  ${provided}  `);
  assert.equal(ok, true, "validate should return API valid flag");
  assert.equal(calls.length, 1, "validate should call API once");
  assert.equal(calls[0].endpoint, "/licenses/verify");
  assert.match(calls[0].body.hwuid, /^[a-f0-9]{64}$/, "provided hwuid must remain lowercase sha256 shape");
  assert.equal(calls[0].body.hwuid, provided, "provided hwuid should be trimmed");

  const okFallback = await service.validate("test-license-key");
  assert.equal(okFallback, true, "validate should return API valid flag for fallback call");
  assert.equal(calls.length, 2, "fallback call should issue a second API call");
  assert.match(calls[1].body.hwuid, /^[a-f0-9]{64}$/, "fallback hwuid must be lowercase sha256 hex");

  console.log("HWUID explicit-shape conformance: ok");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
