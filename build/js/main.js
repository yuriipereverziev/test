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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/object-fit-images/dist/ofi.common-js.js":
/*!**************************************************************!*\
  !*** ./node_modules/object-fit-images/dist/ofi.common-js.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*! npm.im/object-fit-images 3.2.4 */


var OFI = 'bfred-it:object-fit-images';
var propRegex = /(object-fit|object-position)\s*:\s*([-.\w\s%]+)/g;
var testImg = typeof Image === 'undefined' ? {style: {'object-position': 1}} : new Image();
var supportsObjectFit = 'object-fit' in testImg.style;
var supportsObjectPosition = 'object-position' in testImg.style;
var supportsOFI = 'background-size' in testImg.style;
var supportsCurrentSrc = typeof testImg.currentSrc === 'string';
var nativeGetAttribute = testImg.getAttribute;
var nativeSetAttribute = testImg.setAttribute;
var autoModeEnabled = false;

function createPlaceholder(w, h) {
	return ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'%3E%3C/svg%3E");
}

function polyfillCurrentSrc(el) {
	if (el.srcset && !supportsCurrentSrc && window.picturefill) {
		var pf = window.picturefill._;
		// parse srcset with picturefill where currentSrc isn't available
		if (!el[pf.ns] || !el[pf.ns].evaled) {
			// force synchronous srcset parsing
			pf.fillImg(el, {reselect: true});
		}

		if (!el[pf.ns].curSrc) {
			// force picturefill to parse srcset
			el[pf.ns].supported = false;
			pf.fillImg(el, {reselect: true});
		}

		// retrieve parsed currentSrc, if any
		el.currentSrc = el[pf.ns].curSrc || el.src;
	}
}

function getStyle(el) {
	var style = getComputedStyle(el).fontFamily;
	var parsed;
	var props = {};
	while ((parsed = propRegex.exec(style)) !== null) {
		props[parsed[1]] = parsed[2];
	}
	return props;
}

function setPlaceholder(img, width, height) {
	// Default: fill width, no height
	var placeholder = createPlaceholder(width || 1, height || 0);

	// Only set placeholder if it's different
	if (nativeGetAttribute.call(img, 'src') !== placeholder) {
		nativeSetAttribute.call(img, 'src', placeholder);
	}
}

function onImageReady(img, callback) {
	// naturalWidth is only available when the image headers are loaded,
	// this loop will poll it every 100ms.
	if (img.naturalWidth) {
		callback(img);
	} else {
		setTimeout(onImageReady, 100, img, callback);
	}
}

function fixOne(el) {
	var style = getStyle(el);
	var ofi = el[OFI];
	style['object-fit'] = style['object-fit'] || 'fill'; // default value

	// Avoid running where unnecessary, unless OFI had already done its deed
	if (!ofi.img) {
		// fill is the default behavior so no action is necessary
		if (style['object-fit'] === 'fill') {
			return;
		}

		// Where object-fit is supported and object-position isn't (Safari < 10)
		if (
			!ofi.skipTest && // unless user wants to apply regardless of browser support
			supportsObjectFit && // if browser already supports object-fit
			!style['object-position'] // unless object-position is used
		) {
			return;
		}
	}

	// keep a clone in memory while resetting the original to a blank
	if (!ofi.img) {
		ofi.img = new Image(el.width, el.height);
		ofi.img.srcset = nativeGetAttribute.call(el, "data-ofi-srcset") || el.srcset;
		ofi.img.src = nativeGetAttribute.call(el, "data-ofi-src") || el.src;

		// preserve for any future cloneNode calls
		// https://github.com/bfred-it/object-fit-images/issues/53
		nativeSetAttribute.call(el, "data-ofi-src", el.src);
		if (el.srcset) {
			nativeSetAttribute.call(el, "data-ofi-srcset", el.srcset);
		}

		setPlaceholder(el, el.naturalWidth || el.width, el.naturalHeight || el.height);

		// remove srcset because it overrides src
		if (el.srcset) {
			el.srcset = '';
		}
		try {
			keepSrcUsable(el);
		} catch (err) {
			if (window.console) {
				console.warn('https://bit.ly/ofi-old-browser');
			}
		}
	}

	polyfillCurrentSrc(ofi.img);

	el.style.backgroundImage = "url(\"" + ((ofi.img.currentSrc || ofi.img.src).replace(/"/g, '\\"')) + "\")";
	el.style.backgroundPosition = style['object-position'] || 'center';
	el.style.backgroundRepeat = 'no-repeat';
	el.style.backgroundOrigin = 'content-box';

	if (/scale-down/.test(style['object-fit'])) {
		onImageReady(ofi.img, function () {
			if (ofi.img.naturalWidth > el.width || ofi.img.naturalHeight > el.height) {
				el.style.backgroundSize = 'contain';
			} else {
				el.style.backgroundSize = 'auto';
			}
		});
	} else {
		el.style.backgroundSize = style['object-fit'].replace('none', 'auto').replace('fill', '100% 100%');
	}

	onImageReady(ofi.img, function (img) {
		setPlaceholder(el, img.naturalWidth, img.naturalHeight);
	});
}

function keepSrcUsable(el) {
	var descriptors = {
		get: function get(prop) {
			return el[OFI].img[prop ? prop : 'src'];
		},
		set: function set(value, prop) {
			el[OFI].img[prop ? prop : 'src'] = value;
			nativeSetAttribute.call(el, ("data-ofi-" + prop), value); // preserve for any future cloneNode
			fixOne(el);
			return value;
		}
	};
	Object.defineProperty(el, 'src', descriptors);
	Object.defineProperty(el, 'currentSrc', {
		get: function () { return descriptors.get('currentSrc'); }
	});
	Object.defineProperty(el, 'srcset', {
		get: function () { return descriptors.get('srcset'); },
		set: function (ss) { return descriptors.set(ss, 'srcset'); }
	});
}

function hijackAttributes() {
	function getOfiImageMaybe(el, name) {
		return el[OFI] && el[OFI].img && (name === 'src' || name === 'srcset') ? el[OFI].img : el;
	}
	if (!supportsObjectPosition) {
		HTMLImageElement.prototype.getAttribute = function (name) {
			return nativeGetAttribute.call(getOfiImageMaybe(this, name), name);
		};

		HTMLImageElement.prototype.setAttribute = function (name, value) {
			return nativeSetAttribute.call(getOfiImageMaybe(this, name), name, String(value));
		};
	}
}

function fix(imgs, opts) {
	var startAutoMode = !autoModeEnabled && !imgs;
	opts = opts || {};
	imgs = imgs || 'img';

	if ((supportsObjectPosition && !opts.skipTest) || !supportsOFI) {
		return false;
	}

	// use imgs as a selector or just select all images
	if (imgs === 'img') {
		imgs = document.getElementsByTagName('img');
	} else if (typeof imgs === 'string') {
		imgs = document.querySelectorAll(imgs);
	} else if (!('length' in imgs)) {
		imgs = [imgs];
	}

	// apply fix to all
	for (var i = 0; i < imgs.length; i++) {
		imgs[i][OFI] = imgs[i][OFI] || {
			skipTest: opts.skipTest
		};
		fixOne(imgs[i]);
	}

	if (startAutoMode) {
		document.body.addEventListener('load', function (e) {
			if (e.target.tagName === 'IMG') {
				fix(e.target, {
					skipTest: opts.skipTest
				});
			}
		}, true);
		autoModeEnabled = true;
		imgs = 'img'; // reset to a generic selector for watchMQ
	}

	// if requested, watch media queries for object-fit change
	if (opts.watchMQ) {
		window.addEventListener('resize', fix.bind(null, imgs, {
			skipTest: opts.skipTest
		}));
	}
}

fix.supportsObjectFit = supportsObjectFit;
fix.supportsObjectPosition = supportsObjectPosition;

hijackAttributes();

module.exports = fix;


/***/ }),

/***/ "./src/js/data/productInfo.js":
/*!************************************!*\
  !*** ./src/js/data/productInfo.js ***!
  \************************************/
