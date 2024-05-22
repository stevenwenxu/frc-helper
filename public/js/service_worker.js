// There can only be 1 service worker, and since libraries such as Immer are split with splitChunk optimization,
// we need to import it here. Webpack's way of importing chunks doesn't work nicely with how chrome extensions expect
// modules to be imported.
import "./immer.js";
import "./background.js";
