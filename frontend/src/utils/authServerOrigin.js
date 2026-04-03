/**
 * OAuth2 authorization runs against the Spring app root (not /api).
 * VITE_API_URL is typically http://host:port/api — strip /api for OAuth redirects.
 */
export function getAuthServerOrigin() {
    const explicit = import.meta.env.VITE_AUTH_ORIGIN;
    if (explicit) {
        return String(explicit).replace(/\/$/, "");
    }
    const api = String(import.meta.env.VITE_API_URL || "");
    const stripped = api.replace(/\/api\/?$/i, "");
    if (stripped) {
        return stripped;
    }
    return "http://localhost:8081";
}

export function getGoogleOAuthAuthorizationUrl() {
    return `${getAuthServerOrigin()}/oauth2/authorization/google`;
}
