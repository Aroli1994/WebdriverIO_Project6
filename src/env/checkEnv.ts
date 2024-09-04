const Google = 'https://www.google.com/'  //For example: This is DEV env
const Wiki = 'https://www.wikipedia.org/' //For example: This is QA env

process.env['NODE_ENV'] = 'DEV'; 

let appbaseURL: string;
if (process.env.NODE_ENV == 'DEV') {
    // Development environment
    appbaseURL = Google 
} else if (process.env.NODE_ENV == 'QA') {
    // Testing environment
    appbaseURL = Wiki 
}
else {
    // Default environment or user message for wrong node process envirable configuration
    console.log('Please pass correct ENV variable :: DEV | QA')
    process.exit()
}


export {
    appbaseURL
}


//process.env['NODE_ENV'] = 'DEV';  -> setting node process env variable globally
//process.env['NODE_ENV'] = 'QA';   -> setting node process env variable globally
//set NODE_ENV=DEV                  -> setting node process env variable at runtime in windows
//set NODE_ENV=QA                   -> setting node process env variable at runtime in windows
//export NODE_ENV=DEV               -> setting node process env variable at runtime in mac
//set NODE_ENV=QA                   -> setting node process env variable at runtime in mac
//echo $NODE_ENV                    -> to check the NODE_ENV value


