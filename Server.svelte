<script>
  import { generateData } from "./utils.js";

  // props
  export let quantity = 100;
  export let value = generateData(quantity);
  // state
  let interval = setInterval(() => {
    value = generateData(quantity);
  }, 1000);

  const toggle = () => {
    if (!interval) {
      interval = setInterval(() => {
        value = generateData(quantity);
      }, 1000);
    } else {
      clearInterval(interval);
      interval = null;
    }
  };
</script>

<button on:click={toggle}> {!interval ? 'Play' : 'Pause'} </button>
