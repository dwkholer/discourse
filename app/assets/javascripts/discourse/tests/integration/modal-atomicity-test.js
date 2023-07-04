import { module, test } from "qunit";
import { setupRenderingTest } from "discourse/tests/helpers/component-test";
import { render, settled } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import Component from "@glimmer/component";

module("Modal atomicity demo", function (hooks) {
  setupRenderingTest(hooks);

  let events = [];
  hooks.beforeEach(() => (events = []));

  class ModalWithLifecycleHooks extends Component {
    constructor() {
      super(...arguments);
      events.push(`constructor: ${this.args.data}`);
    }

    willDestroy() {
      events.push(`willDestroy: ${this.args.data}`);
    }
  }

  const modalData = {
    component: ModalWithLifecycleHooks,
    data: "testData",
  };

  // Fails
  test("wrapped with #if", async function (assert) {
    await render(hbs`
      {{#if this.activeModal}}
        <this.activeModal.component @data={{this.activeModal.data}} />
      {{/if}}
    `);

    this.set("activeModal", modalData);
    await settled();

    assert.deepEqual(
      events,
      ["constructor: testData"],
      "constructor called with args present"
    );

    this.set("activeModal", null);
    await settled();

    assert.deepEqual(
      events,
      ["constructor: testData", "willDestroy: testData"],
      "willDestroy called with args present"
    );
  });

  // Fails
  test("wrapped with #let", async function (assert) {
    await render(hbs`
      {{#let this.activeModal as |activeModal|}}
        <activeModal.component @data={{activeModal.data}} />
      {{/let}}
    `);

    this.set("activeModal", modalData);
    await settled();

    assert.deepEqual(
      events,
      ["constructor: testData"],
      "constructor called with args present"
    );

    this.set("activeModal", null);
    await settled();

    assert.deepEqual(
      events,
      ["constructor: testData", "willDestroy: testData"],
      "willDestroy called with args present"
    );
  });

  // Passes
  test("wrapped with #each", async function (assert) {
    await render(hbs`
      {{#each (array this.activeModal) as |activeModal|}}
        <activeModal.component @data={{activeModal.data}} />
      {{/each}}
    `);

    this.set("activeModal", modalData);
    await settled();

    assert.deepEqual(
      events,
      ["constructor: testData"],
      "constructor called with args present"
    );

    this.set("activeModal", null);
    await settled();

    assert.deepEqual(
      events,
      ["constructor: testData", "willDestroy: testData"],
      "willDestroy called with args present"
    );
  });
});
