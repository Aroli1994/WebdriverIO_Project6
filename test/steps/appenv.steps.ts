import { Given, Then } from '@wdio/cucumber-framework'

Given(/^I open app url$/, async () => {
    await browser.maximizeWindow()
    await browser.url('/')
});

Then(/^I retrieve browser title$/, async () => {
    console.log('Application Title :: ', await browser.getTitle())
});