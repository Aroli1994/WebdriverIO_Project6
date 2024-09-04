import { Given, Then } from "@wdio/cucumber-framework";
import {browser, $ } from "@wdio/globals"
import { expect } from "expect-webdriverio";
import assertions from "src/utils/assertions";

Given(/^user open the url of the page$/, async () => {
    await browser.url('https://the-internet.herokuapp.com/')
    await browser.maximizeWindow()
    await browser.pause(5000)
});

Then(/^user see the header of the page$/, async () => {
    const header = await $('#content .heading')
    //expect(await header.getText()).toEqual('Welcome to the-internet')
    //await expect(header).toHaveText('Welcome to the-internet')
    await assertions.toHaveText(header, 'Welcome to the-internet')
});
