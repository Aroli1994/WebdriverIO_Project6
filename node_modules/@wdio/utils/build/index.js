var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/constants.ts
var UNICODE_CHARACTERS, SUPPORTED_BROWSERNAMES, DEFAULT_HOSTNAME, DEFAULT_PROTOCOL, DEFAULT_PATH, HOOK_DEFINITION;
var init_constants = __esm({
  "src/constants.ts"() {
    "use strict";
    UNICODE_CHARACTERS = {
      "NULL": "\uE000",
      "Unidentified": "\uE000",
      "Cancel": "\uE001",
      "Help": "\uE002",
      "Backspace": "\uE003",
      "Back space": "\uE003",
      "Tab": "\uE004",
      "Clear": "\uE005",
      "Return": "\uE006",
      "Enter": "\uE007",
      "Shift": "\uE008",
      "Control": "\uE009",
      "Control Left": "\uE009",
      "Control Right": "\uE051",
      "Alt": "\uE00A",
      "Pause": "\uE00B",
      "Escape": "\uE00C",
      "Space": "\uE00D",
      " ": "\uE00D",
      "PageUp": "\uE00E",
      "Pageup": "\uE00E",
      "Page_Up": "\uE00E",
      "PageDown": "\uE00F",
      "Pagedown": "\uE00F",
      "Page_Down": "\uE00F",
      "End": "\uE010",
      "Home": "\uE011",
      "ArrowLeft": "\uE012",
      "Left arrow": "\uE012",
      "Arrow_Left": "\uE012",
      "ArrowUp": "\uE013",
      "Up arrow": "\uE013",
      "Arrow_Up": "\uE013",
      "ArrowRight": "\uE014",
      "Right arrow": "\uE014",
      "Arrow_Right": "\uE014",
      "ArrowDown": "\uE015",
      "Down arrow": "\uE015",
      "Arrow_Down": "\uE015",
      "Insert": "\uE016",
      "Delete": "\uE017",
      "Semicolon": "\uE018",
      "Equals": "\uE019",
      "Numpad 0": "\uE01A",
      "Numpad 1": "\uE01B",
      "Numpad 2": "\uE01C",
      "Numpad 3": "\uE01D",
      "Numpad 4": "\uE01E",
      "Numpad 5": "\uE01F",
      "Numpad 6": "\uE020",
      "Numpad 7": "\uE021",
      "Numpad 8": "\uE022",
      "Numpad 9": "\uE023",
      "Multiply": "\uE024",
      "Add": "\uE025",
      "Separator": "\uE026",
      "Subtract": "\uE027",
      "Decimal": "\uE028",
      "Divide": "\uE029",
      "F1": "\uE031",
      "F2": "\uE032",
      "F3": "\uE033",
      "F4": "\uE034",
      "F5": "\uE035",
      "F6": "\uE036",
      "F7": "\uE037",
      "F8": "\uE038",
      "F9": "\uE039",
      "F10": "\uE03A",
      "F11": "\uE03B",
      "F12": "\uE03C",
      "Command": "\uE03D",
      "Meta": "\uE03D",
      "ZenkakuHankaku": "\uE040",
      "Zenkaku_Hankaku": "\uE040"
    };
    SUPPORTED_BROWSERNAMES = {
      chrome: ["chrome", "googlechrome", "chromium", "chromium-browser"],
      firefox: ["firefox", "ff", "mozilla", "mozilla firefox"],
      edge: ["edge", "microsoftedge", "msedge"],
      safari: ["safari", "safari technology preview"]
    };
    DEFAULT_HOSTNAME = "localhost";
    DEFAULT_PROTOCOL = "http";
    DEFAULT_PATH = "/";
    HOOK_DEFINITION = {
      type: "object",
      validate: (param) => {
        if (!Array.isArray(param)) {
          throw new Error("a hook option needs to be a list of functions");
        }
        for (const option of param) {
          if (typeof option === "function") {
            continue;
          }
          throw new Error("expected hook to be type of function");
        }
      }
    };
  }
});

// src/utils.ts
import fs from "node:fs/promises";
import url from "node:url";
import path from "node:path";
function assertPath(path4) {
  if (typeof path4 !== "string") {
    throw new TypeError("Path must be a string. Received " + JSON.stringify(path4));
  }
}
function isAbsolute(p) {
  assertPath(p);
  return p.length > 0 && p.charCodeAt(0) === SLASH.codePointAt(0);
}
function overwriteElementCommands(propertiesObject) {
  const elementOverrides = propertiesObject.__elementOverrides__ ? propertiesObject.__elementOverrides__.value : {};
  for (const [commandName, userDefinedCommand] of Object.entries(elementOverrides)) {
    if (typeof userDefinedCommand !== "function") {
      throw new Error("overwriteCommand: commands be overwritten only with functions, command: " + commandName);
    }
    if (!propertiesObject[commandName]) {
      throw new Error("overwriteCommand: no command to be overwritten: " + commandName);
    }
    if (typeof propertiesObject[commandName].value !== "function") {
      throw new Error("overwriteCommand: only functions can be overwritten, command: " + commandName);
    }
    const origCommand = propertiesObject[commandName].value;
    delete propertiesObject[commandName];
    const newCommand = function(...args) {
      const element = this;
      return userDefinedCommand.apply(element, [
        function origCommandFunction() {
          const context = this || element;
          return origCommand.apply(context, arguments);
        },
        ...args
      ]);
    };
    propertiesObject[commandName] = {
      value: newCommand,
      configurable: true
    };
  }
  delete propertiesObject.__elementOverrides__;
  propertiesObject.__elementOverrides__ = { value: {} };
}
function commandCallStructure(commandName, args, unfurl = false) {
  const callArgs = args.map((arg) => {
    if (typeof arg === "string" && (arg.startsWith("!function(") || arg.startsWith("return (function") || arg.startsWith("return (async function"))) {
      arg = "<fn>";
    } else if (typeof arg === "string" && /**
     * the isBase64 method returns for xPath values like
     * "/html/body/a" a true value which is why we should
     * include a command check in here.
     */
    !commandName.startsWith("findElement") && isBase64(arg)) {
      arg = SCREENSHOT_REPLACEMENT;
    } else if (typeof arg === "string") {
      arg = `"${arg}"`;
    } else if (typeof arg === "function") {
      arg = "<fn>";
    } else if (arg === null) {
      arg = "null";
    } else if (typeof arg === "object") {
      arg = unfurl ? JSON.stringify(arg) : "<object>";
    } else if (typeof arg === "undefined") {
      arg = typeof arg;
    }
    return arg;
  }).join(", ");
  return `${commandName}(${callArgs})`;
}
function transformCommandLogResult(result) {
  if (typeof result.file === "string" && isBase64(result.file)) {
    return SCREENSHOT_REPLACEMENT;
  } else if (typeof result.script === "string" && isBase64(result.script)) {
    return SCRIPT_PLACEHOLDER;
  } else if (typeof result.script === "string" && result.script.match(REGEX_SCRIPT_NAME)) {
    const newScript = result.script.match(REGEX_SCRIPT_NAME)[2];
    return { ...result, script: `${newScript}(...) [${Buffer.byteLength(result.script, "utf-8")} bytes]` };
  } else if (typeof result.script === "string" && result.script.startsWith("!function(")) {
    return { ...result, script: `<minified function> [${Buffer.byteLength(result.script, "utf-8")} bytes]` };
  }
  return result;
}
function isValidParameter(arg, expectedType) {
  let shouldBeArray = false;
  if (expectedType.slice(-2) === "[]") {
    expectedType = expectedType.slice(0, -2);
    shouldBeArray = true;
  }
  if (shouldBeArray) {
    if (!Array.isArray(arg)) {
      return false;
    }
  } else {
    arg = [arg];
  }
  for (const argEntity of arg) {
    const argEntityType = getArgumentType(argEntity);
    if (!argEntityType.match(expectedType)) {
      return false;
    }
  }
  return true;
}
function getArgumentType(arg) {
  return arg === null ? "null" : typeof arg;
}
async function userImport(moduleName, namedImport = "default") {
  try {
    const mod = await import(
      /* @vite-ignore */
      moduleName
    );
    if (namedImport in mod) {
      return mod[namedImport];
    }
  } catch (err) {
    throw new Error(`Couldn't import "${moduleName}"! Do you have it installed? If not run "npm install ${moduleName}"!`);
  }
  throw new Error(`Couldn't find "${namedImport}" in module "${moduleName}"`);
}
async function safeImport(name) {
  let importPath = name;
  try {
    if (!globalThis.window) {
      const { resolve } = await import("import-meta-resolve");
      try {
        importPath = await resolve(name, import.meta.url);
      } catch (err) {
        const localNodeModules = path.join(process.cwd(), "node_modules");
        try {
          importPath = await resolve(name, url.pathToFileURL(localNodeModules).toString());
        } catch (err2) {
          return null;
        }
      }
    }
  } catch (err) {
    return null;
  }
  try {
    const pkg = await import(
      /* @vite-ignore */
      importPath
    );
    if (pkg.default && pkg.default.default) {
      return pkg.default;
    }
    return pkg;
  } catch (e) {
    throw new Error(`Couldn't initialize "${name}".
${e.stack}`);
  }
}
function isFunctionAsync(fn) {
  return fn.constructor && fn.constructor.name === "AsyncFunction" || fn.name === "async";
}
function filterSpecArgs(args) {
  return args.filter((arg) => typeof arg !== "function");
}
function isBase64(str) {
  if (typeof str !== "string") {
    throw new Error("Expected string but received invalid type.");
  }
  const len = str.length;
  const notBase64 = /[^A-Z0-9+/=]/i;
  if (!len || len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }
  const firstPaddingChar = str.indexOf("=");
  return firstPaddingChar === -1 || firstPaddingChar === len - 1 || firstPaddingChar === len - 2 && str[len - 1] === "=";
}
function isAppiumCapability(caps) {
  return Boolean(
    caps && // @ts-expect-error outdated jsonwp cap
    (caps.automationName || caps["appium:automationName"] || caps.deviceName || caps.appiumVersion)
  );
}
function definesRemoteDriver(options) {
  return Boolean(
    options.protocol && options.protocol !== DEFAULT_PROTOCOL || options.hostname && options.hostname !== DEFAULT_HOSTNAME || Boolean(options.port) || options.path && options.path !== DEFAULT_PATH || Boolean(options.user && options.key)
  );
}
function isChrome(browserName) {
  return Boolean(browserName && SUPPORTED_BROWSERNAMES.chrome.includes(browserName.toLowerCase()));
}
function isSafari(browserName) {
  return Boolean(browserName && SUPPORTED_BROWSERNAMES.safari.includes(browserName.toLowerCase()));
}
function isFirefox(browserName) {
  return Boolean(browserName && SUPPORTED_BROWSERNAMES.firefox.includes(browserName.toLowerCase()));
}
function isEdge(browserName) {
  return Boolean(browserName && SUPPORTED_BROWSERNAMES.edge.includes(browserName.toLowerCase()));
}
function getBrowserObject(elem) {
  const elemObject = elem;
  return elemObject.parent ? getBrowserObject(elemObject.parent) : elem;
}
async function enableFileLogging(outputDir) {
  if (!outputDir) {
    return;
  }
  await fs.mkdir(path.join(outputDir), { recursive: true });
  process.env.WDIO_LOG_PATH = path.join(outputDir, "wdio.log");
}
var SCREENSHOT_REPLACEMENT, SCRIPT_PLACEHOLDER, REGEX_SCRIPT_NAME, SLASH, sleep;
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
    init_constants();
    SCREENSHOT_REPLACEMENT = '"<Screenshot[base64]>"';
    SCRIPT_PLACEHOLDER = '"<Script[base64]>"';
    REGEX_SCRIPT_NAME = /return \((async )?function (\w+)/;
    SLASH = "/";
    sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms));
  }
});