/*! exports provided: productsInfo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "productsInfo", function() { return productsInfo; });
var productsInfo = {
  ro: {
    guavital: {
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Pierdere în greutate',
      country: 'Romania',
      productName: 'GUAVITAL+',
      salePrice: "508",
      newPrice: "1690"
    },
    wintex: {
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Varice',
      country: 'Romania',
      productName: 'Wintex Ultra',
      salePrice: "511",
      newPrice: "2034"
    },
    exofeet_oil: {
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Ciupercă',
      country: 'Romania',
      productName: 'Exofeet Oil',
      salePrice: "502",
      newPrice: "1505"
    },
    paraxan: {
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Paraziți',
      country: 'Romania',
      productName: 'Paraxan',
      salePrice: "800",
      newPrice: "111111"
    },
    deluron: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Prostatita',
      country: 'Romania',
      productName: 'Deluron Forte',
      salePrice: "800",
      newPrice: "111111"
    },
    visoptic_duo_night: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Vederea',
      country: 'Romania',
      productName: 'Visoptic DUO Night',
      salePrice: "800",
      newPrice: "111111"
    },
    visoptic_duo_day: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Vederea',
      country: 'Romania',
      productName: 'Visoptic DUO Day',
      salePrice: "800",
      newPrice: "111111"
    },
    beauty_age_skin: {
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Întinerire',
      country: 'Romania',
      productName: 'Beauty Age Skin',
      salePrice: "800",
      newPrice: "111111"
    },
    beauty_age_skin_peeling: {
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Întinerire',
      country: 'Romania',
      productName: 'Beauty Age Skin Peeling',
      salePrice: "800",
      newPrice: "111111"
    },
    ottomax: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Auz',
      country: 'Romania',
      productName: 'Ottomax+',
      salePrice: "800",
      newPrice: "111111"
    },
    vermixin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Paraziți',
      country: 'Romania',
      productName: 'Vermixin',
      salePrice: "800",
      newPrice: "111111"
    },
    wirex: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Potență',
      country: 'Romania',
      productName: 'Wirex men’s formula',
      salePrice: "800",
      newPrice: "111111"
    },
    depanten: {
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Articulații',
      country: 'Romania',
      productName: 'Depanten',
      salePrice: "800",
      newPrice: "111111"
    },
    feronex: {
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Potență',
      country: 'Romania',
      productName: 'Feronex',
      salePrice: "800",
      newPrice: "111111"
    },
    steplex: {
      modifier: 'img-space--left',
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Articulații',
      country: 'Romania',
      productName: 'Steplex',
      salePrice: "800",
      newPrice: "111111"
    },
    neoveris: {
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Varice',
      country: 'Romania',
      productName: 'Neoveris',
      salePrice: "800",
      newPrice: "111111"
    },
    keramin: {
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Ciupercă',
      country: 'Romania',
      productName: 'Keramin',
      salePrice: "800",
      newPrice: "111111"
    },
    delislim: {
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Pierdere în greutate',
      country: 'Romania',
      productName: 'Delislim',
      salePrice: "800",
      newPrice: "111111"
    },
    ophtalax: {
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Vederea',
      country: 'Romania',
      productName: 'Ophtalax',
      salePrice: "800",
      newPrice: "111111"
    },
    rectin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402523',
      niche: 'Hemoroizi',
      country: 'Romania',
      productName: 'Rectin',
      salePrice: "800",
      newPrice: "111111"
    }
  },
  hu: {
    guavital: {
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Fogyás',
      country: 'Hungary',
      productName: 'GUAVITAL+',
      salePrice: "508",
      newPrice: "1690"
    },
    wintex: {
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Visszerek',
      country: 'Hungary',
      productName: 'Wintex Ultra',
      salePrice: "511",
      newPrice: "2034"
    },
    exofeet_oil: {
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Gomba',
      country: 'Hungary',
      productName: 'Exofeet Oil',
      salePrice: "502",
      newPrice: "1505"
    },
    paraxan: {
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Paraziták',
      country: 'Hungary',
      productName: 'Paraxan',
      salePrice: "800",
      newPrice: "111111"
    },
    deluron: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Prosztatagyulladás',
      country: 'Hungary',
      productName: 'Deluron Forte',
      salePrice: "800",
      newPrice: "111111"
    },
    visoptic_duo_night: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Látás',
      country: 'Hungary',
      productName: 'Visoptic DUO Night',
      salePrice: "800",
      newPrice: "111111"
    },
    visoptic_duo_day: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Látás',
      country: 'Hungary',
      productName: 'Visoptic DUO Day',
      salePrice: "800",
      newPrice: "111111"
    },
    beauty_age_skin: {
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Fiatalítás',
      country: 'Hungary',
      productName: 'Beauty Age Skin',
      salePrice: "800",
      newPrice: "111111"
    },
    beauty_age_skin_peeling: {
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Fiatalítás',
      country: 'Hungary',
      productName: 'Beauty Age Skin Peeling',
      salePrice: "800",
      newPrice: "111111"
    },
    ottomax: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Hallás',
      country: 'Hungary',
      productName: 'Ottomax+',
      salePrice: "800",
      newPrice: "111111"
    },
    vermixin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Paraziták',
      country: 'Hungary',
      productName: 'Vermixin',
      salePrice: "800",
      newPrice: "111111"
    },
    wirex: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Potencia',
      country: 'Hungary',
      productName: 'Wirex men’s formula',
      salePrice: "800",
      newPrice: "111111"
    },
    depanten: {
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Ízületek',
      country: 'Hungary',
      productName: 'Depanten',
      salePrice: "800",
      newPrice: "111111"
    },
    feronex: {
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Potencia',
      country: 'Hungary',
      productName: 'Feronex',
      salePrice: "800",
      newPrice: "111111"
    },
    steplex: {
      modifier: 'img-space--left',
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Ízületek',
      country: 'Hungary',
      productName: 'Steplex',
      salePrice: "800",
      newPrice: "111111"
    },
    neoveris: {
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Visszerek',
      country: 'Hungary',
      productName: 'Neoveris',
      salePrice: "800",
      newPrice: "111111"
    },
    keramin: {
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Gomba',
      country: 'Hungary',
      productName: 'Keramin',
      salePrice: "800",
      newPrice: "111111"
    },
    delislim: {
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Fogyás',
      country: 'Hungary',
      productName: 'Delislim',
      salePrice: "800",
      newPrice: "111111"
    },
    ophtalax: {
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Látás',
      country: 'Hungary',
      productName: 'Ophtalax',
      salePrice: "800",
      newPrice: "111111"
    },
    rectin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1402524',
      niche: 'Aranyér',
      country: 'Hungary',
      productName: 'Rectin',
      salePrice: "800",
      newPrice: "111111"
    }
  },
  it: {
    guavital: {
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Dimagrimento',
      country: 'Italy',
      productName: 'GUAVITAL+',
      salePrice: "28",
      newPrice: "120"
    },
    wintex: {
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Varici',
      country: 'Italy',
      productName: 'Wintex Ultra',
      salePrice: "29",
      newPrice: "99"
    },
    exofeet_oil: {
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Fungo',
      country: 'Italy',
      productName: 'Exofeet Oil',
      salePrice: "26",
      newPrice: "94"
    },
    paraxan: {
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Parassiti',
      country: 'Italy',
      productName: 'Paraxan',
      salePrice: "28",
      newPrice: "86"
    },
    deluron: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Prostatite',
      country: 'Italy',
      productName: 'Deluron Forte',
      salePrice: "29",
      newPrice: "118"
    },
    visoptic_duo_night: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Vista',
      country: 'Italy',
      productName: 'Visoptic DUO Night',
      salePrice: "29",
      newPrice: "119"
    },
    visoptic_duo_day: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Vista',
      country: 'Italy',
      productName: 'Visoptic DUO Day',
      salePrice: "26",
      newPrice: "97"
    },
    beauty_age_skin: {
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Ringiovanimento',
      country: 'Italy',
      productName: 'Beauty Age Skin',
      salePrice: "28",
      newPrice: "170"
    },
    beauty_age_skin_peeling: {
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Ringiovanimento',
      country: 'Italy',
      productName: 'Beauty Age Skin Peeling',
      salePrice: "30",
      newPrice: "168"
    },
    ottomax: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Udito',
      country: 'Italy',
      productName: 'Ottomax+',
      salePrice: "27",
      newPrice: "140"
    },
    vermixin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Parassiti',
      country: 'Italy',
      productName: 'Vermixin',
      salePrice: "30",
      newPrice: "112"
    },
    wirex: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Potenza',
      country: 'Italy',
      productName: 'Wirex men’s formula',
      salePrice: "30",
      newPrice: "149"
    },
    depanten: {
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Articolazioni',
      country: 'Italy',
      productName: 'Depanten',
      salePrice: "27",
      newPrice: "79"
    },
    feronex: {
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Potenza',
      country: 'Italy',
      productName: 'Feronex',
      salePrice: "27",
      newPrice: "156"
    },
    steplex: {
      modifier: 'img-space--left',
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Articolazioni',
      country: 'Italy',
      productName: 'Steplex',
      salePrice: "27",
      newPrice: "71"
    },
    neoveris: {
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Varici',
      country: 'Italy',
      productName: 'Neoveris',
      salePrice: "26",
      newPrice: "75"
    },
    keramin: {
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Fungo',
      country: 'Italy',
      productName: 'Keramin',
      salePrice: "28",
      newPrice: "106"
    },
    delislim: {
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Dimagrimento',
      country: 'Italy',
      productName: 'Delislim',
      salePrice: "30",
      newPrice: "100"
    },
    ophtalax: {
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Vista',
      country: 'Italy',
      productName: 'Ophtalax',
      salePrice: "28",
      newPrice: "123"
    },
    rectin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082471',
      niche: 'Emorroide',
      country: 'Italy',
      productName: 'Rectin',
      salePrice: "26",
      newPrice: "80"
    }
  },
  cz: {
    guavital: {
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Hubnutí',
      country: 'Czech',
      productName: 'GUAVITAL+',
      salePrice: "508",
      newPrice: "1690"
    },
    wintex: {
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Křečové žíly',
      country: 'Czech',
      productName: 'Wintex Ultra',
      salePrice: "511",
      newPrice: "2034"
    },
    exofeet_oil: {
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Fungus',
      country: 'Czech',
      productName: 'Exofeet Oil',
      salePrice: "502",
      newPrice: "1505"
    },
    paraxan: {
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Paraziti',
      country: 'Czech',
      productName: 'Paraxan',
      salePrice: "506",
      newPrice: "1786"
    },
    deluron: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Zánět prostaty',
      country: 'Czech',
      productName: 'Deluron Forte',
      salePrice: "507",
      newPrice: "2190"
    },
    visoptic_duo_night: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Zrak',
      country: 'Czech',
      productName: 'Visoptic DUO Night',
      salePrice: "517",
      newPrice: "1529"
    },
    visoptic_duo_day: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Zrak',
      country: 'Czech',
      productName: 'Visoptic DUO Day',
      salePrice: "521",
      newPrice: "2385"
    },
    beauty_age_skin: {
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Omlazování',
      country: 'Czech',
      productName: 'Beauty Age Skin',
      salePrice: "523",
      newPrice: "2736"
    },
    beauty_age_skin_peeling: {
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Omlazování',
      country: 'Czech',
      productName: 'Beauty Age Skin Peeling',
      salePrice: "524",
      newPrice: "3199"
    },
    ottomax: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Sluch',
      country: 'Czech',
      productName: 'Ottomax+',
      salePrice: "518",
      newPrice: "2455"
    },
    vermixin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Paraziti',
      country: 'Czech',
      productName: 'Vermixin',
      salePrice: "509",
      newPrice: "1644"
    },
    wirex: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Potence',
      country: 'Czech',
      productName: 'Wirex men’s formula',
      salePrice: "516",
      newPrice: "2694"
    },
    depanten: {
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Klouby',
      country: 'Czech',
      productName: 'Depanten',
      salePrice: "514",
      newPrice: "1465"
    },
    feronex: {
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Potence',
      country: 'Czech',
      productName: 'Feronex',
      salePrice: "522",
      newPrice: "3550"
    },
    steplex: {
      modifier: 'img-space--left',
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Klouby',
      country: 'Czech',
      productName: 'Steplex',
      salePrice: "520",
      newPrice: "3065"
    },
    neoveris: {
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Křečové žíly',
      country: 'Czech',
      productName: 'Neoveris',
      salePrice: "505",
      newPrice: "1874"
    },
    keramin: {
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Fungus',
      country: 'Czech',
      productName: 'Keramin',
      salePrice: "525",
      newPrice: "2654"
    },
    delislim: {
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Hubnutí',
      country: 'Czech',
      productName: 'Delislim',
      salePrice: "510",
      newPrice: "2165"
    },
    ophtalax: {
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Zrak',
      country: 'Czech',
      productName: 'Ophtalax',
      salePrice: "515",
      newPrice: "1765"
    },
    rectin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082469',
      niche: 'Hemoroidy',
      country: 'Czech',
      productName: 'Rectin',
      salePrice: "519",
      newPrice: "1983"
    }
  },
  bg: {
    guavital: {
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Отслабване',
      country: 'Bulgaria',
      productName: 'GUAVITAL+',
      salePrice: "43",
      newPrice: "190"
    },
    wintex: {
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Варикоза',
      country: 'Bulgaria',
      productName: 'Wintex Ultra',
      salePrice: "43",
      newPrice: "149"
    },
    exofeet_oil: {
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Гъбички',
      country: 'Bulgaria',
      productName: 'Exofeet Oil',
      salePrice: "44",
      newPrice: "159"
    },
    paraxan: {
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Паразити',
      country: 'Bulgaria',
      productName: 'Paraxan',
      salePrice: "45",
      newPrice: "137"
    },
    deluron: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Простатит',
      country: 'Bulgaria',
      productName: 'Deluron Forte',
      salePrice: "45",
      newPrice: "179"
    },
    visoptic_duo_night: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Зрение',
      country: 'Bulgaria',
      productName: 'Visoptic DUO Night',
      salePrice: "44",
      newPrice: "186"
    },
    visoptic_duo_day: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Зрение',
      country: 'Bulgaria',
      productName: 'Visoptic DUO Day',
      salePrice: "44",
      newPrice: "157"
    },
    beauty_age_skin: {
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Подмладяване',
      country: 'Bulgaria',
      productName: 'Beauty Age Skin',
      salePrice: "45",
      newPrice: "280"
    },
    beauty_age_skin_peeling: {
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Подмладяване',
      country: 'Bulgaria',
      productName: 'Beauty Age Skin Peeling',
      salePrice: "43",
      newPrice: "239"
    },
    ottomax: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Слух',
      country: 'Bulgaria',
      productName: 'Ottomax+',
      salePrice: "42",
      newPrice: "217"
    },
    vermixin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Паразити',
      country: 'Bulgaria',
      productName: 'Vermixin',
      salePrice: "43",
      newPrice: "161"
    },
    wirex: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Потентност',
      country: 'Bulgaria',
      productName: 'Wirex men’s formula',
      salePrice: "44",
      newPrice: "220"
    },
    depanten: {
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Стави',
      country: 'Bulgaria',
      productName: 'Depanten',
      salePrice: "44",
      newPrice: "140"
    },
    feronex: {
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Потентност',
      country: 'Bulgaria',
      productName: 'Feronex',
      salePrice: "43",
      newPrice: "250"
    },
    steplex: {
      modifier: 'img-space--left',
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Стави',
      country: 'Bulgaria',
      productName: 'Steplex',
      salePrice: "43",
      newPrice: "121"
    },
    neoveris: {
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Варикоза',
      country: 'Bulgaria',
      productName: 'Neoveris',
      salePrice: "42",
      newPrice: "123"
    },
    keramin: {
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Гъбички',
      country: 'Bulgaria',
      productName: 'Keramin',
      salePrice: "45",
      newPrice: "164"
    },
    delislim: {
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Отслабване',
      country: 'Bulgaria',
      productName: 'Delislim',
      salePrice: "45",
      newPrice: "150"
    },
    ophtalax: {
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Зрение',
      country: 'Bulgaria',
      productName: 'Ophtalax',
      salePrice: "45",
      newPrice: "205"
    },
    rectin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082459',
      niche: 'Хемороиди',
      country: 'Bulgaria',
      productName: 'Rectin',
      salePrice: "42",
      newPrice: "130"
    }
  },
  ee: {
    guavital: {
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Kaalulangetus',
      country: 'Estonia',
      productName: 'GUAVITAL+',
      salePrice: "26",
      newPrice: "112"
    },
    wintex: {
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Varikoos',
      country: 'Estonia',
      productName: 'Wintex Ultra',
      salePrice: "25",
      newPrice: "73"
    },
    exofeet_oil: {
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Seenhaigus',
      country: 'Estonia',
      productName: 'Exofeet Oil',
      salePrice: "25",
      newPrice: "96"
    },
    paraxan: {
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Parasiidid',
      country: 'Estonia',
      productName: 'Paraxan',
      salePrice: "25",
      newPrice: "89"
    },
    deluron: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Prostatiit',
      country: 'Estonia',
      productName: 'Deluron Forte',
      salePrice: "26",
      newPrice: "80"
    },
    visoptic_duo_night: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Nägemine',
      country: 'Estonia',
      productName: 'Visoptic DUO Night',
      salePrice: "26",
      newPrice: "97"
    },
    visoptic_duo_day: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Nägemine',
      country: 'Estonia',
      productName: 'Visoptic DUO Day',
      salePrice: "24",
      newPrice: "139"
    },
    beauty_age_skin: {
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Noorenemine',
      country: 'Estonia',
      productName: 'Beauty Age Skin',
      salePrice: "26",
      newPrice: "136"
    },
    beauty_age_skin_peeling: {
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Noorenemine',
      country: 'Estonia',
      productName: 'Beauty Age Skin Peeling',
      salePrice: "26",
      newPrice: "165"
    },
    ottomax: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Kuulmine',
      country: 'Estonia',
      productName: 'Ottomax+',
      salePrice: "25",
      newPrice: "119"
    },
    vermixin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Parasiidid',
      country: 'Estonia',
      productName: 'Vermixin',
      salePrice: "26",
      newPrice: "79"
    },
    wirex: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Potents',
      country: 'Estonia',
      productName: 'Wirex men’s formula',
      salePrice: "26",
      newPrice: "102"
    },
    // depanten: {
    //     company: 'everad',
    //     campaign_id: '1082460',
    //     niche: 'Liigesed',
    //     country: 'Estonia',
    //     productName: 'Depanten',
    //     salePrice: "800",
    //     newPrice: "111111",
    // },
    feronex: {
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Potents',
      country: 'Estonia',
      productName: 'Feronex',
      salePrice: "25",
      newPrice: "125"
    },
    steplex: {
      modifier: 'img-space--left',
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Liigesed',
      country: 'Estonia',
      productName: 'Steplex',
      salePrice: "26",
      newPrice: "69"
    },
    neoveris: {
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Varikoos',
      country: 'Estonia',
      productName: 'Neoveris',
      salePrice: "24",
      newPrice: "77"
    },
    keramin: {
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Seenhaigus',
      country: 'Estonia',
      productName: 'Keramin',
      salePrice: "26",
      newPrice: "82"
    },
    delislim: {
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Kaalulangetus',
      country: 'Estonia',
      productName: 'Delislim',
      salePrice: "26",
      newPrice: "82"
    },
    ophtalax: {
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Nägemine',
      country: 'Estonia',
      productName: 'Ophtalax',
      salePrice: "26",
      newPrice: "109"
    },
    rectin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082460',
      niche: 'Hemorroidid',
      country: 'Estonia',
      productName: 'Rectin',
      salePrice: "24",
      newPrice: "88"
    }
  },
  hr: {
    guavital: {
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Mršavljenje',
      country: 'Croatia',
      productName: 'GUAVITAL+',
      salePrice: "26",
      newPrice: "112"
    },
    wintex: {
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Proširene vene',
      country: 'Croatia',
      productName: 'Wintex Ultra',
      salePrice: "24",
      newPrice: "82"
    },
    exofeet_oil: {
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Gljivice',
      country: 'Croatia',
      productName: 'Exofeet Oil',
      salePrice: "25",
      newPrice: "89"
    },
    paraxan: {
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Paraziti',
      country: 'Croatia',
      productName: 'Paraxan',
      salePrice: "26",
      newPrice: "79"
    },
    deluron: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Prostatitis',
      country: 'Croatia',
      productName: 'Deluron Forte',
      salePrice: "26",
      newPrice: "102"
    },
    visoptic_duo_night: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Vid',
      country: 'Croatia',
      productName: 'Visoptic DUO Night',
      salePrice: "26",
      newPrice: "109"
    },
    visoptic_duo_day: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Vid',
      country: 'Croatia',
      productName: 'Visoptic DUO Day',
      salePrice: "26",
      newPrice: "97"
    },
    beauty_age_skin: {
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Pomlađivanje',
      country: 'Croatia',
      productName: 'Beauty Age Skin',
      salePrice: "26",
      newPrice: "165"
    },
    beauty_age_skin_peeling: {
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Pomlađivanje',
      country: 'Croatia',
      productName: 'Beauty Age Skin Peeling',
      salePrice: "24",
      newPrice: "135"
    },
    ottomax: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Sluh',
      country: 'Croatia',
      productName: 'Ottomax+',
      salePrice: "26",
      newPrice: "136"
    },
    vermixin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Paraziti',
      country: 'Croatia',
      productName: 'Vermixin',
      salePrice: "24",
      newPrice: "88"
    },
    wirex: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Potencija',
      country: 'Croatia',
      productName: 'Wirex men’s formula',
      salePrice: "25",
      newPrice: "125"
    },
    depanten: {
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Zglobovi',
      country: 'Croatia',
      productName: 'Depanten',
      salePrice: "24",
      newPrice: "77"
    },
    feronex: {
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Potencija',
      country: 'Croatia',
      productName: 'Feronex',
      salePrice: "24",
      newPrice: "139"
    },
    steplex: {
      modifier: 'img-space--left',
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Zglobovi',
      country: 'Croatia',
      productName: 'Steplex',
      salePrice: "26",
      newPrice: "75"
    },
    neoveris: {
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Proširene vene',
      country: 'Croatia',
      productName: 'Neoveris',
      salePrice: "25",
      newPrice: "73"
    },
    keramin: {
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Gljivice',
      country: 'Croatia',
      productName: 'Keramin',
      salePrice: "26",
      newPrice: "82"
    },
    delislim: {
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Mršavljenje',
      country: 'Croatia',
      productName: 'Delislim',
      salePrice: "26",
      newPrice: "82"
    },
    ophtalax: {
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Vid',
      country: 'Croatia',
      productName: 'Ophtalax',
      salePrice: "26",
      newPrice: "119"
    },
    rectin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082465',
      niche: 'Hemoroidi',
      country: 'Croatia',
      productName: 'Rectin',
      salePrice: "26",
      newPrice: "80"
    }
  },
  lt: {
    guavital: {
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Lieknėjimas',
      country: 'Lithuania',
      productName: 'GUAVITAL+',
      salePrice: "26",
      newPrice: "112"
    },
    wintex: {
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Venų varikozė',
      country: 'Lithuania',
      productName: 'Wintex Ultra',
      salePrice: "25",
      newPrice: "73"
    },
    exofeet_oil: {
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Grybelis',
      country: 'Lithuania',
      productName: 'Exofeet Oil',
      salePrice: "25",
      newPrice: "96"
    },
    paraxan: {
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Parazitai',
      country: 'Lithuania',
      productName: 'Paraxan',
      salePrice: "25",
      newPrice: "89"
    },
    deluron: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Prostatitas',
      country: 'Lithuania',
      productName: 'Deluron Forte',
      salePrice: "26",
      newPrice: "80"
    },
    visoptic_duo_night: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Regėjimas',
      country: 'Lithuania',
      productName: 'Visoptic DUO Night',
      salePrice: "26",
      newPrice: "97"
    },
    visoptic_duo_day: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Regėjimas',
      country: 'Lithuania',
      productName: 'Visoptic DUO Day',
      salePrice: "24",
      newPrice: "139"
    },
    beauty_age_skin: {
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Atjauninimas',
      country: 'Lithuania',
      productName: 'Beauty Age Skin',
      salePrice: "26",
      newPrice: "136"
    },
    beauty_age_skin_peeling: {
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Atjauninimas',
      country: 'Lithuania',
      productName: 'Beauty Age Skin Peeling',
      salePrice: "26",
      newPrice: "165"
    },
    ottomax: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Klausa',
      country: 'Lithuania',
      productName: 'Ottomax+',
      salePrice: "25",
      newPrice: "119"
    },
    vermixin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Parazitai',
      country: 'Lithuania',
      productName: 'Vermixin',
      salePrice: "26",
      newPrice: "79"
    },
    wirex: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Potencja',
      country: 'Lithuania',
      productName: 'Wirex men’s formula',
      salePrice: "26",
      newPrice: "102"
    },
    // depanten: {
    //     company: 'everad',
    //     campaign_id: '1082458',
    //     niche: 'Sąnariai',
    //     country: 'Lithuania',
    //     productName: 'Depanten',
    //     salePrice: "800",
    //     newPrice: "111111",
    // },
    feronex: {
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Potencja',
      country: 'Lithuania',
      productName: 'Feronex',
      salePrice: "25",
      newPrice: "125"
    },
    steplex: {
      modifier: 'img-space--left',
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Sąnariai',
      country: 'Lithuania',
      productName: 'Steplex',
      salePrice: "26",
      newPrice: "69"
    },
    neoveris: {
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Venų varikozė',
      country: 'Lithuania',
      productName: 'Neoveris',
      salePrice: "24",
      newPrice: "77"
    },
    keramin: {
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Grybelis',
      country: 'Lithuania',
      productName: 'Keramin',
      salePrice: "26",
      newPrice: "82"
    },
    delislim: {
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Lieknėjimas',
      country: 'Lithuania',
      productName: 'Delislim',
      salePrice: "26",
      newPrice: "82"
    },
    ophtalax: {
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Regėjimas',
      country: 'Lithuania',
      productName: 'Ophtalax',
      salePrice: "26",
      newPrice: "109"
    },
    rectin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082458',
      niche: 'Hemorojus',
      country: 'Lithuania',
      productName: 'Rectin',
      salePrice: "24",
      newPrice: "88"
    }
  },
  lv: {
    guavital: {
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Tievēšana',
      country: 'Latvia',
      productName: 'GUAVITAL+',
      salePrice: "26",
      newPrice: "112"
    },
    wintex: {
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Varikoze',
      country: 'Latvia',
      productName: 'Wintex Ultra',
      salePrice: "25",
      newPrice: "73"
    },
    exofeet_oil: {
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Sēnīte',
      country: 'Latvia',
      productName: 'Exofeet Oil',
      salePrice: "25",
      newPrice: "96"
    },
    paraxan: {
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Parazīti',
      country: 'Latvia',
      productName: 'Paraxan',
      salePrice: "25",
      newPrice: "89"
    },
    deluron: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Prostatīts',
      country: 'Latvia',
      productName: 'Deluron Forte',
      salePrice: "26",
      newPrice: "80"
    },
    visoptic_duo_night: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Redze',
      country: 'Latvia',
      productName: 'Visoptic DUO Night',
      salePrice: "26",
      newPrice: "97"
    },
    visoptic_duo_day: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Redze',
      country: 'Latvia',
      productName: 'Visoptic DUO Day',
      salePrice: "24",
      newPrice: "139"
    },
    beauty_age_skin: {
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Ādas atjaunošana',
      country: 'Latvia',
      productName: 'Beauty Age Skin',
      salePrice: "26",
      newPrice: "136"
    },
    beauty_age_skin_peeling: {
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Ādas atjaunošana',
      country: 'Latvia',
      productName: 'Beauty Age Skin Peeling',
      salePrice: "26",
      newPrice: "165"
    },
    ottomax: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Dzirde',
      country: 'Latvia',
      productName: 'Ottomax+',
      salePrice: "25",
      newPrice: "119"
    },
    vermixin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Parazīti',
      country: 'Latvia',
      productName: 'Vermixin',
      salePrice: "26",
      newPrice: "79"
    },
    wirex: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Potence',
      country: 'Latvia',
      productName: 'Wirex men’s formula',
      salePrice: "26",
      newPrice: "102"
    },
    // depanten: {
    //     company: 'everad',
    //     campaign_id: '1082461',
    //     niche: 'Locītavas',
    //     country: 'Latvia',
    //     productName: 'Depanten',
    //     salePrice: "800",
    //     newPrice: "111111",
    // },
    feronex: {
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Potence',
      country: 'Latvia',
      productName: 'Feronex',
      salePrice: "25",
      newPrice: "125"
    },
    steplex: {
      modifier: 'img-space--left',
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Locītavas',
      country: 'Latvia',
      productName: 'Steplex',
      salePrice: "26",
      newPrice: "69"
    },
    neoveris: {
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Varikoze',
      country: 'Latvia',
      productName: 'Neoveris',
      salePrice: "24",
      newPrice: "77"
    },
    keramin: {
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Sēnīte',
      country: 'Latvia',
      productName: 'Keramin',
      salePrice: "82",
      newPrice: "26"
    },
    delislim: {
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Tievēšana',
      country: 'Latvia',
      productName: 'Delislim',
      salePrice: "26",
      newPrice: "82"
    },
    ophtalax: {
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Redze',
      country: 'Latvia',
      productName: 'Ophtalax',
      salePrice: "26",
      newPrice: "109"
    },
    rectin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082461',
      niche: 'Hemoroīdi',
      country: 'Latvia',
      productName: 'Rectin',
      salePrice: "24",
      newPrice: "88"
    }
  },
  pt: {
    guavital: {
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Perda de peso',
      country: 'Portugal',
      productName: 'GUAVITAL+',
      salePrice: "28",
      newPrice: "120"
    },
    wintex: {
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Varizes',
      country: 'Portugal',
      productName: 'Wintex Ultra',
      salePrice: "29",
      newPrice: "99"
    },
    exofeet_oil: {
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Fungo',
      country: 'Portugal',
      productName: 'Exofeet Oil',
      salePrice: "26",
      newPrice: "94"
    },
    paraxan: {
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Parasitas',
      country: 'Portugal',
      productName: 'Paraxan',
      salePrice: "28",
      newPrice: "86"
    },
    deluron: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Prostatite',
      country: 'Portugal',
      productName: 'Deluron Forte',
      salePrice: "29",
      newPrice: "118"
    },
    visoptic_duo_night: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Visão',
      country: 'Portugal',
      productName: 'Visoptic DUO Night',
      salePrice: "29",
      newPrice: "119"
    },
    visoptic_duo_day: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Visão',
      country: 'Portugal',
      productName: 'Visoptic DUO Day',
      salePrice: "26",
      newPrice: "97"
    },
    beauty_age_skin: {
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Rejuvenescimento',
      country: 'Portugal',
      productName: 'Beauty Age Skin',
      salePrice: "28",
      newPrice: "170"
    },
    beauty_age_skin_peeling: {
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Rejuvenescimento',
      country: 'Portugal',
      productName: 'Beauty Age Skin Peeling',
      salePrice: "30",
      newPrice: "168"
    },
    ottomax: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Audição',
      country: 'Portugal',
      productName: 'Ottomax+',
      salePrice: "27",
      newPrice: "140"
    },
    vermixin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Parasitas',
      country: 'Portugal',
      productName: 'Vermixin',
      salePrice: "30",
      newPrice: "112"
    },
    wirex: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Potência',
      country: 'Portugal',
      productName: 'Wirex men’s formula',
      salePrice: "30",
      newPrice: "149"
    },
    depanten: {
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Articulações',
      country: 'Portugal',
      productName: 'Depanten',
      salePrice: "27",
      newPrice: "79"
    },
    feronex: {
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Potência',
      country: 'Portugal',
      productName: 'Feronex',
      salePrice: "27",
      newPrice: "156"
    },
    steplex: {
      modifier: 'img-space--left',
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Articulações',
      country: 'Portugal',
      productName: 'Steplex',
      salePrice: "26",
      newPrice: "75"
    },
    neoveris: {
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Varizes',
      country: 'Portugal',
      productName: 'Neoveris',
      salePrice: "26",
      newPrice: "75"
    },
    keramin: {
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Fungo',
      country: 'Portugal',
      productName: 'Keramin',
      salePrice: "106",
      newPrice: "30"
    },
    delislim: {
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Perda de peso',
      country: 'Portugal',
      productName: 'Delislim',
      salePrice: "30",
      newPrice: "100"
    },
    ophtalax: {
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Visão',
      country: 'Portugal',
      productName: 'Ophtalax',
      salePrice: "27",
      newPrice: "123"
    },
    rectin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082463',
      niche: 'Hemorróidas',
      country: 'Portugal',
      productName: 'Rectin',
      salePrice: "26",
      newPrice: "80"
    }
  },
  pl: {
    guavital: {
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Odchudzanie',
      country: 'Poland',
      productName: 'GUAVITAL+',
      salePrice: "94",
      newPrice: "416"
    },
    wintex: {
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Żylaki',
      country: 'Poland',
      productName: 'Wintex Ultra',
      salePrice: "93",
      newPrice: "323"
    },
    exofeet_oil: {
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Grzybica',
      country: 'Poland',
      productName: 'Exofeet Oil',
      salePrice: "93",
      newPrice: "333"
    },
    paraxan: {
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Pasożyty',
      country: 'Poland',
      productName: 'Paraxan',
      salePrice: "90",
      newPrice: "269"
    },
    deluron: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Zapalenie gruczołu krokowego',
      country: 'Poland',
      productName: 'Deluron Forte',
      salePrice: "95",
      newPrice: "377"
    },
    visoptic_duo_night: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082462',
      niche: 'wzrok',
      country: 'Poland',
      productName: 'Visoptic DUO Night',
      salePrice: "93",
      newPrice: "381"
    },
    visoptic_duo_day: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Wzrok',
      country: 'Poland',
      productName: 'Visoptic DUO Day',
      salePrice: "91",
      newPrice: "341"
    },
    beauty_age_skin: {
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Odmłodzenie',
      country: 'Poland',
      productName: 'Beauty Age Skin',
      salePrice: "94",
      newPrice: "579"
    },
    beauty_age_skin_peeling: {
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Odmłodzenie',
      country: 'Poland',
      productName: 'Beauty Age Skin Peeling',
      salePrice: "95",
      newPrice: "523"
    },
    ottomax: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Słuch',
      country: 'Poland',
      productName: 'Ottomax+',
      salePrice: "90",
      newPrice: "476"
    },
    vermixin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Pasożyty',
      country: 'Poland',
      productName: 'Vermixin',
      salePrice: "95",
      newPrice: "352"
    },
    wirex: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Potencja',
      country: 'Poland',
      productName: 'Wirex men’s formula',
      salePrice: "94",
      newPrice: "466"
    },
    depanten: {
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Stawy',
      country: 'Poland',
      productName: 'Depanten',
      salePrice: "91",
      newPrice: "296"
    },
    feronex: {
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Potencja',
      country: 'Poland',
      productName: 'Feronex',
      salePrice: "95",
      newPrice: "554"
    },
    steplex: {
      modifier: 'img-space--left',
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Stawy',
      country: 'Poland',
      productName: 'Steplex',
      salePrice: "91",
      newPrice: "255"
    },
    neoveris: {
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Żylaki',
      country: 'Poland',
      productName: 'Neoveris',
      salePrice: "92",
      newPrice: "270"
    },
    keramin: {
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Grzybica',
      country: 'Poland',
      productName: 'Keramin',
      salePrice: "95",
      newPrice: "354"
    },
    delislim: {
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Odchudzanie',
      country: 'Poland',
      productName: 'Delislim',
      salePrice: "94",
      newPrice: "320"
    },
    ophtalax: {
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Wzrok',
      country: 'Poland',
      productName: 'Ophtalax',
      salePrice: "94",
      newPrice: "450"
    },
    rectin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082462',
      niche: 'Hemoroidy',
      country: 'Poland',
      productName: 'Rectin',
      salePrice: "91",
      newPrice: "287"
    }
  },
  sl: {
    guavital: {
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Izguba teže',
      country: 'Slovenia',
      productName: 'GUAVITAL+',
      salePrice: "26",
      newPrice: "112"
    },
    wintex: {
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Krčne žile',
      country: 'Slovenia',
      productName: 'Wintex Ultra',
      salePrice: "24",
      newPrice: "82"
    },
    exofeet_oil: {
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Glivice',
      country: 'Slovenia',
      productName: 'Exofeet Oil',
      salePrice: "25",
      newPrice: "89"
    },
    paraxan: {
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Paraziti',
      country: 'Slovenia',
      productName: 'Paraxan',
      salePrice: "26",
      newPrice: "79"
    },
    deluron: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Prostatitis',
      country: 'Slovenia',
      productName: 'Deluron Forte',
      salePrice: "26",
      newPrice: "102"
    },
    visoptic_duo_night: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Vizija',
      country: 'Slovenia',
      productName: 'Visoptic DUO Night',
      salePrice: "26",
      newPrice: "109"
    },
    visoptic_duo_day: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Vizija',
      country: 'Slovenia',
      productName: 'Visoptic DUO Day',
      salePrice: "26",
      newPrice: "97"
    },
    beauty_age_skin: {
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Pomlajevanje',
      country: 'Slovenia',
      productName: 'Beauty Age Skin',
      salePrice: "26",
      newPrice: "165"
    },
    beauty_age_skin_peeling: {
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Pomlajevanje',
      country: 'Slovenia',
      productName: 'Beauty Age Skin Peeling',
      salePrice: "24",
      newPrice: "135"
    },
    ottomax: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Zaslišanje',
      country: 'Slovenia',
      productName: 'Ottomax+',
      salePrice: "26",
      newPrice: "136"
    },
    vermixin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Paraziti',
      country: 'Slovenia',
      productName: 'Vermixin',
      salePrice: "24",
      newPrice: "88"
    },
    wirex: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Moč',
      country: 'Slovenia',
      productName: 'Wirex men’s formula',
      salePrice: "25",
      newPrice: "125"
    },
    depanten: {
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Spoji',
      country: 'Slovenia',
      productName: 'Depanten',
      salePrice: "24",
      newPrice: "77"
    },
    feronex: {
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Moč',
      country: 'Slovenia',
      productName: 'Feronex',
      salePrice: "24",
      newPrice: "139"
    },
    steplex: {
      modifier: 'img-space--left',
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Spoji',
      country: 'Slovenia',
      productName: 'Steplex',
      salePrice: "26",
      newPrice: "75"
    },
    neoveris: {
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Krčne žile',
      country: 'Slovenia',
      productName: 'Neoveris',
      salePrice: "25",
      newPrice: "73"
    },
    keramin: {
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Glivice',
      country: 'Slovenia',
      productName: 'Keramin',
      salePrice: "26",
      newPrice: "82"
    },
    delislim: {
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Izguba teže',
      country: 'Slovenia',
      productName: 'Delislim',
      salePrice: "26",
      newPrice: "82"
    },
    ophtalax: {
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Vizija',
      country: 'Slovenia',
      productName: 'Ophtalax',
      salePrice: "26",
      newPrice: "119"
    },
    rectin: {
      modifier: 'img-space--right',
      company: 'everad',
      campaign_id: '1082464',
      niche: 'Hemoroidy',
      country: 'Slovenia',
      productName: 'Rectin',
      salePrice: "26",
      newPrice: "80"
    }
  }
};

/***/ }),

