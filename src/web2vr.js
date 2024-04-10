import "./plugins/eventListenerListPlugin"; // Get all event listeners for DOM elements
import Deepmerge from "deepmerge";
import "aframe";

// import "aframe-gif-shader";
import "./plugins/aframe-keyboard.min";
import "super-hands";
import Settings from "./settings";
import "./components/border";
import "./components/animate";
import "./components/grabRotateStatic";
import Scroll from "./scroll"
import AframeContext from "./aframeContext";
import ContainerElement from "./elements/containerElement";
import TextElement from "./elements/textElement";
import ImageElement from "./elements/imageElement";
import VideoElement from "./elements/videoElement";
import CheckBoxElement from "./elements/checkboxElement";
import RadioElement from "./elements/radioElement";
import InputElement from "./elements/inputElement";
import ButtonElement from "./elements/buttonElement";
import SvgElement from "./elements/svgElement";
import CanvasElement from "./elements/canvasElement";

export default class Web2VR {
    constructor(container, settings = {}) {
        // main div container
        if (container.nodeType == Node.ELEMENT_NODE)
            this.container = container;
        else
            this.container = document.querySelector(container);

        // deep merge settings
        this.settings = Deepmerge(new Settings(), settings, {
            arrayMerge: (destination, source) => {
                return [...destination, ...source];
            }
        });

        // aframe context
        this.aframe = new AframeContext(this.settings);
        // vr elements
        this.elements = new Set();
        // set of all the hover css selectors
        this.hoverSelectors = new Set();
        this.observer = null;
        // observer parametars
        this.observerConfig = { childList: true, subtree: true, characterData: true, attributes: true };//attributeFilter: ["style", "class", "id"]
        this.updating = false;

        // experimental only
        this.html2canvasIDcounter = 0;
    }

