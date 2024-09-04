import { Given, When, Then } from '@wdio/cucumber-framework'
import { browser } from '@wdio/globals'
import { BASE_URI } from "src/config/APIConfig"
import UsersPage from 'src/pages/Users.page'
import supertest from 'supertest'
import { APICalls } from 'src/enums/APICalls'
import assertions from 'src/utils/assertions'

const request = supertest(BASE_URI)
let response: supertest.Response

const payload = {
    "name": "vinay",
    "job": "tester"
}

Given(/^I am on page (.*)$/, async (pageurl: string) => {
    await UsersPage.openUrl(pageurl)
})


//GET
When(/^I perform (.*) user search$/, async (endpoint: string) => {
    await UsersPage.selectHttpMethod(APICalls.GET)
    await UsersPage.typeUrl(BASE_URI + endpoint)
    await UsersPage.clickOnAjaxRequestButton()
    await browser.pause(3000)
})

When(/^I make GET (.*) api call$/, async (endpoint: string) => {
    response = await request.get(endpoint)
})

Then(/^I validate the search result$/, async () => {
    await browser.pause(3000)
    const ui_status = await UsersPage.getStatusText()
    const ui_response = JSON.parse(await UsersPage.getOutputText())
    // expect(ui_status).toContain(response.statusCode.toString())
    // expect(ui_response).toEqual(response.body)
    // expect(ui_response.data.email).toEqual(response.body.data.email)

    assertions.toContain(ui_status, response.statusCode.toString())
    assertions.toEqual(JSON.stringify(ui_response), JSON.stringify(response.body))
    assertions.toEqual(ui_response.data.email, response.body.data.email)
})

When(/^I perform create user search for api (.*)$/, async (endpoint: string) => {
    await UsersPage.selectHttpMethod(APICalls.POST)
    await UsersPage.typeUrl(BASE_URI + endpoint)
    await browser.pause(3000)
    await UsersPage.clickOnAddParameterButton()
    await browser.pause(5000)
    await UsersPage.enterParameterNameAndValue('name', payload.name)
    await browser.pause(3000)
    await UsersPage.clickOnAddParameterButton()
    await UsersPage.enterParameterNameAndValue('job', payload.job)
    await browser.pause(3000)
    await UsersPage.clickOnAjaxRequestButton()
    await browser.pause(3000)
})



//POST
When(/^I make POST (.*) api call$/, async (endpoint: string) => {
    response = await request.post(endpoint)
        .send(payload)
        .set('content-type', 'application/json');
})

Then(/^I validate the create user search result$/, async () => {
    const ui_status = await UsersPage.getStatusText()
    const ui_response = JSON.parse(await UsersPage.getOutputText())
    // expect(ui_status).toContain(response.statusCode.toString())
    // expect(ui_response.name).toEqual(response.body.name)
    // expect(ui_response.job).toEqual(response.body.job)

    assertions.toContain(ui_status, response.statusCode.toString())
    assertions.toEqual(ui_response.name, response.body.name)
    assertions.toEqual(ui_response.job, response.body.job)
})