/***/ "./src/js/global/constants.js":
/*!************************************!*\
  !*** ./src/js/global/constants.js ***!
  \************************************/
/*! exports provided: DOC, WIN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOC", function() { return DOC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WIN", function() { return WIN; });
var DOC = $(document);
var WIN = $(window);

/***/ }),

/***/ "./src/js/global/helpers.js":
/*!**********************************!*\
  !*** ./src/js/global/helpers.js ***!
  \**********************************/
/*! exports provided: debounce */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return debounce; });
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/***/ }),

/***/ "./src/js/global/layout.js":
/*!*********************************!*\
  !*** ./src/js/global/layout.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/js/global/helpers.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/js/global/constants.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var layout = function () {
  "use strict"; //#region Private methods

  var L = {
    WIN_WIDTH: 0
  };
  var SETTINGS = {
    afterResize: false,
    onInit: false
  };

  function getLayout() {
    var WIN_WIDTH = _constants__WEBPACK_IMPORTED_MODULE_1__["WIN"].width();
    return {
      WIN_WIDTH: WIN_WIDTH
    };
  }

  ;

  function resizeHandler() {
    _constants__WEBPACK_IMPORTED_MODULE_1__["WIN"].resize(Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["debounce"])(function () {
      L = getLayout();

      if (SETTINGS.afterResize) {
        SETTINGS.afterResize(L);
      }
    }, 100));
  }

  ; //#endregion

  return {
    //#region Public methods
    layoutHandler: function layoutHandler(settings) {
      if (settings) {
        SETTINGS = _objectSpread(_objectSpread({}, SETTINGS), settings);
      }

      L = getLayout();

      if (SETTINGS.onInit) {
        SETTINGS.onInit(L);
      }

      resizeHandler();
    } //#endregion

  };
}();

/* harmony default export */ __webpack_exports__["default"] = (layout);

