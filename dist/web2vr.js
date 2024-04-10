(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("aframe"));
	else if(typeof define === 'function' && define.amd)
		define(["aframe"], factory);
	else if(typeof exports === 'object')
		exports["Web2VR"] = factory(require("aframe"));
	else
		root["Web2VR"] = factory(root["aframe"]);
})(self, (__WEBPACK_EXTERNAL_MODULE_aframe__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./aframe-super-hands-component/index.js":
/*!***********************************************!*\
  !*** ./aframe-super-hands-component/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}
__webpack_require__(/*! ./systems/super-hands-system.js */ "./aframe-super-hands-component/systems/super-hands-system.js");
__webpack_require__(/*! ./reaction_components/hoverable.js */ "./aframe-super-hands-component/reaction_components/hoverable.js");
__webpack_require__(/*! ./reaction_components/grabbable.js */ "./aframe-super-hands-component/reaction_components/grabbable.js");
__webpack_require__(/*! ./reaction_components/stretchable.js */ "./aframe-super-hands-component/reaction_components/stretchable.js");
__webpack_require__(/*! ./reaction_components/drag-droppable.js */ "./aframe-super-hands-component/reaction_components/drag-droppable.js");
__webpack_require__(/*! ./reaction_components/draggable.js */ "./aframe-super-hands-component/reaction_components/draggable.js");
__webpack_require__(/*! ./reaction_components/droppable.js */ "./aframe-super-hands-component/reaction_components/droppable.js");
__webpack_require__(/*! ./reaction_components/clickable.js */ "./aframe-super-hands-component/reaction_components/clickable.js");

/**
 * Super Hands component for A-Frame.
 */
AFRAME.registerComponent('super-hands', {
  schema: {
    colliderEvent: {
      "default": 'hit'
    },
    colliderEventProperty: {
      "default": 'el'
    },
    colliderEndEvent: {
      "default": 'hitend'
    },
    colliderEndEventProperty: {
      "default": 'el'
    },
    grabStartButtons: {
      "default": ['gripdown', 'trackpaddown', 'triggerdown', 'gripclose', 'abuttondown', 'bbuttondown', 'xbuttondown', 'ybuttondown', 'pointup', 'thumbup', 'pointingstart', 'pistolstart', 'thumbstickdown', 'mousedown', 'touchstart']
    },
    grabEndButtons: {
      "default": ['gripup', 'trackpadup', 'triggerup', 'gripopen', 'abuttonup', 'bbuttonup', 'xbuttonup', 'ybuttonup', 'pointdown', 'thumbdown', 'pointingend', 'pistolend', 'thumbstickup', 'mouseup', 'touchend']
    },
    stretchStartButtons: {
      "default": ['gripdown', 'trackpaddown', 'triggerdown', 'gripclose', 'abuttondown', 'bbuttondown', 'xbuttondown', 'ybuttondown', 'pointup', 'thumbup', 'pointingstart', 'pistolstart', 'thumbstickdown', 'mousedown', 'touchstart']
    },
    stretchEndButtons: {
      "default": ['gripup', 'trackpadup', 'triggerup', 'gripopen', 'abuttonup', 'bbuttonup', 'xbuttonup', 'ybuttonup', 'pointdown', 'thumbdown', 'pointingend', 'pistolend', 'thumbstickup', 'mouseup', 'touchend']
    },
    dragDropStartButtons: {
      "default": ['gripdown', 'trackpaddown', 'triggerdown', 'gripclose', 'abuttondown', 'bbuttondown', 'xbuttondown', 'ybuttondown', 'pointup', 'thumbup', 'pointingstart', 'pistolstart', 'thumbstickdown', 'mousedown', 'touchstart']
    },
    dragDropEndButtons: {
      "default": ['gripup', 'trackpadup', 'triggerup', 'gripopen', 'abuttonup', 'bbuttonup', 'xbuttonup', 'ybuttonup', 'pointdown', 'thumbdown', 'pointingend', 'pistolend', 'thumbstickup', 'mouseup', 'touchend']
    },
    interval: {
      "default": 0
    }
  },
  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,
  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function init() {
    // constants
    this.HOVER_EVENT = 'hover-start';
    this.UNHOVER_EVENT = 'hover-end';
    this.GRAB_EVENT = 'grab-start';
    this.UNGRAB_EVENT = 'grab-end';
    this.STRETCH_EVENT = 'stretch-start';
    this.UNSTRETCH_EVENT = 'stretch-end';
    this.DRAG_EVENT = 'drag-start';
    this.UNDRAG_EVENT = 'drag-end';
    this.DRAGOVER_EVENT = 'dragover-start';
    this.UNDRAGOVER_EVENT = 'dragover-end';
    this.DRAGDROP_EVENT = 'drag-drop';

    // links to other systems/components
    this.otherSuperHand = null;

    // state tracking - global event handlers (GEH)
    this.gehDragged = new Set();
    this.gehClicking = new Set();

    // state tracking - reaction components
    this.hoverEls = [];
    this.hoverElsIntersections = [];
    this.prevCheckTime = null;
    this.state = new Map();
    this.dragging = false;
    this.unHover = this.unHover.bind(this);
    this.unWatch = this.unWatch.bind(this);
    this.onHit = this.onHit.bind(this);
    this.onGrabStartButton = this.onGrabStartButton.bind(this);
    this.onGrabEndButton = this.onGrabEndButton.bind(this);
    this.onStretchStartButton = this.onStretchStartButton.bind(this);
    this.onStretchEndButton = this.onStretchEndButton.bind(this);
    this.onDragDropStartButton = this.onDragDropStartButton.bind(this);
    this.onDragDropEndButton = this.onDragDropEndButton.bind(this);
    this.system.registerMe(this);
  },
  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function update(oldData) {
    this.unRegisterListeners(oldData);
    this.registerListeners();
  },
  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function remove() {
    this.system.unregisterMe(this);
    this.unRegisterListeners();
    this.hoverEls.length = 0;
    if (this.state.get(this.HOVER_EVENT)) {
      this._unHover(this.state.get(this.HOVER_EVENT));
    }
    this.onGrabEndButton();
    this.onStretchEndButton();
    this.onDragDropEndButton();
  },
  tick: function () {
    // closer objects and objects with no distance come later in list
    function sorter(a, b) {
      var aDist = a.distance == null ? -1 : a.distance;
      var bDist = b.distance == null ? -1 : b.distance;
      if (aDist < bDist) {
        return 1;
      }
      if (bDist < aDist) {
        return -1;
      }
      return 0;
    }
    return function (time) {
      var data = this.data;
      var prevCheckTime = this.prevCheckTime;
      if (prevCheckTime && time - prevCheckTime < data.interval) {
        return;
      }
      this.prevCheckTime = time;
      var orderChanged = false;
      this.hoverElsIntersections.sort(sorter);
      for (var i = 0; i < this.hoverElsIntersections.length; i++) {
        if (this.hoverEls[i] !== this.hoverElsIntersections[i].object.el) {
          orderChanged = true;
          this.hoverEls[i] = this.hoverElsIntersections[i].object.el;
        }
      }
      if (orderChanged) {
        this.hover();
      }
    };
  }(),
  onGrabStartButton: function onGrabStartButton(evt) {
    var carried = this.state.get(this.GRAB_EVENT);
    this.dispatchMouseEventAll('mousedown', this.el);
    this.gehClicking = new Set(this.hoverEls);
    if (!carried) {
      carried = this.findTarget(this.GRAB_EVENT, {
        hand: this.el,
        buttonEvent: evt
      });
      if (carried) {
        this.state.set(this.GRAB_EVENT, carried);
        this._unHover(carried);
      }
    }
  },
  onGrabEndButton: function onGrabEndButton(evt) {
    var _this = this;
    var clickables = this.hoverEls.filter(function (h) {
      return _this.gehClicking.has(h);
    });
    var grabbed = this.state.get(this.GRAB_EVENT);
    var endEvt = {
      hand: this.el,
      buttonEvent: evt
    };
    this.dispatchMouseEventAll('mouseup', this.el);
    for (var i = 0; i < clickables.length; i++) {
      this.dispatchMouseEvent(clickables[i], 'click', this.el);
    }
    this.gehClicking.clear();
    // check if grabbed entity accepts ungrab event
    if (grabbed && !this.emitCancelable(grabbed, this.UNGRAB_EVENT, endEvt)) {
      /* push to top of stack so a drop followed by re-grab gets the same
         target */
      this.promoteHoveredEl(this.state.get(this.GRAB_EVENT));
      this.state["delete"](this.GRAB_EVENT);
      this.hover();
    }
  },
  onStretchStartButton: function onStretchStartButton(evt) {
    var stretched = this.state.get(this.STRETCH_EVENT);
    if (!stretched) {
      stretched = this.findTarget(this.STRETCH_EVENT, {
        hand: this.el,
        buttonEvent: evt
      });
      if (stretched) {
        this.state.set(this.STRETCH_EVENT, stretched);
        this._unHover(stretched);
      }
    }
  },
  onStretchEndButton: function onStretchEndButton(evt) {
    var stretched = this.state.get(this.STRETCH_EVENT);
    var endEvt = {
      hand: this.el,
      buttonEvent: evt
    };
    // check if end event accepted
    if (stretched && !this.emitCancelable(stretched, this.UNSTRETCH_EVENT, endEvt)) {
      this.promoteHoveredEl(stretched);
      this.state["delete"](this.STRETCH_EVENT);
      this.hover();
    }
  },
  onDragDropStartButton: function onDragDropStartButton(evt) {
    var dragged = this.state.get(this.DRAG_EVENT);
    this.dragging = true;
    if (this.hoverEls.length) {
      this.gehDragged = new Set(this.hoverEls);
      this.dispatchMouseEventAll('dragstart', this.el);
    }
    if (!dragged) {
      /* prefer carried so that a drag started after a grab will work
       with carried element rather than a currently intersected drop target.
       fall back to queue in case a drag is initiated independent
       of a grab */
      if (this.state.get(this.GRAB_EVENT) && !this.emitCancelable(this.state.get(this.GRAB_EVENT), this.DRAG_EVENT, {
        hand: this.el,
        buttonEvent: evt
      })) {
        dragged = this.state.get(this.GRAB_EVENT);
      } else {
        dragged = this.findTarget(this.DRAG_EVENT, {
          hand: this.el,
          buttonEvent: evt
        });
      }
      if (dragged) {
        this.state.set(this.DRAG_EVENT, dragged);
        this._unHover(dragged);
      }
    }
  },
  onDragDropEndButton: function onDragDropEndButton(evt) {
    var _this2 = this;
    var carried = this.state.get(this.DRAG_EVENT);
    this.dragging = false; // keep _unHover() from activating another droptarget
    this.gehDragged.forEach(function (carried) {
      _this2.dispatchMouseEvent(carried, 'dragend', _this2.el);
      // fire event both ways for all intersected targets
      _this2.dispatchMouseEventAll('drop', carried, true, true);
      _this2.dispatchMouseEventAll('dragleave', carried, true, true);
    });
    this.gehDragged.clear();
    if (carried) {
      var ddEvt = {
        hand: this.el,
        dropped: carried,
        on: null,
        buttonEvent: evt
      };
      var endEvt = {
        hand: this.el,
        buttonEvent: evt
      };
      var dropTarget = this.findTarget(this.DRAGDROP_EVENT, ddEvt, true);
      if (dropTarget) {
        ddEvt.on = dropTarget;
        this.emitCancelable(carried, this.DRAGDROP_EVENT, ddEvt);
        this._unHover(dropTarget);
      }
      // check if end event accepted
      if (!this.emitCancelable(carried, this.UNDRAG_EVENT, endEvt)) {
        this.promoteHoveredEl(carried);
        this.state["delete"](this.DRAG_EVENT);
        this.hover();
      }
    }
  },
  processHitEl: function processHitEl(hitEl, intersection) {
    var _this3 = this;
    var dist = intersection && intersection.distance;
    var sects = this.hoverElsIntersections;
    var hoverEls = this.hoverEls;
    var hitElIndex = this.hoverEls.indexOf(hitEl);
    var hoverNeedsUpdate = false;
    if (hitElIndex === -1) {
      hoverNeedsUpdate = true;
      // insert in order of distance when available
      if (dist != null) {
        var i = 0;
        while (i < sects.length && dist < sects[i].distance) {
          i++;
        }
        hoverEls.splice(i, 0, hitEl);
        sects.splice(i, 0, intersection);
      } else {
        hoverEls.push(hitEl);
        sects.push({
          object: {
            el: hitEl
          }
        });
      }
      this.dispatchMouseEvent(hitEl, 'mouseover', this.el);
      if (this.dragging && this.gehDragged.size) {
        // events on targets and on dragged
        this.gehDragged.forEach(function (dragged) {
          _this3.dispatchMouseEventAll('dragenter', dragged, true, true);
        });
      }
    }
    return hoverNeedsUpdate;
  },
  onHit: function onHit(evt) {
    var hitEl = evt.detail[this.data.colliderEventProperty];
    var hoverNeedsUpdate = 0;
    if (!hitEl) {
      return;
    }
    if (Array.isArray(hitEl)) {
      for (var i = 0, sect; i < hitEl.length; i++) {
        sect = evt.detail.intersections && evt.detail.intersections[i];
        hoverNeedsUpdate += this.processHitEl(hitEl[i], sect);
      }
    } else {
      hoverNeedsUpdate += this.processHitEl(hitEl, null);
    }
    if (hoverNeedsUpdate) {
      this.hover();
    }
  },
  /* search collided entities for target to hover/dragover */
  hover: function hover() {
    var hvrevt, hoverEl;
    // end previous hover
    if (this.state.has(this.HOVER_EVENT)) {
      this._unHover(this.state.get(this.HOVER_EVENT), true);
    }
    if (this.state.has(this.DRAGOVER_EVENT)) {
      this._unHover(this.state.get(this.DRAGOVER_EVENT), true);
    }
    if (this.dragging && this.state.get(this.DRAG_EVENT)) {
      hvrevt = {
        hand: this.el,
        hovered: hoverEl,
        carried: this.state.get(this.DRAG_EVENT)
      };
      hoverEl = this.findTarget(this.DRAGOVER_EVENT, hvrevt, true);
      if (hoverEl) {
        this.emitCancelable(this.state.get(this.DRAG_EVENT), this.DRAGOVER_EVENT, hvrevt);
        this.state.set(this.DRAGOVER_EVENT, hoverEl);
      }
    }
    // fallback to hover if not dragging or dragover wasn't successful
    if (!this.state.has(this.DRAGOVER_EVENT)) {
      hoverEl = this.findTarget(this.HOVER_EVENT, {
        hand: this.el
      }, true);
      if (hoverEl) {
        this.state.set(this.HOVER_EVENT, hoverEl);
      }
    }
  },
  /* called when controller moves out of collision range of entity */
  unHover: function unHover(evt) {
    var _this4 = this;
    var clearedEls = evt.detail[this.data.colliderEndEventProperty];
    if (clearedEls) {
      if (Array.isArray(clearedEls)) {
        clearedEls.forEach(function (el) {
          return _this4._unHover(el);
        });
      } else {
        this._unHover(clearedEls);
      }
    }
  },
  /* inner unHover steps needed regardless of cause of unHover */
  _unHover: function _unHover(el, skipNextHover) {
    var unHovered = false;
    var evt;
    if (el === this.state.get(this.DRAGOVER_EVENT)) {
      this.state["delete"](this.DRAGOVER_EVENT);
      unHovered = true;
      evt = {
        hand: this.el,
        hovered: el,
        carried: this.state.get(this.DRAG_EVENT)
      };
      this.emitCancelable(el, this.UNDRAGOVER_EVENT, evt);
      if (this.state.has(this.DRAG_EVENT)) {
        this.emitCancelable(this.state.get(this.DRAG_EVENT), this.UNDRAGOVER_EVENT, evt);
      }
    }
    if (el === this.state.get(this.HOVER_EVENT)) {
      this.state["delete"](this.HOVER_EVENT);
      unHovered = true;
      this.emitCancelable(el, this.UNHOVER_EVENT, {
        hand: this.el
      });
    }
    // activate next target, if present
    if (unHovered && !skipNextHover) {
      this.hover();
    }
  },
  unWatch: function unWatch(evt) {
    var _this5 = this;
    var clearedEls = evt.detail[this.data.colliderEndEventProperty];
    if (clearedEls) {
      if (Array.isArray(clearedEls)) {
        clearedEls.forEach(function (el) {
          return _this5._unWatch(el);
        });
      } else {
        // deprecation path: sphere-collider
        this._unWatch(clearedEls);
      }
    }
  },
  _unWatch: function _unWatch(target) {
    var _this6 = this;
    var hoverIndex = this.hoverEls.indexOf(target);
    if (hoverIndex !== -1) {
      this.hoverEls.splice(hoverIndex, 1);
      this.hoverElsIntersections.splice(hoverIndex, 1);
    }
    this.gehDragged.forEach(function (dragged) {
      _this6.dispatchMouseEvent(target, 'dragleave', dragged);
      _this6.dispatchMouseEvent(dragged, 'dragleave', target);
    });
    this.dispatchMouseEvent(target, 'mouseout', this.el);
  },
  registerListeners: function registerListeners() {
    var _this7 = this;
    this.el.addEventListener(this.data.colliderEvent, this.onHit);
    this.el.addEventListener(this.data.colliderEndEvent, this.unWatch);
    this.el.addEventListener(this.data.colliderEndEvent, this.unHover);

    // binding order to keep grabEnd from triggering dragover
    // again before dragDropEnd can delete its carried state
    this.data.grabStartButtons.forEach(function (b) {
      _this7.el.addEventListener(b, _this7.onGrabStartButton);
    });
    this.data.stretchStartButtons.forEach(function (b) {
      _this7.el.addEventListener(b, _this7.onStretchStartButton);
    });
    this.data.dragDropStartButtons.forEach(function (b) {
      _this7.el.addEventListener(b, _this7.onDragDropStartButton);
    });
    this.data.dragDropEndButtons.forEach(function (b) {
      _this7.el.addEventListener(b, _this7.onDragDropEndButton);
    });
    this.data.stretchEndButtons.forEach(function (b) {
      _this7.el.addEventListener(b, _this7.onStretchEndButton);
    });
    this.data.grabEndButtons.forEach(function (b) {
      _this7.el.addEventListener(b, _this7.onGrabEndButton);
    });
  },
  unRegisterListeners: function unRegisterListeners(data) {
    var _this8 = this;
    data = data || this.data;
    if (Object.keys(data).length === 0) {
      // Empty object passed on initalization
      return;
    }
    this.el.removeEventListener(data.colliderEvent, this.onHit);
    this.el.removeEventListener(data.colliderEndEvent, this.unHover);
    this.el.removeEventListener(data.colliderEndEvent, this.unWatch);
    data.grabStartButtons.forEach(function (b) {
      _this8.el.removeEventListener(b, _this8.onGrabStartButton);
    });
    data.grabEndButtons.forEach(function (b) {
      _this8.el.removeEventListener(b, _this8.onGrabEndButton);
    });
    data.stretchStartButtons.forEach(function (b) {
      _this8.el.removeEventListener(b, _this8.onStretchStartButton);
    });
    data.stretchEndButtons.forEach(function (b) {
      _this8.el.removeEventListener(b, _this8.onStretchEndButton);
    });
    data.dragDropStartButtons.forEach(function (b) {
      _this8.el.removeEventListener(b, _this8.onDragDropStartButton);
    });
    data.dragDropEndButtons.forEach(function (b) {
      _this8.el.removeEventListener(b, _this8.onDragDropEndButton);
    });
  },
  emitCancelable: function emitCancelable(target, name, detail) {
    detail = detail || {};
    var data = {
      bubbles: true,
      cancelable: true,
      detail: detail
    };
    data.detail.target = data.detail.target || target;
    var evt = new window.CustomEvent(name, data);
    return target.dispatchEvent(evt);
  },
  dispatchMouseEvent: function dispatchMouseEvent(target, name, relatedTarget) {
    var mEvt = new window.MouseEvent(name, {
      relatedTarget: relatedTarget
    });
    target.dispatchEvent(mEvt);
  },
  dispatchMouseEventAll: function dispatchMouseEventAll(name, relatedTarget, filterUsed, alsoReverse) {
    var _this9 = this;
    var els = this.hoverEls;
    if (filterUsed) {
      els = els.filter(function (el) {
        return el !== _this9.state.get(_this9.GRAB_EVENT) && el !== _this9.state.get(_this9.DRAG_EVENT) && el !== _this9.state.get(_this9.STRETCH_EVENT) && !_this9.gehDragged.has(el);
      });
    }
    if (alsoReverse) {
      for (var i = 0; i < els.length; i++) {
        this.dispatchMouseEvent(els[i], name, relatedTarget);
        this.dispatchMouseEvent(relatedTarget, name, els[i]);
      }
    } else {
      for (var _i = 0; _i < els.length; _i++) {
        this.dispatchMouseEvent(els[_i], name, relatedTarget);
      }
    }
  },
  findTarget: function findTarget(evType, detail, filterUsed) {
    var _this10 = this;
    var elIndex;
    var eligibleEls = this.hoverEls;
    if (filterUsed) {
      eligibleEls = eligibleEls.filter(function (el) {
        return el !== _this10.state.get(_this10.GRAB_EVENT) && el !== _this10.state.get(_this10.DRAG_EVENT) && el !== _this10.state.get(_this10.STRETCH_EVENT);
      });
    }
    for (elIndex = eligibleEls.length - 1; elIndex >= 0; elIndex--) {
      if (!this.emitCancelable(eligibleEls[elIndex], evType, detail)) {
        return eligibleEls[elIndex];
      }
    }
    return null;
  },
  // Helper to ensure dropping and regrabbing finds the same target for
  // for order-sorted hoverEls (grabbing; no-op for distance-sorted (pointing)
  promoteHoveredEl: function promoteHoveredEl(el) {
    var hoverIndex = this.hoverEls.indexOf(el);
    if (hoverIndex !== -1 && this.hoverElsIntersections[hoverIndex].distance == null) {
      this.hoverEls.splice(hoverIndex, 1);
      var sect = this.hoverElsIntersections.splice(hoverIndex, 1);
      this.hoverEls.push(el);
      this.hoverElsIntersections.push(sect[0]);
    }
  }
});

/***/ }),

