import { Given, Then, When } from "@wdio/cucumber-framework"
import { $ } from "@wdio/globals"
import fs from 'fs'
import path from 'path'
import { DOWNLOAD_FOLDER_PATH } from "src/constants/pathconstant"
import assertions from "src/utils/assertions"
import { deleteDirectory } from "src/utils/fileutils"

Given(/^user opens url (.*) of the page$/, async (pageUrl: string) => {
    await browser.url(pageUrl)
    await browser.maximizeWindow()
    await browser.pause(5000)
})

When(/^I click on first file$/, async () => {
    const file_element = $('div#content a[href*="download"]')
    await file_element.click()
    await browser.pause(5000)
})

Then(/^I validate downloaded file extension$/, async () => {
    const extensions = ['.jpg', '.txt', '.pdf', '.png', '.PNG', '.json', '.jpeg', '.csv', '.tmp', '.zip', '.xlsx', '.exe', '.mp3', '.docx', '.pptx', '.xml', '.bin']
    const files = fs.readdirSync(DOWNLOAD_FOLDER_PATH)

    files.forEach(file => {
        expect(extensions).toContain(path.extname(file))
        assertions.toContain(extensions, path.extname(file))

    })

    deleteDirectory(DOWNLOAD_FOLDER_PATH)
})