/***/ }),

/***/ "./src/js/global/noScroll.js":
/*!***********************************!*\
  !*** ./src/js/global/noScroll.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function (root) {
  "use strict";

  var isOn = false;
  var scrollbarSize;
  var scrollTop;

  function getScrollbarSize() {
    if (typeof scrollbarSize !== "undefined") return scrollbarSize;
    var doc = document.documentElement;
    var dummyScroller = document.createElement("div");
    dummyScroller.setAttribute("style", "width:99px;height:99px;" + "position:absolute;top:-9999px;overflow:scroll;");
    doc.appendChild(dummyScroller);
    scrollbarSize = dummyScroller.offsetWidth - dummyScroller.clientWidth;
    doc.removeChild(dummyScroller);
    return scrollbarSize;
  }

  function hasScrollbar() {
    return document.documentElement.scrollHeight > window.innerHeight;
  }

  function on(options) {
    if (typeof document === "undefined" || isOn) return;
    var doc = document.documentElement;
    scrollTop = window.pageYOffset;

    if (hasScrollbar()) {
      doc.style.width = "calc(100% - " + getScrollbarSize() + "px)";
    } else {
      doc.style.width = "100%";
    }

    doc.style.position = "fixed";
    doc.style.top = -scrollTop + "px";
    doc.style.overflow = "hidden";
    isOn = true;
  }

  function off() {
    if (typeof document === "undefined" || !isOn) return;
    var doc = document.documentElement;
    doc.style.width = "";
    doc.style.position = "";
    doc.style.top = "";
    doc.style.overflow = "";
    window.scroll(0, scrollTop);
    isOn = false;
  }

  function toggle() {
    if (isOn) {
      off();
      return;
    }

    on();
  }

  var noScroll = {
    on: on,
    off: off,
    toggle: toggle
  };

  if ( true && typeof module.exports !== "undefined") {
    module.exports = noScroll;
  } else {
    root.noScroll = noScroll;
  }
})(window);

/***/ }),

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var object_fit_images__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! object-fit-images */ "./node_modules/object-fit-images/dist/ofi.common-js.js");
/* harmony import */ var object_fit_images__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(object_fit_images__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _modules_Sliders__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/Sliders */ "./src/js/modules/Sliders.js");
/* harmony import */ var _modules_Controls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/Controls */ "./src/js/modules/Controls.js");
/* harmony import */ var _modules_Popup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/Popup */ "./src/js/modules/Popup.js");
/* harmony import */ var _modules_Menu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/Menu */ "./src/js/modules/Menu.js");
/* harmony import */ var _modules_Order__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/Order */ "./src/js/modules/Order.js");
/* harmony import */ var _global_layout__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./global/layout */ "./src/js/global/layout.js");
/* harmony import */ var _modules_Contacts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/Contacts */ "./src/js/modules/Contacts.js");
// Main JS module
// objectFitImages polyfill








