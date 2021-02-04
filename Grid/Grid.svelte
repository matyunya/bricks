<script context="module">
  import { onMount } from "svelte";
  import Logo from "./Logo.svelte";
  import ProgressLinear from "./Progress.svelte";
  import Viewer from "./Viewer.svelte";
  import headlong from "~matyunya/headlong";
</script>

<script>
  // props - wrapper
  export let dark = false;
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

  $: if (dark) {
    document.querySelector('body').classList.add('mode-dark');
  } else {
    document.querySelector('body').classList.remove('mode-dark');
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

  onMount(() => {
    setTimeout(() => headlong(), 100);
  });
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
  <div class="w-full py-2 border-b border-gray-500 shadow-lg mb-4 bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700 mb-8">
    <div class="mx-auto px-2 md:px-4 max-w-7xl flex flex-row align-center items-center">
      <div class="font-mono text-sm">
        <a href="https://ellx.io"><Logo /></a> demo for BRICKs Analytics.
      </div>
      <div class="flex-grow" />
      <button class="rounded-full outline-none ring-gray-100 dark:bg-gray-500 bg-gray-400 hover:ring-4 transition duration-500 h-8 w-8" on:click={() => dark = !dark}>
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  </div>
  <div class="mx-auto max-w-7xl flex flex-wrap justify-between px-2 md:px-0">
    <div class="md:w-2/3 w-full px-0 md:px-4">
      <div class="shadow-lg ring-2 ring-opacity-25 hover:ring-opacity-100 transition duration-500 hover:ring-4 ring-blue-gray-200 dark:ring-gray-600">
        <Viewer plugin="datagrid" {dark} {data} />
      </div>
    </div>
    <div class="md:w-1/3 w-full flex flex-col justify-between h-auto">
      <div class="flex-grow p-4 shadow-lg ring-2 ring-opacity-25 hover:ring-opacity-100 transition duration-500 hover:ring-4 ring-blue-gray-200 dark:ring-gray-600 from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700 bg-gradient-to-r">
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
      <div class="flex-grow md:mt-4 mt-0 p-4 shadow-lg ring-2 ring-opacity-25 hover:ring-opacity-100 transition duration-500 hover:ring-4 ring-blue-gray-200 dark:ring-gray-600 from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700 bg-gradient-to-r">
        <h3 class="font-bold text-lg tracking-wide mb-8">
          中央値
        </h3>
        <ProgressLinear class="my-2 w-full" progress={avgVol} />
        <span class="text-sm text-gray-500">取引量:</span> <span class="font-mono text-lg">{medVol}</span>
        <ProgressLinear class="my-2 w-full" progress={medBid} />
        <span class="text-sm text-gray-500">入札価格:</span> <span class="font-mono text-lg">{medBid}</span>
        <ProgressLinear class="my-2 w-full" progress={medAsk} />
        <span class="text-sm text-gray-500">希望価格:</span> <span class="font-mono text-lg">{medAsk}</span>
      </div>
    </div>
    <div class="md:w-1/2 w-full px-0 md:px-4 my-4">
      <div class="shadow-lg ring-2 ring-opacity-25 hover:ring-opacity-100 transition duration-500 hover:ring-4 ring-blue-gray-200 dark:ring-gray-600">
        <Viewer
          plugin="d3_y_area"
          rowPivots={["時間"]}
          columns={["取引量"]}
          filters={[["トレーダー", "in", ["A社", "B社"]]]}
          {dark}
          data={data.slice(-20)}
          forceUpdate={true} />
      </div>
    </div>
    <div class="md:w-1/2 w-full md:my-4 mt-0">
      <div class="shadow-lg ring-2 ring-opacity-25 hover:ring-opacity-100 transition duration-500 hover:ring-4 ring-blue-gray-200 dark:ring-gray-600">
        <Viewer plugin="d3_x_bar" columns={["入札"]} filters={[["トレーダー", "in", ["A社", "B社"]]]} {dark} {data} />
      </div>
    </div>
  </div>
</div>
