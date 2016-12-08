(function () {

  //
  // Utilities

  function createElement(name) {
    return window.document.createElement(name);
  }

  function createSVGElement(name) {
    return window.document.createElementNS('http://www.w3.org/2000/svg', name);
  }

  function createText(text) {
    return window.document.createTextNode(text);
  }

  //
  // Make Controls

  const labels = [
    ['Nrr', 'Ngr', 'Nbr', 'Nar', 'Cr'],
    ['Nrg', 'Ngg', 'Nbg', 'Nag', 'Cg'],
    ['Nrb', 'Ngb', 'Nbb', 'Nab', 'Cb'],
    ['Nra', 'Nga', 'Nba', 'Naa', 'Ca']
  ];

  const handlers = [];
  function register(handler) {
    handlers.push(handler);
  }

  function dispatch(action) {
    handlers.forEach(function (handler) { handler(action); });
  }

  function onControlNodeChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    dispatch({
      type: 'updateState',
      name: name,
      value: value
    });
  }

  function createControlNode(name) {
    const controlNode = createElement('div');
    controlNode.classList.add('controls-control');
    const labelNode = createElement('label');
    controlNode.appendChild(labelNode);
    labelNode.appendChild(createText(name));

    const inputsNode = createElement('div');
    inputsNode.classList.add('controls-inputs');
    controlNode.appendChild(inputsNode);

    const rangeNode = createElement('input');
    inputsNode.appendChild(rangeNode);
    rangeNode.type = 'range';
    rangeNode.name = name;
    rangeNode.min = '-1';
    rangeNode.max = '1';
    rangeNode.step = '0.001';
    rangeNode.tabIndex = '-1';
    rangeNode.addEventListener('input', onControlNodeChange);

    const numericNode = createElement('input');
    inputsNode.appendChild(numericNode);
    numericNode.type = 'number';
    numericNode.name = name;
    numericNode.addEventListener('input', onControlNodeChange);

    return controlNode;
  }

  function createControlsRowNode(row) {
    const rowNode = createElement('div');
    rowNode.classList.add('controls-row');
    return row.reduce(function (acc, name) {
      acc.appendChild(createControlNode(name));
      return acc;
    }, rowNode)
  }

  function createControlsNode() {
    const controlsNode = window.document.createElement('div');
    controlsNode.classList.add('controls');
    return labels.reduce(function (acc, row) {
      acc.appendChild(createControlsRowNode(row));
      return acc;
    }, controlsNode);
  }

  let filterCount = 0;

  function makeFilter() {
    filterCount += 1;

    const filterNode = createSVGElement('filter');
    filterNode.id = `filterNode--${filterCount}`;
    filterNode.setAttribute('colorInterpolationFilters', 'sRGB');


    const feColorMatrixNode = createSVGElement('feColorMatrix');
    filterNode.appendChild(feColorMatrixNode);
    feColorMatrixNode.setAttribute('type', 'matrix');

    function setValues(state) {
      const Nrr = state.Nrr;
      const Ngr = state.Ngr;
      const Nbr = state.Nbr;
      const Nar = state.Nar;
      const Cr = state.Cr;
      const Nrg = state.Nrg;
      const Ngg = state.Ngg;
      const Nbg = state.Nbg;
      const Nag = state.Nag;
      const Cg = state.Cg;
      const Nrb = state.Nrb;
      const Ngb = state.Ngb;
      const Nbb = state.Nbb;
      const Nab = state.Nab;
      const Cb = state.Cb;
      const Nra = state.Nra;
      const Nga = state.Nga;
      const Nba = state.Nba;
      const Naa = state.Naa;
      const Ca = state.Ca;

      const values = [
        Nrr, Ngr, Nbr, Nar, Cr,
        Nrg, Ngg, Nbg, Nag, Cg,
        Nrb, Ngb, Nbb, Nab, Cb,
        Nra, Nga, Nba, Naa, Ca
      ].join(' ');

      feColorMatrixNode.setAttribute('values', values);
    }

    const filter = {
      id: filterNode.id,
      node: filterNode,
      setValues: setValues
    };

    return filter;
  }

  function updateControls(state) {
    for (let name in state) {
      const inputs = window.document.querySelectorAll(`input[name=${name}]`);
      inputs.forEach(function (input) {
        input.value = state[name].toFixed(3);
      });
    }
  }

  // // Sepia
  // const state = {
  //   Nrr: 0.393, Ngr: 0.769, Nbr: 0.189, Nar: 0, Cr: 0,
  //   Nrg: 0.349, Ngg: 0.686, Nbg: 0.168, Nag: 0, Cg: 0,
  //   Nrb: 0.272, Ngb: 0.534, Nbb: 0.131, Nab: 0, Cb: 0,
  //   Nra: 0,     Nga: 0,     Nba: 0,     Naa: 1, Ca: 0
  // };

  // // Hulky
  // const state = {
  //   Nrr: -1,   Ngr: 0.923, Nbr: 0.189, Nar: 0, Cr: 0,
  //   Nrg: 0.677, Ngg: 0.123, Nbg: 0.168, Nag: 0, Cg: 0,
  //   Nrb: -0.462, Ngb: 0.277, Nbb: 0.131, Nab: 0, Cb: 0,
  //   Nra: 0, Nga: -0.954, Nba: 0, Naa: 1, Ca: 0
  // }

  // Pure Green
  const state = {
    Nrr: 0, Ngr: 0, Nbr: 0, Nar: 0, Cr: 0,
    Nrg: 0.33, Ngg: 0.33, Nbg: 0.33, Nag: 0, Cg: 0,
    Nrb: 0, Ngb: 0, Nbb: 0, Nab: 0, Cb: 0,
    Nra: 0, Nga: 0, Nba: 0, Naa: 1, Ca: 0
  }

  const encodeFilter = false;

  function main() {
    const demoNode = window.document.getElementById('demo');

    const controlsContainerNode = window.document.getElementById('controls-container');
    const markupContainerNode = window.document.getElementById('markup-container');
    const base64MarkupContainerNode = window.document.getElementById('base64-markup-container')
    const filterContainerNode = window.document.getElementById('filter-container');

    const controlsNode = createControlsNode();
    controlsContainerNode.appendChild(controlsNode);

    const filter = makeFilter();
    filterContainerNode.appendChild(filter.node);

    register(function (action) {
      if (action.type !== 'updateState') {
        return;
      }

      let scheduleUpdate = true;

      if (action.name) {
        const value = parseFloat(action.value);
        if (value !== NaN) {
          state[action.name] = parseFloat(action.value);
          scheduleUpdate = true;
        } else {
          scheduleUpdate = false;
        }
      }

      if (scheduleUpdate) {
        updateControls(state);
        filter.setValues(state);

        const filterMarkup = filter.node.outerHTML;
        const wrappedFilterMarkup = `<svg xmlns="http://www.w3.org/2000/svg">${filterMarkup}</svg>`;
        const base64EncodedMarkup = window.btoa(wrappedFilterMarkup);
        const filterMarkupUrl = `data:image/svg+xml;base64,${window.encodeURIComponent(base64EncodedMarkup)}#${filter.id}`;
        markupContainerNode.innerText = filterMarkup;
        base64MarkupContainerNode.innerText = filterMarkupUrl;

        const filterUrl = encodeFilter ? filterMarkupUrl : `#${filter.id}`;
        demoNode.style.filter = `url(${filterUrl})`;
      }
    });

    dispatch({ type: 'updateState' });
  }

  window.main = main;

}());