$(function () {
  var year = new Date().getFullYear();
  var placeY = document.getElementsByClassName("year");

  for (var i = 0; i < placeY.length; i++) {
    var elemY = placeY[i];
    elemY.innerHTML = year;
  }

  _modules_Sliders__WEBPACK_IMPORTED_MODULE_1__["default"].init();
  _modules_Controls__WEBPACK_IMPORTED_MODULE_2__["default"].init();
  _modules_Popup__WEBPACK_IMPORTED_MODULE_3__["default"].init();
  _modules_Menu__WEBPACK_IMPORTED_MODULE_4__["default"].init();
  _modules_Order__WEBPACK_IMPORTED_MODULE_5__["default"].init();
  _modules_Contacts__WEBPACK_IMPORTED_MODULE_7__["default"].init();
  object_fit_images__WEBPACK_IMPORTED_MODULE_0___default()();
  _global_layout__WEBPACK_IMPORTED_MODULE_6__["default"].layoutHandler({
    onInit: function onInit(layout) {
      _modules_Sliders__WEBPACK_IMPORTED_MODULE_1__["default"].initProductSlider();

      if (layout.WIN_WIDTH >= 768) {
        _modules_Sliders__WEBPACK_IMPORTED_MODULE_1__["default"].initProductsSlider();
      } else if (layout.WIN_WIDTH <= 767) {
        _modules_Sliders__WEBPACK_IMPORTED_MODULE_1__["default"].destroyProductsSlider();
      }
    },
    afterResize: function afterResize(layout) {
      _modules_Sliders__WEBPACK_IMPORTED_MODULE_1__["default"].initProductSlider();

      if (layout.WIN_WIDTH >= 768) {
        _modules_Sliders__WEBPACK_IMPORTED_MODULE_1__["default"].initProductsSlider();
      } else if (layout.WIN_WIDTH <= 767) {
        _modules_Sliders__WEBPACK_IMPORTED_MODULE_1__["default"].destroyProductsSlider();
      }
    }
  });
});

/***/ }),

/***/ "./src/js/modules/Contacts.js":
/*!************************************!*\
  !*** ./src/js/modules/Contacts.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Contacts = function () {
  return {
    submitContacts: function submitContacts() {
      $(".js-order-form").on("submit", function (event) {
        event.stopPropagation();
        event.preventDefault();
        var form = this,
            submit = $(".submit", form),
            data = new FormData();
        var name = document.querySelector('[name="name"]');
        var phone = document.querySelector('[name="phone"]');
        var text = document.querySelector('[name="comment"]');
        var email = document.querySelector('[name="email"]');
        data.append("name", $('[name="name"]', form).val());
        data.append("phone", $('[name="phone"]', form).val());
        text ? data.append("text", $('[name="comment"]', form).val()) : false;
        email ? data.append("email", $('[name="email"]', form).val()) : false;
        data.append("company", 'Naturallic');

        function getContactsValidStats() {
          function isNameValid(name) {
            return name.value.trim().length >= 5;
          }

          function isPhoneValid(phone) {
            return phone.value.trim().length >= 8;
          }

          function isCommentValid(text) {
            return text ? text.value.trim().length >= 1 : true;
          }

          function isEmailValid(email) {
            return email ? /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email.value.trim()) : true;
          }

          return {
            name: isNameValid(name),
            phone: isPhoneValid(phone),
            text: isCommentValid(text),
            email: isEmailValid(email)
          };
        }

        function removeInputErrors() {
          name ? name.classList.remove('valid-err') : false;
          phone ? phone.classList.remove('valid-err') : false;
          text ? text.classList.remove('valid-err') : false;
          email ? email.classList.remove('valid-err') : false;
        }

        function sendContactsMessage() {
          $.ajax({
            url: "/ajax.php",
            type: "POST",
            data: data,
            cache: false,
            dataType: "json",
            processData: false,
            contentType: false,
            xhr: function xhr() {
              var myXhr = $.ajaxSettings.xhr();

              if (myXhr.upload) {
                myXhr.upload.addEventListener("progress", function (e) {
                  if (e.lengthComputable) {
                    var percentage = e.loaded / e.total * 100;
                    percentage = percentage.toFixed(0);
                    $(".submit", form).html(percentage + "%");
                  }
                }, false);
              }

              return myXhr;
            },
            error: function error(jqXHR, textStatus) {
              $("input, textarea, button", form).removeAttr("disabled"); // Тут выводим ошибку
            },
            complete: function complete() {
              // Тут можем что-то делать ПОСЛЕ успешной отправки формы
              $(".js-content-form").hide();
              $(".popup__title--main").hide();
              $(".js-success-form").show();
            }
          });
        }

        var fieldsStats = getContactsValidStats();
        var isFormValid = Object.values(fieldsStats).every(function (field) {
          return field === true;
        });

        if (isFormValid) {
          $(".submit", form).val("Отправка...");
          $("input, textarea, button", form).attr("disabled", "");
          removeInputErrors();
          sendContactsMessage();
        } else {
          removeInputErrors();
          name && !fieldsStats.name ? name.classList.add('valid-err') : false;
          phone && !fieldsStats.phone ? phone.classList.add('valid-err') : false;
          text && !fieldsStats.text ? text.classList.add('valid-err') : false;
          email && !fieldsStats.email ? email.classList.add('valid-err') : false;
        }

        return false;
      });
    },
    init: function init() {
      Contacts.submitContacts();
    }
  };
}();

/* harmony default export */ __webpack_exports__["default"] = (Contacts); // const Contacts = (function () {
//   "use strict";
//   const form = $(".js-order-form");
//   return {
//     submitForm: function () {
//       form.submit(function (e) {
//         e.preventDefault();
//         $.ajax({
//           url: "../submit.php",
//           type: "POST",
//           contentType: false,
//           processData: false,
//           data: new FormData(this),
//           success: function success(data) {
//             $(".js-content-form").hide();
//             $(".popup__title--main").hide();
//             $(".js-success-form").show();
//             console.log("success");
//           },
//           error: function () {
//             console.log("error");
//           },
//         });
//       });
//     },
//     init: function () {
//       Contacts.submitForm();
//     },
//   };
// })();
// export default Contacts;

/***/ }),

/***/ "./src/js/modules/Controls.js":
/*!************************************!*\
  !*** ./src/js/modules/Controls.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _global_noScroll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../global/noScroll */ "./src/js/global/noScroll.js");
/* harmony import */ var _global_noScroll__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_global_noScroll__WEBPACK_IMPORTED_MODULE_0__);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



