const assert = require('helpbox/source/assert');

let Callcise;

/*
* Parameters passed to the invoker builder are computed
* on demand. They must be functions. They can be other
* functions built using the invocation frameworks or
* can be plain old functions.
*
* Parameters passed to inner functions are just
* usually concatenated to the above parameters when
* passed to the wrapped functions.
*/

/* Private functions. */

function evaluate(that, parameters) {
  return parameters.map(parameter => {
    return parameter.call(that);
  });
}

/* Public functions. */

// Returns a function that gets a property of `this`.
function self(propertyName) {
  return function getOwnProperty() {
    assert(propertyName in this, `No such property: ${propertyName}`);

    return this[propertyName];
  };
}

// Returns a function that calls a function with evaluated arguments plus call-place arguments.
function lambda(f, ...parameters) {
  return function callAnyFunction(...additionalParameters) {
    return f.apply(this, evaluate(this, parameters).concat(additionalParameters));
  };
}

/*
* Returns a function that calls a method identified by its name
* with evaluated arguments plus call-place arguments.
*/
function method(name, ...parameters) {
  return function callΜethod(...additionalParameters) {
    return this[name](...evaluate(this, parameters).concat(additionalParameters));
  };
}

function plugin(Plugin) {
  Object.assign(Callcise, Plugin)
}

Callcise = {
  internal: { evaluate },

  plugin,
  lambda,
  method,
  self
};

module.exports = Callcise;