/***/ "./aframe-super-hands-component/reaction_components/clickable.js":
/*!***********************************************************************!*\
  !*** ./aframe-super-hands-component/reaction_components/clickable.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/* global AFRAME */
var buttonCore = __webpack_require__(/*! ./prototypes/buttons-proto.js */ "./aframe-super-hands-component/reaction_components/prototypes/buttons-proto.js");
AFRAME.registerComponent('clickable', AFRAME.utils.extendDeep({}, buttonCore, {
  schema: {
    onclick: {
      type: 'string'
    }
  },
  init: function init() {
    this.CLICKED_STATE = 'clicked';
    this.CLICK_EVENT = 'grab-start';
    this.UNCLICK_EVENT = 'grab-end';
    this.clickers = [];
    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
    this.el.addEventListener(this.CLICK_EVENT, this.start);
    this.el.addEventListener(this.UNCLICK_EVENT, this.end);
  },
  remove: function remove() {
    this.el.removeEventListener(this.CLICK_EVENT, this.start);
    this.el.removeEventListener(this.UNCLICK_EVENT, this.end);
  },
  start: function start(evt) {
    if (evt.defaultPrevented || !this.startButtonOk(evt)) {
      return;
    }
    this.el.addState(this.CLICKED_STATE);
    if (this.clickers.indexOf(evt.detail.hand) === -1) {
      this.clickers.push(evt.detail.hand);
      if (evt.preventDefault) {
        evt.preventDefault();
      }
    }
  },
  end: function end(evt) {
    var handIndex = this.clickers.indexOf(evt.detail.hand);
    if (evt.defaultPrevented || !this.endButtonOk(evt)) {
      return;
    }
    if (handIndex !== -1) {
      this.clickers.splice(handIndex, 1);
    }
    if (this.clickers.length < 1) {
      this.el.removeState(this.CLICKED_STATE);
    }
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  }
}));

/***/ }),

/***/ "./aframe-super-hands-component/reaction_components/drag-droppable.js":
/*!****************************************************************************!*\
  !*** ./aframe-super-hands-component/reaction_components/drag-droppable.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/* global AFRAME */
var inherit = AFRAME.utils.extendDeep;
var buttonCore = __webpack_require__(/*! ./prototypes/buttons-proto.js */ "./aframe-super-hands-component/reaction_components/prototypes/buttons-proto.js");
AFRAME.registerComponent('drag-droppable', inherit({}, buttonCore, {
  init: function init() {
    console.warn('Warning: drag-droppable is deprecated. Use draggable and droppable components instead');
    this.HOVERED_STATE = 'dragover';
    this.DRAGGED_STATE = 'dragged';
    this.HOVER_EVENT = 'dragover-start';
    this.UNHOVER_EVENT = 'dragover-end';
    this.DRAG_EVENT = 'drag-start';
    this.UNDRAG_EVENT = 'drag-end';
    this.DRAGDROP_EVENT = 'drag-drop';
    this.hoverStart = this.hoverStart.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.hoverEnd = this.hoverEnd.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.dragDrop = this.dragDrop.bind(this);
    this.el.addEventListener(this.HOVER_EVENT, this.hoverStart);
    this.el.addEventListener(this.DRAG_EVENT, this.dragStart);
    this.el.addEventListener(this.UNHOVER_EVENT, this.hoverEnd);
    this.el.addEventListener(this.UNDRAG_EVENT, this.dragEnd);
    this.el.addEventListener(this.DRAGDROP_EVENT, this.dragDrop);
  },
  remove: function remove() {
    this.el.removeEventListener(this.HOVER_EVENT, this.hoverStart);
    this.el.removeEventListener(this.DRAG_EVENT, this.dragStart);
    this.el.removeEventListener(this.UNHOVER_EVENT, this.hoverEnd);
    this.el.removeEventListener(this.UNDRAG_EVENT, this.dragEnd);
    this.el.removeEventListener(this.DRAGDROP_EVENT, this.dragDrop);
  },
  hoverStart: function hoverStart(evt) {
    this.el.addState(this.HOVERED_STATE);
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  },
  dragStart: function dragStart(evt) {
    if (!this.startButtonOk(evt)) {
      return;
    }
    this.el.addState(this.DRAGGED_STATE);
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  },
  hoverEnd: function hoverEnd(evt) {
    this.el.removeState(this.HOVERED_STATE);
  },
  dragEnd: function dragEnd(evt) {
    if (!this.endButtonOk(evt)) {
      return;
    }
    this.el.removeState(this.DRAGGED_STATE);
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  },
  dragDrop: function dragDrop(evt) {
    if (!this.endButtonOk(evt)) {
      return;
    }
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  }
}));

/***/ }),

/***/ "./aframe-super-hands-component/reaction_components/draggable.js":
/*!***********************************************************************!*\
  !*** ./aframe-super-hands-component/reaction_components/draggable.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/* global AFRAME */
var inherit = AFRAME.utils.extendDeep;
var buttonCore = __webpack_require__(/*! ./prototypes/buttons-proto.js */ "./aframe-super-hands-component/reaction_components/prototypes/buttons-proto.js");
AFRAME.registerComponent('draggable', inherit({}, buttonCore, {
  init: function init() {
    this.DRAGGED_STATE = 'dragged';
    this.DRAG_EVENT = 'drag-start';
    this.UNDRAG_EVENT = 'drag-end';
    this.dragStartBound = this.dragStart.bind(this);
    this.dragEndBound = this.dragEnd.bind(this);
    this.el.addEventListener(this.DRAG_EVENT, this.dragStartBound);
    this.el.addEventListener(this.UNDRAG_EVENT, this.dragEndBound);
  },
  remove: function remove() {
    this.el.removeEventListener(this.DRAG_EVENT, this.dragStart);
    this.el.removeEventListener(this.UNDRAG_EVENT, this.dragEnd);
  },
  dragStart: function dragStart(evt) {
    if (evt.defaultPrevented || !this.startButtonOk(evt)) {
      return;
    }
    this.el.addState(this.DRAGGED_STATE);
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  },
  dragEnd: function dragEnd(evt) {
    if (evt.defaultPrevented || !this.endButtonOk(evt)) {
      return;
    }
    this.el.removeState(this.DRAGGED_STATE);
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  }
}));

/***/ }),

/***/ "./aframe-super-hands-component/reaction_components/droppable.js":
/*!***********************************************************************!*\
  !*** ./aframe-super-hands-component/reaction_components/droppable.js ***!
  \***********************************************************************/
/***/ (() => {

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* global AFRAME */
function elementMatches(el, selector) {
  if (el.matches) {
    return el.matches(selector);
  }
  if (el.msMatchesSelector) {
    return el.msMatchesSelector(selector);
  }
  if (el.webkitMatchesSelector) {
    return el.webkitMatchesSelector(selector);
  }
}
AFRAME.registerComponent('droppable', {
  schema: {
    accepts: {
      "default": ''
    },
    autoUpdate: {
      "default": true
    },
    acceptEvent: {
      "default": ''
    },
    rejectEvent: {
      "default": ''
    }
  },
  multiple: true,
  init: function init() {
    this.HOVERED_STATE = 'dragover';
    this.HOVER_EVENT = 'dragover-start';
    this.UNHOVER_EVENT = 'dragover-end';
    this.DRAGDROP_EVENT = 'drag-drop';

    // better for Sinon spying if original method not overwritten
    this.hoverStartBound = this.hoverStart.bind(this);
    this.hoverEndBound = this.hoverEnd.bind(this);
    this.dragDropBound = this.dragDrop.bind(this);
    this.mutateAcceptsBound = this.mutateAccepts.bind(this);
    this.acceptableEntities = [];
    this.observer = new window.MutationObserver(this.mutateAcceptsBound);
    this.observerOpts = {
      childList: true,
      subtree: true
    };
    this.el.addEventListener(this.HOVER_EVENT, this.hoverStartBound);
    this.el.addEventListener(this.UNHOVER_EVENT, this.hoverEndBound);
    this.el.addEventListener(this.DRAGDROP_EVENT, this.dragDropBound);
  },
  update: function update() {
    if (this.data.accepts.length) {
      this.acceptableEntities = Array.prototype.slice.call(this.el.sceneEl.querySelectorAll(this.data.accepts));
    } else {
      this.acceptableEntities = null;
    }
    if (this.data.autoUpdate && this.acceptableEntities != null) {
      this.observer.observe(this.el.sceneEl, this.observerOpts);
    } else {
      this.observer.disconnect();
    }
  },
  remove: function remove() {
    this.el.removeEventListener(this.HOVER_EVENT, this.hoverStartBound);
    this.el.removeEventListener(this.UNHOVER_EVENT, this.hoverEndBound);
    this.el.removeEventListener(this.DRAGDROP_EVENT, this.dragDropBound);
    this.observer.disconnect();
  },
  mutateAccepts: function mutateAccepts(mutations) {
    var _this = this;
    var query = this.data.accepts;
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (added) {
        if (elementMatches(added, query)) {
          _this.acceptableEntities.push(added);
        }
      });
    });
  },
  entityAcceptable: function entityAcceptable(entity) {
    var acceptableEntities = this.acceptableEntities;
    if (acceptableEntities == null) {
      return true;
    }
    var _iterator = _createForOfIteratorHelper(acceptableEntities),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        if (item === entity) {
          return true;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return false;
  },
  hoverStart: function hoverStart(evt) {
    if (evt.defaultPrevented || !this.entityAcceptable(evt.detail.carried)) {
      return;
    }
    this.el.addState(this.HOVERED_STATE);
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  },
  hoverEnd: function hoverEnd(evt) {
    if (evt.defaultPrevented) {
      return;
    }
    this.el.removeState(this.HOVERED_STATE);
  },
  dragDrop: function dragDrop(evt) {
    if (evt.defaultPrevented) {
      return;
    }
    var dropped = evt.detail.dropped;
    if (!this.entityAcceptable(dropped)) {
      if (this.data.rejectEvent.length) {
        this.el.emit(this.data.rejectEvent, {
          el: dropped
        });
      }
      return;
    }
    if (this.data.acceptEvent.length) {
      this.el.emit(this.data.acceptEvent, {
        el: dropped
      });
    }
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  }
});

/***/ }),

/***/ "./aframe-super-hands-component/reaction_components/grabbable.js":
/*!***********************************************************************!*\
  !*** ./aframe-super-hands-component/reaction_components/grabbable.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/* global AFRAME, THREE */
var inherit = AFRAME.utils.extendDeep;
var physicsCore = __webpack_require__(/*! ./prototypes/physics-grab-proto.js */ "./aframe-super-hands-component/reaction_components/prototypes/physics-grab-proto.js");
var buttonsCore = __webpack_require__(/*! ./prototypes/buttons-proto.js */ "./aframe-super-hands-component/reaction_components/prototypes/buttons-proto.js");
// new object with all core modules
var base = inherit({}, physicsCore, buttonsCore);
AFRAME.registerComponent('sh-grabbable', inherit(base, {
  schema: {
    maxGrabbers: {
      type: 'int',
      "default": NaN
    },
    invert: {
      "default": false
    },
    suppressY: {
      "default": false
    }
  },
  init: function init() {
    var _this = this;
    this.GRABBED_STATE = 'grabbed';
    this.GRAB_EVENT = 'grab-start';
    this.UNGRAB_EVENT = 'grab-end';
    this.grabbed = false;
    this.grabbers = [];
    this.constraints = new Map();
    this.deltaPositionIsValid = false;
    this.grabDistance = undefined;
    this.grabDirection = {
      x: 0,
      y: 0,
      z: -1
    };
    this.grabOffset = {
      x: 0,
      y: 0,
      z: 0
    };
    // persistent object speeds up repeat setAttribute calls
    this.destPosition = {
      x: 0,
      y: 0,
      z: 0
    };
    this.deltaPosition = new THREE.Vector3();
    this.targetPosition = new THREE.Vector3();
    this.physicsInit();
    this.el.addEventListener(this.GRAB_EVENT, function (e) {
      return _this.start(e);
    });
    this.el.addEventListener(this.UNGRAB_EVENT, function (e) {
      return _this.end(e);
    });
    this.el.addEventListener('mouseout', function (e) {
      return _this.lostGrabber(e);
    });
  },
  update: function update() {
    this.physicsUpdate();
    this.xFactor = this.data.invert ? -1 : 1;
    this.zFactor = this.data.invert ? -1 : 1;
    this.yFactor = (this.data.invert ? -1 : 1) * !this.data.suppressY;
  },
  tick: function () {
    var q = new THREE.Quaternion();
    var v = new THREE.Vector3();
    return function () {
      var entityPosition;
      if (this.grabber) {
        // reflect on z-axis to point in same direction as the laser
        this.targetPosition.copy(this.grabDirection);
        this.targetPosition.applyQuaternion(this.grabber.object3D.getWorldQuaternion(q)).setLength(this.grabDistance).add(this.grabber.object3D.getWorldPosition(v)).add(this.grabOffset);
        if (this.deltaPositionIsValid) {
          // relative position changes work better with nested entities
          this.deltaPosition.sub(this.targetPosition);
          entityPosition = this.el.getAttribute('position');
          this.destPosition.x = entityPosition.x - this.deltaPosition.x * this.xFactor;
          this.destPosition.y = entityPosition.y - this.deltaPosition.y * this.yFactor;
          this.destPosition.z = entityPosition.z - this.deltaPosition.z * this.zFactor;
          this.el.setAttribute('position', this.destPosition);
        } else {
          this.deltaPositionIsValid = true;
        }
        this.deltaPosition.copy(this.targetPosition);
      }
    };
  }(),
  remove: function remove() {
    this.el.removeEventListener(this.GRAB_EVENT, this.start);
    this.el.removeEventListener(this.UNGRAB_EVENT, this.end);
    this.physicsRemove();
  },
  start: function start(evt) {
    if (evt.defaultPrevented || !this.startButtonOk(evt)) {
      return;
    }
    // room for more grabbers?
    var grabAvailable = !Number.isFinite(this.data.maxGrabbers) || this.grabbers.length < this.data.maxGrabbers;
    if (this.grabbers.indexOf(evt.detail.hand) === -1 && grabAvailable) {
      if (!evt.detail.hand.object3D) {
        console.warn('sh-grabbable entities must have an object3D');
        return;
      }
      this.grabbers.push(evt.detail.hand);
      // initiate physics if available, otherwise manual
      if (!this.physicsStart(evt) && !this.grabber) {
        this.grabber = evt.detail.hand;
        this.resetGrabber();
      }
      // notify super-hands that the gesture was accepted
      if (evt.preventDefault) {
        evt.preventDefault();
      }
      this.grabbed = true;
      this.el.addState(this.GRABBED_STATE);
    }
  },
  end: function end(evt) {
    var handIndex = this.grabbers.indexOf(evt.detail.hand);
    if (evt.defaultPrevented || !this.endButtonOk(evt)) {
      return;
    }
    if (handIndex !== -1) {
      this.grabbers.splice(handIndex, 1);
      this.grabber = this.grabbers[0];
    }
    this.physicsEnd(evt);
    if (!this.resetGrabber()) {
      this.grabbed = false;
      this.el.removeState(this.GRABBED_STATE);
    }
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  },
  resetGrabber: function () {
    var objPos = new THREE.Vector3();
    var grabPos = new THREE.Vector3();
    return function () {
      if (!this.grabber) {
        return false;
      }
      var raycaster = this.grabber.getAttribute('raycaster');
      this.deltaPositionIsValid = false;
      this.grabDistance = this.el.object3D.getWorldPosition(objPos).distanceTo(this.grabber.object3D.getWorldPosition(grabPos));
      if (raycaster) {
        this.grabDirection = raycaster.direction;
        this.grabOffset = raycaster.origin;
      }
      return true;
    };
  }(),
  lostGrabber: function lostGrabber(evt) {
    var i = this.grabbers.indexOf(evt.relatedTarget);
    // if a queued, non-physics grabber leaves the collision zone, forget it
    if (i !== -1 && evt.relatedTarget !== this.grabber && !this.physicsIsConstrained(evt.relatedTarget)) {
      this.grabbers.splice(i, 1);
    }
  }
}));

