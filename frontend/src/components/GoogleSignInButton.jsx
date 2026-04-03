import { Button } from "@mui/material";
import { getGoogleOAuthAuthorizationUrl } from "../utils/authServerOrigin";

const GoogleSignInButton = ({ children = "Continue with Google" }) => (
    <Button
        component="a"
        href={getGoogleOAuthAuthorizationUrl()}
        fullWidth
        variant="outlined"
        color="inherit"
        sx={{
            py: 1.1,
            borderColor: "divider",
            fontWeight: 600,
        }}
    >
        {children}
    </Button>
);

export default GoogleSignInButton;