// src/node/utils.ts
import os from "node:os";
import fs2 from "node:fs";
import fsp from "node:fs/promises";
import path2 from "node:path";
import cp from "node:child_process";
import decamelize from "decamelize";
import logger2 from "@wdio/logger";
import {
  install,
  canDownload,
  resolveBuildId,
  detectBrowserPlatform,
  Browser as Browser2,
  ChromeReleaseChannel,
  computeExecutablePath
} from "@puppeteer/browsers";
import { download as downloadGeckodriver } from "geckodriver";
import { download as downloadEdgedriver } from "edgedriver";
import { locateChrome, locateFirefox, locateApp } from "locate-app";
function parseParams(params) {
  return Object.entries(params).filter(([key]) => !EXCLUDED_PARAMS.includes(key)).map(([key, val]) => {
    if (typeof val === "boolean" && !val) {
      return "";
    }
    const vals = Array.isArray(val) ? val : [val];
    return vals.map((v) => `--${decamelize(key, { separator: "-" })}${typeof v === "boolean" ? "" : `=${v}`}`);
  }).flat().filter(Boolean);
}
function getBuildIdByChromePath(chromePath) {
  if (!chromePath) {
    return;
  }
  if (os.platform() === "win32") {
    const versionPath = path2.dirname(chromePath);
    const contents = fs2.readdirSync(versionPath);
    const versions = contents.filter((a) => /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/g.test(a));
    const oldest = versions.sort((a, b) => a > b ? -1 : 1)[0];
    return oldest;
  }
  const versionString = cp.execSync(`"${chromePath}" --version --no-sandbox`).toString();
  const versionSanitized = versionString.trim().split(" ").find((s) => s.split(".").length === 4);
  if (!versionSanitized) {
    throw new Error(`Couldn't find valid Chrome version from "${versionString}", please raise an issue in the WebdriverIO project (https://github.com/webdriverio/webdriverio/issues/new/choose)`);
  }
  return versionSanitized;
}
async function getBuildIdByFirefoxPath(firefoxPath) {
  if (!firefoxPath) {
    return;
  }
  if (os.platform() === "win32") {
    const appPath = path2.dirname(firefoxPath);
    const contents = (await fsp.readFile(path2.join(appPath, "application.ini"))).toString("utf-8");
    return contents.split("\n").filter((line) => line.startsWith("Version=")).map((line) => line.replace("Version=", "").replace(/\r/, "")).pop();
  }
  const versionString = cp.execSync(`"${firefoxPath}" --version`).toString();
  return versionString.trim().split(" ").pop()?.trim();
}
function locateChromeSafely() {
  return locateChrome().catch(() => void 0);
}
async function setupPuppeteerBrowser(cacheDir, caps) {
  caps.browserName = caps.browserName?.toLowerCase();
  const browserName = caps.browserName === Browser2.FIREFOX ? Browser2.FIREFOX : caps.browserName === Browser2.CHROMIUM ? Browser2.CHROMIUM : Browser2.CHROME;
  const exist = await fsp.access(cacheDir).then(() => true, () => false);
  const isChromeOrChromium = browserName === Browser2.CHROME || caps.browserName === Browser2.CHROMIUM;
  if (!exist) {
    await fsp.mkdir(cacheDir, { recursive: true });
  }
  if (browserName === Browser2.CHROMIUM) {
    caps.browserName = Browser2.CHROME;
  }
  const browserOptions = (isChromeOrChromium ? caps["goog:chromeOptions"] : caps["moz:firefoxOptions"]) || {};
  if (typeof browserOptions.binary === "string") {
    return {
      executablePath: browserOptions.binary,
      browserVersion: caps.browserVersion || (isChromeOrChromium ? getBuildIdByChromePath(browserOptions.binary) : await getBuildIdByFirefoxPath(browserOptions.binary))
    };
  }
  const platform = detectBrowserPlatform();
  if (!platform) {
    throw new Error("The current platform is not supported.");
  }
  if (!caps.browserVersion) {
    const executablePath2 = browserName === Browser2.CHROME ? await locateChromeSafely() : browserName === Browser2.CHROMIUM ? await locateApp({
      appName: Browser2.CHROMIUM,
      macOsName: Browser2.CHROMIUM,
      linuxWhich: "chromium-browser"
    }).catch(() => void 0) : await locateFirefox().catch(() => void 0);
    const browserVersion2 = isChromeOrChromium ? getBuildIdByChromePath(executablePath2) : await getBuildIdByFirefoxPath(executablePath2);
    if (browserVersion2) {
      return {
        executablePath: executablePath2,
        browserVersion: browserVersion2
      };
    }
  }
  const tag = browserName === Browser2.CHROME ? caps.browserVersion || ChromeReleaseChannel.STABLE : caps.browserVersion || "latest";
  const buildId = await resolveBuildId(browserName, platform, tag);
  const installOptions = {
    unpack: true,
    cacheDir,
    platform,
    buildId,
    browser: browserName,
    downloadProgressCallback: (downloadedBytes, totalBytes) => downloadProgressCallback(`${browserName} (${buildId})`, downloadedBytes, totalBytes)
  };
  const isCombinationAvailable = await canDownload(installOptions);
  if (!isCombinationAvailable) {
    throw new Error(`Couldn't find a matching ${browserName} browser for tag "${buildId}" on platform "${platform}"`);
  }
  log.info(`Setting up ${browserName} v${buildId}`);
  await _install(installOptions);
  const executablePath = computeExecutablePath(installOptions);
  let browserVersion = buildId;
  if (browserName === Browser2.CHROMIUM) {
    browserVersion = await resolveBuildId(Browser2.CHROME, platform, tag);
  }
  return { executablePath, browserVersion };
}
function getDriverOptions(caps) {
  return caps["wdio:chromedriverOptions"] || caps["wdio:geckodriverOptions"] || caps["wdio:edgedriverOptions"] || // Safaridriver does not have any options as it already
  // is installed on macOS
  {};
}
function getCacheDir(options, caps) {
  const driverOptions = getDriverOptions(caps);
  return driverOptions.cacheDir || options.cacheDir || os.tmpdir();
}
function getMajorVersionFromString(fullVersion) {
  let prefix;
  if (fullVersion) {
    prefix = fullVersion.match(/^[+-]?([0-9]+)/);
  }
  return prefix && prefix.length > 0 ? prefix[0] : "";
}
async function setupChromedriver(cacheDir, driverVersion) {
  const platform = detectBrowserPlatform();
  if (!platform) {
    throw new Error("The current platform is not supported.");
  }
  const version = driverVersion || getBuildIdByChromePath(await locateChromeSafely()) || ChromeReleaseChannel.STABLE;
  const buildId = await resolveBuildId(Browser2.CHROMEDRIVER, platform, version);
  let executablePath = computeExecutablePath({
    browser: Browser2.CHROMEDRIVER,
    buildId,
    platform,
    cacheDir
  });
  const hasChromedriverInstalled = await fsp.access(executablePath).then(() => true, () => false);
  if (!hasChromedriverInstalled) {
    log.info(`Downloading Chromedriver v${buildId}`);
    const chromedriverInstallOpts = {
      cacheDir,
      buildId,
      platform,
      browser: Browser2.CHROMEDRIVER,
      unpack: true,
      downloadProgressCallback: (downloadedBytes, totalBytes) => downloadProgressCallback("Chromedriver", downloadedBytes, totalBytes)
    };
    let knownBuild = buildId;
    if (await canDownload(chromedriverInstallOpts)) {
      await _install({ ...chromedriverInstallOpts, buildId });
      log.info(`Download of Chromedriver v${buildId} was successful`);
    } else {
      log.warn(`Chromedriver v${buildId} don't exist, trying to find known good version...`);
      knownBuild = await resolveBuildId(Browser2.CHROMEDRIVER, platform, getMajorVersionFromString(version));
      if (knownBuild) {
        await _install({ ...chromedriverInstallOpts, buildId: knownBuild });
        log.info(`Download of Chromedriver v${knownBuild} was successful`);
      } else {
        throw new Error(`Couldn't download any known good version from Chromedriver major v${getMajorVersionFromString(version)}, requested full version - v${version}`);
      }
    }
    executablePath = computeExecutablePath({
      browser: Browser2.CHROMEDRIVER,
      buildId: knownBuild,
      platform,
      cacheDir
    });
  } else {
    log.info(`Using Chromedriver v${buildId} from cache directory ${cacheDir}`);
  }
  return { executablePath };
}
function setupGeckodriver(cacheDir, driverVersion) {
  return downloadGeckodriver(driverVersion, cacheDir);
}
function setupEdgedriver(cacheDir, driverVersion) {
  return downloadEdgedriver(driverVersion, cacheDir);
}
var log, EXCLUDED_PARAMS, canAccess, lastTimeCalled, downloadProgressCallback, _install;
var init_utils2 = __esm({
  "src/node/utils.ts"() {
    "use strict";
    log = logger2("webdriver");
    EXCLUDED_PARAMS = ["version", "help"];
    canAccess = (file) => {
      if (!file) {
        return false;
      }
      try {
        fs2.accessSync(file);
        return true;
      } catch (err) {
        return false;
      }
    };
    lastTimeCalled = Date.now();
    downloadProgressCallback = (artifact, downloadedBytes, totalBytes) => {
      if (Date.now() - lastTimeCalled < 1e3) {
        return;
      }
      const percentage = (downloadedBytes / totalBytes * 100).toFixed(2);
      log.progress(`Downloading ${artifact} ${percentage}%`);
      lastTimeCalled = Date.now();
    };
    _install = async (args, retry = false) => {
      await install(args).catch((err) => {
        const error = `Failed downloading ${args.browser} v${args.buildId} using ${JSON.stringify(args)}: ${err.message}, retrying ...`;
        if (retry) {
          err.message += "\n" + error.replace(", retrying ...", "");
          throw new Error(err);
        }
        log.error(error);
        return _install(args, true);
      });
      log.progress("");
    };
  }
});