/***/ }),

/***/ "./aframe-super-hands-component/reaction_components/hoverable.js":
/*!***********************************************************************!*\
  !*** ./aframe-super-hands-component/reaction_components/hoverable.js ***!
  \***********************************************************************/
/***/ (() => {

/* global AFRAME */
AFRAME.registerComponent('hoverable', {
  init: function init() {
    this.HOVERED_STATE = 'hovered';
    this.HOVER_EVENT = 'hover-start';
    this.UNHOVER_EVENT = 'hover-end';
    this.hoverers = [];
    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
    this.el.addEventListener(this.HOVER_EVENT, this.start);
    this.el.addEventListener(this.UNHOVER_EVENT, this.end);
  },
  remove: function remove() {
    this.el.removeEventListener(this.HOVER_EVENT, this.start);
    this.el.removeEventListener(this.UNHOVER_EVENT, this.end);
  },
  start: function start(evt) {
    if (evt.defaultPrevented) {
      return;
    }
    this.el.addState(this.HOVERED_STATE);
    if (this.hoverers.indexOf(evt.detail.hand) === -1) {
      this.hoverers.push(evt.detail.hand);
    }
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  },
  end: function end(evt) {
    if (evt.defaultPrevented) {
      return;
    }
    var handIndex = this.hoverers.indexOf(evt.detail.hand);
    if (handIndex !== -1) {
      this.hoverers.splice(handIndex, 1);
    }
    if (this.hoverers.length < 1) {
      this.el.removeState(this.HOVERED_STATE);
    }
  }
});

/***/ }),

/***/ "./aframe-super-hands-component/reaction_components/prototypes/buttons-proto.js":
/*!**************************************************************************************!*\
  !*** ./aframe-super-hands-component/reaction_components/prototypes/buttons-proto.js ***!
  \**************************************************************************************/
/***/ ((module) => {

// common code used in customizing reaction components by button
module.exports = function () {
  function buttonIsValid(evt, buttonList) {
    return buttonList.length === 0 || buttonList.indexOf(evt.detail.buttonEvent.type) !== -1;
  }
  return {
    schema: {
      startButtons: {
        "default": []
      },
      endButtons: {
        "default": []
      }
    },
    startButtonOk: function startButtonOk(evt) {
      return buttonIsValid(evt, this.data.startButtons);
    },
    endButtonOk: function endButtonOk(evt) {
      return buttonIsValid(evt, this.data.endButtons);
    }
  };
}();

/***/ }),

/***/ "./aframe-super-hands-component/reaction_components/prototypes/physics-grab-proto.js":
/*!*******************************************************************************************!*\
  !*** ./aframe-super-hands-component/reaction_components/prototypes/physics-grab-proto.js ***!
  \*******************************************************************************************/
/***/ ((module) => {

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// base code used by grabbable for physics interactions
module.exports = {
  schema: {
    usePhysics: {
      "default": 'ifavailable'
    }
  },
  physicsInit: function physicsInit() {
    this.constraints = new Map();
  },
  physicsUpdate: function physicsUpdate() {
    if (this.data.usePhysics === 'never' && this.constraints.size) {
      this.physicsClear();
    }
  },
  physicsRemove: function physicsRemove() {
    this.physicsClear();
  },
  physicsStart: function physicsStart(evt) {
    // initiate physics constraint if available and not already existing
    if (this.data.usePhysics !== 'never' && this.el.body && evt.detail.hand.body && !this.constraints.has(evt.detail.hand)) {
      var newConId = Math.random().toString(36).substr(2, 9);
      this.el.setAttribute('constraint__' + newConId, {
        target: evt.detail.hand
      });
      this.constraints.set(evt.detail.hand, newConId);
      return true;
    }
    // Prevent manual grab by returning true
    if (this.data.usePhysics === 'only') {
      return true;
    }
    return false;
  },
  physicsEnd: function physicsEnd(evt) {
    var constraintId = this.constraints.get(evt.detail.hand);
    if (constraintId) {
      this.el.removeAttribute('constraint__' + constraintId);
      this.constraints["delete"](evt.detail.hand);
    }
  },
  physicsClear: function physicsClear() {
    if (this.el.body) {
      var _iterator = _createForOfIteratorHelper(this.constraints.values()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var c = _step.value;
          this.el.body.world.removeConstraint(c);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    this.constraints.clear();
  },
  physicsIsConstrained: function physicsIsConstrained(el) {
    return this.constraints.has(el);
  },
  physicsIsGrabbing: function physicsIsGrabbing() {
    return this.constraints.size > 0;
  }
};

/***/ }),

/***/ "./aframe-super-hands-component/reaction_components/stretchable.js":
/*!*************************************************************************!*\
  !*** ./aframe-super-hands-component/reaction_components/stretchable.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* global AFRAME, THREE */
var inherit = AFRAME.utils.extendDeep;
var buttonsCore = __webpack_require__(/*! ./prototypes/buttons-proto.js */ "./aframe-super-hands-component/reaction_components/prototypes/buttons-proto.js");
// new object with all core modules
var base = inherit({}, buttonsCore);
AFRAME.registerComponent('stretchable', inherit(base, {
  schema: {
    usePhysics: {
      "default": 'ifavailable'
    },
    invert: {
      "default": false
    },
    physicsUpdateRate: {
      "default": 100
    }
  },
  init: function init() {
    this.STRETCHED_STATE = 'stretched';
    this.STRETCH_EVENT = 'stretch-start';
    this.UNSTRETCH_EVENT = 'stretch-end';
    this.stretched = false;
    this.stretchers = [];
    this.scale = new THREE.Vector3();
    this.handPos = new THREE.Vector3();
    this.otherHandPos = new THREE.Vector3();
    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
    this.el.addEventListener(this.STRETCH_EVENT, this.start);
    this.el.addEventListener(this.UNSTRETCH_EVENT, this.end);
  },
  update: function update(oldDat) {
    this.updateBodies = AFRAME.utils.throttleTick(this._updateBodies, this.data.physicsUpdateRate, this);
  },
  tick: function tick(time, timeDelta) {
    if (!this.stretched) {
      return;
    }
    this.scale.copy(this.el.getAttribute('scale'));
    this.stretchers[0].object3D.getWorldPosition(this.handPos);
    this.stretchers[1].object3D.getWorldPosition(this.otherHandPos);
    var currentStretch = this.handPos.distanceTo(this.otherHandPos);
    var deltaStretch = 1;
    if (this.previousStretch !== null && currentStretch !== 0) {
      deltaStretch = Math.pow(currentStretch / this.previousStretch, this.data.invert ? -1 : 1);
    }
    this.previousStretch = currentStretch;
    if (this.previousPhysicsStretch == null) {
      // establish correct baseline even if throttled function isn't called
      this.previousPhysicsStretch = currentStretch;
    }
    this.scale.multiplyScalar(deltaStretch);
    this.el.setAttribute('scale', this.scale);
    // scale update for all nested physics bodies (throttled)
    this.updateBodies(time, timeDelta);
  },
  remove: function remove() {
    this.el.removeEventListener(this.STRETCH_EVENT, this.start);
    this.el.removeEventListener(this.UNSTRETCH_EVENT, this.end);
  },
  start: function start(evt) {
    if (this.stretched || this.stretchers.includes(evt.detail.hand) || !this.startButtonOk(evt) || evt.defaultPrevented) {
      return;
    } // already stretched or already captured this hand or wrong button
    this.stretchers.push(evt.detail.hand);
    if (this.stretchers.length === 2) {
      this.stretched = true;
      this.previousStretch = null;
      this.previousPhysicsStretch = null;
      this.el.addState(this.STRETCHED_STATE);
    }
    if (evt.preventDefault) {
      evt.preventDefault();
    } // gesture accepted
  },
  end: function end(evt) {
    var stretcherIndex = this.stretchers.indexOf(evt.detail.hand);
    if (evt.defaultPrevented || !this.endButtonOk(evt)) {
      return;
    }
    if (stretcherIndex !== -1) {
      this.stretchers.splice(stretcherIndex, 1);
      this.stretched = false;
      this.el.removeState(this.STRETCHED_STATE);
      // override throttle to push last stretch to physics bodies
      this._updateBodies();
    }
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  },
  _updateBodies: function _updateBodies() {
    if (!this.el.body || this.data.usePhysics === 'never') {
      return;
    }
    var currentStretch = this.previousStretch; // last visible geometry stretch
    var deltaStretch = 1;
    if (this.previousPhysicsStretch !== null && currentStretch > 0) {
      deltaStretch = Math.pow(currentStretch / this.previousPhysicsStretch, this.data.invert ? -1 : 1);
    }
    this.previousPhysicsStretch = currentStretch;
    if (deltaStretch === 1) {
      return;
    }
    var _iterator = _createForOfIteratorHelper(this.el.childNodes),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var c = _step.value;
        this.stretchBody(c, deltaStretch);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    this.stretchBody(this.el, deltaStretch);
  },
  stretchBody: function stretchBody(el, deltaStretch) {
    if (!el.body) {
      return;
    }
    var physicsShape;
    var offset;
    for (var i = 0; i < el.body.shapes.length; i++) {
      physicsShape = el.body.shapes[i];
      if (physicsShape.halfExtents) {
        physicsShape.halfExtents.scale(deltaStretch, physicsShape.halfExtents);
        physicsShape.updateConvexPolyhedronRepresentation();
      } else if (physicsShape.radius) {
        physicsShape.radius *= deltaStretch;
        physicsShape.updateBoundingSphereRadius();
      } else if (!this.shapeWarned) {
        console.warn('Unable to stretch physics body: unsupported shape');
        this.shapeWarned = true;
      }
      // also move offset to match scale change
      offset = el.body.shapeOffsets[i];
      offset.scale(deltaStretch, offset);
    }
    el.body.updateBoundingRadius();
  }
}));

/***/ }),

/***/ "./aframe-super-hands-component/systems/super-hands-system.js":
/*!********************************************************************!*\
  !*** ./aframe-super-hands-component/systems/super-hands-system.js ***!
  \********************************************************************/
/***/ (() => {

/* global AFRAME */
AFRAME.registerSystem('super-hands', {
  init: function init() {
    this.superHands = [];
  },
  registerMe: function registerMe(comp) {
    // when second hand registers, store links
    if (this.superHands.length === 1) {
      this.superHands[0].otherSuperHand = comp;
      comp.otherSuperHand = this.superHands[0];
    }
    this.superHands.push(comp);
  },
  unregisterMe: function unregisterMe(comp) {
    var index = this.superHands.indexOf(comp);
    if (index !== -1) {
      this.superHands.splice(index, 1);
    }
    this.superHands.forEach(function (x) {
      if (x.otherSuperHand === comp) {
        x.otherSuperHand = null;
      }
    });
  }
});

/***/ }),

