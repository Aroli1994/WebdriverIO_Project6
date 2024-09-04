import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals'

import LoginPage from 'src/pages/login.page.ts';
import SecurePage from 'src/pages/secure.page.ts';
import assertions from 'src/utils/assertions';

const pages = {
    login: LoginPage
}

Given(/^I am on the (\w+) page$/, async (page) => {
    await pages[page].open()
});

When(/^I login with (\w+) and (.+)$/, async (username, password) => {
    await LoginPage.login(username, password)
});

Then(/^I should see a flash message saying (.*)$/, async (message) => {
    // await expect(SecurePage.flashAlert).toBeExisting();
    // await expect(SecurePage.flashAlert).toHaveText(expect.stringContaining(message));
    await assertions.toBeExisting(SecurePage.flashAlert)
    await assertions.toHaveTextContaining(SecurePage.flashAlert, message)
});

