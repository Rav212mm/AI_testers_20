# Test Automation training from jaktestowac.pl

This is a Test Automation project based on `Playwright` and `TypeScript`. The tested page is a simple demo of a bank.

## Links

- course https://jaktestowac.pl/course/playwright-wprowadzenie/
- test site https://demo-bank.vercel.app/  
  if link is broken check https://jaktestowac.pl/lesson/pw1s01l01/
- code repository https://github.com/jaktestowac/playwright_automatyzacja_wprowadzenie

## Commands

- check `NodeJS` version  
  `node -v`
- new project with Playwright  
  `npm init playwright@latest`
- record tests for given site  
  `npx playwright codegen https://demo-bank.vercel.app/`
- run tests without browser GUI  
  `npx playwright test`
- run tests with browser GUI  
  `npx playwright test --headed`
- view report  
  `npx playwright show-report`
- run Trace Viewer on zip file  
  `npx playwright show-trace trace.zip`

### Running tests by tag

- smoke tests only  
  `npm run test:smoke`
- regression tests only  
  `npm run test:regression`
- single module  
  `npm run test:auth` / `npm run test:dashboard` / `npm run test:payments`
- all money-related tests (dashboard + payments)  
  `npm run test:money`
- negative scenarios only  
  `npm run test:negative`
- list tests with no browser  
  `npm run test:list`
- open the HTML report  
  `npm run report`