/***/ "./src/aframeContext.js":
/*!******************************!*\
  !*** ./src/aframeContext.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AframeContext)
/* harmony export */ });
/* harmony import */ var _assetManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assetManager */ "./src/assetManager.js");
/* harmony import */ var _components_renderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/renderer */ "./src/components/renderer.js");
/* harmony import */ var _components_renderer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_components_renderer__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var AframeContext = /*#__PURE__*/function () {
  function AframeContext(settings) {
    _classCallCheck(this, AframeContext);
    this.inVR = false;
    // settings pointer
    this.settings = settings;
    this.createScene();
    // create asset manager
    this.assetManager = new _assetManager__WEBPACK_IMPORTED_MODULE_0__["default"](this.scene);
  }
  return _createClass(AframeContext, [{
    key: "createScene",
    value: function createScene() {
      var _this = this;
      // find scene if exists else create scene
      var scene = document.getElementsByTagName("a-scene");
      if (scene.length > 0) this.scene = scene[0];else {
        this.scene = document.createElement("a-scene");
        document.body.appendChild(this.scene);
        this.newScene = true;
      }

      // add stats to scene if debug
      if (this.settings.debug) this.scene.setAttribute("stats", "");

      //custom renderer params like local clipping
      this.scene.setAttribute("vr-renderer", "");

      // check if in VR
      this.scene.addEventListener("enter-vr", function () {
        _this.inVR = true;
      }.bind(this));
      this.scene.addEventListener("exit-vr", function () {
        _this.inVR = false;
      }.bind(this));
    }
  }, {
    key: "createContainer",
    value: function createContainer(web2vr) {
      // conttainer for all aframe elements
      this.container = document.createElement("a-entity");
      this.container.classList.add("vr-container");
      this.container.classList.add(this.settings.interactiveTag);

      // position container
      var width = parseFloat(window.getComputedStyle(web2vr.container).width) * (1 / this.settings.scale);
      var x = this.settings.position.x;
      // if x=0 then then we want to be in center for testing and showcase
      if (x == 0) x = x - width / 2;
      this.container.object3D.position.set(x, this.settings.position.y, this.settings.position.z);
      // update rotation from aframe(1.0.4) because there is bug(rotation x will be wrong) if you update with three.js
      this.container.setAttribute("rotation", {
        x: this.settings.rotation.x,
        y: this.settings.rotation.y,
        z: this.settings.rotation.z
      });
      var parentElement = document.querySelector(this.settings.parentSelector);
      if (parentElement) parentElement.appendChild(this.container);else {
        this.container.setAttribute("vr-grab-rotate-static", "");
        this.container.setAttribute("sh-grabbable", "");
        this.container.setAttribute("stretchable", "");
        this.scene.appendChild(this.container);
      }

      // pointer for grabRotateStatic
      this.container.web2vr = web2vr;
    }
  }, {
    key: "createSky",
    value: function createSky() {
      // create sky if sky doesnt exist
      if (document.getElementsByTagName("a-sky").length == 0 && this.settings.skybox) {
        this.sky = document.createElement("a-sky");
        this.sky.setAttribute("color", "#a9f8fe");
        this.scene.appendChild(this.sky);
      }
    }
  }, {
    key: "createControllers",
    value: function createControllers() {
      var _this2 = this;
      // cursor only for dev testing on desktop
      if (!document.getElementById("mouseCursor")) {
        var cursor = document.createElement("a-entity");
        cursor.id = "mouseCursor";
        cursor.setAttribute("cursor", "rayOrigin", "mouse");
        cursor.setAttribute("raycaster", "objects: .".concat(this.settings.interactiveTag, ", .collidable"));
        this.scene.appendChild(cursor);
      }

      // super hands 6DOF
      if (this.settings.createControllers && !document.getElementById("leftHand")) {
        var raycaster = "objects: .".concat(this.settings.interactiveTag, ", .collidable; far: ").concat(this.settings.raycasterFar);
        var superhands = "colliderEvent: raycaster-intersection; colliderEventProperty: els; colliderEndEvent:raycaster-intersection-cleared; colliderEndEventProperty: clearedEls; grabStartButtons: gripdown; grabEndButtons: gripup; stretchStartButtons: gripdown; stretchEndButtons: gripup";
        var leftHand = document.createElement("a-entity");
        leftHand.id = "leftHand";
        leftHand.setAttribute("hand-controls", "hand:left; handModelStyle: highPoly; color: #ffcccc");
        leftHand.setAttribute("laser-controls", "");
        leftHand.setAttribute("raycaster", raycaster);
        leftHand.setAttribute("super-hands", superhands);
        var rightHand = document.createElement("a-entity");
        rightHand.id = "rightHand";
        rightHand.setAttribute("hand-controls", "hand:right; handModelStyle: highPoly; color: #ffcccc");
        rightHand.setAttribute("laser-controls", "");
        rightHand.setAttribute("raycaster", raycaster);
        rightHand.setAttribute("super-hands", superhands);
        this.scene.appendChild(leftHand);
        this.scene.appendChild(rightHand);
      }
      // keyboard
      this.keyboard = document.getElementById("vr-keyboard");
      if (!this.keyboard) {
        this.keyboard = document.createElement("a-entity");
        this.keyboard.id = "vr-keyboard";
        this.keyboard.setAttribute("a-keyboard", "");
        this.keyboard.setAttribute("sh-grabbable", "");
        this.scene.appendChild(this.keyboard);
        this.keyboard.object3D.visible = false;

        // current active input
        this.keyboard.activeInput = null;
        // event listener for the keyboard key press 
        document.addEventListener('a-keyboard-update', function (e) {
          if (_this2.keyboard.activeInput) {
            var code = parseInt(e.detail.code);
            var value = _this2.keyboard.activeInput.value;

            // backspace
            if (code == 8) value = value.slice(0, -1);
            // submit or cancel
            else if (code == 6 || code == 24) {
              _this2.keyboard.object3D.visible = false;
              _this2.keyboard.object3D.position.y = 10000; // because raycasting still collides with invisible objects
              _this2.keyboard.activeInput.element.active = false;
              _this2.keyboard.activeInput.element.update();
              _this2.keyboard.activeInput = null;
              return;
            }
            // ignore arrow keys
            else if (![37, 38, 39, 40].includes(code)) value += e.detail.value;
            _this2.keyboard.activeInput.value = value;
            _this2.keyboard.activeInput.element.update();
          }
        });
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/assetManager.js":
/*!*****************************!*\
  !*** ./src/assetManager.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AssetManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var AssetManager = /*#__PURE__*/function () {
  function AssetManager(scene) {
    _classCallCheck(this, AssetManager);
    var assets = document.getElementsByTagName("a-assets")[0];
    if (assets) this.assets = assets;else {
      this.assets = document.createElement("a-assets");
      scene.appendChild(this.assets);
    }
  }

  // update current-id attribute
  return _createClass(AssetManager, [{
    key: "updateCurrentAssetId",
    value: function updateCurrentAssetId() {
      var currentAssetId = parseInt(this.assets.getAttribute("current-id"));
      if (!this.assets.getAttribute("current-id")) {
        this.assets.setAttribute("current-id", 0);
        currentAssetId = 0;
      }
      this.assets.setAttribute("current-id", currentAssetId + 1);
    }
    // update current-id attribute and return it.
    // used for elements (ex. video) outside a-assets tag
  }, {
    key: "updateCurrentAssetIdReturn",
    value: function updateCurrentAssetIdReturn() {
      this.updateCurrentAssetId();
      return "asset-" + this.assets.getAttribute("current-id");
    }

    // find asset if exists if not create and return it
  }, {
    key: "getAsset",
    value: function getAsset(path, type) {
      var assets = this.assets.getChildren();
      var _iterator = _createForOfIteratorHelper(assets),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var asset = _step.value;
          if (asset.getAttribute("src") === path) return asset.getAttribute("id");
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return this.createAsset(path, type);
    }
  }, {
    key: "createAsset",
    value: function createAsset(path, type) {
      var asset = document.createElement(type);
      asset.setAttribute("src", path);
      this.updateCurrentAssetId();
      var id = "asset-" + this.assets.getAttribute("current-id");
      asset.setAttribute("id", id);
      // have to manualy add crossorigin for all external assets to load
      asset.setAttribute("crossorigin", "Anonymous");
      this.assets.appendChild(asset);
      return id;
    }
  }, {
    key: "removeAsset",
    value: function removeAsset(id) {
      this.assets.querySelector("#" + id).remove();
    }
  }]);
}();


/***/ }),

/***/ "./src/components/animate.js":
/*!***********************************!*\
  !*** ./src/components/animate.js ***!
  \***********************************/
/***/ (() => {

AFRAME.registerComponent("vr-animate", {
  init: function init() {
    var _this$el$element, _this$el$element2, _this$el$element3, _this$el$element4;
    this.running = false;
    // listenes for css animation and translation
    (_this$el$element = this.el.element) === null || _this$el$element === void 0 || _this$el$element.domElement.addEventListener("animationstart", this.startAnimation.bind(this));
    (_this$el$element2 = this.el.element) === null || _this$el$element2 === void 0 || _this$el$element2.domElement.addEventListener("animationend", this.stopAnimation.bind(this));
    (_this$el$element3 = this.el.element) === null || _this$el$element3 === void 0 || _this$el$element3.domElement.addEventListener("transitionstart", this.startAnimation.bind(this));
    (_this$el$element4 = this.el.element) === null || _this$el$element4 === void 0 || _this$el$element4.domElement.addEventListener("transitionend", this.stopAnimation.bind(this));
  },
  tick: function tick() {
    var _this$el$element5;
    if (this.running) (_this$el$element5 = this.el.element) === null || _this$el$element5 === void 0 || _this$el$element5.web2vr.update();
  },
  startAnimation: function startAnimation() {
    this.running = true;
  },
  stopAnimation: function stopAnimation() {
    var _this$el$element6;
    this.running = false;
    // one final update
    (_this$el$element6 = this.el.element) === null || _this$el$element6 === void 0 || _this$el$element6.web2vr.update();
  }
});

/***/ }),

/***/ "./src/components/border.js":
/*!**********************************!*\
  !*** ./src/components/border.js ***!
  \**********************************/
/***/ (() => {

AFRAME.registerComponent("vr-border", {
  schema: {
    width: {
      type: "number"
    },
    color: {
      type: "string"
    }
  },
  init: function init() {
    this.running = true;
    var plane = this.el.object3D.children[0];
    var edges = new THREE.EdgesGeometry(plane.geometry);
    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: this.data.width
    }));
    this.borderObject = line;
    this.el.element.web2vr.aframe.container.object3D.add(this.borderObject);

    //maybe clippingContext inside tick?
    if (this.el.element.clippingContext) {
      line.material.clippingPlanes = this.el.element.clippingContext.planes;
      line.material.needsUpdate = true;
    }
  },
  update: function update() {
    // waiting for three.js(WebGL) to add lineWidth support for Windows(DirectX) browsers for now linewidth is 1 no matter what you set it.
    // lineWidth works for other OS.
    var borderWidth = this.data.width;

    // custom element border width
    if (this.el.element.borderWidth) this.borderObject.material.linewidth = this.el.element.borderWidth;else this.borderObject.material.linewidth = borderWidth;

    // custom element border color
    if (this.el.element.borderColor) this.borderObject.material.color = this.el.element.borderColor;else this.borderObject.material.color = new THREE.Color(this.data.color);
  },
  updateBorder: function updateBorder() {
    var _this$el$element;
    if ((_this$el$element = this.el.element) !== null && _this$el$element !== void 0 && _this$el$element.visible) {
      this.running = true;
      this.borderObject.material.visible = true;
    } else this.borderObject.material.visible = false;
  },
  tick: function tick() {
    if (this.running) {
      var scale = this.el.object3D.scale;
      var plane = this.el.object3D.children[0].geometry.clone();
      plane.scale(scale.x, scale.y, scale.z);
      var edges = new THREE.EdgesGeometry(plane);
      var position = this.el.object3D.position;
      this.borderObject.geometry = edges;
      this.borderObject.position.set(position.x, position.y, position.z + this.el.element.web2vr.settings.layerStep * 2);
      this.running = false;
    }
  },
  remove: function remove() {
    this.el.element.web2vr.aframe.container.object3D.remove(this.borderObject);
  }
});

/***/ }),

/***/ "./src/components/grabRotateStatic.js":
/*!********************************************!*\
  !*** ./src/components/grabRotateStatic.js ***!
  \********************************************/
/***/ (() => {

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
AFRAME.registerComponent("vr-grab-rotate-static", {
  tick: function tick() {
    if (this.el.components["sh-grabbable"].grabbed) {
      // update clipping when moving
      if (this.el.web2vr.scroll.hasScroll) {
        var _iterator = _createForOfIteratorHelper(this.el.web2vr.elements),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var element = _step.value;
            element.updateClipping();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      var obj = this.el.object3D;
      var hand = this.el.components["sh-grabbable"].grabbers[0].object3D;
      obj.rotation.y = Math.atan2(hand.position.x - (obj.position.x + this.el.children[0].getAttribute("width") / 2), hand.position.z - obj.position.z);

      //obj.rotation.x = hand.rotation.x;
      //obj.rotation.y = hand.rotation.y;
      //obj.rotation.z = hand.rotation.z;
    }
  }
});

/***/ }),

/***/ "./src/components/renderer.js":
/*!************************************!*\
  !*** ./src/components/renderer.js ***!
  \************************************/
/***/ (() => {

AFRAME.registerComponent("vr-renderer", {
  init: function init() {
    this.el.sceneEl.renderer.localClippingEnabled = true;
  }
});

/***/ }),

/***/ "./src/components/scrollbar.js":
/*!*************************************!*\
  !*** ./src/components/scrollbar.js ***!
  \*************************************/
/***/ (() => {

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
AFRAME.registerComponent("vr-scrollbar", {
  init: function init() {
    this.el.addEventListener("click", function (evt) {
      var scrollHeight = parseFloat(this.el.web2vr.aframe.container.firstElementChild.element.style.height) - this.el.web2vr.settings.scrollWindowHeight;
      if (this.el.web2vr.scroll.scrollContainer == this.el.web2vr.container) scrollHeight = this.el.web2vr.scroll.scrollContainer.scrollHeight - this.el.web2vr.scroll.scrollContainer.clientHeight;
      var scrollY = (1 - evt.detail.intersection.uv.y) * scrollHeight / this.el.web2vr.settings.scale;
      var elements = _toConsumableArray(this.el.web2vr.elements);
      // remove first element that is the backgorund of container
      elements.shift();
      this.el.pointer.object3D.position.setY(this.pointEndY + evt.detail.intersection.uv.y * (this.pointStartY - this.pointEndY));
      var _iterator = _createForOfIteratorHelper(elements),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var element = _step.value;
          element.position.scrollY = scrollY;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      this.el.web2vr.update();
    }.bind(this));
  },
  play: function play() {
    var width = parseFloat(this.el.web2vr.aframe.container.firstElementChild.getAttribute("width"));
    var height = parseFloat(this.el.web2vr.aframe.container.firstElementChild.getAttribute("height"));

    // init plane size
    this.el.setAttribute("width", width / 20);
    this.el.setAttribute("height", height);

    //init scrollbar position
    this.el.scrollbar.object3D.position.setX(width + parseFloat(this.el.getAttribute("width") / 2));
    this.el.scrollbar.object3D.position.setY(0 - height / 2); //1.96
    this.el.scrollbar.object3D.position.setZ(-(this.el.web2vr.settings.layerStep * 4));

    // init pointer position and size
    this.el.pointer.setAttribute("height", width / 20);
    this.el.pointer.setAttribute("width", width / 20);
    this.pointStartY = height / 2 - parseFloat(this.el.pointer.getAttribute("height")) / 2;
    this.pointEndY = this.pointStartY - height + parseFloat(this.el.pointer.getAttribute("height"));
    this.el.pointer.object3D.position.setY(this.pointStartY);
    this.el.pointer.object3D.position.setZ(this.el.web2vr.settings.layerStep * 2);
  }
});

/***/ }),

/***/ "./src/elements/buttonElement.js":
/*!***************************************!*\
  !*** ./src/elements/buttonElement.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ButtomElement)
/* harmony export */ });
/* harmony import */ var _textElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./textElement */ "./src/elements/textElement.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ButtomElement = /*#__PURE__*/function (_TextElement) {
  function ButtomElement(web2vr, domElement, layer) {
    var _this;
    _classCallCheck(this, ButtomElement);
    _this = _callSuper(this, ButtomElement, [web2vr, domElement, layer]);
    _this.borderColor = new THREE.Color(0x000000);
    _this.borderWidth = 1;
    return _this;
  }
  _inherits(ButtomElement, _TextElement);
  return _createClass(ButtomElement, [{
    key: "updateTextPadding",
    value: function updateTextPadding() {
      // ignore padding for buttons
    }
  }, {
    key: "updateText",
    value: function updateText() {
      if (this.domElement.tagName == "INPUT") this.textValue = this.domElement.value.replace(/\s{2,}/g, ' ');
    }
  }]);
}(_textElement__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/elements/canvasElement.js":
/*!***************************************!*\
  !*** ./src/elements/canvasElement.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CanvasElement)
/* harmony export */ });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/elements/element.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CanvasElement = /*#__PURE__*/function (_Element) {
  function CanvasElement(web2vr, domElement, layer) {
    var _this;
    _classCallCheck(this, CanvasElement);
    _this = _callSuper(this, CanvasElement, [web2vr, domElement, layer]);
    _this.imageId = null;
    _this.entity = document.createElement("a-image");
    return _this;
  }
  _inherits(CanvasElement, _Element);
  return _createClass(CanvasElement, [{
    key: "updateImage",
    value: function updateImage(src) {
      var assetId = this.web2vr.aframe.assetManager.getAsset(src, "img");

      // remove old image if there is new image
      if (this.imageId && this.imageId != assetId) this.web2vr.aframe.assetManager.removeAsset(this.imageId);
      this.entity.setAttribute("id", "IMAGE_" + assetId);
      this.entity.setAttribute("src", "#" + assetId);
      this.imageId = assetId;
    }
  }, {
    key: "specificUpdate",
    value: function specificUpdate() {
      this.updateImage(this.domElement.toDataURL());
    }
  }]);
}(_element__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/elements/checkboxElement.js":
/*!*****************************************!*\
  !*** ./src/elements/checkboxElement.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CheckBoxElement)
/* harmony export */ });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/elements/element.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CheckBoxElement = /*#__PURE__*/function (_Element) {
  function CheckBoxElement(web2vr, domElement, layer) {
    var _this;
    _classCallCheck(this, CheckBoxElement);
    _this = _callSuper(this, CheckBoxElement, [web2vr, domElement, layer]);
    _this.borderColor = new THREE.Color(0x000000);
    _this.borderWidth = 1;
    _this.entity = document.createElement("a-plane");
    _this.domElement.addEventListener("click", function () {
      _this.specificUpdate();
    }.bind(_this));
    return _this;
  }
  _inherits(CheckBoxElement, _Element);
  return _createClass(CheckBoxElement, [{
    key: "specificUpdate",
    value: function specificUpdate() {
      if (this.domElement.checked) this.entity.setAttribute("color", "#0075FF");else this.entity.setAttribute("color", "#FFFFFF");
    }
  }]);
}(_element__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/elements/containerElement.js":
/*!******************************************!*\
  !*** ./src/elements/containerElement.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContainerElement)
/* harmony export */ });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/elements/element.js");
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }


var ContainerElement = /*#__PURE__*/function (_Element) {
  function ContainerElement(web2vr, domElement, layer) {
    var _this;
    var textOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    _classCallCheck(this, ContainerElement);
    _this = _callSuper(this, ContainerElement, [web2vr, domElement, layer]);
    _this.textOnly = textOnly;
    _this.entity = document.createElement("a-plane");

    // if hyperlink trigger a click event
    if (_this.domElement.tagName == "A") {
      _this.entity.addEventListener("click", function () {
        console.log("Link clicked!", _this.domElement.click());
      });
    }
    if (!_this.textOnly) {
      // show back plane for the main container
      if (_this.domElement == _this.web2vr.container) _this.entity.setAttribute("material", "side", "double");

      // only needed for experimental background
      _this.expImageId = null;
      _this.oldBackgroundImage = null;
      _this.oldDomPosition = null;
    }
    return _this;
  }
  _inherits(ContainerElement, _Element);
  return _createClass(ContainerElement, [{
    key: "specificUpdate",
    value: function specificUpdate() {
      var _this2 = this;
      if (!this.textOnly) {
        var backgroundColor = this.style.backgroundColor;
        var backgroundImage = this.style.backgroundImage; // to get 1:1 as html have to use background-size: cover; or use experimental

        if (backgroundImage != "none") {
          // cannot use animations that require update to be called every frame. html2canvas is very performance heavy.
          if (this.web2vr.settings.experimental) {
            if (backgroundImage != this.oldBackgroundImage || this.oldDomPosition && !this.position.equalsDOMPosition(this.oldDomPosition)) {
              var id = this.domElement.id;
              var customId = false;
              if (!id) {
                customId = true;
                id = "html2canvas-" + this.web2vr.html2canvasIDcounter++;
                this.domElement.id = id;
              }
              html2canvas(this.domElement, {
                onclone: function onclone(clone) {
                  var style = document.createElement('style');
                  clone.head.appendChild(style);
                  // ignoring opacity because we use opacity from aframe
                  style.sheet.insertRule("\n                    #".concat(id, " {\n                        opacity: 1;\n                    }"));
                  // hide the text
                  style.sheet.insertRule("\n                    #".concat(id, " {\n                        color: transparent;\n                    }"));
                  // hide the children elements
                  style.sheet.insertRule("\n                    #".concat(id, " > * {\n                        display:none\n                    }"));
                  // vr-span has to be block so it can render properly
                  style.sheet.insertRule("\n                    #".concat(id, " > .vr-span {\n                        display:block\n                    }"));
                  if (customId) _this2.domElement.removeAttribute("id");
                }
              }).then(function (canvas) {
                if (_this2.expImageId) _this2.web2vr.aframe.assetManager.removeAsset(_this2.expImageId);
                _this2.expImageId = _this2.web2vr.aframe.assetManager.getAsset(canvas.toDataURL(), "img");
                _this2.entity.setAttribute("material", "src: #" + _this2.expImageId);
              });
              this.oldBackgroundImage = backgroundImage;
            }
          } else if (_utils_helper__WEBPACK_IMPORTED_MODULE_1__["default"].isUrl(backgroundImage)) {
            // remove url("")
            backgroundImage = backgroundImage.substring(backgroundImage.lastIndexOf('(\"') + 2, backgroundImage.lastIndexOf('\")'));
            this.entity.setAttribute("material", "src: #" + this.web2vr.aframe.assetManager.getAsset(backgroundImage, "img"));
            // transparent images support
            this.entity.setAttribute("material", "transparent", true);
          }
        } else {
          // if there is no backgroundColor dont renders
          if (backgroundColor == "rgba(0, 0, 0, 0)") {
            this.entity.setAttribute("material", "visible", false);
          } else {
            this.entity.setAttribute("material", "visible", true);
            this.entity.setAttribute("color", backgroundColor);
            this.updateOpacity();
          }
        }
        this.oldDomPosition = this.position.domPosition;
      }
    }
  }, {
    key: "updateOpacity",
    value: function updateOpacity() {
      var alpha = parseFloat(this.style.backgroundColor.split(',')[3]);
      // calculate final alpha channel result
      if (alpha) {
        var a = alpha;
        var b = this.style.opacity;
        if (a < b) {
          b = alpha;
          a = this.style.opacity;
        }
        this.entity.setAttribute("opacity", a - (a - b));
      }
    }
  }]);
}(_element__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/elements/element.js":
/*!*********************************!*\
  !*** ./src/elements/element.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Element)
/* harmony export */ });
/* harmony import */ var _utils_position__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/position */ "./src/utils/position.js");
/* harmony import */ var _utils_mouseEventHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/mouseEventHandler */ "./src/utils/mouseEventHandler.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var Element = /*#__PURE__*/function () {
  function Element(web2vr, domElement, layer) {
    _classCallCheck(this, Element);
    this.web2vr = web2vr;
    this.domElement = domElement;
    this.layer = layer;
    this.domElement.element = this; // so we can do domeElement.parentNode.element
    this.childElements = new Set();
    this.entity = null; // aframe entity this null becasue Element class is abstract
    this.visible = true;
    if (this.domElement.classList.contains("vr-span")) this.paddingToMargin();
    this.position = new _utils_position__WEBPACK_IMPORTED_MODULE_0__["default"](this.domElement.getBoundingClientRect(), layer * this.web2vr.settings.layerStep, web2vr.settings.scale);
    this.style = window.getComputedStyle(this.domElement);
    this.parentTransform = "none";
    this.needsStartingTransformSize = true;
  }

  // call after entity is created in inheriting class
  return _createClass(Element, [{
    key: "initEventHandlers",
    value: function initEventHandlers() {
      var _this = this;
      this.initHover();

      // setting up MouseEventHandler
      this.mouseEventHandle = new _utils_mouseEventHandler__WEBPACK_IMPORTED_MODULE_1__["default"](this);

      // dynamic listeners
      this.domElement.addEventListener("eventListenerAdded", function () {
        return _this.mouseEventHandle.resync();
      });
      this.domElement.addEventListener("eventListenerRemoved", function () {
        return _this.mouseEventHandle.resync();
      });
    }

    // add animation compoment if dom element has animation
  }, {
    key: "checkAnimation",
    value: function checkAnimation() {
      if (parseFloat(this.style.animationDuration) || parseFloat(this.style.transitionDuration)) this.entity.setAttribute("vr-animate", "");else this.entity.removeAttribute("vr-animate");
    }
  }, {
    key: "initHover",
    value: function initHover() {
      var _this2 = this;
      // find what has hover
      var tag = null;
      if (this.web2vr.hoverSelectors.has(this.domElement.tagName.toLowerCase())) tag = this.domElement.tagName.toLowerCase();
      var classes = [];
      var _iterator = _createForOfIteratorHelper(this.domElement.classList),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var cls = _step.value;
          if (this.web2vr.hoverSelectors.has("." + cls)) classes.push(cls);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var id = null;
      if (this.web2vr.hoverSelectors.has("#" + this.domElement.id)) id = this.domElement.id;

      // add mouseenter and mouseleave if element has hover.
      if (tag || classes.length > 0 || id) {
        this.entity.addEventListener("mouseenter", function () {
          if (tag) _this2.domElement.classList.add(tag + "hover");
          if (classes.length > 0) {
            var _iterator2 = _createForOfIteratorHelper(classes),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var cls = _step2.value;
                _this2.domElement.classList.add(cls + "hover");
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
          if (id) _this2.domElement.classList.add(id + "hover");
          // this is only for hover transform. Update all elements when transform gets added
          if (_this2.style.transform != "none") {
            _this2.web2vr.update();
            _this2.hoverTransform = true;
          }
        });
        this.entity.addEventListener("mouseleave", function () {
          if (tag) _this2.domElement.classList.remove(tag + "hover");
          if (classes.length > 0) {
            var _iterator3 = _createForOfIteratorHelper(classes),
              _step3;
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var cls = _step3.value;
                _this2.domElement.classList.remove(cls + "hover");
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }
          if (id) _this2.domElement.classList.remove(id + "hover");
          if (_this2.hoverTransform) {
            _this2.position.depth = _this2.position.startDepth;
            var _iterator4 = _createForOfIteratorHelper(_this2.domElement.querySelectorAll('*')),
              _step4;
            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var element = _step4.value;
                if (element.element) {
                  element.element.parentTransform = "none";
                  element.element.position.depth = element.element.position.startDepth;
                }
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          }
        });
      }
    }

    // getBoundingClientRect works great with margin while with padding it has problems with paddingRight that needs to be manualy calculated and set
    // because dealing with paddingRight is problematic we can make the padding be margin for the textNode(vr-span)
  }, {
    key: "paddingToMargin",
    value: function paddingToMargin() {
      // only if element has text
      if (this.domElement.textContent.trim()) {
        //const left = this.domElement.parentElement.element.style.paddingLeft;
        var right = this.domElement.parentElement.element.style.paddingRight;
        //const top = this.domElement.parentElement.element.style.paddingTop;
        //const bottom = this.domElement.parentElement.element.style.paddingBottom;

        /*if (parseFloat(left)) {
            this.domElement.style.marginLeft = left;
            this.domElement.parentElement.style.paddingLeft = "0px";
        }*/
        if (parseFloat(right)) {
          this.domElement.style.marginRight = right;
          this.domElement.parentElement.style.paddingRight = "0px";
        }
        /*if (parseFloat(top)) {
            this.domElement.style.marginTop = top;
            //this.domElement.parentElement.style.paddingTop = "0px";
        }
        if (parseFloat(bottom)) {
            this.domElement.style.marginBottom = bottom;
            //this.domElement.parentElement.style.paddingBottom = "0px";
        }*/
      }
    }
  }, {
    key: "init",
    value: function init() {
      // reference of the element for aframe compoment
      this.entity.element = this;

      // dont need light to affect material
      this.entity.setAttribute("material", "shader", "flat");

      //init sizes at start
      this.entity.setAttribute("width", this.position.width);
      this.entity.setAttribute("height", this.position.height);
      this.initEventHandlers();
      this.setupClipping();
    }
  }, {
    key: "update",
    value: function update() {
      var _this$web2vr$scroll, _this$web2vr$scroll2;
      var clientRect = this.domElement.getBoundingClientRect();

      // its not on the screen
      if (clientRect.width == 0 || clientRect.height == 0) {
        this.entity.object3D.visible = false;
        if (!this.domElement.classList.contains("vr-span")) this.entity.classList.remove(this.web2vr.settings.interactiveTag);
        this.position.aframePosition.y = 1000; // for some reason raycast still hits so have to move position
        return;
      }

      // for future move this in TextElement class
      if (this.domElement.classList.contains("vr-span")) {
        // dont need interaction with the text when we always have the background as interaction
        this.entity.classList.remove(this.web2vr.settings.interactiveTag);
        // so all inline text width is good, dont do this if its text inside button
        if (this.domElement.parentElement.tagName != "BUTTON") {
          clientRect.width += 8;
          clientRect.x -= 2;
        }
      }

      // set fixed container height if its using scrollBody, best is to move this code outside update loop for future
      if ((_this$web2vr$scroll = this.web2vr.scroll) !== null && _this$web2vr$scroll !== void 0 && _this$web2vr$scroll.hasScroll && this.domElement == this.web2vr.container && (_this$web2vr$scroll2 = this.web2vr.scroll) !== null && _this$web2vr$scroll2 !== void 0 && _this$web2vr$scroll2.scrollBody) clientRect.height = this.web2vr.settings.scrollWindowHeight;
      this.position.updatePosition(clientRect);
      this.checkVisible();
      if (this.visible) {
        this.style = window.getComputedStyle(this.domElement);

        // its on visible screen but its hidden by style
        if (this.style.visibility === "hidden" || this.style.display === "none") {
          this.entity.object3D.visible = false;
          if (!this.domElement.classList.contains("vr-span")) this.entity.classList.remove(this.web2vr.settings.interactiveTag);
          this.position.aframePosition.y = 1000; // for some reason raycast still hits so have to move position
          // update border so we can remove it because element is hidden
          this.updateBorder();
          return;
        } else {
          this.entity.object3D.visible = true;
          // for input text because it has custom event for entity it cannot detect with this.mouseEventHandle.listeningForMouseEvents
          // we have to check tagName and type to see if its input text, for future make this work with mouseEventHandle
          // also add interactiveTag if its main container
          if (!this.domElement.classList.contains("vr-span") && (this.mouseEventHandle.listeningForMouseEvents || this.domElement.tagName == "INPUT" && this.domElement.type == "text") || this.domElement == this.web2vr.container) this.entity.classList.add(this.web2vr.settings.interactiveTag);
        }

        // if there is transform then width and height will be set with the transform matrix scale
        // using needsStartingTransformSize so width and height are never 0 when doing transform scale
        if (this.style.transform == "none" || this.needsStartingTransformSize) {
          this.entity.setAttribute("width", this.position.width);
          this.entity.setAttribute("height", this.position.height);
        }
        this.checkAnimation();
        var opacity = this.style.opacity;
        this.entity.setAttribute("opacity", opacity);
        this.specificUpdate();
        this.updateTransform();
        this.updateClipping();
      }
      this.updateBorder();
    }
  }, {
    key: "updateTransform",
    value: function updateTransform() {
      var transform = this.style.transform;
      if (transform == "none") transform = this.parentTransform;else {
        // give transform to all descendents
        var _iterator5 = _createForOfIteratorHelper(this.domElement.querySelectorAll('*')),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var element = _step5.value;
            if (element.element) element.element.parentTransform = transform;
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
      if (transform != "none") {
        this.needsStartingTransformSize = false;
        var matrixType = transform.split('(')[0];
        // get matrix values in float
        var values = transform.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');
        values = values.map(function (v) {
          return parseFloat(v);
        });
        var matrix = null;
        if (matrixType == "matrix") {
          // transform to matrix4x4 and invert skewX to match three.js
          matrix = new THREE.Matrix4().fromArray([values[0], values[1], 0, 0, -values[2], values[3], 0, 0, 0, 0, 1, 0, values[4], values[5], 0, 1]);
        } else if (matrixType == "matrix3d") {
          // invert skewX and skewZ? to match three.js
          values[4] *= -1;
          values[9] *= -1;
          matrix = new THREE.Matrix4().fromArray(values);
        }
        var position = new THREE.Vector3();
        var quaternion = new THREE.Quaternion();
        var scale = new THREE.Vector3();
        matrix.decompose(position, quaternion, scale);

        // position
        this.position.domPosition.x += position.x;
        this.position.domPosition.y += position.y;
        if (position.z != 0) this.position.depth = position.z * this.position.scalingFactor + this.position.startDepth;

        // rotation
        this.entity.object3D.rotation.setFromRotationMatrix(matrix);

        // calcualte scale and set it to entity
        if (this.parentTransform == "none") {
          var elements = matrix.elements;
          var scaleX = Math.sqrt(elements[0] * elements[0] + elements[1] * elements[1]);
          var scaleY = Math.sqrt(elements[5] * elements[5] + elements[4] * elements[4]);
          // for radio scale is 2 times smaller because its circle, for some rason checkbox scale needs to be in half else its too big
          if (this.domElement.tagName == "INPUT" && (this.domElement.type == "radio" || this.domElement.type == "checkbox")) this.entity.object3D.scale.set(scaleX / 2, scaleY / 2, 1);else this.entity.object3D.scale.set(scaleX, scaleY, 1);
        }
      }
      this.entity.object3D.position.set(this.position.x, this.position.y, this.position.z);
    }

    // abstract method
  }, {
    key: "specificUpdate",
    value: function specificUpdate() {}
  }, {
    key: "updateBorder",
    value: function updateBorder() {
      if (this.web2vr.settings.border) {
        // using borderTopWidth and borderTopColor because borderWidth and borderColor doesnt work in firefox
        var borderWidth = parseFloat(this.style.borderTopWidth);
        if ((borderWidth || this.borderWidth) && this.entity.object3D.visible) {
          this.entity.setAttribute("vr-border", "width:".concat(borderWidth, "; color:").concat(this.style.borderTopColor, ";"));
          this.entity.components["vr-border"].updateBorder();
        } else if (this.entity.components["vr-border"]) this.entity.removeAttribute("vr-border");
      }
    }
  }, {
    key: "rotateNormal",
    value: function rotateNormal(normal) {
      var normalMatrix = new THREE.Matrix3().getNormalMatrix(this.web2vr.aframe.container.object3D.matrixWorld);
      var output = normal.clone().applyMatrix3(normalMatrix).normalize();
      return output;
    }
  }, {
    key: "getClippingContext",
    value: function getClippingContext() {
      var output = null;
      if (this.domElement.parentNode && this.domElement.parentNode.element && this.domElement.parentNode.element.clippingContext) output = this.domElement.parentNode.element.clippingContext;else {
        var _this$web2vr$scroll3;
        if (this.style.overflow && this.style.overflow == "hidden" || (_this$web2vr$scroll3 = this.web2vr.scroll) !== null && _this$web2vr$scroll3 !== void 0 && _this$web2vr$scroll3.hasScroll && this.domElement == this.web2vr.container || this.web2vr.settings.forceClipping && this.domElement == this.web2vr.container) {
          // ignore if its svg
          if (this.domElement.tagName != "svg") {
            var clippingContext = {};
            clippingContext.authority = this;
            clippingContext.bottom = new THREE.Plane(this.rotateNormal(new THREE.Vector3(0, 1, 0))); // normal up
            clippingContext.top = new THREE.Plane(this.rotateNormal(new THREE.Vector3(0, -1, 0))); // normal down
            clippingContext.left = new THREE.Plane(this.rotateNormal(new THREE.Vector3(1, 0, 0))); // normal right
            clippingContext.right = new THREE.Plane(this.rotateNormal(new THREE.Vector3(-1, 0, 0))); // normal left

            clippingContext.planes = [clippingContext.bottom, clippingContext.top, clippingContext.left, clippingContext.right];
            output = clippingContext;
          }
        }
      }
      return output;
    }
  }, {
    key: "setupClipping",
    value: function setupClipping() {
      var _this3 = this;
      var clippingContext = this.getClippingContext();
      if (clippingContext) {
        this.clippingContext = clippingContext;

        // we are sure the renderer is loaded
        var object3D = this.entity.object3D;
        if (!object3D || !object3D.children || !object3D.children.length > 0 || !object3D.children[0].material) {
          return;
        }
        var material = object3D.children[0].material;
        material.clippingPlanes = clippingContext.planes;

        //this.updateClipping();
        setTimeout(function () {
          _this3.updateClipping();
        }, 200); // if it doesnt work use this
        // return new Promise();
      }
    }
  }, {
    key: "updateClipping",
    value: function updateClipping() {
      // only element with authority can change the clipping planes position
      if (!this.clippingContext || this.clippingContext.authority != this) return;
      var position = this.entity.object3D.position;
      var bottomLocal = position.clone().add(new THREE.Vector3(0, -1, 0).multiplyScalar(this.position.height / 2));
      var topLocal = position.clone().add(new THREE.Vector3(0, 1, 0).multiplyScalar(this.position.height / 2));
      var leftLocal = position.clone().add(new THREE.Vector3(-1, 0, 0).multiplyScalar(this.position.width / 2));
      var rightLocal = position.clone().add(new THREE.Vector3(1, 0, 0).multiplyScalar(this.position.width / 2));
      var bottomGlobal = this.web2vr.aframe.container.object3D.localToWorld(bottomLocal.clone());
      var topGlobal = this.web2vr.aframe.container.object3D.localToWorld(topLocal.clone());
      var leftGlobal = this.web2vr.aframe.container.object3D.localToWorld(leftLocal.clone());
      var rightGlobal = this.web2vr.aframe.container.object3D.localToWorld(rightLocal.clone());
      this.clippingContext.bottom.setFromNormalAndCoplanarPoint(this.rotateNormal(new THREE.Vector3(0, 1, 0)), bottomGlobal).normalize();
      this.clippingContext.top.setFromNormalAndCoplanarPoint(this.rotateNormal(new THREE.Vector3(0, -1, 0)), topGlobal).normalize();
      this.clippingContext.left.setFromNormalAndCoplanarPoint(this.rotateNormal(new THREE.Vector3(1, 0, 0)), leftGlobal).normalize();
      this.clippingContext.right.setFromNormalAndCoplanarPoint(this.rotateNormal(new THREE.Vector3(-1, 0, 0)), rightGlobal).normalize();
      if (this.web2vr.settings.showClipping) {
        if (!this.clippingPlaneHelpers) {
          this.clippingPlaneHelpers = [];
          var _iterator6 = _createForOfIteratorHelper(this.clippingContext.planes),
            _step6;
          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var plane = _step6.value;
              var material = new THREE.MeshBasicMaterial({
                color: 0x00e33d,
                side: THREE.DoubleSide
              });
              var geometry = new THREE.PlaneGeometry(200 * this.position.scalingFactor, 200 * this.position.scalingFactor); // no need same width and height as container because this is only for debugging
              var mesh = new THREE.Mesh(geometry, material);
              mesh.debugPlane = plane;
              this.clippingPlaneHelpers.push(mesh);
              var axisHelper = new THREE.AxesHelper(5);
              mesh.add(axisHelper);
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
          var _iterator7 = _createForOfIteratorHelper(this.clippingPlaneHelpers),
            _step7;
          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var helper = _step7.value;
              this.web2vr.aframe.scene.object3D.add(helper);
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }
        }
        var _iterator8 = _createForOfIteratorHelper(this.clippingPlaneHelpers),
          _step8;
        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var _mesh = _step8.value;
            _mesh.visible = true;
            var worldPos = new THREE.Vector3();
            this.entity.object3D.getWorldPosition(worldPos);
            var point = new THREE.Vector3();
            _mesh.debugPlane.projectPoint(worldPos, point);
            _mesh.position.set(point.x, point.y, point.z);

            // clipping plane normals are inverted, we multiply by -1
            var focalPoint = point.clone().add(_mesh.debugPlane.normal.clone().multiplyScalar(-1));
            _mesh.lookAt(focalPoint);
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      } else {
        if (this.clippingPlaneHelpers) {
          var _iterator9 = _createForOfIteratorHelper(this.clippingPlaneHelpers),
            _step9;
          try {
            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
              var _mesh2 = _step9.value;
              _mesh2.visible = false;
            }
          } catch (err) {
            _iterator9.e(err);
          } finally {
            _iterator9.f();
          }
        }
      }
    }
  }, {
    key: "checkVisible",
    value: function checkVisible() {
      if (this.clippingContext) {
        var container = this.clippingContext.authority;
        if (this.position.bottom.y > container.position.top.y || this.position.top.y < container.position.bottom.y) {
          this.visible = false;
          this.entity.object3D.visible = false;
          // remove interactive tag
          if (!this.domElement.classList.contains("vr-span")) this.entity.classList.remove(this.web2vr.settings.interactiveTag);
        } else {
          this.visible = true;
          this.entity.object3D.visible = true;
          // interactive tag so we can do raycasting if it has mouse events or its container background
          if (!this.domElement.classList.contains("vr-span") && this.mouseEventHandle.listeningForMouseEvents || this.domElement == this.web2vr.container) this.entity.classList.add(this.web2vr.settings.interactiveTag);
        }
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/elements/imageElement.js":
/*!**************************************!*\
  !*** ./src/elements/imageElement.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ImageElement)
/* harmony export */ });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/elements/element.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ImageElement = /*#__PURE__*/function (_Element) {
  function ImageElement(web2vr, domElement, layer) {
    var _this;
    _classCallCheck(this, ImageElement);
    _this = _callSuper(this, ImageElement, [web2vr, domElement, layer]);
    _this.currentSrc = null;
    _this.changed = false;
    _this.entity = document.createElement("a-image");
    _this.entity.setAttribute("material", "side", "front");
    // know when image is loaded
    _this.loaded = false;
    _this.domElement.addEventListener("load", function () {
      _this.loaded = true;
      // if image changed update all after image loaded
      if (_this.changed) {
        _this.changed = false;
        _this.web2vr.update();
      }
    });
    return _this;
  }
  _inherits(ImageElement, _Element);
  return _createClass(ImageElement, [{
    key: "updateImage",
    value: function updateImage(src) {
      var assetID = this.web2vr.aframe.assetManager.getAsset(src, "img");
      this.entity.setAttribute("id", "IMAGE_" + assetID);
      var isGif = /\.(gif)$/i;
      if (isGif.test(src)) {
        this.entity.setAttribute("material", "shader", "gif");
        this.entity.setAttribute("material", "src", "#" + assetID);
      } else {
        this.entity.setAttribute("material", "shader", "flat");
        this.entity.setAttribute("src", "#" + assetID);
      }
    }
  }, {
    key: "specificUpdate",
    value: function specificUpdate() {
      var src = this.domElement.getAttribute("src");
      if (src != this.currentSrc) {
        if (this.currentSrc) {
          this.loaded = false;
          this.changed = true;
        }
        this.currentSrc = src;
        this.updateImage(this.currentSrc);
      }
    }
  }]);
}(_element__WEBPACK_IMPORTED_MODULE_0__["default"]); // TODO: No need to save image copy in assets you can directly read it from the orignal


/***/ }),

/***/ "./src/elements/inputElement.js":
/*!**************************************!*\
  !*** ./src/elements/inputElement.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InputElement)
/* harmony export */ });
/* harmony import */ var _textElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./textElement */ "./src/elements/textElement.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var InputElement = /*#__PURE__*/function (_TextElement) {
  function InputElement(web2vr, domElement, layer) {
    var _this;
    _classCallCheck(this, InputElement);
    _this = _callSuper(this, InputElement, [web2vr, domElement, layer]);
    _this.borderColor = new THREE.Color(0x000000);
    _this.borderWidth = 1;
    _this.active = false;

    // update when there is change of value
    _this.domElement.addEventListener("input", function () {
      return _this.update();
    });
    // when clicked make it active input for the keyboard and position the keyboard relative to camera
    _this.entity.addEventListener("click", function () {
      var camera = _this.web2vr.aframe.scene.camera.parent;
      var keyboard = _this.web2vr.aframe.keyboard.object3D;
      keyboard.position.copy(camera.position);
      keyboard.rotation.copy(camera.rotation);
      keyboard.rotation.z = 0;
      keyboard.rotation.x = THREE.Math.degToRad(-30);
      keyboard.translateX(-0.24);
      keyboard.translateY(-0.1);
      keyboard.translateZ(-0.6);
      keyboard.visible = true;
      if (_this.web2vr.aframe.keyboard.activeInput) {
        _this.web2vr.aframe.keyboard.activeInput.element.active = false;
        // update web2vr where activeInput is located
        _this.web2vr.aframe.keyboard.activeInput.element.web2vr.update();
      }
      _this.active = true;
      _this.web2vr.aframe.keyboard.activeInput = _this.domElement;
      _this.web2vr.update();
    });
    return _this;
  }
  _inherits(InputElement, _TextElement);
  return _createClass(InputElement, [{
    key: "updateText",
    value: function updateText() {
      var value = this.domElement.value;
      if (value) this.textValue = value;else this.textValue = this.domElement.placeholder;
    }
  }, {
    key: "updateTextColor",
    value: function updateTextColor() {
      var value = this.domElement.value;
      if (value) _get(_getPrototypeOf(InputElement.prototype), "updateTextColor", this).call(this);else this.entity.setAttribute("text", "color", "#999");
      if (this.active) this.entity.setAttribute("color", "#ffffcc");
    }
  }]);
}(_textElement__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/elements/radioElement.js":
/*!**************************************!*\
  !*** ./src/elements/radioElement.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RadioElement)
/* harmony export */ });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/elements/element.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RadioElement = /*#__PURE__*/function (_Element) {
  function RadioElement(web2vr, domElement, layer) {
    var _this;
    _classCallCheck(this, RadioElement);
    _this = _callSuper(this, RadioElement, [web2vr, domElement, layer]);
    _this.borderColor = new THREE.Color(0x000000);
    _this.borderWidth = 1;
    _this.entity = document.createElement("a-circle");
    _this.domElement.addEventListener("click", function () {
      _this.web2vr.update();
    }.bind(_this));
    return _this;
  }
  _inherits(RadioElement, _Element);
  return _createClass(RadioElement, [{
    key: "specificUpdate",
    value: function specificUpdate() {
      this.entity.setAttribute("radius", this.position.width / 2);
      if (this.domElement.checked) this.entity.setAttribute("color", "#0075FF");else this.entity.setAttribute("color", "#FFFFFF");
    }
  }]);
}(_element__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/elements/svgElement.js":
/*!************************************!*\
  !*** ./src/elements/svgElement.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SvgElement)
/* harmony export */ });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/elements/element.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SvgElement = /*#__PURE__*/function (_Element) {
  function SvgElement(web2vr, domElement, layer) {
    var _this;
    _classCallCheck(this, SvgElement);
    _this = _callSuper(this, SvgElement, [web2vr, domElement, layer]);
    _this.imageId = null;
    _this.entity = document.createElement("a-image");
    return _this;
  }
  _inherits(SvgElement, _Element);
  return _createClass(SvgElement, [{
    key: "svgToImage",
    value: function svgToImage() {
      var _this2 = this;
      var svgString = new XMLSerializer().serializeToString(this.domElement);
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      canvas.width = this.position.domPosition.width * 2;
      canvas.height = this.position.domPosition.height * 2;
      var DOMURL = self.URL || self.webkitURL || self;
      var img = new Image();
      var svg = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8"
      });
      var url = DOMURL.createObjectURL(svg);
      img.onload = function () {
        if (_this2.domElement.style.width) ctx.drawImage(img, 0, 0, canvas.width * 2, canvas.height * 2);else ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        DOMURL.revokeObjectURL(url);
        _this2.updateImage(canvas.toDataURL());
        canvas.remove();
      };
      img.src = url;
    }
  }, {
    key: "updateImage",
    value: function updateImage(src) {
      var assetId = this.web2vr.aframe.assetManager.getAsset(src, "img");

      // remove old image if there is new image
      if (this.imageId && this.imageId != assetId) this.web2vr.aframe.assetManager.removeAsset(this.imageId);
      this.entity.setAttribute("id", "IMAGE_" + assetId);
      this.entity.setAttribute("src", "#" + assetId);
      this.imageId = assetId;
    }
  }, {
    key: "specificUpdate",
    value: function specificUpdate() {
      this.svgToImage();
    }
  }]);
}(_element__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/elements/textElement.js":
/*!*************************************!*\
  !*** ./src/elements/textElement.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TextElement)
/* harmony export */ });
/* harmony import */ var _containerElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./containerElement */ "./src/elements/containerElement.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TextElement = /*#__PURE__*/function (_ContainerElement) {
  function TextElement(web2vr, domElement, layer) {
    var _this;
    _classCallCheck(this, TextElement);
    _this = _callSuper(this, TextElement, [web2vr, domElement, layer, false]);
    _this.entity.setAttribute("text", "value", "");
    _this.textValue = null;
    return _this;
  }
  _inherits(TextElement, _ContainerElement);
  return _createClass(TextElement, [{
    key: "setupClipping",
    value: function setupClipping() {
      var clippingContext = this.getClippingContext();
      if (clippingContext) {
        this.clippingContext = clippingContext;
        var material = this.entity.components.text.material;

        // text component uses custom shader so default three.js clipping doesnt work, needed to inject clipping shader code inside the custom shader code(RawShaderMaterial)
        // help from https://stackoverflow.com/questions/42532545/add-clipping-to-three-shadermaterial
        // 1.1.0 version changes: Because Aframe 1.1.0 changes text material shader to use webgl 2(glsl 3) some of the three.js ShaderChunk had to be converted to glsl 3.
        var fragmentShader = "#version 300 es\n            precision highp float;\n            uniform bool negate;\n            uniform float alphaTest;\n            uniform float opacity;\n            uniform sampler2D map;\n            uniform vec3 color;\n            in vec2 vUV;\n            out vec4 fragColor;\n            float median(float r, float g, float b) {\n                return max(min(r, g), min(max(r, g), b));\n            }\n            #define BIG_ENOUGH 0.001\n            #define MODIFIED_ALPHATEST (0.02 * isBigEnough / BIG_ENOUGH)\n            \n            // clipping_planes_pars_fragment converted to glsl 3\n            #if NUM_CLIPPING_PLANES > 0\n                in vec3 vClipPosition;\n                uniform vec4 clippingPlanes[NUM_CLIPPING_PLANES];\n            #endif\n            \n            void main() {\n                // compatible with glsl 3\n                #include <clipping_planes_fragment>\n\n                vec3 sampleColor = texture(map, vUV).rgb;\n                if (negate) { sampleColor = 1.0 - sampleColor; }\n                float sigDist = median(sampleColor.r, sampleColor.g, sampleColor.b) - 0.5;\n                float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);\n                float dscale = 0.353505;\n                vec2 duv = dscale * (dFdx(vUV) + dFdy(vUV));\n                float isBigEnough = max(abs(duv.x), abs(duv.y));\n                // Do modified alpha test.\n                if (isBigEnough > BIG_ENOUGH) {\n                    float ratio = BIG_ENOUGH / isBigEnough;\n                    alpha = ratio * alpha + (1.0 - ratio) * (sigDist + 0.5);\n                }\n                // Do modified alpha test.\n                if (alpha < alphaTest * MODIFIED_ALPHATEST) { discard; return; }\n                fragColor = vec4(color.xyz, alpha * opacity);\n            }";
        var vertexShader = "#version 300 es\n            in vec2 uv;\n            in vec3 position;\n            uniform mat4 projectionMatrix;\n            uniform mat4 modelViewMatrix;\n            out vec2 vUV;\n\n            // clipping_planes_pars_vertex converted to glsl 3\n            #if NUM_CLIPPING_PLANES > 0\n\t            out vec3 vClipPosition;\n            #endif\n\n            void main(void) {\n                // compatible with glsl 3\n                #include <begin_vertex>\n\n                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                vUV = uv;\n\n                // compatible with glsl 3\n                #include <project_vertex>\n                #include <clipping_planes_vertex>\n\n            }";
        material.fragmentShader = fragmentShader;
        material.vertexShader = vertexShader;
        material.clipping = true;
        material.clippingPlanes = clippingContext.planes;
        this.updateClipping();
      }
    }
  }, {
    key: "updateTextAlignment",
    value: function updateTextAlignment() {
      // align css text-align to text component
      var align = this.style.textAlign;
      if (!["left", "right", "center"].includes(align)) align = "left";
      this.entity.setAttribute("text", "align", align);

      // set text lineHeight if it has custom css lineHeight
      var text = this.entity.components.text;
      if (this.style.lineHeight != "normal" && typeof text.currentFont != "undefined") {
        this.entity.setAttribute("text", "lineHeight", text.currentFont.common.lineHeight + parseFloat(this.style.lineHeight));
      }
    }
  }, {
    key: "updateTextSize",
    value: function updateTextSize() {
      var actualFontSize = parseFloat(this.style.fontSize);
      var width = this.position.width;
      var widthInPixels = width / this.position.scalingFactor;
      var wrapPixels = widthInPixels * 42 / actualFontSize;
      wrapPixels *= 1.107; //1.10706774183070233
      this.entity.setAttribute("text", "wrapPixels", wrapPixels);
      this.entity.setAttribute("text", "width", width);
    }
  }, {
    key: "updateTextColor",
    value: function updateTextColor() {
      // opacity from parent because it doesnt pass it to children
      var opacity = this.domElement.parentElement.element.style.opacity;
      this.entity.setAttribute("text", "opacity", opacity);
      var textColor = this.style.color;
      this.entity.setAttribute("text", "color", textColor);
    }
  }, {
    key: "updateText",
    value: function updateText() {
      // remove new lines and whitespaces
      this.textValue = this.domElement.textContent.replace(/\s{2,}/g, ' ');
    }
  }, {
    key: "specificUpdate",
    value: function specificUpdate() {
      _get(_getPrototypeOf(TextElement.prototype), "specificUpdate", this).call(this);
      this.updateTextSize();
      this.updateTextAlignment();
      this.updateText();
      this.entity.setAttribute("text", "value", this.textValue);
      this.updateTextColor();
    }
  }]);
}(_containerElement__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/elements/videoElement.js":
/*!**************************************!*\
  !*** ./src/elements/videoElement.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VideoElement)
/* harmony export */ });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/elements/element.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var VideoElement = /*#__PURE__*/function (_Element) {
  function VideoElement(web2vr, domElement, layer) {
    var _this;
    _classCallCheck(this, VideoElement);
    _this = _callSuper(this, VideoElement, [web2vr, domElement, layer]);
    // normal video
    _this.entity = document.createElement("a-video");
    // 360 video
    _this.video360 = document.createElement("a-videosphere");
    _this.web2vr.aframe.scene.appendChild(_this.video360);
    _this.createClickEvent();
    _this.domElement.addEventListener("play", function () {
      if (_this.domElement.hasAttribute("vr")) _this.video360.components.material.material.map.image.play();
    });
    _this.domElement.addEventListener("pause", function () {
      if (_this.domElement.hasAttribute("vr")) _this.video360.components.material.material.map.image.pause();
    });
    return _this;
  }
  _inherits(VideoElement, _Element);
  return _createClass(VideoElement, [{
    key: "createClickEvent",
    value: function createClickEvent() {
      var _this2 = this;
      // for normal video
      this.domElement.addEventListener("click", function () {
        _this2.domElement.paused ? _this2.domElement.play() : _this2.domElement.pause();
      });
    }
  }, {
    key: "specificUpdate",
    value: function specificUpdate() {
      var src = this.domElement.currentSrc;
      var id = this.domElement.id;

      // if there is no video id generate new id
      if (!id) {
        id = this.web2vr.aframe.assetManager.updateCurrentAssetIdReturn();
        this.domElement.id = id;
      }
      if (this.domElement.hasAttribute("vr")) {
        this.video360.object3D.visible = true;
        this.video360.classList.add(this.web2vr.settings.interactiveTag);
        this.entity.object3D.visible = false;
        this.entity.classList.remove(this.web2vr.settings.interactiveTag);
        this.video360.setAttribute("src", "#" + id);
        // set video360 rotation
        var rotation = this.domElement.getAttribute("vr");
        if (rotation) this.video360.object3D.rotation.y = THREE.Math.degToRad(rotation);else this.video360.object3D.rotation.y = 0;
      } else {
        this.video360.object3D.visible = false;
        this.video360.classList.remove(this.web2vr.settings.interactiveTag);
        this.entity.object3D.visible = true;
        this.entity.classList.add(this.web2vr.settings.interactiveTag);
        this.entity.setAttribute("src", "#" + id);
      }
    }
  }]);
}(_element__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/plugins/aframe-keyboard.min.js":
/*!********************************************!*\
  !*** ./src/plugins/aframe-keyboard.min.js ***!
  \********************************************/
/***/ (() => {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
!function (e) {
  var t = {};
  function a(d) {
    if (t[d]) return t[d].exports;
    var n = t[d] = {
      i: d,
      l: !1,
      exports: {}
    };
    return e[d].call(n.exports, n, n.exports, a), n.l = !0, n.exports;
  }
  a.m = e, a.c = t, a.d = function (e, t, d) {
    a.o(e, t) || Object.defineProperty(e, t, {
      enumerable: !0,
      get: d
    });
  }, a.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    });
  }, a.t = function (e, t) {
    if (1 & t && (e = a(e)), 8 & t) return e;
    if (4 & t && "object" == _typeof(e) && e && e.__esModule) return e;
    var d = Object.create(null);
    if (a.r(d), Object.defineProperty(d, "default", {
      enumerable: !0,
      value: e
    }), 2 & t && "string" != typeof e) for (var n in e) a.d(d, n, function (t) {
      return e[t];
    }.bind(null, n));
    return d;
  }, a.n = function (e) {
    var t = e && e.__esModule ? function () {
      return e["default"];
    } : function () {
      return e;
    };
    return a.d(t, "a", t), t;
  }, a.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }, a.p = "", a(a.s = 0);
}([function (e, t, a) {
  a(1), a(3);
  var d = a(4),
    n = {
      mode: "normal"
    };
  n.template = new d(), e.exports = window.AFK = n;
}, function (e, t, a) {
  var d = a(2);
  if ("undefined" == typeof AFRAME) throw new Error("Component attempted to register before AFRAME was available.");
  AFRAME.registerComponent("a-keyboard", {
    schema: {
      audio: {
        "default": !1
      },
      color: {
        "default": "#fff"
      },
      highlightColor: {
        "default": "#1a79dc"
      },
      dismissable: {
        "default": !0
      },
      font: {
        "default": "monoid"
      },
      fontSize: {
        "default": "0.39"
      },
      locale: {
        "default": "en"
      },
      model: {
        "default": ""
      },
      baseTexture: {
        "default": ""
      },
      keyTexture: {
        "default": ""
      },
      verticalAlign: {
        "default": "center"
      }
    },
    init: function init() {
      AFK.template.draw(_objectSpread(_objectSpread({}, this.data), {}, {
        el: this.el
      })), this.attachEventListeners();
    },
    attachEventListeners: function attachEventListeners() {
      window.addEventListener("keydown", this.handleKeyboardPress), this.el.addEventListener("click", this.handleKeyboardVR);
    },
    removeEventListeners: function removeEventListeners() {
      window.removeEventListener("keydown", this.handleKeyboardPress), this.el.removeEventListener("click", this.handleKeyboardVR);
    },
    handleKeyboardPress: function handleKeyboardPress(e) {
      d(e);
    },
    handleKeyboardVR: function handleKeyboardVR(e) {
      d(e, "vr");
    },
    remove: function remove() {
      this.removeEventListeners();
    }
  });
}, function (e, t) {
  e.exports = function (e, t) {
    var a;
    var d = new Set([16, 17, 18, 20, 33, 34, 35, 36, 45, 46, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]),
      n = e.key && e.key.charCodeAt(0);
    var r = e.key,
      s = e.keyCode;
    if ("vr" === t) s = parseInt(document.querySelector("#".concat(e.target.id)).getAttribute("key-code")), r = document.querySelector("#".concat(e.target.id)).getAttribute("value");else if (d.has(e.keyCode)) return;
    switch (s) {
      case 9:
        a = new CustomEvent("a-keyboard-update", {
          detail: {
            code: s,
            value: "\t"
          }
        }), document.dispatchEvent(a);
        break;
      case 8:
        a = new CustomEvent("a-keyboard-update", {
          detail: {
            code: s,
            value: ""
          }
        }), document.dispatchEvent(a);
        break;
      case 13:
        a = new CustomEvent("a-keyboard-update", {
          detail: {
            code: s,
            value: "\n"
          }
        }), document.dispatchEvent(a);
        break;
      case 16:
        AFK.template.toggleActiveMode("shift");
        break;
      case 18:
        AFK.template.toggleActiveMode("alt");
        break;
      case 27:
        this.dismissable && (a = new CustomEvent("a-keyboard-update", {
          detail: {
            code: s,
            value: ""
          }
        }), document.dispatchEvent(a));
        break;
      case 32:
        a = new CustomEvent("a-keyboard-update", {
          detail: {
            code: s,
            value: " "
          }
        }), document.dispatchEvent(a);
        break;
      default:
        a = new CustomEvent("a-keyboard-update", {
          detail: {
            code: s,
            value: r
          }
        }), document.dispatchEvent(a);
    }
    if ("vr" !== t) {
      var _t = document.querySelector("#a-keyboard-".concat(n)) || document.querySelector("#a-keyboard-".concat(e.keyCode));
      _t && (_t.dispatchEvent(new Event("mousedown")), setTimeout(function () {
        _t.dispatchEvent(new Event("mouseleave"));
      }, 80));
    }
  };
}, function (e, t) {
  if ("undefined" == typeof AFRAME) throw new Error("Component attempted to register before AFRAME was available.");
  AFRAME.registerComponent("keyboard-button", {
    init: function init() {
      var _this = this;
      var e = this.el;
      e.addEventListener("mousedown", function () {
        e.setAttribute("material", "opacity", "0.7");
      }), e.addEventListener("mouseup", function () {
        e.setAttribute("material", "opacity", _this.isMouseEnter ? "0.9" : "0");
      }), e.addEventListener("mouseenter", function () {
        e.setAttribute("material", "opacity", "0.9"), self.isMouseEnter = !0;
      }), e.addEventListener("mouseleave", function () {
        e.setAttribute("material", "opacity", "0"), self.isMouseEnter = !1;
      });
    }
  });
}, function (e, t, a) {
  var d = a(5);
  e.exports = /*#__PURE__*/function () {
    function _class() {
      _classCallCheck(this, _class);
      this.keyboardKeys = {}, this.activeMode = "normal";
    }
    return _createClass(_class, [{
      key: "draw",
      value: function draw(e) {
        for (var _t2 in e) this[_t2] = e[_t2];
        this.keyboardKeys = d(e.locale), this.drawKeyboard();
      }
    }, {
      key: "drawButton",
      value: function drawButton(e) {
        var t = e.key,
          a = t.size.split(" ")[0],
          d = t.size.split(" ")[1],
          n = document.createElement("a-entity");
        n.setAttribute("position", e.position);
        var r = document.createElement("a-entity");
        r.setAttribute("geometry", "primitive: plane; width: ".concat(a, "; height: ").concat(d, ";")), this.keyTexture && this.keyTexture.length > 0 ? r.setAttribute("material", "src: ".concat(this.keyTexture)) : r.setAttribute("material", "color: #4a4a4a; opacity: 0.9");
        var s = document.createElement("a-text");
        s.id = "a-keyboard-".concat(t.code), s.setAttribute("key-code", t.code), s.setAttribute("value", t.value), s.setAttribute("align", "center"), s.setAttribute("baseline", this.verticalAlign), s.setAttribute("position", "0 0 0.001"), s.setAttribute("width", this.fontSize), s.setAttribute("height", this.fontSize), s.setAttribute("geometry", "primitive: plane; width: ".concat(a, "; height: ").concat(d)), s.setAttribute("material", "opacity: 0.0; transparent: true; color: ".concat(this.highlightColor)), s.setAttribute("color", this.color), s.setAttribute("font", this.font), s.setAttribute("shader", "msdf"), s.setAttribute("negate", "false"), s.setAttribute("keyboard-button", !0), s.setAttribute("class", "collidable"), n.appendChild(r), n.appendChild(s), this.el.appendChild(n);
      }
    }, {
      key: "drawKeyboard",
      value: function drawKeyboard() {
        for (; this.el.firstChild;) this.el.removeChild(this.el.firstChild);
        if (this.keyboardKeys) {
          var _e = this.keyboardKeys[this.activeMode] || this.keyboardKeys.normal,
            _t3 = document.createElement("a-entity"),
            _a = .52,
            _d = .04 * _e.length + .004 * (_e.length - 1) + .04;
          _t3.setAttribute("position", "".concat(_a / 2 - .02, " ").concat(-_d / 2 + .02, " -0.01")), _t3.setAttribute("geometry", "primitive: plane; width: ".concat(_a, "; height: ").concat(_d)), this.baseTexture && this.baseTexture.length > 0 ? _t3.setAttribute("material", "src: ".concat(this.baseTexture)) : _t3.setAttribute("material", "color: #4a4a4a; side: double; opacity: 0.7"), this.el.appendChild(_t3);
          var n = 0;
          for (var _t4 = 0; _t4 < _e.length; _t4++) {
            var _a2 = _e[_t4];
            var _d2 = 0;
            for (var _e2 = 0; _e2 < _a2.length; _e2++) {
              var _t5 = _a2[_e2],
                r = this.parseKeyObjects(_t5);
              if (!this.dismissable && "cancel" === _t5.type) continue;
              var s = r.size.split(" ")[0],
                l = r.size.split(" ")[1];
              this.drawButton({
                key: r,
                position: "".concat(_d2 + s / 2, " ").concat(n - l / 2, " 0")
              }), _d2 += parseFloat(s) + .004, _a2.length === _e2 + 1 && (n -= .044);
            }
          }
        }
      }
    }, {
      key: "toggleActiveMode",
      value: function toggleActiveMode(e) {
        e === this.activeMode ? (this.activeMode = "normal", this.drawKeyboard()) : (this.activeMode = e, this.drawKeyboard());
      }
    }, {
      key: "parseKeyObjects",
      value: function parseKeyObjects(e) {
        var t = e.type,
          a = e.value;
        switch (t) {
          case "delete":
            return {
              size: "0.04 0.04 0",
              value: a,
              code: "8"
            };
          case "enter":
            return {
              size: "0.04 0.084 0",
              value: a,
              code: "13"
            };
          case "shift":
            return {
              size: "0.084 0.04 0",
              value: a,
              code: "16"
            };
          case "alt":
            return {
              size: "0.084 0.04 0",
              value: a,
              code: "18"
            };
          case "space":
            return {
              size: "".concat(.2 + .016, " 0.04 0"),
              value: a,
              code: "32"
            };
          case "cancel":
            return {
              size: "0.084 0.04 0",
              value: a,
              code: "24"
            };
          case "submit":
            return {
              size: "0.084 0.04 0",
              value: a,
              code: "06"
            };
          default:
            return {
              size: "0.04 0.04 0",
              value: a,
              code: a.charCodeAt(0)
            };
        }
      }
    }]);
  }();
}, function (e, t, a) {
  var d = a(6);
  e.exports = function (e) {
    switch (e) {
      case "en":
      default:
        return d;
    }
  };
}, function (e, t) {
  e.exports = {
    name: "ms-US-International",
    normal: [[{
      value: "1",
      type: "standard"
    }, {
      value: "2",
      type: "standard"
    }, {
      value: "3",
      type: "standard"
    }, {
      value: "4",
      type: "standard"
    }, {
      value: "5",
      type: "standard"
    }, {
      value: "6",
      type: "standard"
    }, {
      value: "7",
      type: "standard"
    }, {
      value: "8",
      type: "standard"
    }, {
      value: "9",
      type: "standard"
    }, {
      value: "0",
      type: "standard"
    }, {
      value: "<-",
      type: "delete"
    }], [{
      value: "q",
      type: "standard"
    }, {
      value: "w",
      type: "standard"
    }, {
      value: "e",
      type: "standard"
    }, {
      value: "r",
      type: "standard"
    }, {
      value: "t",
      type: "standard"
    }, {
      value: "y",
      type: "standard"
    }, {
      value: "u",
      type: "standard"
    }, {
      value: "i",
      type: "standard"
    }, {
      value: "o",
      type: "standard"
    }, {
      value: "p",
      type: "standard"
    }, {
      value: "Ent",
      type: "enter"
    }], [{
      value: "a",
      type: "standard"
    }, {
      value: "s",
      type: "standard"
    }, {
      value: "d",
      type: "standard"
    }, {
      value: "f",
      type: "standard"
    }, {
      value: "g",
      type: "standard"
    }, {
      value: "h",
      type: "standard"
    }, {
      value: "j",
      type: "standard"
    }, {
      value: "k",
      type: "standard"
    }, {
      value: "l",
      type: "standard"
    }, {
      value: '"',
      type: "standard"
    }], [{
      value: "Shift",
      type: "shift"
    }, {
      value: "z",
      type: "standard"
    }, {
      value: "x",
      type: "standard"
    }, {
      value: "c",
      type: "standard"
    }, {
      value: "v",
      type: "standard"
    }, {
      value: "b",
      type: "standard"
    }, {
      value: "n",
      type: "standard"
    }, {
      value: "m",
      type: "standard"
    }, {
      value: "Alt",
      type: "alt"
    }], [{
      value: "Cancel",
      type: "cancel"
    }, {
      value: "",
      type: "space"
    }, {
      value: ",",
      type: "standard"
    }, {
      value: ".",
      type: "standard"
    }, {
      value: "Submit",
      type: "submit"
    }]],
    shift: [[{
      value: "1",
      type: "standard"
    }, {
      value: "2",
      type: "standard"
    }, {
      value: "3",
      type: "standard"
    }, {
      value: "4",
      type: "standard"
    }, {
      value: "5",
      type: "standard"
    }, {
      value: "6",
      type: "standard"
    }, {
      value: "7",
      type: "standard"
    }, {
      value: "8",
      type: "standard"
    }, {
      value: "9",
      type: "standard"
    }, {
      value: "0",
      type: "standard"
    }, {
      value: "<-",
      type: "delete"
    }], [{
      value: "Q",
      type: "standard"
    }, {
      value: "W",
      type: "standard"
    }, {
      value: "E",
      type: "standard"
    }, {
      value: "R",
      type: "standard"
    }, {
      value: "T",
      type: "standard"
    }, {
      value: "Y",
      type: "standard"
    }, {
      value: "U",
      type: "standard"
    }, {
      value: "I",
      type: "standard"
    }, {
      value: "O",
      type: "standard"
    }, {
      value: "P",
      type: "standard"
    }, {
      value: "Ent",
      type: "enter"
    }], [{
      value: "A",
      type: "standard"
    }, {
      value: "S",
      type: "standard"
    }, {
      value: "D",
      type: "standard"
    }, {
      value: "F",
      type: "standard"
    }, {
      value: "G",
      type: "standard"
    }, {
      value: "H",
      type: "standard"
    }, {
      value: "J",
      type: "standard"
    }, {
      value: "K",
      type: "standard"
    }, {
      value: "L",
      type: "standard"
    }, {
      value: '"',
      type: "standard"
    }], [{
      value: "Shift",
      type: "shift"
    }, {
      value: "Z",
      type: "standard"
    }, {
      value: "X",
      type: "standard"
    }, {
      value: "C",
      type: "standard"
    }, {
      value: "V",
      type: "standard"
    }, {
      value: "B",
      type: "standard"
    }, {
      value: "N",
      type: "standard"
    }, {
      value: "M",
      type: "standard"
    }, {
      value: "Alt",
      type: "alt"
    }], [{
      value: "Cancel",
      type: "cancel"
    }, {
      value: "",
      type: "space"
    }, {
      value: ",",
      type: "standard"
    }, {
      value: ".",
      type: "standard"
    }, {
      value: "Submit",
      type: "submit"
    }]],
    alt: [[{
      value: "1",
      type: "standard"
    }, {
      value: "2",
      type: "standard"
    }, {
      value: "3",
      type: "standard"
    }, {
      value: "4",
      type: "standard"
    }, {
      value: "5",
      type: "standard"
    }, {
      value: "6",
      type: "standard"
    }, {
      value: "7",
      type: "standard"
    }, {
      value: "8",
      type: "standard"
    }, {
      value: "9",
      type: "standard"
    }, {
      value: "0",
      type: "standard"
    }, {
      value: "<-",
      type: "delete"
    }], [{
      value: "~",
      type: "standard"
    }, {
      value: "`",
      type: "standard"
    }, {
      value: "|",
      type: "standard"
    }, {
      value: "(",
      type: "standard"
    }, {
      value: ")",
      type: "standard"
    }, {
      value: "^",
      type: "standard"
    }, {
      value: "_",
      type: "standard"
    }, {
      value: "-",
      type: "standard"
    }, {
      value: "=",
      type: "standard"
    }, {
      value: "!",
      type: "standard"
    }, {
      value: "Ent",
      type: "enter"
    }], [{
      value: "@",
      type: "standard"
    }, {
      value: "#",
      type: "standard"
    }, {
      value: "$",
      type: "standard"
    }, {
      value: "%",
      type: "standard"
    }, {
      value: "*",
      type: "standard"
    }, {
      value: "[",
      type: "standard"
    }, {
      value: "]",
      type: "standard"
    }, {
      value: "#",
      type: "standard"
    }, {
      value: "<",
      type: "standard"
    }, {
      value: "?",
      type: "standard"
    }], [{
      value: "Shift",
      type: "shift"
    }, {
      value: ":",
      type: "standard"
    }, {
      value: ";",
      type: "standard"
    }, {
      value: "{",
      type: "standard"
    }, {
      value: "}",
      type: "standard"
    }, {
      value: "/",
      type: "standard"
    }, {
      value: "\\",
      type: "standard"
    }, {
      value: ">",
      type: "standard"
    }, {
      value: "Alt",
      type: "alt"
    }], [{
      value: "Cancel",
      type: "cancel"
    }, {
      value: "",
      type: "space"
    }, {
      value: ",",
      type: "standard"
    }, {
      value: ".",
      type: "standard"
    }, {
      value: "Submit",
      type: "submit"
    }]]
  };
}]);

