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

const createNode = (fiber) => {
  let node = null;
  node =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  Object.keys(fiber.props).forEach((prop) => {
    if (prop !== "children") node[prop] = fiber.props[prop];
  });

  return node;
};

let nextUnitOfWork = null;
let wipRoot = null;

const render = (element, container) => {
  wipRoot = {
    domNode: container,
    children: [element, element],
  };
  nextUnitOfWork = wipRoot;
};

const commitWork = (unit) => {
  if (!unit) return;
  if (unit.parent) unit.parent.domNode.appendChild(unit.domNode);
  if (unit.children && unit.children.length !== 0) {
    commitWork(unit.children[0]);
  }
  if (unit.rightSibling) {
    commitWork(unit.rightSibling);
  }
};

const commitRoot = () => {
  commitWork(wipRoot);
  wipRoot = null;
};

function performUnitOfWork(unit) {
  if (unit.alreadyBeenUsed) {
    if (unit.rightSibling) {
      return unit.rightSibling;
    }
  } else {
    unit.alreadyBeenUsed = true;
    const elements = unit.children;
    if (elements.length !== 0) {
      let childrenUnitArray = [];
      let lastRightSibling = null;
      for (let i = elements.length - 1; i >= 0; --i) {
        const nextUnit = {
          domNode: createNode(elements[0]),
          parent: unit,
          rightSibling: lastRightSibling,
          children: elements[i].props.children,
        };
        lastRightSibling = nextUnit;
        childrenUnitArray[i] = nextUnit;
      }
      unit.children = childrenUnitArray;
      if (childrenUnitArray[0]) {
        return childrenUnitArray[0];
      }
    }
  }
  if (unit.parent) return unit.parent;
  return null;
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  window.requestIdleCallback(workLoop);
}

window.requestIdleCallback(workLoop);

const ReactRedo = {
  createElement,
  render,
};

export default ReactRedo;
