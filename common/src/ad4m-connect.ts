import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {AppInfo, Capabilities} from './capability';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {createClient} from 'graphql-ws';
import {ApolloClient, InMemoryCache} from '@apollo/client/core';
import {Ad4mClient} from '@perspect3vism/ad4m';

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
   * The ad4m GraphQL endpoint.
   */
  @property()
  endpoint = 'ws://localhost:12000/graphql';

  /**
   * The app's information will be shown to users when requesting access to ad4m.
   */
  @property({type: Object})
  app = {
    name: 'demo',
    description: 'demo',
    url: 'https://ad4m.dev',
  } as AppInfo;

  /**
   * The capabilities needed to use the app.
   */
  @property({type: Array})
  capabilities = [] as Capabilities;

  @state()
  private requestId = '';

  @state()
  private secretCode = '';

  override render() {
    return html`
      <h1>AD4M Connect</h1>
      <span>Security Code:</span>
      <input @change=${(e) => (this.secretCode = e.target.value)} />
      <button @click=${this.generateJwt} part="button">Confirm</button>

      <slot></slot>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    console.log("app info: ", this.app);
    console.log("exec endpoint: ", this.endpoint);
    this.requestCapability();
  }

  buildClient(uri: string, authorization?: string) {
    const wsLink = new GraphQLWsLink(
      createClient({
        url: uri,
        connectionParams: () => {
          return {
            headers: {authorization},
          };
        },
      })
    );
    let apolloClient = new ApolloClient({
      link: wsLink,
      cache: new InMemoryCache({resultCaching: false, addTypename: false}),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
        },
        query: {
          fetchPolicy: 'no-cache',
        },
      },
    });

    return new Ad4mClient(apolloClient);
  }

  async requestCapability() {
    try {
      let ad4mClientWithoutJwt = this.buildClient(this.endpoint, '');
      console.log('start to request capability');
      const requestId = await ad4mClientWithoutJwt.agent.requestCapability(
        this.app.name,
        this.app.description,
        this.app.url,
        JSON.stringify(this.capabilities)
      );
      this.requestId = requestId;
      console.log('auth request id: ', requestId);
    } catch (err) {
      console.log(err);
    }
  }

  async generateJwt() {
    try {
      let ad4mClientWithoutJwt = this.buildClient(this.endpoint, '');
      console.log('start to generate JWT');
      let jwt = await ad4mClientWithoutJwt.agent.generateJwt(
        this.requestId,
        this.secretCode
      );
      console.log('auth jwt: ', jwt);
      const event = new CustomEvent<JwtReceivedEvent>('jwtReceivedEvent', {
        detail: {
          jwt,
          client: this.buildClient(this.endpoint, jwt),
        },
      });
      this.dispatchEvent(event);
    } catch (err) {
      console.log(err);
    }
  }
}

export interface JwtReceivedEvent {
  jwt: string;
  client: Ad4mClient;
}

declare global {
  interface HTMLElementTagNameMap {
    'ad4m-connect': Ad4mConnect;
  }
}