    // find all hover css rules and add {selector}hover class to them
    findHoverCss() {
        try {
            for (const styleSheet of [...document.styleSheets]) {
                for (const rule of [...styleSheet.cssRules]) {
                    if (rule instanceof CSSStyleRule) {
                        const selectors = rule.selectorText.split(",");
                        for (const selector of selectors) {
                            const sel = selector.split(":");
                            // is hover
                            if (sel[1] == "hover") {
                                const s = sel[0].replace(/\s/g, '');
                                if (s[0] == ".")
                                    rule.selectorText += `, ${s}hover`;
                                else if (s[0] == "#")
                                    rule.selectorText += `, .${s.substr(1)}hover`;
                                else
                                    rule.selectorText += `, .${s}hover`;
                                this.hoverSelectors.add(s);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    // add all svg needed styles to defs inside svg so we can convert svg to png with all styles applied 
    generateStyleDefs(svgDomElement) {
        let styleDefs = "";
        const sheets = document.styleSheets;
        for (let i = 0; i < sheets.length; i++) {
            const rules = sheets[i].cssRules;
            for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                if (rule.style) {
                    const selectorText = rule.selectorText;
                    const elems = svgDomElement.querySelectorAll(selectorText);
                    if (elems.length) {
                        styleDefs += selectorText + " { " + rule.style.cssText + " }\n";
                    }
                }
            }
        }

        const s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        s.innerHTML = styleDefs;

        const defs = document.createElement('defs');
        defs.appendChild(s);
        svgDomElement.insertBefore(defs, svgDomElement.firstChild);
    }

    start() {
        // Return a promise that will resolve when the VR elements are added / scene is loaded.
        return new Promise((resolve, reject) => {
            this.findHoverCss();

            if (!this.aframe.scene.hasLoaded) {
                this.aframe.scene.addEventListener("loaded", 
                (function(resolve, init, context) { 
                    init.call(context);
                    resolve();
                })(resolve, this.init, this), { once: true });
            } else
                this.init().then(() => {
                    resolve();
            })
        });
    }

    init() {
        this.aframe.createContainer(this);
        this.aframe.createSky();
        this.aframe.createControllers();
        // scroll feature

        return this.convertToVR()
        .then(() => {
            this.scroll = new Scroll(this);
            return this.allLoadedUpdate();
        }).then(() => {
            return this.update();
        })
    }

    // update once after all images are loaded in the dom
    allLoadedUpdate() {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                let allLoaded = true;
                for (const element of this.elements)
                    if (element instanceof ImageElement && !element.loaded)
                        allLoaded = false;
                if (allLoaded) {
                    resolve();
                    clearInterval(interval);
                }
            }, 100);    
        });
    }

    addElement(domElement, parentElement, layer) {
        // ignore tag if in ignoreTags list or text element(vr-span) is already added
        if (this.settings.ignoreTags.includes(domElement.tagName) || (domElement.classList && domElement.classList.contains("vr-span")))
            return null;

        let element = null;
        // its text node and not empty
        if (domElement.nodeType == Node.TEXT_NODE && domElement.nodeValue.trim()) {
            const span = document.createElement("span");
            span.classList.add("vr-span");
            span.textContent = domElement.textContent;

            // dont want observer to listen changes when adding(replacing) span text into dom
            if (this.observer)
                this.observer.disconnect();
            domElement.replaceWith(span);
            if (this.observer) {
                this.observer.observe(this.container, this.observerConfig);
                // We need to add the observer to every slot inside the container as well.
                this.container.querySelectorAll("slot").forEach((slot) => {
                    this.observer.observe(slot, this.observerConfig);
                });
            }

            element = new TextElement(this, span, layer);
        }
        // for future convert this to switch statement
        else if (domElement.tagName == "VIDEO")
            element = new VideoElement(this, domElement, layer);
        else if (domElement.tagName == "IMG")
            element = new ImageElement(this, domElement, layer);
        else if (domElement.tagName == "svg")
            element = new SvgElement(this, domElement, layer);
        else if (domElement.tagName == "CANVAS")
            element = new CanvasElement(this, domElement, layer);
        else if (domElement.tagName == "BUTTON")
            element = new ButtonElement(this, domElement, layer);
        else if (domElement.tagName == "TEXTAREA")
            element = new InputElement(this, domElement, layer);
        else if (domElement.tagName == "INPUT") {
            const type = domElement.getAttribute("type");
            if (type == "checkbox")
                element = new CheckBoxElement(this, domElement, layer);
            else if (type == "radio")
                element = new RadioElement(this, domElement, layer);
            else if (["text", "email", "number", "password", "search", "tel", "url"].includes(type))
                element = new InputElement(this, domElement, layer);
            else if (["button", "submit", "reset"].includes(type)) {
                element = new ButtonElement(this, domElement, layer);
            }
            else
                return;
        }
        // any other type of element will be container
        else if (domElement.nodeType == Node.ELEMENT_NODE) {
            element = new ContainerElement(this, domElement, layer);
        }
        else
            return;

        this.elements.add(element);
        this.aframe.container.appendChild(element.entity);

        if (this.settings.debug)
            console.log("Added element", element);

        // init element and add element to parent children when aframe entity is loaded(play)
        const onLoaded = async (event) => {
            if (parentElement)
                parentElement.childElements.add(element);
            element.init();
            element.update();
        };
        element.entity.addEventListener("play", onLoaded, { once: true });

        return element;
    }

    removeElement(element) {
        // remove the element
        this.aframe.container.removeChild(element.entity);
        this.elements.delete(element);
        // remove all the children of the element recursively
        for (const child of element.childElements) {
            this.removeElement(child);
        }
    }

    // start at root and interate over child nodes recursively
    addElementChildren(currentNode, parentElement = null, layer = 0) {
        return new Promise((resolve, reject) => {
            if (currentNode.tagName == "svg")
            this.generateStyleDefs(currentNode);
        
            // If this is a slot element, we're using a web component and need to fetch the child elements using .assignedNodes()
            if (currentNode.tagName == "SLOT") {
                // Note: we don't increase the layer here because slots don't render directly.
                // console.log("*********Slot element found");
                const assignedNodes = currentNode.assignedNodes();
                var promisesToResolve = [];
                for (const assignedNode of assignedNodes) {
                    promisesToResolve.push(this.addElementChildren(assignedNode, parentElement, layer));
                }
                Promise.all(promisesToResolve).then(() => {
                    resolve();
                })
            }

            const element = this.addElement(currentNode, parentElement, layer);
            // not supported tags or svg element that we dont need to check its children
            if (!element || element instanceof SvgElement)
                return;

            if (currentNode.childNodes && currentNode.childNodes.length > 0) {
                layer++;
                var promisesToResolve = [];
                for (const child of currentNode.childNodes)
                    promisesToResolve.push(this.addElementChildren(child, element, layer));
                Promise.all(promisesToResolve).then(() => {
                    resolve();
                })
            }
        })
    }

    convertToVR() {
        return new Promise((resolve, reject) => {
            this.addElementChildren(this.container)
            .then(() => {
                // observer dom element changes and for newly added and deleted dom elements
                this.observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        console.log("Mutation encountered", mutation);
                        let emptyRemove = false;
                        for (const node of mutation.removedNodes) {
                            // not empty textNode
                            if (!(node.nodeType == Node.TEXT_NODE && !node.nodeValue.trim()))
                                this.removeElement(node.element);
                            else
                                emptyRemove = true;
                        }
        
                        for (const node of mutation.addedNodes)
                            this.addElementChildren(node, mutation.target.element, mutation.target.element.layer + 1);
        
                        if (!emptyRemove) {
                            // when adding new nodes we also need to check for new loaded images
                            if (mutation.addedNodes.length > 0)
                                this.allLoadedUpdate();
                            else
                                this.update();
                        }
        
                        // Listen for text changes and update when they occur.
                        if (mutation.type == "characterData") {
                            this.update();
                        }
                    }
                });
                this.observer.observe(this.container, this.observerConfig);
        
                // We need to add the observer to every slot inside the container as well.
                this.container.querySelectorAll("slot").forEach((slot) => {
                    slot.addEventListener("slotchange", (ev) => {
                        // console.log("Slot change event", ev);
                    });
                    this.observer.observe(slot, this.observerConfig);
                });
                resolve();
            })
        })
    }


    update() {
        return new Promise((resolve, reject) => {
            // we check for updating so we dont do multiple updating at same time from the async functions
            this.updating = true;
            if (this.updating) {
                // using try and catch because sometimes when element is removed it calls update after and it wont find element, the errors doesnt matter because the final result is the same
                try {
                    for (const element of this.elements)
                        element.update();
                }
                catch (err) {
                    console.error(err);
                }
                this.scroll?.update();
                this.updating = false;
                resolve();
            }
            resolve();
        });
    }
}