```markdown cheatsheet:``` https://github.com/adam-p/markdown-here/wiki/Markdown-Here-Cheatsheet

```original post for the boilerplate:```
https://paulintrognon.fr/blog/typescript-prettier-eslint-next-js


# Start a clean Next.js project with TypeScript, ESLint and Prettier from scratch
Last updated: November 7, 2020, 1:21 AM

TypeScript is awesome. So is Prettier.

In this post, I will show you how to create a clean Next.js app with TypeScript from scratch, and how to configure ESLint to make it work with prettier, and finally how to integrate this tooling with Visual Studio Code.

Let's do it!

Note: you can have a look at the end result here: github.com/paulintrognon/next-typescript

Note: we will use yarn instead of npm throughout this post.

## Initiating the project
We will start from scratch with an empty project, this way you will have a perfect knowledge of how your project is built, which means better control.

Please first create a new project folder, with the following package.json file:
```javascript
// package.json
{
  "name": "your-project-name",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }  
}
```
Run ```git init``` to initiate git, and add a .gitignore file.

Then, let's install next.js and its dependencies, alongside with TypeScript.

## Install Next.js dependencies
```
yarn add next react react-dom
```

## Install TypeScript
``` 
yarn add typescript @types/react @types/node
```

Now, let's create a pages/index.tsx file. I am using getServerSideProps to fetch next SpaceX launch, which I am displaying on the homepage. More info on getServerSideProps here.
```javacript
// pages/index.tsx
import { GetServerSideProps, NextPage } from 'next'

interface Props {
  launch: {
    mission: string
    site: string
    timestamp: number
    rocket: string
  }
}
const IndexPage: NextPage<Props> = ({ launch }) => {
  const date = new Date(launch.timestamp)
  return (
    <main>
      <h1>Next SpaceX Launch: {launch.mission}</h1>
      <p>
        {launch.rocket} will take off from {launch.site} on {date.toDateString()}
      </p>
    </main>
  )
}
export default IndexPage

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const response = await fetch('https://api.spacexdata.com/v3/launches/next')
  const nextLaunch = await response.json()
  return {
    props: {
      launch: {
        mission: nextLaunch.mission_name,
        site: nextLaunch.launch_site.site_name_long,
        timestamp: nextLaunch.launch_date_unix * 1000,
        rocket: nextLaunch.rocket.rocket_name,
      },
    },
  }
}
```
We can now start the server using 

```
yarn dev
```

## Start the dev web server
```
yarn dev
```

Next.js will detect that we are now using TypeScript and will automatically create for us a tsconfig.json and a next-env.d.ts file.

If you are confortable with TypeScript (or if you want the real TypeScript experience, which I highly recommend), change the strict field in the tsconfig.json file from false to true. This will prevent you from not specifying types, and from using any. More info here.

```json
// tsconfig.json => Change "strict" to true 
{
  // ...
  "strict": true,
  // ...
}
```

## Add ESLint
ESLint will make sure we are following all good practices of TypeScript and React.

Let's install ESLint:

## Add ESLint, and a TypeScript parser for Eslint, and a react ESLint plugin
```
yarn add --dev eslint @typescript-eslint/parser  @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

If we break it down:
```
eslint - is the main ESLint package.

@typescript-eslint/parser - will allow ESLint to parse TypeScript files.

@typescript-eslint/eslint-plugin - will add TypeScript specific lint rules.

eslint-plugin-react - will add React specific lint rules.

eslint-plugin-react-hooks - will extend eslint-plugin-react to add React Hooks rules.

eslint-plugin-jsx-a11y - will add accessibility related rules.
```
To enable and configure ESLint, we need to create a .eslintrc.js file.

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: { ecmaVersion: 8 }, // to enable features such as async/await
  ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '!.prettierrc.js'], // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)
  extends: ['eslint:recommended'],
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      settings: { react: { version: 'detect' } },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // TypeScript rules
        'plugin:react/recommended', // React rules
        'plugin:react-hooks/recommended', // React hooks rules
        'plugin:jsx-a11y/recommended', // Accessibility rules
      ],
      rules: {
        // We will use TypeScript's types for component props instead
        'react/prop-types': 'off',

        // No need to import React when using Next.js
        'react/react-in-jsx-scope': 'off',

        // This rule is not compatible with Next.js's <Link /> components
        'jsx-a11y/anchor-is-valid': 'off',

        // Why would you want unused vars?
        '@typescript-eslint/no-unused-vars': ['error'],

        // I suggest this setting for requiring return types on functions only where useful
        '@typescript-eslint/explicit-function-return-type': [
          'warn',
          {
            allowExpressions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          },
        ],
      },
    },
  ],
}
```

If you are using VSCode, I strongly recommend you install the ESLint plugin for VS Code, which will enable you to view ESLint errors directly in your editor.

# Add Prettier
Prettier is a tool that handles code formatting for us, saving us a lot of time.

Let's install Prettier:

## Add Prettier, and the ESLint plugin and config for prettier
```
yarn add --dev prettier eslint-plugin-prettier eslint-config-prettier
```

We now need to configure Prettier by creating a .prettierrc.js

```javascript
// .prettierrc.js
module.exports = {
  // Change your rules accordingly to your coding style preferences.
  // https://prettier.io/docs/en/options.html
  semi: false,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
}
``` 

You do NOT need to install any Prettier plugin to VSCode to make Prettier work. A much better option is to include Prettier rules into ESLint.

Let's edit our .eslintrc.js file to include Prettier:

```javascript
// .eslintrc.js
module.exports = {
  // ...
  overrides: [
    {
      // ...
      extends: [
        // ...
        'prettier/@typescript-eslint', // Prettier plugin
        'plugin:prettier/recommended', // Prettier recommended rules 
      ],
      rules: {
        // ...
        'prettier/prettier': ['error', {}, { usePrettierrc: true }], // Includes .prettierrc.js rules
      },
    },
  ],
}
```

Note:
```
 We could have written the prettier configuration directly in the .eslintrc.js file, but by using a separate prettierrc file, we stay compatible with editors configured with the Prettier plugin.
```

 
To unleash the true powers of ESLint and Prettier, we can configure VS Code so that it auto-corrects ESLint errors.
You should tell VS Code not to formatOnSave, but instead fix ESLint errors on save.

```json 
// .vscode/settings.json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
If you open pages/index.tsx, you may see ESLint errors. Try saving the file: you will see all those errors corrected automatically. I can't tell you enough how much time this will save.


# Adding TailwindCSS 

https://dev.to/notrab/get-up-and-running-with-tailwind-css-and-next-js-3a73

# Adding stylelint

https://www.meidev.co/blog/visual-studio-code-css-linting-with-tailwind/