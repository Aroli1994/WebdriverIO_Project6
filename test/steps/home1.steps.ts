import { Given, Then } from "@wdio/cucumber-framework";
import {browser, $ } from "@wdio/globals"
import { expect } from "expect-webdriverio";
import assertions from "src/utils/assertions";

Given(/^user open the url (.*) of the page$/, async (url) => {
    await browser.url(url)
    await browser.maximizeWindow()
    await browser.pause(5000)
});

Then(/^user see the header (.*) of the page$/, async (headervalue) => {
    const header = await $('#content .heading')
    //expect(header).toHaveText('Welcome to the-internet')
    //expect(await header.getText()).toEqual(headervalue)
    await assertions.toHaveText(header, headervalue)
});