var Controls = function () {
  "use strict";

  var btnAccordeon = $(".js-btn-accordeon");
  var contentAccordeon = $(".js-info-accordeon");
  var tabs = $(".js-tab");
  var spanProductsAll = $(".js-product-all");
  var spanProductsShow = $(".js-product-show");
  var productsList = $(".js-list-prod");
  var countCatalog = $(".js-catalog-count");
  var product = $(".js-product");
  var btnCatalog = $(".js-btn-catalog");
  var reviews = $(".js-review");
  var spanReviewsAll = $(".js-reviews-all");
  var spanReviewsShow = $(".js-reviews-show");
  var btnReviews = $(".js-btn-reviews");

  function hideBtn(countProductsShow, countProductsAll) {
    if (countProductsShow == countProductsAll) {
      btnCatalog.hide();
    } else {
      btnCatalog.show();
    }
  }

  function getParameterByName(name) {
    var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function showListProduct(idActiveBlock) {
    var activeList = $(".js-list-prod[data-target=\"".concat(idActiveBlock, "\"]"));
    productsList.removeClass("active");
    activeList.addClass("active");
  }

  return {
    openFaqContent: function openFaqContent() {
      btnAccordeon.on("click", function (e) {
        e.preventDefault();

        var _this = $(this);

        var parent = _this.parents(".js-accordeon");

        if (!_this.hasClass("active")) {
          parent.find(contentAccordeon).slideUp(700);
          parent.find(btnAccordeon).removeClass("active");
        }

        _this.toggleClass("active");

        _this.next(contentAccordeon).slideToggle();
      });
    },
    highlightingActiveTab: function highlightingActiveTab() {
      var paramdId = getParameterByName("id");

      if (paramdId) {
        var target = $("#".concat(paramdId));
        tabs.removeClass("active");
        target.addClass("active");
        showListProduct(paramdId);
      }
    },
    showListProducts: function showListProducts() {
      tabs.click(function (e) {
        e.preventDefault();

        var _this = $(this);

        var idActiveBlock = _this.prop("id");

        tabs.removeClass("active");

        _this.addClass("active");

        showListProduct(idActiveBlock);
        Controls.calculateProducts();
      });
    },
    showCatalog: function showCatalog() {
      btnCatalog.click(function (e) {
        e.preventDefault();

        var _this = $(this);

        var parent = _this.parent(productsList);

        var hiddenProducts = $('.js-product.hidden');
        hiddenProducts.removeClass('hidden').addClass('active'); // const hideCatalog = parent.find(".js-catalog-hide");
        // hideCatalog.addClass("show");

        Controls.calculateProducts();

        _this.hide();
      });
    },
    calculateProducts: function calculateProducts() {
      //родитель блока
      var parent = countCatalog.parent(".js-list-prod.active"); //количество всех товаров

      var countProductsAll = parent.find(product).length; //количество показаных товаров

      var countProductsShow = parent.find('.js-product.active').length; // .find(".js-catalog-show")
      // .find(product).length;

      hideBtn(countProductsShow, countProductsAll);
      var hideCatalog = parent.find(".js-catalog-hide");

      if (hideCatalog.hasClass("show")) {
        parent.find(spanProductsShow).html(countProductsAll);
        parent.find(btnCatalog).hide();
      } else {
        parent.find(spanProductsShow).html(countProductsShow);
        parent.find(spanProductsAll).html(countProductsAll);
      }
    },
    calculateReviews: function calculateReviews() {
      //Показано отзывов
      // const countReviewsShow = $(".js-reviews-show-list").find(reviews).length;
      if ($(".js-reviews-show-list").hasClass("show")) {
        spanReviewsShow.html(reviews.length);
        btnCatalog.hide();
      } else {
        // spanReviewsShow.html(countReviewsShow);
        spanReviewsAll.html(reviews.length);
      }
    },
    showReviews: function showReviews() {
      btnReviews.click(function (e) {
        e.preventDefault();

        var _this = $(this);

        $(".js-reviews-show-list").addClass("show");
        Controls.calculateReviews();

        _this.hide();
      });
    },
    setLanguage: function setLanguage() {
      var DEFAULT_LANG = 'cz';
      var langModal = document.querySelector(".language");
      var languageSelect = document.querySelector(".select");

      var languagesArr = _toConsumableArray(languageSelect.querySelectorAll(".select__option")).map(function (option) {
        return option.dataset.lang;
      });

      var defaultSelectOption = document.querySelector('.select__option--default');
      var currentLang = window.location.pathname.substring(1, 3);
      var isLangInURL = languagesArr.includes(currentLang);
      var savedLanguage = localStorage.getItem("localization");
      var isSavedDefault = localStorage.getItem("localization") === DEFAULT_LANG;

      if (savedLanguage && !isSavedDefault && !isLangInURL) {
        location.href = "".concat(window.location.origin, "/").concat(savedLanguage).concat(window.location.pathname).concat(window.location.search);
      } // if (savedLanguage && isSavedDefault) {
      //     location.href = `${window.location.origin}${window.location.pathname}${window.location.search}`;
      // }


      defaultSelectOption.addEventListener('click', function (event) {
        event.preventDefault();
        langModal.classList.add("language--hidden");
        localStorage.setItem("localization", DEFAULT_LANG);
        _global_noScroll__WEBPACK_IMPORTED_MODULE_0___default.a.off();
      });
      langModal.addEventListener("click", function (event) {
        if (savedLanguage) {
          event.target.classList.contains("language") ? langModal.classList.add("language--hidden") : false;
        }
      });
      window.addEventListener("load", function () {
        if (!isLangInURL && !isSavedDefault) {
          langModal.classList.remove("language--hidden");
        }

        if (isLangInURL) {
          localStorage.setItem("localization", currentLang);
        }

        if (!langModal.classList.contains('language--hidden')) {
          _global_noScroll__WEBPACK_IMPORTED_MODULE_0___default.a.on();
        }
      });
    },
    showHeaderLang: function showHeaderLang() {
      var DEFAULT_LANG = 'cz';
      var langSelect = document.querySelectorAll(".lang-select");
      var currentLangBlock = document.querySelectorAll(".lang-select__current");
      var langOptions = document.querySelectorAll(".lang-select__option");
      var langOptionDefault = document.querySelector('.lang-select__option--default');
      var languageSelect = document.querySelector(".select");
      var currentLang = window.location.pathname.substring(1, 3);

      var languagesArr = _toConsumableArray(languageSelect.querySelectorAll(".select__option")).map(function (option) {
        return option.dataset.lang;
      });

      var savedLanguage = localStorage.getItem("localization");
      var isSavedDefault = localStorage.getItem("localization") === DEFAULT_LANG;
      langOptionDefault.addEventListener('click', function (event) {
        localStorage.setItem("localization", DEFAULT_LANG);
        langOptionDefault.classList.add('lang-select__option--active');
      });
      langOptions.forEach(function (option) {
        option.addEventListener('click', function () {
          localStorage.setItem("localization", option.dataset.lang);
        });
        option.dataset.lang === currentLang ? option.classList.add("lang-select__option--active") : false;
        option.dataset.lang === DEFAULT_LANG && isSavedDefault ? option.classList.add("lang-select__option--active") : false;
        option.dataset.lang === DEFAULT_LANG && !savedLanguage ? option.classList.add("lang-select__option--active") : false;
      });

      var createCurrentFlagElement = function createCurrentFlagElement(innerElement) {
        var flagImage = document.createElement("img");
        flagImage.className = "lang-select__flag lang-select__flag--current";
        flagImage.setAttribute("src", "../img/language-".concat(savedLanguage || DEFAULT_LANG, ".png"));
        flagImage.setAttribute("alt", savedLanguage || DEFAULT_LANG);
        flagImage.setAttribute('width', '20');
        flagImage.setAttribute('height', '14');
        innerElement.append(flagImage); // if (languagesArr.includes(currentLang) || isSavedDefault) {
        //
        // } else {
        //     const langText = document.createElement("span");
        //     langText.className = "lang-select__alt";
        //     langText.textContent = "Lang";
        //     innerElement.append(langText);
        // }
      };

      currentLangBlock.forEach(function (block) {
        return createCurrentFlagElement(block);
      });
      document.addEventListener("click", function (event) {
        var target = event.target;

        if (target.closest(".lang-select")) {
          langSelect.forEach(function (select) {
            return select.classList.toggle("lang-select--active");
          });
        } else {
          langSelect.forEach(function (select) {
            return select.classList.remove("lang-select--active");
          });
        }
      });

      var setCorrectURL = function setCorrectURL() {
        var search = window.location.search;
        var pathArr = window.location.pathname.split('/');
        var currentPage = pathArr[pathArr.length - 1];
        var isOrderPage = currentPage === 'order.html';
        var isSuccessPage = currentPage === 'success.html';
        search ? localStorage.setItem('searchParams', search) : false;
        !isOrderPage && !isSuccessPage ? localStorage.removeItem('searchParams') : false;
        var savedSearchParams = localStorage.getItem('searchParams');

        if (savedSearchParams && !search) {
          window.location.href = window.location.href + savedSearchParams;
        }
      };

      setCorrectURL();
    },
    setProductCardHeight: function setProductCardHeight() {
      var categoryTabs = document.querySelectorAll(".js-tab");
      var catalogMoreBtn = document.querySelectorAll(".js-btn-catalog");
      var productCards = document.querySelectorAll(".product");

      var setProductHeight = function setProductHeight(currentProds) {
        var productCards = document.querySelectorAll(".product");
        var productDetails = document.querySelectorAll(".product__btn");

        if (productCards.length && productDetails.length) {
          var productDetailsBtnHeight = _toConsumableArray(productDetails).filter(function (btn) {
            return btn.clientHeight > 0;
          })[0].clientHeight + 15;

          var cardsHeightArray = _toConsumableArray(productCards).map(function (card) {
            return card.clientHeight;
          });

          var maxCardHeight = Math.max.apply(Math, _toConsumableArray(cardsHeightArray));
          productCards.forEach(function (card, index) {
            // console.log(productDetailsBtnHeight, 'btn');
            // console.log(maxCardHeight, 'max');
            var newCardHeight = "".concat(maxCardHeight - productDetailsBtnHeight, "px");
            card.style.height = newCardHeight;
            card.addEventListener("mouseover", function (_ref) {
              var target = _ref.target;
              handleCardMouseOver(target, cardsHeightArray, index);
            }, false);
            card.addEventListener("mouseout", function (_ref2) {
              var target = _ref2.target;
              handleCardMouseOut(target, newCardHeight);
            }, false);
          });
        }
      };

      var setNameAndDescHeight = function setNameAndDescHeight() {
        var winWidth = window.innerWidth;
        var prodNames = document.querySelectorAll('.product__name');
        var prodTexts = document.querySelectorAll('.product__desc');

        if (winWidth > 639) {
          prodNames.forEach(function (name) {
            return name.style.minHeight = 'auto';
          });
          prodTexts.forEach(function (text) {
            return text.style.minHeight = "auto";
          });

          var prodNamesHeight = _toConsumableArray(prodNames).map(function (name) {
            return name.clientHeight;
          });

          var prodTextsHeight = _toConsumableArray(prodTexts).map(function (text) {
            return text.clientHeight;
          });

          var maxNameHeight = Math.max.apply(Math, _toConsumableArray(prodNamesHeight));
          var maxTextHeight = Math.max.apply(Math, _toConsumableArray(prodTextsHeight)); // console.log(maxNameHeight);

          prodNames.forEach(function (name) {
            return name.style.minHeight = maxNameHeight + 'px';
          });
          prodTexts.forEach(function (text) {
            return text.style.minHeight = maxTextHeight + 'px';
          });
        } else {
          prodTexts.forEach(function (text) {
            return text.style.minHeight = "auto";
          });
          prodNames.forEach(function (name) {
            return name.style.minHeight = 'auto';
          });
        }
      };

      var updateProductCards = function updateProductCards() {
        return productCards = document.querySelectorAll(".product");
      };

      var handleCardMouseOver = function handleCardMouseOver(target, cardsHeightArray, index) {
        // console.log(cardsHeightArray);
        // const initialCardHeight = Math.max(...cardsHeightArray);
        var initialCardHeight = cardsHeightArray[index] ? cardsHeightArray[index] : Math.max.apply(Math, _toConsumableArray(cardsHeightArray));
        var card = target.closest(".product");
        card.style.height = "".concat(initialCardHeight, "px");
        card.classList.add("product--hovered");
      };

      var handleCardMouseOut = function handleCardMouseOut(target, newCardHeight) {
        var card = target.closest(".product");
        card.style.height = newCardHeight;
        card.classList.remove("product--hovered");
      };

      var resetCardsHeight = function resetCardsHeight() {
        var prodTexts = document.querySelectorAll('.product__desc');
        productCards.forEach(function (card) {
          return card.style.height = "auto";
        });
        prodTexts.forEach(function (text) {
          return text.style.minHeight = "auto";
        });
      };

      var isCalculate = false;
      document.addEventListener("DOMContentLoaded", function () {
        resetCardsHeight();
        var winWidth = window.innerWidth;
        setNameAndDescHeight();

        if (winWidth > 479) {
          setProductHeight();
        }

        isCalculate = !isCalculate;
      });
      window.addEventListener("resize", function () {
        resetCardsHeight();
        var winWidth = window.innerWidth;
        setNameAndDescHeight();

        if (winWidth > 479) {
          setProductHeight();
        }
      });
      catalogMoreBtn.forEach(function (btn) {
        btn.addEventListener("click", function () {
          resetCardsHeight();
          updateProductCards();
          setNameAndDescHeight();
          setProductHeight();
        });
      });
      categoryTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          resetCardsHeight();
          updateProductCards();
          setNameAndDescHeight();
          setProductHeight();
        });
      });

      if (!isCalculate) {
        var winWidth = window.innerWidth;
        resetCardsHeight();
        setNameAndDescHeight();

        if (winWidth > 479) {
          setProductHeight();
        }
      }
    },
    setLoader: function setLoader() {
      var loader = document.querySelector(".loader");
      window.addEventListener("load", function () {
        setTimeout(function () {
          loader.classList.add("loader--hidden");
        }, 500);
      });
      setTimeout(function () {
        loader.classList.add("loader--hidden");
      }, 2500);
    },
    webpChecker: function webpChecker() {
      var WebP = new Image();
      WebP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";

      WebP.onload = WebP.onerror = function () {
        var isWebp = WebP.height === 2;

        if (!isWebp) {
          document.querySelector("body").classList.remove("webp");
        } else {
          document.querySelector("body").classList.add("webp");
        }
      };
    },
    init: function init() {
      Controls.openFaqContent();
      Controls.highlightingActiveTab();
      Controls.showListProducts();
      Controls.showCatalog();
      Controls.calculateProducts();
      Controls.calculateReviews();
      Controls.showReviews();
      Controls.setProductCardHeight();
      Controls.setLanguage();
      Controls.showHeaderLang();
      Controls.webpChecker();
      Controls.setLoader();
    }
  };
}();

