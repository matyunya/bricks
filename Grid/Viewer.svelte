<script context="module">
  import perspective from "@finos/perspective/dist/umd/perspective.inline.js";
  import "@finos/perspective-viewer";
  import "@finos/perspective-viewer-d3fc";
  import "@finos/perspective-viewer-datagrid";
  import Logo from "./Logo.svelte";
  import ProgressLinear from "./Progress.svelte";

  // worker
  // TODO: worker.terminate() ?
  const worker = perspective.worker();

  // view/viewer
  // https://perspective.finos.org/docs/obj/perspective.html#module_perspective..table+view
  const VIEWER_ATTR_MAP = {
    rowPivots: "row-pivots",
    columnPivots: "column-pivots",
    columns: "columns",
    aggregates: "aggregates",
    filters: "filters",
    sort: "sort",
  };
  const setViewerAttribute = (viewer, attr, value) => {
    viewer.setAttribute(attr, JSON.stringify(value));
  };
</script>

<script>
  import { onMount, tick } from "svelte";

  // props - wrapper
  export let dark = true;
  // props - table
  export let data;
  export let limit;
  let prevData;
  // props - view/viewer
  export let rowPivots = ["証券"];
  export let columnPivots = ["トレーダー"];
  export let columns = ["入札","取引量","希望"];
  export let plugin = "d3_x_bar";
  export let aggregates;
  export let filters = [];
  export let sort;
  // state
  let mounted = false;
  let initialized = false;
  let table = null;
  let viewer, viewer2, viewer3, viewer4 = null;
  // methods
  const initPerspective = () => {
    options = limit !== undefined ? { limit } : undefined;
    table = worker.table(data, options);
    viewer.load(table);
//     tick().then(() => viewer.toggleConfig());
    initialized = true;
  };
  // lifecycle
  onMount(async () => {
    // remove extra padding in the default template
    await window.customElements.whenDefined("perspective-viewer");
    // TODO: ensure we need to check/upgrade
    if (!viewer instanceof window.customElements.get("perspective-viewer")) {
      console.log("upgrade needed");
      window.customElements.upgrade(viewer);
    }
    if (data !== undefined) {
      initPerspective();
    }
    mounted = true;
    console.log("mounted");
  });

  // reactive - data
  $: if (prevData !== data) {
    if (mounted && data !== undefined) {
      if (initialized) {
        table.update(data);
      } else {
        initPerspective();
      }
    }
    prevData = data;
  }
</script>

<style>
  perspective-viewer {
    display: block;
    width: 100%;
    height: 1000px;
  }

  button:focus {
    outline: none;
  }
</style>

<perspective-viewer
  style="height: 500px"
  class="w-full"
  bind:this={viewer}
  columns={JSON.stringify(columns)}
  row-pivots={JSON.stringify(rowPivots)}
  column-pivots={JSON.stringify(columnPivots)}
  plugin={plugin}
  filters={JSON.stringify(filters)}
  limit="20"
  class:perspective-viewer-material-dense-dark={dark}
  class:perspective-viewer-material-dense={!dark}
/>
