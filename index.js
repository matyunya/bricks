import ellxify from "~ellx-hub/lib/utils/svelte";
import headlong from "~matyunya/headlong";
export { default as grid } from "./Grid/index.js";
export { default as plot } from "~ellx-hub/plot";
import Server from "./Server.svelte";

headlong();

export const server = ellxify(Server);
