import { Given, When, Then } from '@wdio/cucumber-framework'
import { expect } from 'expect-webdriverio'
import PracticePage from 'src/pages/practice.page';
import report from '@wdio/allure-reporter'
import { addLog } from 'src/utils/commands';
import assertions from 'src/utils/assertions';

Given(/^I am on the practice page (.*)$/, async (pageUrl: string) => {
    await PracticePage.openUrl(pageUrl)
    addLog('Loading Url..' + pageUrl)
    addLog('Maximizing window')
});

Then(/^I validate page header (.*)$/, async (pageheader: string) => {
    await expect(PracticePage.fetchHeader()).toHaveText(pageheader)
});

When(/^I enter the fullname (.*) and email (.*)$/, async (name: string, email: string) => {
    await PracticePage.typeName(name)
    await PracticePage.typeEmail(email)
});

When(/^I enter the phone number (.*)$/, async (mobile: string) => {
    await PracticePage.typePhoneNumber(mobile)
});

When(/^I select gender (.*)$/, async (gender: string) => {
    await PracticePage.selectGender(gender)
});

When(/^I choose the years of experience (.*)$/, async (experience: string) => {
    await browser.pause(3000)
    await PracticePage.selectExperience(experience)
});

When(/^I select the skills (.*)$/, async (skills: string) => {
    await browser.pause(3000)
    await PracticePage.selectSkills(skills)
});

When(/^I select the QA tools (.*)$/, async (qatools: string) => {
    await PracticePage.selectQAtools(qatools)
});

When(/^I enter other details (.*)$/, async (details: string) => {
    await PracticePage.typeOtherDetails(details)
    await browser.pause(3000)
});

When(/^I click on submit button$/, async () => {
    await PracticePage.clickSubmitButton()
    await browser.pause(3000)
});

Then(/^I see the form is submitted having message (.*) and link (.*)$/, async (success_message: string, gobacklink: string) => {
    // await expect(PracticePage.fetchSuccessMessage()).toHaveText(success_message)
    // await expect(PracticePage.fetchGoBackLink()).toHaveText(gobacklink)

    await assertions.toHaveText(PracticePage.fetchSuccessMessage(), success_message)
    await assertions.toHaveText(PracticePage.fetchGoBackLink(), gobacklink)
});

