if (/\/.*\/parents\/\d+\/details$/.test(location.pathname)) {
  require("./details_page");
} else if (/\/.*\/\d+/.test(location.pathname)) {
  require("./schedule");
}