/***/ }),

/***/ "./src/plugins/eventListenerListPlugin.js":
/*!************************************************!*\
  !*** ./src/plugins/eventListenerListPlugin.js ***!
  \************************************************/
/***/ (() => {

// https://gist.github.com/stringparser/a3b0555fd915138a0ed3 edited version from DOM2AFrame
;
[Element].forEach(function (self) {
  //self.prototype.eventListenerList = {}; // shared STATIC object across all instances... NOT what we want
  self.prototype._addEventListener = self.prototype.addEventListener;
  self.prototype.addEventListener = function (type, handle, useCapture) {
    if (!this.eventListenerList) this.eventListenerList = {};
    useCapture = useCapture === void 0 ? false : useCapture;
    var node = this;
    node._addEventListener(type, handle, useCapture);
    if (!node.eventListenerList[type]) {
      node.eventListenerList[type] = [];
    }
    node.eventListenerList[type].push({
      type: type,
      handle: handle,
      useCapture: useCapture,
      remove: function remove() {
        node.removeEventListener(this.type, this.handle, this.useCapture);
        return node.eventListenerList[type];
      }
    });
    if (type != "eventListenerAdded" && type != "eventListenerRemoved") {
      var eventDetail = {
        'type': type,
        'handle': handle,
        'useCapture': useCapture
      };
      var addedEvent = new CustomEvent("eventListenerAdded", {
        detail: eventDetail
      });
      this.dispatchEvent(addedEvent);
    }
  };
  self.prototype._removeEventListener = self.prototype.removeEventListener;
  self.prototype.removeEventListener = function (type, handle, useCapture) {
    if (!this.eventListenerList) this.eventListenerList = {};
    var node = this;
    if (!node.eventListenerList[type]) return;
    node._removeEventListener(type, handle, useCapture);
    node.eventListenerList[type] = node.eventListenerList[type].filter(function (listener) {
      return listener && listener.handle && handle && listener.handle.toString() !== handle.toString(); // native event listener API supports empty handles/listeners, but .toString obviously doesn't
    });
    if (node.eventListenerList[type].length === 0) {
      delete node.eventListenerList[type];
    }
    if (type != "eventListenerAdded" && type != "eventListenerRemoved") {
      var eventDetail = {
        'type': type,
        'handle': handle,
        'useCapture': useCapture
      };
      var removedEvent = new CustomEvent("eventListenerRemoved", {
        detail: eventDetail
      });
      this.dispatchEvent(removedEvent);
    }
  };
});

/***/ }),