// src/node/startWebDriver.ts
import fs3 from "node:fs";
import path3 from "node:path";
import cp2 from "node:child_process";
import getPort from "get-port";
import waitPort from "wait-port";
import logger3 from "@wdio/logger";
import split2 from "split2";
import { deepmerge } from "deepmerge-ts";
import { start as startSafaridriver } from "safaridriver";
import { start as startGeckodriver } from "geckodriver";
import { start as startEdgedriver, findEdgePath } from "edgedriver";
async function startWebDriver(options) {
  if (process.env.WDIO_SKIP_DRIVER_SETUP) {
    options.hostname = "localhost";
    options.port = 4321;
    return;
  }
  let driverProcess;
  let driver = "";
  const start = Date.now();
  const caps = options.capabilities.alwaysMatch || options.capabilities;
  if (isAppiumCapability(caps)) {
    return;
  }
  if (!caps.browserName) {
    throw new Error(
      `No "browserName" defined in capabilities nor hostname or port found!
If you like to run a local browser session make sure to pick from one of the following browser names: ${Object.values(SUPPORTED_BROWSERNAMES).flat(Infinity)}`
    );
  }
  const port = await getPort();
  const cacheDir = getCacheDir(options, caps);
  if (isChrome(caps.browserName)) {
    const chromedriverOptions = caps["wdio:chromedriverOptions"] || {};
    const chromedriverBinary = chromedriverOptions.binary || process.env.CHROMEDRIVER_PATH;
    const { executablePath: chromeExecuteablePath, browserVersion } = await setupPuppeteerBrowser(cacheDir, caps);
    const { executablePath: chromedriverExcecuteablePath } = chromedriverBinary ? { executablePath: chromedriverBinary } : await setupChromedriver(cacheDir, browserVersion);
    caps["goog:chromeOptions"] = deepmerge(
      { binary: chromeExecuteablePath },
      caps["goog:chromeOptions"] || {}
    );
    chromedriverOptions.allowedOrigins = chromedriverOptions.allowedOrigins || ["*"];
    chromedriverOptions.allowedIps = chromedriverOptions.allowedIps || ["0.0.0.0"];
    const driverParams = parseParams({ port, ...chromedriverOptions });
    driverProcess = cp2.spawn(chromedriverExcecuteablePath, driverParams);
    driver = `Chromedriver v${browserVersion} with params ${driverParams.join(" ")}`;
  } else if (isSafari(caps.browserName)) {
    const safaridriverOptions = caps["wdio:safaridriverOptions"] || {};
    driver = "SafariDriver";
    driverProcess = startSafaridriver({
      useTechnologyPreview: Boolean(caps.browserName.match(/preview/i)),
      ...safaridriverOptions,
      port
    });
  } else if (isFirefox(caps.browserName)) {
    const { executablePath } = await setupPuppeteerBrowser(cacheDir, caps);
    caps["moz:firefoxOptions"] = deepmerge(
      { binary: executablePath },
      caps["moz:firefoxOptions"] || {}
    );
    delete caps.browserVersion;
    const { binary, ...geckodriverOptions } = caps["wdio:geckodriverOptions"] || {};
    if (binary) {
      geckodriverOptions.customGeckoDriverPath = binary;
    }
    driver = "GeckoDriver";
    driverProcess = await startGeckodriver({ ...geckodriverOptions, cacheDir, port, allowHosts: ["localhost"] });
  } else if (isEdge(caps.browserName)) {
    const { binary, ...edgedriverOptions } = caps["wdio:edgedriverOptions"] || {};
    if (binary) {
      edgedriverOptions.customEdgeDriverPath = binary;
    }
    driver = "EdgeDriver";
    driverProcess = await startEdgedriver({ ...edgedriverOptions, cacheDir, port, allowedIps: ["0.0.0.0"] }).catch((err) => {
      log2.warn(`Couldn't start EdgeDriver: ${err.message}, retry ...`);
      return startEdgedriver({ ...edgedriverOptions, cacheDir, port });
    });
    caps.browserName = "MicrosoftEdge";
    if (!caps["ms:edgeOptions"]?.binary) {
      caps["ms:edgeOptions"] = caps["ms:edgeOptions"] || {};
      caps["ms:edgeOptions"].binary = findEdgePath();
      log2.info(`Found Edge binary at ${caps["ms:edgeOptions"].binary}`);
    }
  } else {
    throw new Error(
      `Unknown browser name "${caps.browserName}". Make sure to pick from one of the following ` + Object.values(SUPPORTED_BROWSERNAMES).flat(Infinity)
    );
  }
  const logIdentifier = driver.split(" ").shift()?.toLowerCase() || "driver";
  if (options.outputDir) {
    const logFileName = process.env.WDIO_WORKER_ID ? `wdio-${process.env.WDIO_WORKER_ID}-${logIdentifier}.log` : `wdio-${logIdentifier}-${port}.log`;
    const logFile = path3.resolve(options.outputDir, logFileName);
    const logStream = fs3.createWriteStream(logFile, { flags: "w" });
    driverProcess.stdout?.pipe(logStream);
    driverProcess.stderr?.pipe(logStream);
  } else {
    const driverLog = logger3(logIdentifier);
    driverProcess.stdout?.pipe(split2()).on("data", driverLog.info.bind(driverLog));
    driverProcess.stderr?.pipe(split2()).on("data", driverLog.warn.bind(driverLog));
  }
  await waitPort({ port, output: "silent", timeout: DRIVER_WAIT_TIMEOUT }).catch((e) => {
    throw new Error(`Timed out to connect to ${driver}: ${e.message}`);
  });
  options.hostname = "localhost";
  options.port = port;
  log2.info(`Started ${driver} in ${Date.now() - start}ms on port ${port}`);
  return driverProcess;
}
var log2, DRIVER_WAIT_TIMEOUT;
var init_startWebDriver = __esm({
  "src/node/startWebDriver.ts"() {
    "use strict";
    init_utils2();
    init_utils();
    init_constants();
    log2 = logger3("@wdio/utils");
    DRIVER_WAIT_TIMEOUT = 10 * 1e3;
  }
});

