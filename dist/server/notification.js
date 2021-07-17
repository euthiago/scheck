import _toConsumableArray from "/home/vitorino/tau/sarscheck/node_modules/@babel/runtime/helpers/esm/toConsumableArray";
import _asyncToGenerator from "/home/vitorino/tau/sarscheck/node_modules/@babel/runtime/helpers/esm/asyncToGenerator";
import "regenerator-runtime/runtime.js";
import "core-js/modules/es.array.join.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.array.concat.js";
import "core-js/modules/es.array.filter.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/es.array.map.js";
import webpush from 'web-push';
import { publicKey, privateKey } from './keys.js';
import fse from 'fs-extra';
import fs from 'fs';
import path from 'path';
webpush.setVapidDetails('mailto:thiagobrasilia@gmail.com', publicKey, privateKey);
var filePath = "subscriptions.json";

var getFilePath = function getFilePath() {
  return path.join(process.cwd(), 'dist/server', filePath);
};

var getSubscriptions = function getSubscriptions() {
  return new Promise( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
      var file, json;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              try {
                file = fs.readFileSync(getFilePath(), 'utf-8');
                json = JSON.parse(file);
                resolve(json);
              } catch (e) {
                if (e.message === "Unexpected end of JSON input") {
                  resolve({
                    subscriptions: []
                  });
                }

                reject(e);
              }

            case 1:
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
};

var saveSubscriptions = function saveSubscriptions(json) {
  return new Promise( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve, reject) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              try {
                fse.writeFileSync(getFilePath(), JSON.stringify(json));
                resolve(true);
              } catch (e) {
                reject(e);
              }

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
};

var receiveSubscription = function receiveSubscription(subscription) {
  return new Promise( /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve, reject) {
      var json, message;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return fse.ensureFile(getFilePath());

            case 3:
              _context3.next = 5;
              return getSubscriptions();

            case 5:
              json = _context3.sent;
              json.subscriptions = [].concat(_toConsumableArray(json.subscriptions.filter(function (s) {
                return s.keys.auth !== subscription.keys.auth;
              })), [subscription]);
              _context3.next = 9;
              return saveSubscriptions(json);

            case 9:
              resolve(true);
              /*
              	Notificando da nova inscrição
              */

              message = "Novo dispositivo ouvindo. ".concat(json.subscriptions.length, " no total.");
              notifyAllSubscriptions(message);
              _context3.next = 18;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](0);
              console.log("erro ao salvar a subscrição", _context3.t0);
              reject(_context3.t0);

            case 18:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 14]]);
    }));

    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());
};
/*
	Envia a mensagem para todas as subscrições
*/


var notifyAllSubscriptions = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(message) {
    var _yield$getSubscriptio, _yield$getSubscriptio2, subscriptions, results;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getSubscriptions();

          case 2:
            _yield$getSubscriptio = _context4.sent;
            _yield$getSubscriptio2 = _yield$getSubscriptio.subscriptions;
            subscriptions = _yield$getSubscriptio2 === void 0 ? [] : _yield$getSubscriptio2;
            console.log("enviando mensagem:", message);
            _context4.prev = 6;
            _context4.next = 9;
            return Promise.all(subscriptions.map(function (subscription) {
              return webpush.sendNotification(subscription, message);
            }));

          case 9:
            results = _context4.sent;
            console.log("tudo certo");
            console.log(results);
            _context4.next = 17;
            break;

          case 14:
            _context4.prev = 14;
            _context4.t0 = _context4["catch"](6);
            console.log(_context4.t0);

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[6, 14]]);
  }));

  return function notifyAllSubscriptions(_x7) {
    return _ref4.apply(this, arguments);
  };
}();

export { receiveSubscription, notifyAllSubscriptions };