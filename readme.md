# Basic setup
```
npm install
npm run server
```

# Lint
Eslint@8 is installed and configured in `.eslintrc.json`. 
> When we migrate to eslint@9, we should do a migration for the config with `npx @eslint/migrate-config .eslintrc.json `

To run linter execute:
`npx eslint .`

To fix linter issues:
`npx eslint . --fix`

> Use // eslint-disable-next-line sparingly to bypass rules only when absolutely necessary.

# Start Server
```
npm run serve
```
browse to http://localhost:5173