// src/node/manager.ts
import logger4 from "@wdio/logger";
function mapCapabilities(options, caps, task, taskItemLabel) {
  const capabilitiesToRequireSetup = (Array.isArray(caps) ? caps.map((cap) => {
    const w3cCaps = cap;
    const multiremoteCaps = cap;
    const multiremoteInstanceNames = Object.keys(multiremoteCaps);
    if (typeof multiremoteCaps[multiremoteInstanceNames[0]] === "object" && "capabilities" in multiremoteCaps[multiremoteInstanceNames[0]]) {
      return Object.values(multiremoteCaps).map((c) => "alwaysMatch" in c.capabilities ? c.capabilities.alwaysMatch : c.capabilities);
    }
    if (w3cCaps.alwaysMatch) {
      return w3cCaps.alwaysMatch;
    }
    return cap;
  }).flat() : Object.values(caps).map((mrOpts) => {
    const w3cCaps = mrOpts.capabilities;
    if (w3cCaps.alwaysMatch) {
      return w3cCaps.alwaysMatch;
    }
    return mrOpts.capabilities;
  })).flat().filter((cap) => (
    /**
     * only set up driver if
     */
    // - capabilities are defined and not empty
    cap && // - browserName is defined so we know it is a browser session
    cap.browserName && // - we are not about to run a cloud session
    !definesRemoteDriver(options) && // - we are not running Safari (driver already installed on macOS)
    !isSafari(cap.browserName) && // - driver options don't define a binary path
    !getDriverOptions(cap).binary && // - environment does not define a binary path
    !(process.env.CHROMEDRIVER_PATH && isChrome(cap.browserName))
  ));
  if (capabilitiesToRequireSetup.length === 0) {
    return;
  }
  const queueByBrowserName = capabilitiesToRequireSetup.reduce((queue, cap) => {
    if (!cap.browserName) {
      return queue;
    }
    if (!queue.has(cap.browserName)) {
      queue.set(cap.browserName, /* @__PURE__ */ new Map());
    }
    const browserVersion = cap.browserVersion || UNDEFINED_BROWSER_VERSION;
    queue.get(cap.browserName).set(browserVersion, cap);
    return queue;
  }, /* @__PURE__ */ new Map());
  const driverToSetupString = Array.from(queueByBrowserName.entries()).map(([browserName, versions]) => `${browserName}@${Array.from(versions.keys()).map((bv) => bv || "stable").join(", ")}`).join(" - ");
  log3.info(`Setting up ${taskItemLabel} for: ${driverToSetupString}`);
  return Promise.all(
    Array.from(queueByBrowserName.entries()).map(([browserName, queueByBrowserVersion]) => {
      return Array.from(queueByBrowserVersion).map(([browserVersion, cap]) => task({
        ...cap,
        browserName,
        ...browserVersion !== UNDEFINED_BROWSER_VERSION ? { browserVersion } : {}
      }));
    }).flat()
  );
}
async function setupDriver(options, caps) {
  return mapCapabilities(options, caps, async (cap) => {
    const cacheDir = getCacheDir(options, cap);
    if (isEdge(cap.browserName)) {
      return setupEdgedriver(cacheDir, cap.browserVersion);
    } else if (isFirefox(cap.browserName)) {
      const version = cap.browserVersion === "latest" ? void 0 : cap.browserVersion;
      return setupGeckodriver(cacheDir, version);
    } else if (isChrome(cap.browserName)) {
      return setupChromedriver(cacheDir, cap.browserVersion);
    }
    return Promise.resolve();
  }, "browser driver" /* DRIVER */);
}
function setupBrowser(options, caps) {
  return mapCapabilities(options, caps, async (cap) => {
    const cacheDir = getCacheDir(options, cap);
    if (isEdge(cap.browserName)) {
      return Promise.resolve();
    } else if (isChrome(cap.browserName) || isFirefox(cap.browserName)) {
      return setupPuppeteerBrowser(cacheDir, cap);
    }
    return Promise.resolve();
  }, "browser binaries" /* BROWSER */);
}
var log3, UNDEFINED_BROWSER_VERSION;
var init_manager = __esm({
  "src/node/manager.ts"() {
    "use strict";
    init_utils2();
    init_utils();
    log3 = logger4("@wdio/utils");
    UNDEFINED_BROWSER_VERSION = null;
  }
});

// src/node/index.ts
var node_exports = {};
__export(node_exports, {
  canAccess: () => canAccess,
  setupBrowser: () => setupBrowser,
  setupDriver: () => setupDriver,
  startWebDriver: () => startWebDriver
});
var init_node = __esm({
  "src/node/index.ts"() {
    "use strict";
    init_startWebDriver();
    init_manager();
    init_utils2();
  }
});

