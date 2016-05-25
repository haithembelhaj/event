/* global fixture, expect, sinon */
'use strict';

var event = require('../src/event');

describe('event specs', function() {

  before(function () {
    fixture.setBase('test');
  });

  beforeEach(function () {
    this.result = fixture.load('fixture.html');
  });

  afterEach(function () {

    fixture.cleanup();
  });

  it('should trigger event', function(done){

    var el = fixture.el.querySelector('button');

    el.addEventListener('blup', function(e){

      expect(e.data).to.equal('blop');
      done();
    });

    event.trigger(el, 'blup', {data: 'blop'});
  });

  it('should add event listener', function(done){

    var el = fixture.el.querySelector('button');

    event.addListener(el, 'click', function(){ done();});

    el.click();
  });

  it('should delegate event', function(done){

    var el = fixture.el.querySelector('div');

    event.addListener(el, 'click', 'button', function(){done();});

    fixture.el.querySelector('button').click();
  });

  it('should remove added event listeners', function(){

    var el = fixture.el.querySelector('button');
    var cb = sinon.spy();

    event.addListener(el, 'click', cb);

    event.removeListeners(el);

    el.click();

    expect(!cb.called);
  });
});
