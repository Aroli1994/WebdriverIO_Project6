import Page from "./page";
import { browser, $ } from '@wdio/globals'
import { click, selectByVisibleText, setText } from 'src/utils/commands'
import { APICalls } from 'src/enums/APICalls'

class UserPage extends Page {

    private get url_element(): ChainablePromiseElement {
        return $('#urlvalue')
    }
    private get ajax_request_element() {
        return $('#submitajax')
    }
    private get ui_response_status_element() {
        return $('#statuspre')
    }
    private get ui_response_body_element() {
        return $('#outputpre')
    }
    private get ui_method_element() {
        return $('#httpmethod')
    }
    private get ui_add_parameter_element() {
        return $('#addprambutton')
    }
    private get param_name_element() {
        return $('div#allparameters .httpparameter:last-of-type div>div.span2 input')    
    }
    private get param_value_element() {
        return $('div#allparameters .httpparameter:last-of-type div>div.span3 input')
    }

    public async openUrl(pageurl: string) {
        await browser.url(pageurl)
        await browser.maximizeWindow()
    }

    public async typeUrl(request_url: string) {
        await setText(this.url_element, request_url)
    }

    public async clickOnAjaxRequestButton() {
        await click(this.ajax_request_element)
    }

    public async getStatusText(): Promise<string> {
        await this.ui_response_status_element.waitForDisplayed()
        return this.ui_response_status_element.getText()
    }

    public async getOutputText(): Promise<string> {
        return this.ui_response_body_element.getText()
    }

    public async selectHttpMethod(type: APICalls) {
        await selectByVisibleText(this.ui_method_element, type)
    }

    public async clickOnAddParameterButton() {
        await click(this.ui_add_parameter_element)
    }

    public async enterParameterNameAndValue(key: string, value: string) {
        await setText(this.param_name_element, key)
        await setText(this.param_value_element, value)
    }
}

export default new UserPage()