/* harmony default export */ __webpack_exports__["default"] = (Controls);

/***/ }),

/***/ "./src/js/modules/Menu.js":
/*!********************************!*\
  !*** ./src/js/modules/Menu.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _global_noScroll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../global/noScroll */ "./src/js/global/noScroll.js");
/* harmony import */ var _global_noScroll__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_global_noScroll__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _global_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../global/constants */ "./src/js/global/constants.js");



var Menu = function () {
  "use strict";

  var burgerMenu = $(".js-burger");
  var linkToTarget = $(".js-scroll");
  var overlay = $(".js-overlay");
  var fixedMenu = $(".js-fixed-menu");
  var menuHeight = fixedMenu.height();
  var scrollHeight = menuHeight;

  function scroll(target) {
    var top = target.offset().top;
    $("html, body").animate({
      scrollTop: top - 15
    }, 800);
  }

  return {
    showFixedMenu: function showFixedMenu() {
      _global_constants__WEBPACK_IMPORTED_MODULE_1__["DOC"].scroll(function () {
        var scrollTop = _global_constants__WEBPACK_IMPORTED_MODULE_1__["DOC"].scrollTop();
        var percent = 0;
        var shadow = "none";
        var bg = "none";

        if (scrollTop < scrollHeight) {
          percent = (scrollTop / scrollHeight).toFixed(2);
          fixedMenu.removeClass("menu--fixed");
        } else {
          percent = 1;
          shadow = "0px 0px 20px rgba(52, 49, 89, 0.1)";
          bg = "white";
          fixedMenu.addClass("menu--fixed");
        }

        fixedMenu.css({
          boxShadow: shadow,
          background: bg
        });
      });
    },
    showMobileMenu: function showMobileMenu() {
      burgerMenu.click(function (e) {
        e.preventDefault();
        var target = $($(this).data("target"));
        target.toggleClass("menu-mobile--active");
        burgerMenu.toggleClass("burger--active");
        overlay.toggleClass("active");
        _global_noScroll__WEBPACK_IMPORTED_MODULE_0___default.a.toggle();
      });
    },
    scrollToTarget: function scrollToTarget() {
      linkToTarget.click(function (e) {
        e.preventDefault();
        _global_noScroll__WEBPACK_IMPORTED_MODULE_0___default.a.off();

        var _this = $(this);

        var href = _this.attr("href");

        var target = $(href);

        if (_this.data("target")) {
          var _target = $(_this.data("target"));

          scroll(_target);
        }

        if (target.length) {
          scroll(target);
        }

        $(".menu-mobile").removeClass("menu-mobile--active");
        burgerMenu.removeClass("burger--active");
        overlay.removeClass("active");
      });
    },
    init: function init() {
      Menu.showMobileMenu(); // Menu.scrollToTarget();

      Menu.showFixedMenu();
    }
  };
}();

/* harmony default export */ __webpack_exports__["default"] = (Menu);

/***/ }),

/***/ "./src/js/modules/Order.js":
/*!*********************************!*\
  !*** ./src/js/modules/Order.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _data_productInfo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data/productInfo */ "./src/js/data/productInfo.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var Order = function () {
  "use strict";

  var buttonPromocode = $(".js-button-promocode");
  var inputPromocode = $(".js-input-promocode");
  var productResidue = $(".js-product-residue");
  var inputChatbotHistory = $("input[name=\"chatbot_history\"]");

  function updValueChatbotHistory() {
    inputChatbotHistory.val(JSON.stringify(data));
  }

  function prettify(num) {
    var n = num.toString();
    return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + " ");
  }

  var data = [];
  var count = 1;

  function getParameterByName(name) {
    var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  return {
    submitForm: function submitForm() {
      $("#order-form").submit(function (e) {
        // e.preventDefault();
        $("input[name='count']").val(count);
        var dataForm = $(this).find("input.js-data").serializeArray();

        var _dataForm$map = dataForm.map(function (item) {
          return {
            answer: item.value,
            question: item.name
          };
        }),
            _dataForm$map2 = _toArray(_dataForm$map),
            object = _dataForm$map2.slice(0);

        data.push.apply(data, _toConsumableArray(object));
        updValueChatbotHistory();
      });
    },
    createOrderForm: function createOrderForm() {
      var productName = getParameterByName("id");
      var productNameUnderscore = String(productName).split('-').join('_');
      var prodNameWithSpaces = String(productName).split('-').join(' ');
      var currentLangLower = localStorage.getItem('localization') ? localStorage.getItem('localization').toLowerCase() : false; // console.log(productNameUnderscore);

      if (productName) {
        var countryCode = $("input[name='country_code']");
        countryCode.val(currentLangLower.toUpperCase()); // console.log(countryCode);

        var orderForm = document.querySelector('#order-form');
        var productData = _data_productInfo__WEBPACK_IMPORTED_MODULE_0__["productsInfo"][currentLangLower][productNameUnderscore];
        var imgModifier = productData === null || productData === void 0 ? void 0 : productData.modifier; // const formData = formSetting[productData.company]

        if (orderForm) {// const body = document.querySelector('body')
          // const script = document.createElement('script')
          // const scriptFirst = document.createElement('script')
          //
          // const startScript = `
          //     window.lang = '${currentLangLower}';
          //     window.country_code = '${currentLangLower.toUpperCase()}';
          //     window.is_downloaded_from_dashboard = true;
          //     window._locations = [{"offer_id":"1016","country_code":"CZ","price_current":0.01,"display_priority":2,"id":3077311,"name":"Czech Republic","type":"country","country_id":3077311,"region_name":null,"currency":"czk","country_name":"Czech Republic","price_previous":1,"price_delivery":0,"price_total":0.01},{"offer_id":"1016","country_code":"RO","price_current":0.01,"display_priority":4,"id":798549,"name":"Romania","type":"country","country_id":798549,"region_name":null,"currency":"ron","country_name":"Romania","price_previous":1,"price_delivery":0,"price_total":0.01},{"offer_id":"1016","country_code":"HU","price_current":0.01,"display_priority":3,"id":719819,"name":"Hungary","type":"country","country_id":719819,"region_name":null,"currency":"Ft","country_name":"Hungary","price_previous":20600,"price_delivery":0,"price_total":0.01},{"offer_id":"1016","country_code":"IT","price_current":0.01,"display_priority":1,"id":3175395,"name":"Italy","type":"country","country_id":3175395,"region_name":null,"currency":"€","country_name":"Italy","price_previous":78,"price_delivery":0,"price_total":0.01},{"offer_id":"1016","country_code":"CL","price_current":0.01,"display_priority":0,"id":3895114,"name":"Chile","type":"country","country_id":3895114,"region_name":null,"currency":"clp","country_name":"Chile","price_previous":1,"price_delivery":0,"price_total":0.01}];
          //     window.additional_phone_in_downloaded = false;
          //     window.is_namephone_validated = true;
          //     window.back_button_enabled = true;
          // `
          // orderForm.setAttribute('action', String(formData.formAction))
          // scriptFirst.textContent = startScript
          // script.textContent = formData.formSendScript
          // body.appendChild(scriptFirst)
          // body.appendChild(script)
        } // console.log(productName);


        var productInfo = _data_productInfo__WEBPACK_IMPORTED_MODULE_0__["productsInfo"]["".concat(localStorage.getItem('localization'))]["".concat(productNameUnderscore)];
        var productNewPrice = productInfo.newPrice;
        $(".js-product-name").html(prodNameWithSpaces);
        $(".js-product-photo").attr("src", "../img/".concat(productName, ".png"));
        imgModifier ? $(".order-block__product").addClass(imgModifier) : false;
        $(".js-price-product").html(productNewPrice);
        $("input[name='price']").val(productData.newPrice);
        $("input[name='campaign_id']").val(productData.campaign_id);
        $("input[name='redirect_url']").val("success.html?id=".concat(productName));
        $("input[name='product']").val("".concat(productData.productName));
        $("input[name='niche']").val(productData.niche);
        $("input[name='country']").val(productData.country);
        $("input[name='lang']").val(currentLangLower); // window.addEventListener('load', () => $(`input[name='country_code']`).val(`${currentLangLower.toUpperCase()}`))
      }
    },
    choiceCountProduct: function choiceCountProduct() {
      $(".js-counter-arrow-inc").click(function (e) {
        e.preventDefault();
        count += 1;

        if (count > 20) {
          count = 20;
        }

        $(".js-counter-number").html(count);
        var valueSale = $(".js-sale-product").text();

        if (Number(valueSale.replace(/\s/g, "")) > 0) {
          Order.calcSaleProduct();
        }

        Order.calcOrderProduct(count);
      });
      $(".js-counter-arrow-dec").click(function (e) {
        e.preventDefault();
        count -= 1;

        if (count <= 1) {
          count = 1;
        }

        $(".js-counter-number").html(count);
        var valueSale = $(".js-sale-product").text();

        if (Number(valueSale.replace(/\s/g, "")) > 0) {
          Order.calcSaleProduct();
        }

        Order.calcOrderProduct(count);
      });
    },
    calcSaleProduct: function calcSaleProduct() {
      var productName = getParameterByName("id"); // const productInfo = info[`${productName}`];

      var productInfo = _data_productInfo__WEBPACK_IMPORTED_MODULE_0__["productsInfo"]["".concat(localStorage.getItem('localization'))]["".concat(productName)];
      var productNewPrice = Number(productInfo.newPrice.replace(/\s/g, ""));
      var productSalePrice = Number(productInfo.salePrice.replace(/\s/g, ""));
      var saleProduct = productNewPrice - productSalePrice;
      $(".js-sale-product").html(prettify(saleProduct * count));
    },
    calcOrderProduct: function calcOrderProduct() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var priceProduct = Number($(".js-price-product").text().replace(/\s/g, "") * count);
      var saleProduct = Number($(".js-sale-product").text().replace(/\s/g, ""));
      var priceOrder = 0;

      if (priceProduct >= saleProduct) {
        priceOrder = priceProduct - saleProduct;
      } else {
        priceOrder = saleProduct - priceProduct;
      }

      $(".js-price-order").html(prettify(priceOrder)); //фіксуємо всю суму замовлення

      $("input[name='count']").val(count);
      $("input[name='total-price']").val(priceOrder);
    },
    validatePromocode: function validatePromocode(promocode) {
      buttonPromocode.click(function (e) {
        e.preventDefault();
        var valueInput = inputPromocode.val().trim();

        if (valueInput === promocode) {
          inputPromocode.addClass("check");
          inputPromocode.attr("readonly", true);
          buttonPromocode.attr("disabled", true);
          var productName = getParameterByName("id"); // const productInfo = info[`${productName}`];

          var productInfo = _data_productInfo__WEBPACK_IMPORTED_MODULE_0__["productsInfo"]["".concat(localStorage.getItem('localization'))]["".concat(productName)];
          var productSalePrice = Number(productInfo.salePrice.replace(/\s/g, ""));
          var productNewPrice = Number(productInfo.newPrice.replace(/\s/g, "")); //Фіксуємо, що користувач увів правильний промокод

          $("input[name='discount-price']").val(productNewPrice - productSalePrice);
          var countProduct = $(".price-item .js-counter-number").text();
          var saleProduct = (productNewPrice - productSalePrice) * countProduct;
          $(".js-sale-product").html(prettify(saleProduct));
          Order.calcOrderProduct(countProduct);
        } else {
          inputPromocode.addClass("error");
        }
      });
    },
    checkButtonActive: function checkButtonActive() {
      inputPromocode.on("input", function () {
        var _this = $(this);

        var value = _this.val();

        if (value.length >= 1) {
          buttonPromocode.attr("disabled", false);
        } else {
          buttonPromocode.attr("disabled", true);
        }
      });
    },
    createSuccessPage: function createSuccessPage() {
      var productName = getParameterByName("id");

      if (productName) {
        var productNameUnderscore = String(productName).split('-').join('_');
        var currentLangLower = localStorage.getItem('localization') ? localStorage.getItem('localization').toLowerCase() : false;
        var productData = _data_productInfo__WEBPACK_IMPORTED_MODULE_0__["productsInfo"][currentLangLower][productNameUnderscore];
        var imgModifier = productData === null || productData === void 0 ? void 0 : productData.modifier;
        $(".js-success-product-name").html(productName);
        $(".js-success-product-photo").attr("src", "../img/".concat(productName, ".png"));
        imgModifier ? $(".js-success-product-photo").addClass(imgModifier) : false;
      }
    },
    showResiudePack: function showResiudePack() {
      var max = 60;
      var min = 12;
      setInterval(function () {
        var difference = randomInteger(1, 6);
        max = max - difference;

        if (max <= min) {
          return;
        }

        productResidue.html(max);
      }, 12000);
    },
    init: function init() {
      Order.createOrderForm();
      Order.choiceCountProduct();
      Order.createSuccessPage();
      Order.submitForm();
      Order.calcOrderProduct();
      Order.validatePromocode('0JH343');
      Order.checkButtonActive();
      Order.showResiudePack(); // Order.calcSaleProduct();
    }
  };
}();

