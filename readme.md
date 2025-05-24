# Installation
`npm install`

# Lint
Eslint@8 is installed and configured in `.eslintrc.json`. 
> When we migrate to eslint@9, we should do a migration for the config with `npx @eslint/migrate-config .eslintrc.json `

To run linter execute:
`npx eslint .`

To fix linter issues:
`npx eslint . --fix`

> Use // eslint-disable-next-line sparingly to bypass rules only when absolutely necessary.


# Serve
```
npx vite
```
browse to http://localhost:5173