import report from '@wdio/allure-reporter'
import { ChainablePromiseArray, ChainablePromiseElement } from "webdriverio";

export const addLog = (log: string) => {
    report.addStep(`STEP: ${log}`)
    console.log(`STEP: ${log}`)
}

export const elementValueSelection = async (element_list: ChainablePromiseArray , user_input_value: string) => {
    await element_list.forEach(async element => {
        if(await element.getAttribute('value') === user_input_value) {
            await element.click()
            addLog(`Selected value: ${user_input_value}`)
        }
    });
}
 
export const setText = async (elem: ChainablePromiseElement, text: string) => {
    await elem.setValue(text)
    addLog(`Entered value: ${text}`)
}

export const selectByVisibleText = async (elem: ChainablePromiseElement, text: string) => {
    await elem.selectByVisibleText(text)
    addLog(`Selected by visibile text: ${text}`)
}

export const click = async (elem: ChainablePromiseElement) => {
    await elem.click()
    addLog(`Click on element:  ${await elem.selector}`)
}

export const scrollIntoView = async (elem: ChainablePromiseElement) => {
    await elem.scrollIntoView()
}

