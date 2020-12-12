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
  import { onMount, onDestroy, tick } from "svelte";

  // props - wrapper
  export let dark = true;
  // props - table
  export let data;
  export let limit;
  let prevData;
  // props - view/viewer
  export let rowPivots;
  export let columnPivots;
  export let columns;
  export let aggregates;
  export let filters;
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
    tick().then(() => viewer.toggleConfig());
    initialized = true;
  };
  // lifecycle
  onMount(async () => {
    // remove extra padding in the default template
    const el = document.querySelector('.flex.px-2');
    if (el) el.classList.toggle('hidden');

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
  onDestroy(() => {
    // TODO: see how to test it
    if (table !== null) {
      table.delete();
      console.log("table deleted");
    }
    if (viewer !== null) {
      viewer.delete().then((...args) => {
        console.log("viewer delete promise", args);
      });
      console.log("viewer deleted");
    }
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

  $: if (dark) {
    document.querySelector('body').classList.add('mode-dark');
  } else {
    document.querySelector('body').classList.remove('mode-dark');
  }


  // reactive - view/viewer
  $: if (rowPivots !== undefined && mounted) {
    setViewerAttribute(viewer, VIEWER_ATTR_MAP.rowPivots, rowPivots);
  }
  $: if (columnPivots !== undefined && mounted) {
    setViewerAttribute(viewer, VIEWER_ATTR_MAP.columnPivots, columnPivots);
  }
  $: if (columns !== undefined && mounted) {
    setViewerAttribute(viewer, VIEWER_ATTR_MAP.columns, columns);
    console.log("executed");
  }
  $: if (aggregates !== undefined && mounted) {
    setViewerAttribute(viewer, VIEWER_ATTR_MAP.aggregates, aggregates);
  }
  $: if (filters !== undefined && mounted) {
    setViewerAttribute(viewer, VIEWER_ATTR_MAP.filters, filters);
  }
  $: if (sort !== undefined && mounted) {
    setViewerAttribute(viewer, VIEWER_ATTR_MAP.sort, sort);
  }

  $: avgVol = (data.reduce((acc, cur) => acc + cur.取引量, 0) / data.length).toFixed(2);
  $: avgAsk = (data.reduce((acc, cur) => acc + cur.希望, 0) / data.length).toFixed(2);
  $: avgBid = (data.reduce((acc, cur) => acc + cur.入札, 0) / data.length).toFixed(2);

  function median(values) {
    if(values.length === 0) return 0;

    values.sort((a, b) => a - b);

    const half = Math.floor(values.length / 2);

    if (values.length % 2) return values[half];

    return (values[half - 1] + values[half]) / 2.0;
  }

  $: medVol = median(data.map(i => i.取引量)).toFixed(2);
  $: medAsk = median(data.map(i => i.希望)).toFixed(2);
  $: medBid = median(data.map(i => i.入札)).toFixed(2);
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

<div class="container min-h-screen bg-gray-200 dark:bg-gray-800 dark:text-gray-100 text-gray-800">
  <div class="w-full py-2 border-b border-gray-500 shadow-lg mb-4 bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700">
    <div class="mx-auto px-4 max-w-7xl flex flex-row align-center items-center">
      <div class="font-mono text-sm">
        <Logo /> demo for BRICKs Analytics.
      </div>
      <div class="flex-grow" />
      <button class="rounded-full outline-none ring-gray-100 dark:bg-gray-500 bg-gray-400 hover:ring-4 transition duration-500 h-8 w-8" on:click={() => dark = !dark}>
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  </div>
  <div class="mx-auto max-w-7xl flex flex-wrap justify-between">
    <div class="w-2/3 sm:w-full px-4">
      <div class="shadow-lg ring-2 ring-opacity-25 hover:ring-opacity-100 transition duration-500 hover:ring-4 ring-gray-200 dark:ring-gray-600">
        <perspective-viewer
          style="height: 500px"
          bind:this={viewer}
          class:perspective-viewer-material-dense-dark={dark}
          class:perspective-viewer-material-dense={!dark}
        />
      </div>
    </div>
    <div class="w-1/3 sm:w-full flex flex-col justify-between h-auto">
      <div class="flex-grow p-4 shadow-lg ring-2 ring-opacity-25 hover:ring-opacity-100 transition duration-500 hover:ring-4 ring-gray-200 dark:ring-gray-600 from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700 bg-gradient-to-r">
        <h3 class="font-bold text-lg tracking-wide mb-8">
          平均値
        </h3>
        <ProgressLinear class="my-2 w-full" progress={avgVol} />
        <span class="text-sm text-gray-500">取引量:</span> <span class="font-mono text-lg">{avgVol}</span>
        <ProgressLinear class="my-2 w-full" progress={avgBid} />
        <span class="text-sm text-gray-500">入札価格:</span> <span class="font-mono text-lg">{avgBid}</span>
        <ProgressLinear class="my-2 w-full" progress={avgAsk} />
        <span class="text-sm text-gray-500">希望価格:</span> <span class="font-mono text-lg">{avgAsk}</span>
      </div>
      <div class="flex-grow mt-4 p-4 shadow-lg ring-2 ring-opacity-25 hover:ring-opacity-100 transition duration-500 hover:ring-4 ring-gray-200 dark:ring-gray-600 from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700 bg-gradient-to-r">
        <h3 class="font-bold text-lg tracking-wide mb-8">
          調和平均
        </h3>
        <ProgressLinear class="my-2 w-full" progress={avgVol} />
        <span class="text-sm text-gray-500">取引量:</span> <span class="font-mono text-lg">{medVol}</span>
        <ProgressLinear class="my-2 w-full" progress={medBid} />
        <span class="text-sm text-gray-500">入札価格:</span> <span class="font-mono text-lg">{medBid}</span>
        <ProgressLinear class="my-2 w-full" progress={medAsk} />
        <span class="text-sm text-gray-500">希望価格:</span> <span class="font-mono text-lg">{medAsk}</span>
      </div>
    </div>
  </div>
</div>
