import ReactRedo from './ReactRedo';

/* @jsx ReactRedo.createElement */
const someElem = (
  <div>
    <h1>
      Hey yo
    </h1>
    <h2>
      this is simply amazing
    </h2>
  </div>
);

const container = document.getElementById("root");
ReactRedo.render(someElem, container);
