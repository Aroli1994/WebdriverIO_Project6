import { click, elementValueSelection, selectByVisibleText, setText } from 'src/utils/commands';
import Page from './page';
import { browser, $, $$ } from '@wdio/globals'

class PracticePage extends Page {

    private get header_element() {
        return $('#the7-body .wf-wrap h1');
    }
    private get full_name_element() {
        return $('#g4072-fullname');
    }
    private get email_element() {
        return $('#g4072-email');
    }
    private get phone_number_element() {
        return $('#g4072-phonenumber');
    }
    private get gender_element() {
        return $('#g4072-gender');
    }
    private get experience_elements() {
        return $$('#g4072-yearsofexperience-label p.contact-form-field input');
    }
    private get skills_elements() {
        return $$('#g4072-skills-label p.contact-form-field input');
    }
    private get qa_tools_element() {
        return $('#g4072-qatools');
    }
    private get other_detail_element() {
        return $('#contact-form-comment-g4072-otherdetails');
    }
    private get submit_element() {
        return $('div.wp-block-jetpack-button button.wp-block-button__link');
    }
    private get success_message_element() {
        return $('#contact-form-success-header');
    }
    private get go_back_element() {
        return $('a.link');
    }

    public async openUrl(pageurl: string) {
        await browser.url(pageurl)
        await browser.maximizeWindow()
    }

    public fetchHeader() {
        return this.header_element
    }
    public async typeName(firstname: string) {
        await setText(this.full_name_element, firstname)
    }
    public async typeEmail(email: string) {
        await setText(this.email_element, email)
    }
    public async typePhoneNumber(mobile: string) {
        await setText(this.phone_number_element, mobile)
    }
    public async selectGender(gender: string) {
        await selectByVisibleText(this.gender_element, gender)
    }
    public async selectExperience(experience: string) {
        await elementValueSelection(this.experience_elements, experience)
    }
    public async selectSkills(skills: string) {
        await elementValueSelection(this.skills_elements, skills)
    }
    public async selectQAtools(qatools: string) {
        await selectByVisibleText(this.qa_tools_element, qatools)
    }
    public async typeOtherDetails(details: string) {
        await setText(this.other_detail_element, details)
    }
    public async clickSubmitButton() {
        await click(this.submit_element)
    }
    public fetchSuccessMessage() {
        return this.success_message_element
    }
    public fetchGoBackLink() {
        return this.go_back_element
    }
}

export default new PracticePage();
