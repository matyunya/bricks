<script>
  export let progress = 0;
  export let color = "blue-gray";
</script>

<div
  class="{$$props.class || ""} top-0 left-0 w-full h-1 bg-white dark:bg-gray-600 overflow-hidden relative"
>
  <div
    class="bg-{color}-500 h-1 absolute"
    class:transition={progress}
    style={progress ? `width: ${progress}%` : ""} />
  <div class="bg-{color}-500 h-1 absolute dec" class:hidden={progress} />
</div>