/***/ "./src/scroll.js":
/*!***********************!*\
  !*** ./src/scroll.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Scroll)
/* harmony export */ });
/* harmony import */ var _components_scrollbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/scrollbar */ "./src/components/scrollbar.js");
/* harmony import */ var _components_scrollbar__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_components_scrollbar__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Scroll = /*#__PURE__*/function () {
  function Scroll(web2vr) {
    _classCallCheck(this, Scroll);
    this.web2vr = web2vr;
    this.hasScroll = false;
    this.scrollBody = false;
    this.scrollContainer = null;
    if (this.web2vr.settings.scroll) {
      this.checkScrollbar();
      if (this.hasScroll) this.createScrollbar();
    }
  }
  return _createClass(Scroll, [{
    key: "checkScrollbar",
    value: function checkScrollbar() {
      // entire body scroll
      var body = document.scrollingElement;
      // div container scroll
      var container = this.web2vr.container;
      if (body.scrollHeight > body.clientHeight) {
        this.hasScroll = true;
        this.scrollContainer = body;
        this.scrollBody = true;
      } else if (container.element.style.overflow == "scroll") {
        //container.scrollHeight > container.clientHeight
        this.hasScroll = true;
        this.scrollContainer = container;
      }
    }
  }, {
    key: "createScrollbar",
    value: function createScrollbar() {
      this.scrollbar = document.createElement("a-entity");
      this.pointer = document.createElement("a-plane");
      this.pointer.setAttribute("material", "shader", "flat");
      this.pointer.setAttribute("color", "#C1C1C1");
      this.plane = document.createElement("a-plane");
      this.plane.setAttribute("material", "shader", "flat");
      this.plane.setAttribute("material", "side", "double");
      this.plane.classList.add(this.web2vr.settings.interactiveTag);
      this.plane.setAttribute("color", "#F1F1F1");
      this.plane.setAttribute("width", 1);
      this.plane.setAttribute("vr-scrollbar", "");

      // pointers for scroll compoment
      this.plane.web2vr = this.web2vr;
      this.plane.pointer = this.pointer;
      this.plane.scrollbar = this.scrollbar;
      this.plane.appendChild(this.pointer);
      this.scrollbar.appendChild(this.plane);
      this.web2vr.aframe.container.appendChild(this.scrollbar);
    }
  }, {
    key: "update",
    value: function update() {
      // there is no need to show scrollbar if the main container is hidden
      if (this.hasScroll) {
        if (this.web2vr.container.element.style.visibility == "visible") {
          this.scrollbar.object3D.visible = true;
          this.plane.classList.add(this.web2vr.settings.interactiveTag);
        } else if (this.web2vr.container.element.style.visibility == "hidden") {
          this.scrollbar.object3D.visible = false;
          this.plane.classList.remove(this.web2vr.settings.interactiveTag);
        }
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/settings.js":
/*!*************************!*\
  !*** ./src/settings.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Settings)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Settings = /*#__PURE__*/_createClass(function Settings() {
  _classCallCheck(this, Settings);
  this.scale = 600;
  this.position = {
    x: 0,
    y: 2,
    z: -1
  };
  this.rotation = {
    x: 0,
    y: 0,
    z: 0
  };
  this.layerStep = 0.0005; // z space between the layers

  this.parentSelector = null;
  this.interactiveTag = "vr-interactable";
  this.ignoreTags = ["BR", "SOURCE", "SCRIPT", "AUDIO", "NOSCRIPT"];
  this.debug = false;
  this.showClipping = false;
  this.forceClipping = false;
  this.experimental = false;
  this.scroll = true;
  this.scrollWindowHeight = 800;
  this.createControllers = true;
  this.raycasterFar = 5;
  this.skybox = true;
  this.border = true;
});


/***/ }),

/***/ "./src/utils/helper.js":
/*!*****************************!*\
  !*** ./src/utils/helper.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Helper)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Helper = /*#__PURE__*/function () {
  function Helper() {
    _classCallCheck(this, Helper);
  }
  return _createClass(Helper, null, [{
    key: "isUrl",
    value: function isUrl(string) {
      var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return regexp.test(string);
    }
  }, {
    key: "clamp",
    value: function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }
  }]);
}();


/***/ }),

/***/ "./src/utils/mouseEventHandler.js":
/*!****************************************!*\
  !*** ./src/utils/mouseEventHandler.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MouseEventHandler)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var MouseEventHandler = /*#__PURE__*/function () {
  function MouseEventHandler(element) {
    _classCallCheck(this, MouseEventHandler);
    this.element = element;
    this.listeningForMouseEvents = false;
    this.resync();
    this.checkEntityEvents();
  }
  return _createClass(MouseEventHandler, [{
    key: "resync",
    value: function resync() {
      var mouseEvents = ["click", "mouseenter", "mouseleave", "mousedown", "mouseup"];
      var mouseProperties = ["onclick", "onmouseenter", "onmouseleave", "onmousedown", "onmouseup"];
      var hasMouseEventRegistered = false;
      for (var _i = 0, _mouseEvents = mouseEvents; _i < _mouseEvents.length; _i++) {
        var mouseEvent = _mouseEvents[_i];
        if (this.element.domElement.eventListenerList && this.element.domElement.eventListenerList[mouseEvent]) {
          hasMouseEventRegistered = true;
          break;
        }
      }
      var hasMouseProperty = false;
      for (var _i2 = 0, _mouseProperties = mouseProperties; _i2 < _mouseProperties.length; _i2++) {
        var mouseProperty = _mouseProperties[_i2];
        if (this.element.domElement[mouseProperty]) {
          hasMouseProperty = true;
          break;
        }
      }
      if (hasMouseEventRegistered || hasMouseProperty) {
        if (!this.listeningForMouseEvents) {
          this.addMouseListeners(mouseEvents);
          this.listeningForMouseEvents = true;
        }
      }
      // no event handlers or event properties registered, so we can safely remove our listeners
      else if (this.listeningForMouseEvents) {
        this.removeMouseListeners(mouseEvents);
        this.listeningForMouseEvents = false;
      }
    }
  }, {
    key: "mouseEventHandler",
    value: function mouseEventHandler(evt) {
      var mouseEvent = new MouseEvent(evt.type, {
        "view": window,
        "bubbles": true,
        "cancelable": true,
        "target": this.element.domElement // maybe?
      });
      this.element.domElement.dispatchEvent(mouseEvent);
    }
  }, {
    key: "addMouseListeners",
    value: function addMouseListeners(mouseEvents) {
      var _this = this;
      mouseEvents.forEach(function (eventName) {
        _this.element.entity.addEventListener(eventName, _this.mouseEventHandler.bind(_this));
      });
    }
  }, {
    key: "removeMouseListeners",
    value: function removeMouseListeners(mouseEvents) {
      var _this2 = this;
      mouseEvents.forEach(function (eventName) {
        _this2.element.entity.removeEventListener(eventName, _this2.mouseEventHandler.bind(_this2));
      });
    }

    // for hover and input element
  }, {
    key: "checkEntityEvents",
    value: function checkEntityEvents() {
      var mouseEvents = ["click", "mouseenter", "mouseleave", "mousedown", "mouseup"];
      for (var _i3 = 0, _mouseEvents2 = mouseEvents; _i3 < _mouseEvents2.length; _i3++) {
        var mouseEvent = _mouseEvents2[_i3];
        if (this.element.entity.eventListenerList && this.element.entity.eventListenerList[mouseEvent]) {
          this.listeningForMouseEvents = true;
          break;
        }
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/utils/position.js":
/*!*******************************!*\
  !*** ./src/utils/position.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Position)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Position = /*#__PURE__*/function () {
  function Position(domPosition, depth, scale) {
    _classCallCheck(this, Position);
    // depth = z
    this.depth = depth;
    this.startDepth = depth;
    this.scale = scale;
    this.scrollY = 0;
    this.updatePosition(domPosition);
  }
  return _createClass(Position, [{
    key: "updatePosition",
    value: function updatePosition(domPosition) {
      this.domPosition = domPosition;
      this.aframePosition = this.calculateAFramePosition(this.domPosition);
    }
  }, {
    key: "calculateAFramePosition",
    value: function calculateAFramePosition(domPosition) {
      // making positions be in center because dom positions are in top left
      var aframePosition = {
        x: domPosition.x + domPosition.width / 2,
        y: domPosition.y + domPosition.height / 2,
        z: this.depth
      };

      // scaling
      aframePosition.x *= this.scalingFactor;
      aframePosition.y *= this.scalingFactor * -1; // * -1 to match aframe y-axis

      aframePosition.width = domPosition.width * this.scalingFactor;
      aframePosition.height = domPosition.height * this.scalingFactor;
      return aframePosition;
    }
  }, {
    key: "equalsDOMPosition",
    value: function equalsDOMPosition(domPosition) {
      return this.domPosition.top == domPosition.top && this.domPosition.bottom == domPosition.bottom && this.domPosition.left == domPosition.left && this.domPosition.right == domPosition.right;
    }
  }, {
    key: "scalingFactor",
    get: function get() {
      return 1 / this.scale;
    }
  }, {
    key: "x",
    get: function get() {
      return this.aframePosition.x;
    }
  }, {
    key: "y",
    get: function get() {
      return this.aframePosition.y + this.scrollY;
    }
  }, {
    key: "z",
    get: function get() {
      return this.aframePosition.z;
    }
  }, {
    key: "width",
    get: function get() {
      return this.aframePosition.width;
    }
  }, {
    key: "height",
    get: function get() {
      return this.aframePosition.height;
    }

    // vector3
  }, {
    key: "xyz",
    get: function get() {
      return {
        x: this.x,
        y: this.y,
        z: this.z
      };
    }
  }, {
    key: "left",
    get: function get() {
      return {
        x: this.x - this.width / 2,
        y: this.y,
        z: this.z
      };
    }
  }, {
    key: "right",
    get: function get() {
      return {
        x: this.x + this.width / 2,
        y: this.y,
        z: this.z
      };
    }
  }, {
    key: "top",
    get: function get() {
      return {
        x: this.x,
        y: this.y + this.height / 2,
        z: this.z
      };
    }
  }, {
    key: "bottom",
    get: function get() {
      return {
        x: this.x,
        y: this.y - this.height / 2,
        z: this.z
      };
    }
  }]);
}();


/***/ }),

/***/ "../node_modules/deepmerge/dist/cjs.js":
/*!*********************************************!*\
  !*** ../node_modules/deepmerge/dist/cjs.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";


var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

module.exports = deepmerge_1;


/***/ }),

/***/ "aframe":
/*!*************************!*\
  !*** external "aframe" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_aframe__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************!*\
  !*** ./src/web2vr.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Web2VR)
/* harmony export */ });
/* harmony import */ var _plugins_eventListenerListPlugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./plugins/eventListenerListPlugin */ "./src/plugins/eventListenerListPlugin.js");
/* harmony import */ var _plugins_eventListenerListPlugin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_plugins_eventListenerListPlugin__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var deepmerge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! deepmerge */ "../node_modules/deepmerge/dist/cjs.js");
/* harmony import */ var deepmerge__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(deepmerge__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _plugins_aframe_keyboard_min__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./plugins/aframe-keyboard.min */ "./src/plugins/aframe-keyboard.min.js");
/* harmony import */ var _plugins_aframe_keyboard_min__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_plugins_aframe_keyboard_min__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var super_hands__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! super-hands */ "./aframe-super-hands-component/index.js");
/* harmony import */ var super_hands__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(super_hands__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./settings */ "./src/settings.js");
/* harmony import */ var _components_border__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/border */ "./src/components/border.js");
/* harmony import */ var _components_border__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_components_border__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _components_animate__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/animate */ "./src/components/animate.js");
/* harmony import */ var _components_animate__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_components_animate__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_grabRotateStatic__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/grabRotateStatic */ "./src/components/grabRotateStatic.js");
/* harmony import */ var _components_grabRotateStatic__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_components_grabRotateStatic__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _scroll__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./scroll */ "./src/scroll.js");
/* harmony import */ var _aframeContext__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./aframeContext */ "./src/aframeContext.js");
/* harmony import */ var _elements_containerElement__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./elements/containerElement */ "./src/elements/containerElement.js");
/* harmony import */ var _elements_textElement__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./elements/textElement */ "./src/elements/textElement.js");
/* harmony import */ var _elements_imageElement__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./elements/imageElement */ "./src/elements/imageElement.js");
/* harmony import */ var _elements_videoElement__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./elements/videoElement */ "./src/elements/videoElement.js");
/* harmony import */ var _elements_checkboxElement__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./elements/checkboxElement */ "./src/elements/checkboxElement.js");
/* harmony import */ var _elements_radioElement__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./elements/radioElement */ "./src/elements/radioElement.js");
/* harmony import */ var _elements_inputElement__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./elements/inputElement */ "./src/elements/inputElement.js");
/* harmony import */ var _elements_buttonElement__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./elements/buttonElement */ "./src/elements/buttonElement.js");
/* harmony import */ var _elements_svgElement__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./elements/svgElement */ "./src/elements/svgElement.js");
/* harmony import */ var _elements_canvasElement__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./elements/canvasElement */ "./src/elements/canvasElement.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
 // Get all event listeners for DOM elements



