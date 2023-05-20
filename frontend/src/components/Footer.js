/*
 * This file defines the Footer component.
 */
import React from "react";
import { IconButton } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import "../styles/Footer.css";

/*
/*
 * Render the Footer component.
 */
function Footer() {
  return (
    <div className="footer">
      <div className="socialMedia">
        <IconButton href="mailto:imranmatin23@gmail.com">
          <EmailIcon />
        </IconButton>
        <IconButton href="https://www.linkedin.com/in/imranmatin/">
          <LinkedInIcon />
        </IconButton>
        <IconButton href="https://github.com/imranmatin23">
          <GitHubIcon />
        </IconButton>
        <IconButton href="https://twitter.com/imranmatin23">
          <TwitterIcon />
        </IconButton>
      </div>
      <p> &copy; 2023 Imran Matin</p>
    </div>
  );
}

export default Footer;
