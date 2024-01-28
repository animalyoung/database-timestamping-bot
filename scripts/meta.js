const { Builder, By, until } = require('selenium-webdriver');



async function runTest() {

    let driver = await new Builder()
        .usingServer('http://localhost:4444')
        .forBrowser('firefox')// URL to Selenium Hub
        .build();

    try {
        await driver.get('https://www.instagram.com/accounts/login/?next=https%3A%2F%2Faccountscenter.instagram.com%2F%3F__coig_login%3D1');

        let buttonLocator = By.xpath("//button[contains(text(), 'Allow all cookies')]");

        // Wait for the button to be clickable
        await driver.wait(until.elementLocated(buttonLocator), 10000); // waits for 10 seconds
        let button = await driver.findElement(buttonLocator);
        await driver.wait(until.elementIsEnabled(button), 10000);

        // Click the button
        await button.click();

        const usernameField = await driver.findElement(By.name('username'));
        const passwordField = await driver.findElement(By.name('password'));

        // Replace 'yourUsername' and 'yourPassword' with the actual credentials
        await usernameField.sendKeys('johann.tester@proton.me');
        await passwordField.sendKeys('Hallo999!');

        const submitButton = await driver.findElement(By.css('button[type="submit"], input[type="submit"]'));
        await submitButton.click();
    } finally {
        await driver.quit();
    }
}

runTest();
