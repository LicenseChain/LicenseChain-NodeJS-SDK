import * as jose from 'jose';

/** Must match Core API `LICENSE_TOKEN_USE_CLAIM`. */
export const LICENSE_TOKEN_USE_CLAIM = 'licensechain_license_v1';

export type VerifyLicenseAssertionOptions = {
  /** When set, payload `aud` must equal this Dashboard app id. */
  expectedAppId?: string;
  /** When set, passed to JWT issuer verification. */
  issuer?: string;
};

/**
 * Verify a `license_token` from POST /v1/licenses/verify using the JWKS URL
 * from the same response (`license_jwks_uri`) or `GET /v1/licenses/jwks`.
 */
export async function verifyLicenseAssertionJwt(
  token: string,
  jwksUrl: string,
  options?: VerifyLicenseAssertionOptions
): Promise<jose.JWTPayload> {
  const JWKS = jose.createRemoteJWKSet(new URL(jwksUrl));
  const { payload } = await jose.jwtVerify(token, JWKS, {
    algorithms: ['RS256'],
    ...(options?.issuer ? { issuer: options.issuer } : {}),
  });
  if (payload.token_use !== LICENSE_TOKEN_USE_CLAIM) {
    throw new Error(`Invalid license token: expected token_use "${LICENSE_TOKEN_USE_CLAIM}"`);
  }
  if (options?.expectedAppId != null && options.expectedAppId !== '' && payload.aud !== options.expectedAppId) {
    throw new Error('Invalid license token: aud does not match expected app id');
  }
  return payload;
}
