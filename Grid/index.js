import ellxify from "./ellxify.js";
import { mockCustomElements } from "./utils.js";
import Grid from "./Grid.svelte";
import "./theme.css";

mockCustomElements();

export default ellxify(Grid);
