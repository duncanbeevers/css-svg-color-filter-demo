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
    controlNode.classList.add('controls-control')
    const labelNode = createElement('label');
    controlNode.appendChild(labelNode);
    labelNode.appendChild(createText(name));

    const rangeNode = createElement('input');
    controlNode.appendChild(rangeNode);
    rangeNode.type = 'range';
    rangeNode.name = name;
    rangeNode.min = '-1';
    rangeNode.max = '1';
    rangeNode.step = '0.001';
    rangeNode.addEventListener('input', onControlNodeChange);

    const numericNode = createElement('input');
    controlNode.appendChild(numericNode);
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

  function makeControls() {
    const controlsNode = createControlsNode();
    window.document.body.appendChild(controlsNode);
  }

  let filterCount = 0;

  function makeFilter() {
    filterCount += 1;

    const filterNode = createSVGElement('filter');
    filterNode.id = `filterNode--${filterCount}`;

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
      node: filterNode,
      setValues: setValues
    };

    return filter;
  }

  function updateControls(state) {
    for (let name in state) {
      const inputs = window.document.querySelectorAll(`input[name=${name}]`);
      inputs.forEach(function (input) {
        input.value = state[name];
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

  // Hulky
  const state = {
    Nrr: -1,   Ngr: 0.923, Nbr: 0.189, Nar: 0, Cr: 0,
    Nrg: 0.677, Ngg: 0.123, Nbg: 0.168, Nag: 0, Cg: 0,
    Nrb: -0.462, Ngb: 0.277, Nbb: 0.131, Nab: 0, Cb: 0,
    Nra: 0, Nga: -0.954, Nba: 0, Naa: 1, Ca: 0
  }

  function main() {
    makeControls();
    const filter = makeFilter();
    window.document.body.appendChild(filter.node);

    const demoNode = window.document.getElementById('demo');
    demoNode.style.filter = `url(#${filter.node.id})`

    register(function (action) {
      if (action.type !== 'updateState') {
        return;
      }

      if (action.name) {
        state[action.name] = action.value;
      }

      const parent = demoNode.parentElement;
      parent.removeChild(demoNode);
      updateControls(state);
      filter.setValues(state);
      parent.appendChild(demoNode);
    });

    dispatch({ type: 'updateState' });
  }

  window.main = main;

}());
