import fs from 'node:fs'

export const parseJsonFile = (datapath: string) => {
    let data = fs.readFileSync(datapath, "utf-8")
        return JSON.parse(data)
}

export const deleteDirectory = async (path: string) => {
    if(fs.existsSync(path)) {
    fs.rmSync(path, {recursive: true})
}}
