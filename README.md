# Remont backend

## Envs

See `./.env.example`

## Development

Check your `package.json`:

```js
{
  "scripts": {
    // ...
    "develop": "ENV_PATH=/abs-path-to/.env.dev strapi develop",
    // ...
  }
}
```

Start dev mode:

```bash
yarn develop
```
