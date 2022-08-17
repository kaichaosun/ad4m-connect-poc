import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {AppInfo, Capabilities} from './capability';

/**
 * An element to connect with ad4m.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot for your own markup
 * @csspart button - The button
 */
@customElement('ad4m-connect')
export class Ad4mConnect extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World';

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number})
  count = 0;

  /**
   * The ad4m GraphQL endpoint.
   */
  @property()
  endpoint = 'ws://localhost:12000/graphql';

  /**
   * The app's information will be shown to users when requesting access to ad4m.
   */
  @property({type: Object})
  appInfo = {
    name: 'demo',
    description: 'demo',
    url: 'https://ad4m.dev',
  } as AppInfo;

  /**
   * The capabilities needed to use the app.
   */
  @property({type: Array})
  capabilities = [] as Capabilities;

  override render() {
    return html`
      <h1>${this.sayHello(this.name)}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>

      <slot></slot>
    `;
  }

  private _onClick() {
    this.count++;
    this.dispatchEvent(new CustomEvent('count-changed'));
  }

  /**
   * Formats a greeting
   * @param name The name to say "Hello" to
   */
  sayHello(name: string): string {
    return `Hello, ${name}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ad4m-connect': Ad4mConnect;
  }
}
