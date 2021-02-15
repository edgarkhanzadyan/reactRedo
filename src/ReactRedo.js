const createElement = (type, props, ...children) => ({
  type,
  props: {
    ...props,
    children: children.map((child) =>
      typeof child === "object" ? child : createTextElement(child)
    ),
  },
});

const createTextElement = (text) => ({
  type: "TEXT_ELEMENT",
  props: {
    nodeValue: text,
    children: [],
  },
});

const render = (root, container) => {
  let node = null;
  node =
    root.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(root.type);

  Object.keys(root.props).forEach((prop) => {
    if (prop !== "children") node[prop] = root.props[prop];
  });

  root.props.children.forEach((child) => {
    render(child, node);
  });

  container.appendChild(node);
};

const ReactRedo = {
  createElement,
  render,
};

export default ReactRedo;
