
[1m[44m DEV [49m[22m [34mv4.0.5 [39m[90m/workspaces/boats[39m

[90mstderr[2m | tests/browser/editboatwizard.test.jsx[2m > [22m[2mEditBoatWizard component tests[2m > [22m[2mrender form with permission to sell
[22m[39mThe editor is disabled because the license key provided is invalid [verify_certificate_chain_not_trusted]. Read more: https://www.tiny.cloud/docs/tinymce/latest/license-key/
[90mstderr[2m | tests/browser/editboatwizard.test.jsx[2m > [22m[2mEditBoatWizard component tests[2m > [22m[2mrender form with permission to sell
[22m[39mThe editor is disabled because the license key provided is invalid [verify_certificate_chain_not_trusted]. Read more: https://www.tiny.cloud/docs/tinymce/latest/license-key/
 [32m✓[39m [30m[42m browser (chromium) [49m[39m tests/browser/editboatwizard.test.jsx [2m([22m[2m2 tests[22m[2m)[22m[33m 7248[2mms[22m[39m
     [33m[2m✓[22m[39m render form with no permission to sell [33m 3514[2mms[22m[39m
     [33m[2m✓[22m[39m render form with permission to sell [33m 3733[2mms[22m[39m
 [31m❯[39m [30m[42m browser (chromium) [49m[39m tests/browser/dialog.test.jsx [2m([22m[2m3 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[33m 480[2mms[22m[39m
     [32m✓[39m dummy test rendering[32m 188[2mms[22m[39m
[31m     [31m×[31m dummy test rendering[39m[32m 161[2mms[22m[39m
     [32m✓[39m dummy test rendering[32m 132[2mms[22m[39m
 [31m❯[39m [30m[42m browser (chromium) [49m[39m tests/browser/browseboats.test.jsx [2m([22m[2m1 test[22m[2m | [22m[31m1 failed[39m[2m)[22m[32m 86[2mms[22m[39m
[31m   [31m×[31m renders learn react link[39m[32m 85[2mms[22m[39m
[2m10:03:50 AM[22m [31m[1m[vite][22m[39m Internal server error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.
  Plugin: vite:import-analysis
  File: /workspaces/boats/tests/browser/boatcard.test.js:14:13
  12 |          boat={{ oga_no: 1, previous_names: [] }}
  13 |        />
  14 |      </Router>
     |               ^
  15 |    );
  16 |    expect(screen.getByRole('progressbar')).toBeInTheDocument();
      at TransformPluginContext._formatLog (file:///workspaces/boats/node_modules/vite/dist/node/chunks/dep-B0GuR2De.js:31105:43)
      at TransformPluginContext.error (file:///workspaces/boats/node_modules/vite/dist/node/chunks/dep-B0GuR2De.js:31102:14)
      at TransformPluginContext.transform (file:///workspaces/boats/node_modules/vite/dist/node/chunks/dep-B0GuR2De.js:29552:10)
      at EnvironmentPluginContainer.transform (file:///workspaces/boats/node_modules/vite/dist/node/chunks/dep-B0GuR2De.js:30904:14)
      at loadAndTransform (file:///workspaces/boats/node_modules/vite/dist/node/chunks/dep-B0GuR2De.js:26042:26)
 [32m✓[39m [30m[42m browser (chromium) [49m[39m tests/browser/searchandfilterboats.test.jsx [2m([22m[2m1 test[22m[2m)[22m[32m 173[2mms[22m[39m
 [32m✓[39m [30m[42m browser (chromium) [49m[39m tests/browser/HelloWorld.test.jsx [2m([22m[2m1 test[22m[2m)[22m[32m 8[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Suites 2 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m [30m[42m browser (chromium) [49m[39m tests/browser/boatcard.test.js[2m [ tests/browser/boatcard.test.js ][22m
[31m[1mError[22m: Failed to import test file /workspaces/boats/tests/browser/boatcard.test.js[39m
[31m[1mCaused by: TypeError[22m: Failed to fetch dynamically imported module: http://localhost:63315/workspaces/boats/tests/browser/boatcard.test.js?import&browserv=1761818630487[39m
[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯[22m[39m

[41m[1m FAIL [22m[49m [30m[42m browser (chromium) [49m[39m tests/browser/boatcards.test.js[2m [ tests/browser/boatcards.test.js ][22m
[31m[1mError[22m: Failed to import test file /workspaces/boats/tests/browser/boatcards.test.js[39m
[31m[1mCaused by: SyntaxError[22m: Unexpected token '<'[39m
[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯[22m[39m


[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 2 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m [30m[42m browser (chromium) [49m[39m tests/browser/browseboats.test.jsx[2m > [22mrenders learn react link
[31m[1mReferenceError[22m: Router is not defined[39m

Failure screenshot:
  - [2mtests/browser/__screenshots__/browseboats.test.jsx/renders-learn-react-link-1.png[22m

[36m [2m❯[22m tests/browser/browseboats.test.jsx:[2m8:7[22m[39m
    [90m  6| [39m[34mtest[39m([32m'renders learn react link'[39m[33m,[39m [35masync[39m () [33m=>[39m {
    [90m  7| [39m  [35mconst[39m screen [33m=[39m [35mawait[39m [34mrender[39m(
    [90m  8| [39m      [33m<[39m[33mRouter[39m[33m>[39m
    [90m   | [39m      [31m^[39m
    [90m  9| [39m        <BrowseBoats path='/' state={{filters:{ sale: false },view:{}}…
    [90m 10| [39m      [33m<[39m[33m/[39m[33mRouter[39m[33m>[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯[22m[39m

[41m[1m FAIL [22m[49m [30m[42m browser (chromium) [49m[39m tests/browser/dialog.test.jsx[2m > [22mddf component test[2m > [22mdummy test rendering
[31m[1mTypeError[22m: screen.getByText is not a function[39m

Failure screenshot:
  - [2mtests/browser/__screenshots__/dialog.test.jsx/ddf-component-test-dummy-test-rendering-1.png[22m

[36m [2m❯[22m tests/browser/dialog.test.jsx:[2m75:35[22m[39m
    [90m 73| [39m    [35mconst[39m onSubmit [33m=[39m vi[33m.[39m[34mfn[39m()[33m;[39m
    [90m 74| [39m      [34mrender[39m([33m<[39m[33mForm[39m [33monSubmit[39m[33m=[39m[33m{[39monSubmit[33m}[39m [33m/[39m[33m>[39m)[33m;[39m
    [90m 75| [39m      [35mawait[39m userEvent[33m.[39m[34mclick[39m(screen[33m.[39m[34mgetByText[39m([32m'Submit'[39m))[33m;[39m
    [90m   | [39m                                  [31m^[39m
    [90m 76| [39m    [35mawait[39m [34msleep[39m([34m10[39m)[33m;[39m
    [90m 77| [39m    [34mexpect[39m(onSubmit)[33m.[39m[34mtoBeCalled[39m()[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯[22m[39m


[2m Test Files [22m [1m[31m4 failed[39m[22m[2m | [22m[1m[32m3 passed[39m[22m[90m (7)[39m
[2m      Tests [22m [1m[31m2 failed[39m[22m[2m | [22m[1m[32m6 passed[39m[22m[90m (8)[39m
[2m   Start at [22m 10:03:38
[2m   Duration [22m 12.61s[2m (transform 0ms, setup 0ms, collect 2.27s, tests 8.00s, environment 0ms, prepare 65.21s)[22m

[1m[41m FAIL [49m[22m [31mTests failed. Watching for file changes...[39m
       [2mpress [22m[1mh[22m[2m to show help[22m[2m, [22m[2mpress [22m[1mq[22m[2m to quit[22m
