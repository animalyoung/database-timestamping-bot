const { Builder, By, until } = require('selenium-webdriver');

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'timestamp_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// For Pooling connections
const promisePool = pool.promise();



async function queryDatabase(query) {
    try {
        const [rows, fields] = await promisePool.query(query);
        return rows;
    } catch (error) {
        console.error('Error while querying the database:', error);
        throw error;
    }
}

async function getUserData() {
    const query = `
        SELECT u.id as user_id, n.id as network_id, u.username, l.old_password, l.new_password
        FROM users u
        JOIN networks n ON u.network_id = n.id
        JOIN logs l ON u.id = l.user_id
        WHERE n.name = 'gartenforum'
        ORDER BY l.timestamps DESC
        LIMIT 1
    `;
    const rows = await queryDatabase(query);
    return rows.length > 0 ? rows[0] : null;
}

async function addLogEntry(userId, networkId, old_password, new_password) {
    const query = 'INSERT INTO logs (user_id, network_id, old_password, new_password) VALUES (?, ?,?,?)';
    try {
        const [result] = await promisePool.query(query, [userId, networkId, old_password, new_password]);
    } catch (error) {
        console.error('Error while adding log entry:', error);
        throw error;
    }
}

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!*.:';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function runTest() {
    const userData = await getUserData();

    const generatedPassword = generateRandomString();
    addLogEntry(userData.user_id, userData.network_id, userData.new_password, generatedPassword);

    if (!userData) {
        console.error('Keine Benutzerdaten gefunden');
        return;
    }

    let driver = await new Builder()
        .usingServer('http://localhost:4444')
        .forBrowser('firefox')// URL to Selenium Hub
        .build();

    try {
        await driver.get('https://www.gartenforum.de/profile.php?do=editpassword');
        console.log("search cookiebanner");
        const cookieButton = await driver.findElement(By.id("cmpwelcomebtnyes"));
        cookieButton.click();
        console.log("click cookiebanner");
        console.log("search login")
        const usernameField = await driver.findElement(By.id('vb_login_username'));
        const passwordField = await driver.findElement(By.id('vb_login_password'));

        // Replace 'yourUsername' and 'yourPassword' with the actual credentials
        await usernameField.sendKeys(userData.username);
        await passwordField.sendKeys(userData.new_password);
        console.log("fill login")

        console.log("search submit")
        const submitButton = await driver.findElement(By.xpath("//*[@id=\"vbulletin_html\"]/body/div[6]/div[3]/form/div[2]/div/input[1]"));
        console.log("click submit")
        await submitButton.click();

        console.log("search cookiebanner")
        await driver.wait(until.elementLocated(By.id('currentpassword')), 15000);
        //const cookieButton_2 = await driver.findElement(By.id("cmpwelcomebtnyes"));
       // cookieButton_2.click();
        console.log("click cookiebanner")
        console.log("search submit_2")
        const currentPassword = await driver.findElement(By.id('currentpassword'));
        await currentPassword.sendKeys(userData.new_password);
        console.log("fill submit_2")
        const newPassword = await driver.findElement(By.id('newpassword'));
        await newPassword.sendKeys(generatedPassword);

        const newPasswordAgain = await driver.findElement(By.id('newpasswordconfirm'));
        await newPasswordAgain.sendKeys(generatedPassword);

        console.log("search submit_3")
        const submitButton_2 = await driver.findElement(By.xpath("//*[@id=\"usercp_content\"]/div/form/div[2]/div/input[1]"));

        await submitButton_2.click();


        console.log("success")



    } finally {
        await driver.quit();
    }
}

runTest();