/* harmony default export */ __webpack_exports__["default"] = (Order);

/***/ }),

/***/ "./src/js/modules/Popup.js":
/*!*********************************!*\
  !*** ./src/js/modules/Popup.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _global_noScroll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../global/noScroll */ "./src/js/global/noScroll.js");
/* harmony import */ var _global_noScroll__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_global_noScroll__WEBPACK_IMPORTED_MODULE_0__);


var Popup = function () {
  "use strict";

  var popUpBlock = $(".js-popup");
  var linkShowPopUp = $(".js-show-popup");
  var ButtonShowFramePopUp = $(".js-show-frame-popup");
  var framePopUpBlock = $(".js-frame-popup");
  var overlay = $(".js-overlay");
  return {
    addFramePopup: function addFramePopup() {
      if ($('.js-show-frame-popup')) {
        var link = $(".js-show-frame-popup").attr("data-src");
        var frame = document.createElement("iframe");
        frame.setAttribute("src", link);
        frame.classList.add("frame-popup__iframe");
        $('.frame-popup__content').append(frame);
      }
    },
    initFramePopup: function initFramePopup() {
      ButtonShowFramePopUp.click(function (e) {
        framePopUpBlock.toggleClass("active");
        overlay.addClass("active");
        framePopUpBlock.removeClass("menu-mobile--active");
        $(".js-burger").removeClass("burger--active");
        _global_noScroll__WEBPACK_IMPORTED_MODULE_0___default.a.on();
      });
    },
    closeFramePopup: function closeFramePopup() {
      $(".js-frame-close").click(function (e) {
        framePopUpBlock.removeClass("active");
        overlay.removeClass("active");
        _global_noScroll__WEBPACK_IMPORTED_MODULE_0___default.a.off();
      });
    },
    initPopUp: function initPopUp() {
      linkShowPopUp.click(function (e) {
        e.preventDefault();

        var _this = $(this);

        var target = $(_this.data("target"));

        _this.toggleClass("active");

        target.toggleClass("active");
        overlay.addClass("active");
        $(".menu-mobile").removeClass("menu-mobile--active");
        $(".js-burger").removeClass("burger--active");
        _global_noScroll__WEBPACK_IMPORTED_MODULE_0___default.a.on();
      });
    },
    closePopup: function closePopup() {
      var popup = document.querySelector('.js-popup');
      popup.addEventListener('click', function (event) {
        var target = event.target;
        var isOverlay = target.classList.contains('popup');

        if (isOverlay) {
          popUpBlock.removeClass("active");
          linkShowPopUp.removeClass("active");
          overlay.removeClass("active");
          _global_noScroll__WEBPACK_IMPORTED_MODULE_0___default.a.off();
        }
      });
      $(".js-close").click(function (e) {
        e.preventDefault();
        popUpBlock.removeClass("active");
        linkShowPopUp.removeClass("active");
        overlay.removeClass("active");
        _global_noScroll__WEBPACK_IMPORTED_MODULE_0___default.a.off();
      });
    },
    init: function init() {
      Popup.addFramePopup();
      Popup.initPopUp();
      Popup.closePopup();
      Popup.initFramePopup();
      Popup.closeFramePopup();
    }
  };
}();

/* harmony default export */ __webpack_exports__["default"] = (Popup);

/***/ }),

/***/ "./src/js/modules/Sliders.js":
/*!***********************************!*\
  !*** ./src/js/modules/Sliders.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Sliders = function () {
  var headerSlider = $(".js-slider-header");
  var productsSlider = $(".js-slider-products");
  var reviewsSliderWrap = $(".js-slider-reviews-wrap");
  return {
    updatePagination: function updatePagination(c, m) {
      var current = c,
          last = m,
          delta = 2,
          left = current - delta,
          right = current + delta + 1,
          range = [],
          rangeWithDots = [],
          l;

      for (var i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
          range.push(i);
        }
      }

      for (var _i = 0, _range = range; _i < _range.length; _i++) {
        var _i2 = _range[_i];

        if (l) {
          if (_i2 - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (_i2 - l !== 1) {
            rangeWithDots.push("...");
          }
        }

        rangeWithDots.push(_i2);
        l = _i2;
      }

      return rangeWithDots;
    },
    changeSliderDots: function changeSliderDots(paginationArray) {
      var dotsArray = reviewsSlider.find(".slick-dots li a");

      for (var i = 0; i < dotsArray.length; i++) {
        var dot = $(dotsArray[i]);
        var li = dot.parents("li");
        li.removeClass("hide");
        var indexDot = dot.data("slide-index");

        if (paginationArray.indexOf(indexDot) === -1) {
          li.addClass("hide");
        }
      }
    },
    initReviewsSlider: function initReviewsSlider() {
      reviewsSliderWrap.each(function (index) {
        var _this = $(this);

        _this.addClass("swiper-slider-review-" + index);

        var setActualReviewHeight = function setActualReviewHeight(isOneVisibleSlide) {
          var reviewBlocks = document.querySelectorAll('.swiper-slider-review-' + index + ' .js-review');

          if (!isOneVisibleSlide) {
            var maxHeight = Math.max.apply(Math, _toConsumableArray(_toConsumableArray(reviewBlocks).map(function (review) {
              return review.offsetHeight;
            })));
            reviewBlocks.forEach(function (review) {
              return review.style.minHeight = maxHeight + 'px';
            });
          } else {
            reviewBlocks.forEach(function (review) {
              return review.style.minHeight = 'auto';
            });
          }
        };

        var winWidth = window.innerWidth;
        winWidth <= 639 ? setActualReviewHeight(true) : setActualReviewHeight(false);
        window.addEventListener('resize', function () {
          var winWidth = window.innerWidth;
          winWidth <= 639 ? setActualReviewHeight(true) : setActualReviewHeight(false);
        });
        var swiper = new Swiper(".swiper-slider-review-" + index, {
          direction: "horizontal",
          lazy: true,
          preloadImages: false,
          slidesPerView: 1,
          autoHeight: true,
          scrollbar: {
            el: ".js-slider-reviews-scrollbar",
            draggable: true,
            dragSize: 22
          },
          breakpoints: {
            480: {
              slidesPerView: 1
            },
            640: {
              slidesPerView: 2
            },
            768: {
              slidesPerView: 2
            },
            1024: {
              slidesPerView: 3
            }
          }
        });
      });
    },
    initHeaderSlider: function initHeaderSlider() {
      headerSlider.on("init", function (event, slick, direction) {
        headerSlider.addClass("init");
      });
      new Swiper('.js-slider-header', {
        direction: "horizontal",
        lazy: true,
        preloadImages: false,
        slidesPerView: 1,
        autoplay: true,
        effect: "fade",
        scrollbar: {
          el: '.js-slider-header-scrollbar',
          draggable: true,
          dragSize: 22
        }
      });
    },
    initProductSlider: function initProductSlider() {
      $(".js-slider-product-for").not(".slick-initialized").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: ".js-slider-product-nav"
      });
      $(".js-slider-product-nav").not(".slick-initialized").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: ".js-slider-product-for",
        dots: false,
        focusOnSelect: true
      });
    },
    initProductsSlider: function initProductsSlider() {
      var prodSlider = new Swiper('.js-slider-products', {
        direction: "horizontal",
        slidesPerView: 1,
        scrollbar: {
          el: '.js-slider-hits-scrollbar',
          draggable: true,
          dragSize: 22
        },
        breakpoints: {
          480: {
            slidesPerView: 2
          },
          640: {
            slidesPerView: 2
          },
          768: {
            slidesPerView: 2
          },
          1024: {
            slidesPerView: 3
          }
        }
      });
      var isSlider = document.querySelector('.js-slider-products');
      window.addEventListener('resize', function () {
        var winWidth = window.innerWidth;
        isSlider && winWidth <= 767 ? prodSlider.destroy() : false;
      });
    },
    destroyProductsSlider: function destroyProductsSlider() {
      productsSlider.filter(".slick-initialized").slick("unslick");
    },
    setHitsSize: function setHitsSize() {
      var hits = document.querySelector('.hits');
      var products = hits ? _toConsumableArray(hits.querySelectorAll('.product')) : null;

      function setHitsHeight() {
        var productHeights = products ? _toConsumableArray(products).map(function (prod) {
          var paddingTop = parseInt(window.getComputedStyle(prod).paddingTop);
          var paddingBottom = parseInt(window.getComputedStyle(prod).paddingBottom);
          var contentHeight = prod.querySelector('.product__content').clientHeight;
          var buttonHeight = prod.querySelector('.product__btn').clientHeight;
          var buttonMarginTop = parseInt(window.getComputedStyle(prod.querySelector('.product__btn')).marginTop);
          return Number(paddingTop + paddingBottom + contentHeight + buttonHeight + buttonMarginTop);
        }) : null;
        var maxHeight = productHeights ? Math.max.apply(Math, _toConsumableArray(productHeights)) : null; // console.log(productHeights);
        // console.log(maxHeight);

        window.innerWidth > 767 && maxHeight ? hits.style.height = maxHeight + 'px' : hits.style.height = 'auto';
      }

      if (hits) {
        window.addEventListener('resize', setHitsHeight);
        setHitsHeight();
      }
    },
    setActiveSlide: function setActiveSlide() {
      var prodSlider = document.querySelector('.product-item__slider');

      if (prodSlider) {
        var navSlides = document.querySelectorAll('.slider-prod__nav-item');
        navSlides[0].classList.add('active');
        navSlides.forEach(function (slide) {
          slide.addEventListener('click', function (e) {
            navSlides.forEach(function (slide) {
              return slide.classList.remove('active');
            });
            slide.classList.add('active');
          });
        });
      }
    },
    init: function init() {
      Sliders.initHeaderSlider();
      Sliders.initReviewsSlider();
      Sliders.setHitsSize();
      Sliders.setActiveSlide();
    }
  };
}();

/* harmony default export */ __webpack_exports__["default"] = (Sliders);

/***/ }),

/***/ 0:
/*!******************************!*\
  !*** multi ./src/js/main.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/maksimvovk/Documents/Everad/Layout/Naturallic Project/naturallic/src/js/main.js */"./src/js/main.js");


/***/ })

/******/ });
//# sourceMappingURL=main.js.map