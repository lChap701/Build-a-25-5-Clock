// Slightly modified to accept 'normal' interval/timeout format (func, time).
const clock = function(fn, time) {
  var nextAt = new Date().getTime() + time,
    timeout = null;

  var wrapper = function() {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };

  var cancel = function() {
    return clearTimeout(timeout);
  };

  var timeout = setTimeout(wrapper, nextAt - new Date().getTime());
  return {
    cancel: cancel
  };
};

/* Safer alternative for eval() */
function convert(data) {
  return window.Function('"use strict";return (' + data + ")")();
}

export { clock, convert };