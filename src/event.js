/**
 * event handling library
 *
 * @author Haithem Bel Haj (hb@dietaikonauten.com)
 */
const hiddenListenersProp = '__listeners__';

/**
 * trigger event
 *
 * @param target
 * @param type
 * @param data
 * @returns {*}
 */
export function trigger(target, type, data) {

  let cEvent;

  if (document.createEvent) {

    cEvent = document.createEvent('Event');
    cEvent.initEvent(type, true, false);

    cEvent = Object.assign(cEvent, data);

    return target.dispatchEvent(cEvent);
  }

  cEvent = document.createEventObject();

  cEvent = Object.assign(cEvent, data);

  return target.fireEvent('on' + type, cEvent);
}

/**
 * add event listner and save a ref in the elem
 *
 * @param el
 * @param event
 * @param listener
 */
export function addListener(el, event, delegate, listener, capture){

  if(typeof delegate === 'function') {

    return _addListener(el, event, delegate, listener);
  }

  return _addListener(el, event, function(e){

    let match = matches(e.target, delegate, el);

    e.delegateTarget = match;

    if(match){

      return listener.apply(match, arguments);
    }
  }, capture);
}

/**
 * helper function
 * @private
 */
function _addListener(el, event, listener, capture) {

  el.addEventListener(event, listener, capture);

  if(!el[hiddenListenersProp])
    el[hiddenListenersProp] = [];

  el[hiddenListenersProp].push({listener, event});
}


/**
 * remove event listner and remove the ref
 *
 * @param el
 * @param event
 * @param listener
 */
export function removeListener(el, event, listener){

  if(!listener){

    el[hiddenListenersProp].filter(l => l.event === event)
      .forEach(({listener})=>{

        return removeListener(el, event, listener);
      });
  }

  el.removeEventListener(event, listener);

  el[hiddenListenersProp] = el[hiddenListenersProp].filter((l)=> l.event !== event && l.listener !== listener);
}

/**
 * remove all listeners
 *
 * @param el
 */
export function removeListeners(el){

  if(!el[hiddenListenersProp]) return;

  el[hiddenListenersProp].forEach(({event, listener})=> removeListener(el, event, listener));
}

//helper function
function matches(el, selector, root) {

  if (el === root)
    return;

  if (_matches(el, selector))
    return el;

  if (el.parentNode)
    return matches(el.parentNode, selector, root);
}

function _matches(el, selector){

  let condidates = (el.document || el.ownerDocument).querySelectorAll(selector);
  let i = condidates.length - 1;

  while (i >= 0 && condidates.item(i) !== el) {

    i -= 1;
  }

  return i > -1;

}