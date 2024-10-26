/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-base64";
exports.ids = ["vendor-chunks/is-base64"];
exports.modules = {

/***/ "(ssr)/./node_modules/is-base64/is-base64.js":
/*!*********************************************!*\
  !*** ./node_modules/is-base64/is-base64.js ***!
  \*********************************************/
/***/ (function(module, exports) {

eval(";(function(root) {\n  'use strict';\n\n  function isBase64(v, opts) {\n    if (v instanceof Boolean || typeof v === 'boolean') {\n      return false\n    }\n\n    if (!(opts instanceof Object)) {\n      opts = {}\n    }\n\n    if (opts.allowEmpty === false && v === '') {\n      return false\n    }\n\n    var regex = '(?:[A-Za-z0-9+\\\\/]{4})*(?:[A-Za-z0-9+\\\\/]{2}==|[A-Za-z0-9+\\/]{3}=)?'\n    var mimeRegex = '(data:\\\\w+\\\\/[a-zA-Z\\\\+\\\\-\\\\.]+;base64,)'\n\n    if (opts.mimeRequired === true) {\n      regex =  mimeRegex + regex\n    } else if (opts.allowMime === true) {\n      regex = mimeRegex + '?' + regex\n    }\n\n    if (opts.paddingRequired === false) {\n      regex = '(?:[A-Za-z0-9+\\\\/]{4})*(?:[A-Za-z0-9+\\\\/]{2}(==)?|[A-Za-z0-9+\\\\/]{3}=?)?'\n    }\n\n    return (new RegExp('^' + regex + '$', 'gi')).test(v)\n  }\n\n  if (true) {\n    if ( true && module.exports) {\n      exports = module.exports = isBase64\n    }\n    exports.isBase64 = isBase64\n  } else {}\n})(this);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXMtYmFzZTY0L2lzLWJhc2U2NC5qcyIsIm1hcHBpbmdzIjoiQUFBQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBb0MsRUFBRSxxQkFBcUIsRUFBRSxrQkFBa0IsRUFBRTtBQUNqRixxREFBcUQ7O0FBRXJEO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBLGtDQUFrQyxFQUFFLHFCQUFxQixFQUFFLHNCQUFzQixFQUFFO0FBQ25GOztBQUVBO0FBQ0E7O0FBRUEsTUFBTSxJQUE4QjtBQUNwQyxRQUFRLEtBQTZCO0FBQ3JDO0FBQ0E7QUFDQSxJQUFJLGdCQUFnQjtBQUNwQixJQUFJLEtBQUssRUFNTjtBQUNILENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS1hcHAvLi9ub2RlX21vZHVsZXMvaXMtYmFzZTY0L2lzLWJhc2U2NC5qcz8wMTcxIl0sInNvdXJjZXNDb250ZW50IjpbIjsoZnVuY3Rpb24ocm9vdCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gaXNCYXNlNjQodiwgb3B0cykge1xuICAgIGlmICh2IGluc3RhbmNlb2YgQm9vbGVhbiB8fCB0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoIShvcHRzIGluc3RhbmNlb2YgT2JqZWN0KSkge1xuICAgICAgb3B0cyA9IHt9XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuYWxsb3dFbXB0eSA9PT0gZmFsc2UgJiYgdiA9PT0gJycpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHZhciByZWdleCA9ICcoPzpbQS1aYS16MC05K1xcXFwvXXs0fSkqKD86W0EtWmEtejAtOStcXFxcL117Mn09PXxbQS1aYS16MC05K1xcL117M309KT8nXG4gICAgdmFyIG1pbWVSZWdleCA9ICcoZGF0YTpcXFxcdytcXFxcL1thLXpBLVpcXFxcK1xcXFwtXFxcXC5dKztiYXNlNjQsKSdcblxuICAgIGlmIChvcHRzLm1pbWVSZXF1aXJlZCA9PT0gdHJ1ZSkge1xuICAgICAgcmVnZXggPSAgbWltZVJlZ2V4ICsgcmVnZXhcbiAgICB9IGVsc2UgaWYgKG9wdHMuYWxsb3dNaW1lID09PSB0cnVlKSB7XG4gICAgICByZWdleCA9IG1pbWVSZWdleCArICc/JyArIHJlZ2V4XG4gICAgfVxuXG4gICAgaWYgKG9wdHMucGFkZGluZ1JlcXVpcmVkID09PSBmYWxzZSkge1xuICAgICAgcmVnZXggPSAnKD86W0EtWmEtejAtOStcXFxcL117NH0pKig/OltBLVphLXowLTkrXFxcXC9dezJ9KD09KT98W0EtWmEtejAtOStcXFxcL117M309Pyk/J1xuICAgIH1cblxuICAgIHJldHVybiAobmV3IFJlZ0V4cCgnXicgKyByZWdleCArICckJywgJ2dpJykpLnRlc3QodilcbiAgfVxuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGlzQmFzZTY0XG4gICAgfVxuICAgIGV4cG9ydHMuaXNCYXNlNjQgPSBpc0Jhc2U2NFxuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaXNCYXNlNjRcbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIHJvb3QuaXNCYXNlNjQgPSBpc0Jhc2U2NFxuICB9XG59KSh0aGlzKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/is-base64/is-base64.js\n");

/***/ })

};
;