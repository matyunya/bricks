const ELLX_KEY = "__EllxMeta__";

export const mockCustomElements = () => {
  // mock if needed
  if (!window.customElements[ELLX_KEY]) {
    Object.assign(window.customElements, {
      [ELLX_KEY]: true,
      define: (...args) => {
        const [name] = args;
        // only register 'new' custom elements
        if (window.customElements.get(name) === undefined) {
          window.customElements.__proto__.define.call(
            window.customElements,
            ...args
          );
        } else {
          // TODO: remove
          console.log("customElements is alredy mocked");
        }
      },
    });
  }
};
