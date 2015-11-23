//JSComtrade, extend from highcharts
(function () {
// encapsulated variables
var UNDEFINED,
	doc = document,
	win = window,
	math = Math,
	mathRound = math.round,
	mathFloor = math.floor,
	mathCeil = math.ceil,
	mathMax = math.max,
	mathMin = math.min,
	mathAbs = math.abs,
	mathCos = math.cos,
	mathSin = math.sin,
	mathPI = math.PI,
	deg2rad = mathPI * 2 / 360,


	// some variables
	userAgent = navigator.userAgent,
	isOpera = win.opera,
	isIE = /(msie|trident)/i.test(userAgent) && !isOpera,
	docMode8 = doc.documentMode === 8,
	isWebKit = /AppleWebKit/.test(userAgent),
	isFirefox = /Firefox/.test(userAgent),
	isTouchDevice = /(Mobile|Android|Windows Phone)/.test(userAgent),
	SVG_NS = 'http://www.w3.org/2000/svg',
	hasSVG = !!doc.createElementNS && !!doc.createElementNS(SVG_NS, 'svg').createSVGRect,
	hasBidiBug = isFirefox && parseInt(userAgent.split('Firefox/')[1], 10) < 4, // issue #38
	useCanVG = !hasSVG && !isIE && !!doc.createElement('canvas').getContext,
	Renderer,
	hasTouch,
	symbolSizes = {},
	idCounter = 0,
	garbageBin,
	defaultOptions,
	dateFormat, // function
	globalAnimation,
	pathAnim,
	timeUnits,
	noop = function () { return UNDEFINED; },
	charts = [],
	axischarts=[],
	chartCount = 0,
	PRODUCT = 'JSComtrade',
	VERSION = '0.1.0',
	redCursor,
	greenCursor,
	invaildTime = -9999,

	// some constants for frequently used strings
	DIV = 'div',
	ABSOLUTE = 'absolute',
	RELATIVE = 'relative',
	HIDDEN = 'hidden',
	PREFIX = 'jscomtrade-',
	VISIBLE = 'visible',
	PX = 'px',
	NONE = 'none',
	M = 'M',
	L = 'L',
	numRegex = /^[0-9]+$/,
	NORMAL_STATE = '',
	HOVER_STATE = 'hover',
	SELECT_STATE = 'select',
	marginNames = ['plotTop', 'marginRight', 'marginBottom', 'plotLeft'],

	// constants for attributes
	STROKE_WIDTH = 'stroke-width',

	// time methods, changed based on whether or not UTC is used
	Date,  // Allow using a different Date class
	makeTime,
	timezoneOffset,
	getTimezoneOffset,
	getMinutes,
	getHours,
	getDay,
	getDate,
	getMonth,
	getFullYear,
	setMilliseconds,
	setSeconds,
	setMinutes,
	setHours,
	setDate,
	setMonth,
	setFullYear,


	// lookup over the types and the associated classes
	JSComtrade;

// The JSComtrade namespace
JSComtrade = win.JSComtrade = win.JSComtrade ? error(16, true) : {};

/**
 * Extend an object with the members of another
 * @param {Object} a The object to be extended
 * @param {Object} b The object to add to the first one
 */
var extend = JSComtrade.extend = function (a, b) {
	var n;
	if (!a) {
		a = {};
	}
	for (n in b) {
		a[n] = b[n];
	}
	return a;
};
	
/**
 * Deep merge two or more objects and return a third object. If the first argument is
 * true, the contents of the second object is copied into the first object.
 * Previously this function redirected to jQuery.extend(true), but this had two limitations.
 * First, it deep merged arrays, which lead to workarounds in JSComtrade. Second,
 * it copied properties from extended prototypes. 
 */
function merge() {
	var i,
		args = arguments,
		len,
		ret = {},
		doCopy = function (copy, original) {
			var value, key;

			// An object is replacing a primitive
			if (typeof copy !== 'object') {
				copy = {};
			}

			for (key in original) {
				if (original.hasOwnProperty(key)) {
					value = original[key];

					// Copy the contents of objects, but not arrays or DOM nodes
					if (value && typeof value === 'object' && Object.prototype.toString.call(value) !== '[object Array]' &&
							key !== 'renderTo' && typeof value.nodeType !== 'number') {
						copy[key] = doCopy(copy[key] || {}, value);
				
					// Primitives and arrays are copied over directly
					} else {
						copy[key] = original[key];
					}
				}
			}
			return copy;
		};

	// If first argument is true, copy into the existing object. Used in setOptions.
	if (args[0] === true) {
		ret = args[1];
		args = Array.prototype.slice.call(args, 2);
	}

	// For each argument, extend the return
	len = args.length;
	for (i = 0; i < len; i++) {
		ret = doCopy(ret, args[i]);
	}

	return ret;
}

/**
 * Shortcut for parseInt
 * @param {Object} s
 * @param {Number} mag Magnitude
 */
function pInt(s, mag) {
	return parseInt(s, mag || 10);
}

/**
 * Check for string
 * @param {Object} s
 */
function isString(s) {
	return typeof s === 'string';
}

/**
 * Check for object
 * @param {Object} obj
 */
function isObject(obj) {
	return obj && typeof obj === 'object';
}

/**
 * Check for array
 * @param {Object} obj
 */
function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}

/**
 * Check for number
 * @param {Object} n
 */
function isNumber(n) {
	return typeof n === 'number';
}

function log2lin(num) {
	return math.log(num) / math.LN10;
}
function lin2log(num) {
	return math.pow(10, num);
}

/**
 * Remove last occurence of an item from an array
 * @param {Array} arr
 * @param {Mixed} item
 */
function erase(arr, item) {
	var i = arr.length;
	while (i--) {
		if (arr[i] === item) {
			arr.splice(i, 1);
			break;
		}
	}
	//return arr;
}

/**
 * Returns true if the object is not null or undefined. Like MooTools' $.defined.
 * @param {Object} obj
 */
function defined(obj) {
	return obj !== UNDEFINED && obj !== null;
}

/**
 * Set or get an attribute or an object of attributes. Can't use jQuery attr because
 * it attempts to set expando properties on the SVG element, which is not allowed.
 *
 * @param {Object} elem The DOM element to receive the attribute(s)
 * @param {String|Object} prop The property or an abject of key-value pairs
 * @param {String} value The value if a single property is set
 */
function attr(elem, prop, value) {
	var key,
		ret;

	// if the prop is a string
	if (isString(prop)) {
		// set the value
		if (defined(value)) {
			elem.setAttribute(prop, value);

		// get the value
		} else if (elem && elem.getAttribute) { // elem not defined when printing pie demo...
			ret = elem.getAttribute(prop);
		}

	// else if prop is defined, it is a hash of key/value pairs
	} else if (defined(prop) && isObject(prop)) {
		for (key in prop) {
			elem.setAttribute(key, prop[key]);
		}
	}
	return ret;
}
/**
 * Check if an element is an array, and if not, make it into an array. Like
 * MooTools' $.splat.
 */
function splat(obj) {
	return isArray(obj) ? obj : [obj];
}


/**
 * Return the first value that is defined. Like MooTools' $.pick.
 */
var pick = JSComtrade.pick = function () {
	var args = arguments,
		i,
		arg,
		length = args.length;
	for (i = 0; i < length; i++) {
		arg = args[i];
		if (arg !== UNDEFINED && arg !== null) {
			return arg;
		}
	}
};

/**
 * Set CSS on a given element
 * @param {Object} el
 * @param {Object} styles Style object with camel case property names
 */
function css(el, styles) {
	if (isIE && !hasSVG) { // #2686
		if (styles && styles.opacity !== UNDEFINED) {
			styles.filter = 'alpha(opacity=' + (styles.opacity * 100) + ')';
		}
	}
	extend(el.style, styles);
}

/**
 * Utility function to create element with attributes and styles
 * @param {Object} tag
 * @param {Object} attribs
 * @param {Object} styles
 * @param {Object} parent
 * @param {Object} nopad
 */
function createElement(tag, attribs, styles, parent, nopad) {
	var el = doc.createElement(tag);
	if (attribs) {
		extend(el, attribs);
	}
	if (nopad) {
		css(el, {padding: 0, border: NONE, margin: 0});
	}
	if (styles) {
		css(el, styles);
	}
	if (parent) {
		parent.appendChild(el);
	}
	return el;
}

/**
 * Extend a prototyped class by new members
 * @param {Object} parent
 * @param {Object} members
 */
function extendClass(parent, members) {
	var object = function () { return UNDEFINED; };
	object.prototype = new parent();
	extend(object.prototype, members);
	return object;
}

/**
 * Pad a string to a given length by adding 0 to the beginning
 * @param {Number} number
 * @param {Number} length
 */
function pad(number, length) {
	// Create an array of the remaining length +1 and join it with 0's
	return new Array((length || 2) + 1 - String(number).length).join(0) + number;
}

/**
 * Return a length based on either the integer value, or a percentage of a base.
 */
function relativeLength (value, base) {
	return (/%$/).test(value) ? base * parseFloat(value) / 100 : parseFloat(value);
}

/**
 * Wrap a method with extended functionality, preserving the original function
 * @param {Object} obj The context object that the method belongs to 
 * @param {String} method The name of the method to extend
 * @param {Function} func A wrapper function callback. This function is called with the same arguments
 * as the original function, except that the original function is unshifted and passed as the first 
 * argument. 
 */
var wrap = JSComtrade.wrap = function (obj, method, func) {
	var proceed = obj[method];
	obj[method] = function () {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(proceed);
		return func.apply(this, args);
	};
};


function getTZOffset(timestamp) {
	return ((getTimezoneOffset && getTimezoneOffset(timestamp)) || timezoneOffset || 0) * 60000;
}

/**
 * Based on http://www.php.net/manual/en/function.strftime.php
 * @param {String} format
 * @param {Number} timestamp
 * @param {Boolean} capitalize
 */
dateFormat = function (format, timestamp, capitalize) {
	if (!defined(timestamp) || isNaN(timestamp)) {
		return 'Invalid date';
	}
	format = pick(format, '%Y-%m-%d %H:%M:%S');

	var date = new Date(timestamp - getTZOffset(timestamp)),
		key, // used in for constuct below
		// get the basic time values
		hours = date[getHours](),
		day = date[getDay](),
		dayOfMonth = date[getDate](),
		month = date[getMonth](),
		fullYear = date[getFullYear](),
		lang = defaultOptions.lang,
		langWeekdays = lang.weekdays,

		// List all format keys. Custom formats can be added from the outside. 
		replacements = extend({

			// Day
			'a': langWeekdays[day].substr(0, 3), // Short weekday, like 'Mon'
			'A': langWeekdays[day], // Long weekday, like 'Monday'
			'd': pad(dayOfMonth), // Two digit day of the month, 01 to 31
			'e': dayOfMonth, // Day of the month, 1 through 31
			'w': day,

			// Week (none implemented)
			//'W': weekNumber(),

			// Month
			'b': lang.shortMonths[month], // Short month, like 'Jan'
			'B': lang.months[month], // Long month, like 'January'
			'm': pad(month + 1), // Two digit month number, 01 through 12

			// Year
			'y': fullYear.toString().substr(2, 2), // Two digits year, like 09 for 2009
			'Y': fullYear, // Four digits year, like 2009

			// Time
			'H': pad(hours), // Two digits hours in 24h format, 00 through 23
			'I': pad((hours % 12) || 12), // Two digits hours in 12h format, 00 through 11
			'l': (hours % 12) || 12, // Hours in 12h format, 1 through 12
			'M': pad(date[getMinutes]()), // Two digits minutes, 00 through 59
			'p': hours < 12 ? 'AM' : 'PM', // Upper case AM or PM
			'P': hours < 12 ? 'am' : 'pm', // Lower case AM or PM
			'S': pad(date.getSeconds()), // Two digits seconds, 00 through  59
			'L': pad(mathRound(timestamp % 1000), 3) // Milliseconds (naming from Ruby)
		}, JSComtrade.dateFormats);


	// do the replaces
	for (key in replacements) {
		while (format.indexOf('%' + key) !== -1) { // regex would do it in one line, but this is faster
			format = format.replace('%' + key, typeof replacements[key] === 'function' ? replacements[key](timestamp) : replacements[key]);
		}
	}

	// Optionally capitalize the string and return
	return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
};

/** 
 * Format a single variable. Similar to sprintf, without the % prefix.
 */
function formatSingle(format, val) {
	var floatRegex = /f$/,
		decRegex = /\.([0-9])/,
		lang = defaultOptions.lang,
		decimals;

	if (floatRegex.test(format)) { // float
		decimals = format.match(decRegex);
		decimals = decimals ? decimals[1] : -1;
		if (val !== null) {
			val = JSComtrade.numberFormat(
				val,
				decimals,
				lang.decimalPoint,
				format.indexOf(',') > -1 ? lang.thousandsSep : ''
			);
		}
	} else {
		val = dateFormat(format, val);
	}
	return val;
}

/**
 * Format a string according to a subset of the rules of Python's String.format method.
 */
function format(str, ctx) {
	var splitter = '{',
		isInside = false,
		segment,
		valueAndFormat,
		path,
		i,
		len,
		ret = [],
		val,
		index;
	
	while ((index = str.indexOf(splitter)) !== -1) {
		
		segment = str.slice(0, index);
		if (isInside) { // we're on the closing bracket looking back
			
			valueAndFormat = segment.split(':');
			path = valueAndFormat.shift().split('.'); // get first and leave format
			len = path.length;
			val = ctx;

			// Assign deeper paths
			for (i = 0; i < len; i++) {
				val = val[path[i]];
			}

			// Format the replacement
			if (valueAndFormat.length) {
				val = formatSingle(valueAndFormat.join(':'), val);
			}

			// Push the result and advance the cursor
			ret.push(val);
			
		} else {
			ret.push(segment);
			
		}
		str = str.slice(index + 1); // the rest
		isInside = !isInside; // toggle
		splitter = isInside ? '}' : '{'; // now look for next matching bracket
	}
	ret.push(str);
	return ret.join('');
}

/**
 * Get the magnitude of a number
 */
function getMagnitude(num) {
	return math.pow(10, mathFloor(math.log(num) / math.LN10));
}

/**
 * Take an interval and normalize it to multiples of 1, 2, 2.5 and 5
 * @param {Number} interval
 * @param {Array} multiples
 * @param {Number} magnitude
 * @param {Object} options
 */
function normalizeTickInterval(interval, multiples, magnitude, allowDecimals, preventExceed) {
	var normalized, 
		i,
		retInterval = interval;

	// round to a tenfold of 1, 2, 2.5 or 5
	magnitude = pick(magnitude, 1);
	normalized = interval / magnitude;

	// multiples for a linear scale
	if (!multiples) {
		multiples = [1, 2, 2.5, 5, 10];

		// the allowDecimals option
		if (allowDecimals === false) {
			if (magnitude === 1) {
				multiples = [1, 2, 5, 10];
			} else if (magnitude <= 0.1) {
				multiples = [1 / magnitude];
			}
		}
	}

	// normalize the interval to the nearest multiple
	for (i = 0; i < multiples.length; i++) {
		retInterval = multiples[i];
		if ((preventExceed && retInterval * magnitude >= interval) || // only allow tick amounts smaller than natural
			(!preventExceed && (normalized <= (multiples[i] + (multiples[i + 1] || multiples[i])) / 2))) {
			break;
		}
	}

	// multiply back to the correct magnitude
	retInterval *= magnitude;
	
	return retInterval;
}


/**
 * Utility method that sorts an object array and keeping the order of equal items.
 * ECMA script standard does not specify the behaviour when items are equal.
 */
function stableSort(arr, sortFunction) {
	var length = arr.length,
		sortValue,
		i;

	// Add index to each item
	for (i = 0; i < length; i++) {
		arr[i].ss_i = i; // stable sort index
	}

	arr.sort(function (a, b) {
		sortValue = sortFunction(a, b);
		return sortValue === 0 ? a.ss_i - b.ss_i : sortValue;
	});

	// Remove index from items
	for (i = 0; i < length; i++) {
		delete arr[i].ss_i; // stable sort index
	}
}

/**
 * Non-recursive method to find the lowest member of an array. Math.min raises a maximum
 * call stack size exceeded error in Chrome when trying to apply more than 150.000 points. This
 * method is slightly slower, but safe.
 */
function arrayMin(data) {
	var i = data.length,
		min = data[0];

	while (i--) {
		if (data[i] < min) {
			min = data[i];
		}
	}
	return min;
}

/**
 * Non-recursive method to find the lowest member of an array. Math.min raises a maximum
 * call stack size exceeded error in Chrome when trying to apply more than 150.000 points. This
 * method is slightly slower, but safe.
 */
function arrayMax(data) {
	var i = data.length,
		max = data[0];

	while (i--) {
		if (data[i] > max) {
			max = data[i];
		}
	}
	return max;
}

/**
 * Utility method that destroys any SVGElement or VMLElement that are properties on the given object.
 * It loops all properties and invokes destroy if there is a destroy method. The property is
 * then delete'ed.
 * @param {Object} The object to destroy properties on
 * @param {Object} Exception, do not destroy this property, only delete it.
 */
function destroyObjectProperties(obj, except) {
	var n;
	for (n in obj) {
		// If the object is non-null and destroy is defined
		if (obj[n] && obj[n] !== except && obj[n].destroy) {
			// Invoke the destroy
			obj[n].destroy();
		}

		// Delete the property from the object.
		delete obj[n];
	}
}


/**
 * Discard an element by moving it to the bin and delete
 * @param {Object} The HTML node to discard
 */
function discardElement(element) {
	// create a garbage bin element, not part of the DOM
	if (!garbageBin) {
		garbageBin = createElement(DIV);
	}

	// move the node and empty bin
	if (element) {
		garbageBin.appendChild(element);
	}
	garbageBin.innerHTML = '';
}

/**
 * Provide error messages for debugging, with links to online explanation 
 */
function error (code, stop) {
	var msg = 'JSComtrade error #' + code + ': www.JSComtrade.com/errors/' + code;
	if (stop) {
		throw msg;
	}
	// else ...
	if (win.console) {
		console.log(msg);
	}
}

/**
 * Fix JS round off float errors
 * @param {Number} num
 */
function correctFloat(num) {
	return parseFloat(
		num.toPrecision(14)
	);
}

/**
 * Set the global animation to either a given value, or fall back to the
 * given chart's animation option
 * @param {Object} animation
 * @param {Object} chart
 */
function setAnimation(animation, chart) {
	globalAnimation = pick(animation, chart.animation);
}

/**
 * The time unit lookup
 */
timeUnits = {
	millisecond: 1,
	second: 1000,
	minute: 60000,
	hour: 3600000,
	day: 24 * 3600000,
	week: 7 * 24 * 3600000,
	month: 28 * 24 * 3600000,
	year: 364 * 24 * 3600000
};


/**
 * Format a number and return a string based on input settings
 * @param {Number} number The input number to format
 * @param {Number} decimals The amount of decimals
 * @param {String} decPoint The decimal point, defaults to the one given in the lang options
 * @param {String} thousandsSep The thousands separator, defaults to the one given in the lang options
 */
JSComtrade.numberFormat = function (number, decimals, decPoint, thousandsSep) {
	var lang = defaultOptions.lang,
		// http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
		n = +number || 0,
		c = decimals === -1 ?
			mathMin((n.toString().split('.')[1] || '').length, 20) : // Preserve decimals. Not huge numbers (#3793).
			(isNaN(decimals = mathAbs(decimals)) ? 2 : decimals),
		d = decPoint === undefined ? lang.decimalPoint : decPoint,
		t = thousandsSep === undefined ? lang.thousandsSep : thousandsSep,
		s = n < 0 ? "-" : "",
		i = String(pInt(n = mathAbs(n).toFixed(c))),
		j = i.length > 3 ? i.length % 3 : 0;

	return (s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
			(c ? d + mathAbs(n - i).toFixed(c).slice(2) : ""));
};
/**
 * Path interpolation algorithm used across adapters
 */
pathAnim = {
	/**
	 * Prepare start and end values so that the path can be animated one to one
	 */
	init: function (elem, fromD, toD) {
		fromD = fromD || '';
		var shift = elem.shift,
			bezier = fromD.indexOf('C') > -1,
			numParams = bezier ? 7 : 3,
			endLength,
			slice,
			i,
			start = fromD.split(' '),
			end = [].concat(toD), // copy
			startBaseLine,
			endBaseLine,
			sixify = function (arr) { // in splines make move points have six parameters like bezier curves
				i = arr.length;
				while (i--) {
					if (arr[i] === M) {
						arr.splice(i + 1, 0, arr[i + 1], arr[i + 2], arr[i + 1], arr[i + 2]);
					}
				}
			};

		if (bezier) {
			sixify(start);
			sixify(end);
		}

		// pull out the base lines before padding
		if (elem.isArea) {
			startBaseLine = start.splice(start.length - 6, 6);
			endBaseLine = end.splice(end.length - 6, 6);
		}

		// if shifting points, prepend a dummy point to the end path
		if (shift <= end.length / numParams && start.length === end.length) {
			while (shift--) {
				end = [].concat(end).splice(0, numParams).concat(end);
			}
		}
		elem.shift = 0; // reset for following animations

		// copy and append last point until the length matches the end length
		if (start.length) {
			endLength = end.length;
			while (start.length < endLength) {

				//bezier && sixify(start);
				slice = [].concat(start).splice(start.length - numParams, numParams);
				if (bezier) { // disable first control point
					slice[numParams - 6] = slice[numParams - 2];
					slice[numParams - 5] = slice[numParams - 1];
				}
				start = start.concat(slice);
			}
		}

		if (startBaseLine) { // append the base lines for areas
			start = start.concat(startBaseLine);
			end = end.concat(endBaseLine);
		}
		return [start, end];
	},

	/**
	 * Interpolate each value of the path and return the array
	 */
	step: function (start, end, pos, complete) {
		var ret = [],
			i = start.length,
			startVal;

		if (pos === 1) { // land on the final path without adjustment points appended in the ends
			ret = complete;

		} else if (i === end.length && pos < 1) {
			while (i--) {
				startVal = parseFloat(start[i]);
				ret[i] =
					isNaN(startVal) ? // a letter instruction like M or L
						start[i] :
						pos * (parseFloat(end[i] - startVal)) + startVal;

			}
		} else { // if animation is finished or length not matching, land on right value
			ret = end;
		}
		return ret;
	}
};

(function ($) {
	/**
	 * The default JSComtradeAdapter for jQuery
	 */
	win.JSComtradeAdapter = win.JSComtradeAdapter || ($ && {
		
		/**
		 * Initialize the adapter by applying some extensions to jQuery
		 */
		init: function (pathAnim) {
			
			// extend the animate function to allow SVG animations
			var Fx = $.fx;
			
			/*jslint unparam: true*//* allow unused param x in this function */
			$.extend($.easing, {
				easeOutQuad: function (x, t, b, c, d) {
					return -c * (t /= d) * (t - 2) + b;
				}
			});
			/*jslint unparam: false*/
		
			// extend some methods to check for elem.attr, which means it is a JSComtrade SVG object
			$.each(['cur', '_default', 'width', 'height', 'opacity'], function (i, fn) {
				var obj = Fx.step,
					base;
					
				// Handle different parent objects
				if (fn === 'cur') {
					obj = Fx.prototype; // 'cur', the getter, relates to Fx.prototype
				
				} else if (fn === '_default' && $.Tween) { // jQuery 1.8 model
					obj = $.Tween.propHooks[fn];
					fn = 'set';
				}
		
				// Overwrite the method
				base = obj[fn];
				if (base) { // step.width and step.height don't exist in jQuery < 1.7
		
					// create the extended function replacement
					obj[fn] = function (fx) {

						var elem;
						
						// Fx.prototype.cur does not use fx argument
						fx = i ? fx : this;

						// Don't run animations on textual properties like align (#1821)
						if (fx.prop === 'align') {
							return;
						}
		
						// shortcut
						elem = fx.elem;
		
						// Fx.prototype.cur returns the current value. The other ones are setters
						// and returning a value has no effect.
						return elem.attr ? // is SVG element wrapper
							elem.attr(fx.prop, fn === 'cur' ? UNDEFINED : fx.now) : // apply the SVG wrapper's method
							base.apply(this, arguments); // use jQuery's built-in method
					};
				}
			});

			// Extend the opacity getter, needed for fading opacity with IE9 and jQuery 1.10+
			wrap($.cssHooks.opacity, 'get', function (proceed, elem, computed) {
				return elem.attr ? (elem.opacity || 0) : proceed.call(this, elem, computed);
			});
			
			// Define the setter function for d (path definitions)
			this.addAnimSetter('d', function (fx) {
				var elem = fx.elem,
					ends;
		
				// Normally start and end should be set in state == 0, but sometimes,
				// for reasons unknown, this doesn't happen. Perhaps state == 0 is skipped
				// in these cases
				if (!fx.started) {
					ends = pathAnim.init(elem, elem.d, elem.toD);
					fx.start = ends[0];
					fx.end = ends[1];
					fx.started = true;
				}
		
				// Interpolate each value of the path
				elem.attr('d', pathAnim.step(fx.start, fx.end, fx.pos, elem.toD));
			});
			
			/**
			 * Utility for iterating over an array. Parameters are reversed compared to jQuery.
			 * @param {Array} arr
			 * @param {Function} fn
			 */
			this.each = Array.prototype.forEach ?
				function (arr, fn) { // modern browsers
					return Array.prototype.forEach.call(arr, fn);
					
				} : 
				function (arr, fn) { // legacy
					var i, 
						len = arr.length;
					for (i = 0; i < len; i++) {
						if (fn.call(arr[i], arr[i], i, arr) === false) {
							return i;
						}
					}
				};
			
			/**
			 * Register JSComtrade as a plugin in the respective framework
			 */
			$.fn.jscomtrade = function () {
				var constr = 'Chart', // default constructor
					args = arguments,
					options,
					ret,
					chart;

				if (this[0]) {
					options = args[0];

					// Create the chart
					if (options !== UNDEFINED) {
						options.chart = options.chart || {};
						options.chart.renderTo = this[0];
						chart = new JSComtrade[constr](options, args[1]);
						ret = this;
					}
				}				
				return ret;
			};

		},

		/**
		 * Add an animation setter for a specific property
		 */
		addAnimSetter: function (prop, setter) {
			// jQuery 1.8 style
			if ($.Tween) {
				$.Tween.propHooks[prop] = {
					set: setter
				};
			// pre 1.8
			} else {
				$.fx.step[prop] = setter;
			}
		},
		
		/**
		 * Downloads a script and executes a callback when done.
		 * @param {String} scriptLocation
		 * @param {Function} callback
		 */
		getScript: $.getScript,
		
		/**
		 * Return the index of an item in an array, or -1 if not found
		 */
		inArray: $.inArray,
		
		/**
		 * A direct link to jQuery methods. MooTools and Prototype adapters must be implemented for each case of method.
		 * @param {Object} elem The HTML element
		 * @param {String} method Which method to run on the wrapped element
		 */
		adapterRun: function (elem, method) {
			return $(elem)[method]();
		},
	
		/**
		 * Filter an array
		 */
		grep: $.grep,
	
		/**
		 * Map an array
		 * @param {Array} arr
		 * @param {Function} fn
		 */
		map: function (arr, fn) {
			//return jQuery.map(arr, fn);
			var results = [],
				i = 0,
				len = arr.length;
			for (; i < len; i++) {
				results[i] = fn.call(arr[i], arr[i], i, arr);
			}
			return results;
	
		},
	
		/**
		 * Get the position of an element relative to the top left of the page
		 */
		offset: function (el) {
			return $(el).offset();
		},
	
		/**
		 * Add an event listener
		 * @param {Object} el A HTML element or custom object
		 * @param {String} event The event type
		 * @param {Function} fn The event handler
		 */
		addEvent: function (el, event, fn) {
			$(el).bind(event, fn);
		},
	
		/**
		 * Remove event added with addEvent
		 * @param {Object} el The object
		 * @param {String} eventType The event type. Leave blank to remove all events.
		 * @param {Function} handler The function to remove
		 */
		removeEvent: function (el, eventType, handler) {
			// workaround for jQuery issue with unbinding custom events:
			// http://forum.jQuery.com/topic/javascript-error-when-unbinding-a-custom-event-using-jQuery-1-4-2
			var func = doc.removeEventListener ? 'removeEventListener' : 'detachEvent';
			if (doc[func] && el && !el[func]) {
				el[func] = function () {};
			}
	
			$(el).unbind(eventType, handler);
		},
	
		/**
		 * Fire an event on a custom object
		 * @param {Object} el
		 * @param {String} type
		 * @param {Object} eventArguments
		 * @param {Function} defaultFunction
		 */
		fireEvent: function (el, type, eventArguments, defaultFunction) {
			var event = $.Event(type),
				detachedType = 'detached' + type,
				defaultPrevented;
	
			// Remove warnings in Chrome when accessing returnValue (#2790), layerX and layerY. Although JSComtrade
			// never uses these properties, Chrome includes them in the default click event and
			// raises the warning when they are copied over in the extend statement below.
			//
			// To avoid problems in IE (see #1010) where we cannot delete the properties and avoid
			// testing if they are there (warning in chrome) the only option is to test if running IE.
			if (!isIE && eventArguments) {
				delete eventArguments.layerX;
				delete eventArguments.layerY;
				delete eventArguments.returnValue;
			}
	
			extend(event, eventArguments);
	
			// Prevent jQuery from triggering the object method that is named the
			// same as the event. For example, if the event is 'select', jQuery
			// attempts calling el.select and it goes into a loop.
			if (el[type]) {
				el[detachedType] = el[type];
				el[type] = null;
			}
	
			// Wrap preventDefault and stopPropagation in try/catch blocks in
			// order to prevent JS errors when cancelling events on non-DOM
			// objects. #615.
			/*jslint unparam: true*/
			$.each(['preventDefault', 'stopPropagation'], function (i, fn) {
				var base = event[fn];
				event[fn] = function () {
					try {
						base.call(event);
					} catch (e) {
						if (fn === 'preventDefault') {
							defaultPrevented = true;
						}
					}
				};
			});
			/*jslint unparam: false*/
	
			// trigger it
			$(el).trigger(event);
	
			// attach the method
			if (el[detachedType]) {
				el[type] = el[detachedType];
				el[detachedType] = null;
			}
	
			if (defaultFunction && !event.isDefaultPrevented() && !defaultPrevented) {
				defaultFunction(event);
			}
		},
		
		/**
		 * Extension method needed for MooTools
		 */
		washMouseEvent: function (e) {
			var ret = e.originalEvent || e;
			
			// computed by jQuery, needed by IE8
			if (ret.pageX === UNDEFINED) { // #1236
				ret.pageX = e.pageX;
				ret.pageY = e.pageY;
			}
			
			return ret;
		},
	
		/**
		 * Animate a HTML element or SVG element wrapper
		 * @param {Object} el
		 * @param {Object} params
		 * @param {Object} options jQuery-like animation options: duration, easing, callback
		 */
		animate: function (el, params, options) {
			var $el = $(el);
			if (!el.style) {
				el.style = {}; // #1881
			}
			if (params.d) {
				el.toD = params.d; // keep the array form for paths, used in $.fx.step.d
				params.d = 1; // because in jQuery, animating to an array has a different meaning
			}
	
			$el.stop();
			if (params.opacity !== UNDEFINED && el.attr) {
				params.opacity += 'px'; // force jQuery to use same logic as width and height (#2161)
			}
			el.hasAnim = 1; // #3342
			$el.animate(params, options);
	
		},
		/**
		 * Stop running animation
		 */
		stop: function (el) {
			if (el.hasAnim) { // #3342, memory leak on calling $(el) from destroy
				$(el).stop();
			}
		}
	});
}(win.jQuery));


// check for a custom JSComtradeAdapter defined prior to this file
var globalAdapter = win.JSComtradeAdapter,
	adapter = globalAdapter || {};
	
// Initialize the adapter
if (globalAdapter) {
	globalAdapter.init.call(globalAdapter, pathAnim);
}


// Utility functions. If the JSComtradeAdapter is not defined, adapter is an empty object
// and all the utility functions will be null. In that case they are populated by the
// default adapters below.
var adapterRun = adapter.adapterRun,
	getScript = adapter.getScript,
	inArray = adapter.inArray,
	each = JSComtrade.each = adapter.each,
	grep = adapter.grep,
	offset = adapter.offset,
	map = adapter.map,
	addEvent = adapter.addEvent,
	removeEvent = adapter.removeEvent,
	fireEvent = adapter.fireEvent,
	washMouseEvent = adapter.washMouseEvent,
	animate = adapter.animate,
	stop = adapter.stop;



/* ****************************************************************************
 * Handle the options                                                         *
 *****************************************************************************/
defaultOptions = {
	colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', 
		    '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
	symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
	lang: {
		loading: 'Loading...',
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
				'August', 'September', 'October', 'November', 'December'],
		shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		decimalPoint: '.',
		numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'], // SI prefixes used in axis labels
		resetZoom: 'Reset zoom',
		resetZoomTitle: 'Reset zoom level 1:1',
		thousandsSep: ','
	},
	global: {
		useUTC: true,
		//timezoneOffset: 0,
		canvasToolsURL: 'http://code.highcharts.com/4.1.7-modified/modules/canvas-tools.js',
		VMLRadialGradientURL: 'http://code.highcharts.com/4.1.7-modified/gfx/vml-radial-gradient.png'
	},
	
	chart: {
		borderColor: '#4572A7',
		borderRadius: 0,
		spacing: [0, 30, 0, 0],
		backgroundColor: '#FFFFFF',
		plotBorderColor: '#C0C0C0',
		plotBorderWidth: 1,
		pxPerMS : 1, //每毫秒占用几个像素，控制图形横向缩放
		cursorSyn : true, //游标同步
    	channel:{
    		height : 80, //通道图形的高度,包含了名称文字
    		color : '#d8d8d8'
    	},
    	channelName : {
    		enable : true, //每个通道图形中名称的高度
    		fontSize : '12px',
    		color : '#0c0c0c',
    		height : 16 //此高度应包含在channelHeight之内
    	},
    	channelMargin : [4,0,4,60], //通道图形外边距,top,right,bottom,left
    	channelA : {
    		color : '#ff0000',
    		fill : '#ff0000',
    	},
    	channelB : {
    		color : '#0000ff',
    		fill : '#0000ff'
    	},
    	channelC : {
    		color : '#00ff00',
    		fill : '#00ff00'
    	},channelN : {
    		color : '#000000',
    		fill : '#000000'
    	}		
	},
	title: {
		text: '',
		align: 'left',
		margin: 10,
		style: {
			color: '#333333',
			fontSize: '12px'
		}

	},
	subtitle: {
		text: '',
		align: 'right',
		style: {
			color: '#555555'
		}
	},
	axis:{
		height:10,
    	style:{
    		color : '#000000',
    		stokeWidth : 1
    	},
    	label:{
    		enable : true,
    		style :{
    			color : '#333333',
        		fontSize : '12px'
    		}  		
    	}
    },
	cursor1:{
		type: 'primary',
		enable:true,
		style: {
			color: '#000000',
			fontSize : '12px'
		},
		lineStyle:{
			stroke: '#000000',
			'stroke-width':1
		}
	},
	cursor2:{
		type: 'secondary',
		enable:true,
		style: {
			color: '#000000',
			fontSize : '12px'
		},
		lineStyle:{
			stroke: '#000000',
			'stroke-dasharray':'5,5',
			'stroke-width':1
		}
	},
	
	tooltip: {
		enabled: true,
		animation: hasSVG,
		backgroundColor: 'rgba(249, 249, 249, .85)',
		borderWidth: 1,
		borderRadius: 3,
		shadow: true,
		snap: isTouchDevice ? 25 : 10,
		style: {
			color: '#333333',
			cursor: 'default',
			fontSize: '12px',
			padding: '8px',
			whiteSpace: 'nowrap'
		}
	}
	/*comtrade:{
	achannelCount : 8, //模拟量通道数
	dchannelCount : 4, //开关量通道数
	sampleCount : 27, //总采样点数
	sampleOffset : 40, //采样时间和故障时间的偏差(毫秒),最小为0,小于0的应忽略
	lineFreq : 50, //线路频率
	rateCount : 2, //采样频率数
	rates:[{
		rate:1200, //频率
		count:192  //此频率采样点数
	},{
		rate:50, //频率
		count:209  //此频率采样点数
	}],
	useCommonAmplitude : false,
	maxIValue : 200, //最大电流值，用于设置电流通道的振幅
	maxUValue : 200, //最大电压值，用于设置电压通道的振幅
	maxOtherValue : 200, //其他通道最大值，用于设置其他通道的振幅
	maxIValueP : 200, //最大电流值一次值，用于设置电流通道的振幅
	maxUValueP : 200, //最大电压值一次值，用于设置电压通道的振幅
	maxOtherValueP : 200, //其他通道最大值一次值，用于设置其他通道的振幅
	times:[0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260],
	channels:[{
    	name:'xxx通道',
    	type:'AI',
    	max:26.5,
    	unit:'A',
    	phase:'A',
    	data:[0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6,7.0, -6.9, -9.5, 0, -18.2, -21.5, -25.2, -26.5, -23.3, -18.3, -13.9, -9.6,21.5, 25.2, 26.5]
    },{
    	name:'通道2',
    	type:'AI',
    	max:24.8,
    	unit:'A',
    	phase:'B',
    	data:[-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5,-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5,22.0, 24.8, 24.1]
    },{
    	name:'通道3',
    	type:'AI',
    	max:18.6,
    	unit:'V',
    	phase:'C',
    	data:[-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0,-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0,18.6, 17.9, 14.3]
    },{
    	name:'通道4',
    	type:'AI',
    	max:18.6,
    	unit:'V',
    	phase:'N',
    	data:[-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0,-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0,18.6, 17.9, 14.3]
    },{
    	name:'xxx通道',
    	type:'AI',
    	max:26.5,
    	unit:'A',
    	phase:'A',
    	data:[7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6,7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6,21.5, 25.2, 26.5]
    },{
    	name:'通道2',
    	type:'AI',
    	max:24.8,
    	unit:'A',
    	phase:'B',
    	data:[-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5,-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5,22.0, 24.8, 24.1]
    },{
    	name:'通道3',
    	type:'AI',
    	max:18.6,
    	unit:'V',
    	phase:'C',
    	data:[-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0,-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0,18.6, 17.9, 14.3]
    },{
    	name:'通道4',
    	type:'AI',
    	max:18.6,
    	unit:'V',
    	phase:'N',
    	data:[-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0,-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0,18.6, 17.9, 14.3]
    },{
    	name:'开关量通道1',
    	type:'DI',
    	data:[[0,0],
    	     [8,1],
    	     [17,0]]
    },{
    	name:'开关量通道2',
    	type:'DI',
    	data:[[0,1],
    	     [8,0],
    	     [17,1]]
    },{
    	name:'开关量通道3',
    	type:'DI',
    	data:[[0,0],
    	     [18,1],
    	     [25,0]]
    },{
    	name:'开关量通道4',
    	type:'DI',
    	data:[[0,0]]
    }]
}*/
};

