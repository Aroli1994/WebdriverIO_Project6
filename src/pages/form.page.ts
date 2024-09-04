import Page from './page';
import { browser, $, $$ } from '@wdio/globals'
import { click, setText, elementValueSelection, scrollIntoView } from 'src/utils/commands'

class FormPage extends Page {

    private get first_name_element() {
        return $('#firstName');
    }
    private get last_name_element() {
        return $('#lastName');
    }
    private get email_element() {
        return $('#userEmail');
    }
    private get gender_radio_elements() {
        return $$('div.custom-radio>input');
    }
    private get mobile_number_element() {
        return $('#userNumber');
    }
    private get date_of_birth_element() {
        return $('#dateOfBirthInput');
    }
    private get subject_element() {
        return $('#subjectsInput');
    }
    private get hobbies_checkbox_elements() {
        return $$('div.custom-checkbox>input');
    }
    private get choose_picture_element() {
        return $('#uploadPicture');
    }
    private get address_element() {
        return $('#currentAddress');
    }

    private get state_element() {
        return $('#react-select-3-input');
    }

    private get state_option_elements() {
        return $$('#div[id^="react-select-3-option"]');
    }
    private get city_element() {
        return $('#react-select-4-input');
    }

    private get city_option_elements() {
        return $$('div[id^="react-select-4-option"]');
    }

    private get submit_button_element() {
        return $('#submit');
    }

    public async openUrl(pageurl: string) {
        browser.url(pageurl)
        browser.maximizeWindow()
    }

    public async setNames(fname: string, lname: string) {
        if (!this.first_name_element.isElementDisplayed) {
            await scrollIntoView(this.first_name_element)
        }
        browser.pause(3000)
        await setText(this.first_name_element, fname)
        await setText(this.last_name_element, lname)
    }

    public async setEmail(email: string) {
        await setText(this.email_element, email)
    }

    public async setSubject(subject: string) {
        await setText(this.subject_element, subject)
    }

    public async setMobileNumber(mobile: string) {
        await setText(this.mobile_number_element, mobile)
    }

    public async selectGender(gender: string) {
        await elementValueSelection(this.gender_radio_elements, gender)
    }

    public async setAddress(address: string) {
        await setText(this.address_element, address)
    }

    public async selectHobbies(hobbies: string) {
        await elementValueSelection(this.hobbies_checkbox_elements, hobbies)
    }

    public async selectDateOfBirth(birthDate: string) {
        await setText(this.date_of_birth_element, birthDate)
    }

    public async clickOnChoosePictureButton() {
        await click(this.choose_picture_element)
    }


}

export default new FormPage();