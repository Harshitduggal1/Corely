/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/node-domexception";
exports.ids = ["vendor-chunks/node-domexception"];
exports.modules = {

/***/ "(action-browser)/./node_modules/node-domexception/index.js":
/*!*************************************************!*\
  !*** ./node_modules/node-domexception/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */\n\nif (!globalThis.DOMException) {\n  try {\n    const { MessageChannel } = __webpack_require__(/*! worker_threads */ \"worker_threads\"),\n    port = new MessageChannel().port1,\n    ab = new ArrayBuffer()\n    port.postMessage(ab, [ab, ab])\n  } catch (err) {\n    err.constructor.name === 'DOMException' && (\n      globalThis.DOMException = err.constructor\n    )\n  }\n}\n\nmodule.exports = globalThis.DOMException\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9ub2RlLWRvbWV4Y2VwdGlvbi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxpQkFBaUIsRUFBRSxtQkFBTyxDQUFDLHNDQUFnQjtBQUN2RDtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL215LWFwcC8uL25vZGVfbW9kdWxlcy9ub2RlLWRvbWV4Y2VwdGlvbi9pbmRleC5qcz8zNDZhIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISBub2RlLWRvbWV4Y2VwdGlvbi4gTUlUIExpY2Vuc2UuIEppbW15IFfDpHJ0aW5nIDxodHRwczovL2ppbW15LndhcnRpbmcuc2Uvb3BlbnNvdXJjZT4gKi9cblxuaWYgKCFnbG9iYWxUaGlzLkRPTUV4Y2VwdGlvbikge1xuICB0cnkge1xuICAgIGNvbnN0IHsgTWVzc2FnZUNoYW5uZWwgfSA9IHJlcXVpcmUoJ3dvcmtlcl90aHJlYWRzJyksXG4gICAgcG9ydCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpLnBvcnQxLFxuICAgIGFiID0gbmV3IEFycmF5QnVmZmVyKClcbiAgICBwb3J0LnBvc3RNZXNzYWdlKGFiLCBbYWIsIGFiXSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdET01FeGNlcHRpb24nICYmIChcbiAgICAgIGdsb2JhbFRoaXMuRE9NRXhjZXB0aW9uID0gZXJyLmNvbnN0cnVjdG9yXG4gICAgKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsVGhpcy5ET01FeGNlcHRpb25cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/node-domexception/index.js\n");

/***/ })

};
;