Every script is a plain `npx playwright test --grep ...` under the hood, so any
tag can be combined by hand, see [Test tags](#test-tags).

## Test tags

Tags are declared with the native Playwright `tag` option, not written into the
test title. In the HTML report they are shown as clickable chips next to the
test name, so the report can be filtered without a single click in the terminal.

```typescript
// one tag for a whole group
test.describe('User login to Demobank', { tag: '@auth' }, () => {
  // several tags for a single test
  test(
    'should log in with correct credentials and show the user name',
    { tag: ['@smoke', '@positive'] },
    async ({ loginPage }) => {
      //your code
    },
  );
});
```

### Dimensions

Every test gets exactly one tag from each of the first three dimensions. The
auxiliary dimension is optional.

| Dimension | Tags          | Meaning                                                   |
| --------- | ------------- | --------------------------------------------------------- |
| module    | `@auth`       | login / logout / session                                  |
|           | `@dashboard`  | balance, quick transfers, phone top-ups                   |
|           | `@payments`   | bank transfers and payment CRUD                           |
| priority  | `@smoke`      | happy path, must pass on every run                        |
|           | `@regression` | validation and edge cases, run before a release           |
|           | `@wip`        | work in progress, excluded from CI                        |
| scenario  | `@positive`   | valid data, expected to succeed                           |
|           | `@negative`   | invalid data, expected to be rejected                     |
| auxiliary | `@balance`    | test asserts the account balance                          |
|           | `@slow`       | test needs a longer timeout (Demobank cold start)         |
|           | `@infra-risk` | test is flaky because of the app, not the code (HTTP 429) |

### Current matrix

| Test                                          | Tags                                              |
| --------------------------------------------- | ------------------------------------------------- |
| login with correct credentials                | `@auth @smoke @positive`                          |
| login with user id shorter than 8 characters  | `@auth @regression @negative`                     |
| login with password shorter than 8 characters | `@auth @regression @negative`                     |
| quick transfer with balance check             | `@dashboard @smoke @positive @balance @slow`      |
| phone top-up with balance check               | `@dashboard @regression @positive @balance @slow` |
| bank transfer with correct data               | `@payments @smoke @positive @slow`                |

### Filtering

```bash
# one tag
npx playwright test --grep @smoke

# OR - smoke or regression
npx playwright test --grep "@smoke|@regression"

# AND - repeated flags are combined
npx playwright test --grep @smoke --grep @auth

# NOT - exclude
npx playwright test --grep @smoke --grep-invert @slow
```

`--list` shows what a filter selects before anything is run:

```bash
npx playwright test --grep @smoke --list
```

### Rules to keep the report readable

- one tag per dimension - never `@smoke` and `@regression` on the same test
- lowercase, no spaces, one word after `@` (`@auth`, not `@Auth` or `@login_page`)
- a new spec file gets its module tag on the `test.describe`, not on every test
- `@wip` is temporary and must be removed once the test is stable
- do not put tags into the test title - they would duplicate the chips and make
  the titles longer

### Updating Playwright

- check if Playwright should be updated  
  `npm outdated @playwright/test`
- update Playwright  
  `npm i @playwright/test`
- update browsers  
  `npx playwright install`
- verify Playwright version  
  `npx @playwright/test --version`

## Visual Studio Code

### Functions

- Preview: for README.md
- Autosave: in File -> Auto Save
- Timeline: file context menu -> Open Timeline
- Formatting: editor -> context menu -> Format Document
- Searching: editor -> <kbd>CTRL</kbd> + <kbd>F</kbd>
- Accept hint in editor: <kbd>Enter</kbd>
- Comment/Uncomment: <kbd>Ctrl</kbd> + <kbd>/</kbd>
- Duplicate line: <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↑</kbd>
- Use more than one terminal: <kbd>+</kbd> button in TERMINAL
- Cancelling Node process: hit twice <kbd>Ctrl</kbd> + <kbd>C</kbd>
- Extract to variable: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd>
- Move line i.e. up: <kbd>Alt</kbd> + <kbd>↑</kbd>
- Show autocomplete suggestion: <kbd>Ctrl</kbd> + <kbd>Spacebar</kbd>
- Creating a new variable: Refactor <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> -> Extract to constant in enclosing scope

## Extensions

- GitLens - view details of your repository i.e. commits history
- Prettier - default formatter for editor

## Playwright

### Playwright Config modifications

- config file `playwright.config.ts`
- disable browsers, i.e. Firefox
  ```javascript
  // {
  //   name: 'firefox',
  //   use: {
  //     ...devices['Desktop Firefox'],
  //   },
  // },
  ```
- enable video on fail
  ```javascript
  use: {
      video: {'retain-on-failure'},
  },
  ```
- enable Trace Viewer on fail
  ```javascript
  use: {
      trace: {'retain-on-failure'},
  },
  ```
- enable Trace Viewer for every test (also the passing ones)
  ```javascript
  use: {
      trace: 'on',
  },
  ```
  Every test then has a trace attached to the HTML report, so it can be opened
  from the report or with `npx playwright show-trace test-results\<test-name>\trace.zip`.

### Playwright snippets

- import:
  ```typescript
  import { test, expect } from '@playwright/test';
  ```
- test:
  ```typescript
  test('test description', async ({ page }) => {
    //your code
  });
  ```
- describe:
  ```typescript
  test.describe('Group description', () => {
    //your code
  });
  ```
- running given test: `test.only`

### Locators

- `getByTestId` i.e. `getByTestId('login-input')` for element with `data-testid="login-input"`
- `getByRole` i.e. `getByRole('button', { name: 'wykonaj' })`
- `locator` i.e. `locator('#some-id')` (with `css` selector) for element with attribute `id="some-id"`

## Other

### Chrome

- use English version!
- open DevTools <kbd>F12</kbd> or right click `Inspect`
- get selector: right click on element -> Copy -> Copy selector
- testing CSS selectors in Console: `$$('selector')`

### Prettier

- install Prettier  
  `npm install --save-dev --save-exact prettier`
- configure Prettier

  - exlude files in `.prettierignore`

    ```
    package-lock.json
    playwright-report
    test-results

    ```

  - set rules in `.prettierrc.json`
    ```
    {
        "singleQuote": true
    }
    ```

- run Prettier  
  `npx prettier --write .`
- additionaly you can install VSC extension: **Prettier**
