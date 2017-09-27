"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var Polymer = window.Polymer;
var PolymerDomAdapter = (function (_super) {
    __extends(PolymerDomAdapter, _super);
    function PolymerDomAdapter() {
        return _super.apply(this, arguments) || this;
    }
    PolymerDomAdapter.prototype.createStyleElement = function (css, doc) {
        if (doc === void 0) { doc = document; }
        var style = doc.createElement.call(doc, 'style', 'custom-style');
        this.appendChild(style, this.createTextNode(css));
        return style;
    };
    return PolymerDomAdapter;
}(platform_browser_1.__platform_browser_private__.BrowserDomAdapter));
var PolymerShadyDomAdapter = (function (_super) {
    __extends(PolymerShadyDomAdapter, _super);
    function PolymerShadyDomAdapter() {
        return _super.apply(this, arguments) || this;
    }
    PolymerShadyDomAdapter.prototype.parentElement = function (el) { return Polymer.dom(el).parentNode; };
    PolymerShadyDomAdapter.prototype.appendChild = function (el, node) { Polymer.dom(el).appendChild(node); };
    PolymerShadyDomAdapter.prototype.insertBefore = function (el, node) { Polymer.dom(this.parentElement(el)).insertBefore(node, el); };
    PolymerShadyDomAdapter.prototype.insertAllBefore = function (el, nodes) { var elParentDom = Polymer.dom(this.parentElement(el)); nodes.forEach(function (n) { return elParentDom.insertBefore(n, el); }); };
    PolymerShadyDomAdapter.prototype.insertAfter = function (el, node) { this.insertBefore(this.nextSibling(el), node); };
    PolymerShadyDomAdapter.prototype.removeChild = function (el, node) { Polymer.dom(el).removeChild(node); };
    PolymerShadyDomAdapter.prototype.childNodes = function (el) { return Polymer.dom(el).childNodes; };
    PolymerShadyDomAdapter.prototype.remove = function (node) { if (this.parentElement(node)) {
        this.removeChild(this.parentElement(node), node);
    } return node; };
    PolymerShadyDomAdapter.prototype.clearNodes = function (el) { while (Polymer.dom(el).firstChild) {
        Polymer.dom(el).removeChild(Polymer.dom(el).firstChild);
    } };
    PolymerShadyDomAdapter.prototype.firstChild = function (el) { return Polymer.dom(el).firstChild; };
    PolymerShadyDomAdapter.prototype.lastChild = function (el) { return Polymer.dom(el).lastChild; };
    PolymerShadyDomAdapter.prototype.previousSibling = function (el) { return Polymer.dom(el).previousSibling; };
    PolymerShadyDomAdapter.prototype.nextSibling = function (el) { return Polymer.dom(el).nextSibling; };
    PolymerShadyDomAdapter.prototype.getInnerHTML = function (el) { return Polymer.dom(el).innerHTML; };
    PolymerShadyDomAdapter.prototype.setInnerHTML = function (el, value) { Polymer.dom(el).innerHTML = value; };
    PolymerShadyDomAdapter.prototype.querySelector = function (el, selector) { return Polymer.dom(el).querySelector(selector); };
    PolymerShadyDomAdapter.prototype.querySelectorAll = function (el, selector) { return Polymer.dom(el).querySelectorAll(selector); };
    PolymerShadyDomAdapter.prototype.getDistributedNodes = function (el) { return Polymer.dom(el).getDistributedNodes(); };
    PolymerShadyDomAdapter.prototype.classList = function (el) { return Polymer.dom(el).classList; };
    PolymerShadyDomAdapter.prototype.addClass = function (el, className) { this.classList(el).add(className); };
    PolymerShadyDomAdapter.prototype.removeClass = function (el, className) { this.classList(el).remove(className); };
    PolymerShadyDomAdapter.prototype.hasClass = function (el, className) { return this.classList(el).contains(className); };
    PolymerShadyDomAdapter.prototype.setAttribute = function (el, name, value) { Polymer.dom(el).setAttribute(name, value); };
    PolymerShadyDomAdapter.prototype.removeAttribute = function (el, name) { Polymer.dom(el).removeAttribute(name); };
    return PolymerShadyDomAdapter;
}(PolymerDomAdapter));
if (Polymer.Settings.useShadow) {
    platform_browser_1.__platform_browser_private__.setRootDomAdapter(new PolymerDomAdapter());
}
else {
    platform_browser_1.__platform_browser_private__.setRootDomAdapter(new PolymerShadyDomAdapter());
}
function PolymerElement(name) {
    var propertiesWithNotify = [];
    var arrayAndObjectProperties = [];
    var proto = Object.getPrototypeOf(document.createElement(name));
    if (proto.is !== name) {
        throw new Error("The Polymer element \"" + name + "\" has not been registered. Please check that the element is imported correctly.");
    }
    var isFormElement = Polymer && Polymer.IronFormElementBehavior && proto.behaviors.indexOf(Polymer.IronFormElementBehavior) > -1;
    var isCheckedElement = Polymer && Polymer.IronCheckedElementBehaviorImpl && proto.behaviors.indexOf(Polymer.IronCheckedElementBehaviorImpl) > -1;
    proto.behaviors.forEach(function (behavior) { return configureProperties(behavior.properties); });
    configureProperties(proto.properties);
    function configureProperties(properties) {
        if (properties) {
            Object.getOwnPropertyNames(properties)
                .filter(function (name) { return name.indexOf('_') !== 0; })
                .forEach(function (name) { return configureProperty(name, properties); });
        }
    }
    function configureProperty(name, properties) {
        var info = properties[name];
        if (typeof info === 'function') {
            info = {
                type: info
            };
        }
        if (info.type && !info.readOnly && (info.type === Object || info.type === Array)) {
            arrayAndObjectProperties.push(name);
        }
        if (info && info.notify) {
            propertiesWithNotify.push(name);
        }
    }
    var eventNameForProperty = function (property) { return property + "Change"; };
    var changeEventsAdapterDirective = core_1.Directive({
        selector: name,
        outputs: propertiesWithNotify.map(eventNameForProperty),
        host: propertiesWithNotify.reduce(function (hostBindings, property) {
            hostBindings["(" + Polymer.CaseMap.camelToDashCase(property) + "-changed)"] = "_emitChangeEvent('" + property + "', $event);";
            return hostBindings;
        }, {})
    }).Class({
        constructor: function () {
            var _this = this;
            propertiesWithNotify
                .forEach(function (property) { return _this[eventNameForProperty(property)] = new core_1.EventEmitter(false); });
        },
        _emitChangeEvent: function (property, event) {
            // Event is a notification for a sub-property when `path` exists and the
            // event.detail.value holds a value for a sub-property.
            // For sub-property changes we don't need to explicitly emit events,
            // since all interested parties are bound to the same object and Angular
            // takes care of updating sub-property bindings on changes.
            if (!event.detail.path) {
                this[eventNameForProperty(property)].emit(event.detail.value);
            }
        }
    });
    var validationDirective = core_1.Directive({
        selector: name
    }).Class({
        constructor: [core_1.ElementRef, core_1.Injector, function (el, injector) {
                this._element = el.nativeElement;
                this._injector = injector;
            }],
        ngDoCheck: function () {
            var control = this._injector.get(forms_1.FormControlName, null);
            if (control) {
                this._element.invalid = !control.pristine && !control.valid;
            }
        }
    });
    var formElementDirective = core_1.Directive({
        selector: name,
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useExisting: core_1.forwardRef(function () { return formElementDirective; }),
                multi: true
            }
        ],
        host: (isCheckedElement ? { '(checkedChange)': 'onValueChanged($event)' } : { '(valueChange)': 'onValueChanged($event)' })
    }).Class({
        constructor: [core_1.Renderer, core_1.ElementRef, function (renderer, el) {
                var _this = this;
                this._renderer = renderer;
                this._element = el.nativeElement;
                this._element.addEventListener('blur', function () { return _this.onTouched(); }, true);
            }],
        onChange: function (_) { },
        onTouched: function () { },
        writeValue: function (value) {
            this._renderer.setElementProperty(this._element, (isCheckedElement ? 'checked' : 'value'), value);
        },
        registerOnChange: function (fn) { this.onChange = fn; },
        registerOnTouched: function (fn) { this.onTouched = fn; },
        onValueChanged: function (value) {
            this.onChange(value);
        }
    });
    var notifyForDiffersDirective = core_1.Directive({
        selector: name,
        inputs: arrayAndObjectProperties,
        host: arrayAndObjectProperties.reduce(function (hostBindings, property) {
            hostBindings["(" + Polymer.CaseMap.camelToDashCase(property) + "-changed)"] = "_setValueFromElement('" + property + "', $event);";
            return hostBindings;
        }, {})
    }).Class({
        constructor: [core_1.ElementRef, core_1.IterableDiffers, core_1.KeyValueDiffers, function (el, iterableDiffers, keyValueDiffers) {
                this._element = el.nativeElement;
                this._iterableDiffers = iterableDiffers;
                this._keyValueDiffers = keyValueDiffers;
                this._differs = {};
                this._arrayDiffs = {};
            }],
        ngOnInit: function () {
            var _this = this;
            var elm = this._element;
            // In case the element has a default value and the directive doesn't have any value set for a property,
            // we need to make sure the element value is set to the directive.
            arrayAndObjectProperties.filter(function (property) { return elm[property] && !_this[property]; })
                .forEach(function (property) {
                _this[property] = elm[property];
            });
        },
        _setValueFromElement: function (property, event) {
            // Properties in this directive need to be kept synced manually with the element properties.
            // Don't use event.detail.value here because it might contain changes for a sub-property.
            var target = event.target;
            if (this[property] !== target[property]) {
                this[property] = target[property];
                this._differs[property] = this._createDiffer(this[property]);
            }
        },
        _createDiffer: function (value) {
            var differ = Array.isArray(value) ? this._iterableDiffers.find(value).create(null) : this._keyValueDiffers.find(value || {}).create(null);
            // initial diff with the current value to make sure the differ is synced
            // and doesn't report any outdated changes on the next ngDoCheck call.
            differ.diff(value);
            return differ;
        },
        _handleArrayDiffs: function (property, diff) {
            var _this = this;
            if (diff) {
                diff.forEachRemovedItem(function (item) { return _this._notifyArray(property, item.previousIndex); });
                diff.forEachAddedItem(function (item) { return _this._notifyArray(property, item.currentIndex); });
                diff.forEachMovedItem(function (item) { return _this._notifyArray(property, item.currentIndex); });
            }
        },
        _handleObjectDiffs: function (property, diff) {
            var _this = this;
            if (diff) {
                var notify = function (item) { return _this._notifyPath(property + '.' + item.key, item.currentValue); };
                diff.forEachRemovedItem(notify);
                diff.forEachAddedItem(notify);
                diff.forEachChangedItem(notify);
            }
        },
        _notifyArray: function (property, index) {
            this._notifyPath(property + '.' + index, this[property][index]);
        },
        _notifyPath: function (path, value) {
            this._element.notifyPath(path, value);
        },
        ngDoCheck: function () {
            var _this = this;
            arrayAndObjectProperties.forEach(function (property) {
                var elm = _this._element;
                var _differs = _this._differs;
                if (elm[property] !== _this[property]) {
                    elm[property] = _this[property];
                    _differs[property] = _this._createDiffer(_this[property]);
                }
                else if (_differs[property]) {
                    // TODO: these differs won't pickup any changes in need properties like items[0].foo
                    var diff = _differs[property].diff(_this[property]);
                    if (diff instanceof core_1.DefaultIterableDiffer) {
                        _this._handleArrayDiffs(property, diff);
                    }
                    else {
                        _this._handleObjectDiffs(property, diff);
                    }
                }
            });
        }
    });
    var reloadConfigurationDirective = core_1.Directive({
        selector: name
    }).Class({
        constructor: [core_1.ElementRef, core_1.NgZone, function (el, zone) {
                el.nativeElement.async(function () {
                    if (el.nativeElement.isInitialized()) {
                        // Reload outside of Angular to prevent unnecessary ngDoCheck calls
                        zone.runOutsideAngular(function () {
                            el.nativeElement.reloadConfiguration();
                        });
                    }
                });
            }],
    });
    var directives = [changeEventsAdapterDirective, notifyForDiffersDirective];
    if (isFormElement) {
        directives.push(formElementDirective);
        directives.push(validationDirective);
    }
    // If the element has isInitialized and reloadConfiguration methods (e.g., Charts)
    if (typeof proto.isInitialized === 'function' &&
        typeof proto.reloadConfiguration === 'function') {
        directives.push(reloadConfigurationDirective);
    }
    return directives;
}
exports.PolymerElement = PolymerElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seW1lci1lbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicG9seW1lci1lbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNDQVd1QjtBQUN2Qix3Q0FBb0U7QUFFcEUsOERBQXlFO0FBRXpFLElBQU0sT0FBTyxHQUFhLE1BQU8sQ0FBQyxPQUFPLENBQUM7QUFFMUM7SUFBZ0MscUNBQThDO0lBQTlFOztJQU1BLENBQUM7SUFMQyw4Q0FBa0IsR0FBbEIsVUFBbUIsR0FBTyxFQUFFLEdBQXVCO1FBQXZCLG9CQUFBLEVBQUEsY0FBdUI7UUFDakQsSUFBSSxLQUFLLEdBQU8sR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFORCxDQUFnQywrQ0FBNEIsQ0FBQyxpQkFBaUIsR0FNN0U7QUFFRDtJQUFxQywwQ0FBaUI7SUFBdEQ7O0lBZ0NBLENBQUM7SUEvQkMsOENBQWEsR0FBYixVQUFjLEVBQUUsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBRXhELDRDQUFXLEdBQVgsVUFBWSxFQUFFLEVBQUUsSUFBSSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RCw2Q0FBWSxHQUFaLFVBQWEsRUFBRSxFQUFFLElBQUksSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZ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