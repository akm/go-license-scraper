import {chromium} from 'playwright';

process.stdin.resume();
process.stdin.setEncoding('utf8');
let input_string = '';

process.stdin.on('data', chunk => {
  input_string += chunk;
});

process.stdin.on('end', () => {
  const linesText = input_string;
  // console.log(linesText);

  const version0 = /^v0\.0\.0-/;

  (async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const pkgGoDevSelector =
      '[data-test-id=UnitHeader-licenses] [data-test-id=UnitHeader-license]';
    const githubSelector = 'h3:has-text("License") + .mt-3 a';

    try {
      const lines = linesText.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;

        const d = JSON.parse(line);
        const path = d['Path'] as string;
        const version = d['Version'] as string;

        const urls: string[] = [];
        const urlToSelector: {[key: string]: string} = {};

        const add = (url: string, selector: string) => {
          urls.push(url);
          urlToSelector[url] = selector;
        };

        if (!version.match(version0))
          add(`https://pkg.go.dev/${path}@${version}`, pkgGoDevSelector);
        add(`https://pkg.go.dev/${path}`, pkgGoDevSelector);

        if (path.match(/^github\.com\//)) {
          if (!version.match(version0))
            add(`https://${path}/tree/${version}`, githubSelector);
          add(`https://${path}`, githubSelector);
        }

        let success = false;
        const errors: any[] = [];
        for (const url of urls) {
          const selector = urlToSelector[url];
          await page.goto(url);
          await page.waitForLoadState();

          // await page.pause();
          try {
            const lisence = (
              await page.$eval(selector, el => el.textContent)
            )?.trim();
            process.stdout.write(JSON.stringify({path, version, lisence, url}));
            process.stdout.write('\n');
            success = true;
            break;
          } catch (err: any) {
            errors.push(err);
          }
        }
        if (!success && errors.length > 0) {
          process.stderr.write(
            `failed to get license at ${urls.join(',')} because of ${errors}\n`
          );
        }
      }
    } finally {
      await browser.close();
    }
  })();
});
