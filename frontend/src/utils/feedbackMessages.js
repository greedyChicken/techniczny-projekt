export const loadFailedMessage = (resourceLabel) =>
    `Failed to load ${resourceLabel}. Please try again.`;

/** When the API returns no message body (auth). */
export const AUTH_LOGIN_FALLBACK =
    "Unable to sign in. Check your email and password, then try again.";
export const AUTH_REGISTER_FALLBACK =
    "Unable to create your account. Please try again.";

/** Settings / profile (snackbar fallback copy). */
export const PROFILE_SAVE_FORBIDDEN =
    "You are not allowed to update this profile.";
export const PROFILE_SAVE_INVALID = "Check your details and try again.";
export const PROFILE_SAVE_FAILED = "Could not save your profile. Please try again.";
export const PROFILE_DELETE_FORBIDDEN =
    "You are not allowed to delete this account.";
export const PROFILE_DELETE_FAILED =
    "Could not delete your account. Please try again.";
