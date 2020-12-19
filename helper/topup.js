const puppeteer = require("puppeteer");
const USERNAME_SELECTOR = "#user_session_username";
const PASSWORD_SELECTOR = "#user_session_password";
const CTA_SELECTOR = "#new_user_session > button > span";
const fs = require("fs");
const cookiesFilePath = "cookies.json";
const url = "https://www.bukalapak.com/dompet/dana?from=nav_header";
let spanVal;

// let indomaret = '#qa-payment-indomaret > div';
// let alfa = '#qa-payment-alfamart > div';

async function startBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  const previousSession = fs.existsSync(cookiesFilePath);
  if (previousSession) {
    // If file exist load the cookies
    const cookiesString = fs.readFileSync(cookiesFilePath);
    const parsedCookies = JSON.parse(cookiesString);
    if (parsedCookies.length !== 0) {
      for (let cookie of parsedCookies) {
        await page.setCookie(cookie);
      }
      console.log("Session has been loaded in the browser");
    }
  }

  return { browser, page };
}
async function topUp(nominal, metode) {
  const { browser, page } = await startBrowser();
  console.log(37)
  await page.setViewport({ width: 1366, height: 768 });
  console.log(39)
  // await page.setViewport({ width: 0, height: 0 })
  await page.goto(url, {
    waitUntil: "load",
    // Remove the timeout
    timeout: 0
  });
  console.log(45)
  await page.screenshot({ path: "bukalapak.png" });
  let loggin;
  try {
    loggin = await page.waitForSelector(USERNAME_SELECTOR, { timeout: 5000 });
    // ...
  } catch (error) {
    console.log("The element didn't appear.");
  }
  console.log(loggin);
  if (loggin) {
    await page.screenshot({ path: "bukalapak.png" });
    await page.click(USERNAME_SELECTOR);
    await page.screenshot({ path: "bukalapak.png" });
    await page.keyboard.type("aguskusmara128@gmail.com");
    await page.screenshot({ path: "bukalapak.png" });
    await page.click(PASSWORD_SELECTOR);
    await page.screenshot({ path: "bukalapak.png" });
    await page.keyboard.type("21agustus");
    await page.screenshot({ path: "bukalapak.png" });
    await page.click(CTA_SELECTOR);
    await page.screenshot({ path: "bukalapak.png" });
    await page.waitForNavigation();
  }

  //seasion
  const cookiesObject = await page.cookies();
  fs.writeFile(cookiesFilePath, JSON.stringify(cookiesObject), function(err) {
    if (err) {
      console.log("The file could not be written.", err);
    }
    console.log("Session has been successfully saved");
  });

  await page.screenshot({ path: "bukalapak.png" });
  await page.waitForSelector(
    "#js-wallet-page > section > div > div.o-layout__item.u-10of12.u-pad-bottom--4 > div.u-display-table.u-border--1--ash-light.u-width-1 > div.u-display-table-cell.u-6of12.u-bg--sand-light.u-border--right.u-border--sand-dark > div > fragment-loader > div > section > div > div.u-position-relative.c-panel.u-mrgn-bottom--4 > div.c-panel__body.u-pad-bottom--3 > div > div.o-flag__head > div > a"
  );
  await page.click(
    "#js-wallet-page > section > div > div.o-layout__item.u-10of12.u-pad-bottom--4 > div.u-display-table.u-border--1--ash-light.u-width-1 > div.u-display-table-cell.u-6of12.u-bg--sand-light.u-border--right.u-border--sand-dark > div > fragment-loader > div > section > div > div.u-position-relative.c-panel.u-mrgn-bottom--4 > div.c-panel__body.u-pad-bottom--3 > div > div.o-flag__head > div > a"
  );
  console.log("78");
  await page.$(
    "#dana-topup-modal > div > div:nth-child(4) > div.u-mrgn-top--5 > div.c-inp-grp-table.u-mrgn-top--1 > input"
  );
  console.log("79");
  await page.click(
    "#dana-topup-modal > div > div:nth-child(4) > div.u-mrgn-top--5 > div.c-inp-grp-table.u-mrgn-top--1 > input"
  );
  console.log("82");
  await page.keyboard.type(nominal);
  await page.click(
    "#dana-topup-modal > div > div:nth-child(4) > div.u-mrgn-top--5 > div:nth-child(5) > button"
  );
  // await page('#dana-topup-modal > div > div:nth-child(4) > div.u-mrgn-top--5 > div:nth-child(5) > button',{hiden:true})
  await page.waitForSelector(
    "#js-iv-payment-form > div.o-layout__item.u-7of12 > div.u-mrgn-bottom--10 > div.c-panel.clearfix > div.c-panel__head > h2"
  );
  await page.waitForSelector(
    "#js-iv-payment-form > div.o-layout__item.u-7of12 > div.u-mrgn-bottom--10 > div.c-panel.clearfix > div.c-panel__body > div > ul"
  );
  await autoScroll(page);
  // let met = '#qa-payment-'+metode;
  // console.log(met)
  // await page.waitForSelector(met);
  // console.log()
  await page.screenshot({ path: "bukalapak.png" });
  console.log(metode === "alfamart");
  if (metode === "alfamart") {
    await page.evaluate(() => {
      document.querySelector("#qa-payment-alfamart").click();
    });
  }

  if (metode === "indomart") {
    await page.evaluate(() => {
      document.querySelector("#qa-payment-indomaret").click();
    });
  }
  await page.waitForSelector(
    "#js-iv-payment-form > div.o-layout__item.u-7of12 > div.u-mrgn-bottom--10 > div.c-panel.clearfix > div.c-panel__body > div > ul > li.c-panel.c-panel-accordion.js-accordion-group-panel.is-active > div > div > strong"
  );

  await page.click(
    "#js-iv-summary > div.c-panel.c-panel--bleed > div.c-panel__body > div.o-box.u-pad-top--0 > div > div > button.c-btn.c-btn--red.c-btn--large.c-btn--block.js-iv-submit-payment.js-iv-submit.js-tfa-required.qa-button-pay.was-tfa-button"
  );
  await page.waitForNavigation({ timeout: 0 });
  await page.screenshot({ path: "bukalapak.png" });
  await page.waitForSelector(
    "#reskinned_page > section > div > div > div.c-panel > div.c-panel__body > div"
  ); // wait for the selector to load
  const element = await page.$(
    "#reskinned_page > section > div > div > div.c-panel > div.c-panel__body"
  ); // declare a variable with an ElementHandle
  await element.screenshot({ path: "va.png" }); // take screenshot element in puppeteer
  const noVa =
    "#reskinned_page > section > div > div > div.c-panel > div.c-panel__body > div > strong > a";
  spanVal = await page.$eval(noVa, el => el.innerText);
  console.log(spanVal);
  return spanVal;
}

async function closeBrowser(browser) {
  return browser.close();
}

// (async () => {
//   let metode = "indomart";
//   console.log(metode);
//   await topUp(
//     "https://www.bukalapak.com/dompet/dana?from=nav_header",
//     nominal,
//     metode
//   );
//   // process.exit(1);
// })();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

module.exports = {
  topUp
};
