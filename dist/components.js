var CoveoComponents =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, FacetSliderForRange_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(FacetSliderForRange_1);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, coveo_search_ui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ;
    function lazyFacetSliderForRange() {
        function extendFacetQueryController(orig, minField, maxField) {
            var base = { computeOurFilterExpression: orig.computeOurFilterExpression.bind(orig) };
            orig.computeOurFilterExpression = function computeOurFilterExpression(boundary) {
                var result = base.computeOurFilterExpression(boundary);
                if (result)
                    result += (" OR " + result.replace(minField, maxField));
                return result;
            };
        }
        return Coveo.load('FacetSlider').then(function () {
            var FacetSliderForRange = /** @class */ (function (_super) {
                __extends(FacetSliderForRange, _super);
                function FacetSliderForRange(element, options, bindings, slider) {
                    var _this = _super.call(this, element, FacetSliderForRange.initOptions(coveo_search_ui_1.ComponentOptions.initComponentOptions(element, FacetSliderForRange, options)), bindings) || this;
                    _this.element = element;
                    _this.options = options;
                    _this.slider = slider;
                    _this.bind.oneRootElement(coveo_search_ui_1.QueryEvents.doneBuildingQuery, function (args) { return _this.onFirstQuery(args); });
                    _this.bind.oneRootElement(coveo_search_ui_1.QueryEvents.querySuccess, function (args) { return _this.onFirstQuerySuccess(args); });
                    // monkey patching the facetQueryController. It would have been nicer to inherit from facetQueryController and make a custom class,
                    // but it's not easy to plug in a custom FacetQueryController class since Coveo initialized it in the constructor of FacetSlider
                    extendFacetQueryController(_this.facetQueryController, String(_this.options.minField), String(_this.options.maxField));
                    return _this;
                }
                FacetSliderForRange.prototype.onFirstQuery = function (args) {
                    args.queryBuilder.groupByRequests.push(FacetSliderForRange.getGroupByRequest(String(this.options.maxField), "maximum"));
                    args.queryBuilder.groupByRequests.push(FacetSliderForRange.getGroupByRequest(String(this.options.minField), "minimum"));
                };
                FacetSliderForRange.getGroupByRequest = function (field, operation) {
                    return {
                        completeFacetWithStandardValues: true,
                        field: field,
                        generateAutomaticRanges: true,
                        maximumNumberOfValues: 1,
                        sortCriteria: "nosort",
                        "computedFields": [{ field: field, operation: operation }]
                    };
                };
                FacetSliderForRange.prototype.onFirstQuerySuccess = function (args) {
                    var _this = this;
                    var maxFieldGroupBy = args.results.groupByResults.filter(function (x) { return ("@" + x.field) === _this.options.maxField; }).some(function (x) {
                        if (x.globalComputedFieldResults && x.globalComputedFieldResults.length) {
                            _this.options.end = x.globalComputedFieldResults[0];
                            return true;
                        }
                        return false;
                    });
                    var minFieldGroupBy = args.results.groupByResults.filter(function (x) { return ("@" + x.field) === _this.options.minField; }).some(function (x) {
                        if (x.globalComputedFieldResults && x.globalComputedFieldResults.length) {
                            _this.options.start = x.globalComputedFieldResults[0];
                            return true;
                        }
                        return false;
                    });
                    if (maxFieldGroupBy && minFieldGroupBy) {
                        _super.prototype.reset.call(this);
                    }
                    else {
                        throw new Error("FacetSliderForRange.onFirstQuerySuccess: could not identify start or end value");
                    }
                };
                FacetSliderForRange.ID = 'FacetSliderForRange';
                FacetSliderForRange.options = {
                    minField: coveo_search_ui_1.ComponentOptions.buildFieldOption({ groupByField: true, required: true, section: 'CommonOptions' }),
                    maxField: coveo_search_ui_1.ComponentOptions.buildFieldOption({ groupByField: true, required: true, section: 'CommonOptions' })
                };
                FacetSliderForRange.initOptions = function (options) {
                    options.field = options.minField;
                    return options;
                };
                return FacetSliderForRange;
            }(Coveo.FacetSlider));
            ;
            Coveo.Initialization.registerAutoCreateComponent(FacetSliderForRange);
            return FacetSliderForRange;
        });
    }
    exports.default = lazyFacetSliderForRange;
    ;
    Coveo.LazyInitialization.registerLazyComponent('FacetSliderForRange', lazyFacetSliderForRange);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = Coveo;

/***/ })
/******/ ]);
//# sourceMappingURL=components.js.map