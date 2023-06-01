/*
 * This file defines the NotFound page.
 */

import React from "react";
import "../styles/NotFound.css";

/*
 * This is the default page for any 404 requests.
 */
function NotFound() {
  /*
   * This return statement contains the HTML to be returned and rendered in the browser.
   */
  return (
    <div className="not-found">
      <div>
        <h2> 404 Not Found</h2>
      </div>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default NotFound;