// set the default time methods
setTimeMethods();

/**
 * Set the time methods globally based on the useUTC option. Time method can be either
 * local time or UTC (default).
 */
function setTimeMethods() {
	var globalOptions = defaultOptions.global,
		useUTC = globalOptions.useUTC,
		GET = useUTC ? 'getUTC' : 'get',
		SET = useUTC ? 'setUTC' : 'set';


	Date = globalOptions.Date || window.Date;
	timezoneOffset = useUTC && globalOptions.timezoneOffset;
	getTimezoneOffset = useUTC && globalOptions.getTimezoneOffset;
	makeTime = function (year, month, date, hours, minutes, seconds) {
		var d;
		if (useUTC) {
			d = Date.UTC.apply(0, arguments);
			d += getTZOffset(d);
		} else {
			d = new Date(
				year,
				month,
				pick(date, 1),
				pick(hours, 0),
				pick(minutes, 0),
				pick(seconds, 0)
			).getTime();
		}
		return d;
	};
	getMinutes =      GET + 'Minutes';
	getHours =        GET + 'Hours';
	getDay =          GET + 'Day';
	getDate =         GET + 'Date';
	getMonth =        GET + 'Month';
	getFullYear =     GET + 'FullYear';
	setMilliseconds = SET + 'Milliseconds';
	setSeconds =      SET + 'Seconds';
	setMinutes =      SET + 'Minutes';
	setHours =        SET + 'Hours';
	setDate =         SET + 'Date';
	setMonth =        SET + 'Month';
	setFullYear =     SET + 'FullYear';

}

/**
 * Merge the default options with custom options and return the new options structure
 * @param {Object} options The new custom options
 */
function setOptions(options) {
	
	// Copy in the default options
	defaultOptions = merge(true, defaultOptions, options);
	
	// Apply UTC
	setTimeMethods();

	return defaultOptions;
}

/**
 * Get the updated default options. Until 3.0.7, merely exposing defaultOptions for outside modules
 * wasn't enough because the setOptions method created a new object.
 */
function getOptions() {
	return defaultOptions;
}


/**
 * Handle color operations. The object methods are chainable.
 * @param {String} input The input color in either rbga or hex format
 */
var rgbaRegEx = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
	hexRegEx = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
	rgbRegEx = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/;

var Color = function (input) {
	// declare variables
	var rgba = [], result, stops;

	/**
	 * Parse the input color to rgba array
	 * @param {String} input
	 */
	function init(input) {

		// Gradients
		if (input && input.stops) {
			stops = map(input.stops, function (stop) {
				return Color(stop[1]);
			});

		// Solid colors
		} else {
			// rgba
			result = rgbaRegEx.exec(input);
			if (result) {
				rgba = [pInt(result[1]), pInt(result[2]), pInt(result[3]), parseFloat(result[4], 10)];
			} else { 
				// hex
				result = hexRegEx.exec(input);
				if (result) {
					rgba = [pInt(result[1], 16), pInt(result[2], 16), pInt(result[3], 16), 1];
				} else {
					// rgb
					result = rgbRegEx.exec(input);
					if (result) {
						rgba = [pInt(result[1]), pInt(result[2]), pInt(result[3]), 1];
					}
				}
			}
		}		

	}
	/**
	 * Return the color a specified format
	 * @param {String} format
	 */
	function get(format) {
		var ret;

		if (stops) {
			ret = merge(input);
			ret.stops = [].concat(ret.stops);
			each(stops, function (stop, i) {
				ret.stops[i] = [ret.stops[i][0], stop.get(format)];
			});

		// it's NaN if gradient colors on a column chart
		} else if (rgba && !isNaN(rgba[0])) {
			if (format === 'rgb') {
				ret = 'rgb(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ')';
			} else if (format === 'a') {
				ret = rgba[3];
			} else {
				ret = 'rgba(' + rgba.join(',') + ')';
			}
		} else {
			ret = input;
		}
		return ret;
	}

	/**
	 * Brighten the color
	 * @param {Number} alpha
	 */
	function brighten(alpha) {
		if (stops) {
			each(stops, function (stop) {
				stop.brighten(alpha);
			});
		
		} else if (isNumber(alpha) && alpha !== 0) {
			var i;
			for (i = 0; i < 3; i++) {
				rgba[i] += pInt(alpha * 255);

				if (rgba[i] < 0) {
					rgba[i] = 0;
				}
				if (rgba[i] > 255) {
					rgba[i] = 255;
				}
			}
		}
		return this;
	}
	/**
	 * Set the color's opacity to a given alpha value
	 * @param {Number} alpha
	 */
	function setOpacity(alpha) {
		rgba[3] = alpha;
		return this;
	}

	// initialize: parse the input
	init(input);

	// public methods
	return {
		get: get,
		brighten: brighten,
		rgba: rgba,
		setOpacity: setOpacity,
		raw: input
	};
};


/**
 * A wrapper object for SVG elements
 */
function SVGElement() {}

