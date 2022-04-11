import App from "./App.svelte";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import en from "./i18n/en.json";
import pl from "./i18n/pl.json";
import { addMessages, init } from "svelte-i18n";

addMessages("en", en);
addMessages("pl", pl);

init({
  fallbackLocale: "pl",
});

const app = new App({
  target: document.body,
  props: {},
});

export default app;
