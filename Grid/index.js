import ellxify from "~ellx-hub/lib/utils/svelte.js";
import { mockCustomElements } from "./utils.js";
import Grid from "./Grid.svelte";
import "./theme.css";

mockCustomElements();

export default ellxify(Grid);
