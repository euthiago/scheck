"use strict";

require("core-js/stable");

require("regenerator-runtime/runtime");

var _fastify = _interopRequireDefault(require("fastify"));

var _fastifyStatic = _interopRequireDefault(require("fastify-static"));

var _path = _interopRequireDefault(require("path"));

var _notification = require("./notification.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fastify = (0, _fastify.default)({
  logger: true
});
/*
	Static / SPA index
*/
// fastify.get("/*", fastify.use('/css/*', serveStatic('../client')))

fastify.register(_fastifyStatic.default, {
  root: _path.default.join(process.cwd(), 'dist/client')
});
fastify.post('/subscribe', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, reply) {
    var parsedBody, operationResult;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            parsedBody = JSON.parse(req.body);
            _context.next = 3;
            return (0, _notification.receiveSubscription)(parsedBody.subscription);

          case 3:
            operationResult = _context.sent;

            if (!(operationResult === true)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", reply.send("ok"));

          case 6:
            return _context.abrupt("return", reply.send("not ok"));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
fastify.get('/notify', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, reply) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            /*
            	Notificando
            */
            (0, _notification.notifyAllSubscriptions)("Notificação " + Date.now());
            reply.send("ok");

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()); // Run the fastify!

var start = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return fastify.listen(1337);

          case 3:
            console.log("fastify up");
            _context3.next = 10;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](0);
            fastify.log.error(_context3.t0);
            process.exit(1);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 6]]);
  }));

  return function start() {
    return _ref3.apply(this, arguments);
  };
}();

start();