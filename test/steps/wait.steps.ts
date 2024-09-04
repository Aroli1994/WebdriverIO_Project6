import { Given, When, Then } from '@wdio/cucumber-framework';
import assertions from 'src/utils/assertions';

Given(/^I am on dynamic loading (.*) page$/, async (appurl: string) => {
    await browser.url(appurl)
    await browser.maximizeWindow()
})

When(/^I click on start button$/, async () => {
    const start_btn_ele = $('#start>button')
    await start_btn_ele.click()
})

Then(/^I validate loading icon$/, async () => {
    const loading_icon_ele = $('#loading')
    const msg_ele = $('#finish>h4')

    await loading_icon_ele.waitForDisplayed({ timeout: 5000 })
    await loading_icon_ele.waitForDisplayed({ reverse: true, timeout: 10000 })
    //await msg_ele.waitForDisplayed({ timeout: 10000 })
    await browser.waitUntil(async () => await msg_ele.getText() === 'Hello World!', {
        timeout: 10000,
        timeoutMsg: 'Element not displayed in 10 seconds'
    })
    await assertions.toBeDisplayed(msg_ele)
})