SVGElement.prototype = {
	
	// Default base for animation
	opacity: 1,
	// For labels, these CSS properties are applied to the <text> node directly
	textProps: ['fontSize', 'fontWeight', 'fontFamily', 'fontStyle', 'color', 
		'lineHeight', 'width', 'textDecoration', 'textOverflow', 'textShadow'],
	
	/**
	 * Initialize the SVG renderer
	 * @param {Object} renderer
	 * @param {String} nodeName
	 */
	init: function (renderer, nodeName) {
		var wrapper = this;
		wrapper.element = nodeName === 'span' ?
			createElement(nodeName) :
			doc.createElementNS(SVG_NS, nodeName);
		wrapper.renderer = renderer;
	},
	
	/**
	 * Animate a given attribute
	 * @param {Object} params
	 * @param {Number} options The same options as in jQuery animation
	 * @param {Function} complete Function to perform at the end of animation
	 */
	animate: function (params, options, complete) {
		var animOptions = pick(options, globalAnimation, true);
		stop(this); // stop regardless of animation actually running, or reverting to .attr (#607)
		if (animOptions) {
			animOptions = merge(animOptions, {}); //#2625
			if (complete) { // allows using a callback with the global animation without overwriting it
				animOptions.complete = complete;
			}
			animate(this, params, animOptions);
		} else {
			this.attr(params);
			if (complete) {
				complete();
			}
		}
		return this;
	},

	/**
	 * Build an SVG gradient out of a common JavaScript configuration object
	 */
	colorGradient: function (color, prop, elem) {
		var renderer = this.renderer,
			colorObject,
			gradName,
			gradAttr,
			gradients,
			gradientObject,
			stops,
			stopColor,
			stopOpacity,
			radialReference,
			n,
			id,
			key = [];

		// Apply linear or radial gradients
		if (color.linearGradient) {
			gradName = 'linearGradient';
		} else if (color.radialGradient) {
			gradName = 'radialGradient';
		}

		if (gradName) {
			gradAttr = color[gradName];
			gradients = renderer.gradients;
			stops = color.stops;
			radialReference = elem.radialReference;

			// Keep < 2.2 kompatibility
			if (isArray(gradAttr)) {
				color[gradName] = gradAttr = {
					x1: gradAttr[0],
					y1: gradAttr[1],
					x2: gradAttr[2],
					y2: gradAttr[3],
					gradientUnits: 'userSpaceOnUse'
				};
			}

			// Correct the radial gradient for the radial reference system
			if (gradName === 'radialGradient' && radialReference && !defined(gradAttr.gradientUnits)) {
				gradAttr = merge(gradAttr, {
					cx: (radialReference[0] - radialReference[2] / 2) + gradAttr.cx * radialReference[2],
					cy: (radialReference[1] - radialReference[2] / 2) + gradAttr.cy * radialReference[2],
					r: gradAttr.r * radialReference[2],
					gradientUnits: 'userSpaceOnUse'
				});
			}

			// Build the unique key to detect whether we need to create a new element (#1282)
			for (n in gradAttr) {
				if (n !== 'id') {
					key.push(n, gradAttr[n]);
				}
			}
			for (n in stops) {
				key.push(stops[n]);
			}
			key = key.join(',');

			// Check if a gradient object with the same config object is created within this renderer
			if (gradients[key]) {
				id = gradients[key].attr('id');

			} else {

				// Set the id and create the element
				gradAttr.id = id = PREFIX + idCounter++;
				gradients[key] = gradientObject = renderer.createElement(gradName)
					.attr(gradAttr)
					.add(renderer.defs);


				// The gradient needs to keep a list of stops to be able to destroy them
				gradientObject.stops = [];
				each(stops, function (stop) {
					var stopObject;
					if (stop[1].indexOf('rgba') === 0) {
						colorObject = Color(stop[1]);
						stopColor = colorObject.get('rgb');
						stopOpacity = colorObject.get('a');
					} else {
						stopColor = stop[1];
						stopOpacity = 1;
					}
					stopObject = renderer.createElement('stop').attr({
						offset: stop[0],
						'stop-color': stopColor,
						'stop-opacity': stopOpacity
					}).add(gradientObject);

					// Add the stop element to the gradient
					gradientObject.stops.push(stopObject);
				});
			}

			// Set the reference to the gradient object
			elem.setAttribute(prop, 'url(' + renderer.url + '#' + id + ')');
		} 
	},

	/**
	 * Apply a polyfill to the text-stroke CSS property, by copying the text element
	 * and apply strokes to the copy.
	 *
	 * docs: update default, document the polyfill and the limitations on hex colors and pixel values, document contrast pseudo-color
	 * - update defaults
	 */
	applyTextShadow: function (textShadow) {
		var elem = this.element,
			tspans,
			hasContrast = textShadow.indexOf('contrast') !== -1,
			styles = {},
			// IE10 and IE11 report textShadow in elem.style even though it doesn't work. Check
			// this again with new IE release. In exports, the rendering is passed to PhantomJS. 
			supports = this.renderer.forExport || (elem.style.textShadow !== UNDEFINED && !isIE);

		// When the text shadow is set to contrast, use dark stroke for light text and vice versa
		if (hasContrast) {
			styles.textShadow = textShadow = textShadow.replace(/contrast/g, this.renderer.getContrast(elem.style.fill));
		}

		// Safari with retina displays as well as PhantomJS bug (#3974). Firefox does not tolerate this,
		// it removes the text shadows.
		if (isWebKit) {
			styles.textRendering = 'geometricPrecision';
		}

		/* Selective side-by-side testing in supported browser (http://jsfiddle.net/highcharts/73L1ptrh/)
		if (elem.textContent.indexOf('2.') === 0) {
			elem.style['text-shadow'] = 'none';
			supports = false;
		}
		// */

		// No reason to polyfill, we've got native support
		if (supports) {
			css(elem, styles); // Apply altered textShadow or textRendering workaround
		} else {

			this.fakeTS = true; // Fake text shadow

			// In order to get the right y position of the clones, 
			// copy over the y setter
			this.ySetter = this.xSetter;

			tspans = [].slice.call(elem.getElementsByTagName('tspan'));
			each(textShadow.split(/\s?,\s?/g), function (textShadow) {
				var firstChild = elem.firstChild,
					color,
					strokeWidth;
				
				textShadow = textShadow.split(' ');
				color = textShadow[textShadow.length - 1];

				// Approximately tune the settings to the text-shadow behaviour
				strokeWidth = textShadow[textShadow.length - 2];

				if (strokeWidth) {
					each(tspans, function (tspan, y) {
						var clone;

						// Let the first line start at the correct X position
						if (y === 0) {
							tspan.setAttribute('x', elem.getAttribute('x'));
							y = elem.getAttribute('y');
							tspan.setAttribute('y', y || 0);
							if (y === null) {
								elem.setAttribute('y', 0);
							}
						}

						// Create the clone and apply shadow properties
						clone = tspan.cloneNode(1);
						attr(clone, {
							'class': PREFIX + 'text-shadow',
							'fill': color,
							'stroke': color,
							'stroke-opacity': 1 / mathMax(pInt(strokeWidth), 3),
							'stroke-width': strokeWidth,
							'stroke-linejoin': 'round'
						});
						elem.insertBefore(clone, firstChild);
					});
				}
			});
		}
	},

	/**
	 * Set or get a given attribute
	 * @param {Object|String} hash
	 * @param {Mixed|Undefined} val
	 */
	attr: function (hash, val) {
		var key,
			value,
			element = this.element,
			hasSetSymbolSize,
			ret = this,
			skipAttr;

		// single key-value pair
		if (typeof hash === 'string' && val !== UNDEFINED) {
			key = hash;
			hash = {};
			hash[key] = val;
		}

		// used as a getter: first argument is a string, second is undefined
		if (typeof hash === 'string') {
			ret = (this[hash + 'Getter'] || this._defaultGetter).call(this, hash, element);
		
		// setter
		} else {

			for (key in hash) {
				value = hash[key];
				skipAttr = false;



				if (this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(key)) {
					if (!hasSetSymbolSize) {
						this.symbolAttr(hash);
						hasSetSymbolSize = true;
					}
					skipAttr = true;
				}

				if (this.rotation && (key === 'x' || key === 'y')) {
					this.doTransform = true;
				}
				
				if (!skipAttr) {
					(this[key + 'Setter'] || this._defaultSetter).call(this, value, key, element);
				}

				// Let the shadow follow the main element
				if (this.shadows && /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(key)) {
					this.updateShadows(key, value);
				}
			}

			// Update transform. Do this outside the loop to prevent redundant updating for batch setting
			// of attributes.
			if (this.doTransform) {
				this.updateTransform();
				this.doTransform = false;
			}

		}

		return ret;
	},

	updateShadows: function (key, value) {
		var shadows = this.shadows,
			i = shadows.length;
		while (i--) {
			shadows[i].setAttribute(
				key,
				key === 'height' ?
					mathMax(value - (shadows[i].cutHeight || 0), 0) :
					key === 'd' ? this.d : value
			);
		}
	},

	/**
	 * Add a class name to an element
	 */
	addClass: function (className) {
		var element = this.element,
			currentClassName = attr(element, 'class') || '';

		if (currentClassName.indexOf(className) === -1) {
			attr(element, 'class', currentClassName + ' ' + className);
		}
		return this;
	},
	/* hasClass and removeClass are not (yet) needed
	hasClass: function (className) {
		return attr(this.element, 'class').indexOf(className) !== -1;
	},
	removeClass: function (className) {
		attr(this.element, 'class', attr(this.element, 'class').replace(className, ''));
		return this;
	},
	*/

	/**
	 * If one of the symbol size affecting parameters are changed,
	 * check all the others only once for each call to an element's
	 * .attr() method
	 * @param {Object} hash
	 */
	symbolAttr: function (hash) {
		var wrapper = this;

		each(['x', 'y', 'r', 'start', 'end', 'width', 'height', 'innerR', 'anchorX', 'anchorY'], function (key) {
			wrapper[key] = pick(hash[key], wrapper[key]);
		});

		wrapper.attr({
			d: wrapper.renderer.symbols[wrapper.symbolName](
				wrapper.x,
				wrapper.y,
				wrapper.width,
				wrapper.height,
				wrapper
			)
		});
	},

	/**
	 * Apply a clipping path to this object
	 * @param {String} id
	 */
	clip: function (clipRect) {
		return this.attr('clip-path', clipRect ? 'url(' + this.renderer.url + '#' + clipRect.id + ')' : NONE);
	},

	/**
	 * Calculate the coordinates needed for drawing a rectangle crisply and return the
	 * calculated attributes
	 * @param {Number} strokeWidth
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	crisp: function (rect) {

		var wrapper = this,
			key,
			attribs = {},
			normalizer,
			strokeWidth = rect.strokeWidth || wrapper.strokeWidth || 0;

		normalizer = mathRound(strokeWidth) % 2 / 2; // mathRound because strokeWidth can sometimes have roundoff errors

		// normalize for crisp edges
		rect.x = mathFloor(rect.x || wrapper.x || 0) + normalizer;
		rect.y = mathFloor(rect.y || wrapper.y || 0) + normalizer;
		rect.width = mathFloor((rect.width || wrapper.width || 0) - 2 * normalizer);
		rect.height = mathFloor((rect.height || wrapper.height || 0) - 2 * normalizer);
		rect.strokeWidth = strokeWidth;

		for (key in rect) {
			if (wrapper[key] !== rect[key]) { // only set attribute if changed
				wrapper[key] = attribs[key] = rect[key];
			}
		}

		return attribs;
	},

	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: function (styles) {
		var elemWrapper = this,
			oldStyles = elemWrapper.styles,
			newStyles = {},
			elem = elemWrapper.element,
			textWidth,
			n,
			serializedCss = '',
			hyphenate,
			hasNew = !oldStyles;

		// convert legacy
		if (styles && styles.color) {
			styles.fill = styles.color;
		}

		// Filter out existing styles to increase performance (#2640)
		if (oldStyles) {
			for (n in styles) {
				if (styles[n] !== oldStyles[n]) {
					newStyles[n] = styles[n];
					hasNew = true;
				}
			}
		}
		if (hasNew) {
			textWidth = elemWrapper.textWidth = 
				(styles && styles.width && elem.nodeName.toLowerCase() === 'text' && pInt(styles.width)) || 
				elemWrapper.textWidth; // #3501

			// Merge the new styles with the old ones
			if (oldStyles) {
				styles = extend(
					oldStyles,
					newStyles
				);
			}		

			// store object
			elemWrapper.styles = styles;

			if (textWidth && (useCanVG || (!hasSVG && elemWrapper.renderer.forExport))) {
				delete styles.width;
			}

			// serialize and set style attribute
			if (isIE && !hasSVG) {
				css(elemWrapper.element, styles);
			} else {
				/*jslint unparam: true*/
				hyphenate = function (a, b) { return '-' + b.toLowerCase(); };
				/*jslint unparam: false*/
				for (n in styles) {
					serializedCss += n.replace(/([A-Z])/g, hyphenate) + ':' + styles[n] + ';';
				}
				attr(elem, 'style', serializedCss); // #1881
			}


			// re-build text
			if (textWidth && elemWrapper.added) {
				elemWrapper.renderer.buildText(elemWrapper);
			}
		}

		return elemWrapper;
	},

	/**
	 * Add an event listener
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function (eventType, handler) {
		var svgElement = this,
			element = svgElement.element;
		
		// touch
		if (hasTouch && eventType === 'click') {
			element.ontouchstart = function (e) {			
				svgElement.touchEventFired = Date.now();				
				e.preventDefault();
				handler.call(element, e);
			};
			element.onclick = function (e) {												
				if (userAgent.indexOf('Android') === -1 || Date.now() - (svgElement.touchEventFired || 0) > 1100) { // #2269
					handler.call(element, e);
				}
			};			
		} else {
			// simplest possible event model for internal use
			element['on' + eventType] = handler;
		}
		return this;
	},

	/**
	 * Set the coordinates needed to draw a consistent radial gradient across
	 * pie slices regardless of positioning inside the chart. The format is
	 * [centerX, centerY, diameter] in pixels.
	 */
	setRadialReference: function (coordinates) {
		this.element.radialReference = coordinates;
		return this;
	},

	/**
	 * Move an object and its children by x and y values
	 * @param {Number} x
	 * @param {Number} y
	 */
	translate: function (x, y) {
		return this.attr({
			translateX: x,
			translateY: y
		});
	},

	/**
	 * Invert a group, rotate and flip
	 */
	invert: function () {
		var wrapper = this;
		wrapper.inverted = true;
		wrapper.updateTransform();
		return wrapper;
	},

	/**
	 * Private method to update the transform attribute based on internal
	 * properties
	 */
	updateTransform: function () {
		var wrapper = this,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			scaleX = wrapper.scaleX,
			scaleY = wrapper.scaleY,
			inverted = wrapper.inverted,
			rotation = wrapper.rotation,
			element = wrapper.element,
			transform;

		// flipping affects translate as adjustment for flipping around the group's axis
		if (inverted) {
			translateX += wrapper.attr('width');
			translateY += wrapper.attr('height');
		}

		// Apply translate. Nearly all transformed elements have translation, so instead
		// of checking for translate = 0, do it always (#1767, #1846).
		transform = ['translate(' + translateX + ',' + translateY + ')'];

		// apply rotation
		if (inverted) {
			transform.push('rotate(90) scale(-1,1)');
		} else if (rotation) { // text rotation
			transform.push('rotate(' + rotation + ' ' + (element.getAttribute('x') || 0) + ' ' + (element.getAttribute('y') || 0) + ')');
			
			// Delete bBox memo when the rotation changes
			//delete wrapper.bBox;
		}

		// apply scale
		if (defined(scaleX) || defined(scaleY)) {
			transform.push('scale(' + pick(scaleX, 1) + ' ' + pick(scaleY, 1) + ')');
		}

		if (transform.length) {
			element.setAttribute('transform', transform.join(' '));
		}
	},
	/**
	 * Bring the element to the front
	 */
	toFront: function () {
		var element = this.element;
		element.parentNode.appendChild(element);
		return this;
	},


	/**
	 * Break down alignment options like align, verticalAlign, x and y
	 * to x and y relative to the chart.
	 *
	 * @param {Object} alignOptions
	 * @param {Boolean} alignByTranslate
	 * @param {String[Object} box The box to align to, needs a width and height. When the
	 *		box is a string, it refers to an object in the Renderer. For example, when
	 *		box is 'spacingBox', it refers to Renderer.spacingBox which holds width, height
	 *		x and y properties.
	 *
	 */
	align: function (alignOptions, alignByTranslate, box) {
		var align,
			vAlign,
			x,
			y,
			attribs = {},
			alignTo,
			renderer = this.renderer,
			alignedObjects = renderer.alignedObjects;

		// First call on instanciate
		if (alignOptions) {
			this.alignOptions = alignOptions;
			this.alignByTranslate = alignByTranslate;
			if (!box || isString(box)) { // boxes other than renderer handle this internally
				this.alignTo = alignTo = box || 'renderer';
				erase(alignedObjects, this); // prevent duplicates, like legendGroup after resize
				alignedObjects.push(this);
				box = null; // reassign it below
			}

		// When called on resize, no arguments are supplied
		} else {
			alignOptions = this.alignOptions;
			alignByTranslate = this.alignByTranslate;
			alignTo = this.alignTo;
		}

		box = pick(box, renderer[alignTo], renderer);

		// Assign variables
		align = alignOptions.align;
		vAlign = alignOptions.verticalAlign;
		x = (box.x || 0) + (alignOptions.x || 0); // default: left align
		y = (box.y || 0) + (alignOptions.y || 0); // default: top align

		// Align
		if (align === 'right' || align === 'center') {
			x += (box.width - (alignOptions.width || 0)) /
					{ right: 1, center: 2 }[align];
		}
		attribs[alignByTranslate ? 'translateX' : 'x'] = mathRound(x);


		// Vertical align
		if (vAlign === 'bottom' || vAlign === 'middle') {
			y += (box.height - (alignOptions.height || 0)) /
					({ bottom: 1, middle: 2 }[vAlign] || 1);

		}
		attribs[alignByTranslate ? 'translateY' : 'y'] = mathRound(y);

		// Animate only if already placed
		this[this.placed ? 'animate' : 'attr'](attribs);
		this.placed = true;
		this.alignAttr = attribs;

		return this;
	},

	/**
	 * Get the bounding box (width, height, x and y) for the element
	 */
	getBBox: function (reload) {
		var wrapper = this,
			bBox,// = wrapper.bBox,
			renderer = wrapper.renderer,
			width,
			height,
			rotation = wrapper.rotation,
			element = wrapper.element,
			styles = wrapper.styles,
			rad = rotation * deg2rad,
			textStr = wrapper.textStr,
			textShadow,
			elemStyle = element.style,
			toggleTextShadowShim,
			cacheKey;

		if (textStr !== UNDEFINED) {

			// Properties that affect bounding box
			cacheKey = ['', rotation || 0, styles && styles.fontSize, element.style.width].join(',');

			// Since numbers are monospaced, and numerical labels appear a lot in a chart,
			// we assume that a label of n characters has the same bounding box as others 
			// of the same length.
			if (textStr === '' || numRegex.test(textStr)) {
				cacheKey = 'num:' + textStr.toString().length + cacheKey;

			// Caching all strings reduces rendering time by 4-5%.
			} else {
				cacheKey = textStr + cacheKey;
			}
		}

		if (cacheKey && !reload) {
			bBox = renderer.cache[cacheKey];
		}

		// No cache found
		if (!bBox) {

			// SVG elements
			if (element.namespaceURI === SVG_NS || renderer.forExport) {
				try { // Fails in Firefox if the container has display: none.

					// When the text shadow shim is used, we need to hide the fake shadows
					// to get the correct bounding box (#3872)
					toggleTextShadowShim = this.fakeTS && function (display) {
						each(element.querySelectorAll('.' + PREFIX + 'text-shadow'), function (tspan) {
							tspan.style.display = display;
						});
					};

					// Workaround for #3842, Firefox reporting wrong bounding box for shadows
					if (isFirefox && elemStyle.textShadow) {
						textShadow = elemStyle.textShadow;
						elemStyle.textShadow = '';
					} else if (toggleTextShadowShim) {
						toggleTextShadowShim(NONE);
					}

					bBox = element.getBBox ?
						// SVG: use extend because IE9 is not allowed to change width and height in case
						// of rotation (below)
						extend({}, element.getBBox()) :
						// Canvas renderer and legacy IE in export mode
						{
							width: element.offsetWidth,
							height: element.offsetHeight
						};

					// #3842
					if (textShadow) {
						elemStyle.textShadow = textShadow;
					} else if (toggleTextShadowShim) {
						toggleTextShadowShim('');
					}
				} catch (e) {}

				// If the bBox is not set, the try-catch block above failed. The other condition
				// is for Opera that returns a width of -Infinity on hidden elements.
				if (!bBox || bBox.width < 0) {
					bBox = { width: 0, height: 0 };
				}


			// VML Renderer or useHTML within SVG
			} else {

				bBox = wrapper.htmlGetBBox();

			}

			// True SVG elements as well as HTML elements in modern browsers using the .useHTML option
			// need to compensated for rotation
			if (renderer.isSVG) {
				width = bBox.width;
				height = bBox.height;

				// Workaround for wrong bounding box in IE9 and IE10 (#1101, #1505, #1669, #2568)
				if (isIE && styles && styles.fontSize === '11px' && height.toPrecision(3) === '16.9') {
					bBox.height = height = 14;
				}

				// Adjust for rotated text
				if (rotation) {
					bBox.width = mathAbs(height * mathSin(rad)) + mathAbs(width * mathCos(rad));
					bBox.height = mathAbs(height * mathCos(rad)) + mathAbs(width * mathSin(rad));
				}
			}

			// Cache it
			if (cacheKey) {
				renderer.cache[cacheKey] = bBox;
			}
		}
		return bBox;
	},

	/**
	 * Show the element
	 */
	show: function (inherit) {
		// IE9-11 doesn't handle visibilty:inherit well, so we remove the attribute instead (#2881)
		if (inherit && this.element.namespaceURI === SVG_NS) {
			this.element.removeAttribute('visibility');
		} else {
			this.attr({ visibility: inherit ? 'inherit' : VISIBLE });
		}
		return this;
	},

	/**
	 * Hide the element
	 */
	hide: function () {
		return this.attr({ visibility: HIDDEN });
	},

	fadeOut: function (duration) {
		var elemWrapper = this;
		elemWrapper.animate({
			opacity: 0
		}, {
			duration: duration || 150,
			complete: function () {
				elemWrapper.attr({ y: -9999 }); // #3088, assuming we're only using this for tooltips
			}
		});
	},

	/**
	 * Add the element
	 * @param {Object|Undefined} parent Can be an element, an element wrapper or undefined
	 *	to append the element to the renderer.box.
	 */
	add: function (parent) {

		var renderer = this.renderer,
			element = this.element,
			inserted;

		if (parent) {
			this.parentGroup = parent;
		}

		// mark as inverted
		this.parentInverted = parent && parent.inverted;

		// build formatted text
		if (this.textStr !== undefined) {
			renderer.buildText(this);
		}

		// Mark as added
		this.added = true;

		// If we're adding to renderer root, or other elements in the group 
		// have a z index, we need to handle it
		if (!parent || parent.handleZ || this.zIndex) {
			inserted = this.zIndexSetter();
		}

		// If zIndex is not handled, append at the end
		if (!inserted) {
			(parent ? parent.element : renderer.box).appendChild(element);
		}

		// fire an event for internal hooks
		if (this.onAdd) {
			this.onAdd();
		}

		return this;
	},

	/**
	 * Removes a child either by removeChild or move to garbageBin.
	 * Issue 490; in VML removeChild results in Orphaned nodes according to sIEve, discardElement does not.
	 */
	safeRemoveChild: function (element) {
		var parentNode = element.parentNode;
		if (parentNode) {
			parentNode.removeChild(element);
		}
	},

	/**
	 * Destroy the element and element wrapper
	 */
	destroy: function () {
		var wrapper = this,
			element = wrapper.element || {},
			shadows = wrapper.shadows,
			parentToClean = wrapper.renderer.isSVG && element.nodeName === 'SPAN' && wrapper.parentGroup,
			grandParent,
			key,
			i;

		// remove events
		element.onclick = element.onmouseout = element.onmouseover = element.onmousemove = element.point = null;
		stop(wrapper); // stop running animations

		if (wrapper.clipPath) {
			wrapper.clipPath = wrapper.clipPath.destroy();
		}

		// Destroy stops in case this is a gradient object
		if (wrapper.stops) {
			for (i = 0; i < wrapper.stops.length; i++) {
				wrapper.stops[i] = wrapper.stops[i].destroy();
			}
			wrapper.stops = null;
		}

		// remove element
		wrapper.safeRemoveChild(element);

		// destroy shadows
		if (shadows) {
			each(shadows, function (shadow) {
				wrapper.safeRemoveChild(shadow);
			});
		}

		// In case of useHTML, clean up empty containers emulating SVG groups (#1960, #2393, #2697).
		while (parentToClean && parentToClean.div && parentToClean.div.childNodes.length === 0) {
			grandParent = parentToClean.parentGroup;
			wrapper.safeRemoveChild(parentToClean.div);
			delete parentToClean.div;
			parentToClean = grandParent;
		}

		// remove from alignObjects
		if (wrapper.alignTo) {
			erase(wrapper.renderer.alignedObjects, wrapper);
		}

		for (key in wrapper) {
			delete wrapper[key];
		}

		return null;
	},

	/**
	 * Add a shadow to the element. Must be done after the element is added to the DOM
	 * @param {Boolean|Object} shadowOptions
	 */
	shadow: function (shadowOptions, group, cutOff) {
		var shadows = [],
			i,
			shadow,
			element = this.element,
			strokeWidth,
			shadowWidth,
			shadowElementOpacity,

			// compensate for inverted plot area
			transform;


		if (shadowOptions) {
			shadowWidth = pick(shadowOptions.width, 3);
			shadowElementOpacity = (shadowOptions.opacity || 0.15) / shadowWidth;
			transform = this.parentInverted ?
				'(-1,-1)' :
				'(' + pick(shadowOptions.offsetX, 1) + ', ' + pick(shadowOptions.offsetY, 1) + ')';
			for (i = 1; i <= shadowWidth; i++) {
				shadow = element.cloneNode(0);
				strokeWidth = (shadowWidth * 2) + 1 - (2 * i);
				attr(shadow, {
					'isShadow': 'true',
					'stroke': shadowOptions.color || 'black',
					'stroke-opacity': shadowElementOpacity * i,
					'stroke-width': strokeWidth,
					'transform': 'translate' + transform,
					'fill': NONE
				});
				if (cutOff) {
					attr(shadow, 'height', mathMax(attr(shadow, 'height') - strokeWidth, 0));
					shadow.cutHeight = strokeWidth;
				}

				if (group) {
					group.element.appendChild(shadow);
				} else {
					element.parentNode.insertBefore(shadow, element);
				}

				shadows.push(shadow);
			}

			this.shadows = shadows;
		}
		return this;

	},

	xGetter: function (key) {
		if (this.element.nodeName === 'circle') {
			key = { x: 'cx', y: 'cy' }[key] || key;
		}
		return this._defaultGetter(key);
	},

	/** 
	 * Get the current value of an attribute or pseudo attribute, used mainly
	 * for animation.
	 */
	_defaultGetter: function (key) {
		var ret = pick(this[key], this.element ? this.element.getAttribute(key) : null, 0);

		if (/^[\-0-9\.]+$/.test(ret)) { // is numerical
			ret = parseFloat(ret);
		}
		return ret;
	},


	dSetter: function (value, key, element) {
		if (value && value.join) { // join path
			value = value.join(' ');
		}
		if (/(NaN| {2}|^$)/.test(value)) {
			value = 'M 0 0';
		}
		element.setAttribute(key, value);

		this[key] = value;
	},
	dashstyleSetter: function (value) {
		var i;
		value = value && value.toLowerCase();
		if (value) {
			value = value
				.replace('shortdashdotdot', '3,1,1,1,1,1,')
				.replace('shortdashdot', '3,1,1,1')
				.replace('shortdot', '1,1,')
				.replace('shortdash', '3,1,')
				.replace('longdash', '8,3,')
				.replace(/dot/g, '1,3,')
				.replace('dash', '4,3,')
				.replace(/,$/, '')
				.split(','); // ending comma

			i = value.length;
			while (i--) {
				value[i] = pInt(value[i]) * this['stroke-width'];
			}
			value = value.join(',')
				.replace('NaN', 'none'); // #3226
			this.element.setAttribute('stroke-dasharray', value);
		}
	},
	alignSetter: function (value) {
		this.element.setAttribute('text-anchor', { left: 'start', center: 'middle', right: 'end' }[value]);
	},
	opacitySetter: function (value, key, element) {
		this[key] = value;
		element.setAttribute(key, value);
	},
	titleSetter: function (value) {
		var titleNode = this.element.getElementsByTagName('title')[0];
		if (!titleNode) {
			titleNode = doc.createElementNS(SVG_NS, 'title');
			this.element.appendChild(titleNode);
		}
		titleNode.appendChild(
			doc.createTextNode(
				(String(pick(value), '')).replace(/<[^>]*>/g, '') // #3276, #3895
			)
		);
	},
	textSetter: function (value) {
		if (value !== this.textStr) {
			// Delete bBox memo when the text changes
			delete this.bBox;
		
			this.textStr = value;
			if (this.added) {
				this.renderer.buildText(this);
			}
		}
	},
	fillSetter: function (value, key, element) {
		if (typeof value === 'string') {
			element.setAttribute(key, value);
		} else if (value) {
			this.colorGradient(value, key, element);
		}
	},
	zIndexSetter: function (value, key) {
		var renderer = this.renderer,
			parentGroup = this.parentGroup,
			parentWrapper = parentGroup || renderer,
			parentNode = parentWrapper.element || renderer.box,
			childNodes,
			otherElement,
			otherZIndex,
			element = this.element,
			inserted,
			run = this.added,
			i;
		
		if (defined(value)) {
			element.setAttribute(key, value); // So we can read it for other elements in the group
			value = +value;
			if (this[key] === value) { // Only update when needed (#3865)
				run = false;
			}
			this[key] = value;
		}

		// Insert according to this and other elements' zIndex. Before .add() is called,
		// nothing is done. Then on add, or by later calls to zIndexSetter, the node
		// is placed on the right place in the DOM.
		if (run) {
			value = this.zIndex;

			if (value && parentGroup) {
				parentGroup.handleZ = true;
			}
		
			childNodes = parentNode.childNodes;
			for (i = 0; i < childNodes.length && !inserted; i++) {
				otherElement = childNodes[i];
				otherZIndex = attr(otherElement, 'zIndex');
				if (otherElement !== element && (
						// Insert before the first element with a higher zIndex
						pInt(otherZIndex) > value ||
						// If no zIndex given, insert before the first element with a zIndex
						(!defined(value) && defined(otherZIndex))

						)) {
					parentNode.insertBefore(element, otherElement);
					inserted = true;
				}
			}
			if (!inserted) {
				parentNode.appendChild(element);
			}
		}
		return inserted;
	},
	_defaultSetter: function (value, key, element) {
		element.setAttribute(key, value);
	}
};

// Some shared setters and getters
SVGElement.prototype.yGetter = SVGElement.prototype.xGetter;
SVGElement.prototype.translateXSetter = SVGElement.prototype.translateYSetter = 
		SVGElement.prototype.rotationSetter = SVGElement.prototype.verticalAlignSetter = 
		SVGElement.prototype.scaleXSetter = SVGElement.prototype.scaleYSetter = function (value, key) {
	this[key] = value;
	this.doTransform = true;
};

// WebKit and Batik have problems with a stroke-width of zero, so in this case we remove the 
// stroke attribute altogether. #1270, #1369, #3065, #3072.
SVGElement.prototype['stroke-widthSetter'] = SVGElement.prototype.strokeSetter = function (value, key, element) {
	this[key] = value;
	// Only apply the stroke attribute if the stroke width is defined and larger than 0
	if (this.stroke && this['stroke-width']) {
		this.strokeWidth = this['stroke-width'];
		SVGElement.prototype.fillSetter.call(this, this.stroke, 'stroke', element); // use prototype as instance may be overridden
		element.setAttribute('stroke-width', this['stroke-width']);
		this.hasStroke = true;
	} else if (key === 'stroke-width' && value === 0 && this.hasStroke) {
		element.removeAttribute('stroke');
		this.hasStroke = false;
	}
};


/**
 * The default SVG renderer
 */