// src/monad.ts
init_utils();
import { EventEmitter } from "node:events";
import logger from "@wdio/logger";
import { MESSAGE_TYPES } from "@wdio/types";
var SCOPE_TYPES = {
  browser: (
    /* istanbul ignore next */
    function Browser() {
    }
  ),
  element: (
    /* istanbul ignore next */
    function Element() {
    }
  )
};
function WebDriver(options, modifier, propertiesObject = {}) {
  const scopeType = SCOPE_TYPES[propertiesObject.scope?.value || "browser"];
  delete propertiesObject.scope;
  const prototype = Object.create(scopeType.prototype);
  const log7 = logger("webdriver");
  const eventHandler = new EventEmitter();
  const EVENTHANDLER_FUNCTIONS = Object.getPrototypeOf(eventHandler);
  function unit(sessionId, commandWrapper) {
    propertiesObject.commandList = { value: Object.keys(propertiesObject) };
    propertiesObject.options = { value: options };
    propertiesObject.requestedCapabilities = { value: options.requestedCapabilities };
    if (typeof commandWrapper === "function") {
      for (const [commandName, { value }] of Object.entries(propertiesObject)) {
        if (typeof value !== "function" || Object.keys(EVENTHANDLER_FUNCTIONS).includes(commandName)) {
          continue;
        }
        propertiesObject[commandName].value = commandWrapper(commandName, value, propertiesObject);
        propertiesObject[commandName].configurable = true;
      }
    }
    overwriteElementCommands.call(this, propertiesObject);
    const { puppeteer, ...propertiesObjectWithoutPuppeteer } = propertiesObject;
    propertiesObject.__propertiesObject__ = { value: propertiesObjectWithoutPuppeteer };
    let client = Object.create(prototype, propertiesObject);
    client.sessionId = sessionId;
    if (scopeType.name === "Browser") {
      client.capabilities = options.capabilities;
    }
    if (typeof modifier === "function") {
      client = modifier(client, options);
    }
    client.addCommand = function(name, func, attachToElement = false, proto, instances) {
      const customCommand = typeof commandWrapper === "function" ? commandWrapper(name, func) : func;
      if (attachToElement) {
        if (instances) {
          Object.values(instances).forEach((instance) => {
            instance.__propertiesObject__[name] = {
              value: customCommand
            };
          });
        }
        this.__propertiesObject__[name] = { value: customCommand };
      } else {
        unit.lift(name, customCommand, proto);
      }
      if (typeof process.send === "function" && process.env.WDIO_WORKER_ID) {
        const message = {
          origin: "worker",
          name: "workerEvent",
          args: {
            type: MESSAGE_TYPES.customCommand,
            value: {
              commandName: name,
              cid: process.env.WDIO_WORKER_ID
            }
          }
        };
        process.send(message);
      }
    };
    client.overwriteCommand = function(name, func, attachToElement = false, proto, instances) {
      const customCommand = typeof commandWrapper === "function" ? commandWrapper(name, func) : func;
      if (attachToElement) {
        if (instances) {
          Object.values(instances).forEach((instance) => {
            instance.__propertiesObject__.__elementOverrides__.value[name] = customCommand;
          });
        } else {
          this.__propertiesObject__.__elementOverrides__.value[name] = customCommand;
        }
      } else if (client[name]) {
        const origCommand = client[name];
        delete client[name];
        unit.lift(name, customCommand, proto, (...args) => origCommand.apply(this, args));
      } else {
        throw new Error("overwriteCommand: no command to be overwritten: " + name);
      }
    };
    return client;
  }
  unit.lift = function(name, func, proto, origCommand) {
    (proto || prototype)[name] = function next(...args) {
      log7.info("COMMAND", commandCallStructure(name, args));
      Object.defineProperty(func, "name", {
        value: name,
        writable: false
      });
      const result = func.apply(this, origCommand ? [origCommand, ...args] : args);
      Promise.resolve(result).then((res) => {
        const elem = res;
        let resultLog = res;
        if (elem instanceof SCOPE_TYPES.element) {
          resultLog = `WebdriverIO.Element<${elem.elementId || elem.selector}>`;
        } else if (res instanceof SCOPE_TYPES.browser) {
          resultLog = "WebdriverIO.Browser";
        }
        log7.info("RESULT", resultLog);
        this.emit("result", { name, result: res });
      }).catch(() => {
      });
      return result;
    };
  };
  for (const eventCommand in EVENTHANDLER_FUNCTIONS) {
    prototype[eventCommand] = function(...args) {
      const method = eventCommand;
      if (method === "on" && args[0] === "dialog") {
        eventHandler.emit("_dialogListenerRegistered");
      }
      if (method === "off" && args[0] === "dialog") {
        eventHandler.emit("_dialogListenerRemoved");
      }
      eventHandler[method]?.(...args);
      return this;
    };
  }
  return unit;
}

// src/initializePlugin.ts
init_utils();
async function initializePlugin(name, type) {
  if (name[0] === "@" || isAbsolute(name)) {
    const service = await safeImport(name);
    if (service) {
      return service;
    }
  }
  if (typeof type !== "string") {
    throw new Error("No plugin type provided");
  }
  const scopedPlugin = await safeImport(`@wdio/${name.toLowerCase()}-${type}`);
  if (scopedPlugin) {
    return scopedPlugin;
  }
  const plugin = await safeImport(`wdio-${name.toLowerCase()}-${type}`);
  if (plugin) {
    return plugin;
  }
  throw new Error(
    `Couldn't find plugin "${name}" ${type}, neither as wdio scoped package "@wdio/${name.toLowerCase()}-${type}" nor as community package "wdio-${name.toLowerCase()}-${type}". Please make sure you have it installed!`
  );
}

// src/startWebDriver.ts
init_utils();
import logger5 from "@wdio/logger";
var log4 = logger5("@wdio/utils");
async function startWebDriver2(options) {
  if (definesRemoteDriver(options)) {
    log4.info(`Connecting to existing driver at ${options.protocol}://${options.hostname}:${options.port}${options.path}`);
    return;
  }
  if (globalThis.process) {
    const { startWebDriver: startWebDriver3 } = await Promise.resolve().then(() => (init_node(), node_exports));
    return startWebDriver3(options);
  }
  throw new Error("Please provide a valid `hostname` and `port` to start WebDriver sessions in the browser!");
}

// src/initializeServices.ts
import logger6 from "@wdio/logger";
var log5 = logger6("@wdio/utils:initializeServices");
async function initializeServices(services) {
  const initializedServices = [];
  for (const [serviceName, serviceConfig = {}] of services) {
    if (typeof serviceName === "object") {
      log5.debug("initialize custom initiated service");
      initializedServices.push([serviceName, {}]);
      continue;
    }
    if (typeof serviceName === "function") {
      log5.debug(`initialize custom service "${serviceName.name}"`);
      initializedServices.push([serviceName, serviceConfig]);
      continue;
    }
    log5.debug(`initialize service "${serviceName}" as NPM package`);
    const service = await initializePlugin(serviceName, "service");
    initializedServices.push([service, serviceConfig, serviceName]);
  }
  return initializedServices;
}
function sanitizeServiceArray(service) {
  return Array.isArray(service) ? service : [service, {}];
}
async function initializeLauncherService(config, caps) {
  const ignoredWorkerServices = [];
  const launcherServices = [];
  let serviceLabelToBeInitialised = "unknown";
  try {
    const services = await initializeServices(config.services.map(sanitizeServiceArray));
    for (const [service, serviceConfig, serviceName] of services) {
      if (typeof service === "object" && !serviceName) {
        serviceLabelToBeInitialised = "object";
        launcherServices.push(service);
        continue;
      }
      const Launcher = service.launcher;
      if (typeof Launcher === "function" && serviceName) {
        serviceLabelToBeInitialised = `"${serviceName}"`;
        launcherServices.push(new Launcher(serviceConfig, caps, config));
      }
      if (typeof service === "function" && !serviceName) {
        serviceLabelToBeInitialised = `"${service.constructor?.name || service.toString()}"`;
        launcherServices.push(new service(serviceConfig, caps, config));
      }
      if (serviceName && typeof service.default !== "function" && typeof service !== "function") {
        ignoredWorkerServices.push(serviceName);
      }
    }
  } catch (err) {
    throw new Error(`Failed to initialise launcher service ${serviceLabelToBeInitialised}: ${err.stack}`);
  }
  return { ignoredWorkerServices, launcherServices };
}
async function initializeWorkerService(config, caps, ignoredWorkerServices = []) {
  let serviceLabelToBeInitialised = "unknown";
  const initializedServices = [];
  const workerServices = config.services.map(sanitizeServiceArray).filter(([serviceName]) => !ignoredWorkerServices.includes(serviceName));
  try {
    const services = await initializeServices(workerServices);
    for (const [service, serviceConfig, serviceName] of services) {
      if (typeof service === "object" && !serviceName) {
        serviceLabelToBeInitialised = "object";
        initializedServices.push(service);
        continue;
      }
      const Service = service.default || service;
      if (typeof Service === "function") {
        serviceLabelToBeInitialised = serviceName || Service.constructor?.name || Service.toString();
        initializedServices.push(new Service(serviceConfig, caps, config));
        continue;
      }
    }
    return initializedServices;
  } catch (err) {
    throw new Error(`Failed to initialise service ${serviceLabelToBeInitialised}: ${err.stack}`);
  }
}

// src/index.ts
init_utils();

// src/shim.ts
import logger7 from "@wdio/logger";