// import "aframe-gif-shader";


















var Web2VR = /*#__PURE__*/function () {
  function Web2VR(container) {
    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Web2VR);
    // main div container
    if (container.nodeType == Node.ELEMENT_NODE) this.container = container;else this.container = document.querySelector(container);

    // deep merge settings
    this.settings = deepmerge__WEBPACK_IMPORTED_MODULE_1___default()(new _settings__WEBPACK_IMPORTED_MODULE_5__["default"](), settings, {
      arrayMerge: function arrayMerge(destination, source) {
        return [].concat(_toConsumableArray(destination), _toConsumableArray(source));
      }
    });

    // aframe context
    this.aframe = new _aframeContext__WEBPACK_IMPORTED_MODULE_10__["default"](this.settings);
    // vr elements
    this.elements = new Set();
    // set of all the hover css selectors
    this.hoverSelectors = new Set();
    this.observer = null;
    // observer parametars
    this.observerConfig = {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    }; //attributeFilter: ["style", "class", "id"]
    this.updating = false;

    // experimental only
    this.html2canvasIDcounter = 0;
  }

  // find all hover css rules and add {selector}hover class to them
  return _createClass(Web2VR, [{
    key: "findHoverCss",
    value: function findHoverCss() {
      try {
        for (var _i = 0, _arr = _toConsumableArray(document.styleSheets); _i < _arr.length; _i++) {
          var styleSheet = _arr[_i];
          for (var _i2 = 0, _arr2 = _toConsumableArray(styleSheet.cssRules); _i2 < _arr2.length; _i2++) {
            var rule = _arr2[_i2];
            if (rule instanceof CSSStyleRule) {
              var selectors = rule.selectorText.split(",");
              var _iterator = _createForOfIteratorHelper(selectors),
                _step;
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var selector = _step.value;
                  var sel = selector.split(":");
                  // is hover
                  if (sel[1] == "hover") {
                    var s = sel[0].replace(/\s/g, '');
                    if (s[0] == ".") rule.selectorText += ", ".concat(s, "hover");else if (s[0] == "#") rule.selectorText += ", .".concat(s.substr(1), "hover");else rule.selectorText += ", .".concat(s, "hover");
                    this.hoverSelectors.add(s);
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    // add all svg needed styles to defs inside svg so we can convert svg to png with all styles applied 
  }, {
    key: "generateStyleDefs",
    value: function generateStyleDefs(svgDomElement) {
      var styleDefs = "";
      var sheets = document.styleSheets;
      for (var i = 0; i < sheets.length; i++) {
        var rules = sheets[i].cssRules;
        for (var j = 0; j < rules.length; j++) {
          var rule = rules[j];
          if (rule.style) {
            var selectorText = rule.selectorText;
            var elems = svgDomElement.querySelectorAll(selectorText);
            if (elems.length) {
              styleDefs += selectorText + " { " + rule.style.cssText + " }\n";
            }
          }
        }
      }
      var s = document.createElement('style');
      s.setAttribute('type', 'text/css');
      s.innerHTML = styleDefs;
      var defs = document.createElement('defs');
      defs.appendChild(s);
      svgDomElement.insertBefore(defs, svgDomElement.firstChild);
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;
      // Return a promise that will resolve when the VR elements are added / scene is loaded.
      return new Promise(function (resolve, reject) {
        _this.findHoverCss();
        if (!_this.aframe.scene.hasLoaded) {
          _this.aframe.scene.addEventListener("loaded", function (resolve, init, context) {
            init.call(context);
            resolve();
          }(resolve, _this.init, _this), {
            once: true
          });
        } else _this.init().then(function () {
          resolve();
        });
      });
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;
      this.aframe.createContainer(this);
      this.aframe.createSky();
      this.aframe.createControllers();
      // scroll feature

      return this.convertToVR().then(function () {
        _this2.scroll = new _scroll__WEBPACK_IMPORTED_MODULE_9__["default"](_this2);
        return _this2.allLoadedUpdate();
      }).then(function () {
        return _this2.update();
      });
    }

    // update once after all images are loaded in the dom
  }, {
    key: "allLoadedUpdate",
    value: function allLoadedUpdate() {
      var _this3 = this;
      return new Promise(function (resolve, reject) {
        var interval = setInterval(function () {
          var allLoaded = true;
          var _iterator2 = _createForOfIteratorHelper(_this3.elements),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var element = _step2.value;
              if (element instanceof _elements_imageElement__WEBPACK_IMPORTED_MODULE_13__["default"] && !element.loaded) allLoaded = false;
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          if (allLoaded) {
            resolve();
            clearInterval(interval);
          }
        }, 100);
      });
    }
  }, {
    key: "addElement",
    value: function addElement(domElement, parentElement, layer) {
      var _this4 = this;
      // ignore tag if in ignoreTags list or text element(vr-span) is already added
      if (this.settings.ignoreTags.includes(domElement.tagName) || domElement.classList && domElement.classList.contains("vr-span")) return null;
      var element = null;
      // its text node and not empty
      if (domElement.nodeType == Node.TEXT_NODE && domElement.nodeValue.trim()) {
        var span = document.createElement("span");
        span.classList.add("vr-span");
        span.textContent = domElement.textContent;

        // dont want observer to listen changes when adding(replacing) span text into dom
        if (this.observer) this.observer.disconnect();
        domElement.replaceWith(span);
        if (this.observer) {
          this.observer.observe(this.container, this.observerConfig);
          // We need to add the observer to every slot inside the container as well.
          this.container.querySelectorAll("slot").forEach(function (slot) {
            _this4.observer.observe(slot, _this4.observerConfig);
          });
        }
        element = new _elements_textElement__WEBPACK_IMPORTED_MODULE_12__["default"](this, span, layer);
      }
      // for future convert this to switch statement
      else if (domElement.tagName == "VIDEO") element = new _elements_videoElement__WEBPACK_IMPORTED_MODULE_14__["default"](this, domElement, layer);else if (domElement.tagName == "IMG") element = new _elements_imageElement__WEBPACK_IMPORTED_MODULE_13__["default"](this, domElement, layer);else if (domElement.tagName == "svg") element = new _elements_svgElement__WEBPACK_IMPORTED_MODULE_19__["default"](this, domElement, layer);else if (domElement.tagName == "CANVAS") element = new _elements_canvasElement__WEBPACK_IMPORTED_MODULE_20__["default"](this, domElement, layer);else if (domElement.tagName == "BUTTON") element = new _elements_buttonElement__WEBPACK_IMPORTED_MODULE_18__["default"](this, domElement, layer);else if (domElement.tagName == "TEXTAREA") element = new _elements_inputElement__WEBPACK_IMPORTED_MODULE_17__["default"](this, domElement, layer);else if (domElement.tagName == "INPUT") {
        var type = domElement.getAttribute("type");
        if (type == "checkbox") element = new _elements_checkboxElement__WEBPACK_IMPORTED_MODULE_15__["default"](this, domElement, layer);else if (type == "radio") element = new _elements_radioElement__WEBPACK_IMPORTED_MODULE_16__["default"](this, domElement, layer);else if (["text", "email", "number", "password", "search", "tel", "url"].includes(type)) element = new _elements_inputElement__WEBPACK_IMPORTED_MODULE_17__["default"](this, domElement, layer);else if (["button", "submit", "reset"].includes(type)) {
          element = new _elements_buttonElement__WEBPACK_IMPORTED_MODULE_18__["default"](this, domElement, layer);
        } else return;
      }
      // any other type of element will be container
      else if (domElement.nodeType == Node.ELEMENT_NODE) {
        element = new _elements_containerElement__WEBPACK_IMPORTED_MODULE_11__["default"](this, domElement, layer);
      } else return;
      this.elements.add(element);
      this.aframe.container.appendChild(element.entity);
      if (this.settings.debug) console.log("Added element", element);

      // init element and add element to parent children when aframe entity is loaded(play)
      var onLoaded = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(event) {
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                if (parentElement) parentElement.childElements.add(element);
                element.init();
                element.update();
              case 3:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function onLoaded(_x) {
          return _ref.apply(this, arguments);
        };
      }();
      element.entity.addEventListener("play", onLoaded, {
        once: true
      });
      return element;
    }
  }, {
    key: "removeElement",
    value: function removeElement(element) {
      // remove the element
      this.aframe.container.removeChild(element.entity);
      this.elements["delete"](element);
      // remove all the children of the element recursively
      var _iterator3 = _createForOfIteratorHelper(element.childElements),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var child = _step3.value;
          this.removeElement(child);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    // start at root and interate over child nodes recursively
  }, {
    key: "addElementChildren",
    value: function addElementChildren(currentNode) {
      var _this5 = this;
      var parentElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var layer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return new Promise(function (resolve, reject) {
        if (currentNode.tagName == "svg") _this5.generateStyleDefs(currentNode);

        // If this is a slot element, we're using a web component and need to fetch the child elements using .assignedNodes()
        if (currentNode.tagName == "SLOT") {
          // Note: we don't increase the layer here because slots don't render directly.
          // console.log("*********Slot element found");
          var assignedNodes = currentNode.assignedNodes();
          var promisesToResolve = [];
          var _iterator4 = _createForOfIteratorHelper(assignedNodes),
            _step4;
          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var assignedNode = _step4.value;
              promisesToResolve.push(_this5.addElementChildren(assignedNode, parentElement, layer));
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
          Promise.all(promisesToResolve).then(function () {
            resolve();
          });
        }
        var element = _this5.addElement(currentNode, parentElement, layer);
        // not supported tags or svg element that we dont need to check its children
        if (!element || element instanceof _elements_svgElement__WEBPACK_IMPORTED_MODULE_19__["default"]) return;
        if (currentNode.childNodes && currentNode.childNodes.length > 0) {
          layer++;
          var promisesToResolve = [];
          var _iterator5 = _createForOfIteratorHelper(currentNode.childNodes),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var child = _step5.value;
              promisesToResolve.push(_this5.addElementChildren(child, element, layer));
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
          Promise.all(promisesToResolve).then(function () {
            resolve();
          });
        }
      });
    }
  }, {
    key: "convertToVR",
    value: function convertToVR() {
      var _this6 = this;
      return new Promise(function (resolve, reject) {
        _this6.addElementChildren(_this6.container).then(function () {
          // observer dom element changes and for newly added and deleted dom elements
          _this6.observer = new MutationObserver(function (mutations) {
            var _iterator6 = _createForOfIteratorHelper(mutations),
              _step6;
            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                var mutation = _step6.value;
                console.log("Mutation encountered", mutation);
                var emptyRemove = false;
                var _iterator7 = _createForOfIteratorHelper(mutation.removedNodes),
                  _step7;
                try {
                  for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                    var node = _step7.value;
                    // not empty textNode
                    if (!(node.nodeType == Node.TEXT_NODE && !node.nodeValue.trim())) _this6.removeElement(node.element);else emptyRemove = true;
                  }
                } catch (err) {
                  _iterator7.e(err);
                } finally {
                  _iterator7.f();
                }
                var _iterator8 = _createForOfIteratorHelper(mutation.addedNodes),
                  _step8;
                try {
                  for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                    var _node = _step8.value;
                    _this6.addElementChildren(_node, mutation.target.element, mutation.target.element.layer + 1);
                  }
                } catch (err) {
                  _iterator8.e(err);
                } finally {
                  _iterator8.f();
                }
                if (!emptyRemove) {
                  // when adding new nodes we also need to check for new loaded images
                  if (mutation.addedNodes.length > 0) _this6.allLoadedUpdate();else _this6.update();
                }

                // Listen for text changes and update when they occur.
                if (mutation.type == "characterData") {
                  _this6.update();
                }
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }
          });
          _this6.observer.observe(_this6.container, _this6.observerConfig);

          // We need to add the observer to every slot inside the container as well.
          _this6.container.querySelectorAll("slot").forEach(function (slot) {
            slot.addEventListener("slotchange", function (ev) {
              // console.log("Slot change event", ev);
            });
            _this6.observer.observe(slot, _this6.observerConfig);
          });
          resolve();
        });
      });
    }
  }, {
    key: "update",
    value: function update() {
      var _this7 = this;
      return new Promise(function (resolve, reject) {
        // we check for updating so we dont do multiple updating at same time from the async functions
        _this7.updating = true;
        if (_this7.updating) {
          var _this7$scroll;
          // using try and catch because sometimes when element is removed it calls update after and it wont find element, the errors doesnt matter because the final result is the same
          try {
            var _iterator9 = _createForOfIteratorHelper(_this7.elements),
              _step9;
            try {
              for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                var element = _step9.value;
                element.update();
              }
            } catch (err) {
              _iterator9.e(err);
            } finally {
              _iterator9.f();
            }
          } catch (err) {
            console.error(err);
          }
          (_this7$scroll = _this7.scroll) === null || _this7$scroll === void 0 || _this7$scroll.update();
          _this7.updating = false;
          resolve();
        }
        resolve();
      });
    }
  }]);
}();

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=web2vr.js.map