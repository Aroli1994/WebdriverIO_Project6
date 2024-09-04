import { Given, When, Then } from "@wdio/cucumber-framework";
import formPage from "src/pages/form.page";
import testdata from "test/resources/formdata.json"
import { parseJsonFile } from "src/utils/fileutils"
import { RESOURCE_FOLDER_PATH } from "src/constants/pathconstant"

Given(/^I am on form page \"(.*)\"$/, async (pageurl: string) => {
    formPage.openUrl(pageurl)
})

When(/^I enter all mandate fields$/, async () => {
    await formPage.setNames(testdata.firstname, testdata.lastname)
    await formPage.setEmail(testdata.email)
    await formPage.setMobileNumber(testdata.mobilenumber)
    await formPage.setSubject(testdata.subject)
    await browser.pause(5000)
})

When(/^I submit the form$/, async () => {

})

Then(/^I should see "Thanks for submitting the form"$/, async () => {

})

When(/^I enter all mandate fields from (.*)$/, async (file: string) => {
    let testDataObj = parseJsonFile(RESOURCE_FOLDER_PATH + file)
    await formPage.setNames(testDataObj.firstname, testDataObj.lastname)
    await formPage.setEmail(testDataObj.email)
    await formPage.setMobileNumber(testDataObj.mobilenumber)
    await formPage.setSubject(testDataObj.subject)
    await browser.pause(5000)
})