// src/pIteration.ts
var pIteration_exports = {};
__export(pIteration_exports, {
  every: () => every,
  everySeries: () => everySeries,
  filter: () => filter,
  filterSeries: () => filterSeries,
  find: () => find,
  findIndex: () => findIndex,
  findIndexSeries: () => findIndexSeries,
  findSeries: () => findSeries,
  forEach: () => forEach,
  forEachSeries: () => forEachSeries,
  map: () => map,
  mapSeries: () => mapSeries,
  reduce: () => reduce,
  some: () => some,
  someSeries: () => someSeries
});
var forEach = async (array, callback, thisArg) => {
  const promiseArray = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      const p = Promise.resolve(array[i]).then((currentValue) => {
        return callback.call(thisArg || void 0, currentValue, i, array);
      });
      promiseArray.push(p);
    }
  }
  await Promise.all(promiseArray);
};
var forEachSeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      await callback.call(thisArg || void 0, await array[i], i, array);
    }
  }
};
var map = async (array, callback, thisArg) => {
  const promiseArray = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      promiseArray[i] = Promise.resolve(array[i]).then((currentValue) => {
        return callback.call(thisArg || void 0, currentValue, i, array);
      });
    }
  }
  return Promise.all(promiseArray);
};
var mapSeries = async (array, callback, thisArg) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      result[i] = await callback.call(thisArg || void 0, await array[i], i, array);
    }
  }
  return result;
};
var find = (array, callback, thisArg) => {
  return new Promise((resolve, reject) => {
    if (array.length === 0) {
      return resolve(void 0);
    }
    let counter = 1;
    for (let i = 0; i < array.length; i++) {
      const check = (found) => {
        if (found) {
          resolve(array[i]);
        } else if (counter === array.length) {
          resolve(void 0);
        }
        counter++;
      };
      Promise.resolve(array[i]).then((elem) => callback.call(thisArg || void 0, elem, i, array)).then(check).catch(reject);
    }
  });
};
var findSeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (await callback.call(thisArg || void 0, await array[i], i, array)) {
      return array[i];
    }
  }
};
var findIndex = (array, callback, thisArg) => {
  return new Promise((resolve, reject) => {
    if (array.length === 0) {
      return resolve(-1);
    }
    let counter = 1;
    for (let i = 0; i < array.length; i++) {
      const check = (found) => {
        if (found) {
          resolve(i);
        } else if (counter === array.length) {
          resolve(-1);
        }
        counter++;
      };
      Promise.resolve(array[i]).then((elem) => callback.call(thisArg || void 0, elem, i, array)).then(check).catch(reject);
    }
  });
};
var findIndexSeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (await callback.call(thisArg || void 0, await array[i], i, array)) {
      return i;
    }
  }
};
var some = (array, callback, thisArg) => {
  return new Promise((resolve, reject) => {
    if (array.length === 0) {
      return resolve(false);
    }
    let counter = 1;
    for (let i = 0; i < array.length; i++) {
      if (!(i in array)) {
        counter++;
        continue;
      }
      const check = (found) => {
        if (found) {
          resolve(true);
        } else if (counter === array.length) {
          resolve(false);
        }
        counter++;
      };
      Promise.resolve(array[i]).then((elem) => callback.call(thisArg || void 0, elem, i, array)).then(check).catch(reject);
    }
  });
};
var someSeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (i in array && await callback.call(thisArg || void 0, await array[i], i, array)) {
      return true;
    }
  }
  return false;
};
var every = (array, callback, thisArg) => {
  return new Promise((resolve, reject) => {
    if (array.length === 0) {
      return resolve(true);
    }
    let counter = 1;
    for (let i = 0; i < array.length; i++) {
      if (!(i in array)) {
        counter++;
        continue;
      }
      const check = (found) => {
        if (!found) {
          resolve(false);
        } else if (counter === array.length) {
          resolve(true);
        }
        counter++;
      };
      Promise.resolve(array[i]).then((elem) => callback.call(thisArg || void 0, elem, i, array)).then(check).catch(reject);
    }
  });
};
var everySeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (i in array && !await callback.call(thisArg || void 0, await array[i], i, array)) {
      return false;
    }
  }
  return true;
};
var filter = (array, callback, thisArg) => {
  return new Promise((resolve, reject) => {
    const promiseArray = [];
    for (let i = 0; i < array.length; i++) {
      if (i in array) {
        promiseArray[i] = Promise.resolve(array[i]).then((currentValue) => {
          return callback.call(thisArg || void 0, currentValue, i, array);
        }).catch(reject);
      }
    }
    return Promise.all(
      promiseArray.map(async (p, i) => {
        if (await p) {
          return await array[i];
        }
        return void 0;
      })
    ).then(
      (result) => result.filter((val) => typeof val !== "undefined")
    ).then(resolve, reject);
  });
};
var filterSeries = async (array, callback, thisArg) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array && await callback.call(thisArg || void 0, await array[i], i, array)) {
      result.push(await array[i]);
    }
  }
  return result;
};
var reduce = async (array, callback, initialValue) => {
  if (array.length === 0 && initialValue === void 0) {
    throw TypeError("Reduce of empty array with no initial value");
  }
  let i;
  let previousValue;
  if (initialValue !== void 0) {
    previousValue = initialValue;
    i = 0;
  } else {
    previousValue = array[0];
    i = 1;
  }
  for (i; i < array.length; i++) {
    if (i in array) {
      previousValue = await callback(await previousValue, await array[i], i, array);
    }
  }
  return previousValue;
};