var SVGRenderer = function () {
	this.init.apply(this, arguments);
};
SVGRenderer.prototype = {
	Element: SVGElement,

	/**
	 * Initialize the SVGRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Boolean} forExport
	 */
	init: function (container, width, height, style, forExport) {
		var renderer = this,
			loc = location,
			boxWrapper,
			element,
			desc;

		boxWrapper = renderer.createElement('svg')
			.attr({
				version: '1.1'
			})
			.css(this.getStyle(style));
		element = boxWrapper.element;
		container.appendChild(element);

		// For browsers other than IE, add the namespace attribute (#1978)
		if (container.innerHTML.indexOf('xmlns') === -1) {
			attr(element, 'xmlns', SVG_NS);
		}

		// object properties
		renderer.isSVG = true;
		renderer.box = element;
		renderer.boxWrapper = boxWrapper;
		renderer.alignedObjects = [];

		// Page url used for internal references. #24, #672, #1070
		renderer.url = (isFirefox || isWebKit) && doc.getElementsByTagName('base').length ?
			loc.href
				.replace(/#.*?$/, '') // remove the hash
				.replace(/([\('\)])/g, '\\$1') // escape parantheses and quotes
				.replace(/ /g, '%20') : // replace spaces (needed for Safari only)
			'';

		// Add description
		desc = this.createElement('desc').add();
		desc.element.appendChild(doc.createTextNode('Created with ' + PRODUCT + ' ' + VERSION));


		//renderer.defs = this.createElement('defs').add();
		renderer.forExport = forExport;
		renderer.gradients = {}; // Object where gradient SvgElements are stored
		renderer.cache = {}; // Cache for numerical bounding boxes

		renderer.setSize(width, height, false);



		// Issue 110 workaround:
		// In Firefox, if a div is positioned by percentage, its pixel position may land
		// between pixels. The container itself doesn't display this, but an SVG element
		// inside this container will be drawn at subpixel precision. In order to draw
		// sharp lines, this must be compensated for. This doesn't seem to work inside
		// iframes though (like in jsFiddle).
		var subPixelFix, rect;
		if (isFirefox && container.getBoundingClientRect) {
			renderer.subPixelFix = subPixelFix = function () {
				css(container, { left: 0, top: 0 });
				rect = container.getBoundingClientRect();
				css(container, {
					left: (mathCeil(rect.left) - rect.left) + PX,
					top: (mathCeil(rect.top) - rect.top) + PX
				});
			};

			// run the fix now
			subPixelFix();

			// run it on resize
			addEvent(win, 'resize', subPixelFix);
		}
	},

	getStyle: function (style) {
		return (this.style = extend({
			fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif', // default font
			fontSize: '12px'
		}, style));
	},

	/**
	 * Detect whether the renderer is hidden. This happens when one of the parent elements
	 * has display: none. #608.
	 */
	isHidden: function () {
		return !this.boxWrapper.getBBox().width;
	},

	/**
	 * Destroys the renderer and its allocated members.
	 */
	destroy: function () {
		var renderer = this,
			rendererDefs = renderer.defs;
		renderer.box = null;
		renderer.boxWrapper = renderer.boxWrapper.destroy();

		// Call destroy on all gradient elements
		destroyObjectProperties(renderer.gradients || {});
		renderer.gradients = null;

		// Defs are null in VMLRenderer
		// Otherwise, destroy them here.
		if (rendererDefs) {
			renderer.defs = rendererDefs.destroy();
		}

		// Remove sub pixel fix handler
		// We need to check that there is a handler, otherwise all functions that are registered for event 'resize' are removed
		// See issue #982
		if (renderer.subPixelFix) {
			removeEvent(win, 'resize', renderer.subPixelFix);
		}

		renderer.alignedObjects = null;

		return null;
	},

	/**
	 * Create a wrapper for an SVG element
	 * @param {Object} nodeName
	 */
	createElement: function (nodeName) {
		var wrapper = new this.Element();
		wrapper.init(this, nodeName);
		return wrapper;
	},

	/**
	 * Dummy function for use in canvas renderer
	 */
	draw: function () {},

	/**
	 * Parse a simple HTML string into SVG tspans
	 *
	 * @param {Object} textNode The parent text SVG node
	 */
	buildText: function (wrapper) {
		var textNode = wrapper.element,
			renderer = this,
			forExport = renderer.forExport,
			textStr = pick(wrapper.textStr, '').toString(),
			hasMarkup = textStr.indexOf('<') !== -1,
			lines,
			childNodes = textNode.childNodes,
			styleRegex,
			hrefRegex,
			parentX = attr(textNode, 'x'),
			textStyles = wrapper.styles,
			width = wrapper.textWidth,
			textLineHeight = textStyles && textStyles.lineHeight,
			textShadow = textStyles && textStyles.textShadow,
			ellipsis = textStyles && textStyles.textOverflow === 'ellipsis',
			i = childNodes.length,
			tempParent = width && !wrapper.added && this.box,
			getLineHeight = function (tspan) {
				return textLineHeight ? 
					pInt(textLineHeight) :
					renderer.fontMetrics(
						/(px|em)$/.test(tspan && tspan.style.fontSize) ?
							tspan.style.fontSize :
							((textStyles && textStyles.fontSize) || renderer.style.fontSize || 12),
						tspan
					).h;
			},
			unescapeAngleBrackets = function (inputStr) {
				return inputStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
			};

		/// remove old text
		while (i--) {
			textNode.removeChild(childNodes[i]);
		}

		// Skip tspans, add text directly to text node. The forceTSpan is a hook 
		// used in text outline hack.
		if (!hasMarkup && !textShadow && !ellipsis && textStr.indexOf(' ') === -1) {
			textNode.appendChild(doc.createTextNode(unescapeAngleBrackets(textStr)));
			return;

		// Complex strings, add more logic
		} else {

			styleRegex = /<.*style="([^"]+)".*>/;
			hrefRegex = /<.*href="(http[^"]+)".*>/;

			if (tempParent) {
				tempParent.appendChild(textNode); // attach it to the DOM to read offset width
			}

			if (hasMarkup) {
				lines = textStr
					.replace(/<(b|strong)>/g, '<span style="font-weight:bold">')
					.replace(/<(i|em)>/g, '<span style="font-style:italic">')
					.replace(/<a/g, '<span')
					.replace(/<\/(b|strong|i|em|a)>/g, '</span>')
					.split(/<br.*?>/g);

			} else {
				lines = [textStr];
			}


			// remove empty line at end
			if (lines[lines.length - 1] === '') {
				lines.pop();
			}

			
			// build the lines
			each(lines, function (line, lineNo) {
				var spans, spanNo = 0;

				line = line.replace(/<span/g, '|||<span').replace(/<\/span>/g, '</span>|||');
				spans = line.split('|||');

				each(spans, function (span) {
					if (span !== '' || spans.length === 1) {
						var attributes = {},
							tspan = doc.createElementNS(SVG_NS, 'tspan'),
							spanStyle; // #390
						if (styleRegex.test(span)) {
							spanStyle = span.match(styleRegex)[1].replace(/(;| |^)color([ :])/, '$1fill$2');
							attr(tspan, 'style', spanStyle);
						}
						if (hrefRegex.test(span) && !forExport) { // Not for export - #1529
							attr(tspan, 'onclick', 'location.href=\"' + span.match(hrefRegex)[1] + '\"');
							css(tspan, { cursor: 'pointer' });
						}

						span = unescapeAngleBrackets(span.replace(/<(.|\n)*?>/g, '') || ' ');

						// Nested tags aren't supported, and cause crash in Safari (#1596)
						if (span !== ' ') {

							// add the text node
							tspan.appendChild(doc.createTextNode(span));

							if (!spanNo) { // first span in a line, align it to the left
								if (lineNo && parentX !== null) {
									attributes.x = parentX;
								}
							} else {
								attributes.dx = 0; // #16
							}

							// add attributes
							attr(tspan, attributes);

							// Append it
							textNode.appendChild(tspan);

							// first span on subsequent line, add the line height
							if (!spanNo && lineNo) {

								// allow getting the right offset height in exporting in IE
								if (!hasSVG && forExport) {
									css(tspan, { display: 'block' });
								}

								// Set the line height based on the font size of either
								// the text element or the tspan element
								attr(
									tspan,
									'dy',
									getLineHeight(tspan)
								);
							}

							/*if (width) {
								renderer.breakText(wrapper, width);
							}*/

							// Check width and apply soft breaks or ellipsis
							if (width) {
								var words = span.replace(/([^\^])-/g, '$1- ').split(' '), // #1273
									hasWhiteSpace = spans.length > 1 || lineNo || (words.length > 1 && textStyles.whiteSpace !== 'nowrap'),
									tooLong,
									wasTooLong,
									actualWidth,
									rest = [],
									dy = getLineHeight(tspan),
									softLineNo = 1,
									rotation = wrapper.rotation,
									wordStr = span, // for ellipsis
									cursor = wordStr.length, // binary search cursor
									bBox;

								while ((hasWhiteSpace || ellipsis) && (words.length || rest.length)) {
									wrapper.rotation = 0; // discard rotation when computing box
									bBox = wrapper.getBBox(true);
									actualWidth = bBox.width;

									// Old IE cannot measure the actualWidth for SVG elements (#2314)
									if (!hasSVG && renderer.forExport) {
										actualWidth = renderer.measureSpanWidth(tspan.firstChild.data, wrapper.styles);
									}

									tooLong = actualWidth > width;

									// For ellipsis, do a binary search for the correct string length
									if (wasTooLong === undefined) {
										wasTooLong = tooLong; // First time
									}
									if (ellipsis && wasTooLong) {
										cursor /= 2;

										if (wordStr === '' || (!tooLong && cursor < 0.5)) {
											words = []; // All ok, break out
										} else {
											if (tooLong) {
												wasTooLong = true;
											}
											wordStr = span.substring(0, wordStr.length + (tooLong ? -1 : 1) * mathCeil(cursor));
											words = [wordStr + (width > 3 ? '\u2026' : '')];
											tspan.removeChild(tspan.firstChild);
										}

									// Looping down, this is the first word sequence that is not too long,
									// so we can move on to build the next line.
									} else if (!tooLong || words.length === 1) {
										words = rest;
										rest = [];
												
										if (words.length) {
											softLineNo++;
											
											tspan = doc.createElementNS(SVG_NS, 'tspan');
											attr(tspan, {
												dy: dy,
												x: parentX
											});
											if (spanStyle) { // #390
												attr(tspan, 'style', spanStyle);
											}
											textNode.appendChild(tspan);
										}
										if (actualWidth > width) { // a single word is pressing it out
											width = actualWidth;
										}
									} else { // append to existing line tspan
										tspan.removeChild(tspan.firstChild);
										rest.unshift(words.pop());
									}
									if (words.length) {
										tspan.appendChild(doc.createTextNode(words.join(' ').replace(/- /g, '-')));
									}
								}
								if (wasTooLong) {
									wrapper.attr('title', wrapper.textStr);
								}
								wrapper.rotation = rotation;
							}

							spanNo++;
						}
					}
				});
			});
			if (tempParent) {
				tempParent.removeChild(textNode); // attach it to the DOM to read offset width
			}

			// Apply the text shadow
			if (textShadow && wrapper.applyTextShadow) {
				wrapper.applyTextShadow(textShadow);
			}
		}
	},

	

	/*
	breakText: function (wrapper, width) {
		var bBox = wrapper.getBBox(),
			node = wrapper.element,
			textLength = node.textContent.length,
			pos = mathRound(width * textLength / bBox.width), // try this position first, based on average character width
			increment = 0,
			finalPos;

		if (bBox.width > width) {
			while (finalPos === undefined) {
				textLength = node.getSubStringLength(0, pos);

				if (textLength <= width) {
					if (increment === -1) {
						finalPos = pos;
					} else {
						increment = 1;
					}
				} else {
					if (increment === 1) {
						finalPos = pos - 1;
					} else {
						increment = -1;
					}
				}
				pos += increment;
			}
		}
		console.log(finalPos, node.getSubStringLength(0, finalPos))
	},
	*/

	/** 
	 * Returns white for dark colors and black for bright colors
	 */
	getContrast: function (color) {
		color = Color(color).rgba;
		return color[0] + color[1] + color[2] > 384 ? '#000000' : '#FFFFFF';
	},

	/**
	 * Create a button with preset states
	 * @param {String} text
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Function} callback
	 * @param {Object} normalState
	 * @param {Object} hoverState
	 * @param {Object} pressedState
	 */
	button: function (text, x, y, callback, normalState, hoverState, pressedState, disabledState, shape) {
		var label = this.label(text, x, y, shape, null, null, null, null, 'button'),
			curState = 0,
			stateOptions,
			stateStyle,
			normalStyle,
			hoverStyle,
			pressedStyle,
			disabledStyle,
			verticalGradient = { x1: 0, y1: 0, x2: 0, y2: 1 };

		// Normal state - prepare the attributes
		normalState = merge({
			'stroke-width': 1,
			stroke: '#CCCCCC',
			fill: {
				linearGradient: verticalGradient,
				stops: [
					[0, '#FEFEFE'],
					[1, '#F6F6F6']
				]
			},
			r: 2,
			padding: 5,
			style: {
				color: 'black'
			}
		}, normalState);
		normalStyle = normalState.style;
		delete normalState.style;

		// Hover state
		hoverState = merge(normalState, {
			stroke: '#68A',
			fill: {
				linearGradient: verticalGradient,
				stops: [
					[0, '#FFF'],
					[1, '#ACF']
				]
			}
		}, hoverState);
		hoverStyle = hoverState.style;
		delete hoverState.style;

		// Pressed state
		pressedState = merge(normalState, {
			stroke: '#68A',
			fill: {
				linearGradient: verticalGradient,
				stops: [
					[0, '#9BD'],
					[1, '#CDF']
				]
			}
		}, pressedState);
		pressedStyle = pressedState.style;
		delete pressedState.style;

		// Disabled state
		disabledState = merge(normalState, {
			style: {
				color: '#CCC'
			}
		}, disabledState);
		disabledStyle = disabledState.style;
		delete disabledState.style;

		// Add the events. IE9 and IE10 need mouseover and mouseout to funciton (#667).
		addEvent(label.element, isIE ? 'mouseover' : 'mouseenter', function () {
			if (curState !== 3) {
				label.attr(hoverState)
					.css(hoverStyle);
			}
		});
		addEvent(label.element, isIE ? 'mouseout' : 'mouseleave', function () {
			if (curState !== 3) {
				stateOptions = [normalState, hoverState, pressedState][curState];
				stateStyle = [normalStyle, hoverStyle, pressedStyle][curState];
				label.attr(stateOptions)
					.css(stateStyle);
			}
		});

		label.setState = function (state) {
			label.state = curState = state;
			if (!state) {
				label.attr(normalState)
					.css(normalStyle);
			} else if (state === 2) {
				label.attr(pressedState)
					.css(pressedStyle);
			} else if (state === 3) {
				label.attr(disabledState)
					.css(disabledStyle);
			}
		};

		return label
			.on('click', function () {
				if (curState !== 3) {
					callback.call(label);
				}
			})
			.attr(normalState)
			.css(extend({ cursor: 'default' }, normalStyle));
	},

	/**
	 * Make a straight line crisper by not spilling out to neighbour pixels
	 * @param {Array} points
	 * @param {Number} width
	 */
	crispLine: function (points, width) {
		// points format: [M, 0, 0, L, 100, 0]
		// normalize to a crisp line
		if (points[1] === points[4]) {
			// Substract due to #1129. Now bottom and left axis gridlines behave the same.
			points[1] = points[4] = mathRound(points[1]) - (width % 2 / 2);
		}
		if (points[2] === points[5]) {
			points[2] = points[5] = mathRound(points[2]) + (width % 2 / 2);
		}
		return points;
	},


	/**
	 * Draw a path
	 * @param {Array} path An SVG path in array form
	 */
	path: function (path) {
		var attr = {
			fill: NONE
		};
		if (isArray(path)) {
			attr.d = path;
		} else if (isObject(path)) { // attributes
			extend(attr, path);
		}
		return this.createElement('path').attr(attr);
	},

	/**
	 * Draw and return an SVG circle
	 * @param {Number} x The x position
	 * @param {Number} y The y position
	 * @param {Number} r The radius
	 */
	circle: function (x, y, r) {
		var attr = isObject(x) ?
			x :
			{
				x: x,
				y: y,
				r: r
			},
			wrapper = this.createElement('circle');

		wrapper.xSetter = function (value) {
			this.element.setAttribute('cx', value);
		};
		wrapper.ySetter = function (value) {
			this.element.setAttribute('cy', value);
		};
		return wrapper.attr(attr);
	},

	/**
	 * Draw and return an arc
	 * @param {Number} x X position
	 * @param {Number} y Y position
	 * @param {Number} r Radius
	 * @param {Number} innerR Inner radius like used in donut charts
	 * @param {Number} start Starting angle
	 * @param {Number} end Ending angle
	 */
	arc: function (x, y, r, innerR, start, end) {
		var arc;

		if (isObject(x)) {
			y = x.y;
			r = x.r;
			innerR = x.innerR;
			start = x.start;
			end = x.end;
			x = x.x;
		}

		// Arcs are defined as symbols for the ability to set
		// attributes in attr and animate
		arc = this.symbol('arc', x || 0, y || 0, r || 0, r || 0, {
			innerR: innerR || 0,
			start: start || 0,
			end: end || 0
		});
		arc.r = r; // #959
		return arc;
	},

	/**
	 * Draw and return a rectangle
	 * @param {Number} x Left position
	 * @param {Number} y Top position
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Number} r Border corner radius
	 * @param {Number} strokeWidth A stroke width can be supplied to allow crisp drawing
	 */
	rect: function (x, y, width, height, r, strokeWidth) {

		r = isObject(x) ? x.r : r;

		var wrapper = this.createElement('rect'),
			attribs = isObject(x) ? x : x === UNDEFINED ? {} : {
				x: x,
				y: y,
				width: mathMax(width, 0),
				height: mathMax(height, 0)
			};

		if (strokeWidth !== UNDEFINED) {
			attribs.strokeWidth = strokeWidth;
			attribs = wrapper.crisp(attribs);
		}

		if (r) {
			attribs.r = r;
		}

		wrapper.rSetter = function (value) {
			attr(this.element, {
				rx: value,
				ry: value
			});
		};
		
		return wrapper.attr(attribs);
	},

	/**
	 * Resize the box and re-align all aligned elements
	 * @param {Object} width
	 * @param {Object} height
	 * @param {Boolean} animate
	 *
	 */
	setSize: function (width, height, animate) {
		var renderer = this,
			alignedObjects = renderer.alignedObjects,
			i = alignedObjects.length;

		renderer.width = width;
		renderer.height = height;

		renderer.boxWrapper[pick(animate, true) ? 'animate' : 'attr']({
			width: width,
			height: height
		});

		while (i--) {
			alignedObjects[i].align();
		}
	},

	/**
	 * Create a group
	 * @param {String} name The group will be given a class name of 'highcharts-{name}'.
	 *	 This can be used for styling and scripting.
	 */
	g: function (name) {
		var elem = this.createElement('g');
		return defined(name) ? elem.attr({ 'class': PREFIX + name }) : elem;
	},

	/**
	 * Display an image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function (src, x, y, width, height) {
		var attribs = {
				preserveAspectRatio: NONE
			},
			elemWrapper;

		// optional properties
		if (arguments.length > 1) {
			extend(attribs, {
				x: x,
				y: y,
				width: width,
				height: height
			});
		}

		elemWrapper = this.createElement('image').attr(attribs);

		// set the href in the xlink namespace
		if (elemWrapper.element.setAttributeNS) {
			elemWrapper.element.setAttributeNS('http://www.w3.org/1999/xlink',
				'href', src);
		} else {
			// could be exporting in IE
			// using href throws "not supported" in ie7 and under, requries regex shim to fix later
			elemWrapper.element.setAttribute('hc-svg-href', src);
		}
		return elemWrapper;
	},

	/**
	 * Draw a symbol out of pre-defined shape paths from the namespace 'symbol' object.
	 *
	 * @param {Object} symbol
	 * @param {Object} x
	 * @param {Object} y
	 * @param {Object} radius
	 * @param {Object} options
	 */
	symbol: function (symbol, x, y, width, height, options) {

		var obj,

			// get the symbol definition function
			symbolFn = this.symbols[symbol],

			// check if there's a path defined for this symbol
			path = symbolFn && symbolFn(
				mathRound(x),
				mathRound(y),
				width,
				height,
				options
			),

			imageElement,
			imageRegex = /^url\((.*?)\)$/,
			imageSrc,
			imageSize,
			centerImage;

		if (path) {

			obj = this.path(path);
			// expando properties for use in animate and attr
			extend(obj, {
				symbolName: symbol,
				x: x,
				y: y,
				width: width,
				height: height
			});
			if (options) {
				extend(obj, options);
			}


		// image symbols
		} else if (imageRegex.test(symbol)) {

			// On image load, set the size and position
			centerImage = function (img, size) {
				if (img.element) { // it may be destroyed in the meantime (#1390)
					img.attr({
						width: size[0],
						height: size[1]
					});

					if (!img.alignByTranslate) { // #185
						img.translate(
							mathRound((width - size[0]) / 2), // #1378
							mathRound((height - size[1]) / 2)
						);
					}
				}
			};

			imageSrc = symbol.match(imageRegex)[1];
			imageSize = symbolSizes[imageSrc] || (options && options.width && options.height && [options.width, options.height]);

			// Ireate the image synchronously, add attribs async
			obj = this.image(imageSrc)
				.attr({
					x: x,
					y: y
				});
			obj.isImg = true;

			if (imageSize) {
				centerImage(obj, imageSize);
			} else {
				// Initialize image to be 0 size so export will still function if there's no cached sizes.
				obj.attr({ width: 0, height: 0 });

				// Create a dummy JavaScript image to get the width and height. Due to a bug in IE < 8,
				// the created element must be assigned to a variable in order to load (#292).
				imageElement = createElement('img', {
					onload: function () {
						centerImage(obj, symbolSizes[imageSrc] = [this.width, this.height]);
					},
					src: imageSrc
				});
			}
		}

		return obj;
	},

	/**
	 * An extendable collection of functions for defining symbol paths.
	 */
	symbols: {
		'circle': function (x, y, w, h) {
			var cpw = 0.166 * w;
			return [
				M, x + w / 2, y,
				'C', x + w + cpw, y, x + w + cpw, y + h, x + w / 2, y + h,
				'C', x - cpw, y + h, x - cpw, y, x + w / 2, y,
				'Z'
			];
		},

		'square': function (x, y, w, h) {
			return [
				M, x, y,
				L, x + w, y,
				x + w, y + h,
				x, y + h,
				'Z'
			];
		},

		'triangle': function (x, y, w, h) {
			return [
				M, x + w / 2, y,
				L, x + w, y + h,
				x, y + h,
				'Z'
			];
		},

		'triangle-down': function (x, y, w, h) {
			return [
				M, x, y,
				L, x + w, y,
				x + w / 2, y + h,
				'Z'
			];
		},
		'diamond': function (x, y, w, h) {
			return [
				M, x + w / 2, y,
				L, x + w, y + h / 2,
				x + w / 2, y + h,
				x, y + h / 2,
				'Z'
			];
		},
		'arc': function (x, y, w, h, options) {
			var start = options.start,
				radius = options.r || w || h,
				end = options.end - 0.001, // to prevent cos and sin of start and end from becoming equal on 360 arcs (related: #1561)
				innerRadius = options.innerR,
				open = options.open,
				cosStart = mathCos(start),
				sinStart = mathSin(start),
				cosEnd = mathCos(end),
				sinEnd = mathSin(end),
				longArc = options.end - start < mathPI ? 0 : 1;

			return [
				M,
				x + radius * cosStart,
				y + radius * sinStart,
				'A', // arcTo
				radius, // x radius
				radius, // y radius
				0, // slanting
				longArc, // long or short arc
				1, // clockwise
				x + radius * cosEnd,
				y + radius * sinEnd,
				open ? M : L,
				x + innerRadius * cosEnd,
				y + innerRadius * sinEnd,
				'A', // arcTo
				innerRadius, // x radius
				innerRadius, // y radius
				0, // slanting
				longArc, // long or short arc
				0, // clockwise
				x + innerRadius * cosStart,
				y + innerRadius * sinStart,

				open ? '' : 'Z' // close
			];
		},

		/**
		 * Callout shape used for default tooltips, also used for rounded rectangles in VML
		 */
		callout: function (x, y, w, h, options) {
			var arrowLength = 6,
				halfDistance = 6,
				r = mathMin((options && options.r) || 0, w, h),
				safeDistance = r + halfDistance,
				anchorX = options && options.anchorX,
				anchorY = options && options.anchorY,
				path;

			path = [
				'M', x + r, y, 
				'L', x + w - r, y, // top side
				'C', x + w, y, x + w, y, x + w, y + r, // top-right corner
				'L', x + w, y + h - r, // right side
				'C', x + w, y + h, x + w, y + h, x + w - r, y + h, // bottom-right corner
				'L', x + r, y + h, // bottom side
				'C', x, y + h, x, y + h, x, y + h - r, // bottom-left corner
				'L', x, y + r, // left side
				'C', x, y, x, y, x + r, y // top-right corner
			];
			
			if (anchorX && anchorX > w && anchorY > y + safeDistance && anchorY < y + h - safeDistance) { // replace right side
				path.splice(13, 3,
					'L', x + w, anchorY - halfDistance, 
					x + w + arrowLength, anchorY,
					x + w, anchorY + halfDistance,
					x + w, y + h - r
				);
			} else if (anchorX && anchorX < 0 && anchorY > y + safeDistance && anchorY < y + h - safeDistance) { // replace left side
				path.splice(33, 3, 
					'L', x, anchorY + halfDistance, 
					x - arrowLength, anchorY,
					x, anchorY - halfDistance,
					x, y + r
				);
			} else if (anchorY && anchorY > h && anchorX > x + safeDistance && anchorX < x + w - safeDistance) { // replace bottom
				path.splice(23, 3,
					'L', anchorX + halfDistance, y + h,
					anchorX, y + h + arrowLength,
					anchorX - halfDistance, y + h,
					x + r, y + h
				);
			} else if (anchorY && anchorY < 0 && anchorX > x + safeDistance && anchorX < x + w - safeDistance) { // replace top
				path.splice(3, 3,
					'L', anchorX - halfDistance, y,
					anchorX, y - arrowLength,
					anchorX + halfDistance, y,
					w - r, y
				);
			}
			return path;
		}
	},

	/**
	 * Define a clipping rectangle
	 * @param {String} id
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	clipRect: function (x, y, width, height) {
		var wrapper,
			id = PREFIX + idCounter++,

			clipPath = this.createElement('clipPath').attr({
				id: id
			}).add(this.defs);

		wrapper = this.rect(x, y, width, height, 0).add(clipPath);
		wrapper.id = id;
		wrapper.clipPath = clipPath;
		wrapper.count = 0;

		return wrapper;
	},


	


	/**
	 * Add text to the SVG object
	 * @param {String} str
	 * @param {Number} x Left position
	 * @param {Number} y Top position
	 * @param {Boolean} useHTML Use HTML to render the text
	 */
	text: function (str, x, y, useHTML) {

		// declare variables
		var renderer = this,
			fakeSVG = useCanVG || (!hasSVG && renderer.forExport),
			wrapper,
			attr = {};

		if (useHTML && !renderer.forExport) {
			return renderer.html(str, x, y);
		}

		attr.x = Math.round(x || 0); // X is always needed for line-wrap logic
		if (y) {
			attr.y = Math.round(y);
		}
		if (str || str === 0) {
			attr.text = str;
		}

		wrapper = renderer.createElement('text')
			.attr(attr);

		// Prevent wrapping from creating false offsetWidths in export in legacy IE (#1079, #1063)
		if (fakeSVG) {
			wrapper.css({
				position: ABSOLUTE
			});
		}

		if (!useHTML) {
			wrapper.xSetter = function (value, key, element) {
				var tspans = element.getElementsByTagName('tspan'),
					tspan,
					parentVal = element.getAttribute(key),
					i;
				for (i = 0; i < tspans.length; i++) {
					tspan = tspans[i];
					// If the x values are equal, the tspan represents a linebreak
					if (tspan.getAttribute(key) === parentVal) {
						tspan.setAttribute(key, value);
					}
				}
				element.setAttribute(key, value);
			};
		}
		
		return wrapper;
	},

	/**
	 * Utility to return the baseline offset and total line height from the font size
	 */
	fontMetrics: function (fontSize, elem) {
		var lineHeight,
			baseline,
			style;

		fontSize = fontSize || this.style.fontSize;
		if (elem && win.getComputedStyle) {
			elem = elem.element || elem; // SVGElement
			style = win.getComputedStyle(elem, "");
			fontSize = style && style.fontSize; // #4309, the style doesn't exist inside a hidden iframe in Firefox
		}
		fontSize = /px/.test(fontSize) ? pInt(fontSize) : /em/.test(fontSize) ? parseFloat(fontSize) * 12 : 12;

		// Empirical values found by comparing font size and bounding box height.
		// Applies to the default font family. http://jsfiddle.net/highcharts/7xvn7/
		lineHeight = fontSize < 24 ? fontSize + 3 : mathRound(fontSize * 1.2);
		baseline = mathRound(lineHeight * 0.8);

		return {
			h: lineHeight,
			b: baseline,
			f: fontSize
		};
	},

	/**
	 * Correct X and Y positioning of a label for rotation (#1764)
	 */
	rotCorr: function (baseline, rotation, alterY) {
		var y = baseline;
		if (rotation && alterY) {
			y = mathMax(y * mathCos(rotation * deg2rad), 4);
		}
		return {
			x: (-baseline / 3) * mathSin(rotation * deg2rad),
			y: y
		};
	},

	/**
	 * Add a label, a text item that can hold a colored or gradient background
	 * as well as a border and shadow.
	 * @param {string} str
	 * @param {Number} x
	 * @param {Number} y
	 * @param {String} shape
	 * @param {Number} anchorX In case the shape has a pointer, like a flag, this is the
	 *	coordinates it should be pinned to
	 * @param {Number} anchorY
	 * @param {Boolean} baseline Whether to position the label relative to the text baseline,
	 *	like renderer.text, or to the upper border of the rectangle.
	 * @param {String} className Class name for the group
	 */
	label: function (str, x, y, shape, anchorX, anchorY, useHTML, baseline, className) {

		var renderer = this,
			wrapper = renderer.g(className),
			text = renderer.text('', 0, 0, useHTML)
				.attr({
					zIndex: 1
				}),
				//.add(wrapper),
			box,
			bBox,
			alignFactor = 0,
			padding = 3,
			paddingLeft = 0,
			width,
			height,
			wrapperX,
			wrapperY,
			crispAdjust = 0,
			deferredAttr = {},
			baselineOffset,
			needsBox;

		/**
		 * This function runs after the label is added to the DOM (when the bounding box is
		 * available), and after the text of the label is updated to detect the new bounding
		 * box and reflect it in the border box.
		 */
		function updateBoxSize() {
			var boxX,
				boxY,
				style = text.element.style;

			bBox = (width === undefined || height === undefined || wrapper.styles.textAlign) && defined(text.textStr) && 
				text.getBBox(); //#3295 && 3514 box failure when string equals 0
			wrapper.width = (width || bBox.width || 0) + 2 * padding + paddingLeft;
			wrapper.height = (height || bBox.height || 0) + 2 * padding;

			// update the label-scoped y offset
			baselineOffset = padding + renderer.fontMetrics(style && style.fontSize, text).b;

			
			if (needsBox) {

				// create the border box if it is not already present
				if (!box) {
					boxX = mathRound(-alignFactor * padding) + crispAdjust;
					boxY = (baseline ? -baselineOffset : 0) + crispAdjust;

					wrapper.box = box = shape ?
						renderer.symbol(shape, boxX, boxY, wrapper.width, wrapper.height, deferredAttr) :
						renderer.rect(boxX, boxY, wrapper.width, wrapper.height, 0, deferredAttr[STROKE_WIDTH]);
					box.attr('fill', NONE).add(wrapper);
				}

				// apply the box attributes
				if (!box.isImg) { // #1630
					box.attr(extend({
						width: mathRound(wrapper.width),
						height: mathRound(wrapper.height)
					}, deferredAttr));
				}
				deferredAttr = null;
			}
		}

		/**
		 * This function runs after setting text or padding, but only if padding is changed
		 */
		function updateTextPadding() {
			var styles = wrapper.styles,
				textAlign = styles && styles.textAlign,
				x = paddingLeft + padding * (1 - alignFactor),
				y;

			// determin y based on the baseline
			y = baseline ? 0 : baselineOffset;

			// compensate for alignment
			if (defined(width) && bBox && (textAlign === 'center' || textAlign === 'right')) {
				x += { center: 0.5, right: 1 }[textAlign] * (width - bBox.width);
			}

			// update if anything changed
			if (x !== text.x || y !== text.y) {
				text.attr('x', x);
				if (y !== UNDEFINED) {
					text.attr('y', y);
				}
			}

			// record current values
			text.x = x;
			text.y = y;
		}

		/**
		 * Set a box attribute, or defer it if the box is not yet created
		 * @param {Object} key
		 * @param {Object} value
		 */
		function boxAttr(key, value) {
			if (box) {
				box.attr(key, value);
			} else {
				deferredAttr[key] = value;
			}
		}

		/**
		 * After the text element is added, get the desired size of the border box
		 * and add it before the text in the DOM.
		 */
		wrapper.onAdd = function () {
			text.add(wrapper);
			wrapper.attr({
				text: (str || str === 0) ? str : '', // alignment is available now // #3295: 0 not rendered if given as a value
				x: x,
				y: y
			});

			if (box && defined(anchorX)) {
				wrapper.attr({
					anchorX: anchorX,
					anchorY: anchorY
				});
			}
		};

		/*
		 * Add specific attribute setters.
		 */

		// only change local variables
		wrapper.widthSetter = function (value) {
			width = value;
		};
		wrapper.heightSetter = function (value) {
			height = value;
		};
		wrapper.paddingSetter =  function (value) {
			if (defined(value) && value !== padding) {
				padding = wrapper.padding = value;
				updateTextPadding();
			}
		};
		wrapper.paddingLeftSetter =  function (value) {
			if (defined(value) && value !== paddingLeft) {
				paddingLeft = value;
				updateTextPadding();
			}
		};


		// change local variable and prevent setting attribute on the group
		wrapper.alignSetter = function (value) {
			alignFactor = { left: 0, center: 0.5, right: 1 }[value];
		};

		// apply these to the box and the text alike
		wrapper.textSetter = function (value) {
			if (value !== UNDEFINED) {
				text.textSetter(value);
			}
			updateBoxSize();
			updateTextPadding();
		};

		// apply these to the box but not to the text
		wrapper['stroke-widthSetter'] = function (value, key) {
			if (value) {
				needsBox = true;
			}
			crispAdjust = value % 2 / 2;
			boxAttr(key, value);
		};
		wrapper.strokeSetter = wrapper.fillSetter = wrapper.rSetter = function (value, key) {
			if (key === 'fill' && value) {
				needsBox = true;
			}
			boxAttr(key, value);
		};
		wrapper.anchorXSetter = function (value, key) {
			anchorX = value;
			boxAttr(key, mathRound(value) - crispAdjust - wrapperX);
		};
		wrapper.anchorYSetter = function (value, key) {
			anchorY = value;
			boxAttr(key, value - wrapperY);
		};

		// rename attributes
		wrapper.xSetter = function (value) {
			wrapper.x = value; // for animation getter
			if (alignFactor) {
				value -= alignFactor * ((width || bBox.width) + padding);
			}
			wrapperX = mathRound(value);
			wrapper.attr('translateX', wrapperX);
		};
		wrapper.ySetter = function (value) {
			wrapperY = wrapper.y = mathRound(value);
			wrapper.attr('translateY', wrapperY);
		};

		// Redirect certain methods to either the box or the text
		var baseCss = wrapper.css;
		return extend(wrapper, {
			/**
			 * Pick up some properties and apply them to the text instead of the wrapper
			 */
			css: function (styles) {
				if (styles) {
					var textStyles = {};
					styles = merge(styles); // create a copy to avoid altering the original object (#537)
					each(wrapper.textProps, function (prop) {
						if (styles[prop] !== UNDEFINED) {
							textStyles[prop] = styles[prop];
							delete styles[prop];
						}
					});
					text.css(textStyles);
				}
				return baseCss.call(wrapper, styles);
			},
			/**
			 * Return the bounding box of the box, not the group
			 */
			getBBox: function () {
				return {
					width: bBox.width + 2 * padding,
					height: bBox.height + 2 * padding,
					x: bBox.x - padding,
					y: bBox.y - padding
				};
			},
			/**
			 * Apply the shadow to the box
			 */
			shadow: function (b) {
				if (box) {
					box.shadow(b);
				}
				return wrapper;
			},
			/**
			 * Destroy and release memory.
			 */
			destroy: function () {

				// Added by button implementation
				removeEvent(wrapper.element, 'mouseenter');
				removeEvent(wrapper.element, 'mouseleave');

				if (text) {
					text = text.destroy();
				}
				if (box) {
					box = box.destroy();
				}
				// Call base implementation to destroy the rest
				SVGElement.prototype.destroy.call(wrapper);

				// Release local pointers (#1298)
				wrapper = renderer = updateBoxSize = updateTextPadding = boxAttr = null;
			}
		});
	}
}; // end SVGRenderer


// general renderer
Renderer = SVGRenderer;
// extend SvgElement for useHTML option
extend(SVGElement.prototype, {
	/**
	 * Apply CSS to HTML elements. This is used in text within SVG rendering and
	 * by the VML renderer
	 */
	htmlCss: function (styles) {
		var wrapper = this,
			element = wrapper.element,
			textWidth = styles && element.tagName === 'SPAN' && styles.width;

		if (textWidth) {
			delete styles.width;
			wrapper.textWidth = textWidth;
			wrapper.updateTransform();
		}
		if (styles && styles.textOverflow === 'ellipsis') {
			styles.whiteSpace = 'nowrap';
			styles.overflow = 'hidden';
		}
		wrapper.styles = extend(wrapper.styles, styles);
		css(wrapper.element, styles);

		return wrapper;
	},

	/**
	 * VML and useHTML method for calculating the bounding box based on offsets
	 * @param {Boolean} refresh Whether to force a fresh value from the DOM or to
	 * use the cached value
	 *
	 * @return {Object} A hash containing values for x, y, width and height
	 */

	htmlGetBBox: function () {
		var wrapper = this,
			element = wrapper.element;

		// faking getBBox in exported SVG in legacy IE
		// faking getBBox in exported SVG in legacy IE (is this a duplicate of the fix for #1079?)
		if (element.nodeName === 'text') {
			element.style.position = ABSOLUTE;
		}

		return {
			x: element.offsetLeft,
			y: element.offsetTop,
			width: element.offsetWidth,
			height: element.offsetHeight
		};
	},

	/**
	 * VML override private method to update elements based on internal
	 * properties based on SVG transform
	 */
	htmlUpdateTransform: function () {
		// aligning non added elements is expensive
		if (!this.added) {
			this.alignOnAdd = true;
			return;
		}

		var wrapper = this,
			renderer = wrapper.renderer,
			elem = wrapper.element,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			x = wrapper.x || 0,
			y = wrapper.y || 0,
			align = wrapper.textAlign || 'left',
			alignCorrection = { left: 0, center: 0.5, right: 1 }[align],
			shadows = wrapper.shadows,
			styles = wrapper.styles;

		// apply translate
		css(elem, {
			marginLeft: translateX,
			marginTop: translateY
		});
		if (shadows) { // used in labels/tooltip
			each(shadows, function (shadow) {
				css(shadow, {
					marginLeft: translateX + 1,
					marginTop: translateY + 1
				});
			});
		}

		// apply inversion
		if (wrapper.inverted) { // wrapper is a group
			each(elem.childNodes, function (child) {
				renderer.invertChild(child, elem);
			});
		}

		if (elem.tagName === 'SPAN') {

			var width,
				rotation = wrapper.rotation,
				baseline,
				textWidth = pInt(wrapper.textWidth),
				currentTextTransform = [rotation, align, elem.innerHTML, wrapper.textWidth].join(',');

			if (currentTextTransform !== wrapper.cTT) { // do the calculations and DOM access only if properties changed


				baseline = renderer.fontMetrics(elem.style.fontSize).b;

				// Renderer specific handling of span rotation
				if (defined(rotation)) {
					wrapper.setSpanRotation(rotation, alignCorrection, baseline);
				}

				width = pick(wrapper.elemWidth, elem.offsetWidth);

				// Update textWidth
				if (width > textWidth && /[ \-]/.test(elem.textContent || elem.innerText)) { // #983, #1254
					css(elem, {
						width: textWidth + PX,
						display: 'block',
						whiteSpace: (styles && styles.whiteSpace) || 'normal' // #3331
					});
					width = textWidth;
				}

				wrapper.getSpanCorrection(width, baseline, alignCorrection, rotation, align);
			}

			// apply position with correction
			css(elem, {
				left: (x + (wrapper.xCorr || 0)) + PX,
				top: (y + (wrapper.yCorr || 0)) + PX
			});

			// force reflow in webkit to apply the left and top on useHTML element (#1249)
			if (isWebKit) {
				baseline = elem.offsetHeight; // assigned to baseline for JSLint purpose
			}

			// record current text transform
			wrapper.cTT = currentTextTransform;
		}
	},

	/**
	 * Set the rotation of an individual HTML span
	 */
	setSpanRotation: function (rotation, alignCorrection, baseline) {
		var rotationStyle = {},
			cssTransformKey = isIE ? '-ms-transform' : isWebKit ? '-webkit-transform' : isFirefox ? 'MozTransform' : isOpera ? '-o-transform' : '';

		rotationStyle[cssTransformKey] = rotationStyle.transform = 'rotate(' + rotation + 'deg)';
		rotationStyle[cssTransformKey + (isFirefox ? 'Origin' : '-origin')] = rotationStyle.transformOrigin = (alignCorrection * 100) + '% ' + baseline + 'px';
		css(this.element, rotationStyle);
	},

	/**
	 * Get the correction in X and Y positioning as the element is rotated.
	 */
	getSpanCorrection: function (width, baseline, alignCorrection) {
		this.xCorr = -width * alignCorrection;
		this.yCorr = -baseline;
	}
});

// Extend SvgRenderer for useHTML option.
extend(SVGRenderer.prototype, {
	/**
	 * Create HTML text node. This is used by the VML renderer as well as the SVG
	 * renderer through the useHTML option.
	 *
	 * @param {String} str
	 * @param {Number} x
	 * @param {Number} y
	 */
	html: function (str, x, y) {
		var wrapper = this.createElement('span'),
			element = wrapper.element,
			renderer = wrapper.renderer;

		// Text setter
		wrapper.textSetter = function (value) {
			if (value !== element.innerHTML) {
				delete this.bBox;
			}
			element.innerHTML = this.textStr = value;
		};

		// Various setters which rely on update transform
		wrapper.xSetter = wrapper.ySetter = wrapper.alignSetter = wrapper.rotationSetter = function (value, key) {
			if (key === 'align') {
				key = 'textAlign'; // Do not overwrite the SVGElement.align method. Same as VML.
			}
			wrapper[key] = value;
			wrapper.htmlUpdateTransform();
		};

		// Set the default attributes
		wrapper.attr({
				text: str,
				x: mathRound(x),
				y: mathRound(y)
			})
			.css({
				position: ABSOLUTE,
				fontFamily: this.style.fontFamily,
				fontSize: this.style.fontSize
			});

		// Keep the whiteSpace style outside the wrapper.styles collection
		element.style.whiteSpace = 'nowrap';

		// Use the HTML specific .css method
		wrapper.css = wrapper.htmlCss;

		// This is specific for HTML within SVG
		if (renderer.isSVG) {
			wrapper.add = function (svgGroupWrapper) {

				var htmlGroup,
					container = renderer.box.parentNode,
					parentGroup,
					parents = [];

				this.parentGroup = svgGroupWrapper;

				// Create a mock group to hold the HTML elements
				if (svgGroupWrapper) {
					htmlGroup = svgGroupWrapper.div;
					if (!htmlGroup) {

						// Read the parent chain into an array and read from top down
						parentGroup = svgGroupWrapper;
						while (parentGroup) {

							parents.push(parentGroup);

							// Move up to the next parent group
							parentGroup = parentGroup.parentGroup;
						}

						// Ensure dynamically updating position when any parent is translated
						each(parents.reverse(), function (parentGroup) {
							var htmlGroupStyle,
								cls = attr(parentGroup.element, 'class');

							if (cls) {
								cls = { className: cls };
							} // else null

							// Create a HTML div and append it to the parent div to emulate
							// the SVG group structure
							htmlGroup = parentGroup.div = parentGroup.div || createElement(DIV, cls, {
								position: ABSOLUTE,
								left: (parentGroup.translateX || 0) + PX,
								top: (parentGroup.translateY || 0) + PX
							}, htmlGroup || container); // the top group is appended to container

							// Shortcut
							htmlGroupStyle = htmlGroup.style;

							// Set listeners to update the HTML div's position whenever the SVG group
							// position is changed
							extend(parentGroup, {
								translateXSetter: function (value, key) {
									htmlGroupStyle.left = value + PX;
									parentGroup[key] = value;
									parentGroup.doTransform = true;
								},
								translateYSetter: function (value, key) {
									htmlGroupStyle.top = value + PX;
									parentGroup[key] = value;
									parentGroup.doTransform = true;
								},
								visibilitySetter: function (value, key) {
									htmlGroupStyle[key] = value;
								}
							});
						});

					}
				} else {
					htmlGroup = container;
				}

				htmlGroup.appendChild(element);

				// Shared with VML:
				wrapper.added = true;
				if (wrapper.alignOnAdd) {
					wrapper.htmlUpdateTransform();
				}

				return wrapper;
			};
		}
		return wrapper;
	}
});

/* ****************************************************************************
 *                                                                            *
 * START OF INTERNET EXPLORER <= 8 SPECIFIC CODE                              *
 *                                                                            *
 * For applications and websites that don't need IE support, like platform    *
 * targeted mobile apps and web apps, this code can be removed.               *
 *                                                                            *
 *****************************************************************************/

/**
 * @constructor
 */
var VMLRenderer, VMLElement;
if (!hasSVG && !useCanVG) {

/**
 * The VML element wrapper.
 */
VMLElement = {

	/**
	 * Initialize a new VML element wrapper. It builds the markup as a string
	 * to minimize DOM traffic.
	 * @param {Object} renderer
	 * @param {Object} nodeName
	 */
	init: function (renderer, nodeName) {
		var wrapper = this,
			markup =  ['<', nodeName, ' filled="f" stroked="f"'],
			style = ['position: ', ABSOLUTE, ';'],
			isDiv = nodeName === DIV;

		// divs and shapes need size
		if (nodeName === 'shape' || isDiv) {
			style.push('left:0;top:0;width:1px;height:1px;');
		}
		style.push('visibility: ', isDiv ? HIDDEN : VISIBLE);

		markup.push(' style="', style.join(''), '"/>');

		// create element with default attributes and style
		if (nodeName) {
			markup = isDiv || nodeName === 'span' || nodeName === 'img' ?
				markup.join('')
				: renderer.prepVML(markup);
			wrapper.element = createElement(markup);
		}

		wrapper.renderer = renderer;
	},

	/**
	 * Add the node to the given parent
	 * @param {Object} parent
	 */
	add: function (parent) {
		var wrapper = this,
			renderer = wrapper.renderer,
			element = wrapper.element,
			box = renderer.box,
			inverted = parent && parent.inverted,

			// get the parent node
			parentNode = parent ?
				parent.element || parent :
				box;


		// if the parent group is inverted, apply inversion on all children
		if (inverted) { // only on groups
			renderer.invertChild(element, parentNode);
		}

		// append it
		parentNode.appendChild(element);

		// align text after adding to be able to read offset
		wrapper.added = true;
		if (wrapper.alignOnAdd && !wrapper.deferUpdateTransform) {
			wrapper.updateTransform();
		}

		// fire an event for internal hooks
		if (wrapper.onAdd) {
			wrapper.onAdd();
		}

		return wrapper;
	},

	/**
	 * VML always uses htmlUpdateTransform
	 */
	updateTransform: SVGElement.prototype.htmlUpdateTransform,

	/**
	 * Set the rotation of a span with oldIE's filter
	 */
	setSpanRotation: function () {
		// Adjust for alignment and rotation. Rotation of useHTML content is not yet implemented
		// but it can probably be implemented for Firefox 3.5+ on user request. FF3.5+
		// has support for CSS3 transform. The getBBox method also needs to be updated
		// to compensate for the rotation, like it currently does for SVG.
		// Test case: http://jsfiddle.net/highcharts/Ybt44/

		var rotation = this.rotation,
			costheta = mathCos(rotation * deg2rad),
			sintheta = mathSin(rotation * deg2rad);
					
		css(this.element, {
			filter: rotation ? ['progid:DXImageTransform.Microsoft.Matrix(M11=', costheta,
				', M12=', -sintheta, ', M21=', sintheta, ', M22=', costheta,
				', sizingMethod=\'auto expand\')'].join('') : NONE
		});
	},

	/**
	 * Get the positioning correction for the span after rotating. 
	 */
	getSpanCorrection: function (width, baseline, alignCorrection, rotation, align) {

		var costheta = rotation ? mathCos(rotation * deg2rad) : 1,
			sintheta = rotation ? mathSin(rotation * deg2rad) : 0,
			height = pick(this.elemHeight, this.element.offsetHeight),
			quad,
			nonLeft = align && align !== 'left';

		// correct x and y
		this.xCorr = costheta < 0 && -width;
		this.yCorr = sintheta < 0 && -height;

		// correct for baseline and corners spilling out after rotation
		quad = costheta * sintheta < 0;
		this.xCorr += sintheta * baseline * (quad ? 1 - alignCorrection : alignCorrection);
		this.yCorr -= costheta * baseline * (rotation ? (quad ? alignCorrection : 1 - alignCorrection) : 1);
		// correct for the length/height of the text
		if (nonLeft) {
			this.xCorr -= width * alignCorrection * (costheta < 0 ? -1 : 1);
			if (rotation) {
				this.yCorr -= height * alignCorrection * (sintheta < 0 ? -1 : 1);
			}
			css(this.element, {
				textAlign: align
			});
		}
	},

	/**
	 * Converts a subset of an SVG path definition to its VML counterpart. Takes an array
	 * as the parameter and returns a string.
	 */
	pathToVML: function (value) {
		// convert paths
		var i = value.length,
			path = [];

		while (i--) {

			// Multiply by 10 to allow subpixel precision.
			// Substracting half a pixel seems to make the coordinates
			// align with SVG, but this hasn't been tested thoroughly
			if (isNumber(value[i])) {
				path[i] = mathRound(value[i] * 10) - 5;
			} else if (value[i] === 'Z') { // close the path
				path[i] = 'x';
			} else {
				path[i] = value[i];

				// When the start X and end X coordinates of an arc are too close,
				// they are rounded to the same value above. In this case, substract or 
				// add 1 from the end X and Y positions. #186, #760, #1371, #1410.
				if (value.isArc && (value[i] === 'wa' || value[i] === 'at')) {
					// Start and end X
					if (path[i + 5] === path[i + 7]) {
						path[i + 7] += value[i + 7] > value[i + 5] ? 1 : -1;
					}
					// Start and end Y
					if (path[i + 6] === path[i + 8]) {
						path[i + 8] += value[i + 8] > value[i + 6] ? 1 : -1;
					}
				}
			}
		}

		
		// Loop up again to handle path shortcuts (#2132)
		/*while (i++ < path.length) {
			if (path[i] === 'H') { // horizontal line to
				path[i] = 'L';
				path.splice(i + 2, 0, path[i - 1]);
			} else if (path[i] === 'V') { // vertical line to
				path[i] = 'L';
				path.splice(i + 1, 0, path[i - 2]);
			}
		}*/
		return path.join(' ') || 'x';
	},

	/**
	 * Set the element's clipping to a predefined rectangle
	 *
	 * @param {String} id The id of the clip rectangle
	 */
	clip: function (clipRect) {
		var wrapper = this,
			clipMembers,
			cssRet;

		if (clipRect) {
			clipMembers = clipRect.members;
			erase(clipMembers, wrapper); // Ensure unique list of elements (#1258)
			clipMembers.push(wrapper);
			wrapper.destroyClip = function () {
				erase(clipMembers, wrapper);
			};
			cssRet = clipRect.getCSS(wrapper);

		} else {
			if (wrapper.destroyClip) {
				wrapper.destroyClip();
			}
			cssRet = { clip: docMode8 ? 'inherit' : 'rect(auto)' }; // #1214
		}

		return wrapper.css(cssRet);

	},

	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: SVGElement.prototype.htmlCss,

	/**
	 * Removes a child either by removeChild or move to garbageBin.
	 * Issue 490; in VML removeChild results in Orphaned nodes according to sIEve, discardElement does not.
	 */
	safeRemoveChild: function (element) {
		// discardElement will detach the node from its parent before attaching it
		// to the garbage bin. Therefore it is important that the node is attached and have parent.
		if (element.parentNode) {
			discardElement(element);
		}
	},

	/**
	 * Extend element.destroy by removing it from the clip members array
	 */
	destroy: function () {
		if (this.destroyClip) {
			this.destroyClip();
		}

		return SVGElement.prototype.destroy.apply(this);
	},

	/**
	 * Add an event listener. VML override for normalizing event parameters.
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function (eventType, handler) {
		// simplest possible event model for internal use
		this.element['on' + eventType] = function () {
			var evt = win.event;
			evt.target = evt.srcElement;
			handler(evt);
		};
		return this;
	},

	/**
	 * In stacked columns, cut off the shadows so that they don't overlap
	 */
	cutOffPath: function (path, length) {

		var len;

		path = path.split(/[ ,]/);
		len = path.length;

		if (len === 9 || len === 11) {
			path[len - 4] = path[len - 2] = pInt(path[len - 2]) - 10 * length;
		}
		return path.join(' ');
	},

	/**
	 * Apply a drop shadow by copying elements and giving them different strokes
	 * @param {Boolean|Object} shadowOptions
	 */
	shadow: function (shadowOptions, group, cutOff) {
		var shadows = [],
			i,
			element = this.element,
			renderer = this.renderer,
			shadow,
			elemStyle = element.style,
			markup,
			path = element.path,
			strokeWidth,
			modifiedPath,
			shadowWidth,
			shadowElementOpacity;

		// some times empty paths are not strings
		if (path && typeof path.value !== 'string') {
			path = 'x';
		}
		modifiedPath = path;

		if (shadowOptions) {
			shadowWidth = pick(shadowOptions.width, 3);
			shadowElementOpacity = (shadowOptions.opacity || 0.15) / shadowWidth;
			for (i = 1; i <= 3; i++) {

				strokeWidth = (shadowWidth * 2) + 1 - (2 * i);

				// Cut off shadows for stacked column items
				if (cutOff) {
					modifiedPath = this.cutOffPath(path.value, strokeWidth + 0.5);
				}

				markup = ['<shape isShadow="true" strokeweight="', strokeWidth,
					'" filled="false" path="', modifiedPath,
					'" coordsize="10 10" style="', element.style.cssText, '" />'];

				shadow = createElement(renderer.prepVML(markup),
					null, {
						left: pInt(elemStyle.left) + pick(shadowOptions.offsetX, 1),
						top: pInt(elemStyle.top) + pick(shadowOptions.offsetY, 1)
					}
				);
				if (cutOff) {
					shadow.cutOff = strokeWidth + 1;
				}

				// apply the opacity
				markup = ['<stroke color="', shadowOptions.color || 'black', '" opacity="', shadowElementOpacity * i, '"/>'];
				createElement(renderer.prepVML(markup), null, null, shadow);


				// insert it
				if (group) {
					group.element.appendChild(shadow);
				} else {
					element.parentNode.insertBefore(shadow, element);
				}

				// record it
				shadows.push(shadow);

			}

			this.shadows = shadows;
		}
		return this;
	},
	updateShadows: noop, // Used in SVG only

	setAttr: function (key, value) {
		if (docMode8) { // IE8 setAttribute bug
			this.element[key] = value;
		} else {
			this.element.setAttribute(key, value);
		}
	},
	classSetter: function (value) {
		// IE8 Standards mode has problems retrieving the className unless set like this
		this.element.className = value;
	},
	dashstyleSetter: function (value, key, element) {
		var strokeElem = element.getElementsByTagName('stroke')[0] ||
			createElement(this.renderer.prepVML(['<stroke/>']), null, null, element);
		strokeElem[key] = value || 'solid';
		this[key] = value; /* because changing stroke-width will change the dash length
			and cause an epileptic effect */
	},
	dSetter: function (value, key, element) {
		var i,
			shadows = this.shadows;
		value = value || [];
		this.d = value.join && value.join(' '); // used in getter for animation

		element.path = value = this.pathToVML(value);

		// update shadows
		if (shadows) {
			i = shadows.length;
			while (i--) {
				shadows[i].path = shadows[i].cutOff ? this.cutOffPath(value, shadows[i].cutOff) : value;
			}
		}
		this.setAttr(key, value);
	},
	fillSetter: function (value, key, element) {
		var nodeName = element.nodeName;
		if (nodeName === 'SPAN') { // text color
			element.style.color = value;
		} else if (nodeName !== 'IMG') { // #1336
			element.filled = value !== NONE;
			this.setAttr('fillcolor', this.renderer.color(value, element, key, this));
		}
	},
	opacitySetter: noop, // Don't bother - animation is too slow and filters introduce artifacts
	rotationSetter: function (value, key, element) {
		var style = element.style;
		this[key] = style[key] = value; // style is for #1873

		// Correction for the 1x1 size of the shape container. Used in gauge needles.
		style.left = -mathRound(mathSin(value * deg2rad) + 1) + PX;
		style.top = mathRound(mathCos(value * deg2rad)) + PX;
	},
	strokeSetter: function (value, key, element) {
		this.setAttr('strokecolor', this.renderer.color(value, element, key));
	},
	'stroke-widthSetter': function (value, key, element) {
		element.stroked = !!value; // VML "stroked" attribute
		this[key] = value; // used in getter, issue #113
		if (isNumber(value)) {
			value += PX;
		}
		this.setAttr('strokeweight', value);
	},
	titleSetter: function (value, key) {
		this.setAttr(key, value);
	},
	visibilitySetter: function (value, key, element) {

		// Handle inherited visibility
		if (value === 'inherit') {
			value = VISIBLE;
		}
		
		// Let the shadow follow the main element
		if (this.shadows) {
			each(this.shadows, function (shadow) {
				shadow.style[key] = value;
			});
		}

		// Instead of toggling the visibility CSS property, move the div out of the viewport.
		// This works around #61 and #586
		if (element.nodeName === 'DIV') {
			value = value === HIDDEN ? '-999em' : 0;

			// In order to redraw, IE7 needs the div to be visible when tucked away
			// outside the viewport. So the visibility is actually opposite of
			// the expected value. This applies to the tooltip only.
			if (!docMode8) {
				element.style[key] = value ? VISIBLE : HIDDEN;
			}
			key = 'top';
		}
		element.style[key] = value;
	},
	xSetter: function (value, key, element) {
		this[key] = value; // used in getter

		if (key === 'x') {
			key = 'left';
		} else if (key === 'y') {
			key = 'top';
		}/* else {
			value = mathMax(0, value); // don't set width or height below zero (#311)
		}*/

		// clipping rectangle special
		if (this.updateClipping) {
			this[key] = value; // the key is now 'left' or 'top' for 'x' and 'y'
			this.updateClipping();
		} else {
			// normal
			element.style[key] = value;
		}
	},
	zIndexSetter: function (value, key, element) {
		element.style[key] = value;
	}
};
JSComtrade.VMLElement = VMLElement = extendClass(SVGElement, VMLElement);

// Some shared setters
VMLElement.prototype.ySetter =
	VMLElement.prototype.widthSetter = 
	VMLElement.prototype.heightSetter = 
	VMLElement.prototype.xSetter;


/**
 * The VML renderer
 */
var VMLRendererExtension = { // inherit SVGRenderer

	Element: VMLElement,
	isIE8: userAgent.indexOf('MSIE 8.0') > -1,


	/**
	 * Initialize the VMLRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 */
	init: function (container, width, height, style) {
		var renderer = this,
			boxWrapper,
			box,
			css;

		renderer.alignedObjects = [];

		boxWrapper = renderer.createElement(DIV)
			.css(extend(this.getStyle(style), { position: RELATIVE}));
		box = boxWrapper.element;
		container.appendChild(boxWrapper.element);


		// generate the containing box
		renderer.isVML = true;
		renderer.box = box;
		renderer.boxWrapper = boxWrapper;
		renderer.cache = {};


		renderer.setSize(width, height, false);

		// The only way to make IE6 and IE7 print is to use a global namespace. However,
		// with IE8 the only way to make the dynamic shapes visible in screen and print mode
		// seems to be to add the xmlns attribute and the behaviour style inline.
		if (!doc.namespaces.hcv) {

			doc.namespaces.add('hcv', 'urn:schemas-microsoft-com:vml');

			// Setup default CSS (#2153, #2368, #2384)
			css = 'hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke' +
				'{ behavior:url(#default#VML); display: inline-block; } ';
			try {
				doc.createStyleSheet().cssText = css;
			} catch (e) {
				doc.styleSheets[0].cssText += css;
			}

		}
	},


	/**
	 * Detect whether the renderer is hidden. This happens when one of the parent elements
	 * has display: none
	 */
	isHidden: function () {
		return !this.box.offsetWidth;
	},

	/**
	 * Define a clipping rectangle. In VML it is accomplished by storing the values
	 * for setting the CSS style to all associated members.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	clipRect: function (x, y, width, height) {

		// create a dummy element
		var clipRect = this.createElement(),
			isObj = isObject(x);

		// mimic a rectangle with its style object for automatic updating in attr
		return extend(clipRect, {
			members: [],
			count: 0,
			left: (isObj ? x.x : x) + 1,
			top: (isObj ? x.y : y) + 1,
			width: (isObj ? x.width : width) - 1,
			height: (isObj ? x.height : height) - 1,
			getCSS: function (wrapper) {
				var element = wrapper.element,
					nodeName = element.nodeName,
					isShape = nodeName === 'shape',
					inverted = wrapper.inverted,
					rect = this,
					top = rect.top - (isShape ? element.offsetTop : 0),
					left = rect.left,
					right = left + rect.width,
					bottom = top + rect.height,
					ret = {
						clip: 'rect(' +
							mathRound(inverted ? left : top) + 'px,' +
							mathRound(inverted ? bottom : right) + 'px,' +
							mathRound(inverted ? right : bottom) + 'px,' +
							mathRound(inverted ? top : left) + 'px)'
					};

				// issue 74 workaround
				if (!inverted && docMode8 && nodeName === 'DIV') {
					extend(ret, {
						width: right + PX,
						height: bottom + PX
					});
				}
				return ret;
			},

			// used in attr and animation to update the clipping of all members
			updateClipping: function () {
				each(clipRect.members, function (member) {
					if (member.element) { // Deleted series, like in stock/members/series-remove demo. Should be removed from members, but this will do.
						member.css(clipRect.getCSS(member));
					}
				});
			}
		});

	},


	/**
	 * Take a color and return it if it's a string, make it a gradient if it's a
	 * gradient configuration object, and apply opacity.
	 *
	 * @param {Object} color The color or config object
	 */
	color: function (color, elem, prop, wrapper) {
		var renderer = this,
			colorObject,
			regexRgba = /^rgba/,
			markup,
			fillType,
			ret = NONE;

		// Check for linear or radial gradient
		if (color && color.linearGradient) {
			fillType = 'gradient';
		} else if (color && color.radialGradient) {
			fillType = 'pattern';
		}


		if (fillType) {

			var stopColor,
				stopOpacity,
				gradient = color.linearGradient || color.radialGradient,
				x1,
				y1,
				x2,
				y2,
				opacity1,
				opacity2,
				color1,
				color2,
				fillAttr = '',
				stops = color.stops,
				firstStop,
				lastStop,
				colors = [],
				addFillNode = function () {
					// Add the fill subnode. When colors attribute is used, the meanings of opacity and o:opacity2
					// are reversed.
					markup = ['<fill colors="' + colors.join(',') + '" opacity="', opacity2, '" o:opacity2="', opacity1,
						'" type="', fillType, '" ', fillAttr, 'focus="100%" method="any" />'];
					createElement(renderer.prepVML(markup), null, null, elem);
				};

			// Extend from 0 to 1
			firstStop = stops[0];
			lastStop = stops[stops.length - 1];
			if (firstStop[0] > 0) {
				stops.unshift([
					0,
					firstStop[1]
				]);
			}
			if (lastStop[0] < 1) {
				stops.push([
					1,
					lastStop[1]
				]);
			}

			// Compute the stops
			each(stops, function (stop, i) {
				if (regexRgba.test(stop[1])) {
					colorObject = Color(stop[1]);
					stopColor = colorObject.get('rgb');
					stopOpacity = colorObject.get('a');
				} else {
					stopColor = stop[1];
					stopOpacity = 1;
				}

				// Build the color attribute
				colors.push((stop[0] * 100) + '% ' + stopColor);

				// Only start and end opacities are allowed, so we use the first and the last
				if (!i) {
					opacity1 = stopOpacity;
					color2 = stopColor;
				} else {
					opacity2 = stopOpacity;
					color1 = stopColor;
				}
			});

			// Apply the gradient to fills only.
			if (prop === 'fill') {

				// Handle linear gradient angle
				if (fillType === 'gradient') {
					x1 = gradient.x1 || gradient[0] || 0;
					y1 = gradient.y1 || gradient[1] || 0;
					x2 = gradient.x2 || gradient[2] || 0;
					y2 = gradient.y2 || gradient[3] || 0;
					fillAttr = 'angle="' + (90  - math.atan(
						(y2 - y1) / // y vector
						(x2 - x1) // x vector
						) * 180 / mathPI) + '"';

					addFillNode();

				// Radial (circular) gradient
				} else {

					var r = gradient.r,
						sizex = r * 2,
						sizey = r * 2,
						cx = gradient.cx,
						cy = gradient.cy,
						radialReference = elem.radialReference,
						bBox,
						applyRadialGradient = function () {
							if (radialReference) {
								bBox = wrapper.getBBox();
								cx += (radialReference[0] - bBox.x) / bBox.width - 0.5;
								cy += (radialReference[1] - bBox.y) / bBox.height - 0.5;
								sizex *= radialReference[2] / bBox.width;
								sizey *= radialReference[2] / bBox.height;
							}
							fillAttr = 'src="' + defaultOptions.global.VMLRadialGradientURL + '" ' +
								'size="' + sizex + ',' + sizey + '" ' +
								'origin="0.5,0.5" ' +
								'position="' + cx + ',' + cy + '" ' +
								'color2="' + color2 + '" ';

							addFillNode();
						};

					// Apply radial gradient
					if (wrapper.added) {
						applyRadialGradient();
					} else {
						// We need to know the bounding box to get the size and position right
						wrapper.onAdd = applyRadialGradient;
					}

					// The fill element's color attribute is broken in IE8 standards mode, so we
					// need to set the parent shape's fillcolor attribute instead.
					ret = color1;
				}

			// Gradients are not supported for VML stroke, return the first color. #722.
			} else {
				ret = stopColor;
			}

		// if the color is an rgba color, split it and add a fill node
		// to hold the opacity component
		} else if (regexRgba.test(color) && elem.tagName !== 'IMG') {

			colorObject = Color(color);

			markup = ['<', prop, ' opacity="', colorObject.get('a'), '"/>'];
			createElement(this.prepVML(markup), null, null, elem);

			ret = colorObject.get('rgb');


		} else {
			var propNodes = elem.getElementsByTagName(prop); // 'stroke' or 'fill' node
			if (propNodes.length) {
				propNodes[0].opacity = 1;
				propNodes[0].type = 'solid';
			}
			ret = color;
		}

		return ret;
	},

	/**
	 * Take a VML string and prepare it for either IE8 or IE6/IE7.
	 * @param {Array} markup A string array of the VML markup to prepare
	 */
	prepVML: function (markup) {
		var vmlStyle = 'display:inline-block;behavior:url(#default#VML);',
			isIE8 = this.isIE8;

		markup = markup.join('');

		if (isIE8) { // add xmlns and style inline
			markup = markup.replace('/>', ' xmlns="urn:schemas-microsoft-com:vml" />');
			if (markup.indexOf('style="') === -1) {
				markup = markup.replace('/>', ' style="' + vmlStyle + '" />');
			} else {
				markup = markup.replace('style="', 'style="' + vmlStyle);
			}

		} else { // add namespace
			markup = markup.replace('<', '<hcv:');
		}

		return markup;
	},

	/**
	 * Create rotated and aligned text
	 * @param {String} str
	 * @param {Number} x
	 * @param {Number} y
	 */
	text: SVGRenderer.prototype.html,

	/**
	 * Create and return a path element
	 * @param {Array} path
	 */
	path: function (path) {
		var attr = {
			// subpixel precision down to 0.1 (width and height = 1px)
			coordsize: '10 10'
		};
		if (isArray(path)) {
			attr.d = path;
		} else if (isObject(path)) { // attributes
			extend(attr, path);
		}
		// create the shape
		return this.createElement('shape').attr(attr);
	},

	/**
	 * Create and return a circle element. In VML circles are implemented as
	 * shapes, which is faster than v:oval
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} r
	 */
	circle: function (x, y, r) {
		var circle = this.symbol('circle');
		if (isObject(x)) {
			r = x.r;
			y = x.y;
			x = x.x;
		}
		circle.isCircle = true; // Causes x and y to mean center (#1682)
		circle.r = r;
		return circle.attr({ x: x, y: y });
	},

	/**
	 * Create a group using an outer div and an inner v:group to allow rotating
	 * and flipping. A simple v:group would have problems with positioning
	 * child HTML elements and CSS clip.
	 *
	 * @param {String} name The name of the group
	 */
	g: function (name) {
		var wrapper,
			attribs;

		// set the class name
		if (name) {
			attribs = { 'className': PREFIX + name, 'class': PREFIX + name };
		}

		// the div to hold HTML and clipping
		wrapper = this.createElement(DIV).attr(attribs);

		return wrapper;
	},

	/**
	 * VML override to create a regular HTML image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function (src, x, y, width, height) {
		var obj = this.createElement('img')
			.attr({ src: src });

		if (arguments.length > 1) {
			obj.attr({
				x: x,
				y: y,
				width: width,
				height: height
			});
		}
		return obj;
	},

	/**
	 * For rectangles, VML uses a shape for rect to overcome bugs and rotation problems
	 */
	createElement: function (nodeName) {
		return nodeName === 'rect' ? this.symbol(nodeName) : SVGRenderer.prototype.createElement.call(this, nodeName);	
	},

	/**
	 * In the VML renderer, each child of an inverted div (group) is inverted
	 * @param {Object} element
	 * @param {Object} parentNode
	 */
	invertChild: function (element, parentNode) {
		var ren = this,
			parentStyle = parentNode.style,
			imgStyle = element.tagName === 'IMG' && element.style; // #1111

		css(element, {
			flip: 'x',
			left: pInt(parentStyle.width) - (imgStyle ? pInt(imgStyle.top) : 1),
			top: pInt(parentStyle.height) - (imgStyle ? pInt(imgStyle.left) : 1),
			rotation: -90
		});

		// Recursively invert child elements, needed for nested composite shapes like box plots and error bars. #1680, #1806.
		each(element.childNodes, function (child) {
			ren.invertChild(child, element);
		});
	},

	/**
	 * Symbol definitions that override the parent SVG renderer's symbols
	 *
	 */
	symbols: {
		// VML specific arc function
		arc: function (x, y, w, h, options) {
			var start = options.start,
				end = options.end,
				radius = options.r || w || h,
				innerRadius = options.innerR,
				cosStart = mathCos(start),
				sinStart = mathSin(start),
				cosEnd = mathCos(end),
				sinEnd = mathSin(end),
				ret;

			if (end - start === 0) { // no angle, don't show it.
				return ['x'];
			}

			ret = [
				'wa', // clockwise arc to
				x - radius, // left
				y - radius, // top
				x + radius, // right
				y + radius, // bottom
				x + radius * cosStart, // start x
				y + radius * sinStart, // start y
				x + radius * cosEnd, // end x
				y + radius * sinEnd  // end y
			];

			if (options.open && !innerRadius) {
				ret.push(
					'e',
					M,
					x,// - innerRadius,
					y// - innerRadius
				);
			}

			ret.push(
				'at', // anti clockwise arc to
				x - innerRadius, // left
				y - innerRadius, // top
				x + innerRadius, // right
				y + innerRadius, // bottom
				x + innerRadius * cosEnd, // start x
				y + innerRadius * sinEnd, // start y
				x + innerRadius * cosStart, // end x
				y + innerRadius * sinStart, // end y
				'x', // finish path
				'e' // close
			);

			ret.isArc = true;
			return ret;

		},
		// Add circle symbol path. This performs significantly faster than v:oval.
		circle: function (x, y, w, h, wrapper) {

			if (wrapper) {
				w = h = 2 * wrapper.r;
			}

			// Center correction, #1682
			if (wrapper && wrapper.isCircle) {
				x -= w / 2;
				y -= h / 2;
			}

			// Return the path
			return [
				'wa', // clockwisearcto
				x, // left
				y, // top
				x + w, // right
				y + h, // bottom
				x + w, // start x
				y + h / 2,     // start y
				x + w, // end x
				y + h / 2,     // end y
				//'x', // finish path
				'e' // close
			];
		},
		/**
		 * Add rectangle symbol path which eases rotation and omits arcsize problems
		 * compared to the built-in VML roundrect shape. When borders are not rounded,
		 * use the simpler square path, else use the callout path without the arrow.
		 */
		rect: function (x, y, w, h, options) {
			return SVGRenderer.prototype.symbols[
				!defined(options) || !options.r ? 'square' : 'callout'
			].call(0, x, y, w, h, options);
		}
	}
};
JSComtrade.VMLRenderer = VMLRenderer = function () {
	this.init.apply(this, arguments);
};
VMLRenderer.prototype = merge(SVGRenderer.prototype, VMLRendererExtension);

	// general renderer
	Renderer = VMLRenderer;
}

// This method is used with exporting in old IE, when emulating SVG (see #2314)
SVGRenderer.prototype.measureSpanWidth = function (text, styles) {
	var measuringSpan = doc.createElement('span'),
		offsetWidth,
	textNode = doc.createTextNode(text);

	measuringSpan.appendChild(textNode);
	css(measuringSpan, styles);
	this.box.appendChild(measuringSpan);
	offsetWidth = measuringSpan.offsetWidth;
	discardElement(measuringSpan); // #2463
	return offsetWidth;
};


/* ****************************************************************************
 *                                                                            *
 * END OF INTERNET EXPLORER <= 8 SPECIFIC CODE                                *
 *                                                                            *
 *****************************************************************************/
/* ****************************************************************************
 *                                                                            *
 * START OF ANDROID < 3 SPECIFIC CODE. THIS CAN BE REMOVED IF YOU'RE NOT      *
 * TARGETING THAT SYSTEM.                                                     *
 *                                                                            *
 *****************************************************************************/
var CanVGRenderer,
	CanVGController;

if (useCanVG) {
	/**
	 * The CanVGRenderer is empty from start to keep the source footprint small.
	 * When requested, the CanVGController downloads the rest of the source packaged
	 * together with the canvg library.
	 */
	JSComtrade.CanVGRenderer = CanVGRenderer = function () {
		// Override the global SVG namespace to fake SVG/HTML that accepts CSS
		SVG_NS = 'http://www.w3.org/1999/xhtml';
	};

	/**
	 * Start with an empty symbols object. This is needed when exporting is used (exporting.src.js will add a few symbols), but 
	 * the implementation from SvgRenderer will not be merged in until first render.
	 */
	CanVGRenderer.prototype.symbols = {};

	/**
	 * Handles on demand download of canvg rendering support.
	 */
	CanVGController = (function () {
		// List of renderering calls
		var deferredRenderCalls = [];

		/**
		 * When downloaded, we are ready to draw deferred charts.
		 */
		function drawDeferred() {
			var callLength = deferredRenderCalls.length,
				callIndex;

			// Draw all pending render calls
			for (callIndex = 0; callIndex < callLength; callIndex++) {
				deferredRenderCalls[callIndex]();
			}
			// Clear the list
			deferredRenderCalls = [];
		}

		return {
			push: function (func, scriptLocation) {
				// Only get the script once
				if (deferredRenderCalls.length === 0) {
					getScript(scriptLocation, drawDeferred);
				}
				// Register render call
				deferredRenderCalls.push(func);
			}
		};
	}());

	Renderer = CanVGRenderer;
} // end CanVGRenderer

/* ****************************************************************************
 *                                                                            *
 * END OF ANDROID < 3 SPECIFIC CODE                                           *
 *                                                                            *
 *****************************************************************************/

/* ****************************************************************************
 *                                                                            *
 * START OF Pointer CODE                                           			  *
 *                                                                            *
 *****************************************************************************/
var Pointer = JSComtrade.Pointer = function( chart ){
	this.init(chart);
};

Pointer.prototype = {
	/**
	* Initialize Pointer
	*/
	init: function(chart){
		
		//store references
		this.chart = chart;
		
		this.setDOMEvents();
	},
	getButton: function(e){
		if(document.implementation.hasFeature("MouseEvents", "2.0")){
			return e.button;
		}else{
			switch(e.button){
			case 0:
			case 1:
			case 3:
			case 5:
			case 7:
				return 0;
			case 2:
			case 6:
				return 2;
			case 4:
				return 1;
			}
		}
	},
	/**
	 * Add crossbrowser support for chartX,chartY and samplePoint
	 * @param {Object} e The event object in standard browsers
	 */
	normalize: function(e, chartPosition){
		var chartX,
			chartY,
			plotX,
			plotY,
			samplePoint,
			ePos;
		// common IE normalizing
		e = e || window.event;
		// Framework specific normalizing (#1165)
		e = washMouseEvent(e);

		// More IE normalizing, needs to go after washMouseEvent
		if (!e.target) {
			e.target = e.srcElement;
		}
		// iOS (#2757)
		ePos = e.touches ?  (e.touches.length ? e.touches.item(0) : e.changedTouches[0]) : e;

		// Get mouse position
		if (!chartPosition) {
			this.chartPosition = chartPosition = offset(this.chart.container);
		}
		// chartX and chartY
		if (ePos.pageX === UNDEFINED) { // IE < 9. #886.
			chartX = mathMax(e.x, e.clientX - chartPosition.left); // #2005, #2129: the second case is 
				// for IE10 quirks mode within framesets
			chartY = e.y;			
		} else {
			chartX = ePos.pageX - chartPosition.left;
			chartY = ePos.pageY - chartPosition.top;
		}
		
		//add the scroll
		var scrolltop = $(this.chart.container).scrollTop();
		
		plotX = chartX - this.chart.plotLeft;
		plotY = chartY - this.chart.plotTop;

		return extend(e, {
			chartX: mathRound(chartX),
			chartY: mathRound(chartY),
			plotX: mathRound(plotX),
			plotY: mathRound(plotY),
			chartYscroll:mathRound(chartY+scrolltop),
			plotYscroll:mathRound(plotY+scrolltop)
		});
	},
	getCursorByMouse: function(e){
		var cursor;
		var button = this.getButton(e);
		if( button == 0 )
			return this.chart.primaryCursor;
		else if( button == 2 )
			return this.chart.secondaryCursor;
		return null;
	},
	pointInRect: function(x, y, rectBox){
		if( rectBox && (x >= rectBox.x && x <= rectBox.x+rectBox.width) && 
				(y >= rectBox.y && y <= rectBox.y+rectBox.height) ){
	
			return true;
		}
		return false;
	},
	/*
	 * muse called after normalize
	 */
	mouseInComtradePlot: function(e){
		var rect = this.chart.axis.getComtradeBox();
		return this.pointInRect( e.chartX, e.chartY, rect);
	},
	onContainerMouseDown: function(e){
		e = this.normalize(e);
		
		if( this.mouseInComtradePlot(e) ){
			var cursor = this.getCursorByMouse(e);
			if( cursor && cursor.enable()){
				cursor.active(true);
				cursor.moveTo(e.chartX);
				this.refreshTooltip(e);
				this.synCursor(cursor);
				this.refreshChannelValue();
			}			
		}		
	},
	onContainerMouseUp: function(e){
		e = this.normalize(e);

		var cursor = this.getCursorByMouse(e);
		if( cursor ){
			cursor.active(false);
		}
		if( this.chart.tooltip)
			this.chart.tooltip.hide();
	},
	onContainerMouseMove: function(e){
		var chart = this.chart;
		e = this.normalize(e);
		if( this.mouseInComtradePlot(e) ){
			if(chart.PageturnerDisplayed){
				if( !this.pointInRect(e.chartX, e.chartYscroll, chart.getLeftPageturnerBox()) &&
						!this.pointInRect(e.chartX, e.chartYscroll, chart.getRightPageturnerBox())){
					chart.showPageturner(false);
				}
			}
			if( this.chart.primaryCursor.active()){
				this.chart.primaryCursor.moveTo( e.chartX );
				this.refreshTooltip(e);
				this.synCursor(this.chart.primaryCursor);
				this.refreshChannelValue();
			}
			if( this.chart.secondaryCursor.active()){
				this.chart.secondaryCursor.moveTo( e.chartX );
				this.refreshTooltip(e);
				this.synCursor(this.chart.secondaryCursor);
				this.refreshChannelValue();
			}			
		}/*else{
			var rect = this.chart.plotBox;
			//rect.x += this.chart.turnerLeftBox.width;
			if( this.pointInRect(e.chartX, e.chartY, rect)){
				chart.showPageturner(false);
			}else{
				if( e.chartX < rect.x || e.chartX > rect.x+rect.width ){
					chart.showPageturner(true);
				}
			}			
		}*/
		if(this.pointInRect(e.chartX, e.chartYscroll, this.chart.getLeftPageturnerBox()) ||
				this.pointInRect(e.chartX, e.chartYscroll, this.chart.getRightPageturnerBox())){
			if(!chart.PageturnerDisplayed){
				chart.showPageturner(true);
			}
		}
		
	},
	synCursor:function(bench){
		if( bench == null || this.chart.options.chart.cursorSyn == false ){
			return;
		}
		var chart = this.chart,
			comtradeOptions = chart.options.comtrade,
			lineFreq = comtradeOptions.lineFreq,
			lineFreq = 50,
			dt = 1000/lineFreq;
			ds = dt * chart.options.chart.pxPerMS;
			
		var rect = this.chart.axis.getComtradeBox();
		if( bench == this.chart.primaryCursor ){
			//primary cursor as the benchmark, secondary cursor is at the right of it
			var x1 = bench.x,
				denX = x1 + ds;
			if( denX > rect.x + rect.width ){
				denX = rect.x + rect.width;
			}
			this.chart.secondaryCursor.moveTo( denX );
		}else{
			var x1 = bench.x,
			denX = x1 - ds;
			if( denX < rect.x ){
				denX = rect.x ;
			}
			this.chart.primaryCursor.moveTo( denX );
		}
	},
	refreshChannelValue:function(){
		var x1 = this.chart.primaryCursor.x,
			x2 = this.chart.secondaryCursor.x,
			axis = this.chart.axis,
			t1 = axis.getTimeByPoint(x1),
			t2 = axis.getTimeByPoint(x2),
			s1 = axis.getNearestSample(t1),
			s2 = axis.getNearestSample(t2);

		this.chart.channels.updateValue(s1,s2);			
	},
	refreshTooltip: function(e){
		if (e.chartX === UNDEFINED) {
			e = this.normalize(e);
		}
		var chart = this.chart,
			axis = chart.axis,
			comtradeOptions = chart.options.comtrade,
			channelsOptions = chart.options.comtrade.channels;
		var curtime = axis.getTimeByPoint(e.chartX),
		 	leftSample = axis.getLeftSample(curtime);
		var onchannel = [];
		//取得在此时间点时值为1的开关量通道
		for( var i = comtradeOptions.achannelCount; i < comtradeOptions.achannelCount+comtradeOptions.dchannelCount; i++){
			var cn = channelsOptions[i];
			var leftValue;
			for( var changedi in cn.data ){
				var cdi = cn.data[changedi];
				if( changedi == 0 ){
					leftValue = cdi[1];
				}
				if( cdi[0] > leftSample && changedi != 0 ){
					var precdi = cn.data[changedi-1];
					leftValue = precdi[1];
					break;
				}
			}
			if( leftValue == 1 ){
				//变位通道
				onchannel[onchannel.length] = cn.name;
			}
		}
		//组织tooltip文字 
		var text = '<span style="font-weight:bold">时间:'+curtime+'</span><br><br>';
		text += '<span>当前时间"动作"的开关</span><br>';
		for( var index = 0; index < onchannel.length; index++ ){
			text += '<span style="font-weight:bold">'+onchannel[index]+'</span><br>';
		}
		if( this.chart.tooltip)
			this.chart.tooltip.refresh(e, text);
	},
	onClick:function(e){
		var chart = this.chart;
		e = this.normalize(e);
		
		if( this.pointInRect( e.chartX, e.chartYscroll, chart.getLeftPageturnerBox())){
			this.clickLeftPageturner();
		}
		if( this.pointInRect( e.chartX, e.chartYscroll, chart.getRightPageturnerBox())){
			this.clickRightPageturner();
		}
	},
	clickTopPageturner:function(){
		var chart = this.chart;
		if( chart.curVPage > 0 ){
			chart.curVPage--;
			chart.turnPage(false);
		}
	},
	clickBottomPageturner:function(){
		var chart = this.chart;
		if( chart.curVPage < chart.VPages-1 ){
			chart.curVPage++;
			chart.turnPage(false);
		}
	},
	clickLeftPageturner:function(){
		var chart = this.chart;
		if( chart.curHPage > 0 ){
			chart.curHPage--;
			chart.turnPage(true);
		}
	},
	clickRightPageturner:function(){
		var chart = this.chart;
		if( chart.curHPage < chart.HPages-1 ){
			chart.curHPage++;
			chart.turnPage(true);
		}		
	},
	/**
	 * Set the JS DOM events on the container and document. This method should contain
	 * a one-to-one assignment between methods and their handlers. Any advanced logic should
	 * be moved to the handler reflecting the event's name.
	 */
	setDOMEvents: function(){
		var pointer = this;
			container = pointer.chart.container;
		container.onmousedown = function(e){
			pointer.onContainerMouseDown(e);
		};
		container.onmousemove = function(e){
			pointer.onContainerMouseMove(e);
		};
		container.onmouseup = function(e){
			pointer.onContainerMouseUp(e);
		}
		container.onclick = function(e){
			pointer.onClick(e);
		}
		
		
	}
	
};
/* ****************************************************************************
 *                                                                            *
 * END OF Pointer CODE                                           			  *
 *                                                                            *
 *****************************************************************************/

/* ****************************************************************************
 *                                                                            *
 * START OF Cursor                                          				  *
 *                                                                            *
 *****************************************************************************/
var Cursor = JSComtrade.Cursor = function(chart, cursorOption){
	this.init(chart, cursorOption);
};

Cursor.prototype = {
	init: function(chart, cursorOption){
		this.chart = chart;
		this.cursorOption = cursorOption;
		var cbox = chart.axis.getComtradeBox();
		this.x = 0;
		this._active = false;
		this._enable = this.cursorOption.enable;
	},
	render: function(destinationX){		
		var finalX = destinationX? destinationX : this.x;
			renderer = this.chart.renderer,

			gAttr = {'class': PREFIX + this.cursorOption.type+'Cursor',
					zIndex:4};
		this.cursorGroup = renderer.g('axis')
				.attr(gAttr)
				.add();
		this.cursorLine = renderer.path([
		     M,
		     finalX,
		     this.chart.plotTop,
		     L,
		     finalX,
		     this.chart.plotTop+this.chart.pageHeight		     
		     ])
			.css(this.cursorOption.lineStyle)
			.add(this.cursorGroup);		
	},
	moveTo: function(destinationX){
		if( !this.enable())
			return;
		var time = this.chart.axis.getTimeByPoint(destinationX);
		
		var bgAttr = {
				'd':[M, destinationX, this.chart.plotTop, L, destinationX, this.chart.plotTop+this.chart.pageHeight]
		}
		if( this.cursorLine ){ //move
			this.cursorLine.attr(bgAttr);
		}else{//create			
			this.render(destinationX);
		}
		this.x = destinationX;
	},
	enable: function(){
		if( arguments.length == 0 )
			return this._enable;
		else{
			this._enable = arguments[0];
		}
	},
	active: function(){
		if( arguments.length == 0 ){
			return this._active;
		}else{
			this._active = arguments[0];
		}		
	}
};
/* ****************************************************************************
 *                                                                            *
 * END OF Cursor                                          				      *
 *                                                                            *
 *****************************************************************************/

/* ****************************************************************************
 *                                                                            *
 * START OF Axis                                          				  *
 *                                                                            *
 *****************************************************************************/
var Axis = JSComtrade.Axis = function(chart, userOptions){
	this.init(chart, userOptions);
};

Axis.prototype = {
	
	init : function(chart, userOptions){
		var axis = this;
			axis.chart = chart;
			axis.axisOptions = userOptions;
	},
	/*
	 * 绘制到底部,所以底部必须有足够空间
	 */
	render : function(){
		var axis = this,
			chart = this.chart,
			renderer = chart.axisrenderer,
			comtradeOptions = chart.options.comtrade,
			labelOptions = axis.axisOptions.label,
			channelMargin = chart.options.chart.channelMargin,
			pxPerMs = chart.options.chart.pxPerMS,
			minSpace = 40,
			maxTime = comtradeOptions.times[comtradeOptions.times.length-1]-comtradeOptions.sampleOffset,
			attrAttr={stroke:axis.axisOptions.style.color,
				'stroke-width': axis.axisOptions.style.stokeWidth},
			gAttr = {zIndex:2};
		if( this.axisgroup ){
			this.axisgroup.destroy();
			this.axisgroup = null;
		}
		if( this.labelgroup ){
			this.labelgroup.destroy();
			this.labelgroup = null;
		}
		var warp = this.axisgroup = renderer.g('axis')
			.attr(gAttr)
			.add();
		var labelg;
		if( labelOptions.enable)
			this.labelgroup = labelg = renderer.g('axis-label').attr(gAttr).add();
		var textoffset = parseInt(labelOptions.style.fontSize);
		var cBox = this.getComtradeBox();
		var startY = 0,
			endY = axis.axisOptions.height,
			textY = endY+textoffset;
		var time0pos = cBox.x;
		if( chart.curHPage == 0 ){//横向第一页			
			if( comtradeOptions.sampleOffset > 0 ){
				var x = cBox.x;
				time0pos += (comtradeOptions.sampleOffset * pxPerMs);
				
				//在起始点画采样开始时间
				renderer.path([
				  		     M,
				  		     x,
				  		     startY,
				  		     L,
				  		     x,
				  		     endY	     
				  		     ])
				  			.attr(attrAttr)
				  			.add(warp);
				if(labelOptions.enable){
					//绘制标签
					renderer.text(
							-comtradeOptions.sampleOffset,
							x,
							textY,
							false)
					.attr({
						align: 'center'
					})
					.css(labelOptions.style)
					.add(labelg);
				}
			}
			var width100ms = pxPerMs*100;
			var count = 0;
			var Lastpos = time0pos;
			for( var pos = time0pos; pos <= cBox.x + cBox.width ; pos += width100ms){
				renderer.path([
					  		     M,
					  		     pos,
					  		     startY,
					  		     L,
					  		     pos,
					  		     endY	     
					  		     ])
					  			.attr(attrAttr)
					  			.add(warp);
					if(labelOptions.enable){
						//绘制标签
						renderer.text(
								count,
								pos,
								textY,
								false)
						.attr({
							align: 'center'
						})
						.css(labelOptions.style)
						.add(labelg);
					}
					Lastpos = pos;
					count += 100;
			}
			if( count > maxTime){
				//绘制最后一个采样点
				x = Lastpos + (maxTime-(count-100))*pxPerMs;
				renderer.path([
				  		     M,
				  		     x,
				  		     startY,
				  		     L,
				  		     x,
				  		     endY	     
				  		     ])
				  			.attr(attrAttr)
				  			.add(warp);
				if(labelOptions.enable && (x-Lastpos) > minSpace){
					//绘制标签
					renderer.text(
							maxTime,
							x,
							textY,
							false)
					.attr({
						align: 'center'
					})
					.css(labelOptions.style)
					.add(labelg);
				}
			}else{
				//绘制本页最后一个点
				x = cBox.x+cBox.width;
				renderer.path([
				  		     M,
				  		     x,
				  		     startY,
				  		     L,
				  		     x,
				  		     endY	     
				  		     ])
				  			.attr(attrAttr)
				  			.add(warp);
				if(labelOptions.enable && (x-Lastpos) > minSpace){
					//绘制标签
					renderer.text(
							chart.spanPrePage-comtradeOptions.sampleOffset,
							x,
							textY,
							false)
					.attr({
						align: 'center'
					})
					.css(labelOptions.style)
					.add(labelg);
				}
			}
			
		}else{ //非第一页
			var startTime = chart.curHPage * chart.spanPrePage - comtradeOptions.sampleOffset;
			//绘制第一个点
			var x = cBox.x;
			time0pos = x;
			
			//在起始点画采样开始时间
			renderer.path([
			  		     M,
			  		     x,
			  		     startY,
			  		     L,
			  		     x,
			  		     endY	     
			  		     ])
			  			.attr(attrAttr)
			  			.add(warp);
			var distanceToNext = (100 - startTime%100)*pxPerMs;
			
			if(labelOptions.enable && distanceToNext>minSpace){
				//绘制标签
				renderer.text(
						startTime,
						x,
						textY,
						false)
				.attr({
					align: 'center'
				})
				.css(labelOptions.style)
				.add(labelg);
			}
			
			time0pos += distanceToNext;
			var width100ms = pxPerMs*100;
			var count = mathCeil(startTime/100)*100;
			var Lastpos = time0pos;
			for( var pos = time0pos; pos <= cBox.x+cBox.width ; pos += width100ms){
				renderer.path([
					  		     M,
					  		     pos,
					  		     startY,
					  		     L,
					  		     pos,
					  		     endY	     
					  		     ])
					  			.attr(attrAttr)
					  			.add(warp);
					if(labelOptions.enable){
						//绘制标签
						renderer.text(
								count,
								pos,
								textY,
								false)
						.attr({
							align: 'center'
						})
						.css(labelOptions.style)
						.add(labelg);
					}
					Lastpos = pos;
					count += 100;
			}
			
			if( count > maxTime){
				//绘制最后一个采样点
				x = Lastpos + (maxTime-(count-100))*pxPerMs;
				renderer.path([
				  		     M,
				  		     x,
				  		     startY,
				  		     L,
				  		     x,
				  		     endY	     
				  		     ])
				  			.attr(attrAttr)
				  			.add(warp);
				if(labelOptions.enable && (x-Lastpos) > minSpace){
					//绘制标签
					renderer.text(
							maxTime,
							x,
							textY,
							false)
					.attr({
						align: 'center'
					})
					.css(labelOptions.style)
					.add(labelg);
				}
			}else{
				//绘制最后一个点
				x = cBox.x+cBox.width;
				renderer.path([
				  		     M,
				  		     x,
				  		     startY,
				  		     L,
				  		     x,
				  		     endY	     
				  		     ])
				  			.attr(attrAttr)
				  			.add(warp);
				if(labelOptions.enable && (x-Lastpos) > minSpace){
					//绘制标签
					renderer.text(
							startTime+chart.spanPrePage,
							x,
							textY,
							false)
					.attr({
						align: 'center'
					})
					.css(labelOptions.style)
					.add(labelg);
				}
			}			
		}
	},
	/*
	 * 取得本页的录波图形的有效区域,只关注X轴方向，Y轴方向和plotBox一致
	 */
	getComtradeBox:function(){
		var chart = this.chart,
			startTime = this.getStartTime(),
			endTime = this.getEndTime(),
			plotBox = chart.plotBox,
			rect = { x:plotBox.x + chart.options.chart.channelMargin[3], 
					y:plotBox.y, 
					width:(endTime - startTime)*chart.options.chart.pxPerMS, 
					height:plotBox.height};
			return rect;
	},
	/*
	 * 根据在图形中的位置计算位置对应的时间(相对于chart的位置),这种计算方法需保证时间均匀分布
	 */
	getTimeByPoint:function(pointX){
		var chart = this.chart,
			comtradeOptions = chart.options.comtrade,
			channelMargin = chart.options.chart.channelMargin,
			startTime = this.getStartTime(),
			maxTime = comtradeOptions.times[comtradeOptions.times.length-1]-comtradeOptions.sampleOffset,
			startX = chart.plotLeft+channelMargin[3];
		if( pointX < chart.poltLeft || pointX > (chart.plotLeft+chart.plotWidth)){
			return invaildTime-1;
		}

		var span = (pointX - startX)/chart.options.chart.pxPerMS;
		var time = JSComtrade.numberFormat( (startTime + span), 2);
		if( time > maxTime )
			return invaildTime-1;
		return JSComtrade.numberFormat( (startTime + span), 2);		
	},
	/*
	 * 根据采样点索引号取得在本页图形中的位置(相对于chart的位置)，小于0的值表示采样点不在本页中
	 */
	getPointBySample:function(sampleIndex){
		var chart = this.chart,
			comtradeOptions = chart.options.comtrade,
			cbox = this.getComtradeBox();
		if( sampleIndex < 0 || sampleIndex >= comtradeOptions.sampleCount )
			return -1;
		var time = comtradeOptions.times[sampleIndex];
		var startTime = this.getStartTime(),
			endTime = this.getEndTime();
		if( time < startTime || time > endTime )
			return -1;
		var offset = (time - startTime) * chart.options.chart.pxPerMS;
		return offset+cbox.x;
	},
	getSampleTime:function(sampleIndex){
		var chart = this.chart,
		comtradeOptions = chart.options.comtrade;
		if( sampleIndex < 0 || sampleIndex >= comtradeOptions.sampleCount )
			return -1;
		return comtradeOptions.times[sampleIndex];
	},
	/*
	 * 取得当前页的起始时间
	 */
	getStartTime:function(){
		var chart = this.chart,
			comtradeOptions = chart.options.comtrade,
			startTime = chart.curHPage * chart.spanPrePage - comtradeOptions.sampleOffset;
		return startTime;
	},
	/*
	 * 取得当前页的结束时间
	 */
	getEndTime:function(){
		var chart = this.chart,
			comtradeOptions = chart.options.comtrade,
			startTime = this.getStartTime(),
			maxTime = comtradeOptions.times[comtradeOptions.times.length-1]-comtradeOptions.sampleOffset,
			endTime = mathMin( (startTime + chart.spanPrePage), maxTime );
		return endTime;
	},
	/*
	 * 取得小于指定时间的最近的采样点（0开始计数）
	 */
	getLeftSample:function(time){
		var chart = this.chart,
			comtradeOptions = chart.options.comtrade;
		//time += comtradeOptions.sampleOffset;
		for( var i in comtradeOptions.times ){
			if( comtradeOptions.times[i] > time ){
				if( i > 0 )
					return (i-1);
				else
					return 0;
			}
		}
		return (comtradeOptions.times.length-1);
	},
	/*
	 * 取得第一个大于或等于指定时间的采样点（0开始计数）
	 */
	getRightSample:function(time){
		var chart = this.chart,
			comtradeOptions = chart.options.comtrade;
		//time += comtradeOptions.sampleOffset;
		for( var i in comtradeOptions.times ){
			if( comtradeOptions.times[i] >= time ){
				return i;
			}
		}
		return (comtradeOptions.times.length-1);
	},
	/*
	 * 取得离指定时间最近的采样点，可能是左边也可能是右边.（0开始计数）
	 */
	getNearestSample:function(time){
		var chart = this.chart,
			comtradeOptions = chart.options.comtrade;
		for( var i in comtradeOptions.times ){
			if( comtradeOptions.times[i] > time ){
				if( i > 0 ){
					if( mathAbs(comtradeOptions.times[i-1]-time) < mathAbs(comtradeOptions.times[i]-time) ){
						return (i-1);
					}else
						return i;
				}
				else
					return 0;
			}
		}
	},
	getSampleRate:function(s){
		var chart = this.chart,
			comtradeOptions = chart.options.comtrade,
			rates = comtradeOptions.rates;
		var totalSample = 0;
		for(var i in rates){
			var r = rates[i];
			totalSample += r[1];
			if( s < totalSample ){
				return r[0];
			}
		}
		return 1200;
	}
};
/* ****************************************************************************
 *                                                                            *
 * END OF Axis                                          				      *
 *                                                                            *
 *****************************************************************************/

var Channels = JSComtrade.Channels = function(chart, userOptions){
	this.init(chart, userOptions);
};


Channels.prototype = {
	init:function(chart, userOptions){
		this.chart = chart;
		this.comtradeOptions = userOptions;
		this.channelsOptions = userOptions.channels;
		this.firstUpdateValue = false;
	},
	render:function(){
		var channels = this,
			chart = this.chart,
			axis = chart.axis,
			renderer = chart.renderer,
			chartOptions = chart.options.chart,
			comtradeOptions = chart.options.comtrade,
			channelsOptions = chart.options.comtrade.channels,
			maxIValue = channels.comtradeOptions.maxIValue,
			maxUValue = channels.comtradeOptions.maxUValue,
			maxOtherValue = channels.comtradeOptions.maxOtherValue,
			channelsPrePage = chart.channelsPrePage,
			totalChannel = comtradeOptions.achannelCount + comtradeOptions.dchannelCount,
			colorA = chartOptions.channelA.color,
			colorB = chartOptions.channelB.color,
			colorC = chartOptions.channelC.color,
			colorN = chartOptions.channelN.color,
			channelHeight = chartOptions.channel.height,
			channelColor = chartOptions.channel.color,
			channelTotalHeight = channelHeight + chartOptions.channelMargin[0]+ chartOptions.channelMargin[2],
			channelNameOptions = chartOptions.channelName,
			halfChannelH = (channelHeight-channelNameOptions.height)/2,
			cbox = axis.getComtradeBox(),
			startX = cbox.x,
			maxX = cbox.x + cbox.width;
		var startIndex = chart.curVPage * channelsPrePage,
			endIndex = startIndex + channelsPrePage;
		if( endIndex >= totalChannel ){
			endIndex = totalChannel;
		}
		
		this.vArray = null;
		this.vArray = new Array();
		this.idArray = null;
		this.idArray = new Array();
		this.nameArray = null;
		this.nameArray = new Array();
		if( this.channelG ){
			this.channelG.destroy();
			this.channelG = null;
			
		}
		
		var warp = this.channelG = renderer.g('channels')
			.add();
		var bodyAttr={
				stroke: channelColor,
				'stroke-width': 1
				};
		var labelAttr = {fontSize : channelNameOptions.fontSize, 
				color : channelNameOptions.color};
		//计算并保存当前页所有采样点的X轴坐标，减少计算次数
		var firstSample = axis.getRightSample(axis.getStartTime()),
			endSample = axis.getLeftSample(axis.getEndTime()),
			exfirstSample = axis.getLeftSample(axis.getStartTime()),
			exendSample = axis.getRightSample(axis.getEndTime());
		var samplePos = [];
		var cit = 0;
		for( var it = firstSample; it <= endSample; it++ ){
			samplePos[cit] = axis.getPointBySample(it);
			cit++;			
		}
		this.canRenderValue = false;
		//start draw
		for( var i = startIndex; i < endIndex; i++ ){
			var cn = channelsOptions[i];
			var warpC = renderer.g('channel-'+i).add(warp);
			var startY =  chart.plotTop + (i-startIndex)*channelTotalHeight+ chartOptions.channelMargin[0];
	
			//绘制名称
			this.nameArray[i-startIndex] = renderer.text(
					cn.name,
					startX,
					startY+channelNameOptions.height-4,
					false)
			.attr({
				align: 'left'
			})
			.css(labelAttr)
			.add(warpC);
			
			this.idArray[i-startIndex] = i;
			//绘制值占位符
			this.vArray[i-startIndex] = renderer.text(
					'',
					startX ,
					startY+channelNameOptions.height-4,
					false)
			.attr({
				align: 'left'
			})
			.css(labelAttr)
			.add(warpC);
			
			var topY = startY + channelNameOptions.height,
				midY = startY + (channelHeight - channelNameOptions.height)/2 + channelNameOptions.height,
				bottomY = startY + channelHeight;
				
			//绘制曲线外框
				renderer.path(
						[ M, 
						  startX, 
						  topY, 
						  L, 
						  maxX,
						  topY ])
						.attr(bodyAttr).add(warpC);
				renderer.path(
						[ M, 
						  startX, 
						  midY, 
						  L, 
						  maxX,
						  midY ])
						.attr(bodyAttr).css({'stroke-dasharray': '5, 5'}).add(warpC);
				renderer.path(
						[ M, 
						  startX, 
						  bottomY, 
						  L, 
						  maxX,
						  bottomY ])
						.attr(bodyAttr).add(warpC);
				renderer.path(
						[ M, 
						  startX, 
						  topY, 
						  L, 
						  startX,
						  bottomY ])
						.attr(bodyAttr).add(warpC);
			if( cn.type == "AI"){
				//绘制振幅标签
				var amplitude = cn.max;
				if( comtradeOptions.useCommonAmplitude ){
					switch( cn.unit ){
					case "A":
						amplitude = comtradeOptions.maxIValue;
						break;
					case "V":
						amplitude = comtradeOptions.maxUValue;
						break;
					default:
						amplitude = comtradeOptions.maxOtherValue;	
					}
				}
				renderer.text(
						amplitude,
						startX-2,
						topY,
						false)
				.attr({
					align: 'right',
					'dominant-baseline':'middle'
				})
				.css(labelAttr)
				.add(warpC);
				
				renderer.text(
						0,
						startX-2,
						midY,
						false)
				.attr({
					align: 'right',
					'dominant-baseline':'middle'
				})
				.css(labelAttr)
				.add(warpC);
				
				renderer.text(
						-amplitude,
						startX-2,
						bottomY,
						false)
				.attr({
					align: 'right',
					'dominant-baseline':'middle'
				})
				.css(labelAttr)
				.add(warpC);
				//绘制波形
				var cindex = 1;
				var pathdata=[];
				pathdata[0]=M;
				//保证图形从坐标0点开始画
				if( true ){
					var exfirstx = axis.getSampleTime(exfirstSample),
					exfirstvalue = cn.data[exfirstSample],
					firstx = axis.getSampleTime(firstSample),
					firstvalue = cn.data[firstSample];
					pathdata[1] = startX;				
					var zerovalue = firstvalue;
					if( firstx != exfirstx)
						zerovalue = (firstvalue-exfirstvalue)*(startX-exfirstx)/(firstx-exfirstx)+exfirstvalue;

					if( zerovalue < 0 ){
						pathdata[2] = midY + ( mathAbs(zerovalue)/amplitude * halfChannelH);
					}else if( zerovalue > 0 ){
						pathdata[2] = midY - ( mathAbs(zerovalue)/amplitude * halfChannelH);
					}
					else{
						pathdata[2] = midY;
					}
				}
				
				for( var it = firstSample; it <= endSample; it++ ){
					var samplex = samplePos[cindex-1],
						samplevalue = cn.data[it],
						sampley = 0;
					if( samplevalue < 0 ){
						sampley = midY + ( mathAbs(samplevalue)/amplitude * halfChannelH);
					}else if( samplevalue > 0 ){
						sampley = midY - ( mathAbs(samplevalue)/amplitude * halfChannelH);
					}
					else{
						sampley = midY;
					}

					pathdata[cindex*3]=L;
					pathdata[cindex*3+1] = samplex;
					pathdata[cindex*3+2] = sampley;
					cindex++;
				}
				if( chart.curHPage != chart.HPages-1 ){
					var exendx = axis.getSampleTime(exendSample),
					exendvalue = cn.data[exendSample],
					endx = axis.getSampleTime(endSample),
					endvalue = cn.data[endSample];
					pathdata[cindex*3]=L;
					pathdata[cindex*3+1] = maxX;
					var zerovalue = endvalue;
					if( endx != exendx )
						zerovalue = (exendvalue-endvalue)*(exendx-maxX)/(exendx-endx)+endvalue;
					if( zerovalue < 0 ){
						pathdata[cindex*3+2] = midY + ( mathAbs(zerovalue)/amplitude * halfChannelH);
					}else if( zerovalue > 0 ){
						pathdata[cindex*3+2] = midY - ( mathAbs(zerovalue)/amplitude * halfChannelH);
					}
					else{
						pathdata[cindex*3+2] = midY;
					}
				}
				var cc={stroke: channelColor,
						'stroke-width': 1};
				//根据相位区分颜色
				switch(cn.phase){
				case "A":
					cc.stroke = chartOptions.channelA.color;
					break;
				case "B":
					cc.stroke = chartOptions.channelB.color;
					break;
				case "C":
					cc.stroke = chartOptions.channelC.color;
					break;
				case "N":
					cc.stroke = chartOptions.channelN.color;
					break;
					default:{
						switch(parseInt(i)%4){
						case 0:
							cc.stroke = chartOptions.channelA.color;
							break;
						case 1:
							cc.stroke = chartOptions.channelB.color;
							break;
						case 2:
							cc.stroke = chartOptions.channelC.color;
							break;
						case 3:
							cc.stroke = chartOptions.channelN.color;
							break;							
						}
					}
				}
				renderer.path(pathdata)
						.attr(cc).add(warpC);
			}else{ //开关量通道
				//绘制波形
				var ditopY = midY - (channelHeight - channelNameOptions.height)/4,
					diheight = (channelHeight - channelNameOptions.height)/2;
				var firstChangedi = -1;
				for( var changedi in cn.data ){
					var cdi = cn.data[changedi];
					if( cdi[0] >= firstSample && cdi[0] <= endSample ){
						firstChangedi = changedi;
						break;
					}
				}
				
				var cc={'stroke-width': 1};
				switch(parseInt(i)%4){
				case 0:
					cc.stroke = chartOptions.channelA.color;
					cc.fill = chartOptions.channelA.fill;
					break;
				case 1:
					cc.stroke = chartOptions.channelB.color;
					cc.fill = chartOptions.channelB.fill;
					break;
				case 2:
					cc.stroke = chartOptions.channelC.color;
					cc.fill = chartOptions.channelC.fill;
					break;
				case 3:
					cc.stroke = chartOptions.channelN.color;
					cc.fill = chartOptions.channelN.fill;
					break;							
				}
				
				if( firstChangedi >= 0 ){
					//本页有变位点					
					if( firstChangedi > 0 ){
						//绘制第一个变位点之前的图形
						var predi = cn.data[firstChangedi-1];
						var curdi = cn.data[firstChangedi];
						var nextX = samplePos[curdi[0]-firstSample];
						if( predi[1] == 0 ){
							//值为0，画直线
							renderer.path(
									[ M,startX,midY,
									  L,nextX,midY ])
									.attr(cc).add(warpC);
						}else{
							renderer.rect(startX, ditopY, nextX-startX, diheight,
									0, 1)
									.attr(cc).add(warpC);
						}
					}
					//从firstChangedi开始绘制
					for( var did = firstChangedi; did < cn.data.length; did++ ){
						var curchange = cn.data[did];
						if( curchange[0] > endSample )
							break;
						var nextchange = null;
						if( did < cn.data.length -1 ){
							nextchange = cn.data[parseInt(did)+1];
							if( nextchange[0] > endSample )
								nextchange = null;
						}
						
						var nextX = maxX;
						var curX = samplePos[curchange[0]-firstSample]
						if( nextchange != null ){
							nextX = samplePos[nextchange[0]-firstSample];
						}
						if( curchange[1] == 0 ){
							//值为0，画直线
							renderer.path(
									[ M,curX,midY,
									  L,nextX,midY ])
									.attr(cc).add(warpC);
						}else{
							renderer.rect(curX, ditopY, nextX-curX, diheight,
									0, 1)
									.attr(cc).add(warpC);
						}
					}
				}else{
					//本页没有变位点，找之前最近的变位点
					var preChangedi = -1;
					for( var changedi in cn.data ){
						var cdi = cn.data[changedi];
						if( cdi[0] > firstSample ){
							preChangedi = changedi-1;
							break;
						}
					}
					if( preChangedi < 0 )
						preChangedi = 0;
					var pre = cn.data[preChangedi];
					if( pre[1] == 0 ){
						//值为0，画直线
						renderer.path(
								[ M,startX,midY,
								  L,maxX,midY ])
								.attr(cc).add(warpC);
					}else{
						renderer.rect(startX, ditopY, maxX-startX, diheight,
								0, 1)
								.attr(cc).add(warpC);
					}
				}				
			}	
		}
		this.canRenderValue = true;
	},
	updateValue : function(s1, s2){
		var channels = this,
			chart = this.chart,
			axis = chart.axis,
			renderer = chart.renderer,
			chartOptions = chart.options.chart,
			comtradeOptions = chart.options.comtrade,
			channelsOptions = chart.options.comtrade.channels;
		if( this.vArray == null || this.idArray == null ){
			return;
		}

		for( var i = 0; i < this.idArray.length; i++ ){
			var c = channelsOptions[this.idArray[i]];			
			var ele = this.vArray[i];
			if( !this.firstUpdateValue ){
				var nameEle = this.nameArray[i];
				var b = nameEle.getBBox();
				var newx = b.x + b.width + 5
				ele.attr('x',newx);
			}
			if( c.type=="AI"){
				var v1 = c.data[s1];
				var v2 = c.data[s2];
				//计算有效值
				var dv = 0.0;
				for( var p = parseInt(s1); p <= parseInt(s2); p++ ){
					dv += math.pow(c.data[p],2);
				}
				
				dv = math.sqrt(dv/(s2-s1+1));
								
				var text = ' 主游标:'+JSComtrade.numberFormat(v1,2)+c.unit
							+' 副游标:'+JSComtrade.numberFormat(v2,2)+c.unit
							+' 有效值:'+JSComtrade.numberFormat(dv,2);
				ele.textSetter(text);
			}else{
				var v1 = 0,
					v2 = 0,
					setv1 = false,
					setv2 = false;
				for( var changedi in c.data ){
					var cdi = c.data[changedi];
					if( changedi == 0 ){
						v1 = v2 = cdi[1];
					}
					if( cdi[0] > s1 && changedi != 0 && setv1==false ){
						var precdi = c.data[changedi-1];
						v1 = precdi[1];
						setv1 = true;
					}
					if( cdi[0] > s2 && changedi != 0 && setv2 == false ){
						var precdi = c.data[changedi-1];
						v2 = precdi[1];
						setv2 = true;
					}
					if( setv1 == true && setv2 == true )
						break;
				}
				var text = ' 主游标:'+(v1==0?'复归':'动作')+' 副游标:'+(v2==0?'复归':'动作');
				ele.textSetter(text);
			}			
		}
		this.firstUpdateValue = false;
	}
};

/*******************************************************************************
 * * START OF Tooltip * *
 ******************************************************************************/
var Tooltip = JSComtrade.Tooltip = function(){
	this.init.apply(this, arguments);
};

Tooltip.prototype = {
	init : function(chart, options){
		this.chart = chart;
		this.options = options;
		var borderWidth = options.borderWidth,
			style = options.style,
			padding = pInt(style.padding);
		
		this.crosshairs = [];
		this.now = {x:0, y:0};
		this.isHidden = true;
		
		this.label = chart.renderer.label('', 0, 0, options.shape || 'callout', null, null, options.useHTML, null, 'tooltip')
				.attr({
					padding:padding,
					fill:options.backgroundColor,
					'stroke-width':borderWidth,
					r:options.borderRadius,
					zIndex:8
				})
				.css(style)
				.css({padding:0})// Remove it from VML, the padding is applied as an attribute instead (#1117)
				.add()
				.attr({y:-9999});
		// When using canVG the shadow shows up as a gray circle
		// even if the tooltip is hidden.
		if (!useCanVG) {
			this.label.shadow(options.shadow);
		}
	},
	
	destroy:function(){
		if(this.label){
			this.label = this.label.destroy();
		}
		clearTimout(this.hideTimer);
		clearTimeout(this.tooptipTimeout);
	},
	
	move:function(x, y, anchorX, anchorY){
		var tooltip = this,
			now = tooltip.now,
			animate = tooltip.options.animation !== false && !tooltip.isHidden &&
				(mathAbs(x-now.x)>1 || mathAbs(y-now.y)>1),
			skipAnchor = tooltip.followPointer || tooltip.len > 1;
			// Get intermediate values for animation
			extend(now, {
				x: animate ? (2 * now.x + x) / 3 : x,
				y: animate ? (now.y + y) / 2 : y,
				anchorX: skipAnchor ? UNDEFINED : animate ? (2 * now.anchorX + anchorX) / 3 : anchorX,
				anchorY: skipAnchor ? UNDEFINED : animate ? (now.anchorY + anchorY) / 2 : anchorY
			});

			// Move to the intermediate value
			tooltip.label.attr(now);

			
			// Run on next tick of the mouse tracker
			if (animate) {			
				// Never allow two timeouts
				clearTimeout(this.tooltipTimeout);
				
				// Set the fixed interval ticking for the smooth tooltip
				this.tooltipTimeout = setTimeout(function () {
					// The interval function may still be running during
					// destroy, so check that the chart is really there before
					// calling.
					if (tooltip) {
						tooltip.move(x, y, anchorX, anchorY);
					}
				}, 32);
				
			}
	},
	/**
	 * Hide the tooltip
	 */
	hide: function (delay) {
		var tooltip = this,
			hoverPoints;
		
		clearTimeout(this.hideTimer); // disallow duplicate timers (#1728, #1766)
		if (!this.isHidden) {
			hoverPoints = this.chart.hoverPoints;

			this.hideTimer = setTimeout(function () {
				tooltip.label.fadeOut();
				tooltip.isHidden = true;
			}, pick(delay, this.options.hideDelay, 500));
		}
	},
	
	/**
	 * Place the tooltip in a chart without spilling over
	 * and not covering the point it self.
	 */
	getPosition: function (boxWidth, boxHeight, point) {
		var chart = this.chart,
			ret = {},
			distance = 8,
			first = ['y', chart.plotTop, chart.plotHeight, boxHeight, point.y],
			second = ['x', chart.plotLeft, chart.plotWidth, boxWidth, point.x],
			
			/**
			 * Handle the preferred dimension. When the preferred dimension is tooltip
			 * on top or bottom of the point, it will look for space there.
			 */
			firstDimension = function (dim, outerStart, outerSize, innerSize, point) {
				var roomLeft = innerSize < point - distance - outerStart,
					roomRight = point + distance + innerSize < (outerStart+outerSize),
					alignedLeft = point - distance - innerSize,
					alignedRight = point + distance;

				if (roomRight) {
					ret[dim] = alignedRight;
				} else {
					ret[dim] = alignedLeft;
				}
			};
			firstDimension.apply(0, first);
			firstDimension.apply(0, second);
		return ret;
	
	},
	
	/**
	 * In case no user defined formatter is given, this will be used. Note that the context
	 * here is an object holding point, series, x, y etc.
	 */
	defaultFormatter: function (tooltip) {
		var items = this.points || splat(this),
			s;

		// build the header
		s = [tooltip.tooltipFooterHeaderFormatter(items[0])]; //#3397: abstraction to enable formatting of footer and header

		// build the values
		s = s.concat(tooltip.bodyFormatter(items));

		// footer
		s.push(tooltip.tooltipFooterHeaderFormatter(items[0], true)); //#3397: abstraction to enable formatting of footer and header

		return s.join('');
	},
	
	/**
	 * Refresh the tooltip's text and position.
	 * @param {Object} point
	 */
	refresh: function ( mouseEvent, text ) {
		var tooltip = this,
			chart = tooltip.chart,
			label = tooltip.label,
			options = tooltip.options,
			x,
			y,
			anchor,
			textConfig = {},
			text,
			pointConfig = [],
			borderColor;
			
		clearTimeout(this.hideTimer);
		
		// get the reference point coordinates (pie charts use tooltipPos)
		//anchor = tooltip.getAnchor(mouseEvent);
		if (mouseEvent.chartX === UNDEFINED) {
			mouseEvent = chart.pointer.normalize(mouseEvent);
		}
		x = mouseEvent.chartX;
		y = mouseEvent.chartYscroll;

		// update the inner HTML
		if (text === false) {
			this.hide();
		} else {

			// show it
			if (tooltip.isHidden) {
				stop(label);
				label.attr('opacity', 1).show();
			}

			// update text
			label.attr({
				text: text
			});

			// set the stroke color of the box
			borderColor = options.borderColor || '#606060';
			label.attr({
				stroke: borderColor
			});
			tooltip.updatePosition({ 
				x: x, 
				y: y, 
				negative: true, 
				ttBelow: false, 
				h: 0
			});
		
			this.isHidden = false;
		}
	},
	/**
	 * Find the new position and perform the move
	 */
	updatePosition: function (point) {
		var chart = this.chart,
			label = this.label, 
			pos = this.getPosition.call(
				this,
				label.width,
				label.height,
				point
			);

		// do the move
		this.move(
			mathRound(pos.x), 
			mathRound(pos.y || 0), // can be undefined (#3977) 
			point.plotX + chart.plotLeft, 
			point.plotY + chart.plotTop
		);
	}
};

/*******************************************************************************
 * * START OF Chart * *
 ******************************************************************************/
var Chart = JSComtrade.Chart = function(){
	this.init.apply(this, arguments);
};
Chart.prototype={
	callbacks:[],
	init: function(userOptions, callback){
		var options;
		options = merge(defaultOptions, userOptions);
		this.userOptions = userOptions;
		
		var optionsChart = options.chart;
		this.margin = this.splashArray('margin', optionsChart);
		this.spacing = this.splashArray('spacing', optionsChart);
		
		this.bounds={h:{}, v:{}};
		this.callback = callback;
		this.options = options;
		
		var chart = this;
		//add the chart to the global lookup
		chart.index = charts.length;
		charts.push(chart);
		chartCount++;
		
		
		chart.firstRender();
	},
	/*
	 * 规划图形分页,本函数须在plot区域确定后再调用
	 */
	layoutPages : function(){
		var chart = this,
			chartOptions = chart.options.chart,
			comtradeOptions = chart.options.comtrade,
			times = comtradeOptions.times;
		
		var pagewidth = chart.plotWidth - chartOptions.channelMargin[1] - chartOptions.channelMargin[3];
		chart.spanPrePage = mathFloor(pagewidth/chartOptions.pxPerMS);
		chart.HPages = mathCeil( (times[times.length-1]-times[0])/chart.spanPrePage );
		chart.curVPage = chart.curHPage = 0;
		chart.pageWidth = pagewidth;
	},
	isReadyToRender: function(){
		var chart = this;
		
		if( (!hasSVG && (win==win.top && doc.readyState !== 'complete')) || (useCanVG && !win.canvg)){
			if(useCanVG){
				//delay rendering until canvg library is downloaded and ready
				CanVGController.push(function(){chart.firstRender();}, chart.options.global.canvasToolsURL);
			}else{
				doc.attachEvent('onreadystatechange', function(){
					doc.detachEvent('onreadystatechange', chart.firstRender);
					if(doc.readyState==='complete'){
						chart.firstRender();
					}
				});
			}
			return false;
		}
		return true;
	},
	firstRender: function(){
		var chart = this,
			options = chart.options,
			callback = chart.callback;
		if(!chart.isReadyToRender()){
			return;
		}
		//create the container
		chart.getContainer();
		
		chart.resetMargins();
		chart.setChartSize();

		// depends on inverted and on margins being set		
		chart.layoutPages();
		
		$(this.container).scrollTop(0);	
		
		if( JSComtrade.Axis ){
			chart.axis = new Axis(chart, options.axis);
		}
		
		if (JSComtrade.Pointer) {
			chart.pointer = new Pointer(chart);
		}
		
		if(JSComtrade.Tooltip){
			chart.tooltip = new Tooltip(chart, options.tooltip);
		}
		
		if(JSComtrade.Cursor){
				chart.primaryCursor = new Cursor(chart, options.cursor1);
				chart.secondaryCursor = new Cursor(chart, options.cursor2);
		}
		
		if( JSComtrade.Channels ){
			chart.channels = new Channels(chart, options.comtrade);
		}
		
		chart.render();
		
		chart.showPageturner(false);
		
		//add canvas
		chart.renderer.draw();
		
		// If the chart was rendered outside the top container, put it back in (#3679)
		chart.cloneRenderTo(true);
		
		if(chart.primaryCursor){
			var cbox = chart.axis.getComtradeBox();
			chart.primaryCursor.moveTo(cbox.x+20);
			chart.pointer.synCursor(chart.primaryCursor)
		}
	},
	getContainer:function(){
		var chart = this,
		container,
		optionsChart = chart.options.chart,
		chartWidth,
		chartHeight,
		renderTo,
		indexAttrName='data-jscomtrade-chart',
		oldChartIndex,
		containerId;
		
		chart.renderTo = renderTo = optionsChart.renderTo;
		containerId = PREFIX + idCounter++;
		
		if(isString(renderTo)){
			chart.renderTo = renderTo = doc.getElementById(renderTo);
		}
		if(!renderTo){
			error(13, true);
		}
		// If the container already holds a chart, destroy it. The check for hasRendered is there
		// because web pages that are saved to disk from the browser, will preserve the data-highcharts-chart
		// attribute and the SVG contents, but not an interactive chart. So in this case,
		// charts[oldChartIndex] will point to the wrong chart if any (#2609).
		oldChartIndex = pInt(attr(renderTo, indexAttrName));
		if(!isNaN(oldChartIndex)&&charts[oldChartIndex]&&charts[oldChartIndex].hasRendered){
			alert(charts[oldChartIndex].nodeName);
			charts[oldChartIndex].destroy();
			if(axischarts[oldChartIndex]){
				axischarts[oldChartIndex].destory();
			}
		}
		
		//make a reference to the chart from the div
		attr(renderTo, indexAttrName, chart.index);
		
		//remove previous chart
		renderTo.innerHTML='';
		
		// get the width and height
		chart.getChartSize();
		chartWidth = chart.chartWidth;
		chartHeight = chart.chartHeight;
		
		//create the inner container
		chart.container = container = createElement(DIV, {
			className:PREFIX + 'container' + (optionsChart.className ? ' '+optionsChart.className:''),
			id: containerId},
			extend({
				position:RELATIVE,
				overflow:'auto',
				width:chartWidth+PX,
				height:chartHeight+PX,
				textAlign:'left',
				lineHeight:'normal',
				zIndex:0,
				'border-width':'1px',
				'border-style':'solid none solid solid',
				'border-color':optionsChart.borderColor
				},
				optionsChart.style),
			chart.renderToClone||renderTo);	
		//cache the cursor
		chart._cursor = container.style.cursor;
		charts[chart.index] = container;
		
		var cheight = optionsChart.channel.height + optionsChart.channelMargin[0] + optionsChart.channelMargin[2];
		var comtradeOptions = chart.options.comtrade;
		chart.channelsPrePage = comtradeOptions.achannelCount + comtradeOptions.dchannelCount;
		chart.pageHeight = cheight * chart.channelsPrePage;
		chart.Vpage = 1;
		
		var scrollwidth = 30;
		//Initialize the renderer
		chart.renderer = optionsChart.forExport?
				new SVGRenderer(container, chartWidth-scrollwidth, chart.pageHeight, optionsChart.style, true):
				new Renderer(container, chartWidth-scrollwidth, chart.pageHeight, optionsChart.style);
		if(useCanVG){
			chart.renderer.create(chart,container, chartWidth-scrollwidth, chart.pageHeight);
		}
		//Add a reference to the charts index
		chart.renderer.chartIndex = chart.index;
		
		//axis container
		var axiscontainer = chart.axiscontainer = createElement(DIV, {id: containerId+'-axis'},
			extend({
				position:RELATIVE,
				overflow:HIDDEN,
				width:chartWidth+PX,
				height:chart.axisHeight+PX,
				textAlign:'left',
				lineHeight:'normal',
				zIndex:0},
				optionsChart.style),
			chart.renderToClone||renderTo);
		axischarts[chart.index] = chart.axiscontainer;
		//Initialize the axis renderer
		chart.axisrenderer = optionsChart.forExport?
				new SVGRenderer(axiscontainer, chartWidth-scrollwidth, chart.axisHeight, optionsChart.style, true):
				new Renderer(axiscontainer, chartWidth-scrollwidth, chart.axisHeight, optionsChart.style);
		if(useCanVG){
			chart.axiscontainer.create(chart,axiscontainer, chartWidth-scrollwidth, chart.axisHeight);
		}
	},
	getChartSize:function(){
		var chart = this,
		optionsChart = chart.options.chart,
		widthOption = optionsChart.width,
		heightOption = optionsChart.height,
		renderTo = chart.renderToClone || chart.renderTo;
		
		chart.axisHeight = 40;
		
		//get inner width and height from JQuery
		if(!defined(widthOption)){
			chart.containerWidth = adapterRun(renderTo, 'width');
		}
		if(!defined(heightOption)){
			chart.containerHeight = adapterRun(renderTo, 'height');
		}
		
		chart.chartWidth = mathMax(0, widthOption || chart.containerWidth || 600 );
		chart.chartHeight = mathMax(0, pick(heightOption,
			// the offsetHeight of an empty container is 0 in standard browsers, but 19 in IE7:
			chart.containerHeight > 19 ? chart.containerHeight:520));
		chart.chartHeight -= chart.axisHeight;
	},
	/**
	* Creates arrays for spacing and margin from given options.
	*/
	splashArray: function (target, options) {
		var oVar = options[target],
			tArray = isObject(oVar) ? oVar : [oVar, oVar, oVar, oVar];

		return [pick(options[target + 'Top'], tArray[0]),
				pick(options[target + 'Right'], tArray[1]),
				pick(options[target + 'Bottom'], tArray[2]),
				pick(options[target + 'Left'], tArray[3])];
	},
	/**
	 * Render the graph and markers
	 */
	render: function(){
		var chart = this,
			renderer = chart.renderer,
			options = chart.options,
			tempWidth,tempHeight,
			redoHorizontal, redoVertical;
		
		//Title
		//chart.setTitle();
		
		//Get chart margins
		chart.getMargins(true);
		chart.setChartSize();
		
		// Draw the borders and backgrounds
		//chart.drawChartBox();
		
		//draw axis
		chart.axis.render();
		
		//draw channels
		chart.channels.render();
		
		//draw cursor
		if(chart.options.cursor1.enable){
			chart.primaryCursor.render();
		}else{
			
		}
		if(chart.options.cursor2.enable){
			chart.secondaryCursor.render();
		}else{
			
		}
		
		//draw page turner
		chart.getPageturner();
		chart.renderIndicator('h');
		chart.renderIndicator('v');
		
		//set flag
		chart.hasRendered = true;
	},
	
	/**
	 * Draw the borders and backgrounds for chart and plot area
	 */
	drawChartBox: function(){
		var chart = this,
			optionsChart = chart.options.chart,
			renderer = chart.renderer,
			chartWidth = chart.chartWidth,
			chartHeight = chart.chartHeight,
			chartBackground = chart.chartBackground,
			chartBorderWidth = optionsChart.borderWidth||0,
			chartBackgroundColor = optionsChart.backgroundColor,
			plotBackground = chart.plotBackground,
			plotBorder = chart.plotBorder,
			plotBGImage = chart.plotBGImage,
			plotBackgroundColor = optionsChart.plotBackgroundColor,
			plotBackgroundImage = optionsChart.plotBackgroundImage,
			plotBorderWidth = optionsChart.plotBorderWidth||0,
			plotLeft = chart.plotLeft,
			plotTop = chart.plotTop,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			plotBox = chart.plotBox,
			clipRect = chart.clipRect,
			clipBox = chart.clipBox,
			mgn,
			bgAtt;
		//chart area
		mgn = chartBorderWidth+(optionsChart.shadow?8:0);
		if( chartBorderWidth || chartBackgroundColor ){
			if(!chartBackground){
				bgAttr={fill:chartBackgroundColor||NONE};
				if(chartBorderWidth){
					bgAttr.stroke=optionsChart.borderColor;
					bgAttr['stroke-width']=chartBorderWidth;
				}
				chart.charBackground = renderer.rect(mgn/2, mgn/2, chartWidth-mgn, chartHeight-mgn,
						optionsChart.borderRadius, chartBorderWidth)
						.attr(bgAttr)
						.addClass(PREFIX+"background")
						.add()
						.shadow(optionsChart.shadow);
			}else{//resize
				chartBackground.animate(
						chartBackground.crisp({width:chartWidth-mgn, height:chartHeight-mgn}));
			}
		}
		//plot background
		if(plotBackgroundColor){
			if(!plotBackground){
				chart.plotBackground = renderer.rect(plotLeft, plotTop, plotWidth, plotHeight, 0)
					.attr({fill:plotBackgroundColor})
					.add()
					.shadow(optionsChart.plotShadow);
			}else{
				plotBackground.animate(plotBox);
			}
		}
		if(plotBackgroundImage){
			if(!plotBGImage){
				chart.plotBGImage = renderer.image(plotBackgroundImage, plotLeft, plotTop, plotWidth, plotHeight)
					.add();
			}else{
				plotBGImage.animate(plotBox);
			}
		}
		//plot clip
		if(!clipRect){
			chart.clipRect = renderer.clipRect(clipBox);
		}else{
			clipRect.animate({
				width: clipBox.width,
				height: clipBox.height
			});
		}
		// plot area border
		if(plotBorderWidth){
			if(!plotBorder){
				chart.plotBorder = renderer.rect(plotLeft, plotTop, plotWidth, plotHeight, 0, -plotBorderWidth)
					.attr({
						stroke: optionsChart.plotBorderColor,
						'stroke-width': plotBorderWidth,
						fill: NONE,
						zIndex: 1
					})
					.addClass(PREFIX+"plot")
					.add();
			}else{
				plotBorder.animate(
						plotBorder.crisp({x:plotLeft, y:plotTop, width:plotWidth, height: plotHeight, strokeWidth: -plotBorderWidth})
					);
			}
		}
		//reset
		chart.isDirtyBox = false;
	},
	
	/**
	 * Create a clone of the chart's renderTo div and place it outside the viewport to allow
	 * size computation on chart.render and chart.redraw
	 */
	cloneRenderTo: function(revert){
		var clone = this.renderToClone,
			container = this.container;
		//destroy the clone and bring the container back to the real renderTo div
		if(revert){
			if(clone){
				this.renderTo.appendChild(container);
				discardElement(clone);
				delete this.renderToClone;
			}
		}else{ //set up the clone
			if(container && container.parentNode === this.renderTo){
				this.renderTo.removeChild(container); //do not clone this
			}
			this.renderToClone = clone = this.renderTo.cloneNode(0);
			css(clone, {
				position:ABSOLUTE,
				top:'-9999px',
				display:'block'
			});
			if(clone.style.setProperty){
				clone.style.setProperty('display', 'block', 'important');
			}
			doc.body.appendChild(clone);
			if(container){
				clone.appendChild(container);
			}
		}
	},
	/**
	 * Initial margins before auto size margins are applied
	 */
	resetMargins: function(){
		var chart = this;
		/*marginNames = ['plotTop', 'marginRight', 'marginBottom', 'plotLeft']*/
		each(marginNames, function(m, side){
			chart[m] = pick(chart.margin[side], chart.spacing[side]);
		});
		chart.axisOffset = [0, 0, 0, 0];//top, right, bottom, left
		chart.clipOffset = [0, 0, 0, 0];
	},
	/**
	 * Calculate margins by rendering axis labels in a preliminary position. Title,
	 * subtitle and legend have already been rendered at this stage, but will be
	 * moved into their final positions
	 */
	getMargins: function(skipAxes){
		var chart = this,
			spacing = chart.spacing,
			margin = chart.margin,
			titleOffset = chart.titleOffset;
		
		chart.resetMargins();
		//adjust for title and subtitle
		if(titleOffset && !defined(margin[0])){
			chart.plotTop = mathMax(chart.plotTop, titleOffset + chart.options.title.margin + spacing[0]);
		}
	},
	/**
	 * Set the public chart properties. This is done before and after the pre-render
	 * to determine margin sizes
	 */
	setChartSize: function(skipAxes){
		var chart = this,
			inverted = chart.inverted,
			renderer = chart.renderer,
			chartWidth = chart.chartWidth,
			chartHeight = chart.chartHeight,
			optionsChart = chart.options.chart,
			spacing = chart.spacing,
			clipOffset = chart.clipOffset,
			clipX, clipY,
			plotLeft, plotTop, plotWidth, plotHeight, plotBorderWidth;
		
		chart.plotLeft = plotLeft = mathRound(chart.plotLeft);
		chart.plotTop = plotTop = mathRound(chart.plotTop);
		chart.plotWidth = plotWidth = mathMax(0, mathRound(chartWidth - plotLeft - chart.marginRight));
		chart.plotHeight = plotHeight = mathMax(0, mathRound(chartHeight - plotTop - chart.marginBottom));
		
		chart.plotSizeX = inverted ? plotHeight : plotWidth;
		chart.plotSizeY = inverted ? plotWidth : plotHeight;
		
		chart.plotBorderWidth = optionsChart.plotBorderWidth || 0;
		
		// set boxes used for alignment
		chart.spacingBox = renderer.spacingBox = {
				x: spacing[3],
				y: spacing[0],
				width: chartWidth - spacing[3] - spacing[1],
				height: chartHeight - spacing[0] - spacing[2]
		};
		chart.plotBox = renderer.plotBox = {
				x: plotLeft,
				y: plotTop,
				width: plotWidth,
				height: plotHeight
		};
		
		plotBorderWidth = 2 * mathFloor(chart.plotBorderWidth / 2);
		clipX = mathCeil(mathMax(plotBorderWidth, clipOffset[3]) / 2);
		clipY = mathCeil(mathMax(plotBorderWidth, clipOffset[0]) / 2);
		chart.clipBox={
				x: clipX,
				y: clipY,
				width: mathFloor(chart.plotSizeX - mathMax(plotBorderWidth, clipOffset[1]) / 2 -clipX),
				height: mathMax(0, mathFloor(chart.plotSizeY - mathMax(plotBorderWidth, clipOffset[2]) / 2 - clipY))
		};
	},
	/**
	 * Show the title and subtitle of the chart
	 *
	 * @param titleOptions {Object} New title options
	 * @param subtitleOptions {Object} New subtitle options
	 *
	 */
	setTitle: function(titleOptions, subtitleOptions, redraw){
		var chart = this,
			options = chart.options,
			chartTitleOptions,
			chartSubtitleOptions;
		
		chartTitleOptions = options.title = merge(options.title, titleOptions);
		chartSubtitleOptions = options.subtitle = merge(options.subtitle, subtitleOptions);
		
		// add title and subtitle
		each([
		    ['title', titleOptions, chartTitleOptions],
		    ['subtitle', subtitleOptions, chartSubtitleOptions]
		 ], function(arr){
			var name = arr[0],
				title = chart[name],
				titleOptions = arr[1],
				chartTitleOptions = arr[2];
			
			if(title && titleOptions){
				chart[name] = title = title.destroy();
			}
			
			if(chartTitleOptions && chartTitleOptions.text && !title){
				chart[name] = chart.renderer.text(
						chartTitleOptions.text,
						0,
						0,
						chartTitleOptions.useHTML)
				.attr({
					align: chartTitleOptions.align,
					'class': PREFIX + name,
					zIndex: chartTitleOptions.zIndex || 4
				})
				.css(chartTitleOptions.style)
				.add();
			}
		});
		chart.layOutTitles(redraw);
	},
	/**
	 * Lay out the chart titles and cache the full offset height for use in getMargins
	 */
	layOutTitles: function(redraw){
		var titleOffset = 0,
			title = this.title,
			subtitle = this.subtitle,
			options = this.options,
			titleOptions = options.title,
			subtitleOptions = options.subtitle,
			requiresDirtyBox,
			renderer = this.renderer,
			autoWidth = this.spacingBox.width - 44; // 44 makes room for default context button
		
		if(title){
			title.css({width:(titleOptions.width || autoWidth) + PX })
				 .align(extend({
					 y:renderer.fontMetrics(titleOptions.style.fontSize, title).b -3
				 }, titleOptions), false, 'spacingBox');
			if(!titleOptions.floating && !titleOptions.verticalAlign){
				titleOffset = title.getBBox().height;
			}
		}
		
		if (subtitle) {
			subtitle
				.css({ width: (subtitleOptions.width || autoWidth) + PX })
				.align(extend({ 
					y:  renderer.fontMetrics(titleOptions.style.fontSize, subtitle).b 
				}, subtitleOptions), false, 'spacingBox');
			
			if (!subtitleOptions.floating && !subtitleOptions.verticalAlign) {
				//titleOffset = mathCeil(titleOffset + subtitle.getBBox().height);
			}
		}

		requiresDirtyBox = this.titleOffset !== titleOffset;				
		this.titleOffset = titleOffset; // used in getMargins

		if (!this.isDirtyBox && requiresDirtyBox) {
			this.isDirtyBox = requiresDirtyBox;
			// Redraw if necessary (#2719, #2744)		
			if (this.hasRendered && pick(redraw, true) && this.isDirtyBox) {
				this.redraw();
			}
		}
	},
	getLeftPageturnerBox:function(){
		var chart = this,
		optionsChart = chart.options.chart,
		turnerW = 50,
		turnerH = mathMin(300, chart.plotHeight-40);
		var scrolltop = $(this.container).scrollTop();		
		var plotYmid = scrolltop+chart.plotTop + chart.plotHeight/2;
		chart.turnerLeftBox = {
				x: chart.plotLeft, 
				y: plotYmid - turnerH/2, 
				width: turnerW, 
				height: turnerH};
		return chart.turnerLeftBox;
	},
	getRightPageturnerBox:function(){
		var chart = this,
		optionsChart = chart.options.chart,
		turnerW = 50,
		turnerH = mathMin(300, chart.plotHeight-40);
		var scrolltop = $(this.container).scrollTop();		
		var plotYmid = scrolltop+chart.plotTop + chart.plotHeight/2;
		chart.turnerRightBox = {
				x: chart.plotLeft+chart.plotWidth-turnerW, 
				y: plotYmid - turnerH/2, 
				width: turnerW, 
				height: turnerH};
		return chart.turnerRightBox;
	},
	/*
	 * 在左右分别绘制一个翻页按钮
	 */
	getPageturner: function(){
		var chart = this,
			optionsChart = chart.options.chart,
			renderer = chart.renderer,
			attrAttr={fill:'rgba(0,0,0,.8)'},
			lineAttr={fill:'rgba(200,200,200,.8)','stroke':'rgb(255,255,255)','stroke-width':1},
			defaultIndiAttr={fill:'rgba(200,200,200,.8)','stroke':'rgb(255,255,255)','stroke-width':1},
			selIndiAttr={fill:'rgba(200,0,200,.8)','stroke':'rgb(255,255,255)','stroke-width':1},
			gAttr = {zIndex:10};
		if(this.turnerLeft){
			this.turnerLeft.destroy();
		}
		if(this.turnerRight){
			this.turnerRight.destroy();
		}
		
		var lbox = this.getLeftPageturnerBox();
		//left
		var warp = this.turnerLeft = renderer.g('pageturnerLeft')
			.attr(gAttr)
			.add();
		renderer.rect( lbox.x, lbox.y, lbox.width, lbox.height)
			.attr(attrAttr)
			.add(warp);
		
		renderer.path(
				[ M, 
				  lbox.x+lbox.width-4, 
				  lbox.y+4, 
				  L, 
				  lbox.x+4,
				  lbox.y+lbox.height/2,
				  L, 
				  lbox.x+lbox.width-4,
				  lbox.y+lbox.height-4,
				  L, 
				  lbox.x+lbox.width-4, 
				  lbox.y+4])
				.attr(lineAttr).add(warp);
		//right
		warp = this.turnerRight = renderer.g('pageturnerRight')
			.attr(gAttr)
			.add();
		var rbox = this.getRightPageturnerBox();
		renderer.rect( rbox.x, rbox.y, rbox.width, rbox.height)
			.attr(attrAttr)
			.add(warp);
		renderer.path(
				[ M, 
				  rbox.x+4, 
				  rbox.y+4, 
				  L, 
				  rbox.x+rbox.width-4,
				  rbox.y+rbox.height/2,
				  L, 
				  rbox.x+4,
				  rbox.y+rbox.height-4,
				  L, 
				  rbox.x+4, 
				  rbox.y+4])
				.attr(lineAttr).add(warp);
	},
	turnPage:function(){
		var chart = this;
			//draw axis
			chart.axis.render();
			
			//move cursor
			if(chart.primaryCursor){
				var cbox = chart.axis.getComtradeBox();
				chart.primaryCursor.moveTo(cbox.x+20);
				chart.pointer.synCursor(chart.primaryCursor)
			}
			
			//draw channels
			chart.channels.render();
			chart.pointer.refreshChannelValue();			

			chart.renderIndicator();
			chart.showPageturner(true);
	},
	renderIndicator:function(){
		var chart = this,
			optionsChart = chart.options.chart,
			renderer = chart.renderer,
			attrAttr={fill:'rgba(0,0,0,.8)'},
			defaultIndiAttr={fill:'rgba(200,200,200,.8)','stroke':'rgb(255,255,255)','stroke-width':1},
			selIndiAttr={fill:'rgba(244,92,11,.9)','stroke':'rgb(255,255,255)','stroke-width':1},
			gAttr = {zIndex:10};
		
		var indicatorSize = 20;
				
			if( this.hIndicator ){
				this.hIndicator.destroy();
				this.hIndicator = null;
			}
		var scrolltop = $(this.container).scrollTop();
		var plotXmid = chart.plotLeft + chart.plotWidth/2,
			plotYmid = scrolltop+chart.plotTop + chart.plotHeight/2;
			
			var warp = this.hIndicator = renderer.g('pageHIndicator')
			.attr(gAttr)
			.add();
			 var indiWidth = indicatorSize* this.HPages,
				indiHeight = indicatorSize ,
				vx = plotXmid-indiWidth/2,
				vy = plotYmid - indiHeight/2;
			renderer.rect( vx, vy, indiWidth, indiHeight)
			.attr(attrAttr)
			.add(warp);
			for( var h = 0; h < this.HPages; h++ ){
				var x = vx+h*indicatorSize+indicatorSize/2,
					y = vy + indiHeight/2,
					r = indicatorSize/4;
				if( h != this.curHPage ){
					renderer.circle(x,y,r).attr(defaultIndiAttr).add(warp);
				}else{
					renderer.circle(x,y,r).attr(selIndiAttr).add(warp);
				}
			}		
	},
	showPageturner : function(bshow){
		var chart = this;
			//redraw			
			if( bshow ){
				this.getPageturner();
				this.renderIndicator();
				
				this.PageturnerDisplayed=true;
				if( this.turnerLeft ){
					this.turnerLeft.show();
				}
				if( this.turnerRight ){
					this.turnerRight.show();
				}
				if( this.hIndicator ){
					this.hIndicator.show();
				}
			}else{
				this.PageturnerDisplayed=false;
				if( this.turnerLeft ){
					this.turnerLeft.hide();
				}
				if( this.turnerRight ){
					this.turnerRight.hide();
				}
				if( this.hIndicator ){
					this.hIndicator.hide();
				}
			}
		}
};
 
// global variables
extend(JSComtrade, {	
	// Constructors
	Color: Color,
	Renderer: Renderer,
	SVGElement: SVGElement,
	SVGRenderer: SVGRenderer,
	Pointer: Pointer,
	Cursor: Cursor,
	Channels : Channels,
	Tooltip : Tooltip,
	
	// Various
	arrayMin: arrayMin,
	arrayMax: arrayMax,
	charts: charts,
	axischarts: axischarts,
	dateFormat: dateFormat,
	error: error,
	format: format,
	pathAnim: pathAnim,
	getOptions: getOptions,
	hasBidiBug: hasBidiBug,
	isTouchDevice: isTouchDevice,
	setOptions: setOptions,
	addEvent: addEvent,
	removeEvent: removeEvent,
	createElement: createElement,
	discardElement: discardElement,
	css: css,
	each: each,
	map: map,
	merge: merge,
	splat: splat,
	extendClass: extendClass,
	pInt: pInt,
	svg: hasSVG,
	canvas: useCanVG,
	vml: !hasSVG && !useCanVG,
	product: PRODUCT,
	version: VERSION
});
}());
window.console && console.log('--- Running JSComtrade 0.1.0 ---');