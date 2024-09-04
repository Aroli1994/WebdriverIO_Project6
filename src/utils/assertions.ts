import { addLog } from './commands'
import { expect } from 'expect-webdriverio'
import { ChainablePromiseElement, ChainablePromiseArray } from "webdriverio"

class Assertion {

    toContain(actual: string | string [], expected: string) {
        expect(actual).toContain(expected)
        addLog(`Assertion >> ${actual} to contain ${expected}`)
    }

    toEqual(actual: string, expected: string) {
        expect(actual).toEqual(expected)
        addLog(`Assertion >> ${actual} to contain ${expected}`)
    }

    async toHaveText(element: ChainablePromiseElement, expectedText: string) {
        await expect(element).toHaveText(expectedText)
        addLog(`Assertion >> ${await element.selector} to have text ${expectedText}`)
    }

    async toBeExisting(element: ChainablePromiseElement) {
        await expect(element).toBeExisting()
        addLog(`Assertion >> ${await element.selector} to be existing`)
    }

    async stringContaining(expectedText: string) {
        await expect.stringContaining(expectedText)
    }

    async toHaveTextContaining(element: ChainablePromiseElement, expectedText: string) {
        await expect(element).toHaveText(expect.stringContaining(expectedText))
        addLog(`Assertion >> ${await element.selector} to have text containing ${expectedText}`)
    } 

    async toBeDisplayed(element: ChainablePromiseElement) {
        await expect(element).toBeDisplayed()
        addLog(`Assertion >> ${await element.selector} to be displayed`)
    }
}

export default new Assertion()