// src/shim.ts
init_utils();
var log6 = logger7("@wdio/utils:shim");
var inCommandHook = false;
var ELEMENT_QUERY_COMMANDS = [
  "$",
  "$$",
  "custom$",
  "custom$$",
  "shadow$",
  "shadow$$",
  "react$",
  "react$$",
  "nextElement",
  "previousElement",
  "parentElement"
];
var ELEMENT_PROPS = [
  "elementId",
  "error",
  "selector",
  "parent",
  "index",
  "isReactElement",
  "length"
];
var ACTION_COMMANDS = ["action", "actions"];
var PROMISE_METHODS = ["then", "catch", "finally"];
var ELEMENT_RETURN_COMMANDS = ["getElement", "getElements"];
var TIME_BUFFER = 3;
async function executeHooksWithArgs(hookName, hooks = [], args = []) {
  if (!Array.isArray(hooks)) {
    hooks = [hooks];
  }
  if (!Array.isArray(args)) {
    args = [args];
  }
  const hooksPromises = hooks.map((hook) => new Promise((resolve, reject) => {
    let result2;
    try {
      result2 = hook.apply(this, args);
    } catch (e) {
      if (/^(sync|async) skip; aborting execution$/.test(e.message)) {
        return reject();
      }
      if (/^=> marked Pending/.test(e)) {
        return reject(e);
      }
      log6.error(e.stack);
      return resolve(e);
    }
    if (result2 && typeof result2.then === "function") {
      return result2.then(resolve, (e) => {
        log6.error(e.stack || e.message);
        resolve(e);
      });
    }
    resolve(result2);
  }));
  const start = Date.now();
  const result = await Promise.all(hooksPromises);
  if (hooksPromises.length) {
    log6.debug(`Finished to run "${hookName}" hook in ${Date.now() - start}ms`);
  }
  return result;
}
function wrapCommand(commandName, fn) {
  async function wrapCommandFn(...args) {
    const beforeHookArgs = [commandName, args];
    if (!inCommandHook && this.options.beforeCommand) {
      inCommandHook = true;
      await executeHooksWithArgs.call(this, "beforeCommand", this.options.beforeCommand, beforeHookArgs);
      inCommandHook = false;
    }
    let commandResult;
    let commandError;
    try {
      commandResult = await fn.apply(this, args);
    } catch (err) {
      commandError = err;
    }
    if (!inCommandHook && this.options.afterCommand) {
      inCommandHook = true;
      const afterHookArgs = [...beforeHookArgs, commandResult, commandError];
      await executeHooksWithArgs.call(this, "afterCommand", this.options.afterCommand, afterHookArgs);
      inCommandHook = false;
    }
    if (commandError) {
      throw commandError;
    }
    return commandResult;
  }
  function wrapElementFn(promise, cmd, args, prevInnerArgs) {
    return new Proxy(
      Promise.resolve(promise).then((ctx) => cmd.call(ctx, ...args)),
      {
        get: (target, prop) => {
          if (typeof prop === "symbol") {
            return () => ({
              i: 0,
              target,
              async next() {
                const elems = await this.target;
                if (!Array.isArray(elems)) {
                  throw new Error("Can not iterate over non array");
                }
                if (this.i < elems.length) {
                  return { value: elems[this.i++], done: false };
                }
                return { done: true };
              }
            });
          }
          const numValue = parseInt(prop, 10);
          if (!isNaN(numValue)) {
            return wrapElementFn(
              target,
              /**
               * `this` is an array of WebdriverIO elements
               */
              function(index) {
                if (index >= this.length) {
                  const browser = getBrowserObject(this);
                  return browser.waitUntil(async () => {
                    const elems = await this.parent[this.foundWith](this.selector);
                    if (elems.length > index) {
                      return elems[index];
                    }
                    return false;
                  }, {
                    timeout: browser.options.waitforTimeout,
                    timeoutMsg: `Index out of bounds! $$(${this.selector}) returned only ${this.length} elements.`
                  });
                }
                return this[index];
              },
              [prop],
              { prop, args }
            );
          }
          if (ELEMENT_QUERY_COMMANDS.includes(prop) || prop.endsWith("$")) {
            return wrapCommand(prop, function(...args2) {
              return this[prop].apply(this, args2);
            });
          }
          if (commandName.endsWith("$$") && typeof pIteration_exports[prop] === "function") {
            return (mapIterator) => wrapElementFn(
              target,
              function(mapIterator2) {
                return pIteration_exports[prop](this, mapIterator2);
              },
              [mapIterator]
            );
          }
          if (ELEMENT_PROPS.includes(prop)) {
            return target.then((res) => res[prop]);
          }
          if (PROMISE_METHODS.includes(prop)) {
            return target[prop].bind(target);
          }
          if (ELEMENT_RETURN_COMMANDS.includes(prop)) {
            return () => target;
          }
          return (...args2) => target.then(async (elem) => {
            if (!elem) {
              let errMsg = "Element could not be found";
              const prevElem = await promise;
              if (Array.isArray(prevElem) && prevInnerArgs && prevInnerArgs.prop === "get") {
                errMsg = `Index out of bounds! $$(${prevInnerArgs.args[0]}) returned only ${prevElem.length} elements.`;
              }
              throw new Error(errMsg);
            }
            if (prop === "toJSON") {
              return { ELEMENT: elem.elementId };
            }
            if (typeof elem[prop] !== "function") {
              throw new Error(`Can't call "${prop}" on element with selector "${elem.selector}", it is not a function`);
            }
            return elem[prop](...args2);
          });
        }
      }
    );
  }
  function chainElementQuery(...args) {
    return wrapElementFn(this, wrapCommandFn, args);
  }
  return function(...args) {
    const command = ELEMENT_QUERY_COMMANDS.includes(commandName) || commandName.endsWith("$") ? chainElementQuery : ACTION_COMMANDS.includes(commandName) ? fn : wrapCommandFn;
    return command.apply(this, args);
  };
}
async function executeAsync(fn, retries, args = [], timeout = 2e4) {
  this.wdioRetries = retries.attempts;
  try {
    const _timeout = (this?._runnable?._timeout || globalThis.jasmine?.DEFAULT_TIMEOUT_INTERVAL || timeout) - TIME_BUFFER;
    let done = false;
    const result = await Promise.race([
      fn.apply(this, args),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (done) {
            resolve();
          } else {
            reject(new Error("Timeout"));
          }
        }, _timeout);
      })
    ]);
    done = true;
    if (result !== null && typeof result === "object" && "finally" in result && typeof result.finally === "function") {
      result.catch((err) => err);
    }
    return await result;
  } catch (err) {
    if (retries.limit > retries.attempts) {
      retries.attempts++;
      return await executeAsync.call(this, fn, retries, args);
    }
    throw err;
  }
}

// src/test-framework/errorHandler.ts
var logHookError = (hookName, hookResults = [], cid) => {
  const result = hookResults.find((result2) => result2 instanceof Error);
  if (typeof result === "undefined") {
    return;
  }
  const error = { message: result.message };
  const content = {
    cid,
    error,
    fullTitle: `${hookName} Hook`,
    type: "hook",
    state: "fail"
  };
  if (globalThis.process && typeof globalThis.process.send === "function") {
    globalThis.process.send({
      origin: "reporter",
      name: "printFailureMessage",
      content
    });
  }
};

// src/test-framework/testFnWrapper.ts
var STACKTRACE_FILTER = [
  "node_modules/webdriver/",
  "node_modules/webdriverio/",
  "node_modules/@wdio/",
  "(internal/process/task",
  "(node:internal/process/task"
];
var testFnWrapper = function(...args) {
  return testFrameworkFnWrapper.call(this, { executeHooksWithArgs, executeAsync }, ...args);
};
var testFrameworkFnWrapper = async function({ executeHooksWithArgs: executeHooksWithArgs2, executeAsync: executeAsync2 }, type, { specFn, specFnArgs }, { beforeFn, beforeFnArgs }, { afterFn, afterFnArgs }, cid, repeatTest = 0, hookName, timeout) {
  const retries = { attempts: 0, limit: repeatTest };
  const beforeArgs = beforeFnArgs(this);
  if (type === "Hook" && hookName) {
    beforeArgs.push(hookName);
  }
  await logHookError(`Before${type}`, await executeHooksWithArgs2(`before${type}`, beforeFn, beforeArgs), cid);
  let result;
  let error;
  const testStart = Date.now();
  try {
    result = await executeAsync2.call(this, specFn, retries, specFnArgs, timeout);
    if (globalThis._jasmineTestResult !== void 0) {
      result = globalThis._jasmineTestResult;
      globalThis._jasmineTestResult = void 0;
    }
    if (globalThis._wdioDynamicJasmineResultErrorList?.length > 0) {
      globalThis._wdioDynamicJasmineResultErrorList[0].stack = filterStackTrace(globalThis._wdioDynamicJasmineResultErrorList[0].stack);
      error = globalThis._wdioDynamicJasmineResultErrorList[0];
      globalThis._wdioDynamicJasmineResultErrorList = void 0;
    }
  } catch (err) {
    if (err.stack) {
      err.stack = filterStackTrace(err.stack);
    }
    error = err;
  }
  const duration = Date.now() - testStart;
  const afterArgs = afterFnArgs(this);
  afterArgs.push({
    retries,
    error,
    result,
    duration,
    passed: !error
  });
  if (type === "Hook" && hookName) {
    afterArgs.push(hookName);
  }
  await logHookError(`After${type}`, await executeHooksWithArgs2(`after${type}`, afterFn, [...afterArgs]), cid);
  if (error && !error.matcherName) {
    throw error;
  }
  return result;
};
var filterStackTrace = (stack) => {
  return stack.split("\n").filter((line) => !STACKTRACE_FILTER.some((l) => line.includes(l))).map((line) => line.replace(/\?invalidateCache=(\d\.\d+|\d)/g, "")).join("\n");
};

// src/test-framework/testInterfaceWrapper.ts
init_utils();
var MOCHA_COMMANDS = ["skip", "only"];
var runHook = function(hookFn, origFn, beforeFn, beforeFnArgs, afterFn, afterFnArgs, cid, repeatTest, timeout) {
  const wrappedHook = function(...hookFnArgs) {
    return testFnWrapper.call(
      this,
      "Hook",
      {
        specFn: hookFn,
        specFnArgs: filterSpecArgs(hookFnArgs)
      },
      {
        beforeFn,
        beforeFnArgs
      },
      {
        afterFn,
        afterFnArgs
      },
      cid,
      repeatTest,
      origFn.name
    );
  };
  wrappedHook.toString = () => hookFn.toString();
  return origFn(wrappedHook, timeout);
};
var runSpec = function(specTitle, specFn, origFn, beforeFn, beforeFnArgs, afterFn, afterFnArgs, cid, repeatTest, timeout) {
  const wrappedFn = function(...specFnArgs) {
    return testFnWrapper.call(
      this,
      "Test",
      {
        specFn,
        specFnArgs: filterSpecArgs(specFnArgs)
      },
      {
        beforeFn,
        beforeFnArgs
      },
      {
        afterFn,
        afterFnArgs
      },
      cid,
      repeatTest
    );
  };
  wrappedFn.toString = () => specFn.toString();
  return origFn(specTitle, wrappedFn, timeout);
};
var wrapTestFunction = function(origFn, isSpec, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid) {
  return function(...specArguments) {
    let retryCnt = typeof specArguments[specArguments.length - 1] === "number" ? specArguments.pop() : 0;
    let timeout = globalThis.jasmine?.DEFAULT_TIMEOUT_INTERVAL;
    if (globalThis.jasmine) {
      if (typeof specArguments[specArguments.length - 1] === "number") {
        timeout = specArguments.pop();
      } else {
        timeout = retryCnt;
        retryCnt = 0;
      }
    }
    const specFn = typeof specArguments[0] === "function" ? specArguments.shift() : typeof specArguments[1] === "function" ? specArguments[1] : void 0;
    const specTitle = specArguments[0];
    if (isSpec) {
      if (specFn) {
        return runSpec(
          specTitle,
          specFn,
          origFn,
          beforeFn,
          beforeArgsFn,
          afterFn,
          afterArgsFn,
          cid,
          retryCnt,
          timeout
        );
      }
      return origFn(specTitle);
    }
    return runHook(
      specFn,
      origFn,
      beforeFn,
      beforeArgsFn,
      afterFn,
      afterArgsFn,
      cid,
      retryCnt,
      timeout
    );
  };
};
var wrapGlobalTestMethod = function(isSpec, beforeFn, beforeArgsFn, afterFn, afterArgsFn, fnName, cid, scope = globalThis) {
  const origFn = scope[fnName];
  scope[fnName] = wrapTestFunction(
    origFn,
    isSpec,
    beforeFn,
    beforeArgsFn,
    afterFn,
    afterArgsFn,
    cid
  );
  addMochaCommands(origFn, scope[fnName]);
};
function addMochaCommands(origFn, newFn) {
  MOCHA_COMMANDS.forEach((commandName) => {
    if (typeof origFn[commandName] === "function") {
      newFn[commandName] = origFn[commandName];
    }
  });
}

