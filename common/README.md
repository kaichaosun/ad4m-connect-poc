# AD4M Connect Web Component

## Usage

Install AD4M Connect from npm,

```shell
npm install ad4m-connect-common
```
### HTML

You need to include the bundled file as a script,

```html
<script type="module" src="../dist/ad4m-connect.bundled.js"></script>
```

Then use the custom element,

```html
<body>
  <ad4m-connect
    app='{"name":"kaichaoapp","description":"test app","url":"my-url"}'
    endpoint="ws://localhost:12000/graphql"
    capabilities='[{"with":{"domain":"*","pointers":["*"]},"can":["*"]}]'
  />
</body>
```

[Example](https://github.com/kaichaosun/ad4m-connect-poc/blob/main/common/dev/index.html)

### Vue

1. Config vite by following the doc [Vue and Web Components](https://vuejs.org/guide/extras/web-components.html), adding one line of code `tag === "ad4m-connect"`,

```typescript
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return (
              tag === "ad4m-connect"
            );
          },
        },
      },
    }),
    vueJsx(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

2. Import `ad4m-connect-common` in the app root `main.ts` or `app.ts`,

```typescript
import "ad4m-connect-common";
```

Use the custom tag `ad4m-connect` wherever you want,

```typescript
<ad4m-connect
  .app='{"name":"testapp","description":"test app","url":"my-url"}'
  endpoint="ws://localhost:12000/graphql"
  .capabilities='[{"with":{"domain":"*","pointers":["*"]},"can":["*"]}]'
/>
```

