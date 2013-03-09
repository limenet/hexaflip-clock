// Generated by CoffeeScript 1.6.1
(function() {
  var baseName, className, css, cssClass, defaults, faceNames, faceSequence, prefixList, prefixProp, prop, urlRx, _i, _len, _ref, _ref1,
    _this = this;

  baseName = 'hexaFlip';

  className = baseName[0].toUpperCase() + baseName.slice(1);

  prefixList = ['webkit', 'Moz', 'O', 'ms'];

  prefixProp = function(prop) {
    var prefix, prefixed, _i, _len;
    if (document.body.style[prop.toLowerCase()] != null) {
      return prop.toLowerCase();
    }
    for (_i = 0, _len = prefixList.length; _i < _len; _i++) {
      prefix = prefixList[_i];
      prefixed = prefix + prop;
      if (document.body.style[prefixed] != null) {
        return prefixed;
      }
    }
    return false;
  };

  css = {};

  _ref = ['Transform', 'Perspective'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    prop = _ref[_i];
    css[prop.toLowerCase()] = prefixProp(prop);
  }

  defaults = {
    size: 400,
    margin: 20,
    fontSize: 264,
    perspective: 1000,
    touchSensitivity: 1
  };

  cssClass = baseName.toLowerCase();

  faceNames = ['front', 'bottom', 'back', 'top', 'left', 'right'];

  faceSequence = faceNames.slice(0, 4);

  urlRx = /^((((https?)|(file)):)?\/\/)|(data:)|(\.\.?\/)/i;

  window.HexaFlip = (function() {

    function HexaFlip(el, sets, options) {
      var cube, cubeFragment, i, image, key, midPoint, option, set, setsKeys, setsLength, val, value, z, _j, _len1, _ref1, _ref2,
        _this = this;
      this.el = el;
      this.sets = sets;
      this.options = options != null ? options : {};
      this._onMouseOut = function(e, cube) {
        return HexaFlip.prototype._onMouseOut.apply(_this, arguments);
      };
      if (!(css.transform && this.el)) {
        return;
      }
      for (option in defaults) {
        value = defaults[option];
        this[option] = (_ref1 = this.options[option]) != null ? _ref1 : defaults[option];
      }
      if (typeof this.fontSize === 'number') {
        this.fontSize += 'px';
      }
      if (!this.sets) {
        this.el.classList.add(cssClass + '-timepicker');
        this.sets = {
          hour: (function() {
            var _j, _results;
            _results = [];
            for (i = _j = 1; _j <= 12; i = ++_j) {
              _results.push(i + '');
            }
            return _results;
          })(),
          minute: (function() {
            var _j, _results;
            _results = [];
            for (i = _j = 0; _j <= 60; i = ++_j) {
              _results.push(i + '');
            }
            return _results;
          })(),
          meridian: ['am', 'pm']
        };
      }
      setsKeys = Object.keys(this.sets);
      setsLength = setsKeys.length;
      cubeFragment = document.createDocumentFragment();
      i = z = 0;
      midPoint = setsLength / 2 + 1;
      this.cubes = {};
      _ref2 = this.sets;
      for (key in _ref2) {
        set = _ref2[key];
        cube = this.cubes[key] = this._createCube(key);
        if (++i < midPoint) {
          z++;
        } else {
          z--;
        }
        cube.el.style.zIndex = z;
        this._setContent(cube.front, set[0]);
        cubeFragment.appendChild(cube.el);
        for (_j = 0, _len1 = set.length; _j < _len1; _j++) {
          val = set[_j];
          if (urlRx.test(val)) {
            image = new Image;
            image.src = val;
          }
        }
      }
      this.cubes[setsKeys[0]].el.style.marginLeft = '0';
      this.cubes[setsKeys[setsKeys.length - 1]].el.style.marginRight = '0';
      this.el.classList.add(cssClass);
      this.el.style.height = this.size + 'px';
      this.el.style.width = ((this.size + this.margin * 2) * setsLength) - this.margin * 2 + 'px';
      this.el.style[css.perspective] = this.perspective + 'px';
      this.el.appendChild(cubeFragment);
    }

    HexaFlip.prototype._createCube = function(set) {
      var cube, eString, eventPair, eventPairs, mouseLeaveSupport, rotate3d, side, _fn, _j, _k, _l, _len1, _len2, _len3,
        _this = this;
      cube = {
        set: set,
        offset: 0,
        y1: 0,
        yDelta: 0,
        yLast: 0,
        el: document.createElement('div')
      };
      cube.el.className = "" + cssClass + "-cube " + cssClass + "-cube-" + set;
      cube.el.style.margin = "0 " + this.margin + "px";
      cube.el.style.width = cube.el.style.height = this.size + 'px';
      cube.el.style[css.transform] = this._getTransform(0);
      for (_j = 0, _len1 = faceNames.length; _j < _len1; _j++) {
        side = faceNames[_j];
        cube[side] = document.createElement('div');
        cube[side].className = cssClass + '-' + side;
        rotate3d = (function() {
          switch (side) {
            case 'front':
              return '0, 0, 0, 0deg';
            case 'back':
              return '1, 0, 0, 180deg';
            case 'top':
              return '1, 0, 0, 90deg';
            case 'bottom':
              return '1, 0, 0, -90deg';
            case 'left':
              return '0, 1, 0, -90deg';
            case 'right':
              return '0, 1, 0, 90deg';
          }
        })();
        cube[side].style[css.transform] = "rotate3d(" + rotate3d + ") translate3d(0, 0, " + (this.size / 2) + "px)";
        cube[side].style.fontSize = this.fontSize;
        cube.el.appendChild(cube[side]);
      }
      eventPairs = [['TouchStart', 'MouseDown'], ['TouchMove', 'MouseMove'], ['TouchEnd', 'MouseUp'], ['TouchLeave', 'MouseLeave']];
      mouseLeaveSupport = 'onmouseleave' in window;
      for (_k = 0, _len2 = eventPairs.length; _k < _len2; _k++) {
        eventPair = eventPairs[_k];
        _fn = function(fn, cube) {
          if (!((eString === 'TouchLeave' || eString === 'MouseLeave') && !mouseLeaveSupport)) {
            return cube.el.addEventListener(eString.toLowerCase(), (function(e) {
              return _this[fn](e, cube);
            }), true);
          } else {
            return cube.el.addEventListener('mouseout', (function(e) {
              return _this._onMouseOut(e, cube);
            }), true);
          }
        };
        for (_l = 0, _len3 = eventPair.length; _l < _len3; _l++) {
          eString = eventPair[_l];
          _fn('_on' + eventPair[0], cube);
        }
      }
      this._setSides(cube);
      return cube;
    };

    HexaFlip.prototype._getTransform = function(deg) {
      return "translateZ(-" + (this.size / 2) + "px) rotateX(" + deg + "deg)";
    };

    HexaFlip.prototype._setContent = function(el, content) {
      var key, style, val, value;
      if (!(el && content)) {
        return;
      }
      if (typeof content === 'object') {
        style = content.style, value = content.value;
        for (key in style) {
          val = style[key];
          el.style[key] = val;
        }
      } else {
        value = content;
      }
      if (urlRx.test(value)) {
        el.innerHTML = '';
        return el.style.backgroundImage = "url(" + value + ")";
      } else {
        return el.innerHTML = value;
      }
    };

    HexaFlip.prototype._setSides = function(cube) {
      var bottomAdj, faceOffset, offset, set, setLength, setOffset, topAdj;
      cube.el.style[css.transform] = this._getTransform(cube.yDelta);
      cube.offset = offset = Math.floor(cube.yDelta / 90);
      if (offset === cube.lastOffset) {
        return;
      }
      cube.lastOffset = faceOffset = setOffset = offset;
      set = this.sets[cube.set];
      setLength = set.length;
      if (offset < 0) {
        faceOffset = setOffset = ++offset;
        if (offset < 0) {
          if (-offset > setLength) {
            setOffset = setLength - -offset % setLength;
            if (setOffset === setLength) {
              setOffset = 0;
            }
          } else {
            setOffset = setLength + offset;
          }
          if (-offset > 4) {
            faceOffset = 4 - -offset % 4;
            if (faceOffset === 4) {
              faceOffset = 0;
            }
          } else {
            faceOffset = 4 + offset;
          }
        }
      }
      if (setOffset >= setLength) {
        setOffset %= setLength;
      }
      if (faceOffset >= 4) {
        faceOffset %= 4;
      }
      topAdj = faceOffset - 1;
      bottomAdj = faceOffset + 1;
      if (topAdj === -1) {
        topAdj = 3;
      }
      if (bottomAdj === 4) {
        bottomAdj = 0;
      }
      this._setContent(cube[faceSequence[topAdj]], set[setOffset - 1] || set[setLength - 1]);
      return this._setContent(cube[faceSequence[bottomAdj]], set[setOffset + 1] || set[0]);
    };

    HexaFlip.prototype._onTouchStart = function(e, cube) {
      e.preventDefault();
      cube.touchStarted = true;
      e.currentTarget.classList.add('no-tween');
      if (e.type === 'mousedown') {
        return cube.y1 = e.pageY;
      } else {
        return cube.y1 = e.touches[0].pageY;
      }
    };

    HexaFlip.prototype._onTouchMove = function(e, cube) {
      if (!cube.touchStarted) {
        return;
      }
      e.preventDefault();
      cube.diff = (e.pageY - cube.y1) * this.touchSensitivity;
      cube.yDelta = cube.yLast - cube.diff;
      return this._setSides(cube);
    };

    HexaFlip.prototype._onTouchEnd = function(e, cube) {
      var mod;
      cube.touchStarted = false;
      mod = cube.yDelta % 90;
      if (mod < 45) {
        cube.yLast = cube.yDelta + mod;
      } else {
        if (cube.yDelta > 0) {
          cube.yLast = cube.yDelta + mod;
        } else {
          cube.yLast = cube.yDelta - (90 - mod);
        }
      }
      if (cube.yLast % 90 !== 0) {
        cube.yLast -= cube.yLast % 90;
      }
      cube.el.classList.remove('no-tween');
      return cube.el.style[css.transform] = this._getTransform(cube.yLast);
    };

    HexaFlip.prototype._onTouchLeave = function(e, cube) {
      if (!cube.touchStarted) {
        return;
      }
      return this._onTouchEnd(e, cube);
    };

    HexaFlip.prototype._onMouseOut = function(e, cube) {
      if (!cube.touchStarted) {
        return;
      }
      if (e.toElement && !cube.el.contains(e.toElement)) {
        return this._onTouchEnd(e, cube);
      }
    };

    HexaFlip.prototype.setValue = function(settings) {
      var cube, index, key, value, _results;
      _results = [];
      for (key in settings) {
        value = settings[key];
        if (!(this.sets[key] && !this.cubes[key].touchStarted)) {
          continue;
        }
        value = value.toString();
        cube = this.cubes[key];
        index = this.sets[key].indexOf(value);
        cube.yDelta = cube.yLast = 90 * index;
        this._setSides(cube);
        _results.push(this._setContent(cube[faceSequence[index % 4]], value));
      }
      return _results;
    };

    HexaFlip.prototype.getValue = function() {
      var cube, offset, set, setLength, _ref1, _results;
      _ref1 = this.cubes;
      _results = [];
      for (set in _ref1) {
        cube = _ref1[set];
        set = this.sets[set];
        setLength = set.length;
        offset = cube.yLast / 90;
        if (offset < 0) {
          if (-offset > setLength) {
            offset = setLength - -offset % setLength;
            if (offset === setLength) {
              offset = 0;
            }
          } else {
            offset = setLength + offset;
          }
        }
        if (offset >= setLength) {
          offset %= setLength;
        }
        if (typeof set[offset] === 'object') {
          _results.push(set[offset].value);
        } else {
          _results.push(set[offset]);
        }
      }
      return _results;
    };

    HexaFlip.prototype.flip = function(back) {
      var cube, delta, set, _ref1, _results;
      delta = back ? -90 : 90;
      _ref1 = this.cubes;
      _results = [];
      for (set in _ref1) {
        cube = _ref1[set];
        if (cube.touchStarted) {
          continue;
        }
        cube.yDelta = cube.yLast += delta;
        _results.push(this._setSides(cube));
      }
      return _results;
    };

    HexaFlip.prototype.flipBack = function() {
      return this.flip(true);
    };

    return HexaFlip;

  })();

  if ((window.jQuery != null) || (((_ref1 = window.$) != null ? _ref1.data : void 0) != null)) {
    $.fn.hexaFlip = function(sets, options) {
      var args, el, instance, methodName, _j, _k, _len1, _len2;
      if (!css.transform) {
        return this;
      }
      if (typeof sets === 'string') {
        methodName = sets;
        if (typeof HexaFlip.prototype[methodName] !== 'function') {
          return this;
        }
        for (_j = 0, _len1 = this.length; _j < _len1; _j++) {
          el = this[_j];
          if (!(instance = $.data(el, baseName))) {
            return;
          }
          args = Array.prototype.slice.call(arguments);
          args.shift();
          instance[methodName](args);
        }
        return this;
      } else {
        for (_k = 0, _len2 = this.length; _k < _len2; _k++) {
          el = this[_k];
          if (instance = $.data(el, baseName)) {
            return instance;
          } else {
            $.data(el, baseName, new HexaFlip(el, sets, options));
          }
        }
      }
    };
  }

}).call(this);