// src/envDetector.ts
init_constants();
var MOBILE_BROWSER_NAMES = ["ipad", "iphone", "android"];
var MOBILE_CAPABILITIES = [
  "appium-version",
  "appiumVersion",
  "device-type",
  "deviceType",
  "app",
  "appArguments",
  "device-orientation",
  "deviceOrientation",
  "deviceName",
  "automationName"
];
function isW3C(capabilities) {
  if (!capabilities) {
    return false;
  }
  const isAppium = Boolean(
    capabilities["appium:automationName"] || capabilities["appium:deviceName"] || capabilities["appium:appiumVersion"]
  );
  const hasW3CCaps = Boolean(
    /**
     * safari docker image may not provide a platformName therefore
     * check one of the available "platformName" or "browserVersion"
     */
    (capabilities.platformName || capabilities.browserVersion) && /**
     * local safari and BrowserStack don't provide platformVersion therefore
     * check also if setWindowRect is provided
     */
    (capabilities["appium:platformVersion"] || Object.prototype.hasOwnProperty.call(capabilities, "setWindowRect"))
  );
  const hasWebdriverFlag = Boolean(capabilities["ms:experimental-webdriver"]);
  return Boolean(hasW3CCaps || isAppium || hasWebdriverFlag);
}
function isChrome2(capabilities) {
  if (!capabilities) {
    return false;
  }
  return Boolean(
    capabilities["goog:chromeOptions"] && (capabilities.browserName === "chrome" || capabilities.browserName === "chrome-headless-shell")
  );
}
function isEdge2(capabilities) {
  if (!capabilities) {
    return false;
  }
  return Boolean(capabilities.browserName && SUPPORTED_BROWSERNAMES.edge.includes(capabilities.browserName.toLowerCase()) || capabilities["ms:edgeOptions"]);
}
function isFirefox2(capabilities) {
  if (!capabilities) {
    return false;
  }
  return capabilities.browserName === "firefox" || Boolean(Object.keys(capabilities).find((cap) => cap.startsWith("moz:")));
}
function isMobile(capabilities) {
  const browserName = (capabilities.browserName || "").toLowerCase();
  const bsOptions = capabilities["bstack:options"] || {};
  const browserstackBrowserName = (bsOptions.browserName || "").toLowerCase();
  return Boolean(
    /**
     * If the device is ios, tvos or android, the device might be mobile.
     */
    capabilities.platformName && capabilities.platformName.match(/ios/i) || capabilities.platformName && capabilities.platformName.match(/tvos/i) || capabilities.platformName && capabilities.platformName.match(/android/i) || /ios/i.test(bsOptions.platformName || "") || /tvos/i.test(bsOptions.platformName || "") || /android/i.test(bsOptions.platformName || "") || /**
     * capabilities contain mobile only specific capabilities
     */
    Object.keys(capabilities).find((cap) => MOBILE_CAPABILITIES.includes(cap) || MOBILE_CAPABILITIES.map((c) => `appium:${c}`).includes(cap)) || /**
     * browserName is empty (and eventually app is defined)
     */
    capabilities.browserName === "" || bsOptions.browserName === "" || /**
     * browserName is a mobile browser
     */
    MOBILE_BROWSER_NAMES.includes(browserName) || MOBILE_BROWSER_NAMES.includes(browserstackBrowserName)
  );
}
function isIOS(capabilities) {
  const bsOptions = capabilities?.["bstack:options"] || {};
  if (!capabilities) {
    return false;
  }
  return Boolean(
    capabilities.platformName && capabilities.platformName.match(/iOS/i) || capabilities["appium:deviceName"] && capabilities["appium:deviceName"].match(/(iPad|iPhone)/i) || /iOS/i.test(bsOptions.platformName || "") || /(iPad|iPhone)/i.test(bsOptions.deviceName || "")
  );
}
function isAndroid(capabilities) {
  const bsOptions = capabilities?.["bstack:options"] || {};
  if (!capabilities) {
    return false;
  }
  return Boolean(
    capabilities.platformName && capabilities.platformName.match(/Android/i) || /Android/i.test(bsOptions.platformName || "") || /Android/i.test(bsOptions.browserName || "") || capabilities.browserName && capabilities.browserName.match(/Android/i)
  );
}
function isSauce(capabilities) {
  if (!capabilities) {
    return false;
  }
  const caps = "alwaysMatch" in capabilities ? capabilities.alwaysMatch : capabilities;
  return Boolean(
    caps["sauce:options"] && caps["sauce:options"].extendedDebugging
  );
}
function isBidi(capabilities) {
  if (!capabilities) {
    return false;
  }
  return typeof capabilities.webSocketUrl === "string";
}
function isSeleniumStandalone(capabilities) {
  if (!capabilities) {
    return false;
  }
  return (
    /**
     * Selenium v3 and below
     */
    // @ts-expect-error outdated JSONWP capabilities
    Boolean(capabilities["webdriver.remote.sessionid"]) || /**
     * Selenium v4 and up
     */
    Boolean(capabilities["se:cdp"])
  );
}
function isChromium(capabilities) {
  if (!capabilities) {
    return false;
  }
  return isChrome2(capabilities) || isEdge2(capabilities);
}
function capabilitiesEnvironmentDetector(capabilities) {
  return {
    isChrome: isChrome2(capabilities),
    isFirefox: isFirefox2(capabilities),
    isMobile: isMobile(capabilities),
    isIOS: isIOS(capabilities),
    isAndroid: isAndroid(capabilities),
    isSauce: isSauce(capabilities),
    isBidi: isBidi(capabilities),
    isChromium: isChromium(capabilities)
  };
}
function sessionEnvironmentDetector({
  capabilities,
  requestedCapabilities
}) {
  return {
    isW3C: isW3C(capabilities),
    isChrome: isChrome2(capabilities),
    isFirefox: isFirefox2(capabilities),
    isMobile: isMobile(capabilities),
    isIOS: isIOS(capabilities),
    isAndroid: isAndroid(capabilities),
    isSauce: isSauce(requestedCapabilities),
    isSeleniumStandalone: isSeleniumStandalone(capabilities),
    isBidi: isBidi(capabilities),
    isChromium: isChromium(capabilities)
  };
}

// src/index.ts
init_constants();
export {
  HOOK_DEFINITION,
  UNICODE_CHARACTERS,
  pIteration_exports as asyncIterators,
  capabilitiesEnvironmentDetector,
  commandCallStructure,
  enableFileLogging,
  executeAsync,
  executeHooksWithArgs,
  getArgumentType,
  getBrowserObject,
  initializeLauncherService,
  initializePlugin,
  initializeWorkerService,
  isAppiumCapability,
  isBidi,
  isFunctionAsync,
  isValidParameter,
  isW3C,
  safeImport,
  sessionEnvironmentDetector,
  sleep,
  startWebDriver2 as startWebDriver,
  testFnWrapper,
  transformCommandLogResult,
  userImport,
  WebDriver as webdriverMonad,
  wrapCommand,
  wrapGlobalTestMethod
};
