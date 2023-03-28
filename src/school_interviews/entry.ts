if (/\/.*\/parents\/\d+\/details$/.test(location.pathname)) {
  import("./details_page");
} else if (/\/.*\/\d+/.test(location.pathname)) {
  import("./schedule");
}
