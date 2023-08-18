require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 4812:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports =
{
  parallel      : __nccwpck_require__(8210),
  serial        : __nccwpck_require__(445),
  serialOrdered : __nccwpck_require__(3578)
};


/***/ }),

/***/ 1700:
/***/ ((module) => {

// API
module.exports = abort;

/**
 * Aborts leftover active jobs
 *
 * @param {object} state - current state object
 */
function abort(state)
{
  Object.keys(state.jobs).forEach(clean.bind(state));

  // reset leftover jobs
  state.jobs = {};
}

/**
 * Cleans up leftover job by invoking abort function for the provided job id
 *
 * @this  state
 * @param {string|number} key - job id to abort
 */
function clean(key)
{
  if (typeof this.jobs[key] == 'function')
  {
    this.jobs[key]();
  }
}


/***/ }),

/***/ 2794:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var defer = __nccwpck_require__(5295);

// API
module.exports = async;

/**
 * Runs provided callback asynchronously
 * even if callback itself is not
 *
 * @param   {function} callback - callback to invoke
 * @returns {function} - augmented callback
 */
function async(callback)
{
  var isAsync = false;

  // check if async happened
  defer(function() { isAsync = true; });

  return function async_callback(err, result)
  {
    if (isAsync)
    {
      callback(err, result);
    }
    else
    {
      defer(function nextTick_callback()
      {
        callback(err, result);
      });
    }
  };
}


/***/ }),

/***/ 5295:
/***/ ((module) => {

module.exports = defer;

/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */
function defer(fn)
{
  var nextTick = typeof setImmediate == 'function'
    ? setImmediate
    : (
      typeof process == 'object' && typeof process.nextTick == 'function'
      ? process.nextTick
      : null
    );

  if (nextTick)
  {
    nextTick(fn);
  }
  else
  {
    setTimeout(fn, 0);
  }
}


/***/ }),

/***/ 9023:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var async = __nccwpck_require__(2794)
  , abort = __nccwpck_require__(1700)
  ;

// API
module.exports = iterate;

/**
 * Iterates over each job object
 *
 * @param {array|object} list - array or object (named list) to iterate over
 * @param {function} iterator - iterator to run
 * @param {object} state - current job status
 * @param {function} callback - invoked when all elements processed
 */
function iterate(list, iterator, state, callback)
{
  // store current index
  var key = state['keyedList'] ? state['keyedList'][state.index] : state.index;

  state.jobs[key] = runJob(iterator, key, list[key], function(error, output)
  {
    // don't repeat yourself
    // skip secondary callbacks
    if (!(key in state.jobs))
    {
      return;
    }

    // clean up jobs
    delete state.jobs[key];

    if (error)
    {
      // don't process rest of the results
      // stop still active jobs
      // and reset the list
      abort(state);
    }
    else
    {
      state.results[key] = output;
    }

    // return salvaged results
    callback(error, state.results);
  });
}

/**
 * Runs iterator over provided job element
 *
 * @param   {function} iterator - iterator to invoke
 * @param   {string|number} key - key/index of the element in the list of jobs
 * @param   {mixed} item - job description
 * @param   {function} callback - invoked after iterator is done with the job
 * @returns {function|mixed} - job abort function or something else
 */
function runJob(iterator, key, item, callback)
{
  var aborter;

  // allow shortcut if iterator expects only two arguments
  if (iterator.length == 2)
  {
    aborter = iterator(item, async(callback));
  }
  // otherwise go with full three arguments
  else
  {
    aborter = iterator(item, key, async(callback));
  }

  return aborter;
}


/***/ }),

/***/ 2474:
/***/ ((module) => {

// API
module.exports = state;

/**
 * Creates initial state object
 * for iteration over list
 *
 * @param   {array|object} list - list to iterate over
 * @param   {function|null} sortMethod - function to use for keys sort,
 *                                     or `null` to keep them as is
 * @returns {object} - initial state object
 */
function state(list, sortMethod)
{
  var isNamedList = !Array.isArray(list)
    , initState =
    {
      index    : 0,
      keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
      jobs     : {},
      results  : isNamedList ? {} : [],
      size     : isNamedList ? Object.keys(list).length : list.length
    }
    ;

  if (sortMethod)
  {
    // sort array keys based on it's values
    // sort object's keys just on own merit
    initState.keyedList.sort(isNamedList ? sortMethod : function(a, b)
    {
      return sortMethod(list[a], list[b]);
    });
  }

  return initState;
}


/***/ }),

/***/ 7942:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var abort = __nccwpck_require__(1700)
  , async = __nccwpck_require__(2794)
  ;

// API
module.exports = terminator;

/**
 * Terminates jobs in the attached state context
 *
 * @this  AsyncKitState#
 * @param {function} callback - final callback to invoke after termination
 */
function terminator(callback)
{
  if (!Object.keys(this.jobs).length)
  {
    return;
  }

  // fast forward iteration index
  this.index = this.size;

  // abort jobs
  abort(this);

  // send back results we have so far
  async(callback)(null, this.results);
}


/***/ }),

/***/ 8210:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var iterate    = __nccwpck_require__(9023)
  , initState  = __nccwpck_require__(2474)
  , terminator = __nccwpck_require__(7942)
  ;

// Public API
module.exports = parallel;

/**
 * Runs iterator over provided array elements in parallel
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function parallel(list, iterator, callback)
{
  var state = initState(list);

  while (state.index < (state['keyedList'] || list).length)
  {
    iterate(list, iterator, state, function(error, result)
    {
      if (error)
      {
        callback(error, result);
        return;
      }

      // looks like it's the last one
      if (Object.keys(state.jobs).length === 0)
      {
        callback(null, state.results);
        return;
      }
    });

    state.index++;
  }

  return terminator.bind(state, callback);
}


/***/ }),

/***/ 445:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var serialOrdered = __nccwpck_require__(3578);

// Public API
module.exports = serial;

/**
 * Runs iterator over provided array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serial(list, iterator, callback)
{
  return serialOrdered(list, iterator, null, callback);
}


/***/ }),

/***/ 3578:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var iterate    = __nccwpck_require__(9023)
  , initState  = __nccwpck_require__(2474)
  , terminator = __nccwpck_require__(7942)
  ;

// Public API
module.exports = serialOrdered;
// sorting helpers
module.exports.ascending  = ascending;
module.exports.descending = descending;

/**
 * Runs iterator over provided sorted array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} sortMethod - custom sort function
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serialOrdered(list, iterator, sortMethod, callback)
{
  var state = initState(list, sortMethod);

  iterate(list, iterator, state, function iteratorHandler(error, result)
  {
    if (error)
    {
      callback(error, result);
      return;
    }

    state.index++;

    // are we there yet?
    if (state.index < (state['keyedList'] || list).length)
    {
      iterate(list, iterator, state, iteratorHandler);
      return;
    }

    // done here
    callback(null, state.results);
  });

  return terminator.bind(state, callback);
}

/*
 * -- Sort methods
 */

/**
 * sort helper to sort array elements in ascending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function ascending(a, b)
{
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * sort helper to sort array elements in descending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function descending(a, b)
{
  return -1 * ascending(a, b);
}


/***/ }),

/***/ 5443:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(3837);
var Stream = (__nccwpck_require__(2781).Stream);
var DelayedStream = __nccwpck_require__(8611);

module.exports = CombinedStream;
function CombinedStream() {
  this.writable = false;
  this.readable = true;
  this.dataSize = 0;
  this.maxDataSize = 2 * 1024 * 1024;
  this.pauseStreams = true;

  this._released = false;
  this._streams = [];
  this._currentStream = null;
  this._insideLoop = false;
  this._pendingNext = false;
}
util.inherits(CombinedStream, Stream);

CombinedStream.create = function(options) {
  var combinedStream = new this();

  options = options || {};
  for (var option in options) {
    combinedStream[option] = options[option];
  }

  return combinedStream;
};

CombinedStream.isStreamLike = function(stream) {
  return (typeof stream !== 'function')
    && (typeof stream !== 'string')
    && (typeof stream !== 'boolean')
    && (typeof stream !== 'number')
    && (!Buffer.isBuffer(stream));
};

CombinedStream.prototype.append = function(stream) {
  var isStreamLike = CombinedStream.isStreamLike(stream);

  if (isStreamLike) {
    if (!(stream instanceof DelayedStream)) {
      var newStream = DelayedStream.create(stream, {
        maxDataSize: Infinity,
        pauseStream: this.pauseStreams,
      });
      stream.on('data', this._checkDataSize.bind(this));
      stream = newStream;
    }

    this._handleErrors(stream);

    if (this.pauseStreams) {
      stream.pause();
    }
  }

  this._streams.push(stream);
  return this;
};

CombinedStream.prototype.pipe = function(dest, options) {
  Stream.prototype.pipe.call(this, dest, options);
  this.resume();
  return dest;
};

CombinedStream.prototype._getNext = function() {
  this._currentStream = null;

  if (this._insideLoop) {
    this._pendingNext = true;
    return; // defer call
  }

  this._insideLoop = true;
  try {
    do {
      this._pendingNext = false;
      this._realGetNext();
    } while (this._pendingNext);
  } finally {
    this._insideLoop = false;
  }
};

CombinedStream.prototype._realGetNext = function() {
  var stream = this._streams.shift();


  if (typeof stream == 'undefined') {
    this.end();
    return;
  }

  if (typeof stream !== 'function') {
    this._pipeNext(stream);
    return;
  }

  var getStream = stream;
  getStream(function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
      stream.on('data', this._checkDataSize.bind(this));
      this._handleErrors(stream);
    }

    this._pipeNext(stream);
  }.bind(this));
};

CombinedStream.prototype._pipeNext = function(stream) {
  this._currentStream = stream;

  var isStreamLike = CombinedStream.isStreamLike(stream);
  if (isStreamLike) {
    stream.on('end', this._getNext.bind(this));
    stream.pipe(this, {end: false});
    return;
  }

  var value = stream;
  this.write(value);
  this._getNext();
};

CombinedStream.prototype._handleErrors = function(stream) {
  var self = this;
  stream.on('error', function(err) {
    self._emitError(err);
  });
};

CombinedStream.prototype.write = function(data) {
  this.emit('data', data);
};

CombinedStream.prototype.pause = function() {
  if (!this.pauseStreams) {
    return;
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.pause) == 'function') this._currentStream.pause();
  this.emit('pause');
};

CombinedStream.prototype.resume = function() {
  if (!this._released) {
    this._released = true;
    this.writable = true;
    this._getNext();
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.resume) == 'function') this._currentStream.resume();
  this.emit('resume');
};

CombinedStream.prototype.end = function() {
  this._reset();
  this.emit('end');
};

CombinedStream.prototype.destroy = function() {
  this._reset();
  this.emit('close');
};

CombinedStream.prototype._reset = function() {
  this.writable = false;
  this._streams = [];
  this._currentStream = null;
};

CombinedStream.prototype._checkDataSize = function() {
  this._updateDataSize();
  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
  this._emitError(new Error(message));
};

CombinedStream.prototype._updateDataSize = function() {
  this.dataSize = 0;

  var self = this;
  this._streams.forEach(function(stream) {
    if (!stream.dataSize) {
      return;
    }

    self.dataSize += stream.dataSize;
  });

  if (this._currentStream && this._currentStream.dataSize) {
    this.dataSize += this._currentStream.dataSize;
  }
};

CombinedStream.prototype._emitError = function(err) {
  this._reset();
  this.emit('error', err);
};


/***/ }),

/***/ 4819:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(8025), __nccwpck_require__(250), __nccwpck_require__(4727), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var BlockCipher = C_lib.BlockCipher;
	    var C_algo = C.algo;

	    // Lookup tables
	    var SBOX = [];
	    var INV_SBOX = [];
	    var SUB_MIX_0 = [];
	    var SUB_MIX_1 = [];
	    var SUB_MIX_2 = [];
	    var SUB_MIX_3 = [];
	    var INV_SUB_MIX_0 = [];
	    var INV_SUB_MIX_1 = [];
	    var INV_SUB_MIX_2 = [];
	    var INV_SUB_MIX_3 = [];

	    // Compute lookup tables
	    (function () {
	        // Compute double table
	        var d = [];
	        for (var i = 0; i < 256; i++) {
	            if (i < 128) {
	                d[i] = i << 1;
	            } else {
	                d[i] = (i << 1) ^ 0x11b;
	            }
	        }

	        // Walk GF(2^8)
	        var x = 0;
	        var xi = 0;
	        for (var i = 0; i < 256; i++) {
	            // Compute sbox
	            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
	            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
	            SBOX[x] = sx;
	            INV_SBOX[sx] = x;

	            // Compute multiplication
	            var x2 = d[x];
	            var x4 = d[x2];
	            var x8 = d[x4];

	            // Compute sub bytes, mix columns tables
	            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
	            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
	            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
	            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
	            SUB_MIX_3[x] = t;

	            // Compute inv sub bytes, inv mix columns tables
	            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
	            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
	            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
	            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
	            INV_SUB_MIX_3[sx] = t;

	            // Compute next counter
	            if (!x) {
	                x = xi = 1;
	            } else {
	                x = x2 ^ d[d[d[x8 ^ x2]]];
	                xi ^= d[d[xi]];
	            }
	        }
	    }());

	    // Precomputed Rcon lookup
	    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

	    /**
	     * AES block cipher algorithm.
	     */
	    var AES = C_algo.AES = BlockCipher.extend({
	        _doReset: function () {
	            var t;

	            // Skip reset of nRounds has been set before and key did not change
	            if (this._nRounds && this._keyPriorReset === this._key) {
	                return;
	            }

	            // Shortcuts
	            var key = this._keyPriorReset = this._key;
	            var keyWords = key.words;
	            var keySize = key.sigBytes / 4;

	            // Compute number of rounds
	            var nRounds = this._nRounds = keySize + 6;

	            // Compute number of key schedule rows
	            var ksRows = (nRounds + 1) * 4;

	            // Compute key schedule
	            var keySchedule = this._keySchedule = [];
	            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
	                if (ksRow < keySize) {
	                    keySchedule[ksRow] = keyWords[ksRow];
	                } else {
	                    t = keySchedule[ksRow - 1];

	                    if (!(ksRow % keySize)) {
	                        // Rot word
	                        t = (t << 8) | (t >>> 24);

	                        // Sub word
	                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

	                        // Mix Rcon
	                        t ^= RCON[(ksRow / keySize) | 0] << 24;
	                    } else if (keySize > 6 && ksRow % keySize == 4) {
	                        // Sub word
	                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
	                    }

	                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
	                }
	            }

	            // Compute inv key schedule
	            var invKeySchedule = this._invKeySchedule = [];
	            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
	                var ksRow = ksRows - invKsRow;

	                if (invKsRow % 4) {
	                    var t = keySchedule[ksRow];
	                } else {
	                    var t = keySchedule[ksRow - 4];
	                }

	                if (invKsRow < 4 || ksRow <= 4) {
	                    invKeySchedule[invKsRow] = t;
	                } else {
	                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
	                                               INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
	                }
	            }
	        },

	        encryptBlock: function (M, offset) {
	            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
	        },

	        decryptBlock: function (M, offset) {
	            // Swap 2nd and 4th rows
	            var t = M[offset + 1];
	            M[offset + 1] = M[offset + 3];
	            M[offset + 3] = t;

	            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

	            // Inv swap 2nd and 4th rows
	            var t = M[offset + 1];
	            M[offset + 1] = M[offset + 3];
	            M[offset + 3] = t;
	        },

	        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
	            // Shortcut
	            var nRounds = this._nRounds;

	            // Get input, add round key
	            var s0 = M[offset]     ^ keySchedule[0];
	            var s1 = M[offset + 1] ^ keySchedule[1];
	            var s2 = M[offset + 2] ^ keySchedule[2];
	            var s3 = M[offset + 3] ^ keySchedule[3];

	            // Key schedule row counter
	            var ksRow = 4;

	            // Rounds
	            for (var round = 1; round < nRounds; round++) {
	                // Shift rows, sub bytes, mix columns, add round key
	                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
	                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
	                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
	                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

	                // Update state
	                s0 = t0;
	                s1 = t1;
	                s2 = t2;
	                s3 = t3;
	            }

	            // Shift rows, sub bytes, add round key
	            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
	            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
	            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
	            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

	            // Set output
	            M[offset]     = t0;
	            M[offset + 1] = t1;
	            M[offset + 2] = t2;
	            M[offset + 3] = t3;
	        },

	        keySize: 256/32
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
	     */
	    C.AES = BlockCipher._createHelper(AES);
	}());


	return CryptoJS.AES;

}));

/***/ }),

/***/ 714:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(4727));
	}
	else {}
}(this, function (CryptoJS) {

	/**
	 * Cipher core components.
	 */
	CryptoJS.lib.Cipher || (function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var WordArray = C_lib.WordArray;
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
	    var C_enc = C.enc;
	    var Utf8 = C_enc.Utf8;
	    var Base64 = C_enc.Base64;
	    var C_algo = C.algo;
	    var EvpKDF = C_algo.EvpKDF;

	    /**
	     * Abstract base cipher template.
	     *
	     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
	     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
	     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
	     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
	     */
	    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {WordArray} iv The IV to use for this operation.
	         */
	        cfg: Base.extend(),

	        /**
	         * Creates this cipher in encryption mode.
	         *
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {Cipher} A cipher instance.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
	         */
	        createEncryptor: function (key, cfg) {
	            return this.create(this._ENC_XFORM_MODE, key, cfg);
	        },

	        /**
	         * Creates this cipher in decryption mode.
	         *
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {Cipher} A cipher instance.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
	         */
	        createDecryptor: function (key, cfg) {
	            return this.create(this._DEC_XFORM_MODE, key, cfg);
	        },

	        /**
	         * Initializes a newly created cipher.
	         *
	         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @example
	         *
	         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
	         */
	        init: function (xformMode, key, cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Store transform mode and key
	            this._xformMode = xformMode;
	            this._key = key;

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this cipher to its initial state.
	         *
	         * @example
	         *
	         *     cipher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-cipher logic
	            this._doReset();
	        },

	        /**
	         * Adds data to be encrypted or decrypted.
	         *
	         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
	         *
	         * @return {WordArray} The data after processing.
	         *
	         * @example
	         *
	         *     var encrypted = cipher.process('data');
	         *     var encrypted = cipher.process(wordArray);
	         */
	        process: function (dataUpdate) {
	            // Append
	            this._append(dataUpdate);

	            // Process available blocks
	            return this._process();
	        },

	        /**
	         * Finalizes the encryption or decryption process.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
	         *
	         * @return {WordArray} The data after final processing.
	         *
	         * @example
	         *
	         *     var encrypted = cipher.finalize();
	         *     var encrypted = cipher.finalize('data');
	         *     var encrypted = cipher.finalize(wordArray);
	         */
	        finalize: function (dataUpdate) {
	            // Final data update
	            if (dataUpdate) {
	                this._append(dataUpdate);
	            }

	            // Perform concrete-cipher logic
	            var finalProcessedData = this._doFinalize();

	            return finalProcessedData;
	        },

	        keySize: 128/32,

	        ivSize: 128/32,

	        _ENC_XFORM_MODE: 1,

	        _DEC_XFORM_MODE: 2,

	        /**
	         * Creates shortcut functions to a cipher's object interface.
	         *
	         * @param {Cipher} cipher The cipher to create a helper for.
	         *
	         * @return {Object} An object with encrypt and decrypt shortcut functions.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
	         */
	        _createHelper: (function () {
	            function selectCipherStrategy(key) {
	                if (typeof key == 'string') {
	                    return PasswordBasedCipher;
	                } else {
	                    return SerializableCipher;
	                }
	            }

	            return function (cipher) {
	                return {
	                    encrypt: function (message, key, cfg) {
	                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
	                    },

	                    decrypt: function (ciphertext, key, cfg) {
	                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
	                    }
	                };
	            };
	        }())
	    });

	    /**
	     * Abstract base stream cipher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
	     */
	    var StreamCipher = C_lib.StreamCipher = Cipher.extend({
	        _doFinalize: function () {
	            // Process partial blocks
	            var finalProcessedBlocks = this._process(!!'flush');

	            return finalProcessedBlocks;
	        },

	        blockSize: 1
	    });

	    /**
	     * Mode namespace.
	     */
	    var C_mode = C.mode = {};

	    /**
	     * Abstract base block cipher mode template.
	     */
	    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
	        /**
	         * Creates this mode for encryption.
	         *
	         * @param {Cipher} cipher A block cipher instance.
	         * @param {Array} iv The IV words.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
	         */
	        createEncryptor: function (cipher, iv) {
	            return this.Encryptor.create(cipher, iv);
	        },

	        /**
	         * Creates this mode for decryption.
	         *
	         * @param {Cipher} cipher A block cipher instance.
	         * @param {Array} iv The IV words.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
	         */
	        createDecryptor: function (cipher, iv) {
	            return this.Decryptor.create(cipher, iv);
	        },

	        /**
	         * Initializes a newly created mode.
	         *
	         * @param {Cipher} cipher A block cipher instance.
	         * @param {Array} iv The IV words.
	         *
	         * @example
	         *
	         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
	         */
	        init: function (cipher, iv) {
	            this._cipher = cipher;
	            this._iv = iv;
	        }
	    });

	    /**
	     * Cipher Block Chaining mode.
	     */
	    var CBC = C_mode.CBC = (function () {
	        /**
	         * Abstract base CBC mode.
	         */
	        var CBC = BlockCipherMode.extend();

	        /**
	         * CBC encryptor.
	         */
	        CBC.Encryptor = CBC.extend({
	            /**
	             * Processes the data block at offset.
	             *
	             * @param {Array} words The data words to operate on.
	             * @param {number} offset The offset where the block starts.
	             *
	             * @example
	             *
	             *     mode.processBlock(data.words, offset);
	             */
	            processBlock: function (words, offset) {
	                // Shortcuts
	                var cipher = this._cipher;
	                var blockSize = cipher.blockSize;

	                // XOR and encrypt
	                xorBlock.call(this, words, offset, blockSize);
	                cipher.encryptBlock(words, offset);

	                // Remember this block to use with next block
	                this._prevBlock = words.slice(offset, offset + blockSize);
	            }
	        });

	        /**
	         * CBC decryptor.
	         */
	        CBC.Decryptor = CBC.extend({
	            /**
	             * Processes the data block at offset.
	             *
	             * @param {Array} words The data words to operate on.
	             * @param {number} offset The offset where the block starts.
	             *
	             * @example
	             *
	             *     mode.processBlock(data.words, offset);
	             */
	            processBlock: function (words, offset) {
	                // Shortcuts
	                var cipher = this._cipher;
	                var blockSize = cipher.blockSize;

	                // Remember this block to use with next block
	                var thisBlock = words.slice(offset, offset + blockSize);

	                // Decrypt and XOR
	                cipher.decryptBlock(words, offset);
	                xorBlock.call(this, words, offset, blockSize);

	                // This block becomes the previous block
	                this._prevBlock = thisBlock;
	            }
	        });

	        function xorBlock(words, offset, blockSize) {
	            var block;

	            // Shortcut
	            var iv = this._iv;

	            // Choose mixing block
	            if (iv) {
	                block = iv;

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            } else {
	                block = this._prevBlock;
	            }

	            // XOR blocks
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= block[i];
	            }
	        }

	        return CBC;
	    }());

	    /**
	     * Padding namespace.
	     */
	    var C_pad = C.pad = {};

	    /**
	     * PKCS #5/7 padding strategy.
	     */
	    var Pkcs7 = C_pad.Pkcs7 = {
	        /**
	         * Pads data using the algorithm defined in PKCS #5/7.
	         *
	         * @param {WordArray} data The data to pad.
	         * @param {number} blockSize The multiple that the data should be padded to.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
	         */
	        pad: function (data, blockSize) {
	            // Shortcut
	            var blockSizeBytes = blockSize * 4;

	            // Count padding bytes
	            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

	            // Create padding word
	            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

	            // Create padding
	            var paddingWords = [];
	            for (var i = 0; i < nPaddingBytes; i += 4) {
	                paddingWords.push(paddingWord);
	            }
	            var padding = WordArray.create(paddingWords, nPaddingBytes);

	            // Add padding
	            data.concat(padding);
	        },

	        /**
	         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
	         *
	         * @param {WordArray} data The data to unpad.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
	         */
	        unpad: function (data) {
	            // Get number of padding bytes from last byte
	            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

	            // Remove padding
	            data.sigBytes -= nPaddingBytes;
	        }
	    };

	    /**
	     * Abstract base block cipher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
	     */
	    var BlockCipher = C_lib.BlockCipher = Cipher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {Mode} mode The block mode to use. Default: CBC
	         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
	         */
	        cfg: Cipher.cfg.extend({
	            mode: CBC,
	            padding: Pkcs7
	        }),

	        reset: function () {
	            var modeCreator;

	            // Reset cipher
	            Cipher.reset.call(this);

	            // Shortcuts
	            var cfg = this.cfg;
	            var iv = cfg.iv;
	            var mode = cfg.mode;

	            // Reset block mode
	            if (this._xformMode == this._ENC_XFORM_MODE) {
	                modeCreator = mode.createEncryptor;
	            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
	                modeCreator = mode.createDecryptor;
	                // Keep at least one block in the buffer for unpadding
	                this._minBufferSize = 1;
	            }

	            if (this._mode && this._mode.__creator == modeCreator) {
	                this._mode.init(this, iv && iv.words);
	            } else {
	                this._mode = modeCreator.call(mode, this, iv && iv.words);
	                this._mode.__creator = modeCreator;
	            }
	        },

	        _doProcessBlock: function (words, offset) {
	            this._mode.processBlock(words, offset);
	        },

	        _doFinalize: function () {
	            var finalProcessedBlocks;

	            // Shortcut
	            var padding = this.cfg.padding;

	            // Finalize
	            if (this._xformMode == this._ENC_XFORM_MODE) {
	                // Pad data
	                padding.pad(this._data, this.blockSize);

	                // Process final blocks
	                finalProcessedBlocks = this._process(!!'flush');
	            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
	                // Process final blocks
	                finalProcessedBlocks = this._process(!!'flush');

	                // Unpad data
	                padding.unpad(finalProcessedBlocks);
	            }

	            return finalProcessedBlocks;
	        },

	        blockSize: 128/32
	    });

	    /**
	     * A collection of cipher parameters.
	     *
	     * @property {WordArray} ciphertext The raw ciphertext.
	     * @property {WordArray} key The key to this ciphertext.
	     * @property {WordArray} iv The IV used in the ciphering operation.
	     * @property {WordArray} salt The salt used with a key derivation function.
	     * @property {Cipher} algorithm The cipher algorithm.
	     * @property {Mode} mode The block mode used in the ciphering operation.
	     * @property {Padding} padding The padding scheme used in the ciphering operation.
	     * @property {number} blockSize The block size of the cipher.
	     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
	     */
	    var CipherParams = C_lib.CipherParams = Base.extend({
	        /**
	         * Initializes a newly created cipher params object.
	         *
	         * @param {Object} cipherParams An object with any of the possible cipher parameters.
	         *
	         * @example
	         *
	         *     var cipherParams = CryptoJS.lib.CipherParams.create({
	         *         ciphertext: ciphertextWordArray,
	         *         key: keyWordArray,
	         *         iv: ivWordArray,
	         *         salt: saltWordArray,
	         *         algorithm: CryptoJS.algo.AES,
	         *         mode: CryptoJS.mode.CBC,
	         *         padding: CryptoJS.pad.PKCS7,
	         *         blockSize: 4,
	         *         formatter: CryptoJS.format.OpenSSL
	         *     });
	         */
	        init: function (cipherParams) {
	            this.mixIn(cipherParams);
	        },

	        /**
	         * Converts this cipher params object to a string.
	         *
	         * @param {Format} formatter (Optional) The formatting strategy to use.
	         *
	         * @return {string} The stringified cipher params.
	         *
	         * @throws Error If neither the formatter nor the default formatter is set.
	         *
	         * @example
	         *
	         *     var string = cipherParams + '';
	         *     var string = cipherParams.toString();
	         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
	         */
	        toString: function (formatter) {
	            return (formatter || this.formatter).stringify(this);
	        }
	    });

	    /**
	     * Format namespace.
	     */
	    var C_format = C.format = {};

	    /**
	     * OpenSSL formatting strategy.
	     */
	    var OpenSSLFormatter = C_format.OpenSSL = {
	        /**
	         * Converts a cipher params object to an OpenSSL-compatible string.
	         *
	         * @param {CipherParams} cipherParams The cipher params object.
	         *
	         * @return {string} The OpenSSL-compatible string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
	         */
	        stringify: function (cipherParams) {
	            var wordArray;

	            // Shortcuts
	            var ciphertext = cipherParams.ciphertext;
	            var salt = cipherParams.salt;

	            // Format
	            if (salt) {
	                wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
	            } else {
	                wordArray = ciphertext;
	            }

	            return wordArray.toString(Base64);
	        },

	        /**
	         * Converts an OpenSSL-compatible string to a cipher params object.
	         *
	         * @param {string} openSSLStr The OpenSSL-compatible string.
	         *
	         * @return {CipherParams} The cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
	         */
	        parse: function (openSSLStr) {
	            var salt;

	            // Parse base64
	            var ciphertext = Base64.parse(openSSLStr);

	            // Shortcut
	            var ciphertextWords = ciphertext.words;

	            // Test for salt
	            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
	                // Extract salt
	                salt = WordArray.create(ciphertextWords.slice(2, 4));

	                // Remove salt from ciphertext
	                ciphertextWords.splice(0, 4);
	                ciphertext.sigBytes -= 16;
	            }

	            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
	        }
	    };

	    /**
	     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
	     */
	    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
	         */
	        cfg: Base.extend({
	            format: OpenSSLFormatter
	        }),

	        /**
	         * Encrypts a message.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {WordArray|string} message The message to encrypt.
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {CipherParams} A cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	         */
	        encrypt: function (cipher, message, key, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Encrypt
	            var encryptor = cipher.createEncryptor(key, cfg);
	            var ciphertext = encryptor.finalize(message);

	            // Shortcut
	            var cipherCfg = encryptor.cfg;

	            // Create and return serializable cipher params
	            return CipherParams.create({
	                ciphertext: ciphertext,
	                key: key,
	                iv: cipherCfg.iv,
	                algorithm: cipher,
	                mode: cipherCfg.mode,
	                padding: cipherCfg.padding,
	                blockSize: cipher.blockSize,
	                formatter: cfg.format
	            });
	        },

	        /**
	         * Decrypts serialized ciphertext.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {WordArray} The plaintext.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	         */
	        decrypt: function (cipher, ciphertext, key, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Convert string to CipherParams
	            ciphertext = this._parse(ciphertext, cfg.format);

	            // Decrypt
	            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

	            return plaintext;
	        },

	        /**
	         * Converts serialized ciphertext to CipherParams,
	         * else assumed CipherParams already and returns ciphertext unchanged.
	         *
	         * @param {CipherParams|string} ciphertext The ciphertext.
	         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
	         *
	         * @return {CipherParams} The unserialized ciphertext.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
	         */
	        _parse: function (ciphertext, format) {
	            if (typeof ciphertext == 'string') {
	                return format.parse(ciphertext, this);
	            } else {
	                return ciphertext;
	            }
	        }
	    });

	    /**
	     * Key derivation function namespace.
	     */
	    var C_kdf = C.kdf = {};

	    /**
	     * OpenSSL key derivation function.
	     */
	    var OpenSSLKdf = C_kdf.OpenSSL = {
	        /**
	         * Derives a key and IV from a password.
	         *
	         * @param {string} password The password to derive from.
	         * @param {number} keySize The size in words of the key to generate.
	         * @param {number} ivSize The size in words of the IV to generate.
	         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
	         *
	         * @return {CipherParams} A cipher params object with the key, IV, and salt.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
	         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
	         */
	        execute: function (password, keySize, ivSize, salt) {
	            // Generate random salt
	            if (!salt) {
	                salt = WordArray.random(64/8);
	            }

	            // Derive key and IV
	            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

	            // Separate key and IV
	            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
	            key.sigBytes = keySize * 4;

	            // Return params
	            return CipherParams.create({ key: key, iv: iv, salt: salt });
	        }
	    };

	    /**
	     * A serializable cipher wrapper that derives the key from a password,
	     * and returns ciphertext as a serializable cipher params object.
	     */
	    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
	         */
	        cfg: SerializableCipher.cfg.extend({
	            kdf: OpenSSLKdf
	        }),

	        /**
	         * Encrypts a message using a password.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {WordArray|string} message The message to encrypt.
	         * @param {string} password The password.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {CipherParams} A cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
	         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
	         */
	        encrypt: function (cipher, message, password, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Derive key and other params
	            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

	            // Add IV to config
	            cfg.iv = derivedParams.iv;

	            // Encrypt
	            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

	            // Mix in derived params
	            ciphertext.mixIn(derivedParams);

	            return ciphertext;
	        },

	        /**
	         * Decrypts serialized ciphertext using a password.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
	         * @param {string} password The password.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {WordArray} The plaintext.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
	         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
	         */
	        decrypt: function (cipher, ciphertext, password, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Convert string to CipherParams
	            ciphertext = this._parse(ciphertext, cfg.format);

	            // Derive key and other params
	            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

	            // Add IV to config
	            cfg.iv = derivedParams.iv;

	            // Decrypt
	            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

	            return plaintext;
	        }
	    });
	}());


}));

/***/ }),

/***/ 425:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory();
	}
	else {}
}(this, function () {

	/*globals window, global, require*/

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {

	    var crypto;

	    // Native crypto from window (Browser)
	    if (typeof window !== 'undefined' && window.crypto) {
	        crypto = window.crypto;
	    }

	    // Native crypto in web worker (Browser)
	    if (typeof self !== 'undefined' && self.crypto) {
	        crypto = self.crypto;
	    }

	    // Native crypto from worker
	    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
	        crypto = globalThis.crypto;
	    }

	    // Native (experimental IE 11) crypto from window (Browser)
	    if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
	        crypto = window.msCrypto;
	    }

	    // Native crypto from global (NodeJS)
	    if (!crypto && typeof global !== 'undefined' && global.crypto) {
	        crypto = global.crypto;
	    }

	    // Native crypto import via require (NodeJS)
	    if (!crypto && "function" === 'function') {
	        try {
	            crypto = __nccwpck_require__(6113);
	        } catch (err) {}
	    }

	    /*
	     * Cryptographically secure pseudorandom number generator
	     *
	     * As Math.random() is cryptographically not safe to use
	     */
	    var cryptoSecureRandomInt = function () {
	        if (crypto) {
	            // Use getRandomValues method (Browser)
	            if (typeof crypto.getRandomValues === 'function') {
	                try {
	                    return crypto.getRandomValues(new Uint32Array(1))[0];
	                } catch (err) {}
	            }

	            // Use randomBytes method (NodeJS)
	            if (typeof crypto.randomBytes === 'function') {
	                try {
	                    return crypto.randomBytes(4).readInt32LE();
	                } catch (err) {}
	            }
	        }

	        throw new Error('Native crypto module could not be used to get secure random number.');
	    };

	    /*
	     * Local polyfill of Object.create

	     */
	    var create = Object.create || (function () {
	        function F() {}

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }());

	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {


	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var j = 0; j < thatSigBytes; j += 4) {
	                    thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            for (var i = 0; i < nBytes; i += 4) {
	                words.push(cryptoSecureRandomInt());
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            var processedWords;

	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	return CryptoJS;

}));

/***/ }),

/***/ 8025:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_enc = C.enc;

	    /**
	     * Base64 encoding strategy.
	     */
	    var Base64 = C_enc.Base64 = {
	        /**
	         * Converts a word array to a Base64 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Base64 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;
	            var map = this._map;

	            // Clamp excess bits
	            wordArray.clamp();

	            // Convert
	            var base64Chars = [];
	            for (var i = 0; i < sigBytes; i += 3) {
	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
	                }
	            }

	            // Add padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                while (base64Chars.length % 4) {
	                    base64Chars.push(paddingChar);
	                }
	            }

	            return base64Chars.join('');
	        },

	        /**
	         * Converts a Base64 string to a word array.
	         *
	         * @param {string} base64Str The Base64 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
	         */
	        parse: function (base64Str) {
	            // Shortcuts
	            var base64StrLength = base64Str.length;
	            var map = this._map;
	            var reverseMap = this._reverseMap;

	            if (!reverseMap) {
	                    reverseMap = this._reverseMap = [];
	                    for (var j = 0; j < map.length; j++) {
	                        reverseMap[map.charCodeAt(j)] = j;
	                    }
	            }

	            // Ignore padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                var paddingIndex = base64Str.indexOf(paddingChar);
	                if (paddingIndex !== -1) {
	                    base64StrLength = paddingIndex;
	                }
	            }

	            // Convert
	            return parseLoop(base64Str, base64StrLength, reverseMap);

	        },

	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	    };

	    function parseLoop(base64Str, base64StrLength, reverseMap) {
	      var words = [];
	      var nBytes = 0;
	      for (var i = 0; i < base64StrLength; i++) {
	          if (i % 4) {
	              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
	              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
	              var bitsCombined = bits1 | bits2;
	              words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
	              nBytes++;
	          }
	      }
	      return WordArray.create(words, nBytes);
	    }
	}());


	return CryptoJS.enc.Base64;

}));

/***/ }),

/***/ 9349:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_enc = C.enc;

	    /**
	     * Base64url encoding strategy.
	     */
	    var Base64url = C_enc.Base64url = {
	        /**
	         * Converts a word array to a Base64url string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @param {boolean} urlSafe Whether to use url safe
	         *
	         * @return {string} The Base64url string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
	         */
	        stringify: function (wordArray, urlSafe=true) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;
	            var map = urlSafe ? this._safe_map : this._map;

	            // Clamp excess bits
	            wordArray.clamp();

	            // Convert
	            var base64Chars = [];
	            for (var i = 0; i < sigBytes; i += 3) {
	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
	                }
	            }

	            // Add padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                while (base64Chars.length % 4) {
	                    base64Chars.push(paddingChar);
	                }
	            }

	            return base64Chars.join('');
	        },

	        /**
	         * Converts a Base64url string to a word array.
	         *
	         * @param {string} base64Str The Base64url string.
	         *
	         * @param {boolean} urlSafe Whether to use url safe
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
	         */
	        parse: function (base64Str, urlSafe=true) {
	            // Shortcuts
	            var base64StrLength = base64Str.length;
	            var map = urlSafe ? this._safe_map : this._map;
	            var reverseMap = this._reverseMap;

	            if (!reverseMap) {
	                reverseMap = this._reverseMap = [];
	                for (var j = 0; j < map.length; j++) {
	                    reverseMap[map.charCodeAt(j)] = j;
	                }
	            }

	            // Ignore padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                var paddingIndex = base64Str.indexOf(paddingChar);
	                if (paddingIndex !== -1) {
	                    base64StrLength = paddingIndex;
	                }
	            }

	            // Convert
	            return parseLoop(base64Str, base64StrLength, reverseMap);

	        },

	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
	        _safe_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
	    };

	    function parseLoop(base64Str, base64StrLength, reverseMap) {
	        var words = [];
	        var nBytes = 0;
	        for (var i = 0; i < base64StrLength; i++) {
	            if (i % 4) {
	                var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
	                var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
	                var bitsCombined = bits1 | bits2;
	                words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
	                nBytes++;
	            }
	        }
	        return WordArray.create(words, nBytes);
	    }
	}());

	return CryptoJS.enc.Base64url;

}));

/***/ }),

/***/ 6974:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_enc = C.enc;

	    /**
	     * UTF-16 BE encoding strategy.
	     */
	    var Utf16BE = C_enc.Utf16 = C_enc.Utf16BE = {
	        /**
	         * Converts a word array to a UTF-16 BE string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-16 BE string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var utf16Chars = [];
	            for (var i = 0; i < sigBytes; i += 2) {
	                var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
	                utf16Chars.push(String.fromCharCode(codePoint));
	            }

	            return utf16Chars.join('');
	        },

	        /**
	         * Converts a UTF-16 BE string to a word array.
	         *
	         * @param {string} utf16Str The UTF-16 BE string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
	         */
	        parse: function (utf16Str) {
	            // Shortcut
	            var utf16StrLength = utf16Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < utf16StrLength; i++) {
	                words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
	            }

	            return WordArray.create(words, utf16StrLength * 2);
	        }
	    };

	    /**
	     * UTF-16 LE encoding strategy.
	     */
	    C_enc.Utf16LE = {
	        /**
	         * Converts a word array to a UTF-16 LE string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-16 LE string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var utf16Chars = [];
	            for (var i = 0; i < sigBytes; i += 2) {
	                var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
	                utf16Chars.push(String.fromCharCode(codePoint));
	            }

	            return utf16Chars.join('');
	        },

	        /**
	         * Converts a UTF-16 LE string to a word array.
	         *
	         * @param {string} utf16Str The UTF-16 LE string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
	         */
	        parse: function (utf16Str) {
	            // Shortcut
	            var utf16StrLength = utf16Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < utf16StrLength; i++) {
	                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
	            }

	            return WordArray.create(words, utf16StrLength * 2);
	        }
	    };

	    function swapEndian(word) {
	        return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
	    }
	}());


	return CryptoJS.enc.Utf16;

}));

/***/ }),

/***/ 4727:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(7156), __nccwpck_require__(1192));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var WordArray = C_lib.WordArray;
	    var C_algo = C.algo;
	    var MD5 = C_algo.MD5;

	    /**
	     * This key derivation function is meant to conform with EVP_BytesToKey.
	     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
	     */
	    var EvpKDF = C_algo.EvpKDF = Base.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
	         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
	         * @property {number} iterations The number of iterations to perform. Default: 1
	         */
	        cfg: Base.extend({
	            keySize: 128/32,
	            hasher: MD5,
	            iterations: 1
	        }),

	        /**
	         * Initializes a newly created key derivation function.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
	         *
	         * @example
	         *
	         *     var kdf = CryptoJS.algo.EvpKDF.create();
	         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
	         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
	         */
	        init: function (cfg) {
	            this.cfg = this.cfg.extend(cfg);
	        },

	        /**
	         * Derives a key from a password.
	         *
	         * @param {WordArray|string} password The password.
	         * @param {WordArray|string} salt A salt.
	         *
	         * @return {WordArray} The derived key.
	         *
	         * @example
	         *
	         *     var key = kdf.compute(password, salt);
	         */
	        compute: function (password, salt) {
	            var block;

	            // Shortcut
	            var cfg = this.cfg;

	            // Init hasher
	            var hasher = cfg.hasher.create();

	            // Initial values
	            var derivedKey = WordArray.create();

	            // Shortcuts
	            var derivedKeyWords = derivedKey.words;
	            var keySize = cfg.keySize;
	            var iterations = cfg.iterations;

	            // Generate key
	            while (derivedKeyWords.length < keySize) {
	                if (block) {
	                    hasher.update(block);
	                }
	                block = hasher.update(password).finalize(salt);
	                hasher.reset();

	                // Iterations
	                for (var i = 1; i < iterations; i++) {
	                    block = hasher.finalize(block);
	                    hasher.reset();
	                }

	                derivedKey.concat(block);
	            }
	            derivedKey.sigBytes = keySize * 4;

	            return derivedKey;
	        }
	    });

	    /**
	     * Derives a key from a password.
	     *
	     * @param {WordArray|string} password The password.
	     * @param {WordArray|string} salt A salt.
	     * @param {Object} cfg (Optional) The configuration options to use for this computation.
	     *
	     * @return {WordArray} The derived key.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var key = CryptoJS.EvpKDF(password, salt);
	     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
	     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
	     */
	    C.EvpKDF = function (password, salt, cfg) {
	        return EvpKDF.create(cfg).compute(password, salt);
	    };
	}());


	return CryptoJS.EvpKDF;

}));

/***/ }),

/***/ 9204:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	(function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var CipherParams = C_lib.CipherParams;
	    var C_enc = C.enc;
	    var Hex = C_enc.Hex;
	    var C_format = C.format;

	    var HexFormatter = C_format.Hex = {
	        /**
	         * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
	         *
	         * @param {CipherParams} cipherParams The cipher params object.
	         *
	         * @return {string} The hexadecimally encoded string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
	         */
	        stringify: function (cipherParams) {
	            return cipherParams.ciphertext.toString(Hex);
	        },

	        /**
	         * Converts a hexadecimally encoded ciphertext string to a cipher params object.
	         *
	         * @param {string} input The hexadecimally encoded string.
	         *
	         * @return {CipherParams} The cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
	         */
	        parse: function (input) {
	            var ciphertext = Hex.parse(input);
	            return CipherParams.create({ ciphertext: ciphertext });
	        }
	    };
	}());


	return CryptoJS.format.Hex;

}));

/***/ }),

/***/ 1192:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var C_enc = C.enc;
	    var Utf8 = C_enc.Utf8;
	    var C_algo = C.algo;

	    /**
	     * HMAC algorithm.
	     */
	    var HMAC = C_algo.HMAC = Base.extend({
	        /**
	         * Initializes a newly created HMAC.
	         *
	         * @param {Hasher} hasher The hash algorithm to use.
	         * @param {WordArray|string} key The secret key.
	         *
	         * @example
	         *
	         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
	         */
	        init: function (hasher, key) {
	            // Init hasher
	            hasher = this._hasher = new hasher.init();

	            // Convert string to WordArray, else assume WordArray already
	            if (typeof key == 'string') {
	                key = Utf8.parse(key);
	            }

	            // Shortcuts
	            var hasherBlockSize = hasher.blockSize;
	            var hasherBlockSizeBytes = hasherBlockSize * 4;

	            // Allow arbitrary length keys
	            if (key.sigBytes > hasherBlockSizeBytes) {
	                key = hasher.finalize(key);
	            }

	            // Clamp excess bits
	            key.clamp();

	            // Clone key for inner and outer pads
	            var oKey = this._oKey = key.clone();
	            var iKey = this._iKey = key.clone();

	            // Shortcuts
	            var oKeyWords = oKey.words;
	            var iKeyWords = iKey.words;

	            // XOR keys with pad constants
	            for (var i = 0; i < hasherBlockSize; i++) {
	                oKeyWords[i] ^= 0x5c5c5c5c;
	                iKeyWords[i] ^= 0x36363636;
	            }
	            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this HMAC to its initial state.
	         *
	         * @example
	         *
	         *     hmacHasher.reset();
	         */
	        reset: function () {
	            // Shortcut
	            var hasher = this._hasher;

	            // Reset
	            hasher.reset();
	            hasher.update(this._iKey);
	        },

	        /**
	         * Updates this HMAC with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {HMAC} This HMAC instance.
	         *
	         * @example
	         *
	         *     hmacHasher.update('message');
	         *     hmacHasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            this._hasher.update(messageUpdate);

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the HMAC computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The HMAC.
	         *
	         * @example
	         *
	         *     var hmac = hmacHasher.finalize();
	         *     var hmac = hmacHasher.finalize('message');
	         *     var hmac = hmacHasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Shortcut
	            var hasher = this._hasher;

	            // Compute HMAC
	            var innerHash = hasher.finalize(messageUpdate);
	            hasher.reset();
	            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

	            return hmac;
	        }
	    });
	}());


}));

/***/ }),

/***/ 4134:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(5474), __nccwpck_require__(3281), __nccwpck_require__(6974), __nccwpck_require__(8025), __nccwpck_require__(9349), __nccwpck_require__(250), __nccwpck_require__(7156), __nccwpck_require__(3941), __nccwpck_require__(1081), __nccwpck_require__(2034), __nccwpck_require__(4861), __nccwpck_require__(7800), __nccwpck_require__(2513), __nccwpck_require__(1192), __nccwpck_require__(1476), __nccwpck_require__(4727), __nccwpck_require__(714), __nccwpck_require__(8180), __nccwpck_require__(9762), __nccwpck_require__(595), __nccwpck_require__(2462), __nccwpck_require__(5643), __nccwpck_require__(2295), __nccwpck_require__(5149), __nccwpck_require__(9573), __nccwpck_require__(8727), __nccwpck_require__(9610), __nccwpck_require__(9204), __nccwpck_require__(4819), __nccwpck_require__(3644), __nccwpck_require__(4353), __nccwpck_require__(2104), __nccwpck_require__(6424));
	}
	else {}
}(this, function (CryptoJS) {

	return CryptoJS;

}));

/***/ }),

/***/ 3281:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Check if typed arrays are supported
	    if (typeof ArrayBuffer != 'function') {
	        return;
	    }

	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;

	    // Reference original init
	    var superInit = WordArray.init;

	    // Augment WordArray.init to handle typed arrays
	    var subInit = WordArray.init = function (typedArray) {
	        // Convert buffers to uint8
	        if (typedArray instanceof ArrayBuffer) {
	            typedArray = new Uint8Array(typedArray);
	        }

	        // Convert other array views to uint8
	        if (
	            typedArray instanceof Int8Array ||
	            (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
	            typedArray instanceof Int16Array ||
	            typedArray instanceof Uint16Array ||
	            typedArray instanceof Int32Array ||
	            typedArray instanceof Uint32Array ||
	            typedArray instanceof Float32Array ||
	            typedArray instanceof Float64Array
	        ) {
	            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
	        }

	        // Handle Uint8Array
	        if (typedArray instanceof Uint8Array) {
	            // Shortcut
	            var typedArrayByteLength = typedArray.byteLength;

	            // Extract bytes
	            var words = [];
	            for (var i = 0; i < typedArrayByteLength; i++) {
	                words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
	            }

	            // Initialize this word array
	            superInit.call(this, words, typedArrayByteLength);
	        } else {
	            // Else call normal init
	            superInit.apply(this, arguments);
	        }
	    };

	    subInit.prototype = WordArray;
	}());


	return CryptoJS.lib.WordArray;

}));

/***/ }),

/***/ 250:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425));
	}
	else {}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Constants table
	    var T = [];

	    // Compute constants
	    (function () {
	        for (var i = 0; i < 64; i++) {
	            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
	        }
	    }());

	    /**
	     * MD5 hash algorithm.
	     */
	    var MD5 = C_algo.MD5 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Swap endian
	            for (var i = 0; i < 16; i++) {
	                // Shortcuts
	                var offset_i = offset + i;
	                var M_offset_i = M[offset_i];

	                M[offset_i] = (
	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	                );
	            }

	            // Shortcuts
	            var H = this._hash.words;

	            var M_offset_0  = M[offset + 0];
	            var M_offset_1  = M[offset + 1];
	            var M_offset_2  = M[offset + 2];
	            var M_offset_3  = M[offset + 3];
	            var M_offset_4  = M[offset + 4];
	            var M_offset_5  = M[offset + 5];
	            var M_offset_6  = M[offset + 6];
	            var M_offset_7  = M[offset + 7];
	            var M_offset_8  = M[offset + 8];
	            var M_offset_9  = M[offset + 9];
	            var M_offset_10 = M[offset + 10];
	            var M_offset_11 = M[offset + 11];
	            var M_offset_12 = M[offset + 12];
	            var M_offset_13 = M[offset + 13];
	            var M_offset_14 = M[offset + 14];
	            var M_offset_15 = M[offset + 15];

	            // Working varialbes
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];

	            // Computation
	            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
	            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
	            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
	            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
	            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
	            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
	            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
	            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
	            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
	            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
	            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
	            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
	            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
	            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
	            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
	            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

	            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
	            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
	            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
	            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
	            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
	            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
	            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
	            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
	            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
	            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
	            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
	            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
	            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
	            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
	            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
	            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

	            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
	            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
	            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
	            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
	            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
	            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
	            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
	            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
	            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
	            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
	            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
	            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
	            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
	            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
	            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
	            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

	            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
	            d = II(d, a, b, c, M_offset_7,  10, T[49]);
	            c = II(c, d, a, b, M_offset_14, 15, T[50]);
	            b = II(b, c, d, a, M_offset_5,  21, T[51]);
	            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
	            d = II(d, a, b, c, M_offset_3,  10, T[53]);
	            c = II(c, d, a, b, M_offset_10, 15, T[54]);
	            b = II(b, c, d, a, M_offset_1,  21, T[55]);
	            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
	            d = II(d, a, b, c, M_offset_15, 10, T[57]);
	            c = II(c, d, a, b, M_offset_6,  15, T[58]);
	            b = II(b, c, d, a, M_offset_13, 21, T[59]);
	            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
	            d = II(d, a, b, c, M_offset_11, 10, T[61]);
	            c = II(c, d, a, b, M_offset_2,  15, T[62]);
	            b = II(b, c, d, a, M_offset_9,  21, T[63]);

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

	            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
	            var nBitsTotalL = nBitsTotal;
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
	                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
	            );
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
	            );

	            data.sigBytes = (dataWords.length + 1) * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var hash = this._hash;
	            var H = hash.words;

	            // Swap endian
	            for (var i = 0; i < 4; i++) {
	                // Shortcut
	                var H_i = H[i];

	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	            }

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    function FF(a, b, c, d, x, s, t) {
	        var n = a + ((b & c) | (~b & d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function GG(a, b, c, d, x, s, t) {
	        var n = a + ((b & d) | (c & ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function HH(a, b, c, d, x, s, t) {
	        var n = a + (b ^ c ^ d) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function II(a, b, c, d, x, s, t) {
	        var n = a + (c ^ (b | ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.MD5('message');
	     *     var hash = CryptoJS.MD5(wordArray);
	     */
	    C.MD5 = Hasher._createHelper(MD5);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacMD5(message, key);
	     */
	    C.HmacMD5 = Hasher._createHmacHelper(MD5);
	}(Math));


	return CryptoJS.MD5;

}));

/***/ }),

/***/ 8180:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	/**
	 * Cipher Feedback block mode.
	 */
	CryptoJS.mode.CFB = (function () {
	    var CFB = CryptoJS.lib.BlockCipherMode.extend();

	    CFB.Encryptor = CFB.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher;
	            var blockSize = cipher.blockSize;

	            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

	            // Remember this block to use with next block
	            this._prevBlock = words.slice(offset, offset + blockSize);
	        }
	    });

	    CFB.Decryptor = CFB.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher;
	            var blockSize = cipher.blockSize;

	            // Remember this block to use with next block
	            var thisBlock = words.slice(offset, offset + blockSize);

	            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

	            // This block becomes the previous block
	            this._prevBlock = thisBlock;
	        }
	    });

	    function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
	        var keystream;

	        // Shortcut
	        var iv = this._iv;

	        // Generate keystream
	        if (iv) {
	            keystream = iv.slice(0);

	            // Remove IV for subsequent blocks
	            this._iv = undefined;
	        } else {
	            keystream = this._prevBlock;
	        }
	        cipher.encryptBlock(keystream, 0);

	        // Encrypt
	        for (var i = 0; i < blockSize; i++) {
	            words[offset + i] ^= keystream[i];
	        }
	    }

	    return CFB;
	}());


	return CryptoJS.mode.CFB;

}));

/***/ }),

/***/ 595:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	/** @preserve
	 * Counter block mode compatible with  Dr Brian Gladman fileenc.c
	 * derived from CryptoJS.mode.CTR
	 * Jan Hruby jhruby.web@gmail.com
	 */
	CryptoJS.mode.CTRGladman = (function () {
	    var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

		function incWord(word)
		{
			if (((word >> 24) & 0xff) === 0xff) { //overflow
			var b1 = (word >> 16)&0xff;
			var b2 = (word >> 8)&0xff;
			var b3 = word & 0xff;

			if (b1 === 0xff) // overflow b1
			{
			b1 = 0;
			if (b2 === 0xff)
			{
				b2 = 0;
				if (b3 === 0xff)
				{
					b3 = 0;
				}
				else
				{
					++b3;
				}
			}
			else
			{
				++b2;
			}
			}
			else
			{
			++b1;
			}

			word = 0;
			word += (b1 << 16);
			word += (b2 << 8);
			word += b3;
			}
			else
			{
			word += (0x01 << 24);
			}
			return word;
		}

		function incCounter(counter)
		{
			if ((counter[0] = incWord(counter[0])) === 0)
			{
				// encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
				counter[1] = incWord(counter[1]);
			}
			return counter;
		}

	    var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher
	            var blockSize = cipher.blockSize;
	            var iv = this._iv;
	            var counter = this._counter;

	            // Generate keystream
	            if (iv) {
	                counter = this._counter = iv.slice(0);

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            }

				incCounter(counter);

				var keystream = counter.slice(0);
	            cipher.encryptBlock(keystream, 0);

	            // Encrypt
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= keystream[i];
	            }
	        }
	    });

	    CTRGladman.Decryptor = Encryptor;

	    return CTRGladman;
	}());




	return CryptoJS.mode.CTRGladman;

}));

/***/ }),

/***/ 9762:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	/**
	 * Counter block mode.
	 */
	CryptoJS.mode.CTR = (function () {
	    var CTR = CryptoJS.lib.BlockCipherMode.extend();

	    var Encryptor = CTR.Encryptor = CTR.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher
	            var blockSize = cipher.blockSize;
	            var iv = this._iv;
	            var counter = this._counter;

	            // Generate keystream
	            if (iv) {
	                counter = this._counter = iv.slice(0);

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            }
	            var keystream = counter.slice(0);
	            cipher.encryptBlock(keystream, 0);

	            // Increment counter
	            counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0

	            // Encrypt
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= keystream[i];
	            }
	        }
	    });

	    CTR.Decryptor = Encryptor;

	    return CTR;
	}());


	return CryptoJS.mode.CTR;

}));

/***/ }),

/***/ 5643:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	/**
	 * Electronic Codebook block mode.
	 */
	CryptoJS.mode.ECB = (function () {
	    var ECB = CryptoJS.lib.BlockCipherMode.extend();

	    ECB.Encryptor = ECB.extend({
	        processBlock: function (words, offset) {
	            this._cipher.encryptBlock(words, offset);
	        }
	    });

	    ECB.Decryptor = ECB.extend({
	        processBlock: function (words, offset) {
	            this._cipher.decryptBlock(words, offset);
	        }
	    });

	    return ECB;
	}());


	return CryptoJS.mode.ECB;

}));

/***/ }),

/***/ 2462:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	/**
	 * Output Feedback block mode.
	 */
	CryptoJS.mode.OFB = (function () {
	    var OFB = CryptoJS.lib.BlockCipherMode.extend();

	    var Encryptor = OFB.Encryptor = OFB.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher
	            var blockSize = cipher.blockSize;
	            var iv = this._iv;
	            var keystream = this._keystream;

	            // Generate keystream
	            if (iv) {
	                keystream = this._keystream = iv.slice(0);

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            }
	            cipher.encryptBlock(keystream, 0);

	            // Encrypt
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= keystream[i];
	            }
	        }
	    });

	    OFB.Decryptor = Encryptor;

	    return OFB;
	}());


	return CryptoJS.mode.OFB;

}));

/***/ }),

/***/ 2295:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	/**
	 * ANSI X.923 padding strategy.
	 */
	CryptoJS.pad.AnsiX923 = {
	    pad: function (data, blockSize) {
	        // Shortcuts
	        var dataSigBytes = data.sigBytes;
	        var blockSizeBytes = blockSize * 4;

	        // Count padding bytes
	        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;

	        // Compute last byte position
	        var lastBytePos = dataSigBytes + nPaddingBytes - 1;

	        // Pad
	        data.clamp();
	        data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
	        data.sigBytes += nPaddingBytes;
	    },

	    unpad: function (data) {
	        // Get number of padding bytes from last byte
	        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

	        // Remove padding
	        data.sigBytes -= nPaddingBytes;
	    }
	};


	return CryptoJS.pad.Ansix923;

}));

/***/ }),

/***/ 5149:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	/**
	 * ISO 10126 padding strategy.
	 */
	CryptoJS.pad.Iso10126 = {
	    pad: function (data, blockSize) {
	        // Shortcut
	        var blockSizeBytes = blockSize * 4;

	        // Count padding bytes
	        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

	        // Pad
	        data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).
	             concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
	    },

	    unpad: function (data) {
	        // Get number of padding bytes from last byte
	        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

	        // Remove padding
	        data.sigBytes -= nPaddingBytes;
	    }
	};


	return CryptoJS.pad.Iso10126;

}));

/***/ }),

/***/ 9573:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	/**
	 * ISO/IEC 9797-1 Padding Method 2.
	 */
	CryptoJS.pad.Iso97971 = {
	    pad: function (data, blockSize) {
	        // Add 0x80 byte
	        data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));

	        // Zero pad the rest
	        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
	    },

	    unpad: function (data) {
	        // Remove zero padding
	        CryptoJS.pad.ZeroPadding.unpad(data);

	        // Remove one more byte -- the 0x80 byte
	        data.sigBytes--;
	    }
	};


	return CryptoJS.pad.Iso97971;

}));

/***/ }),

/***/ 9610:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	/**
	 * A noop padding strategy.
	 */
	CryptoJS.pad.NoPadding = {
	    pad: function () {
	    },

	    unpad: function () {
	    }
	};


	return CryptoJS.pad.NoPadding;

}));

/***/ }),

/***/ 8727:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	/**
	 * Zero padding strategy.
	 */
	CryptoJS.pad.ZeroPadding = {
	    pad: function (data, blockSize) {
	        // Shortcut
	        var blockSizeBytes = blockSize * 4;

	        // Pad
	        data.clamp();
	        data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
	    },

	    unpad: function (data) {
	        // Shortcut
	        var dataWords = data.words;

	        // Unpad
	        var i = data.sigBytes - 1;
	        for (var i = data.sigBytes - 1; i >= 0; i--) {
	            if (((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
	                data.sigBytes = i + 1;
	                break;
	            }
	        }
	    }
	};


	return CryptoJS.pad.ZeroPadding;

}));

/***/ }),

/***/ 1476:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(7156), __nccwpck_require__(1192));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var WordArray = C_lib.WordArray;
	    var C_algo = C.algo;
	    var SHA1 = C_algo.SHA1;
	    var HMAC = C_algo.HMAC;

	    /**
	     * Password-Based Key Derivation Function 2 algorithm.
	     */
	    var PBKDF2 = C_algo.PBKDF2 = Base.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
	         * @property {Hasher} hasher The hasher to use. Default: SHA1
	         * @property {number} iterations The number of iterations to perform. Default: 1
	         */
	        cfg: Base.extend({
	            keySize: 128/32,
	            hasher: SHA1,
	            iterations: 1
	        }),

	        /**
	         * Initializes a newly created key derivation function.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
	         *
	         * @example
	         *
	         *     var kdf = CryptoJS.algo.PBKDF2.create();
	         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
	         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
	         */
	        init: function (cfg) {
	            this.cfg = this.cfg.extend(cfg);
	        },

	        /**
	         * Computes the Password-Based Key Derivation Function 2.
	         *
	         * @param {WordArray|string} password The password.
	         * @param {WordArray|string} salt A salt.
	         *
	         * @return {WordArray} The derived key.
	         *
	         * @example
	         *
	         *     var key = kdf.compute(password, salt);
	         */
	        compute: function (password, salt) {
	            // Shortcut
	            var cfg = this.cfg;

	            // Init HMAC
	            var hmac = HMAC.create(cfg.hasher, password);

	            // Initial values
	            var derivedKey = WordArray.create();
	            var blockIndex = WordArray.create([0x00000001]);

	            // Shortcuts
	            var derivedKeyWords = derivedKey.words;
	            var blockIndexWords = blockIndex.words;
	            var keySize = cfg.keySize;
	            var iterations = cfg.iterations;

	            // Generate key
	            while (derivedKeyWords.length < keySize) {
	                var block = hmac.update(salt).finalize(blockIndex);
	                hmac.reset();

	                // Shortcuts
	                var blockWords = block.words;
	                var blockWordsLength = blockWords.length;

	                // Iterations
	                var intermediate = block;
	                for (var i = 1; i < iterations; i++) {
	                    intermediate = hmac.finalize(intermediate);
	                    hmac.reset();

	                    // Shortcut
	                    var intermediateWords = intermediate.words;

	                    // XOR intermediate with block
	                    for (var j = 0; j < blockWordsLength; j++) {
	                        blockWords[j] ^= intermediateWords[j];
	                    }
	                }

	                derivedKey.concat(block);
	                blockIndexWords[0]++;
	            }
	            derivedKey.sigBytes = keySize * 4;

	            return derivedKey;
	        }
	    });

	    /**
	     * Computes the Password-Based Key Derivation Function 2.
	     *
	     * @param {WordArray|string} password The password.
	     * @param {WordArray|string} salt A salt.
	     * @param {Object} cfg (Optional) The configuration options to use for this computation.
	     *
	     * @return {WordArray} The derived key.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var key = CryptoJS.PBKDF2(password, salt);
	     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
	     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
	     */
	    C.PBKDF2 = function (password, salt, cfg) {
	        return PBKDF2.create(cfg).compute(password, salt);
	    };
	}());


	return CryptoJS.PBKDF2;

}));

/***/ }),

/***/ 6424:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(8025), __nccwpck_require__(250), __nccwpck_require__(4727), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var StreamCipher = C_lib.StreamCipher;
	    var C_algo = C.algo;

	    // Reusable objects
	    var S  = [];
	    var C_ = [];
	    var G  = [];

	    /**
	     * Rabbit stream cipher algorithm.
	     *
	     * This is a legacy version that neglected to convert the key to little-endian.
	     * This error doesn't affect the cipher's security,
	     * but it does affect its compatibility with other implementations.
	     */
	    var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var K = this._key.words;
	            var iv = this.cfg.iv;

	            // Generate initial state values
	            var X = this._X = [
	                K[0], (K[3] << 16) | (K[2] >>> 16),
	                K[1], (K[0] << 16) | (K[3] >>> 16),
	                K[2], (K[1] << 16) | (K[0] >>> 16),
	                K[3], (K[2] << 16) | (K[1] >>> 16)
	            ];

	            // Generate initial counter values
	            var C = this._C = [
	                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
	                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
	                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
	                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
	            ];

	            // Carry bit
	            this._b = 0;

	            // Iterate the system four times
	            for (var i = 0; i < 4; i++) {
	                nextState.call(this);
	            }

	            // Modify the counters
	            for (var i = 0; i < 8; i++) {
	                C[i] ^= X[(i + 4) & 7];
	            }

	            // IV setup
	            if (iv) {
	                // Shortcuts
	                var IV = iv.words;
	                var IV_0 = IV[0];
	                var IV_1 = IV[1];

	                // Generate four subvectors
	                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
	                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
	                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
	                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

	                // Modify counter values
	                C[0] ^= i0;
	                C[1] ^= i1;
	                C[2] ^= i2;
	                C[3] ^= i3;
	                C[4] ^= i0;
	                C[5] ^= i1;
	                C[6] ^= i2;
	                C[7] ^= i3;

	                // Iterate the system four times
	                for (var i = 0; i < 4; i++) {
	                    nextState.call(this);
	                }
	            }
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var X = this._X;

	            // Iterate the system
	            nextState.call(this);

	            // Generate four keystream words
	            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
	            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
	            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
	            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

	            for (var i = 0; i < 4; i++) {
	                // Swap endian
	                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
	                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

	                // Encrypt
	                M[offset + i] ^= S[i];
	            }
	        },

	        blockSize: 128/32,

	        ivSize: 64/32
	    });

	    function nextState() {
	        // Shortcuts
	        var X = this._X;
	        var C = this._C;

	        // Save old counter values
	        for (var i = 0; i < 8; i++) {
	            C_[i] = C[i];
	        }

	        // Calculate new counter values
	        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
	        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
	        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
	        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
	        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
	        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
	        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
	        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
	        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

	        // Calculate the g-values
	        for (var i = 0; i < 8; i++) {
	            var gx = X[i] + C[i];

	            // Construct high and low argument for squaring
	            var ga = gx & 0xffff;
	            var gb = gx >>> 16;

	            // Calculate high and low result of squaring
	            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
	            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

	            // High XOR low
	            G[i] = gh ^ gl;
	        }

	        // Calculate new state values
	        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
	        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
	        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
	        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
	        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
	        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
	        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
	        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
	     */
	    C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
	}());


	return CryptoJS.RabbitLegacy;

}));

/***/ }),

/***/ 2104:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(8025), __nccwpck_require__(250), __nccwpck_require__(4727), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var StreamCipher = C_lib.StreamCipher;
	    var C_algo = C.algo;

	    // Reusable objects
	    var S  = [];
	    var C_ = [];
	    var G  = [];

	    /**
	     * Rabbit stream cipher algorithm
	     */
	    var Rabbit = C_algo.Rabbit = StreamCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var K = this._key.words;
	            var iv = this.cfg.iv;

	            // Swap endian
	            for (var i = 0; i < 4; i++) {
	                K[i] = (((K[i] << 8)  | (K[i] >>> 24)) & 0x00ff00ff) |
	                       (((K[i] << 24) | (K[i] >>> 8))  & 0xff00ff00);
	            }

	            // Generate initial state values
	            var X = this._X = [
	                K[0], (K[3] << 16) | (K[2] >>> 16),
	                K[1], (K[0] << 16) | (K[3] >>> 16),
	                K[2], (K[1] << 16) | (K[0] >>> 16),
	                K[3], (K[2] << 16) | (K[1] >>> 16)
	            ];

	            // Generate initial counter values
	            var C = this._C = [
	                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
	                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
	                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
	                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
	            ];

	            // Carry bit
	            this._b = 0;

	            // Iterate the system four times
	            for (var i = 0; i < 4; i++) {
	                nextState.call(this);
	            }

	            // Modify the counters
	            for (var i = 0; i < 8; i++) {
	                C[i] ^= X[(i + 4) & 7];
	            }

	            // IV setup
	            if (iv) {
	                // Shortcuts
	                var IV = iv.words;
	                var IV_0 = IV[0];
	                var IV_1 = IV[1];

	                // Generate four subvectors
	                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
	                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
	                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
	                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

	                // Modify counter values
	                C[0] ^= i0;
	                C[1] ^= i1;
	                C[2] ^= i2;
	                C[3] ^= i3;
	                C[4] ^= i0;
	                C[5] ^= i1;
	                C[6] ^= i2;
	                C[7] ^= i3;

	                // Iterate the system four times
	                for (var i = 0; i < 4; i++) {
	                    nextState.call(this);
	                }
	            }
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var X = this._X;

	            // Iterate the system
	            nextState.call(this);

	            // Generate four keystream words
	            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
	            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
	            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
	            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

	            for (var i = 0; i < 4; i++) {
	                // Swap endian
	                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
	                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

	                // Encrypt
	                M[offset + i] ^= S[i];
	            }
	        },

	        blockSize: 128/32,

	        ivSize: 64/32
	    });

	    function nextState() {
	        // Shortcuts
	        var X = this._X;
	        var C = this._C;

	        // Save old counter values
	        for (var i = 0; i < 8; i++) {
	            C_[i] = C[i];
	        }

	        // Calculate new counter values
	        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
	        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
	        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
	        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
	        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
	        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
	        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
	        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
	        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

	        // Calculate the g-values
	        for (var i = 0; i < 8; i++) {
	            var gx = X[i] + C[i];

	            // Construct high and low argument for squaring
	            var ga = gx & 0xffff;
	            var gb = gx >>> 16;

	            // Calculate high and low result of squaring
	            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
	            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

	            // High XOR low
	            G[i] = gh ^ gl;
	        }

	        // Calculate new state values
	        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
	        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
	        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
	        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
	        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
	        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
	        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
	        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
	     */
	    C.Rabbit = StreamCipher._createHelper(Rabbit);
	}());


	return CryptoJS.Rabbit;

}));

/***/ }),

/***/ 4353:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(8025), __nccwpck_require__(250), __nccwpck_require__(4727), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var StreamCipher = C_lib.StreamCipher;
	    var C_algo = C.algo;

	    /**
	     * RC4 stream cipher algorithm.
	     */
	    var RC4 = C_algo.RC4 = StreamCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var key = this._key;
	            var keyWords = key.words;
	            var keySigBytes = key.sigBytes;

	            // Init sbox
	            var S = this._S = [];
	            for (var i = 0; i < 256; i++) {
	                S[i] = i;
	            }

	            // Key setup
	            for (var i = 0, j = 0; i < 256; i++) {
	                var keyByteIndex = i % keySigBytes;
	                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

	                j = (j + S[i] + keyByte) % 256;

	                // Swap
	                var t = S[i];
	                S[i] = S[j];
	                S[j] = t;
	            }

	            // Counters
	            this._i = this._j = 0;
	        },

	        _doProcessBlock: function (M, offset) {
	            M[offset] ^= generateKeystreamWord.call(this);
	        },

	        keySize: 256/32,

	        ivSize: 0
	    });

	    function generateKeystreamWord() {
	        // Shortcuts
	        var S = this._S;
	        var i = this._i;
	        var j = this._j;

	        // Generate keystream word
	        var keystreamWord = 0;
	        for (var n = 0; n < 4; n++) {
	            i = (i + 1) % 256;
	            j = (j + S[i]) % 256;

	            // Swap
	            var t = S[i];
	            S[i] = S[j];
	            S[j] = t;

	            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
	        }

	        // Update counters
	        this._i = i;
	        this._j = j;

	        return keystreamWord;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
	     */
	    C.RC4 = StreamCipher._createHelper(RC4);

	    /**
	     * Modified RC4 stream cipher algorithm.
	     */
	    var RC4Drop = C_algo.RC4Drop = RC4.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} drop The number of keystream words to drop. Default 192
	         */
	        cfg: RC4.cfg.extend({
	            drop: 192
	        }),

	        _doReset: function () {
	            RC4._doReset.call(this);

	            // Drop
	            for (var i = this.cfg.drop; i > 0; i--) {
	                generateKeystreamWord.call(this);
	            }
	        }
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
	     */
	    C.RC4Drop = StreamCipher._createHelper(RC4Drop);
	}());


	return CryptoJS.RC4;

}));

/***/ }),

/***/ 2513:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425));
	}
	else {}
}(this, function (CryptoJS) {

	/** @preserve
	(c) 2012 by Cédric Mesnil. All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Constants table
	    var _zl = WordArray.create([
	        0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
	        7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
	        3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
	        1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
	        4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13]);
	    var _zr = WordArray.create([
	        5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
	        6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
	        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
	        8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
	        12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11]);
	    var _sl = WordArray.create([
	         11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
	        7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
	        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
	          11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
	        9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ]);
	    var _sr = WordArray.create([
	        8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
	        9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
	        9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
	        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
	        8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ]);

	    var _hl =  WordArray.create([ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
	    var _hr =  WordArray.create([ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

	    /**
	     * RIPEMD160 hash algorithm.
	     */
	    var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
	        _doReset: function () {
	            this._hash  = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
	        },

	        _doProcessBlock: function (M, offset) {

	            // Swap endian
	            for (var i = 0; i < 16; i++) {
	                // Shortcuts
	                var offset_i = offset + i;
	                var M_offset_i = M[offset_i];

	                // Swap
	                M[offset_i] = (
	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	                );
	            }
	            // Shortcut
	            var H  = this._hash.words;
	            var hl = _hl.words;
	            var hr = _hr.words;
	            var zl = _zl.words;
	            var zr = _zr.words;
	            var sl = _sl.words;
	            var sr = _sr.words;

	            // Working variables
	            var al, bl, cl, dl, el;
	            var ar, br, cr, dr, er;

	            ar = al = H[0];
	            br = bl = H[1];
	            cr = cl = H[2];
	            dr = dl = H[3];
	            er = el = H[4];
	            // Computation
	            var t;
	            for (var i = 0; i < 80; i += 1) {
	                t = (al +  M[offset+zl[i]])|0;
	                if (i<16){
		            t +=  f1(bl,cl,dl) + hl[0];
	                } else if (i<32) {
		            t +=  f2(bl,cl,dl) + hl[1];
	                } else if (i<48) {
		            t +=  f3(bl,cl,dl) + hl[2];
	                } else if (i<64) {
		            t +=  f4(bl,cl,dl) + hl[3];
	                } else {// if (i<80) {
		            t +=  f5(bl,cl,dl) + hl[4];
	                }
	                t = t|0;
	                t =  rotl(t,sl[i]);
	                t = (t+el)|0;
	                al = el;
	                el = dl;
	                dl = rotl(cl, 10);
	                cl = bl;
	                bl = t;

	                t = (ar + M[offset+zr[i]])|0;
	                if (i<16){
		            t +=  f5(br,cr,dr) + hr[0];
	                } else if (i<32) {
		            t +=  f4(br,cr,dr) + hr[1];
	                } else if (i<48) {
		            t +=  f3(br,cr,dr) + hr[2];
	                } else if (i<64) {
		            t +=  f2(br,cr,dr) + hr[3];
	                } else {// if (i<80) {
		            t +=  f1(br,cr,dr) + hr[4];
	                }
	                t = t|0;
	                t =  rotl(t,sr[i]) ;
	                t = (t+er)|0;
	                ar = er;
	                er = dr;
	                dr = rotl(cr, 10);
	                cr = br;
	                br = t;
	            }
	            // Intermediate hash value
	            t    = (H[1] + cl + dr)|0;
	            H[1] = (H[2] + dl + er)|0;
	            H[2] = (H[3] + el + ar)|0;
	            H[3] = (H[4] + al + br)|0;
	            H[4] = (H[0] + bl + cr)|0;
	            H[0] =  t;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	                (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
	            );
	            data.sigBytes = (dataWords.length + 1) * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var hash = this._hash;
	            var H = hash.words;

	            // Swap endian
	            for (var i = 0; i < 5; i++) {
	                // Shortcut
	                var H_i = H[i];

	                // Swap
	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	            }

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });


	    function f1(x, y, z) {
	        return ((x) ^ (y) ^ (z));

	    }

	    function f2(x, y, z) {
	        return (((x)&(y)) | ((~x)&(z)));
	    }

	    function f3(x, y, z) {
	        return (((x) | (~(y))) ^ (z));
	    }

	    function f4(x, y, z) {
	        return (((x) & (z)) | ((y)&(~(z))));
	    }

	    function f5(x, y, z) {
	        return ((x) ^ ((y) |(~(z))));

	    }

	    function rotl(x,n) {
	        return (x<<n) | (x>>>(32-n));
	    }


	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.RIPEMD160('message');
	     *     var hash = CryptoJS.RIPEMD160(wordArray);
	     */
	    C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
	     */
	    C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
	}(Math));


	return CryptoJS.RIPEMD160;

}));

/***/ }),

/***/ 7156:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-1 hash algorithm.
	     */
	    var SHA1 = C_algo.SHA1 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476,
	                0xc3d2e1f0
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];

	            // Computation
	            for (var i = 0; i < 80; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
	                    W[i] = (n << 1) | (n >>> 31);
	                }

	                var t = ((a << 5) | (a >>> 27)) + e + W[i];
	                if (i < 20) {
	                    t += ((b & c) | (~b & d)) + 0x5a827999;
	                } else if (i < 40) {
	                    t += (b ^ c ^ d) + 0x6ed9eba1;
	                } else if (i < 60) {
	                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
	                } else /* if (i < 80) */ {
	                    t += (b ^ c ^ d) - 0x359d3e2a;
	                }

	                e = d;
	                d = c;
	                c = (b << 30) | (b >>> 2);
	                b = a;
	                a = t;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA1('message');
	     *     var hash = CryptoJS.SHA1(wordArray);
	     */
	    C.SHA1 = Hasher._createHelper(SHA1);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA1(message, key);
	     */
	    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
	}());


	return CryptoJS.SHA1;

}));

/***/ }),

/***/ 1081:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(3941));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_algo = C.algo;
	    var SHA256 = C_algo.SHA256;

	    /**
	     * SHA-224 hash algorithm.
	     */
	    var SHA224 = C_algo.SHA224 = SHA256.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
	                0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
	            ]);
	        },

	        _doFinalize: function () {
	            var hash = SHA256._doFinalize.call(this);

	            hash.sigBytes -= 4;

	            return hash;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA224('message');
	     *     var hash = CryptoJS.SHA224(wordArray);
	     */
	    C.SHA224 = SHA256._createHelper(SHA224);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA224(message, key);
	     */
	    C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
	}());


	return CryptoJS.SHA224;

}));

/***/ }),

/***/ 3941:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425));
	}
	else {}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Initialization and round constants tables
	    var H = [];
	    var K = [];

	    // Compute constants
	    (function () {
	        function isPrime(n) {
	            var sqrtN = Math.sqrt(n);
	            for (var factor = 2; factor <= sqrtN; factor++) {
	                if (!(n % factor)) {
	                    return false;
	                }
	            }

	            return true;
	        }

	        function getFractionalBits(n) {
	            return ((n - (n | 0)) * 0x100000000) | 0;
	        }

	        var n = 2;
	        var nPrime = 0;
	        while (nPrime < 64) {
	            if (isPrime(n)) {
	                if (nPrime < 8) {
	                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
	                }
	                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

	                nPrime++;
	            }

	            n++;
	        }
	    }());

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-256 hash algorithm.
	     */
	    var SHA256 = C_algo.SHA256 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init(H.slice(0));
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];
	            var f = H[5];
	            var g = H[6];
	            var h = H[7];

	            // Computation
	            for (var i = 0; i < 64; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var gamma0x = W[i - 15];
	                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
	                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
	                                   (gamma0x >>> 3);

	                    var gamma1x = W[i - 2];
	                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
	                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
	                                   (gamma1x >>> 10);

	                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
	                }

	                var ch  = (e & f) ^ (~e & g);
	                var maj = (a & b) ^ (a & c) ^ (b & c);

	                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
	                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

	                var t1 = h + sigma1 + ch + K[i] + W[i];
	                var t2 = sigma0 + maj;

	                h = g;
	                g = f;
	                f = e;
	                e = (d + t1) | 0;
	                d = c;
	                c = b;
	                b = a;
	                a = (t1 + t2) | 0;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	            H[5] = (H[5] + f) | 0;
	            H[6] = (H[6] + g) | 0;
	            H[7] = (H[7] + h) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA256('message');
	     *     var hash = CryptoJS.SHA256(wordArray);
	     */
	    C.SHA256 = Hasher._createHelper(SHA256);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA256(message, key);
	     */
	    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
	}(Math));


	return CryptoJS.SHA256;

}));

/***/ }),

/***/ 7800:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(5474));
	}
	else {}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var C_algo = C.algo;

	    // Constants tables
	    var RHO_OFFSETS = [];
	    var PI_INDEXES  = [];
	    var ROUND_CONSTANTS = [];

	    // Compute Constants
	    (function () {
	        // Compute rho offset constants
	        var x = 1, y = 0;
	        for (var t = 0; t < 24; t++) {
	            RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

	            var newX = y % 5;
	            var newY = (2 * x + 3 * y) % 5;
	            x = newX;
	            y = newY;
	        }

	        // Compute pi index constants
	        for (var x = 0; x < 5; x++) {
	            for (var y = 0; y < 5; y++) {
	                PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
	            }
	        }

	        // Compute round constants
	        var LFSR = 0x01;
	        for (var i = 0; i < 24; i++) {
	            var roundConstantMsw = 0;
	            var roundConstantLsw = 0;

	            for (var j = 0; j < 7; j++) {
	                if (LFSR & 0x01) {
	                    var bitPosition = (1 << j) - 1;
	                    if (bitPosition < 32) {
	                        roundConstantLsw ^= 1 << bitPosition;
	                    } else /* if (bitPosition >= 32) */ {
	                        roundConstantMsw ^= 1 << (bitPosition - 32);
	                    }
	                }

	                // Compute next LFSR
	                if (LFSR & 0x80) {
	                    // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
	                    LFSR = (LFSR << 1) ^ 0x71;
	                } else {
	                    LFSR <<= 1;
	                }
	            }

	            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
	        }
	    }());

	    // Reusable objects for temporary values
	    var T = [];
	    (function () {
	        for (var i = 0; i < 25; i++) {
	            T[i] = X64Word.create();
	        }
	    }());

	    /**
	     * SHA-3 hash algorithm.
	     */
	    var SHA3 = C_algo.SHA3 = Hasher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} outputLength
	         *   The desired number of bits in the output hash.
	         *   Only values permitted are: 224, 256, 384, 512.
	         *   Default: 512
	         */
	        cfg: Hasher.cfg.extend({
	            outputLength: 512
	        }),

	        _doReset: function () {
	            var state = this._state = []
	            for (var i = 0; i < 25; i++) {
	                state[i] = new X64Word.init();
	            }

	            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcuts
	            var state = this._state;
	            var nBlockSizeLanes = this.blockSize / 2;

	            // Absorb
	            for (var i = 0; i < nBlockSizeLanes; i++) {
	                // Shortcuts
	                var M2i  = M[offset + 2 * i];
	                var M2i1 = M[offset + 2 * i + 1];

	                // Swap endian
	                M2i = (
	                    (((M2i << 8)  | (M2i >>> 24)) & 0x00ff00ff) |
	                    (((M2i << 24) | (M2i >>> 8))  & 0xff00ff00)
	                );
	                M2i1 = (
	                    (((M2i1 << 8)  | (M2i1 >>> 24)) & 0x00ff00ff) |
	                    (((M2i1 << 24) | (M2i1 >>> 8))  & 0xff00ff00)
	                );

	                // Absorb message into state
	                var lane = state[i];
	                lane.high ^= M2i1;
	                lane.low  ^= M2i;
	            }

	            // Rounds
	            for (var round = 0; round < 24; round++) {
	                // Theta
	                for (var x = 0; x < 5; x++) {
	                    // Mix column lanes
	                    var tMsw = 0, tLsw = 0;
	                    for (var y = 0; y < 5; y++) {
	                        var lane = state[x + 5 * y];
	                        tMsw ^= lane.high;
	                        tLsw ^= lane.low;
	                    }

	                    // Temporary values
	                    var Tx = T[x];
	                    Tx.high = tMsw;
	                    Tx.low  = tLsw;
	                }
	                for (var x = 0; x < 5; x++) {
	                    // Shortcuts
	                    var Tx4 = T[(x + 4) % 5];
	                    var Tx1 = T[(x + 1) % 5];
	                    var Tx1Msw = Tx1.high;
	                    var Tx1Lsw = Tx1.low;

	                    // Mix surrounding columns
	                    var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
	                    var tLsw = Tx4.low  ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
	                    for (var y = 0; y < 5; y++) {
	                        var lane = state[x + 5 * y];
	                        lane.high ^= tMsw;
	                        lane.low  ^= tLsw;
	                    }
	                }

	                // Rho Pi
	                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
	                    var tMsw;
	                    var tLsw;

	                    // Shortcuts
	                    var lane = state[laneIndex];
	                    var laneMsw = lane.high;
	                    var laneLsw = lane.low;
	                    var rhoOffset = RHO_OFFSETS[laneIndex];

	                    // Rotate lanes
	                    if (rhoOffset < 32) {
	                        tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
	                        tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
	                    } else /* if (rhoOffset >= 32) */ {
	                        tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
	                        tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
	                    }

	                    // Transpose lanes
	                    var TPiLane = T[PI_INDEXES[laneIndex]];
	                    TPiLane.high = tMsw;
	                    TPiLane.low  = tLsw;
	                }

	                // Rho pi at x = y = 0
	                var T0 = T[0];
	                var state0 = state[0];
	                T0.high = state0.high;
	                T0.low  = state0.low;

	                // Chi
	                for (var x = 0; x < 5; x++) {
	                    for (var y = 0; y < 5; y++) {
	                        // Shortcuts
	                        var laneIndex = x + 5 * y;
	                        var lane = state[laneIndex];
	                        var TLane = T[laneIndex];
	                        var Tx1Lane = T[((x + 1) % 5) + 5 * y];
	                        var Tx2Lane = T[((x + 2) % 5) + 5 * y];

	                        // Mix rows
	                        lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
	                        lane.low  = TLane.low  ^ (~Tx1Lane.low  & Tx2Lane.low);
	                    }
	                }

	                // Iota
	                var lane = state[0];
	                var roundConstant = ROUND_CONSTANTS[round];
	                lane.high ^= roundConstant.high;
	                lane.low  ^= roundConstant.low;
	            }
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;
	            var blockSizeBits = this.blockSize * 32;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
	            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var state = this._state;
	            var outputLengthBytes = this.cfg.outputLength / 8;
	            var outputLengthLanes = outputLengthBytes / 8;

	            // Squeeze
	            var hashWords = [];
	            for (var i = 0; i < outputLengthLanes; i++) {
	                // Shortcuts
	                var lane = state[i];
	                var laneMsw = lane.high;
	                var laneLsw = lane.low;

	                // Swap endian
	                laneMsw = (
	                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
	                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
	                );
	                laneLsw = (
	                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
	                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
	                );

	                // Squeeze state to retrieve hash
	                hashWords.push(laneLsw);
	                hashWords.push(laneMsw);
	            }

	            // Return final computed hash
	            return new WordArray.init(hashWords, outputLengthBytes);
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);

	            var state = clone._state = this._state.slice(0);
	            for (var i = 0; i < 25; i++) {
	                state[i] = state[i].clone();
	            }

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA3('message');
	     *     var hash = CryptoJS.SHA3(wordArray);
	     */
	    C.SHA3 = Hasher._createHelper(SHA3);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA3(message, key);
	     */
	    C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
	}(Math));


	return CryptoJS.SHA3;

}));

/***/ }),

/***/ 4861:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(5474), __nccwpck_require__(2034));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var X64WordArray = C_x64.WordArray;
	    var C_algo = C.algo;
	    var SHA512 = C_algo.SHA512;

	    /**
	     * SHA-384 hash algorithm.
	     */
	    var SHA384 = C_algo.SHA384 = SHA512.extend({
	        _doReset: function () {
	            this._hash = new X64WordArray.init([
	                new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
	                new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
	                new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
	                new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
	            ]);
	        },

	        _doFinalize: function () {
	            var hash = SHA512._doFinalize.call(this);

	            hash.sigBytes -= 16;

	            return hash;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA384('message');
	     *     var hash = CryptoJS.SHA384(wordArray);
	     */
	    C.SHA384 = SHA512._createHelper(SHA384);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA384(message, key);
	     */
	    C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
	}());


	return CryptoJS.SHA384;

}));

/***/ }),

/***/ 2034:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(5474));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Hasher = C_lib.Hasher;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var X64WordArray = C_x64.WordArray;
	    var C_algo = C.algo;

	    function X64Word_create() {
	        return X64Word.create.apply(X64Word, arguments);
	    }

	    // Constants
	    var K = [
	        X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
	        X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
	        X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
	        X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
	        X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
	        X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
	        X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
	        X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
	        X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
	        X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
	        X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
	        X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
	        X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
	        X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
	        X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
	        X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
	        X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
	        X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
	        X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
	        X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
	        X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
	        X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
	        X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
	        X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
	        X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
	        X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
	        X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
	        X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
	        X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
	        X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
	        X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
	        X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
	        X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
	        X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
	        X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
	        X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
	        X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
	        X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
	        X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
	        X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
	    ];

	    // Reusable objects
	    var W = [];
	    (function () {
	        for (var i = 0; i < 80; i++) {
	            W[i] = X64Word_create();
	        }
	    }());

	    /**
	     * SHA-512 hash algorithm.
	     */
	    var SHA512 = C_algo.SHA512 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new X64WordArray.init([
	                new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
	                new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
	                new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
	                new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcuts
	            var H = this._hash.words;

	            var H0 = H[0];
	            var H1 = H[1];
	            var H2 = H[2];
	            var H3 = H[3];
	            var H4 = H[4];
	            var H5 = H[5];
	            var H6 = H[6];
	            var H7 = H[7];

	            var H0h = H0.high;
	            var H0l = H0.low;
	            var H1h = H1.high;
	            var H1l = H1.low;
	            var H2h = H2.high;
	            var H2l = H2.low;
	            var H3h = H3.high;
	            var H3l = H3.low;
	            var H4h = H4.high;
	            var H4l = H4.low;
	            var H5h = H5.high;
	            var H5l = H5.low;
	            var H6h = H6.high;
	            var H6l = H6.low;
	            var H7h = H7.high;
	            var H7l = H7.low;

	            // Working variables
	            var ah = H0h;
	            var al = H0l;
	            var bh = H1h;
	            var bl = H1l;
	            var ch = H2h;
	            var cl = H2l;
	            var dh = H3h;
	            var dl = H3l;
	            var eh = H4h;
	            var el = H4l;
	            var fh = H5h;
	            var fl = H5l;
	            var gh = H6h;
	            var gl = H6l;
	            var hh = H7h;
	            var hl = H7l;

	            // Rounds
	            for (var i = 0; i < 80; i++) {
	                var Wil;
	                var Wih;

	                // Shortcut
	                var Wi = W[i];

	                // Extend message
	                if (i < 16) {
	                    Wih = Wi.high = M[offset + i * 2]     | 0;
	                    Wil = Wi.low  = M[offset + i * 2 + 1] | 0;
	                } else {
	                    // Gamma0
	                    var gamma0x  = W[i - 15];
	                    var gamma0xh = gamma0x.high;
	                    var gamma0xl = gamma0x.low;
	                    var gamma0h  = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
	                    var gamma0l  = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));

	                    // Gamma1
	                    var gamma1x  = W[i - 2];
	                    var gamma1xh = gamma1x.high;
	                    var gamma1xl = gamma1x.low;
	                    var gamma1h  = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
	                    var gamma1l  = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));

	                    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	                    var Wi7  = W[i - 7];
	                    var Wi7h = Wi7.high;
	                    var Wi7l = Wi7.low;

	                    var Wi16  = W[i - 16];
	                    var Wi16h = Wi16.high;
	                    var Wi16l = Wi16.low;

	                    Wil = gamma0l + Wi7l;
	                    Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
	                    Wil = Wil + gamma1l;
	                    Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
	                    Wil = Wil + Wi16l;
	                    Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);

	                    Wi.high = Wih;
	                    Wi.low  = Wil;
	                }

	                var chh  = (eh & fh) ^ (~eh & gh);
	                var chl  = (el & fl) ^ (~el & gl);
	                var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
	                var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

	                var sigma0h = ((ah >>> 28) | (al << 4))  ^ ((ah << 30)  | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
	                var sigma0l = ((al >>> 28) | (ah << 4))  ^ ((al << 30)  | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
	                var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
	                var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

	                // t1 = h + sigma1 + ch + K[i] + W[i]
	                var Ki  = K[i];
	                var Kih = Ki.high;
	                var Kil = Ki.low;

	                var t1l = hl + sigma1l;
	                var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
	                var t1l = t1l + chl;
	                var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
	                var t1l = t1l + Kil;
	                var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
	                var t1l = t1l + Wil;
	                var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);

	                // t2 = sigma0 + maj
	                var t2l = sigma0l + majl;
	                var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

	                // Update working variables
	                hh = gh;
	                hl = gl;
	                gh = fh;
	                gl = fl;
	                fh = eh;
	                fl = el;
	                el = (dl + t1l) | 0;
	                eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
	                dh = ch;
	                dl = cl;
	                ch = bh;
	                cl = bl;
	                bh = ah;
	                bl = al;
	                al = (t1l + t2l) | 0;
	                ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
	            }

	            // Intermediate hash value
	            H0l = H0.low  = (H0l + al);
	            H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
	            H1l = H1.low  = (H1l + bl);
	            H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
	            H2l = H2.low  = (H2l + cl);
	            H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
	            H3l = H3.low  = (H3l + dl);
	            H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
	            H4l = H4.low  = (H4l + el);
	            H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
	            H5l = H5.low  = (H5l + fl);
	            H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
	            H6l = H6.low  = (H6l + gl);
	            H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
	            H7l = H7.low  = (H7l + hl);
	            H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Convert hash to 32-bit word array before returning
	            var hash = this._hash.toX32();

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        },

	        blockSize: 1024/32
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA512('message');
	     *     var hash = CryptoJS.SHA512(wordArray);
	     */
	    C.SHA512 = Hasher._createHelper(SHA512);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA512(message, key);
	     */
	    C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
	}());


	return CryptoJS.SHA512;

}));

/***/ }),

/***/ 3644:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425), __nccwpck_require__(8025), __nccwpck_require__(250), __nccwpck_require__(4727), __nccwpck_require__(714));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var BlockCipher = C_lib.BlockCipher;
	    var C_algo = C.algo;

	    // Permuted Choice 1 constants
	    var PC1 = [
	        57, 49, 41, 33, 25, 17, 9,  1,
	        58, 50, 42, 34, 26, 18, 10, 2,
	        59, 51, 43, 35, 27, 19, 11, 3,
	        60, 52, 44, 36, 63, 55, 47, 39,
	        31, 23, 15, 7,  62, 54, 46, 38,
	        30, 22, 14, 6,  61, 53, 45, 37,
	        29, 21, 13, 5,  28, 20, 12, 4
	    ];

	    // Permuted Choice 2 constants
	    var PC2 = [
	        14, 17, 11, 24, 1,  5,
	        3,  28, 15, 6,  21, 10,
	        23, 19, 12, 4,  26, 8,
	        16, 7,  27, 20, 13, 2,
	        41, 52, 31, 37, 47, 55,
	        30, 40, 51, 45, 33, 48,
	        44, 49, 39, 56, 34, 53,
	        46, 42, 50, 36, 29, 32
	    ];

	    // Cumulative bit shift constants
	    var BIT_SHIFTS = [1,  2,  4,  6,  8,  10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

	    // SBOXes and round permutation constants
	    var SBOX_P = [
	        {
	            0x0: 0x808200,
	            0x10000000: 0x8000,
	            0x20000000: 0x808002,
	            0x30000000: 0x2,
	            0x40000000: 0x200,
	            0x50000000: 0x808202,
	            0x60000000: 0x800202,
	            0x70000000: 0x800000,
	            0x80000000: 0x202,
	            0x90000000: 0x800200,
	            0xa0000000: 0x8200,
	            0xb0000000: 0x808000,
	            0xc0000000: 0x8002,
	            0xd0000000: 0x800002,
	            0xe0000000: 0x0,
	            0xf0000000: 0x8202,
	            0x8000000: 0x0,
	            0x18000000: 0x808202,
	            0x28000000: 0x8202,
	            0x38000000: 0x8000,
	            0x48000000: 0x808200,
	            0x58000000: 0x200,
	            0x68000000: 0x808002,
	            0x78000000: 0x2,
	            0x88000000: 0x800200,
	            0x98000000: 0x8200,
	            0xa8000000: 0x808000,
	            0xb8000000: 0x800202,
	            0xc8000000: 0x800002,
	            0xd8000000: 0x8002,
	            0xe8000000: 0x202,
	            0xf8000000: 0x800000,
	            0x1: 0x8000,
	            0x10000001: 0x2,
	            0x20000001: 0x808200,
	            0x30000001: 0x800000,
	            0x40000001: 0x808002,
	            0x50000001: 0x8200,
	            0x60000001: 0x200,
	            0x70000001: 0x800202,
	            0x80000001: 0x808202,
	            0x90000001: 0x808000,
	            0xa0000001: 0x800002,
	            0xb0000001: 0x8202,
	            0xc0000001: 0x202,
	            0xd0000001: 0x800200,
	            0xe0000001: 0x8002,
	            0xf0000001: 0x0,
	            0x8000001: 0x808202,
	            0x18000001: 0x808000,
	            0x28000001: 0x800000,
	            0x38000001: 0x200,
	            0x48000001: 0x8000,
	            0x58000001: 0x800002,
	            0x68000001: 0x2,
	            0x78000001: 0x8202,
	            0x88000001: 0x8002,
	            0x98000001: 0x800202,
	            0xa8000001: 0x202,
	            0xb8000001: 0x808200,
	            0xc8000001: 0x800200,
	            0xd8000001: 0x0,
	            0xe8000001: 0x8200,
	            0xf8000001: 0x808002
	        },
	        {
	            0x0: 0x40084010,
	            0x1000000: 0x4000,
	            0x2000000: 0x80000,
	            0x3000000: 0x40080010,
	            0x4000000: 0x40000010,
	            0x5000000: 0x40084000,
	            0x6000000: 0x40004000,
	            0x7000000: 0x10,
	            0x8000000: 0x84000,
	            0x9000000: 0x40004010,
	            0xa000000: 0x40000000,
	            0xb000000: 0x84010,
	            0xc000000: 0x80010,
	            0xd000000: 0x0,
	            0xe000000: 0x4010,
	            0xf000000: 0x40080000,
	            0x800000: 0x40004000,
	            0x1800000: 0x84010,
	            0x2800000: 0x10,
	            0x3800000: 0x40004010,
	            0x4800000: 0x40084010,
	            0x5800000: 0x40000000,
	            0x6800000: 0x80000,
	            0x7800000: 0x40080010,
	            0x8800000: 0x80010,
	            0x9800000: 0x0,
	            0xa800000: 0x4000,
	            0xb800000: 0x40080000,
	            0xc800000: 0x40000010,
	            0xd800000: 0x84000,
	            0xe800000: 0x40084000,
	            0xf800000: 0x4010,
	            0x10000000: 0x0,
	            0x11000000: 0x40080010,
	            0x12000000: 0x40004010,
	            0x13000000: 0x40084000,
	            0x14000000: 0x40080000,
	            0x15000000: 0x10,
	            0x16000000: 0x84010,
	            0x17000000: 0x4000,
	            0x18000000: 0x4010,
	            0x19000000: 0x80000,
	            0x1a000000: 0x80010,
	            0x1b000000: 0x40000010,
	            0x1c000000: 0x84000,
	            0x1d000000: 0x40004000,
	            0x1e000000: 0x40000000,
	            0x1f000000: 0x40084010,
	            0x10800000: 0x84010,
	            0x11800000: 0x80000,
	            0x12800000: 0x40080000,
	            0x13800000: 0x4000,
	            0x14800000: 0x40004000,
	            0x15800000: 0x40084010,
	            0x16800000: 0x10,
	            0x17800000: 0x40000000,
	            0x18800000: 0x40084000,
	            0x19800000: 0x40000010,
	            0x1a800000: 0x40004010,
	            0x1b800000: 0x80010,
	            0x1c800000: 0x0,
	            0x1d800000: 0x4010,
	            0x1e800000: 0x40080010,
	            0x1f800000: 0x84000
	        },
	        {
	            0x0: 0x104,
	            0x100000: 0x0,
	            0x200000: 0x4000100,
	            0x300000: 0x10104,
	            0x400000: 0x10004,
	            0x500000: 0x4000004,
	            0x600000: 0x4010104,
	            0x700000: 0x4010000,
	            0x800000: 0x4000000,
	            0x900000: 0x4010100,
	            0xa00000: 0x10100,
	            0xb00000: 0x4010004,
	            0xc00000: 0x4000104,
	            0xd00000: 0x10000,
	            0xe00000: 0x4,
	            0xf00000: 0x100,
	            0x80000: 0x4010100,
	            0x180000: 0x4010004,
	            0x280000: 0x0,
	            0x380000: 0x4000100,
	            0x480000: 0x4000004,
	            0x580000: 0x10000,
	            0x680000: 0x10004,
	            0x780000: 0x104,
	            0x880000: 0x4,
	            0x980000: 0x100,
	            0xa80000: 0x4010000,
	            0xb80000: 0x10104,
	            0xc80000: 0x10100,
	            0xd80000: 0x4000104,
	            0xe80000: 0x4010104,
	            0xf80000: 0x4000000,
	            0x1000000: 0x4010100,
	            0x1100000: 0x10004,
	            0x1200000: 0x10000,
	            0x1300000: 0x4000100,
	            0x1400000: 0x100,
	            0x1500000: 0x4010104,
	            0x1600000: 0x4000004,
	            0x1700000: 0x0,
	            0x1800000: 0x4000104,
	            0x1900000: 0x4000000,
	            0x1a00000: 0x4,
	            0x1b00000: 0x10100,
	            0x1c00000: 0x4010000,
	            0x1d00000: 0x104,
	            0x1e00000: 0x10104,
	            0x1f00000: 0x4010004,
	            0x1080000: 0x4000000,
	            0x1180000: 0x104,
	            0x1280000: 0x4010100,
	            0x1380000: 0x0,
	            0x1480000: 0x10004,
	            0x1580000: 0x4000100,
	            0x1680000: 0x100,
	            0x1780000: 0x4010004,
	            0x1880000: 0x10000,
	            0x1980000: 0x4010104,
	            0x1a80000: 0x10104,
	            0x1b80000: 0x4000004,
	            0x1c80000: 0x4000104,
	            0x1d80000: 0x4010000,
	            0x1e80000: 0x4,
	            0x1f80000: 0x10100
	        },
	        {
	            0x0: 0x80401000,
	            0x10000: 0x80001040,
	            0x20000: 0x401040,
	            0x30000: 0x80400000,
	            0x40000: 0x0,
	            0x50000: 0x401000,
	            0x60000: 0x80000040,
	            0x70000: 0x400040,
	            0x80000: 0x80000000,
	            0x90000: 0x400000,
	            0xa0000: 0x40,
	            0xb0000: 0x80001000,
	            0xc0000: 0x80400040,
	            0xd0000: 0x1040,
	            0xe0000: 0x1000,
	            0xf0000: 0x80401040,
	            0x8000: 0x80001040,
	            0x18000: 0x40,
	            0x28000: 0x80400040,
	            0x38000: 0x80001000,
	            0x48000: 0x401000,
	            0x58000: 0x80401040,
	            0x68000: 0x0,
	            0x78000: 0x80400000,
	            0x88000: 0x1000,
	            0x98000: 0x80401000,
	            0xa8000: 0x400000,
	            0xb8000: 0x1040,
	            0xc8000: 0x80000000,
	            0xd8000: 0x400040,
	            0xe8000: 0x401040,
	            0xf8000: 0x80000040,
	            0x100000: 0x400040,
	            0x110000: 0x401000,
	            0x120000: 0x80000040,
	            0x130000: 0x0,
	            0x140000: 0x1040,
	            0x150000: 0x80400040,
	            0x160000: 0x80401000,
	            0x170000: 0x80001040,
	            0x180000: 0x80401040,
	            0x190000: 0x80000000,
	            0x1a0000: 0x80400000,
	            0x1b0000: 0x401040,
	            0x1c0000: 0x80001000,
	            0x1d0000: 0x400000,
	            0x1e0000: 0x40,
	            0x1f0000: 0x1000,
	            0x108000: 0x80400000,
	            0x118000: 0x80401040,
	            0x128000: 0x0,
	            0x138000: 0x401000,
	            0x148000: 0x400040,
	            0x158000: 0x80000000,
	            0x168000: 0x80001040,
	            0x178000: 0x40,
	            0x188000: 0x80000040,
	            0x198000: 0x1000,
	            0x1a8000: 0x80001000,
	            0x1b8000: 0x80400040,
	            0x1c8000: 0x1040,
	            0x1d8000: 0x80401000,
	            0x1e8000: 0x400000,
	            0x1f8000: 0x401040
	        },
	        {
	            0x0: 0x80,
	            0x1000: 0x1040000,
	            0x2000: 0x40000,
	            0x3000: 0x20000000,
	            0x4000: 0x20040080,
	            0x5000: 0x1000080,
	            0x6000: 0x21000080,
	            0x7000: 0x40080,
	            0x8000: 0x1000000,
	            0x9000: 0x20040000,
	            0xa000: 0x20000080,
	            0xb000: 0x21040080,
	            0xc000: 0x21040000,
	            0xd000: 0x0,
	            0xe000: 0x1040080,
	            0xf000: 0x21000000,
	            0x800: 0x1040080,
	            0x1800: 0x21000080,
	            0x2800: 0x80,
	            0x3800: 0x1040000,
	            0x4800: 0x40000,
	            0x5800: 0x20040080,
	            0x6800: 0x21040000,
	            0x7800: 0x20000000,
	            0x8800: 0x20040000,
	            0x9800: 0x0,
	            0xa800: 0x21040080,
	            0xb800: 0x1000080,
	            0xc800: 0x20000080,
	            0xd800: 0x21000000,
	            0xe800: 0x1000000,
	            0xf800: 0x40080,
	            0x10000: 0x40000,
	            0x11000: 0x80,
	            0x12000: 0x20000000,
	            0x13000: 0x21000080,
	            0x14000: 0x1000080,
	            0x15000: 0x21040000,
	            0x16000: 0x20040080,
	            0x17000: 0x1000000,
	            0x18000: 0x21040080,
	            0x19000: 0x21000000,
	            0x1a000: 0x1040000,
	            0x1b000: 0x20040000,
	            0x1c000: 0x40080,
	            0x1d000: 0x20000080,
	            0x1e000: 0x0,
	            0x1f000: 0x1040080,
	            0x10800: 0x21000080,
	            0x11800: 0x1000000,
	            0x12800: 0x1040000,
	            0x13800: 0x20040080,
	            0x14800: 0x20000000,
	            0x15800: 0x1040080,
	            0x16800: 0x80,
	            0x17800: 0x21040000,
	            0x18800: 0x40080,
	            0x19800: 0x21040080,
	            0x1a800: 0x0,
	            0x1b800: 0x21000000,
	            0x1c800: 0x1000080,
	            0x1d800: 0x40000,
	            0x1e800: 0x20040000,
	            0x1f800: 0x20000080
	        },
	        {
	            0x0: 0x10000008,
	            0x100: 0x2000,
	            0x200: 0x10200000,
	            0x300: 0x10202008,
	            0x400: 0x10002000,
	            0x500: 0x200000,
	            0x600: 0x200008,
	            0x700: 0x10000000,
	            0x800: 0x0,
	            0x900: 0x10002008,
	            0xa00: 0x202000,
	            0xb00: 0x8,
	            0xc00: 0x10200008,
	            0xd00: 0x202008,
	            0xe00: 0x2008,
	            0xf00: 0x10202000,
	            0x80: 0x10200000,
	            0x180: 0x10202008,
	            0x280: 0x8,
	            0x380: 0x200000,
	            0x480: 0x202008,
	            0x580: 0x10000008,
	            0x680: 0x10002000,
	            0x780: 0x2008,
	            0x880: 0x200008,
	            0x980: 0x2000,
	            0xa80: 0x10002008,
	            0xb80: 0x10200008,
	            0xc80: 0x0,
	            0xd80: 0x10202000,
	            0xe80: 0x202000,
	            0xf80: 0x10000000,
	            0x1000: 0x10002000,
	            0x1100: 0x10200008,
	            0x1200: 0x10202008,
	            0x1300: 0x2008,
	            0x1400: 0x200000,
	            0x1500: 0x10000000,
	            0x1600: 0x10000008,
	            0x1700: 0x202000,
	            0x1800: 0x202008,
	            0x1900: 0x0,
	            0x1a00: 0x8,
	            0x1b00: 0x10200000,
	            0x1c00: 0x2000,
	            0x1d00: 0x10002008,
	            0x1e00: 0x10202000,
	            0x1f00: 0x200008,
	            0x1080: 0x8,
	            0x1180: 0x202000,
	            0x1280: 0x200000,
	            0x1380: 0x10000008,
	            0x1480: 0x10002000,
	            0x1580: 0x2008,
	            0x1680: 0x10202008,
	            0x1780: 0x10200000,
	            0x1880: 0x10202000,
	            0x1980: 0x10200008,
	            0x1a80: 0x2000,
	            0x1b80: 0x202008,
	            0x1c80: 0x200008,
	            0x1d80: 0x0,
	            0x1e80: 0x10000000,
	            0x1f80: 0x10002008
	        },
	        {
	            0x0: 0x100000,
	            0x10: 0x2000401,
	            0x20: 0x400,
	            0x30: 0x100401,
	            0x40: 0x2100401,
	            0x50: 0x0,
	            0x60: 0x1,
	            0x70: 0x2100001,
	            0x80: 0x2000400,
	            0x90: 0x100001,
	            0xa0: 0x2000001,
	            0xb0: 0x2100400,
	            0xc0: 0x2100000,
	            0xd0: 0x401,
	            0xe0: 0x100400,
	            0xf0: 0x2000000,
	            0x8: 0x2100001,
	            0x18: 0x0,
	            0x28: 0x2000401,
	            0x38: 0x2100400,
	            0x48: 0x100000,
	            0x58: 0x2000001,
	            0x68: 0x2000000,
	            0x78: 0x401,
	            0x88: 0x100401,
	            0x98: 0x2000400,
	            0xa8: 0x2100000,
	            0xb8: 0x100001,
	            0xc8: 0x400,
	            0xd8: 0x2100401,
	            0xe8: 0x1,
	            0xf8: 0x100400,
	            0x100: 0x2000000,
	            0x110: 0x100000,
	            0x120: 0x2000401,
	            0x130: 0x2100001,
	            0x140: 0x100001,
	            0x150: 0x2000400,
	            0x160: 0x2100400,
	            0x170: 0x100401,
	            0x180: 0x401,
	            0x190: 0x2100401,
	            0x1a0: 0x100400,
	            0x1b0: 0x1,
	            0x1c0: 0x0,
	            0x1d0: 0x2100000,
	            0x1e0: 0x2000001,
	            0x1f0: 0x400,
	            0x108: 0x100400,
	            0x118: 0x2000401,
	            0x128: 0x2100001,
	            0x138: 0x1,
	            0x148: 0x2000000,
	            0x158: 0x100000,
	            0x168: 0x401,
	            0x178: 0x2100400,
	            0x188: 0x2000001,
	            0x198: 0x2100000,
	            0x1a8: 0x0,
	            0x1b8: 0x2100401,
	            0x1c8: 0x100401,
	            0x1d8: 0x400,
	            0x1e8: 0x2000400,
	            0x1f8: 0x100001
	        },
	        {
	            0x0: 0x8000820,
	            0x1: 0x20000,
	            0x2: 0x8000000,
	            0x3: 0x20,
	            0x4: 0x20020,
	            0x5: 0x8020820,
	            0x6: 0x8020800,
	            0x7: 0x800,
	            0x8: 0x8020000,
	            0x9: 0x8000800,
	            0xa: 0x20800,
	            0xb: 0x8020020,
	            0xc: 0x820,
	            0xd: 0x0,
	            0xe: 0x8000020,
	            0xf: 0x20820,
	            0x80000000: 0x800,
	            0x80000001: 0x8020820,
	            0x80000002: 0x8000820,
	            0x80000003: 0x8000000,
	            0x80000004: 0x8020000,
	            0x80000005: 0x20800,
	            0x80000006: 0x20820,
	            0x80000007: 0x20,
	            0x80000008: 0x8000020,
	            0x80000009: 0x820,
	            0x8000000a: 0x20020,
	            0x8000000b: 0x8020800,
	            0x8000000c: 0x0,
	            0x8000000d: 0x8020020,
	            0x8000000e: 0x8000800,
	            0x8000000f: 0x20000,
	            0x10: 0x20820,
	            0x11: 0x8020800,
	            0x12: 0x20,
	            0x13: 0x800,
	            0x14: 0x8000800,
	            0x15: 0x8000020,
	            0x16: 0x8020020,
	            0x17: 0x20000,
	            0x18: 0x0,
	            0x19: 0x20020,
	            0x1a: 0x8020000,
	            0x1b: 0x8000820,
	            0x1c: 0x8020820,
	            0x1d: 0x20800,
	            0x1e: 0x820,
	            0x1f: 0x8000000,
	            0x80000010: 0x20000,
	            0x80000011: 0x800,
	            0x80000012: 0x8020020,
	            0x80000013: 0x20820,
	            0x80000014: 0x20,
	            0x80000015: 0x8020000,
	            0x80000016: 0x8000000,
	            0x80000017: 0x8000820,
	            0x80000018: 0x8020820,
	            0x80000019: 0x8000020,
	            0x8000001a: 0x8000800,
	            0x8000001b: 0x0,
	            0x8000001c: 0x20800,
	            0x8000001d: 0x820,
	            0x8000001e: 0x20020,
	            0x8000001f: 0x8020800
	        }
	    ];

	    // Masks that select the SBOX input
	    var SBOX_MASK = [
	        0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
	        0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
	    ];

	    /**
	     * DES block cipher algorithm.
	     */
	    var DES = C_algo.DES = BlockCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var key = this._key;
	            var keyWords = key.words;

	            // Select 56 bits according to PC1
	            var keyBits = [];
	            for (var i = 0; i < 56; i++) {
	                var keyBitPos = PC1[i] - 1;
	                keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
	            }

	            // Assemble 16 subkeys
	            var subKeys = this._subKeys = [];
	            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
	                // Create subkey
	                var subKey = subKeys[nSubKey] = [];

	                // Shortcut
	                var bitShift = BIT_SHIFTS[nSubKey];

	                // Select 48 bits according to PC2
	                for (var i = 0; i < 24; i++) {
	                    // Select from the left 28 key bits
	                    subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);

	                    // Select from the right 28 key bits
	                    subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
	                }

	                // Since each subkey is applied to an expanded 32-bit input,
	                // the subkey can be broken into 8 values scaled to 32-bits,
	                // which allows the key to be used without expansion
	                subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
	                for (var i = 1; i < 7; i++) {
	                    subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
	                }
	                subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
	            }

	            // Compute inverse subkeys
	            var invSubKeys = this._invSubKeys = [];
	            for (var i = 0; i < 16; i++) {
	                invSubKeys[i] = subKeys[15 - i];
	            }
	        },

	        encryptBlock: function (M, offset) {
	            this._doCryptBlock(M, offset, this._subKeys);
	        },

	        decryptBlock: function (M, offset) {
	            this._doCryptBlock(M, offset, this._invSubKeys);
	        },

	        _doCryptBlock: function (M, offset, subKeys) {
	            // Get input
	            this._lBlock = M[offset];
	            this._rBlock = M[offset + 1];

	            // Initial permutation
	            exchangeLR.call(this, 4,  0x0f0f0f0f);
	            exchangeLR.call(this, 16, 0x0000ffff);
	            exchangeRL.call(this, 2,  0x33333333);
	            exchangeRL.call(this, 8,  0x00ff00ff);
	            exchangeLR.call(this, 1,  0x55555555);

	            // Rounds
	            for (var round = 0; round < 16; round++) {
	                // Shortcuts
	                var subKey = subKeys[round];
	                var lBlock = this._lBlock;
	                var rBlock = this._rBlock;

	                // Feistel function
	                var f = 0;
	                for (var i = 0; i < 8; i++) {
	                    f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
	                }
	                this._lBlock = rBlock;
	                this._rBlock = lBlock ^ f;
	            }

	            // Undo swap from last round
	            var t = this._lBlock;
	            this._lBlock = this._rBlock;
	            this._rBlock = t;

	            // Final permutation
	            exchangeLR.call(this, 1,  0x55555555);
	            exchangeRL.call(this, 8,  0x00ff00ff);
	            exchangeRL.call(this, 2,  0x33333333);
	            exchangeLR.call(this, 16, 0x0000ffff);
	            exchangeLR.call(this, 4,  0x0f0f0f0f);

	            // Set output
	            M[offset] = this._lBlock;
	            M[offset + 1] = this._rBlock;
	        },

	        keySize: 64/32,

	        ivSize: 64/32,

	        blockSize: 64/32
	    });

	    // Swap bits across the left and right words
	    function exchangeLR(offset, mask) {
	        var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
	        this._rBlock ^= t;
	        this._lBlock ^= t << offset;
	    }

	    function exchangeRL(offset, mask) {
	        var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
	        this._lBlock ^= t;
	        this._rBlock ^= t << offset;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
	     */
	    C.DES = BlockCipher._createHelper(DES);

	    /**
	     * Triple-DES block cipher algorithm.
	     */
	    var TripleDES = C_algo.TripleDES = BlockCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var key = this._key;
	            var keyWords = key.words;
	            // Make sure the key length is valid (64, 128 or >= 192 bit)
	            if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
	                throw new Error('Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.');
	            }

	            // Extend the key according to the keying options defined in 3DES standard
	            var key1 = keyWords.slice(0, 2);
	            var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
	            var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);

	            // Create DES instances
	            this._des1 = DES.createEncryptor(WordArray.create(key1));
	            this._des2 = DES.createEncryptor(WordArray.create(key2));
	            this._des3 = DES.createEncryptor(WordArray.create(key3));
	        },

	        encryptBlock: function (M, offset) {
	            this._des1.encryptBlock(M, offset);
	            this._des2.decryptBlock(M, offset);
	            this._des3.encryptBlock(M, offset);
	        },

	        decryptBlock: function (M, offset) {
	            this._des3.decryptBlock(M, offset);
	            this._des2.encryptBlock(M, offset);
	            this._des1.decryptBlock(M, offset);
	        },

	        keySize: 192/32,

	        ivSize: 64/32,

	        blockSize: 64/32
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
	     */
	    C.TripleDES = BlockCipher._createHelper(TripleDES);
	}());


	return CryptoJS.TripleDES;

}));

/***/ }),

/***/ 5474:
/***/ (function(module, exports, __nccwpck_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__nccwpck_require__(425));
	}
	else {}
}(this, function (CryptoJS) {

	(function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var X32WordArray = C_lib.WordArray;

	    /**
	     * x64 namespace.
	     */
	    var C_x64 = C.x64 = {};

	    /**
	     * A 64-bit word.
	     */
	    var X64Word = C_x64.Word = Base.extend({
	        /**
	         * Initializes a newly created 64-bit word.
	         *
	         * @param {number} high The high 32 bits.
	         * @param {number} low The low 32 bits.
	         *
	         * @example
	         *
	         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
	         */
	        init: function (high, low) {
	            this.high = high;
	            this.low = low;
	        }

	        /**
	         * Bitwise NOTs this word.
	         *
	         * @return {X64Word} A new x64-Word object after negating.
	         *
	         * @example
	         *
	         *     var negated = x64Word.not();
	         */
	        // not: function () {
	            // var high = ~this.high;
	            // var low = ~this.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise ANDs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to AND with this word.
	         *
	         * @return {X64Word} A new x64-Word object after ANDing.
	         *
	         * @example
	         *
	         *     var anded = x64Word.and(anotherX64Word);
	         */
	        // and: function (word) {
	            // var high = this.high & word.high;
	            // var low = this.low & word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise ORs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to OR with this word.
	         *
	         * @return {X64Word} A new x64-Word object after ORing.
	         *
	         * @example
	         *
	         *     var ored = x64Word.or(anotherX64Word);
	         */
	        // or: function (word) {
	            // var high = this.high | word.high;
	            // var low = this.low | word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise XORs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to XOR with this word.
	         *
	         * @return {X64Word} A new x64-Word object after XORing.
	         *
	         * @example
	         *
	         *     var xored = x64Word.xor(anotherX64Word);
	         */
	        // xor: function (word) {
	            // var high = this.high ^ word.high;
	            // var low = this.low ^ word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Shifts this word n bits to the left.
	         *
	         * @param {number} n The number of bits to shift.
	         *
	         * @return {X64Word} A new x64-Word object after shifting.
	         *
	         * @example
	         *
	         *     var shifted = x64Word.shiftL(25);
	         */
	        // shiftL: function (n) {
	            // if (n < 32) {
	                // var high = (this.high << n) | (this.low >>> (32 - n));
	                // var low = this.low << n;
	            // } else {
	                // var high = this.low << (n - 32);
	                // var low = 0;
	            // }

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Shifts this word n bits to the right.
	         *
	         * @param {number} n The number of bits to shift.
	         *
	         * @return {X64Word} A new x64-Word object after shifting.
	         *
	         * @example
	         *
	         *     var shifted = x64Word.shiftR(7);
	         */
	        // shiftR: function (n) {
	            // if (n < 32) {
	                // var low = (this.low >>> n) | (this.high << (32 - n));
	                // var high = this.high >>> n;
	            // } else {
	                // var low = this.high >>> (n - 32);
	                // var high = 0;
	            // }

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Rotates this word n bits to the left.
	         *
	         * @param {number} n The number of bits to rotate.
	         *
	         * @return {X64Word} A new x64-Word object after rotating.
	         *
	         * @example
	         *
	         *     var rotated = x64Word.rotL(25);
	         */
	        // rotL: function (n) {
	            // return this.shiftL(n).or(this.shiftR(64 - n));
	        // },

	        /**
	         * Rotates this word n bits to the right.
	         *
	         * @param {number} n The number of bits to rotate.
	         *
	         * @return {X64Word} A new x64-Word object after rotating.
	         *
	         * @example
	         *
	         *     var rotated = x64Word.rotR(7);
	         */
	        // rotR: function (n) {
	            // return this.shiftR(n).or(this.shiftL(64 - n));
	        // },

	        /**
	         * Adds this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to add with this word.
	         *
	         * @return {X64Word} A new x64-Word object after adding.
	         *
	         * @example
	         *
	         *     var added = x64Word.add(anotherX64Word);
	         */
	        // add: function (word) {
	            // var low = (this.low + word.low) | 0;
	            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
	            // var high = (this.high + word.high + carry) | 0;

	            // return X64Word.create(high, low);
	        // }
	    });

	    /**
	     * An array of 64-bit words.
	     *
	     * @property {Array} words The array of CryptoJS.x64.Word objects.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var X64WordArray = C_x64.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create();
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create([
	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
	         *     ]);
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create([
	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
	         *     ], 10);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 8;
	            }
	        },

	        /**
	         * Converts this 64-bit word array to a 32-bit word array.
	         *
	         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
	         *
	         * @example
	         *
	         *     var x32WordArray = x64WordArray.toX32();
	         */
	        toX32: function () {
	            // Shortcuts
	            var x64Words = this.words;
	            var x64WordsLength = x64Words.length;

	            // Convert
	            var x32Words = [];
	            for (var i = 0; i < x64WordsLength; i++) {
	                var x64Word = x64Words[i];
	                x32Words.push(x64Word.high);
	                x32Words.push(x64Word.low);
	            }

	            return X32WordArray.create(x32Words, this.sigBytes);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {X64WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = x64WordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);

	            // Clone "words" array
	            var words = clone.words = this.words.slice(0);

	            // Clone each X64Word object
	            var wordsLength = words.length;
	            for (var i = 0; i < wordsLength; i++) {
	                words[i] = words[i].clone();
	            }

	            return clone;
	        }
	    });
	}());


	return CryptoJS;

}));

/***/ }),

/***/ 2391:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {Transform, PassThrough} = __nccwpck_require__(2781);
const zlib = __nccwpck_require__(9796);
const mimicResponse = __nccwpck_require__(3877);

module.exports = response => {
	const contentEncoding = (response.headers['content-encoding'] || '').toLowerCase();

	if (!['gzip', 'deflate', 'br'].includes(contentEncoding)) {
		return response;
	}

	// TODO: Remove this when targeting Node.js 12.
	const isBrotli = contentEncoding === 'br';
	if (isBrotli && typeof zlib.createBrotliDecompress !== 'function') {
		response.destroy(new Error('Brotli is not supported on Node.js < 12'));
		return response;
	}

	let isEmpty = true;

	const checker = new Transform({
		transform(data, _encoding, callback) {
			isEmpty = false;

			callback(null, data);
		},

		flush(callback) {
			callback();
		}
	});

	const finalStream = new PassThrough({
		autoDestroy: false,
		destroy(error, callback) {
			response.destroy();

			callback(error);
		}
	});

	const decompressStream = isBrotli ? zlib.createBrotliDecompress() : zlib.createUnzip();

	decompressStream.once('error', error => {
		if (isEmpty && !response.readable) {
			finalStream.end();
			return;
		}

		finalStream.destroy(error);
	});

	mimicResponse(response, finalStream);
	response.pipe(checker).pipe(decompressStream).pipe(finalStream);

	return finalStream;
};


/***/ }),

/***/ 3877:
/***/ ((module) => {

"use strict";


// We define these manually to ensure they're always copied
// even if they would move up the prototype chain
// https://nodejs.org/api/http.html#http_class_http_incomingmessage
const knownProperties = [
	'aborted',
	'complete',
	'headers',
	'httpVersion',
	'httpVersionMinor',
	'httpVersionMajor',
	'method',
	'rawHeaders',
	'rawTrailers',
	'setTimeout',
	'socket',
	'statusCode',
	'statusMessage',
	'trailers',
	'url'
];

module.exports = (fromStream, toStream) => {
	if (toStream._readableState.autoDestroy) {
		throw new Error('The second stream must have the `autoDestroy` option set to `false`');
	}

	const fromProperties = new Set(Object.keys(fromStream).concat(knownProperties));

	const properties = {};

	for (const property of fromProperties) {
		// Don't overwrite existing properties.
		if (property in toStream) {
			continue;
		}

		properties[property] = {
			get() {
				const value = fromStream[property];
				const isFunction = typeof value === 'function';

				return isFunction ? value.bind(fromStream) : value;
			},
			set(value) {
				fromStream[property] = value;
			},
			enumerable: true,
			configurable: false
		};
	}

	Object.defineProperties(toStream, properties);

	fromStream.once('aborted', () => {
		toStream.destroy();

		toStream.emit('aborted');
	});

	fromStream.once('close', () => {
		if (fromStream.complete) {
			if (toStream.readable) {
				toStream.once('end', () => {
					toStream.emit('close');
				});
			} else {
				toStream.emit('close');
			}
		} else {
			toStream.emit('close');
		}
	});

	return toStream;
};


/***/ }),

/***/ 6214:
/***/ ((module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function isTLSSocket(socket) {
    return socket.encrypted;
}
const deferToConnect = (socket, fn) => {
    let listeners;
    if (typeof fn === 'function') {
        const connect = fn;
        listeners = { connect };
    }
    else {
        listeners = fn;
    }
    const hasConnectListener = typeof listeners.connect === 'function';
    const hasSecureConnectListener = typeof listeners.secureConnect === 'function';
    const hasCloseListener = typeof listeners.close === 'function';
    const onConnect = () => {
        if (hasConnectListener) {
            listeners.connect();
        }
        if (isTLSSocket(socket) && hasSecureConnectListener) {
            if (socket.authorized) {
                listeners.secureConnect();
            }
            else if (!socket.authorizationError) {
                socket.once('secureConnect', listeners.secureConnect);
            }
        }
        if (hasCloseListener) {
            socket.once('close', listeners.close);
        }
    };
    if (socket.writable && !socket.connecting) {
        onConnect();
    }
    else if (socket.connecting) {
        socket.once('connect', onConnect);
    }
    else if (socket.destroyed && hasCloseListener) {
        listeners.close(socket._hadError);
    }
};
exports["default"] = deferToConnect;
// For CommonJS default export support
module.exports = deferToConnect;
module.exports["default"] = deferToConnect;


/***/ }),

/***/ 8611:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Stream = (__nccwpck_require__(2781).Stream);
var util = __nccwpck_require__(3837);

module.exports = DelayedStream;
function DelayedStream() {
  this.source = null;
  this.dataSize = 0;
  this.maxDataSize = 1024 * 1024;
  this.pauseStream = true;

  this._maxDataSizeExceeded = false;
  this._released = false;
  this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);

DelayedStream.create = function(source, options) {
  var delayedStream = new this();

  options = options || {};
  for (var option in options) {
    delayedStream[option] = options[option];
  }

  delayedStream.source = source;

  var realEmit = source.emit;
  source.emit = function() {
    delayedStream._handleEmit(arguments);
    return realEmit.apply(source, arguments);
  };

  source.on('error', function() {});
  if (delayedStream.pauseStream) {
    source.pause();
  }

  return delayedStream;
};

Object.defineProperty(DelayedStream.prototype, 'readable', {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.source.readable;
  }
});

DelayedStream.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};

DelayedStream.prototype.resume = function() {
  if (!this._released) {
    this.release();
  }

  this.source.resume();
};

DelayedStream.prototype.pause = function() {
  this.source.pause();
};

DelayedStream.prototype.release = function() {
  this._released = true;

  this._bufferedEvents.forEach(function(args) {
    this.emit.apply(this, args);
  }.bind(this));
  this._bufferedEvents = [];
};

DelayedStream.prototype.pipe = function() {
  var r = Stream.prototype.pipe.apply(this, arguments);
  this.resume();
  return r;
};

DelayedStream.prototype._handleEmit = function(args) {
  if (this._released) {
    this.emit.apply(this, args);
    return;
  }

  if (args[0] === 'data') {
    this.dataSize += args[1].length;
    this._checkIfMaxDataSizeExceeded();
  }

  this._bufferedEvents.push(args);
};

DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
  if (this._maxDataSizeExceeded) {
    return;
  }

  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  this._maxDataSizeExceeded = true;
  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.'
  this.emit('error', new Error(message));
};


/***/ }),

/***/ 4334:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var CombinedStream = __nccwpck_require__(5443);
var util = __nccwpck_require__(3837);
var path = __nccwpck_require__(1017);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var parseUrl = (__nccwpck_require__(7310).parse);
var fs = __nccwpck_require__(7147);
var Stream = (__nccwpck_require__(2781).Stream);
var mime = __nccwpck_require__(3583);
var asynckit = __nccwpck_require__(4812);
var populate = __nccwpck_require__(7142);

// Public API
module.exports = FormData;

// make it a Stream
util.inherits(FormData, CombinedStream);

/**
 * Create readable "multipart/form-data" streams.
 * Can be used to submit forms
 * and file uploads to other web applications.
 *
 * @constructor
 * @param {Object} options - Properties to be added/overriden for FormData and CombinedStream
 */
function FormData(options) {
  if (!(this instanceof FormData)) {
    return new FormData(options);
  }

  this._overheadLength = 0;
  this._valueLength = 0;
  this._valuesToMeasure = [];

  CombinedStream.call(this);

  options = options || {};
  for (var option in options) {
    this[option] = options[option];
  }
}

FormData.LINE_BREAK = '\r\n';
FormData.DEFAULT_CONTENT_TYPE = 'application/octet-stream';

FormData.prototype.append = function(field, value, options) {

  options = options || {};

  // allow filename as single option
  if (typeof options == 'string') {
    options = {filename: options};
  }

  var append = CombinedStream.prototype.append.bind(this);

  // all that streamy business can't handle numbers
  if (typeof value == 'number') {
    value = '' + value;
  }

  // https://github.com/felixge/node-form-data/issues/38
  if (util.isArray(value)) {
    // Please convert your array into string
    // the way web server expects it
    this._error(new Error('Arrays are not supported.'));
    return;
  }

  var header = this._multiPartHeader(field, value, options);
  var footer = this._multiPartFooter();

  append(header);
  append(value);
  append(footer);

  // pass along options.knownLength
  this._trackLength(header, value, options);
};

FormData.prototype._trackLength = function(header, value, options) {
  var valueLength = 0;

  // used w/ getLengthSync(), when length is known.
  // e.g. for streaming directly from a remote server,
  // w/ a known file a size, and not wanting to wait for
  // incoming file to finish to get its size.
  if (options.knownLength != null) {
    valueLength += +options.knownLength;
  } else if (Buffer.isBuffer(value)) {
    valueLength = value.length;
  } else if (typeof value === 'string') {
    valueLength = Buffer.byteLength(value);
  }

  this._valueLength += valueLength;

  // @check why add CRLF? does this account for custom/multiple CRLFs?
  this._overheadLength +=
    Buffer.byteLength(header) +
    FormData.LINE_BREAK.length;

  // empty or either doesn't have path or not an http response or not a stream
  if (!value || ( !value.path && !(value.readable && value.hasOwnProperty('httpVersion')) && !(value instanceof Stream))) {
    return;
  }

  // no need to bother with the length
  if (!options.knownLength) {
    this._valuesToMeasure.push(value);
  }
};

FormData.prototype._lengthRetriever = function(value, callback) {

  if (value.hasOwnProperty('fd')) {

    // take read range into a account
    // `end` = Infinity –> read file till the end
    //
    // TODO: Looks like there is bug in Node fs.createReadStream
    // it doesn't respect `end` options without `start` options
    // Fix it when node fixes it.
    // https://github.com/joyent/node/issues/7819
    if (value.end != undefined && value.end != Infinity && value.start != undefined) {

      // when end specified
      // no need to calculate range
      // inclusive, starts with 0
      callback(null, value.end + 1 - (value.start ? value.start : 0));

    // not that fast snoopy
    } else {
      // still need to fetch file size from fs
      fs.stat(value.path, function(err, stat) {

        var fileSize;

        if (err) {
          callback(err);
          return;
        }

        // update final size based on the range options
        fileSize = stat.size - (value.start ? value.start : 0);
        callback(null, fileSize);
      });
    }

  // or http response
  } else if (value.hasOwnProperty('httpVersion')) {
    callback(null, +value.headers['content-length']);

  // or request stream http://github.com/mikeal/request
  } else if (value.hasOwnProperty('httpModule')) {
    // wait till response come back
    value.on('response', function(response) {
      value.pause();
      callback(null, +response.headers['content-length']);
    });
    value.resume();

  // something else
  } else {
    callback('Unknown stream');
  }
};

FormData.prototype._multiPartHeader = function(field, value, options) {
  // custom header specified (as string)?
  // it becomes responsible for boundary
  // (e.g. to handle extra CRLFs on .NET servers)
  if (typeof options.header == 'string') {
    return options.header;
  }

  var contentDisposition = this._getContentDisposition(value, options);
  var contentType = this._getContentType(value, options);

  var contents = '';
  var headers  = {
    // add custom disposition as third element or keep it two elements if not
    'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
    // if no content type. allow it to be empty array
    'Content-Type': [].concat(contentType || [])
  };

  // allow custom headers.
  if (typeof options.header == 'object') {
    populate(headers, options.header);
  }

  var header;
  for (var prop in headers) {
    if (!headers.hasOwnProperty(prop)) continue;
    header = headers[prop];

    // skip nullish headers.
    if (header == null) {
      continue;
    }

    // convert all headers to arrays.
    if (!Array.isArray(header)) {
      header = [header];
    }

    // add non-empty headers.
    if (header.length) {
      contents += prop + ': ' + header.join('; ') + FormData.LINE_BREAK;
    }
  }

  return '--' + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
};

FormData.prototype._getContentDisposition = function(value, options) {

  var filename
    , contentDisposition
    ;

  if (typeof options.filepath === 'string') {
    // custom filepath for relative paths
    filename = path.normalize(options.filepath).replace(/\\/g, '/');
  } else if (options.filename || value.name || value.path) {
    // custom filename take precedence
    // formidable and the browser add a name property
    // fs- and request- streams have path property
    filename = path.basename(options.filename || value.name || value.path);
  } else if (value.readable && value.hasOwnProperty('httpVersion')) {
    // or try http response
    filename = path.basename(value.client._httpMessage.path || '');
  }

  if (filename) {
    contentDisposition = 'filename="' + filename + '"';
  }

  return contentDisposition;
};

FormData.prototype._getContentType = function(value, options) {

  // use custom content-type above all
  var contentType = options.contentType;

  // or try `name` from formidable, browser
  if (!contentType && value.name) {
    contentType = mime.lookup(value.name);
  }

  // or try `path` from fs-, request- streams
  if (!contentType && value.path) {
    contentType = mime.lookup(value.path);
  }

  // or if it's http-reponse
  if (!contentType && value.readable && value.hasOwnProperty('httpVersion')) {
    contentType = value.headers['content-type'];
  }

  // or guess it from the filepath or filename
  if (!contentType && (options.filepath || options.filename)) {
    contentType = mime.lookup(options.filepath || options.filename);
  }

  // fallback to the default content type if `value` is not simple value
  if (!contentType && typeof value == 'object') {
    contentType = FormData.DEFAULT_CONTENT_TYPE;
  }

  return contentType;
};

FormData.prototype._multiPartFooter = function() {
  return function(next) {
    var footer = FormData.LINE_BREAK;

    var lastPart = (this._streams.length === 0);
    if (lastPart) {
      footer += this._lastBoundary();
    }

    next(footer);
  }.bind(this);
};

FormData.prototype._lastBoundary = function() {
  return '--' + this.getBoundary() + '--' + FormData.LINE_BREAK;
};

FormData.prototype.getHeaders = function(userHeaders) {
  var header;
  var formHeaders = {
    'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
  };

  for (header in userHeaders) {
    if (userHeaders.hasOwnProperty(header)) {
      formHeaders[header.toLowerCase()] = userHeaders[header];
    }
  }

  return formHeaders;
};

FormData.prototype.setBoundary = function(boundary) {
  this._boundary = boundary;
};

FormData.prototype.getBoundary = function() {
  if (!this._boundary) {
    this._generateBoundary();
  }

  return this._boundary;
};

FormData.prototype.getBuffer = function() {
  var dataBuffer = new Buffer.alloc( 0 );
  var boundary = this.getBoundary();

  // Create the form content. Add Line breaks to the end of data.
  for (var i = 0, len = this._streams.length; i < len; i++) {
    if (typeof this._streams[i] !== 'function') {

      // Add content to the buffer.
      if(Buffer.isBuffer(this._streams[i])) {
        dataBuffer = Buffer.concat( [dataBuffer, this._streams[i]]);
      }else {
        dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(this._streams[i])]);
      }

      // Add break after content.
      if (typeof this._streams[i] !== 'string' || this._streams[i].substring( 2, boundary.length + 2 ) !== boundary) {
        dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(FormData.LINE_BREAK)] );
      }
    }
  }

  // Add the footer and return the Buffer object.
  return Buffer.concat( [dataBuffer, Buffer.from(this._lastBoundary())] );
};

FormData.prototype._generateBoundary = function() {
  // This generates a 50 character boundary similar to those used by Firefox.
  // They are optimized for boyer-moore parsing.
  var boundary = '--------------------------';
  for (var i = 0; i < 24; i++) {
    boundary += Math.floor(Math.random() * 10).toString(16);
  }

  this._boundary = boundary;
};

// Note: getLengthSync DOESN'T calculate streams length
// As workaround one can calculate file size manually
// and add it as knownLength option
FormData.prototype.getLengthSync = function() {
  var knownLength = this._overheadLength + this._valueLength;

  // Don't get confused, there are 3 "internal" streams for each keyval pair
  // so it basically checks if there is any value added to the form
  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  // https://github.com/form-data/form-data/issues/40
  if (!this.hasKnownLength()) {
    // Some async length retrievers are present
    // therefore synchronous length calculation is false.
    // Please use getLength(callback) to get proper length
    this._error(new Error('Cannot calculate proper length in synchronous way.'));
  }

  return knownLength;
};

// Public API to check if length of added values is known
// https://github.com/form-data/form-data/issues/196
// https://github.com/form-data/form-data/issues/262
FormData.prototype.hasKnownLength = function() {
  var hasKnownLength = true;

  if (this._valuesToMeasure.length) {
    hasKnownLength = false;
  }

  return hasKnownLength;
};

FormData.prototype.getLength = function(cb) {
  var knownLength = this._overheadLength + this._valueLength;

  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  if (!this._valuesToMeasure.length) {
    process.nextTick(cb.bind(this, null, knownLength));
    return;
  }

  asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
    if (err) {
      cb(err);
      return;
    }

    values.forEach(function(length) {
      knownLength += length;
    });

    cb(null, knownLength);
  });
};

FormData.prototype.submit = function(params, cb) {
  var request
    , options
    , defaults = {method: 'post'}
    ;

  // parse provided url if it's string
  // or treat it as options object
  if (typeof params == 'string') {

    params = parseUrl(params);
    options = populate({
      port: params.port,
      path: params.pathname,
      host: params.hostname,
      protocol: params.protocol
    }, defaults);

  // use custom params
  } else {

    options = populate(params, defaults);
    // if no port provided use default one
    if (!options.port) {
      options.port = options.protocol == 'https:' ? 443 : 80;
    }
  }

  // put that good code in getHeaders to some use
  options.headers = this.getHeaders(params.headers);

  // https if specified, fallback to http in any other case
  if (options.protocol == 'https:') {
    request = https.request(options);
  } else {
    request = http.request(options);
  }

  // get content length and fire away
  this.getLength(function(err, length) {
    if (err && err !== 'Unknown stream') {
      this._error(err);
      return;
    }

    // add content length
    if (length) {
      request.setHeader('Content-Length', length);
    }

    this.pipe(request);
    if (cb) {
      var onResponse;

      var callback = function (error, responce) {
        request.removeListener('error', callback);
        request.removeListener('response', onResponse);

        return cb.call(this, error, responce);
      };

      onResponse = callback.bind(this, null);

      request.on('error', callback);
      request.on('response', onResponse);
    }
  }.bind(this));

  return request;
};

FormData.prototype._error = function(err) {
  if (!this.error) {
    this.error = err;
    this.pause();
    this.emit('error', err);
  }
};

FormData.prototype.toString = function () {
  return '[object FormData]';
};


/***/ }),

/***/ 7142:
/***/ ((module) => {

// populates missing values
module.exports = function(dst, src) {

  Object.keys(src).forEach(function(prop)
  {
    dst[prop] = dst[prop] || src[prop];
  });

  return dst;
};


/***/ }),

/***/ 1585:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {PassThrough: PassThroughStream} = __nccwpck_require__(2781);

module.exports = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};


/***/ }),

/***/ 1766:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {constants: BufferConstants} = __nccwpck_require__(4300);
const stream = __nccwpck_require__(2781);
const {promisify} = __nccwpck_require__(3837);
const bufferStream = __nccwpck_require__(1585);

const streamPipelinePromisified = promisify(stream.pipeline);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		throw new Error('Expected a stream');
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;
	const stream = bufferStream(options);

	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			// Don't retrieve an oversized buffer.
			if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		(async () => {
			try {
				await streamPipelinePromisified(inputStream, stream);
				resolve();
			} catch (error) {
				rejectPromise(error);
			}
		})();

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

module.exports = getStream;
module.exports.buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
module.exports.array = (stream, options) => getStream(stream, {...options, array: true});
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 1002:
/***/ ((module) => {

"use strict";

// rfc7231 6.1
const statusCodeCacheableByDefault = new Set([
    200,
    203,
    204,
    206,
    300,
    301,
    308,
    404,
    405,
    410,
    414,
    501,
]);

// This implementation does not understand partial responses (206)
const understoodStatuses = new Set([
    200,
    203,
    204,
    300,
    301,
    302,
    303,
    307,
    308,
    404,
    405,
    410,
    414,
    501,
]);

const errorStatusCodes = new Set([
    500,
    502,
    503, 
    504,
]);

const hopByHopHeaders = {
    date: true, // included, because we add Age update Date
    connection: true,
    'keep-alive': true,
    'proxy-authenticate': true,
    'proxy-authorization': true,
    te: true,
    trailer: true,
    'transfer-encoding': true,
    upgrade: true,
};

const excludedFromRevalidationUpdate = {
    // Since the old body is reused, it doesn't make sense to change properties of the body
    'content-length': true,
    'content-encoding': true,
    'transfer-encoding': true,
    'content-range': true,
};

function toNumberOrZero(s) {
    const n = parseInt(s, 10);
    return isFinite(n) ? n : 0;
}

// RFC 5861
function isErrorResponse(response) {
    // consider undefined response as faulty
    if(!response) {
        return true
    }
    return errorStatusCodes.has(response.status);
}

function parseCacheControl(header) {
    const cc = {};
    if (!header) return cc;

    // TODO: When there is more than one value present for a given directive (e.g., two Expires header fields, multiple Cache-Control: max-age directives),
    // the directive's value is considered invalid. Caches are encouraged to consider responses that have invalid freshness information to be stale
    const parts = header.trim().split(/,/);
    for (const part of parts) {
        const [k, v] = part.split(/=/, 2);
        cc[k.trim()] = v === undefined ? true : v.trim().replace(/^"|"$/g, '');
    }

    return cc;
}

function formatCacheControl(cc) {
    let parts = [];
    for (const k in cc) {
        const v = cc[k];
        parts.push(v === true ? k : k + '=' + v);
    }
    if (!parts.length) {
        return undefined;
    }
    return parts.join(', ');
}

module.exports = class CachePolicy {
    constructor(
        req,
        res,
        {
            shared,
            cacheHeuristic,
            immutableMinTimeToLive,
            ignoreCargoCult,
            _fromObject,
        } = {}
    ) {
        if (_fromObject) {
            this._fromObject(_fromObject);
            return;
        }

        if (!res || !res.headers) {
            throw Error('Response headers missing');
        }
        this._assertRequestHasHeaders(req);

        this._responseTime = this.now();
        this._isShared = shared !== false;
        this._cacheHeuristic =
            undefined !== cacheHeuristic ? cacheHeuristic : 0.1; // 10% matches IE
        this._immutableMinTtl =
            undefined !== immutableMinTimeToLive
                ? immutableMinTimeToLive
                : 24 * 3600 * 1000;

        this._status = 'status' in res ? res.status : 200;
        this._resHeaders = res.headers;
        this._rescc = parseCacheControl(res.headers['cache-control']);
        this._method = 'method' in req ? req.method : 'GET';
        this._url = req.url;
        this._host = req.headers.host;
        this._noAuthorization = !req.headers.authorization;
        this._reqHeaders = res.headers.vary ? req.headers : null; // Don't keep all request headers if they won't be used
        this._reqcc = parseCacheControl(req.headers['cache-control']);

        // Assume that if someone uses legacy, non-standard uncecessary options they don't understand caching,
        // so there's no point stricly adhering to the blindly copy&pasted directives.
        if (
            ignoreCargoCult &&
            'pre-check' in this._rescc &&
            'post-check' in this._rescc
        ) {
            delete this._rescc['pre-check'];
            delete this._rescc['post-check'];
            delete this._rescc['no-cache'];
            delete this._rescc['no-store'];
            delete this._rescc['must-revalidate'];
            this._resHeaders = Object.assign({}, this._resHeaders, {
                'cache-control': formatCacheControl(this._rescc),
            });
            delete this._resHeaders.expires;
            delete this._resHeaders.pragma;
        }

        // When the Cache-Control header field is not present in a request, caches MUST consider the no-cache request pragma-directive
        // as having the same effect as if "Cache-Control: no-cache" were present (see Section 5.2.1).
        if (
            res.headers['cache-control'] == null &&
            /no-cache/.test(res.headers.pragma)
        ) {
            this._rescc['no-cache'] = true;
        }
    }

    now() {
        return Date.now();
    }

    storable() {
        // The "no-store" request directive indicates that a cache MUST NOT store any part of either this request or any response to it.
        return !!(
            !this._reqcc['no-store'] &&
            // A cache MUST NOT store a response to any request, unless:
            // The request method is understood by the cache and defined as being cacheable, and
            ('GET' === this._method ||
                'HEAD' === this._method ||
                ('POST' === this._method && this._hasExplicitExpiration())) &&
            // the response status code is understood by the cache, and
            understoodStatuses.has(this._status) &&
            // the "no-store" cache directive does not appear in request or response header fields, and
            !this._rescc['no-store'] &&
            // the "private" response directive does not appear in the response, if the cache is shared, and
            (!this._isShared || !this._rescc.private) &&
            // the Authorization header field does not appear in the request, if the cache is shared,
            (!this._isShared ||
                this._noAuthorization ||
                this._allowsStoringAuthenticated()) &&
            // the response either:
            // contains an Expires header field, or
            (this._resHeaders.expires ||
                // contains a max-age response directive, or
                // contains a s-maxage response directive and the cache is shared, or
                // contains a public response directive.
                this._rescc['max-age'] ||
                (this._isShared && this._rescc['s-maxage']) ||
                this._rescc.public ||
                // has a status code that is defined as cacheable by default
                statusCodeCacheableByDefault.has(this._status))
        );
    }

    _hasExplicitExpiration() {
        // 4.2.1 Calculating Freshness Lifetime
        return (
            (this._isShared && this._rescc['s-maxage']) ||
            this._rescc['max-age'] ||
            this._resHeaders.expires
        );
    }

    _assertRequestHasHeaders(req) {
        if (!req || !req.headers) {
            throw Error('Request headers missing');
        }
    }

    satisfiesWithoutRevalidation(req) {
        this._assertRequestHasHeaders(req);

        // When presented with a request, a cache MUST NOT reuse a stored response, unless:
        // the presented request does not contain the no-cache pragma (Section 5.4), nor the no-cache cache directive,
        // unless the stored response is successfully validated (Section 4.3), and
        const requestCC = parseCacheControl(req.headers['cache-control']);
        if (requestCC['no-cache'] || /no-cache/.test(req.headers.pragma)) {
            return false;
        }

        if (requestCC['max-age'] && this.age() > requestCC['max-age']) {
            return false;
        }

        if (
            requestCC['min-fresh'] &&
            this.timeToLive() < 1000 * requestCC['min-fresh']
        ) {
            return false;
        }

        // the stored response is either:
        // fresh, or allowed to be served stale
        if (this.stale()) {
            const allowsStale =
                requestCC['max-stale'] &&
                !this._rescc['must-revalidate'] &&
                (true === requestCC['max-stale'] ||
                    requestCC['max-stale'] > this.age() - this.maxAge());
            if (!allowsStale) {
                return false;
            }
        }

        return this._requestMatches(req, false);
    }

    _requestMatches(req, allowHeadMethod) {
        // The presented effective request URI and that of the stored response match, and
        return (
            (!this._url || this._url === req.url) &&
            this._host === req.headers.host &&
            // the request method associated with the stored response allows it to be used for the presented request, and
            (!req.method ||
                this._method === req.method ||
                (allowHeadMethod && 'HEAD' === req.method)) &&
            // selecting header fields nominated by the stored response (if any) match those presented, and
            this._varyMatches(req)
        );
    }

    _allowsStoringAuthenticated() {
        //  following Cache-Control response directives (Section 5.2.2) have such an effect: must-revalidate, public, and s-maxage.
        return (
            this._rescc['must-revalidate'] ||
            this._rescc.public ||
            this._rescc['s-maxage']
        );
    }

    _varyMatches(req) {
        if (!this._resHeaders.vary) {
            return true;
        }

        // A Vary header field-value of "*" always fails to match
        if (this._resHeaders.vary === '*') {
            return false;
        }

        const fields = this._resHeaders.vary
            .trim()
            .toLowerCase()
            .split(/\s*,\s*/);
        for (const name of fields) {
            if (req.headers[name] !== this._reqHeaders[name]) return false;
        }
        return true;
    }

    _copyWithoutHopByHopHeaders(inHeaders) {
        const headers = {};
        for (const name in inHeaders) {
            if (hopByHopHeaders[name]) continue;
            headers[name] = inHeaders[name];
        }
        // 9.1.  Connection
        if (inHeaders.connection) {
            const tokens = inHeaders.connection.trim().split(/\s*,\s*/);
            for (const name of tokens) {
                delete headers[name];
            }
        }
        if (headers.warning) {
            const warnings = headers.warning.split(/,/).filter(warning => {
                return !/^\s*1[0-9][0-9]/.test(warning);
            });
            if (!warnings.length) {
                delete headers.warning;
            } else {
                headers.warning = warnings.join(',').trim();
            }
        }
        return headers;
    }

    responseHeaders() {
        const headers = this._copyWithoutHopByHopHeaders(this._resHeaders);
        const age = this.age();

        // A cache SHOULD generate 113 warning if it heuristically chose a freshness
        // lifetime greater than 24 hours and the response's age is greater than 24 hours.
        if (
            age > 3600 * 24 &&
            !this._hasExplicitExpiration() &&
            this.maxAge() > 3600 * 24
        ) {
            headers.warning =
                (headers.warning ? `${headers.warning}, ` : '') +
                '113 - "rfc7234 5.5.4"';
        }
        headers.age = `${Math.round(age)}`;
        headers.date = new Date(this.now()).toUTCString();
        return headers;
    }

    /**
     * Value of the Date response header or current time if Date was invalid
     * @return timestamp
     */
    date() {
        const serverDate = Date.parse(this._resHeaders.date);
        if (isFinite(serverDate)) {
            return serverDate;
        }
        return this._responseTime;
    }

    /**
     * Value of the Age header, in seconds, updated for the current time.
     * May be fractional.
     *
     * @return Number
     */
    age() {
        let age = this._ageValue();

        const residentTime = (this.now() - this._responseTime) / 1000;
        return age + residentTime;
    }

    _ageValue() {
        return toNumberOrZero(this._resHeaders.age);
    }

    /**
     * Value of applicable max-age (or heuristic equivalent) in seconds. This counts since response's `Date`.
     *
     * For an up-to-date value, see `timeToLive()`.
     *
     * @return Number
     */
    maxAge() {
        if (!this.storable() || this._rescc['no-cache']) {
            return 0;
        }

        // Shared responses with cookies are cacheable according to the RFC, but IMHO it'd be unwise to do so by default
        // so this implementation requires explicit opt-in via public header
        if (
            this._isShared &&
            (this._resHeaders['set-cookie'] &&
                !this._rescc.public &&
                !this._rescc.immutable)
        ) {
            return 0;
        }

        if (this._resHeaders.vary === '*') {
            return 0;
        }

        if (this._isShared) {
            if (this._rescc['proxy-revalidate']) {
                return 0;
            }
            // if a response includes the s-maxage directive, a shared cache recipient MUST ignore the Expires field.
            if (this._rescc['s-maxage']) {
                return toNumberOrZero(this._rescc['s-maxage']);
            }
        }

        // If a response includes a Cache-Control field with the max-age directive, a recipient MUST ignore the Expires field.
        if (this._rescc['max-age']) {
            return toNumberOrZero(this._rescc['max-age']);
        }

        const defaultMinTtl = this._rescc.immutable ? this._immutableMinTtl : 0;

        const serverDate = this.date();
        if (this._resHeaders.expires) {
            const expires = Date.parse(this._resHeaders.expires);
            // A cache recipient MUST interpret invalid date formats, especially the value "0", as representing a time in the past (i.e., "already expired").
            if (Number.isNaN(expires) || expires < serverDate) {
                return 0;
            }
            return Math.max(defaultMinTtl, (expires - serverDate) / 1000);
        }

        if (this._resHeaders['last-modified']) {
            const lastModified = Date.parse(this._resHeaders['last-modified']);
            if (isFinite(lastModified) && serverDate > lastModified) {
                return Math.max(
                    defaultMinTtl,
                    ((serverDate - lastModified) / 1000) * this._cacheHeuristic
                );
            }
        }

        return defaultMinTtl;
    }

    timeToLive() {
        const age = this.maxAge() - this.age();
        const staleIfErrorAge = age + toNumberOrZero(this._rescc['stale-if-error']);
        const staleWhileRevalidateAge = age + toNumberOrZero(this._rescc['stale-while-revalidate']);
        return Math.max(0, age, staleIfErrorAge, staleWhileRevalidateAge) * 1000;
    }

    stale() {
        return this.maxAge() <= this.age();
    }

    _useStaleIfError() {
        return this.maxAge() + toNumberOrZero(this._rescc['stale-if-error']) > this.age();
    }

    useStaleWhileRevalidate() {
        return this.maxAge() + toNumberOrZero(this._rescc['stale-while-revalidate']) > this.age();
    }

    static fromObject(obj) {
        return new this(undefined, undefined, { _fromObject: obj });
    }

    _fromObject(obj) {
        if (this._responseTime) throw Error('Reinitialized');
        if (!obj || obj.v !== 1) throw Error('Invalid serialization');

        this._responseTime = obj.t;
        this._isShared = obj.sh;
        this._cacheHeuristic = obj.ch;
        this._immutableMinTtl =
            obj.imm !== undefined ? obj.imm : 24 * 3600 * 1000;
        this._status = obj.st;
        this._resHeaders = obj.resh;
        this._rescc = obj.rescc;
        this._method = obj.m;
        this._url = obj.u;
        this._host = obj.h;
        this._noAuthorization = obj.a;
        this._reqHeaders = obj.reqh;
        this._reqcc = obj.reqcc;
    }

    toObject() {
        return {
            v: 1,
            t: this._responseTime,
            sh: this._isShared,
            ch: this._cacheHeuristic,
            imm: this._immutableMinTtl,
            st: this._status,
            resh: this._resHeaders,
            rescc: this._rescc,
            m: this._method,
            u: this._url,
            h: this._host,
            a: this._noAuthorization,
            reqh: this._reqHeaders,
            reqcc: this._reqcc,
        };
    }

    /**
     * Headers for sending to the origin server to revalidate stale response.
     * Allows server to return 304 to allow reuse of the previous response.
     *
     * Hop by hop headers are always stripped.
     * Revalidation headers may be added or removed, depending on request.
     */
    revalidationHeaders(incomingReq) {
        this._assertRequestHasHeaders(incomingReq);
        const headers = this._copyWithoutHopByHopHeaders(incomingReq.headers);

        // This implementation does not understand range requests
        delete headers['if-range'];

        if (!this._requestMatches(incomingReq, true) || !this.storable()) {
            // revalidation allowed via HEAD
            // not for the same resource, or wasn't allowed to be cached anyway
            delete headers['if-none-match'];
            delete headers['if-modified-since'];
            return headers;
        }

        /* MUST send that entity-tag in any cache validation request (using If-Match or If-None-Match) if an entity-tag has been provided by the origin server. */
        if (this._resHeaders.etag) {
            headers['if-none-match'] = headers['if-none-match']
                ? `${headers['if-none-match']}, ${this._resHeaders.etag}`
                : this._resHeaders.etag;
        }

        // Clients MAY issue simple (non-subrange) GET requests with either weak validators or strong validators. Clients MUST NOT use weak validators in other forms of request.
        const forbidsWeakValidators =
            headers['accept-ranges'] ||
            headers['if-match'] ||
            headers['if-unmodified-since'] ||
            (this._method && this._method != 'GET');

        /* SHOULD send the Last-Modified value in non-subrange cache validation requests (using If-Modified-Since) if only a Last-Modified value has been provided by the origin server.
        Note: This implementation does not understand partial responses (206) */
        if (forbidsWeakValidators) {
            delete headers['if-modified-since'];

            if (headers['if-none-match']) {
                const etags = headers['if-none-match']
                    .split(/,/)
                    .filter(etag => {
                        return !/^\s*W\//.test(etag);
                    });
                if (!etags.length) {
                    delete headers['if-none-match'];
                } else {
                    headers['if-none-match'] = etags.join(',').trim();
                }
            }
        } else if (
            this._resHeaders['last-modified'] &&
            !headers['if-modified-since']
        ) {
            headers['if-modified-since'] = this._resHeaders['last-modified'];
        }

        return headers;
    }

    /**
     * Creates new CachePolicy with information combined from the previews response,
     * and the new revalidation response.
     *
     * Returns {policy, modified} where modified is a boolean indicating
     * whether the response body has been modified, and old cached body can't be used.
     *
     * @return {Object} {policy: CachePolicy, modified: Boolean}
     */
    revalidatedPolicy(request, response) {
        this._assertRequestHasHeaders(request);
        if(this._useStaleIfError() && isErrorResponse(response)) {  // I consider the revalidation request unsuccessful
          return {
            modified: false,
            matches: false,
            policy: this,
          };
        }
        if (!response || !response.headers) {
            throw Error('Response headers missing');
        }

        // These aren't going to be supported exactly, since one CachePolicy object
        // doesn't know about all the other cached objects.
        let matches = false;
        if (response.status !== undefined && response.status != 304) {
            matches = false;
        } else if (
            response.headers.etag &&
            !/^\s*W\//.test(response.headers.etag)
        ) {
            // "All of the stored responses with the same strong validator are selected.
            // If none of the stored responses contain the same strong validator,
            // then the cache MUST NOT use the new response to update any stored responses."
            matches =
                this._resHeaders.etag &&
                this._resHeaders.etag.replace(/^\s*W\//, '') ===
                    response.headers.etag;
        } else if (this._resHeaders.etag && response.headers.etag) {
            // "If the new response contains a weak validator and that validator corresponds
            // to one of the cache's stored responses,
            // then the most recent of those matching stored responses is selected for update."
            matches =
                this._resHeaders.etag.replace(/^\s*W\//, '') ===
                response.headers.etag.replace(/^\s*W\//, '');
        } else if (this._resHeaders['last-modified']) {
            matches =
                this._resHeaders['last-modified'] ===
                response.headers['last-modified'];
        } else {
            // If the new response does not include any form of validator (such as in the case where
            // a client generates an If-Modified-Since request from a source other than the Last-Modified
            // response header field), and there is only one stored response, and that stored response also
            // lacks a validator, then that stored response is selected for update.
            if (
                !this._resHeaders.etag &&
                !this._resHeaders['last-modified'] &&
                !response.headers.etag &&
                !response.headers['last-modified']
            ) {
                matches = true;
            }
        }

        if (!matches) {
            return {
                policy: new this.constructor(request, response),
                // Client receiving 304 without body, even if it's invalid/mismatched has no option
                // but to reuse a cached body. We don't have a good way to tell clients to do
                // error recovery in such case.
                modified: response.status != 304,
                matches: false,
            };
        }

        // use other header fields provided in the 304 (Not Modified) response to replace all instances
        // of the corresponding header fields in the stored response.
        const headers = {};
        for (const k in this._resHeaders) {
            headers[k] =
                k in response.headers && !excludedFromRevalidationUpdate[k]
                    ? response.headers[k]
                    : this._resHeaders[k];
        }

        const newResponse = Object.assign({}, response, {
            status: this._status,
            method: this._method,
            headers,
        });
        return {
            policy: new this.constructor(request, newResponse, {
                shared: this._isShared,
                cacheHeuristic: this._cacheHeuristic,
                immutableMinTimeToLive: this._immutableMinTtl,
            }),
            modified: false,
            matches: true,
        };
    }
};


/***/ }),

/***/ 9898:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

// See https://github.com/facebook/jest/issues/2549
// eslint-disable-next-line node/prefer-global/url
const {URL} = __nccwpck_require__(7310);
const EventEmitter = __nccwpck_require__(2361);
const tls = __nccwpck_require__(4404);
const http2 = __nccwpck_require__(5158);
const QuickLRU = __nccwpck_require__(9273);
const delayAsyncDestroy = __nccwpck_require__(9237);

const kCurrentStreamCount = Symbol('currentStreamCount');
const kRequest = Symbol('request');
const kOriginSet = Symbol('cachedOriginSet');
const kGracefullyClosing = Symbol('gracefullyClosing');
const kLength = Symbol('length');

const nameKeys = [
	// Not an Agent option actually
	'createConnection',

	// `http2.connect()` options
	'maxDeflateDynamicTableSize',
	'maxSettings',
	'maxSessionMemory',
	'maxHeaderListPairs',
	'maxOutstandingPings',
	'maxReservedRemoteStreams',
	'maxSendHeaderBlockLength',
	'paddingStrategy',
	'peerMaxConcurrentStreams',
	'settings',

	// `tls.connect()` source options
	'family',
	'localAddress',
	'rejectUnauthorized',

	// `tls.connect()` secure context options
	'pskCallback',
	'minDHSize',

	// `tls.connect()` destination options
	// - `servername` is automatically validated, skip it
	// - `host` and `port` just describe the destination server,
	'path',
	'socket',

	// `tls.createSecureContext()` options
	'ca',
	'cert',
	'sigalgs',
	'ciphers',
	'clientCertEngine',
	'crl',
	'dhparam',
	'ecdhCurve',
	'honorCipherOrder',
	'key',
	'privateKeyEngine',
	'privateKeyIdentifier',
	'maxVersion',
	'minVersion',
	'pfx',
	'secureOptions',
	'secureProtocol',
	'sessionIdContext',
	'ticketKeys'
];

const getSortedIndex = (array, value, compare) => {
	let low = 0;
	let high = array.length;

	while (low < high) {
		const mid = (low + high) >>> 1;

		if (compare(array[mid], value)) {
			low = mid + 1;
		} else {
			high = mid;
		}
	}

	return low;
};

const compareSessions = (a, b) => a.remoteSettings.maxConcurrentStreams > b.remoteSettings.maxConcurrentStreams;

// See https://tools.ietf.org/html/rfc8336
const closeCoveredSessions = (where, session) => {
	// Clients SHOULD NOT emit new requests on any connection whose Origin
	// Set is a proper subset of another connection's Origin Set, and they
	// SHOULD close it once all outstanding requests are satisfied.
	for (let index = 0; index < where.length; index++) {
		const coveredSession = where[index];

		if (
			// Unfortunately `.every()` returns true for an empty array
			coveredSession[kOriginSet].length > 0

			// The set is a proper subset when its length is less than the other set.
			&& coveredSession[kOriginSet].length < session[kOriginSet].length

			// And the other set includes all elements of the subset.
			&& coveredSession[kOriginSet].every(origin => session[kOriginSet].includes(origin))

			// Makes sure that the session can handle all requests from the covered session.
			&& (coveredSession[kCurrentStreamCount] + session[kCurrentStreamCount]) <= session.remoteSettings.maxConcurrentStreams
		) {
			// This allows pending requests to finish and prevents making new requests.
			gracefullyClose(coveredSession);
		}
	}
};

// This is basically inverted `closeCoveredSessions(...)`.
const closeSessionIfCovered = (where, coveredSession) => {
	for (let index = 0; index < where.length; index++) {
		const session = where[index];

		if (
			coveredSession[kOriginSet].length > 0
			&& coveredSession[kOriginSet].length < session[kOriginSet].length
			&& coveredSession[kOriginSet].every(origin => session[kOriginSet].includes(origin))
			&& (coveredSession[kCurrentStreamCount] + session[kCurrentStreamCount]) <= session.remoteSettings.maxConcurrentStreams
		) {
			gracefullyClose(coveredSession);

			return true;
		}
	}

	return false;
};

const gracefullyClose = session => {
	session[kGracefullyClosing] = true;

	if (session[kCurrentStreamCount] === 0) {
		session.close();
	}
};

class Agent extends EventEmitter {
	constructor({timeout = 0, maxSessions = Number.POSITIVE_INFINITY, maxEmptySessions = 10, maxCachedTlsSessions = 100} = {}) {
		super();

		// SESSIONS[NORMALIZED_OPTIONS] = [];
		this.sessions = {};

		// The queue for creating new sessions. It looks like this:
		// QUEUE[NORMALIZED_OPTIONS][NORMALIZED_ORIGIN] = ENTRY_FUNCTION
		//
		// It's faster when there are many origins. If there's only one, then QUEUE[`${options}:${origin}`] is faster.
		// I guess object creation / deletion is causing the slowdown.
		//
		// The entry function has `listeners`, `completed` and `destroyed` properties.
		// `listeners` is an array of objects containing `resolve` and `reject` functions.
		// `completed` is a boolean. It's set to true after ENTRY_FUNCTION is executed.
		// `destroyed` is a boolean. If it's set to true, the session will be destroyed if hasn't connected yet.
		this.queue = {};

		// Each session will use this timeout value.
		this.timeout = timeout;

		// Max sessions in total
		this.maxSessions = maxSessions;

		// Max empty sessions in total
		this.maxEmptySessions = maxEmptySessions;

		this._emptySessionCount = 0;
		this._sessionCount = 0;

		// We don't support push streams by default.
		this.settings = {
			enablePush: false,
			initialWindowSize: 1024 * 1024 * 32 // 32MB, see https://github.com/nodejs/node/issues/38426
		};

		// Reusing TLS sessions increases performance.
		this.tlsSessionCache = new QuickLRU({maxSize: maxCachedTlsSessions});
	}

	get protocol() {
		return 'https:';
	}

	normalizeOptions(options) {
		let normalized = '';

		for (let index = 0; index < nameKeys.length; index++) {
			const key = nameKeys[index];

			normalized += ':';

			if (options && options[key] !== undefined) {
				normalized += options[key];
			}
		}

		return normalized;
	}

	_processQueue() {
		if (this._sessionCount >= this.maxSessions) {
			this.closeEmptySessions(this.maxSessions - this._sessionCount + 1);
			return;
		}

		// eslint-disable-next-line guard-for-in
		for (const normalizedOptions in this.queue) {
			// eslint-disable-next-line guard-for-in
			for (const normalizedOrigin in this.queue[normalizedOptions]) {
				const item = this.queue[normalizedOptions][normalizedOrigin];

				// The entry function can be run only once.
				if (!item.completed) {
					item.completed = true;

					item();
				}
			}
		}
	}

	_isBetterSession(thisStreamCount, thatStreamCount) {
		return thisStreamCount > thatStreamCount;
	}

	_accept(session, listeners, normalizedOrigin, options) {
		let index = 0;

		while (index < listeners.length && session[kCurrentStreamCount] < session.remoteSettings.maxConcurrentStreams) {
			// We assume `resolve(...)` calls `request(...)` *directly*,
			// otherwise the session will get overloaded.
			listeners[index].resolve(session);

			index++;
		}

		listeners.splice(0, index);

		if (listeners.length > 0) {
			this.getSession(normalizedOrigin, options, listeners);
			listeners.length = 0;
		}
	}

	getSession(origin, options, listeners) {
		return new Promise((resolve, reject) => {
			if (Array.isArray(listeners) && listeners.length > 0) {
				listeners = [...listeners];

				// Resolve the current promise ASAP, we're just moving the listeners.
				// They will be executed at a different time.
				resolve();
			} else {
				listeners = [{resolve, reject}];
			}

			try {
				// Parse origin
				if (typeof origin === 'string') {
					origin = new URL(origin);
				} else if (!(origin instanceof URL)) {
					throw new TypeError('The `origin` argument needs to be a string or an URL object');
				}

				if (options) {
					// Validate servername
					const {servername} = options;
					const {hostname} = origin;
					if (servername && hostname !== servername) {
						throw new Error(`Origin ${hostname} differs from servername ${servername}`);
					}
				}
			} catch (error) {
				for (let index = 0; index < listeners.length; index++) {
					listeners[index].reject(error);
				}

				return;
			}

			const normalizedOptions = this.normalizeOptions(options);
			const normalizedOrigin = origin.origin;

			if (normalizedOptions in this.sessions) {
				const sessions = this.sessions[normalizedOptions];

				let maxConcurrentStreams = -1;
				let currentStreamsCount = -1;
				let optimalSession;

				// We could just do this.sessions[normalizedOptions].find(...) but that isn't optimal.
				// Additionally, we are looking for session which has biggest current pending streams count.
				//
				// |------------| |------------| |------------| |------------|
				// | Session: A | | Session: B | | Session: C | | Session: D |
				// | Pending: 5 |-| Pending: 8 |-| Pending: 9 |-| Pending: 4 |
				// | Max:    10 | | Max:    10 | | Max:     9 | | Max:     5 |
				// |------------| |------------| |------------| |------------|
				//                     ^
				//                     |
				//     pick this one  --
				//
				for (let index = 0; index < sessions.length; index++) {
					const session = sessions[index];

					const sessionMaxConcurrentStreams = session.remoteSettings.maxConcurrentStreams;

					if (sessionMaxConcurrentStreams < maxConcurrentStreams) {
						break;
					}

					if (!session[kOriginSet].includes(normalizedOrigin)) {
						continue;
					}

					const sessionCurrentStreamsCount = session[kCurrentStreamCount];

					if (
						sessionCurrentStreamsCount >= sessionMaxConcurrentStreams
						|| session[kGracefullyClosing]
						// Unfortunately the `close` event isn't called immediately,
						// so `session.destroyed` is `true`, but `session.closed` is `false`.
						|| session.destroyed
					) {
						continue;
					}

					// We only need set this once.
					if (!optimalSession) {
						maxConcurrentStreams = sessionMaxConcurrentStreams;
					}

					// Either get the session which has biggest current stream count or the lowest.
					if (this._isBetterSession(sessionCurrentStreamsCount, currentStreamsCount)) {
						optimalSession = session;
						currentStreamsCount = sessionCurrentStreamsCount;
					}
				}

				if (optimalSession) {
					this._accept(optimalSession, listeners, normalizedOrigin, options);
					return;
				}
			}

			if (normalizedOptions in this.queue) {
				if (normalizedOrigin in this.queue[normalizedOptions]) {
					// There's already an item in the queue, just attach ourselves to it.
					this.queue[normalizedOptions][normalizedOrigin].listeners.push(...listeners);
					return;
				}
			} else {
				this.queue[normalizedOptions] = {
					[kLength]: 0
				};
			}

			// The entry must be removed from the queue IMMEDIATELY when:
			// 1. the session connects successfully,
			// 2. an error occurs.
			const removeFromQueue = () => {
				// Our entry can be replaced. We cannot remove the new one.
				if (normalizedOptions in this.queue && this.queue[normalizedOptions][normalizedOrigin] === entry) {
					delete this.queue[normalizedOptions][normalizedOrigin];

					if (--this.queue[normalizedOptions][kLength] === 0) {
						delete this.queue[normalizedOptions];
					}
				}
			};

			// The main logic is here
			const entry = async () => {
				this._sessionCount++;

				const name = `${normalizedOrigin}:${normalizedOptions}`;
				let receivedSettings = false;
				let socket;

				try {
					const computedOptions = {...options};

					if (computedOptions.settings === undefined) {
						computedOptions.settings = this.settings;
					}

					if (computedOptions.session === undefined) {
						computedOptions.session = this.tlsSessionCache.get(name);
					}

					const createConnection = computedOptions.createConnection || this.createConnection;

					// A hacky workaround to enable async `createConnection`
					socket = await createConnection.call(this, origin, computedOptions);
					computedOptions.createConnection = () => socket;

					const session = http2.connect(origin, computedOptions);
					session[kCurrentStreamCount] = 0;
					session[kGracefullyClosing] = false;

					// Node.js return https://false:443 instead of https://1.1.1.1:443
					const getOriginSet = () => {
						const {socket} = session;

						let originSet;
						if (socket.servername === false) {
							socket.servername = socket.remoteAddress;
							originSet = session.originSet;
							socket.servername = false;
						} else {
							originSet = session.originSet;
						}

						return originSet;
					};

					const isFree = () => session[kCurrentStreamCount] < session.remoteSettings.maxConcurrentStreams;

					session.socket.once('session', tlsSession => {
						this.tlsSessionCache.set(name, tlsSession);
					});

					session.once('error', error => {
						// Listeners are empty when the session successfully connected.
						for (let index = 0; index < listeners.length; index++) {
							listeners[index].reject(error);
						}

						// The connection got broken, purge the cache.
						this.tlsSessionCache.delete(name);
					});

					session.setTimeout(this.timeout, () => {
						// Terminates all streams owned by this session.
						session.destroy();
					});

					session.once('close', () => {
						this._sessionCount--;

						if (receivedSettings) {
							// Assumes session `close` is emitted after request `close`
							this._emptySessionCount--;

							// This cannot be moved to the stream logic,
							// because there may be a session that hadn't made a single request.
							const where = this.sessions[normalizedOptions];

							if (where.length === 1) {
								delete this.sessions[normalizedOptions];
							} else {
								where.splice(where.indexOf(session), 1);
							}
						} else {
							// Broken connection
							removeFromQueue();

							const error = new Error('Session closed without receiving a SETTINGS frame');
							error.code = 'HTTP2WRAPPER_NOSETTINGS';

							for (let index = 0; index < listeners.length; index++) {
								listeners[index].reject(error);
							}
						}

						// There may be another session awaiting.
						this._processQueue();
					});

					// Iterates over the queue and processes listeners.
					const processListeners = () => {
						const queue = this.queue[normalizedOptions];
						if (!queue) {
							return;
						}

						const originSet = session[kOriginSet];

						for (let index = 0; index < originSet.length; index++) {
							const origin = originSet[index];

							if (origin in queue) {
								const {listeners, completed} = queue[origin];

								let index = 0;

								// Prevents session overloading.
								while (index < listeners.length && isFree()) {
									// We assume `resolve(...)` calls `request(...)` *directly*,
									// otherwise the session will get overloaded.
									listeners[index].resolve(session);

									index++;
								}

								queue[origin].listeners.splice(0, index);

								if (queue[origin].listeners.length === 0 && !completed) {
									delete queue[origin];

									if (--queue[kLength] === 0) {
										delete this.queue[normalizedOptions];
										break;
									}
								}

								// We're no longer free, no point in continuing.
								if (!isFree()) {
									break;
								}
							}
						}
					};

					// The Origin Set cannot shrink. No need to check if it suddenly became covered by another one.
					session.on('origin', () => {
						session[kOriginSet] = getOriginSet() || [];
						session[kGracefullyClosing] = false;
						closeSessionIfCovered(this.sessions[normalizedOptions], session);

						if (session[kGracefullyClosing] || !isFree()) {
							return;
						}

						processListeners();

						if (!isFree()) {
							return;
						}

						// Close covered sessions (if possible).
						closeCoveredSessions(this.sessions[normalizedOptions], session);
					});

					session.once('remoteSettings', () => {
						// The Agent could have been destroyed already.
						if (entry.destroyed) {
							const error = new Error('Agent has been destroyed');

							for (let index = 0; index < listeners.length; index++) {
								listeners[index].reject(error);
							}

							session.destroy();
							return;
						}

						// See https://github.com/nodejs/node/issues/38426
						if (session.setLocalWindowSize) {
							session.setLocalWindowSize(1024 * 1024 * 4); // 4 MB
						}

						session[kOriginSet] = getOriginSet() || [];

						if (session.socket.encrypted) {
							const mainOrigin = session[kOriginSet][0];
							if (mainOrigin !== normalizedOrigin) {
								const error = new Error(`Requested origin ${normalizedOrigin} does not match server ${mainOrigin}`);

								for (let index = 0; index < listeners.length; index++) {
									listeners[index].reject(error);
								}

								session.destroy();
								return;
							}
						}

						removeFromQueue();

						{
							const where = this.sessions;

							if (normalizedOptions in where) {
								const sessions = where[normalizedOptions];
								sessions.splice(getSortedIndex(sessions, session, compareSessions), 0, session);
							} else {
								where[normalizedOptions] = [session];
							}
						}

						receivedSettings = true;
						this._emptySessionCount++;

						this.emit('session', session);
						this._accept(session, listeners, normalizedOrigin, options);

						if (session[kCurrentStreamCount] === 0 && this._emptySessionCount > this.maxEmptySessions) {
							this.closeEmptySessions(this._emptySessionCount - this.maxEmptySessions);
						}

						// `session.remoteSettings.maxConcurrentStreams` might get increased
						session.on('remoteSettings', () => {
							if (!isFree()) {
								return;
							}

							processListeners();

							if (!isFree()) {
								return;
							}

							// In case the Origin Set changes
							closeCoveredSessions(this.sessions[normalizedOptions], session);
						});
					});

					// Shim `session.request()` in order to catch all streams
					session[kRequest] = session.request;
					session.request = (headers, streamOptions) => {
						if (session[kGracefullyClosing]) {
							throw new Error('The session is gracefully closing. No new streams are allowed.');
						}

						const stream = session[kRequest](headers, streamOptions);

						// The process won't exit until the session is closed or all requests are gone.
						session.ref();

						if (session[kCurrentStreamCount]++ === 0) {
							this._emptySessionCount--;
						}

						stream.once('close', () => {
							if (--session[kCurrentStreamCount] === 0) {
								this._emptySessionCount++;
								session.unref();

								if (this._emptySessionCount > this.maxEmptySessions || session[kGracefullyClosing]) {
									session.close();
									return;
								}
							}

							if (session.destroyed || session.closed) {
								return;
							}

							if (isFree() && !closeSessionIfCovered(this.sessions[normalizedOptions], session)) {
								closeCoveredSessions(this.sessions[normalizedOptions], session);
								processListeners();

								if (session[kCurrentStreamCount] === 0) {
									this._processQueue();
								}
							}
						});

						return stream;
					};
				} catch (error) {
					removeFromQueue();
					this._sessionCount--;

					for (let index = 0; index < listeners.length; index++) {
						listeners[index].reject(error);
					}
				}
			};

			entry.listeners = listeners;
			entry.completed = false;
			entry.destroyed = false;

			this.queue[normalizedOptions][normalizedOrigin] = entry;
			this.queue[normalizedOptions][kLength]++;
			this._processQueue();
		});
	}

	request(origin, options, headers, streamOptions) {
		return new Promise((resolve, reject) => {
			this.getSession(origin, options, [{
				reject,
				resolve: session => {
					try {
						const stream = session.request(headers, streamOptions);

						// Do not throw before `request(...)` has been awaited
						delayAsyncDestroy(stream);

						resolve(stream);
					} catch (error) {
						reject(error);
					}
				}
			}]);
		});
	}

	async createConnection(origin, options) {
		return Agent.connect(origin, options);
	}

	static connect(origin, options) {
		options.ALPNProtocols = ['h2'];

		const port = origin.port || 443;
		const host = origin.hostname;

		if (typeof options.servername === 'undefined') {
			options.servername = host;
		}

		const socket = tls.connect(port, host, options);

		if (options.socket) {
			socket._peername = {
				family: undefined,
				address: undefined,
				port
			};
		}

		return socket;
	}

	closeEmptySessions(maxCount = Number.POSITIVE_INFINITY) {
		let closedCount = 0;

		const {sessions} = this;

		// eslint-disable-next-line guard-for-in
		for (const key in sessions) {
			const thisSessions = sessions[key];

			for (let index = 0; index < thisSessions.length; index++) {
				const session = thisSessions[index];

				if (session[kCurrentStreamCount] === 0) {
					closedCount++;
					session.close();

					if (closedCount >= maxCount) {
						return closedCount;
					}
				}
			}
		}

		return closedCount;
	}

	destroy(reason) {
		const {sessions, queue} = this;

		// eslint-disable-next-line guard-for-in
		for (const key in sessions) {
			const thisSessions = sessions[key];

			for (let index = 0; index < thisSessions.length; index++) {
				thisSessions[index].destroy(reason);
			}
		}

		// eslint-disable-next-line guard-for-in
		for (const normalizedOptions in queue) {
			const entries = queue[normalizedOptions];

			// eslint-disable-next-line guard-for-in
			for (const normalizedOrigin in entries) {
				entries[normalizedOrigin].destroyed = true;
			}
		}

		// New requests should NOT attach to destroyed sessions
		this.queue = {};
		this.tlsSessionCache.clear();
	}

	get emptySessionCount() {
		return this._emptySessionCount;
	}

	get pendingSessionCount() {
		return this._sessionCount - this._emptySessionCount;
	}

	get sessionCount() {
		return this._sessionCount;
	}
}

Agent.kCurrentStreamCount = kCurrentStreamCount;
Agent.kGracefullyClosing = kGracefullyClosing;

module.exports = {
	Agent,
	globalAgent: new Agent()
};


/***/ }),

/***/ 7167:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

// See https://github.com/facebook/jest/issues/2549
// eslint-disable-next-line node/prefer-global/url
const {URL, urlToHttpOptions} = __nccwpck_require__(7310);
const http = __nccwpck_require__(3685);
const https = __nccwpck_require__(5687);
const resolveALPN = __nccwpck_require__(6624);
const QuickLRU = __nccwpck_require__(9273);
const {Agent, globalAgent} = __nccwpck_require__(9898);
const Http2ClientRequest = __nccwpck_require__(9632);
const calculateServerName = __nccwpck_require__(1982);
const delayAsyncDestroy = __nccwpck_require__(9237);

const cache = new QuickLRU({maxSize: 100});
const queue = new Map();

const installSocket = (agent, socket, options) => {
	socket._httpMessage = {shouldKeepAlive: true};

	const onFree = () => {
		agent.emit('free', socket, options);
	};

	socket.on('free', onFree);

	const onClose = () => {
		agent.removeSocket(socket, options);
	};

	socket.on('close', onClose);

	const onTimeout = () => {
		const {freeSockets} = agent;

		for (const sockets of Object.values(freeSockets)) {
			if (sockets.includes(socket)) {
				socket.destroy();
				return;
			}
		}
	};

	socket.on('timeout', onTimeout);

	const onRemove = () => {
		agent.removeSocket(socket, options);
		socket.off('close', onClose);
		socket.off('free', onFree);
		socket.off('timeout', onTimeout);
		socket.off('agentRemove', onRemove);
	};

	socket.on('agentRemove', onRemove);

	agent.emit('free', socket, options);
};

const createResolveProtocol = (cache, queue = new Map(), connect = undefined) => {
	return async options => {
		const name = `${options.host}:${options.port}:${options.ALPNProtocols.sort()}`;

		if (!cache.has(name)) {
			if (queue.has(name)) {
				const result = await queue.get(name);
				return {alpnProtocol: result.alpnProtocol};
			}

			const {path} = options;
			options.path = options.socketPath;

			const resultPromise = resolveALPN(options, connect);
			queue.set(name, resultPromise);

			try {
				const result = await resultPromise;

				cache.set(name, result.alpnProtocol);
				queue.delete(name);

				options.path = path;

				return result;
			} catch (error) {
				queue.delete(name);

				options.path = path;

				throw error;
			}
		}

		return {alpnProtocol: cache.get(name)};
	};
};

const defaultResolveProtocol = createResolveProtocol(cache, queue);

module.exports = async (input, options, callback) => {
	if (typeof input === 'string') {
		input = urlToHttpOptions(new URL(input));
	} else if (input instanceof URL) {
		input = urlToHttpOptions(input);
	} else {
		input = {...input};
	}

	if (typeof options === 'function' || options === undefined) {
		// (options, callback)
		callback = options;
		options = input;
	} else {
		// (input, options, callback)
		options = Object.assign(input, options);
	}

	options.ALPNProtocols = options.ALPNProtocols || ['h2', 'http/1.1'];

	if (!Array.isArray(options.ALPNProtocols) || options.ALPNProtocols.length === 0) {
		throw new Error('The `ALPNProtocols` option must be an Array with at least one entry');
	}

	options.protocol = options.protocol || 'https:';
	const isHttps = options.protocol === 'https:';

	options.host = options.hostname || options.host || 'localhost';
	options.session = options.tlsSession;
	options.servername = options.servername || calculateServerName((options.headers && options.headers.host) || options.host);
	options.port = options.port || (isHttps ? 443 : 80);
	options._defaultAgent = isHttps ? https.globalAgent : http.globalAgent;

	const resolveProtocol = options.resolveProtocol || defaultResolveProtocol;

	// Note: We don't support `h2session` here

	let {agent} = options;
	if (agent !== undefined && agent !== false && agent.constructor.name !== 'Object') {
		throw new Error('The `options.agent` can be only an object `http`, `https` or `http2` properties');
	}

	if (isHttps) {
		options.resolveSocket = true;

		let {socket, alpnProtocol, timeout} = await resolveProtocol(options);

		if (timeout) {
			if (socket) {
				socket.destroy();
			}

			const error = new Error(`Timed out resolving ALPN: ${options.timeout} ms`);
			error.code = 'ETIMEDOUT';
			error.ms = options.timeout;

			throw error;
		}

		// We can't accept custom `createConnection` because the API is different for HTTP/2
		if (socket && options.createConnection) {
			socket.destroy();
			socket = undefined;
		}

		delete options.resolveSocket;

		const isHttp2 = alpnProtocol === 'h2';

		if (agent) {
			agent = isHttp2 ? agent.http2 : agent.https;
			options.agent = agent;
		}

		if (agent === undefined) {
			agent = isHttp2 ? globalAgent : https.globalAgent;
		}

		if (socket) {
			if (agent === false) {
				socket.destroy();
			} else {
				const defaultCreateConnection = (isHttp2 ? Agent : https.Agent).prototype.createConnection;

				if (agent.createConnection === defaultCreateConnection) {
					if (isHttp2) {
						options._reuseSocket = socket;
					} else {
						installSocket(agent, socket, options);
					}
				} else {
					socket.destroy();
				}
			}
		}

		if (isHttp2) {
			return delayAsyncDestroy(new Http2ClientRequest(options, callback));
		}
	} else if (agent) {
		options.agent = agent.http;
	}

	return delayAsyncDestroy(http.request(options, callback));
};

module.exports.protocolCache = cache;
module.exports.resolveProtocol = defaultResolveProtocol;
module.exports.createResolveProtocol = createResolveProtocol;


/***/ }),

/***/ 9632:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

// See https://github.com/facebook/jest/issues/2549
// eslint-disable-next-line node/prefer-global/url
const {URL, urlToHttpOptions} = __nccwpck_require__(7310);
const http2 = __nccwpck_require__(5158);
const {Writable} = __nccwpck_require__(2781);
const {Agent, globalAgent} = __nccwpck_require__(9898);
const IncomingMessage = __nccwpck_require__(2575);
const proxyEvents = __nccwpck_require__(1818);
const {
	ERR_INVALID_ARG_TYPE,
	ERR_INVALID_PROTOCOL,
	ERR_HTTP_HEADERS_SENT
} = __nccwpck_require__(7087);
const validateHeaderName = __nccwpck_require__(4592);
const validateHeaderValue = __nccwpck_require__(3549);
const proxySocketHandler = __nccwpck_require__(9404);

const {
	HTTP2_HEADER_STATUS,
	HTTP2_HEADER_METHOD,
	HTTP2_HEADER_PATH,
	HTTP2_HEADER_AUTHORITY,
	HTTP2_METHOD_CONNECT
} = http2.constants;

const kHeaders = Symbol('headers');
const kOrigin = Symbol('origin');
const kSession = Symbol('session');
const kOptions = Symbol('options');
const kFlushedHeaders = Symbol('flushedHeaders');
const kJobs = Symbol('jobs');
const kPendingAgentPromise = Symbol('pendingAgentPromise');

class ClientRequest extends Writable {
	constructor(input, options, callback) {
		super({
			autoDestroy: false,
			emitClose: false
		});

		if (typeof input === 'string') {
			input = urlToHttpOptions(new URL(input));
		} else if (input instanceof URL) {
			input = urlToHttpOptions(input);
		} else {
			input = {...input};
		}

		if (typeof options === 'function' || options === undefined) {
			// (options, callback)
			callback = options;
			options = input;
		} else {
			// (input, options, callback)
			options = Object.assign(input, options);
		}

		if (options.h2session) {
			this[kSession] = options.h2session;

			if (this[kSession].destroyed) {
				throw new Error('The session has been closed already');
			}

			this.protocol = this[kSession].socket.encrypted ? 'https:' : 'http:';
		} else if (options.agent === false) {
			this.agent = new Agent({maxEmptySessions: 0});
		} else if (typeof options.agent === 'undefined' || options.agent === null) {
			this.agent = globalAgent;
		} else if (typeof options.agent.request === 'function') {
			this.agent = options.agent;
		} else {
			throw new ERR_INVALID_ARG_TYPE('options.agent', ['http2wrapper.Agent-like Object', 'undefined', 'false'], options.agent);
		}

		if (this.agent) {
			this.protocol = this.agent.protocol;
		}

		if (options.protocol && options.protocol !== this.protocol) {
			throw new ERR_INVALID_PROTOCOL(options.protocol, this.protocol);
		}

		if (!options.port) {
			options.port = options.defaultPort || (this.agent && this.agent.defaultPort) || 443;
		}

		options.host = options.hostname || options.host || 'localhost';

		// Unused
		delete options.hostname;

		const {timeout} = options;
		options.timeout = undefined;

		this[kHeaders] = Object.create(null);
		this[kJobs] = [];

		this[kPendingAgentPromise] = undefined;

		this.socket = null;
		this.connection = null;

		this.method = options.method || 'GET';

		if (!(this.method === 'CONNECT' && (options.path === '/' || options.path === undefined))) {
			this.path = options.path;
		}

		this.res = null;
		this.aborted = false;
		this.reusedSocket = false;

		const {headers} = options;
		if (headers) {
			// eslint-disable-next-line guard-for-in
			for (const header in headers) {
				this.setHeader(header, headers[header]);
			}
		}

		if (options.auth && !('authorization' in this[kHeaders])) {
			this[kHeaders].authorization = 'Basic ' + Buffer.from(options.auth).toString('base64');
		}

		options.session = options.tlsSession;
		options.path = options.socketPath;

		this[kOptions] = options;

		// Clients that generate HTTP/2 requests directly SHOULD use the :authority pseudo-header field instead of the Host header field.
		this[kOrigin] = new URL(`${this.protocol}//${options.servername || options.host}:${options.port}`);

		// A socket is being reused
		const reuseSocket = options._reuseSocket;
		if (reuseSocket) {
			options.createConnection = (...args) => {
				if (reuseSocket.destroyed) {
					return this.agent.createConnection(...args);
				}

				return reuseSocket;
			};

			// eslint-disable-next-line promise/prefer-await-to-then
			this.agent.getSession(this[kOrigin], this[kOptions]).catch(() => {});
		}

		if (timeout) {
			this.setTimeout(timeout);
		}

		if (callback) {
			this.once('response', callback);
		}

		this[kFlushedHeaders] = false;
	}

	get method() {
		return this[kHeaders][HTTP2_HEADER_METHOD];
	}

	set method(value) {
		if (value) {
			this[kHeaders][HTTP2_HEADER_METHOD] = value.toUpperCase();
		}
	}

	get path() {
		const header = this.method === 'CONNECT' ? HTTP2_HEADER_AUTHORITY : HTTP2_HEADER_PATH;

		return this[kHeaders][header];
	}

	set path(value) {
		if (value) {
			const header = this.method === 'CONNECT' ? HTTP2_HEADER_AUTHORITY : HTTP2_HEADER_PATH;

			this[kHeaders][header] = value;
		}
	}

	get host() {
		return this[kOrigin].hostname;
	}

	set host(_value) {
		// Do nothing as this is read only.
	}

	get _mustNotHaveABody() {
		return this.method === 'GET' || this.method === 'HEAD' || this.method === 'DELETE';
	}

	_write(chunk, encoding, callback) {
		// https://github.com/nodejs/node/blob/654df09ae0c5e17d1b52a900a545f0664d8c7627/lib/internal/http2/util.js#L148-L156
		if (this._mustNotHaveABody) {
			callback(new Error('The GET, HEAD and DELETE methods must NOT have a body'));
			/* istanbul ignore next: Node.js 12 throws directly */
			return;
		}

		this.flushHeaders();

		const callWrite = () => this._request.write(chunk, encoding, callback);
		if (this._request) {
			callWrite();
		} else {
			this[kJobs].push(callWrite);
		}
	}

	_final(callback) {
		this.flushHeaders();

		const callEnd = () => {
			// For GET, HEAD and DELETE and CONNECT
			if (this._mustNotHaveABody || this.method === 'CONNECT') {
				callback();
				return;
			}

			this._request.end(callback);
		};

		if (this._request) {
			callEnd();
		} else {
			this[kJobs].push(callEnd);
		}
	}

	abort() {
		if (this.res && this.res.complete) {
			return;
		}

		if (!this.aborted) {
			process.nextTick(() => this.emit('abort'));
		}

		this.aborted = true;

		this.destroy();
	}

	async _destroy(error, callback) {
		if (this.res) {
			this.res._dump();
		}

		if (this._request) {
			this._request.destroy();
		} else {
			process.nextTick(() => {
				this.emit('close');
			});
		}

		try {
			await this[kPendingAgentPromise];
		} catch (internalError) {
			if (this.aborted) {
				error = internalError;
			}
		}

		callback(error);
	}

	async flushHeaders() {
		if (this[kFlushedHeaders] || this.destroyed) {
			return;
		}

		this[kFlushedHeaders] = true;

		const isConnectMethod = this.method === HTTP2_METHOD_CONNECT;

		// The real magic is here
		const onStream = stream => {
			this._request = stream;

			if (this.destroyed) {
				stream.destroy();
				return;
			}

			// Forwards `timeout`, `continue`, `close` and `error` events to this instance.
			if (!isConnectMethod) {
				// TODO: Should we proxy `close` here?
				proxyEvents(stream, this, ['timeout', 'continue']);
			}

			stream.once('error', error => {
				this.destroy(error);
			});

			stream.once('aborted', () => {
				const {res} = this;
				if (res) {
					res.aborted = true;
					res.emit('aborted');
					res.destroy();
				} else {
					this.destroy(new Error('The server aborted the HTTP/2 stream'));
				}
			});

			const onResponse = (headers, flags, rawHeaders) => {
				// If we were to emit raw request stream, it would be as fast as the native approach.
				// Note that wrapping the raw stream in a Proxy instance won't improve the performance (already tested it).
				const response = new IncomingMessage(this.socket, stream.readableHighWaterMark);
				this.res = response;

				// Undocumented, but it is used by `cacheable-request`
				response.url = `${this[kOrigin].origin}${this.path}`;

				response.req = this;
				response.statusCode = headers[HTTP2_HEADER_STATUS];
				response.headers = headers;
				response.rawHeaders = rawHeaders;

				response.once('end', () => {
					response.complete = true;

					// Has no effect, just be consistent with the Node.js behavior
					response.socket = null;
					response.connection = null;
				});

				if (isConnectMethod) {
					response.upgrade = true;

					// The HTTP1 API says the socket is detached here,
					// but we can't do that so we pass the original HTTP2 request.
					if (this.emit('connect', response, stream, Buffer.alloc(0))) {
						this.emit('close');
					} else {
						// No listeners attached, destroy the original request.
						stream.destroy();
					}
				} else {
					// Forwards data
					stream.on('data', chunk => {
						if (!response._dumped && !response.push(chunk)) {
							stream.pause();
						}
					});

					stream.once('end', () => {
						if (!this.aborted) {
							response.push(null);
						}
					});

					if (!this.emit('response', response)) {
						// No listeners attached, dump the response.
						response._dump();
					}
				}
			};

			// This event tells we are ready to listen for the data.
			stream.once('response', onResponse);

			// Emits `information` event
			stream.once('headers', headers => this.emit('information', {statusCode: headers[HTTP2_HEADER_STATUS]}));

			stream.once('trailers', (trailers, flags, rawTrailers) => {
				const {res} = this;

				// https://github.com/nodejs/node/issues/41251
				if (res === null) {
					onResponse(trailers, flags, rawTrailers);
					return;
				}

				// Assigns trailers to the response object.
				res.trailers = trailers;
				res.rawTrailers = rawTrailers;
			});

			stream.once('close', () => {
				const {aborted, res} = this;
				if (res) {
					if (aborted) {
						res.aborted = true;
						res.emit('aborted');
						res.destroy();
					}

					const finish = () => {
						res.emit('close');

						this.destroy();
						this.emit('close');
					};

					if (res.readable) {
						res.once('end', finish);
					} else {
						finish();
					}

					return;
				}

				if (!this.destroyed) {
					this.destroy(new Error('The HTTP/2 stream has been early terminated'));
					this.emit('close');
					return;
				}

				this.destroy();
				this.emit('close');
			});

			this.socket = new Proxy(stream, proxySocketHandler);

			for (const job of this[kJobs]) {
				job();
			}

			this[kJobs].length = 0;

			this.emit('socket', this.socket);
		};

		if (!(HTTP2_HEADER_AUTHORITY in this[kHeaders]) && !isConnectMethod) {
			this[kHeaders][HTTP2_HEADER_AUTHORITY] = this[kOrigin].host;
		}

		// Makes a HTTP2 request
		if (this[kSession]) {
			try {
				onStream(this[kSession].request(this[kHeaders]));
			} catch (error) {
				this.destroy(error);
			}
		} else {
			this.reusedSocket = true;

			try {
				const promise = this.agent.request(this[kOrigin], this[kOptions], this[kHeaders]);
				this[kPendingAgentPromise] = promise;

				onStream(await promise);

				this[kPendingAgentPromise] = false;
			} catch (error) {
				this[kPendingAgentPromise] = false;

				this.destroy(error);
			}
		}
	}

	get connection() {
		return this.socket;
	}

	set connection(value) {
		this.socket = value;
	}

	getHeaderNames() {
		return Object.keys(this[kHeaders]);
	}

	hasHeader(name) {
		if (typeof name !== 'string') {
			throw new ERR_INVALID_ARG_TYPE('name', 'string', name);
		}

		return Boolean(this[kHeaders][name.toLowerCase()]);
	}

	getHeader(name) {
		if (typeof name !== 'string') {
			throw new ERR_INVALID_ARG_TYPE('name', 'string', name);
		}

		return this[kHeaders][name.toLowerCase()];
	}

	get headersSent() {
		return this[kFlushedHeaders];
	}

	removeHeader(name) {
		if (typeof name !== 'string') {
			throw new ERR_INVALID_ARG_TYPE('name', 'string', name);
		}

		if (this.headersSent) {
			throw new ERR_HTTP_HEADERS_SENT('remove');
		}

		delete this[kHeaders][name.toLowerCase()];
	}

	setHeader(name, value) {
		if (this.headersSent) {
			throw new ERR_HTTP_HEADERS_SENT('set');
		}

		validateHeaderName(name);
		validateHeaderValue(name, value);

		const lowercased = name.toLowerCase();

		if (lowercased === 'connection') {
			if (value.toLowerCase() === 'keep-alive') {
				return;
			}

			throw new Error(`Invalid 'connection' header: ${value}`);
		}

		if (lowercased === 'host' && this.method === 'CONNECT') {
			this[kHeaders][HTTP2_HEADER_AUTHORITY] = value;
		} else {
			this[kHeaders][lowercased] = value;
		}
	}

	setNoDelay() {
		// HTTP2 sockets cannot be malformed, do nothing.
	}

	setSocketKeepAlive() {
		// HTTP2 sockets cannot be malformed, do nothing.
	}

	setTimeout(ms, callback) {
		const applyTimeout = () => this._request.setTimeout(ms, callback);

		if (this._request) {
			applyTimeout();
		} else {
			this[kJobs].push(applyTimeout);
		}

		return this;
	}

	get maxHeadersCount() {
		if (!this.destroyed && this._request) {
			return this._request.session.localSettings.maxHeaderListSize;
		}

		return undefined;
	}

	set maxHeadersCount(_value) {
		// Updating HTTP2 settings would affect all requests, do nothing.
	}
}

module.exports = ClientRequest;


/***/ }),

/***/ 2575:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {Readable} = __nccwpck_require__(2781);

class IncomingMessage extends Readable {
	constructor(socket, highWaterMark) {
		super({
			emitClose: false,
			autoDestroy: true,
			highWaterMark
		});

		this.statusCode = null;
		this.statusMessage = '';
		this.httpVersion = '2.0';
		this.httpVersionMajor = 2;
		this.httpVersionMinor = 0;
		this.headers = {};
		this.trailers = {};
		this.req = null;

		this.aborted = false;
		this.complete = false;
		this.upgrade = null;

		this.rawHeaders = [];
		this.rawTrailers = [];

		this.socket = socket;

		this._dumped = false;
	}

	get connection() {
		return this.socket;
	}

	set connection(value) {
		this.socket = value;
	}

	_destroy(error, callback) {
		if (!this.readableEnded) {
			this.aborted = true;
		}

		// See https://github.com/nodejs/node/issues/35303
		callback();

		this.req._request.destroy(error);
	}

	setTimeout(ms, callback) {
		this.req.setTimeout(ms, callback);
		return this;
	}

	_dump() {
		if (!this._dumped) {
			this._dumped = true;

			this.removeAllListeners('data');
			this.resume();
		}
	}

	_read() {
		if (this.req) {
			this.req._request.resume();
		}
	}
}

module.exports = IncomingMessage;


/***/ }),

/***/ 4645:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const http2 = __nccwpck_require__(5158);
const {
	Agent,
	globalAgent
} = __nccwpck_require__(9898);
const ClientRequest = __nccwpck_require__(9632);
const IncomingMessage = __nccwpck_require__(2575);
const auto = __nccwpck_require__(7167);
const {
	HttpOverHttp2,
	HttpsOverHttp2
} = __nccwpck_require__(8795);
const Http2OverHttp2 = __nccwpck_require__(8553);
const {
	Http2OverHttp,
	Http2OverHttps
} = __nccwpck_require__(9794);
const validateHeaderName = __nccwpck_require__(4592);
const validateHeaderValue = __nccwpck_require__(3549);

const request = (url, options, callback) => new ClientRequest(url, options, callback);

const get = (url, options, callback) => {
	// eslint-disable-next-line unicorn/prevent-abbreviations
	const req = new ClientRequest(url, options, callback);
	req.end();

	return req;
};

module.exports = {
	...http2,
	ClientRequest,
	IncomingMessage,
	Agent,
	globalAgent,
	request,
	get,
	auto,
	proxies: {
		HttpOverHttp2,
		HttpsOverHttp2,
		Http2OverHttp2,
		Http2OverHttp,
		Http2OverHttps
	},
	validateHeaderName,
	validateHeaderValue
};


/***/ }),

/***/ 7885:
/***/ ((module) => {

"use strict";


module.exports = self => {
	const {username, password} = self.proxyOptions.url;

	if (username || password) {
		const data = `${username}:${password}`;
		const authorization = `Basic ${Buffer.from(data).toString('base64')}`;

		return {
			'proxy-authorization': authorization,
			authorization
		};
	}

	return {};
};


/***/ }),

/***/ 8795:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const tls = __nccwpck_require__(4404);
const http = __nccwpck_require__(3685);
const https = __nccwpck_require__(5687);
const JSStreamSocket = __nccwpck_require__(1564);
const {globalAgent} = __nccwpck_require__(9898);
const UnexpectedStatusCodeError = __nccwpck_require__(6203);
const initialize = __nccwpck_require__(1089);
const getAuthorizationHeaders = __nccwpck_require__(7885);

const createConnection = (self, options, callback) => {
	(async () => {
		try {
			const {proxyOptions} = self;
			const {url, headers, raw} = proxyOptions;

			const stream = await globalAgent.request(url, proxyOptions, {
				...getAuthorizationHeaders(self),
				...headers,
				':method': 'CONNECT',
				':authority': `${options.host}:${options.port}`
			});

			stream.once('error', callback);
			stream.once('response', headers => {
				const statusCode = headers[':status'];

				if (statusCode !== 200) {
					callback(new UnexpectedStatusCodeError(statusCode, ''));
					return;
				}

				const encrypted = self instanceof https.Agent;

				if (raw && encrypted) {
					options.socket = stream;
					const secureStream = tls.connect(options);

					secureStream.once('close', () => {
						stream.destroy();
					});

					callback(null, secureStream);
					return;
				}

				const socket = new JSStreamSocket(stream);
				socket.encrypted = false;
				socket._handle.getpeername = out => {
					out.family = undefined;
					out.address = undefined;
					out.port = undefined;
				};

				callback(null, socket);
			});
		} catch (error) {
			callback(error);
		}
	})();
};

class HttpOverHttp2 extends http.Agent {
	constructor(options) {
		super(options);

		initialize(this, options.proxyOptions);
	}

	createConnection(options, callback) {
		createConnection(this, options, callback);
	}
}

class HttpsOverHttp2 extends https.Agent {
	constructor(options) {
		super(options);

		initialize(this, options.proxyOptions);
	}

	createConnection(options, callback) {
		createConnection(this, options, callback);
	}
}

module.exports = {
	HttpOverHttp2,
	HttpsOverHttp2
};


/***/ }),

/***/ 9794:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const http = __nccwpck_require__(3685);
const https = __nccwpck_require__(5687);
const Http2OverHttpX = __nccwpck_require__(1857);
const getAuthorizationHeaders = __nccwpck_require__(7885);

const getStream = request => new Promise((resolve, reject) => {
	const onConnect = (response, socket, head) => {
		socket.unshift(head);

		request.off('error', reject);
		resolve([socket, response.statusCode, response.statusMessage]);
	};

	request.once('error', reject);
	request.once('connect', onConnect);
});

class Http2OverHttp extends Http2OverHttpX {
	async _getProxyStream(authority) {
		const {proxyOptions} = this;
		const {url, headers} = this.proxyOptions;

		const network = url.protocol === 'https:' ? https : http;

		// `new URL('https://localhost/httpbin.org:443')` results in
		// a `/httpbin.org:443` path, which has an invalid leading slash.
		const request = network.request({
			...proxyOptions,
			hostname: url.hostname,
			port: url.port,
			path: authority,
			headers: {
				...getAuthorizationHeaders(this),
				...headers,
				host: authority
			},
			method: 'CONNECT'
		}).end();

		return getStream(request);
	}
}

module.exports = {
	Http2OverHttp,
	Http2OverHttps: Http2OverHttp
};


/***/ }),

/***/ 8553:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {globalAgent} = __nccwpck_require__(9898);
const Http2OverHttpX = __nccwpck_require__(1857);
const getAuthorizationHeaders = __nccwpck_require__(7885);

const getStatusCode = stream => new Promise((resolve, reject) => {
	stream.once('error', reject);
	stream.once('response', headers => {
		stream.off('error', reject);
		resolve(headers[':status']);
	});
});

class Http2OverHttp2 extends Http2OverHttpX {
	async _getProxyStream(authority) {
		const {proxyOptions} = this;

		const headers = {
			...getAuthorizationHeaders(this),
			...proxyOptions.headers,
			':method': 'CONNECT',
			':authority': authority
		};

		const stream = await globalAgent.request(proxyOptions.url, proxyOptions, headers);
		const statusCode = await getStatusCode(stream);

		return [stream, statusCode, ''];
	}
}

module.exports = Http2OverHttp2;


/***/ }),

/***/ 1857:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {Agent} = __nccwpck_require__(9898);
const JSStreamSocket = __nccwpck_require__(1564);
const UnexpectedStatusCodeError = __nccwpck_require__(6203);
const initialize = __nccwpck_require__(1089);

class Http2OverHttpX extends Agent {
	constructor(options) {
		super(options);

		initialize(this, options.proxyOptions);
	}

	async createConnection(origin, options) {
		const authority = `${origin.hostname}:${origin.port || 443}`;

		const [stream, statusCode, statusMessage] = await this._getProxyStream(authority);
		if (statusCode !== 200) {
			throw new UnexpectedStatusCodeError(statusCode, statusMessage);
		}

		if (this.proxyOptions.raw) {
			options.socket = stream;
		} else {
			const socket = new JSStreamSocket(stream);
			socket.encrypted = false;
			socket._handle.getpeername = out => {
				out.family = undefined;
				out.address = undefined;
				out.port = undefined;
			};

			return socket;
		}

		return super.createConnection(origin, options);
	}
}

module.exports = Http2OverHttpX;


/***/ }),

/***/ 1089:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

// See https://github.com/facebook/jest/issues/2549
// eslint-disable-next-line node/prefer-global/url
const {URL} = __nccwpck_require__(7310);
const checkType = __nccwpck_require__(3453);

module.exports = (self, proxyOptions) => {
	checkType('proxyOptions', proxyOptions, ['object']);
	checkType('proxyOptions.headers', proxyOptions.headers, ['object', 'undefined']);
	checkType('proxyOptions.raw', proxyOptions.raw, ['boolean', 'undefined']);
	checkType('proxyOptions.url', proxyOptions.url, [URL, 'string']);

	const url = new URL(proxyOptions.url);

	self.proxyOptions = {
		raw: true,
		...proxyOptions,
		headers: {...proxyOptions.headers},
		url
	};
};


/***/ }),

/***/ 6203:
/***/ ((module) => {

"use strict";


class UnexpectedStatusCodeError extends Error {
	constructor(statusCode, statusMessage = '') {
		super(`The proxy server rejected the request with status code ${statusCode} (${statusMessage || 'empty status message'})`);
		this.statusCode = statusCode;
		this.statusMessage = statusMessage;
	}
}

module.exports = UnexpectedStatusCodeError;


/***/ }),

/***/ 1982:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {isIP} = __nccwpck_require__(1808);
const assert = __nccwpck_require__(9491);

const getHost = host => {
	if (host[0] === '[') {
		const idx = host.indexOf(']');

		assert(idx !== -1);
		return host.slice(1, idx);
	}

	const idx = host.indexOf(':');
	if (idx === -1) {
		return host;
	}

	return host.slice(0, idx);
};

module.exports = host => {
	const servername = getHost(host);

	if (isIP(servername)) {
		return '';
	}

	return servername;
};


/***/ }),

/***/ 3453:
/***/ ((module) => {

"use strict";


const checkType = (name, value, types) => {
	const valid = types.some(type => {
		const typeofType = typeof type;
		if (typeofType === 'string') {
			return typeof value === type;
		}

		return value instanceof type;
	});

	if (!valid) {
		const names = types.map(type => typeof type === 'string' ? type : type.name);

		throw new TypeError(`Expected '${name}' to be a type of ${names.join(' or ')}, got ${typeof value}`);
	}
};

module.exports = checkType;


/***/ }),

/***/ 9237:
/***/ ((module) => {

"use strict";


module.exports = stream => {
	if (stream.listenerCount('error') !== 0) {
		return stream;
	}

	stream.__destroy = stream._destroy;
	stream._destroy = (...args) => {
		const callback = args.pop();

		stream.__destroy(...args, async error => {
			await Promise.resolve();
			callback(error);
		});
	};

	const onError = error => {
		// eslint-disable-next-line promise/prefer-await-to-then
		Promise.resolve().then(() => {
			stream.emit('error', error);
		});
	};

	stream.once('error', onError);

	// eslint-disable-next-line promise/prefer-await-to-then
	Promise.resolve().then(() => {
		stream.off('error', onError);
	});

	return stream;
};


/***/ }),

/***/ 7087:
/***/ ((module) => {

"use strict";

/* istanbul ignore file: https://github.com/nodejs/node/blob/master/lib/internal/errors.js */

const makeError = (Base, key, getMessage) => {
	module.exports[key] = class NodeError extends Base {
		constructor(...args) {
			super(typeof getMessage === 'string' ? getMessage : getMessage(args));
			this.name = `${super.name} [${key}]`;
			this.code = key;
		}
	};
};

makeError(TypeError, 'ERR_INVALID_ARG_TYPE', args => {
	const type = args[0].includes('.') ? 'property' : 'argument';

	let valid = args[1];
	const isManyTypes = Array.isArray(valid);

	if (isManyTypes) {
		valid = `${valid.slice(0, -1).join(', ')} or ${valid.slice(-1)}`;
	}

	return `The "${args[0]}" ${type} must be ${isManyTypes ? 'one of' : 'of'} type ${valid}. Received ${typeof args[2]}`;
});

makeError(TypeError, 'ERR_INVALID_PROTOCOL', args =>
	`Protocol "${args[0]}" not supported. Expected "${args[1]}"`
);

makeError(Error, 'ERR_HTTP_HEADERS_SENT', args =>
	`Cannot ${args[0]} headers after they are sent to the client`
);

makeError(TypeError, 'ERR_INVALID_HTTP_TOKEN', args =>
	`${args[0]} must be a valid HTTP token [${args[1]}]`
);

makeError(TypeError, 'ERR_HTTP_INVALID_HEADER_VALUE', args =>
	`Invalid value "${args[0]} for header "${args[1]}"`
);

makeError(TypeError, 'ERR_INVALID_CHAR', args =>
	`Invalid character in ${args[0]} [${args[1]}]`
);

makeError(
	Error,
	'ERR_HTTP2_NO_SOCKET_MANIPULATION',
	'HTTP/2 sockets should not be directly manipulated (e.g. read and written)'
);


/***/ }),

/***/ 1199:
/***/ ((module) => {

"use strict";


module.exports = header => {
	switch (header) {
		case ':method':
		case ':scheme':
		case ':authority':
		case ':path':
			return true;
		default:
			return false;
	}
};


/***/ }),

/***/ 1564:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const stream = __nccwpck_require__(2781);
const tls = __nccwpck_require__(4404);

// Really awesome hack.
const JSStreamSocket = (new tls.TLSSocket(new stream.PassThrough()))._handle._parentWrap.constructor;

module.exports = JSStreamSocket;


/***/ }),

/***/ 1818:
/***/ ((module) => {

"use strict";


module.exports = (from, to, events) => {
	for (const event of events) {
		from.on(event, (...args) => to.emit(event, ...args));
	}
};


/***/ }),

/***/ 9404:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {ERR_HTTP2_NO_SOCKET_MANIPULATION} = __nccwpck_require__(7087);

/* istanbul ignore file */
/* https://github.com/nodejs/node/blob/6eec858f34a40ffa489c1ec54bb24da72a28c781/lib/internal/http2/compat.js#L195-L272 */

const proxySocketHandler = {
	has(stream, property) {
		// Replaced [kSocket] with .socket
		const reference = stream.session === undefined ? stream : stream.session.socket;
		return (property in stream) || (property in reference);
	},

	get(stream, property) {
		switch (property) {
			case 'on':
			case 'once':
			case 'end':
			case 'emit':
			case 'destroy':
				return stream[property].bind(stream);
			case 'writable':
			case 'destroyed':
				return stream[property];
			case 'readable':
				if (stream.destroyed) {
					return false;
				}

				return stream.readable;
			case 'setTimeout': {
				const {session} = stream;
				if (session !== undefined) {
					return session.setTimeout.bind(session);
				}

				return stream.setTimeout.bind(stream);
			}

			case 'write':
			case 'read':
			case 'pause':
			case 'resume':
				throw new ERR_HTTP2_NO_SOCKET_MANIPULATION();
			default: {
				// Replaced [kSocket] with .socket
				const reference = stream.session === undefined ? stream : stream.session.socket;
				const value = reference[property];

				return typeof value === 'function' ? value.bind(reference) : value;
			}
		}
	},

	getPrototypeOf(stream) {
		if (stream.session !== undefined) {
			// Replaced [kSocket] with .socket
			return Reflect.getPrototypeOf(stream.session.socket);
		}

		return Reflect.getPrototypeOf(stream);
	},

	set(stream, property, value) {
		switch (property) {
			case 'writable':
			case 'readable':
			case 'destroyed':
			case 'on':
			case 'once':
			case 'end':
			case 'emit':
			case 'destroy':
				stream[property] = value;
				return true;
			case 'setTimeout': {
				const {session} = stream;
				if (session === undefined) {
					stream.setTimeout = value;
				} else {
					session.setTimeout = value;
				}

				return true;
			}

			case 'write':
			case 'read':
			case 'pause':
			case 'resume':
				throw new ERR_HTTP2_NO_SOCKET_MANIPULATION();
			default: {
				// Replaced [kSocket] with .socket
				const reference = stream.session === undefined ? stream : stream.session.socket;
				reference[property] = value;
				return true;
			}
		}
	}
};

module.exports = proxySocketHandler;


/***/ }),

/***/ 4592:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {ERR_INVALID_HTTP_TOKEN} = __nccwpck_require__(7087);
const isRequestPseudoHeader = __nccwpck_require__(1199);

const isValidHttpToken = /^[\^`\-\w!#$%&*+.|~]+$/;

module.exports = name => {
	if (typeof name !== 'string' || (!isValidHttpToken.test(name) && !isRequestPseudoHeader(name))) {
		throw new ERR_INVALID_HTTP_TOKEN('Header name', name);
	}
};


/***/ }),

/***/ 3549:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {
	ERR_HTTP_INVALID_HEADER_VALUE,
	ERR_INVALID_CHAR
} = __nccwpck_require__(7087);

const isInvalidHeaderValue = /[^\t\u0020-\u007E\u0080-\u00FF]/;

module.exports = (name, value) => {
	if (typeof value === 'undefined') {
		throw new ERR_HTTP_INVALID_HEADER_VALUE(value, name);
	}

	if (isInvalidHeaderValue.test(value)) {
		throw new ERR_INVALID_CHAR('header content', name);
	}
};


/***/ }),

/***/ 1434:
/***/ ((module) => {

/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.8.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2018
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var INPUT_ERROR = 'input is invalid type';
  var FINALIZE_ERROR = 'finalize already called';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA3_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && "object" === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
  var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
  var KECCAK_PADDING = [1, 256, 65536, 16777216];
  var PADDING = [6, 1536, 393216, 100663296];
  var SHIFT = [0, 8, 16, 24];
  var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
    0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
    2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
    2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
    2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
  var BITS = [224, 256, 384, 512];
  var SHAKE_BITS = [128, 256];
  var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array', 'digest'];
  var CSHAKE_BYTEPAD = {
    '128': 168,
    '256': 136
  };

  if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (bits, padding, outputType) {
    return function (message) {
      return new Keccak(bits, padding, bits).update(message)[outputType]();
    };
  };

  var createShakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits) {
      return new Keccak(bits, padding, outputBits).update(message)[outputType]();
    };
  };

  var createCshakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits, n, s) {
      return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
    };
  };

  var createKmacOutputMethod = function (bits, padding, outputType) {
    return function (key, message, outputBits, s) {
      return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
    };
  };

  var createOutputMethods = function (method, createMethod, bits, padding) {
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createMethod(bits, padding, type);
    }
    return method;
  };

  var createMethod = function (bits, padding) {
    var method = createOutputMethod(bits, padding, 'hex');
    method.create = function () {
      return new Keccak(bits, padding, bits);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    return createOutputMethods(method, createOutputMethod, bits, padding);
  };

  var createShakeMethod = function (bits, padding) {
    var method = createShakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits) {
      return new Keccak(bits, padding, outputBits);
    };
    method.update = function (message, outputBits) {
      return method.create(outputBits).update(message);
    };
    return createOutputMethods(method, createShakeOutputMethod, bits, padding);
  };

  var createCshakeMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createCshakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits, n, s) {
      if (!n && !s) {
        return methods['shake' + bits].create(outputBits);
      } else {
        return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
      }
    };
    method.update = function (message, outputBits, n, s) {
      return method.create(outputBits, n, s).update(message);
    };
    return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
  };

  var createKmacMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createKmacOutputMethod(bits, padding, 'hex');
    method.create = function (key, outputBits, s) {
      return new Kmac(bits, padding, outputBits).bytepad(['KMAC', s], w).bytepad([key], w);
    };
    method.update = function (key, message, outputBits, s) {
      return method.create(key, outputBits, s).update(message);
    };
    return createOutputMethods(method, createKmacOutputMethod, bits, padding);
  };

  var algorithms = [
    { name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod },
    { name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod },
    { name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
    { name: 'cshake', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
    { name: 'kmac', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
  ];

  var methods = {}, methodNames = [];

  for (var i = 0; i < algorithms.length; ++i) {
    var algorithm = algorithms[i];
    var bits = algorithm.bits;
    for (var j = 0; j < bits.length; ++j) {
      var methodName = algorithm.name + '_' + bits[j];
      methodNames.push(methodName);
      methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
      if (algorithm.name !== 'sha3') {
        var newMethodName = algorithm.name + bits[j];
        methodNames.push(newMethodName);
        methods[newMethodName] = methods[methodName];
      }
    }
  }

  function Keccak(bits, padding, outputBits) {
    this.blocks = [];
    this.s = [];
    this.padding = padding;
    this.outputBits = outputBits;
    this.reset = true;
    this.finalized = false;
    this.block = 0;
    this.start = 0;
    this.blockCount = (1600 - (bits << 1)) >> 5;
    this.byteCount = this.blockCount << 2;
    this.outputBlocks = outputBits >> 5;
    this.extraBytes = (outputBits & 31) >> 3;

    for (var i = 0; i < 50; ++i) {
      this.s[i] = 0;
    }
  }

  Keccak.prototype.update = function (message) {
    if (this.finalized) {
      throw new Error(FINALIZE_ERROR);
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var blocks = this.blocks, byteCount = this.byteCount, length = message.length,
      blockCount = this.blockCount, index = 0, s = this.s, i, code;

    while (index < length) {
      if (this.reset) {
        this.reset = false;
        blocks[0] = this.block;
        for (i = 1; i < blockCount + 1; ++i) {
          blocks[i] = 0;
        }
      }
      if (notString) {
        for (i = this.start; index < length && i < byteCount; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < byteCount; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }
      this.lastByteIndex = i;
      if (i >= byteCount) {
        this.start = i - byteCount;
        this.block = blocks[blockCount];
        for (i = 0; i < blockCount; ++i) {
          s[i] ^= blocks[i];
        }
        f(s);
        this.reset = true;
      } else {
        this.start = i;
      }
    }
    return this;
  };

  Keccak.prototype.encode = function (x, right) {
    var o = x & 255, n = 1;
    var bytes = [o];
    x = x >> 8;
    o = x & 255;
    while (o > 0) {
      bytes.unshift(o);
      x = x >> 8;
      o = x & 255;
      ++n;
    }
    if (right) {
      bytes.push(n);
    } else {
      bytes.unshift(n);
    }
    this.update(bytes);
    return bytes.length;
  };

  Keccak.prototype.encodeString = function (str) {
    var notString, type = typeof str;
    if (type !== 'string') {
      if (type === 'object') {
        if (str === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
          str = new Uint8Array(str);
        } else if (!Array.isArray(str)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var bytes = 0, length = str.length;
    if (notString) {
      bytes = length;
    } else {
      for (var i = 0; i < str.length; ++i) {
        var code = str.charCodeAt(i);
        if (code < 0x80) {
          bytes += 1;
        } else if (code < 0x800) {
          bytes += 2;
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes += 3;
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
          bytes += 4;
        }
      }
    }
    bytes += this.encode(bytes * 8);
    this.update(str);
    return bytes;
  };

  Keccak.prototype.bytepad = function (strs, w) {
    var bytes = this.encode(w);
    for (var i = 0; i < strs.length; ++i) {
      bytes += this.encodeString(strs[i]);
    }
    var paddingBytes = w - bytes % w;
    var zeros = [];
    zeros.length = paddingBytes;
    this.update(zeros);
    return this;
  };

  Keccak.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
    blocks[i >> 2] |= this.padding[i & 3];
    if (this.lastByteIndex === this.byteCount) {
      blocks[0] = blocks[blockCount];
      for (i = 1; i < blockCount + 1; ++i) {
        blocks[i] = 0;
      }
    }
    blocks[blockCount - 1] |= 0x80000000;
    for (i = 0; i < blockCount; ++i) {
      s[i] ^= blocks[i];
    }
    f(s);
  };

  Keccak.prototype.toString = Keccak.prototype.hex = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var hex = '', block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        block = s[i];
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
          HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
          HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
          HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
      }
      if (j % blockCount === 0) {
        f(s);
        i = 0;
      }
    }
    if (extraBytes) {
      block = s[i];
      hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
      if (extraBytes > 1) {
        hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
      }
      if (extraBytes > 2) {
        hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
      }
    }
    return hex;
  };

  Keccak.prototype.arrayBuffer = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var bytes = this.outputBits >> 3;
    var buffer;
    if (extraBytes) {
      buffer = new ArrayBuffer((outputBlocks + 1) << 2);
    } else {
      buffer = new ArrayBuffer(bytes);
    }
    var array = new Uint32Array(buffer);
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        array[j] = s[i];
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      array[i] = s[i];
      buffer = buffer.slice(0, bytes);
    }
    return buffer;
  };

  Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

  Keccak.prototype.digest = Keccak.prototype.array = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var array = [], offset, block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        offset = j << 2;
        block = s[i];
        array[offset] = block & 0xFF;
        array[offset + 1] = (block >> 8) & 0xFF;
        array[offset + 2] = (block >> 16) & 0xFF;
        array[offset + 3] = (block >> 24) & 0xFF;
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      offset = j << 2;
      block = s[i];
      array[offset] = block & 0xFF;
      if (extraBytes > 1) {
        array[offset + 1] = (block >> 8) & 0xFF;
      }
      if (extraBytes > 2) {
        array[offset + 2] = (block >> 16) & 0xFF;
      }
    }
    return array;
  };

  function Kmac(bits, padding, outputBits) {
    Keccak.call(this, bits, padding, outputBits);
  }

  Kmac.prototype = new Keccak();

  Kmac.prototype.finalize = function () {
    this.encode(this.outputBits, true);
    return Keccak.prototype.finalize.call(this);
  };

  var f = function (s) {
    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
      b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
      b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
      b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
    for (n = 0; n < 48; n += 2) {
      c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
      c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
      c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
      c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
      c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
      c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
      c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
      c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
      c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
      c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

      h = c8 ^ ((c2 << 1) | (c3 >>> 31));
      l = c9 ^ ((c3 << 1) | (c2 >>> 31));
      s[0] ^= h;
      s[1] ^= l;
      s[10] ^= h;
      s[11] ^= l;
      s[20] ^= h;
      s[21] ^= l;
      s[30] ^= h;
      s[31] ^= l;
      s[40] ^= h;
      s[41] ^= l;
      h = c0 ^ ((c4 << 1) | (c5 >>> 31));
      l = c1 ^ ((c5 << 1) | (c4 >>> 31));
      s[2] ^= h;
      s[3] ^= l;
      s[12] ^= h;
      s[13] ^= l;
      s[22] ^= h;
      s[23] ^= l;
      s[32] ^= h;
      s[33] ^= l;
      s[42] ^= h;
      s[43] ^= l;
      h = c2 ^ ((c6 << 1) | (c7 >>> 31));
      l = c3 ^ ((c7 << 1) | (c6 >>> 31));
      s[4] ^= h;
      s[5] ^= l;
      s[14] ^= h;
      s[15] ^= l;
      s[24] ^= h;
      s[25] ^= l;
      s[34] ^= h;
      s[35] ^= l;
      s[44] ^= h;
      s[45] ^= l;
      h = c4 ^ ((c8 << 1) | (c9 >>> 31));
      l = c5 ^ ((c9 << 1) | (c8 >>> 31));
      s[6] ^= h;
      s[7] ^= l;
      s[16] ^= h;
      s[17] ^= l;
      s[26] ^= h;
      s[27] ^= l;
      s[36] ^= h;
      s[37] ^= l;
      s[46] ^= h;
      s[47] ^= l;
      h = c6 ^ ((c0 << 1) | (c1 >>> 31));
      l = c7 ^ ((c1 << 1) | (c0 >>> 31));
      s[8] ^= h;
      s[9] ^= l;
      s[18] ^= h;
      s[19] ^= l;
      s[28] ^= h;
      s[29] ^= l;
      s[38] ^= h;
      s[39] ^= l;
      s[48] ^= h;
      s[49] ^= l;

      b0 = s[0];
      b1 = s[1];
      b32 = (s[11] << 4) | (s[10] >>> 28);
      b33 = (s[10] << 4) | (s[11] >>> 28);
      b14 = (s[20] << 3) | (s[21] >>> 29);
      b15 = (s[21] << 3) | (s[20] >>> 29);
      b46 = (s[31] << 9) | (s[30] >>> 23);
      b47 = (s[30] << 9) | (s[31] >>> 23);
      b28 = (s[40] << 18) | (s[41] >>> 14);
      b29 = (s[41] << 18) | (s[40] >>> 14);
      b20 = (s[2] << 1) | (s[3] >>> 31);
      b21 = (s[3] << 1) | (s[2] >>> 31);
      b2 = (s[13] << 12) | (s[12] >>> 20);
      b3 = (s[12] << 12) | (s[13] >>> 20);
      b34 = (s[22] << 10) | (s[23] >>> 22);
      b35 = (s[23] << 10) | (s[22] >>> 22);
      b16 = (s[33] << 13) | (s[32] >>> 19);
      b17 = (s[32] << 13) | (s[33] >>> 19);
      b48 = (s[42] << 2) | (s[43] >>> 30);
      b49 = (s[43] << 2) | (s[42] >>> 30);
      b40 = (s[5] << 30) | (s[4] >>> 2);
      b41 = (s[4] << 30) | (s[5] >>> 2);
      b22 = (s[14] << 6) | (s[15] >>> 26);
      b23 = (s[15] << 6) | (s[14] >>> 26);
      b4 = (s[25] << 11) | (s[24] >>> 21);
      b5 = (s[24] << 11) | (s[25] >>> 21);
      b36 = (s[34] << 15) | (s[35] >>> 17);
      b37 = (s[35] << 15) | (s[34] >>> 17);
      b18 = (s[45] << 29) | (s[44] >>> 3);
      b19 = (s[44] << 29) | (s[45] >>> 3);
      b10 = (s[6] << 28) | (s[7] >>> 4);
      b11 = (s[7] << 28) | (s[6] >>> 4);
      b42 = (s[17] << 23) | (s[16] >>> 9);
      b43 = (s[16] << 23) | (s[17] >>> 9);
      b24 = (s[26] << 25) | (s[27] >>> 7);
      b25 = (s[27] << 25) | (s[26] >>> 7);
      b6 = (s[36] << 21) | (s[37] >>> 11);
      b7 = (s[37] << 21) | (s[36] >>> 11);
      b38 = (s[47] << 24) | (s[46] >>> 8);
      b39 = (s[46] << 24) | (s[47] >>> 8);
      b30 = (s[8] << 27) | (s[9] >>> 5);
      b31 = (s[9] << 27) | (s[8] >>> 5);
      b12 = (s[18] << 20) | (s[19] >>> 12);
      b13 = (s[19] << 20) | (s[18] >>> 12);
      b44 = (s[29] << 7) | (s[28] >>> 25);
      b45 = (s[28] << 7) | (s[29] >>> 25);
      b26 = (s[38] << 8) | (s[39] >>> 24);
      b27 = (s[39] << 8) | (s[38] >>> 24);
      b8 = (s[48] << 14) | (s[49] >>> 18);
      b9 = (s[49] << 14) | (s[48] >>> 18);

      s[0] = b0 ^ (~b2 & b4);
      s[1] = b1 ^ (~b3 & b5);
      s[10] = b10 ^ (~b12 & b14);
      s[11] = b11 ^ (~b13 & b15);
      s[20] = b20 ^ (~b22 & b24);
      s[21] = b21 ^ (~b23 & b25);
      s[30] = b30 ^ (~b32 & b34);
      s[31] = b31 ^ (~b33 & b35);
      s[40] = b40 ^ (~b42 & b44);
      s[41] = b41 ^ (~b43 & b45);
      s[2] = b2 ^ (~b4 & b6);
      s[3] = b3 ^ (~b5 & b7);
      s[12] = b12 ^ (~b14 & b16);
      s[13] = b13 ^ (~b15 & b17);
      s[22] = b22 ^ (~b24 & b26);
      s[23] = b23 ^ (~b25 & b27);
      s[32] = b32 ^ (~b34 & b36);
      s[33] = b33 ^ (~b35 & b37);
      s[42] = b42 ^ (~b44 & b46);
      s[43] = b43 ^ (~b45 & b47);
      s[4] = b4 ^ (~b6 & b8);
      s[5] = b5 ^ (~b7 & b9);
      s[14] = b14 ^ (~b16 & b18);
      s[15] = b15 ^ (~b17 & b19);
      s[24] = b24 ^ (~b26 & b28);
      s[25] = b25 ^ (~b27 & b29);
      s[34] = b34 ^ (~b36 & b38);
      s[35] = b35 ^ (~b37 & b39);
      s[44] = b44 ^ (~b46 & b48);
      s[45] = b45 ^ (~b47 & b49);
      s[6] = b6 ^ (~b8 & b0);
      s[7] = b7 ^ (~b9 & b1);
      s[16] = b16 ^ (~b18 & b10);
      s[17] = b17 ^ (~b19 & b11);
      s[26] = b26 ^ (~b28 & b20);
      s[27] = b27 ^ (~b29 & b21);
      s[36] = b36 ^ (~b38 & b30);
      s[37] = b37 ^ (~b39 & b31);
      s[46] = b46 ^ (~b48 & b40);
      s[47] = b47 ^ (~b49 & b41);
      s[8] = b8 ^ (~b0 & b2);
      s[9] = b9 ^ (~b1 & b3);
      s[18] = b18 ^ (~b10 & b12);
      s[19] = b19 ^ (~b11 & b13);
      s[28] = b28 ^ (~b20 & b22);
      s[29] = b29 ^ (~b21 & b23);
      s[38] = b38 ^ (~b30 & b32);
      s[39] = b39 ^ (~b31 & b33);
      s[48] = b48 ^ (~b40 & b42);
      s[49] = b49 ^ (~b41 & b43);

      s[0] ^= RC[n];
      s[1] ^= RC[n + 1];
    }
  };

  if (COMMON_JS) {
    module.exports = methods;
  } else {
    for (i = 0; i < methodNames.length; ++i) {
      root[methodNames[i]] = methods[methodNames[i]];
    }
    if (AMD) {
      define(function () {
        return methods;
      });
    }
  }
})();


/***/ }),

/***/ 2820:
/***/ ((__unused_webpack_module, exports) => {

//TODO: handle reviver/dehydrate function like normal
//and handle indentation, like normal.
//if anyone needs this... please send pull request.

exports.stringify = function stringify (o) {
  if('undefined' == typeof o) return o

  if(o && Buffer.isBuffer(o))
    return JSON.stringify(':base64:' + o.toString('base64'))

  if(o && o.toJSON)
    o =  o.toJSON()

  if(o && 'object' === typeof o) {
    var s = ''
    var array = Array.isArray(o)
    s = array ? '[' : '{'
    var first = true

    for(var k in o) {
      var ignore = 'function' == typeof o[k] || (!array && 'undefined' === typeof o[k])
      if(Object.hasOwnProperty.call(o, k) && !ignore) {
        if(!first)
          s += ','
        first = false
        if (array) {
          if(o[k] == undefined)
            s += 'null'
          else
            s += stringify(o[k])
        } else if (o[k] !== void(0)) {
          s += stringify(k) + ':' + stringify(o[k])
        }
      }
    }

    s += array ? ']' : '}'

    return s
  } else if ('string' === typeof o) {
    return JSON.stringify(/^:/.test(o) ? ':' + o : o)
  } else if ('undefined' === typeof o) {
    return 'null';
  } else
    return JSON.stringify(o)
}

exports.parse = function (s) {
  return JSON.parse(s, function (key, value) {
    if('string' === typeof value) {
      if(/^:base64:/.test(value))
        return Buffer.from(value.substring(8), 'base64')
      else
        return /^:/.test(value) ? value.substring(1) : value 
    }
    return value
  })
}


/***/ }),

/***/ 1531:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const EventEmitter = __nccwpck_require__(2361);
const JSONB = __nccwpck_require__(2820);

const loadStore = options => {
	const adapters = {
		redis: '@keyv/redis',
		rediss: '@keyv/redis',
		mongodb: '@keyv/mongo',
		mongo: '@keyv/mongo',
		sqlite: '@keyv/sqlite',
		postgresql: '@keyv/postgres',
		postgres: '@keyv/postgres',
		mysql: '@keyv/mysql',
		etcd: '@keyv/etcd',
		offline: '@keyv/offline',
		tiered: '@keyv/tiered',
	};
	if (options.adapter || options.uri) {
		const adapter = options.adapter || /^[^:+]*/.exec(options.uri)[0];
		return new (require(adapters[adapter]))(options);
	}

	return new Map();
};

const iterableAdapters = [
	'sqlite',
	'postgres',
	'mysql',
	'mongo',
	'redis',
	'tiered',
];

class Keyv extends EventEmitter {
	constructor(uri, {emitErrors = true, ...options} = {}) {
		super();
		this.opts = {
			namespace: 'keyv',
			serialize: JSONB.stringify,
			deserialize: JSONB.parse,
			...((typeof uri === 'string') ? {uri} : uri),
			...options,
		};

		if (!this.opts.store) {
			const adapterOptions = {...this.opts};
			this.opts.store = loadStore(adapterOptions);
		}

		if (this.opts.compression) {
			const compression = this.opts.compression;
			this.opts.serialize = compression.serialize.bind(compression);
			this.opts.deserialize = compression.deserialize.bind(compression);
		}

		if (typeof this.opts.store.on === 'function' && emitErrors) {
			this.opts.store.on('error', error => this.emit('error', error));
		}

		this.opts.store.namespace = this.opts.namespace;

		const generateIterator = iterator => async function * () {
			for await (const [key, raw] of typeof iterator === 'function'
				? iterator(this.opts.store.namespace)
				: iterator) {
				const data = await this.opts.deserialize(raw);
				if (this.opts.store.namespace && !key.includes(this.opts.store.namespace)) {
					continue;
				}

				if (typeof data.expires === 'number' && Date.now() > data.expires) {
					this.delete(key);
					continue;
				}

				yield [this._getKeyUnprefix(key), data.value];
			}
		};

		// Attach iterators
		if (typeof this.opts.store[Symbol.iterator] === 'function' && this.opts.store instanceof Map) {
			this.iterator = generateIterator(this.opts.store);
		} else if (typeof this.opts.store.iterator === 'function' && this.opts.store.opts
			&& this._checkIterableAdaptar()) {
			this.iterator = generateIterator(this.opts.store.iterator.bind(this.opts.store));
		}
	}

	_checkIterableAdaptar() {
		return iterableAdapters.includes(this.opts.store.opts.dialect)
			|| iterableAdapters.findIndex(element => this.opts.store.opts.url.includes(element)) >= 0;
	}

	_getKeyPrefix(key) {
		return `${this.opts.namespace}:${key}`;
	}

	_getKeyPrefixArray(keys) {
		return keys.map(key => `${this.opts.namespace}:${key}`);
	}

	_getKeyUnprefix(key) {
		return key
			.split(':')
			.splice(1)
			.join(':');
	}

	get(key, options) {
		const {store} = this.opts;
		const isArray = Array.isArray(key);
		const keyPrefixed = isArray ? this._getKeyPrefixArray(key) : this._getKeyPrefix(key);
		if (isArray && store.getMany === undefined) {
			const promises = [];
			for (const key of keyPrefixed) {
				promises.push(Promise.resolve()
					.then(() => store.get(key))
					.then(data => (typeof data === 'string') ? this.opts.deserialize(data) : (this.opts.compression ? this.opts.deserialize(data) : data))
					.then(data => {
						if (data === undefined || data === null) {
							return undefined;
						}

						if (typeof data.expires === 'number' && Date.now() > data.expires) {
							return this.delete(key).then(() => undefined);
						}

						return (options && options.raw) ? data : data.value;
					}),
				);
			}

			return Promise.allSettled(promises)
				.then(values => {
					const data = [];
					for (const value of values) {
						data.push(value.value);
					}

					return data;
				});
		}

		return Promise.resolve()
			.then(() => isArray ? store.getMany(keyPrefixed) : store.get(keyPrefixed))
			.then(data => (typeof data === 'string') ? this.opts.deserialize(data) : (this.opts.compression ? this.opts.deserialize(data) : data))
			.then(data => {
				if (data === undefined || data === null) {
					return undefined;
				}

				if (isArray) {
					const result = [];

					for (let row of data) {
						if ((typeof row === 'string')) {
							row = this.opts.deserialize(row);
						}

						if (row === undefined || row === null) {
							result.push(undefined);
							continue;
						}

						if (typeof row.expires === 'number' && Date.now() > row.expires) {
							this.delete(key).then(() => undefined);
							result.push(undefined);
						} else {
							result.push((options && options.raw) ? row : row.value);
						}
					}

					return result;
				}

				if (typeof data.expires === 'number' && Date.now() > data.expires) {
					return this.delete(key).then(() => undefined);
				}

				return (options && options.raw) ? data : data.value;
			});
	}

	set(key, value, ttl) {
		const keyPrefixed = this._getKeyPrefix(key);
		if (typeof ttl === 'undefined') {
			ttl = this.opts.ttl;
		}

		if (ttl === 0) {
			ttl = undefined;
		}

		const {store} = this.opts;

		return Promise.resolve()
			.then(() => {
				const expires = (typeof ttl === 'number') ? (Date.now() + ttl) : null;
				if (typeof value === 'symbol') {
					this.emit('error', 'symbol cannot be serialized');
				}

				value = {value, expires};
				return this.opts.serialize(value);
			})
			.then(value => store.set(keyPrefixed, value, ttl))
			.then(() => true);
	}

	delete(key) {
		const {store} = this.opts;
		if (Array.isArray(key)) {
			const keyPrefixed = this._getKeyPrefixArray(key);
			if (store.deleteMany === undefined) {
				const promises = [];
				for (const key of keyPrefixed) {
					promises.push(store.delete(key));
				}

				return Promise.allSettled(promises)
					.then(values => values.every(x => x.value === true));
			}

			return Promise.resolve()
				.then(() => store.deleteMany(keyPrefixed));
		}

		const keyPrefixed = this._getKeyPrefix(key);
		return Promise.resolve()
			.then(() => store.delete(keyPrefixed));
	}

	clear() {
		const {store} = this.opts;
		return Promise.resolve()
			.then(() => store.clear());
	}

	has(key) {
		const keyPrefixed = this._getKeyPrefix(key);
		const {store} = this.opts;
		return Promise.resolve()
			.then(async () => {
				if (typeof store.has === 'function') {
					return store.has(keyPrefixed);
				}

				const value = await store.get(keyPrefixed);
				return value !== undefined;
			});
	}

	disconnect() {
		const {store} = this.opts;
		if (typeof store.disconnect === 'function') {
			return store.disconnect();
		}
	}
}

module.exports = Keyv;


/***/ }),

/***/ 4485:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* Copyright 2017 Tierion
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*     http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var sha3512 = (__nccwpck_require__(1434).sha3_512)
var sha3384 = (__nccwpck_require__(1434).sha3_384)
var sha3256 = (__nccwpck_require__(1434).sha3_256)
var sha3224 = (__nccwpck_require__(1434).sha3_224)
var crypto = __nccwpck_require__(6113)

var MerkleTools = function (treeOptions) {
  // in case 'new' was omitted
  if (!(this instanceof MerkleTools)) {
    return new MerkleTools(treeOptions)
  }

  var hashType = 'sha256'
  if (treeOptions) { // if tree options were supplied, then process them
    if (treeOptions.hashType !== undefined) { // set the hash function to the user's choice
      hashType = treeOptions.hashType
    }
  }

  var hashFunction = function (value) {
    switch (hashType) {
      case 'SHA3-224':
        return Buffer.from(sha3224.array(value))
      case 'SHA3-256':
        return Buffer.from(sha3256.array(value))
      case 'SHA3-384':
        return Buffer.from(sha3384.array(value))
      case 'SHA3-512':
        return Buffer.from(sha3512.array(value))
      default:
        return crypto.createHash(hashType).update(value).digest()
    }
  }

  var tree = {}
  tree.leaves = []
  tree.levels = []
  tree.isReady = false

  /// /////////////////////////////////////////
  // Public Primary functions
  /// /////////////////////////////////////////

  // Resets the current tree to empty
  this.resetTree = function () {
    tree = {}
    tree.leaves = []
    tree.levels = []
    tree.isReady = false
  }

  // Add a leaf to the tree
  // Accepts hash value as a Buffer or hex string
  this.addLeaf = function (value, doHash) {
    tree.isReady = false
    if (doHash) value = hashFunction(value)
    tree.leaves.push(_getBuffer(value))
  }

  // Add a leaves to the tree
  // Accepts hash values as an array of Buffers or hex strings
  this.addLeaves = function (valuesArray, doHash) {
    tree.isReady = false
    valuesArray.forEach(function (value) {
      if (doHash) value = hashFunction(value)
      tree.leaves.push(_getBuffer(value))
    })
  }

  // Returns a leaf at the given index
  this.getLeaf = function (index) {
    if (index < 0 || index > tree.leaves.length - 1) return null // index is out of array bounds

    return tree.leaves[index]
  }

  // Returns the number of leaves added to the tree
  this.getLeafCount = function () {
    return tree.leaves.length
  }

  // Returns the ready state of the tree
  this.getTreeReadyState = function () {
    return tree.isReady
  }

  // Generates the merkle tree
  this.makeTree = function (doubleHash) {
    tree.isReady = false
    var leafCount = tree.leaves.length
    if (leafCount > 0) { // skip this whole process if there are no leaves added to the tree
      tree.levels = []
      tree.levels.unshift(tree.leaves)
      while (tree.levels[0].length > 1) {
        tree.levels.unshift(_calculateNextLevel(doubleHash))
      }
    }
    tree.isReady = true
  }

  // Generates a Bitcoin style merkle tree
  this.makeBTCTree = function (doubleHash) {
    tree.isReady = false
    var leafCount = tree.leaves.length
    if (leafCount > 0) { // skip this whole process if there are no leaves added to the tree
      tree.levels = []
      tree.levels.unshift(tree.leaves)
      while (tree.levels[0].length > 1) {
        tree.levels.unshift(_calculateBTCNextLevel(doubleHash))
      }
    }
    tree.isReady = true
  }

  // Returns the merkle root value for the tree
  this.getMerkleRoot = function () {
    if (!tree.isReady || tree.levels.length === 0) return null
    return tree.levels[0][0]
  }

  // Returns the proof for a leaf at the given index as an array of merkle siblings in hex format
  this.getProof = function (index, asBinary) {
    if (!tree.isReady) return null
    var currentRowIndex = tree.levels.length - 1
    if (index < 0 || index > tree.levels[currentRowIndex].length - 1) return null // the index it out of the bounds of the leaf array

    var proof = []
    for (var x = currentRowIndex; x > 0; x--) {
      var currentLevelNodeCount = tree.levels[x].length
      // skip if this is an odd end node
      if (index === currentLevelNodeCount - 1 && currentLevelNodeCount % 2 === 1) {
        index = Math.floor(index / 2)
        continue
      }

      // determine the sibling for the current index and get its value
      var isRightNode = index % 2
      var siblingIndex = isRightNode ? (index - 1) : (index + 1)

      if (asBinary) {
        proof.push(Buffer.from(isRightNode ? [0x00] : [0x01]))
        proof.push(tree.levels[x][siblingIndex])
      } else {
        var sibling = {}
        var siblingPosition = isRightNode ? 'left' : 'right'
        var siblingValue = tree.levels[x][siblingIndex].toString('hex')
        sibling[siblingPosition] = siblingValue

        proof.push(sibling)
      }

      index = Math.floor(index / 2) // set index to the parent index
    }

    return proof
  }

  // Takes a proof array, a target hash value, and a merkle root
  // Checks the validity of the proof and return true or false
  this.validateProof = function (proof, targetHash, merkleRoot, doubleHash) {
    targetHash = _getBuffer(targetHash)
    merkleRoot = _getBuffer(merkleRoot)
    if (proof.length === 0) return targetHash.toString('hex') === merkleRoot.toString('hex') // no siblings, single item tree, so the hash should also be the root

    var proofHash = targetHash
    for (var x = 0; x < proof.length; x++) {
      if (proof[x].left) { // then the sibling is a left node
        if (doubleHash) { proofHash = hashFunction(hashFunction(Buffer.concat([_getBuffer(proof[x].left), proofHash]))) } else { proofHash = hashFunction(Buffer.concat([_getBuffer(proof[x].left), proofHash])) }
      } else if (proof[x].right) { // then the sibling is a right node
        if (doubleHash) { proofHash = hashFunction(hashFunction(Buffer.concat([proofHash, _getBuffer(proof[x].right)]))) } else { proofHash = hashFunction(Buffer.concat([proofHash, _getBuffer(proof[x].right)])) }
      } else { // no left or right designation exists, proof is invalid
        return false
      }
    }

    return proofHash.toString('hex') === merkleRoot.toString('hex')
  }

  /// ///////////////////////////////////////
  // Private Utility functions
  /// ///////////////////////////////////////

  // Internally, trees are made of nodes containing Buffer values only
  // This helps ensure that leaves being added are Buffers, and will convert hex to Buffer if needed
  function _getBuffer (value) {
    if (value instanceof Buffer) { // we already have a buffer, so return it
      return value
    } else if (_isHex(value)) { // the value is a hex string, convert to buffer and return
      return Buffer.from(value, 'hex')
    } else { // the value is neither buffer nor hex string, will not process this, throw error
      throw new Error("Bad hex value - '" + value + "'")
    }
  }

  function _isHex (value) {
    var hexRegex = /^[0-9A-Fa-f]{2,}$/
    return hexRegex.test(value)
  }

  // Calculates the next level of node when building the merkle tree
  // These values are calcalated off of the current highest level, level 0 and will be prepended to the levels array
  function _calculateNextLevel (doubleHash) {
    var nodes = []
    var topLevel = tree.levels[0]
    var topLevelCount = topLevel.length
    for (var x = 0; x < topLevelCount; x += 2) {
      if (x + 1 <= topLevelCount - 1) { // concatenate and hash the pair, add to the next level array, doubleHash if requested
        if (doubleHash) {
          nodes.push(hashFunction(hashFunction(Buffer.concat([topLevel[x], topLevel[x + 1]]))))
        } else {
          nodes.push(hashFunction(Buffer.concat([topLevel[x], topLevel[x + 1]])))
        }
      } else { // this is an odd ending node, promote up to the next level by itself
        nodes.push(topLevel[x])
      }
    }
    return nodes
  }

  // This version uses the BTC method of duplicating the odd ending nodes
  function _calculateBTCNextLevel (doubleHash) {
    var nodes = []
    var topLevel = tree.levels[0]
    var topLevelCount = topLevel.length
    if (topLevelCount % 2 === 1) { // there is an odd count, duplicate the last element
      topLevel.push(topLevel[topLevelCount - 1])
    }
    for (var x = 0; x < topLevelCount; x += 2) {
      // concatenate and hash the pair, add to the next level array, doubleHash if requested
      if (doubleHash) {
        nodes.push(hashFunction(hashFunction(Buffer.concat([topLevel[x], topLevel[x + 1]]))))
      } else {
        nodes.push(hashFunction(Buffer.concat([topLevel[x], topLevel[x + 1]])))
      }
    }
    return nodes
  }
}

module.exports = MerkleTools


/***/ }),

/***/ 7426:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 */

module.exports = __nccwpck_require__(3765)


/***/ }),

/***/ 3583:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var db = __nccwpck_require__(7426)
var extname = (__nccwpck_require__(1017).extname)

/**
 * Module variables.
 * @private
 */

var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/
var TEXT_TYPE_REGEXP = /^text\//i

/**
 * Module exports.
 * @public
 */

exports.charset = charset
exports.charsets = { lookup: charset }
exports.contentType = contentType
exports.extension = extension
exports.extensions = Object.create(null)
exports.lookup = lookup
exports.types = Object.create(null)

// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types)

/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)
  var mime = match && db[match[1].toLowerCase()]

  if (mime && mime.charset) {
    return mime.charset
  }

  // default text/* to utf-8
  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
    return 'UTF-8'
  }

  return false
}

/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */

function contentType (str) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false
  }

  var mime = str.indexOf('/') === -1
    ? exports.lookup(str)
    : str

  if (!mime) {
    return false
  }

  // TODO: use content-type or other module
  if (mime.indexOf('charset') === -1) {
    var charset = exports.charset(mime)
    if (charset) mime += '; charset=' + charset.toLowerCase()
  }

  return mime
}

/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function extension (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)

  // get extensions
  var exts = match && exports.extensions[match[1].toLowerCase()]

  if (!exts || !exts.length) {
    return false
  }

  return exts[0]
}

/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */

function lookup (path) {
  if (!path || typeof path !== 'string') {
    return false
  }

  // get the extension ("ext" or ".ext" or full path)
  var extension = extname('x.' + path)
    .toLowerCase()
    .substr(1)

  if (!extension) {
    return false
  }

  return exports.types[extension] || false
}

/**
 * Populate the extensions and types maps.
 * @private
 */

function populateMaps (extensions, types) {
  // source preference (least -> most)
  var preference = ['nginx', 'apache', undefined, 'iana']

  Object.keys(db).forEach(function forEachMimeType (type) {
    var mime = db[type]
    var exts = mime.extensions

    if (!exts || !exts.length) {
      return
    }

    // mime -> extensions
    extensions[type] = exts

    // extension -> mime
    for (var i = 0; i < exts.length; i++) {
      var extension = exts[i]

      if (types[extension]) {
        var from = preference.indexOf(db[types[extension]].source)
        var to = preference.indexOf(mime.source)

        if (types[extension] !== 'application/octet-stream' &&
          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
          // skip the remapping
          continue
        }
      }

      // set the extension -> mime
      types[extension] = type
    }
  })
}


/***/ }),

/***/ 9273:
/***/ ((module) => {

"use strict";


class QuickLRU {
	constructor(options = {}) {
		if (!(options.maxSize && options.maxSize > 0)) {
			throw new TypeError('`maxSize` must be a number greater than 0');
		}

		this.maxSize = options.maxSize;
		this.onEviction = options.onEviction;
		this.cache = new Map();
		this.oldCache = new Map();
		this._size = 0;
	}

	_set(key, value) {
		this.cache.set(key, value);
		this._size++;

		if (this._size >= this.maxSize) {
			this._size = 0;

			if (typeof this.onEviction === 'function') {
				for (const [key, value] of this.oldCache.entries()) {
					this.onEviction(key, value);
				}
			}

			this.oldCache = this.cache;
			this.cache = new Map();
		}
	}

	get(key) {
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		if (this.oldCache.has(key)) {
			const value = this.oldCache.get(key);
			this.oldCache.delete(key);
			this._set(key, value);
			return value;
		}
	}

	set(key, value) {
		if (this.cache.has(key)) {
			this.cache.set(key, value);
		} else {
			this._set(key, value);
		}

		return this;
	}

	has(key) {
		return this.cache.has(key) || this.oldCache.has(key);
	}

	peek(key) {
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		if (this.oldCache.has(key)) {
			return this.oldCache.get(key);
		}
	}

	delete(key) {
		const deleted = this.cache.delete(key);
		if (deleted) {
			this._size--;
		}

		return this.oldCache.delete(key) || deleted;
	}

	clear() {
		this.cache.clear();
		this.oldCache.clear();
		this._size = 0;
	}

	* keys() {
		for (const [key] of this) {
			yield key;
		}
	}

	* values() {
		for (const [, value] of this) {
			yield value;
		}
	}

	* [Symbol.iterator]() {
		for (const item of this.cache) {
			yield item;
		}

		for (const item of this.oldCache) {
			const [key] = item;
			if (!this.cache.has(key)) {
				yield item;
			}
		}
	}

	get size() {
		let oldCacheSize = 0;
		for (const key of this.oldCache.keys()) {
			if (!this.cache.has(key)) {
				oldCacheSize++;
			}
		}

		return Math.min(this._size + oldCacheSize, this.maxSize);
	}
}

module.exports = QuickLRU;


/***/ }),

/***/ 6624:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const tls = __nccwpck_require__(4404);

module.exports = (options = {}, connect = tls.connect) => new Promise((resolve, reject) => {
	let timeout = false;

	let socket;

	const callback = async () => {
		await socketPromise;

		socket.off('timeout', onTimeout);
		socket.off('error', reject);

		if (options.resolveSocket) {
			resolve({alpnProtocol: socket.alpnProtocol, socket, timeout});

			if (timeout) {
				await Promise.resolve();
				socket.emit('timeout');
			}
		} else {
			socket.destroy();
			resolve({alpnProtocol: socket.alpnProtocol, timeout});
		}
	};

	const onTimeout = async () => {
		timeout = true;
		callback();
	};

	const socketPromise = (async () => {
		try {
			socket = await connect(options, callback);

			socket.on('error', reject);
			socket.once('timeout', onTimeout);
		} catch (error) {
			reject(error);
		}
	})();
});


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 716:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 4300:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5158:
/***/ ((module) => {

"use strict";
module.exports = require("http2");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 7310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 9796:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ 9449:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {

"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "AuditService": () => (/* binding */ dist_AuditService),
  "AuthN": () => (/* reexport */ AuthN),
  "AuthNService": () => (/* binding */ dist_AuthNService),
  "BaseService": () => (/* binding */ dist_BaseService),
  "ConfigEnv": () => (/* reexport */ ConfigEnv),
  "DomainIntelService": () => (/* binding */ dist_DomainIntelService),
  "EmbargoService": () => (/* binding */ dist_EmbargoService),
  "FileIntelService": () => (/* binding */ dist_FileIntelService),
  "IPIntelService": () => (/* binding */ dist_IPIntelService),
  "Intel": () => (/* reexport */ Intel),
  "PangeaConfig": () => (/* binding */ dist_PangeaConfig),
  "PangeaErrors": () => (/* reexport */ errors_PangeaErrors),
  "PangeaRequest": () => (/* binding */ dist_PangeaRequest),
  "PangeaResponse": () => (/* binding */ dist_PangeaResponse),
  "RedactService": () => (/* binding */ dist_RedactService),
  "URLIntelService": () => (/* binding */ dist_URLIntelService),
  "UserIntelService": () => (/* binding */ dist_UserIntelService),
  "Vault": () => (/* reexport */ types_Vault),
  "VaultService": () => (/* binding */ dist_VaultService),
  "b64toStr": () => (/* reexport */ b64toStr),
  "getHashPrefix": () => (/* reexport */ getHashPrefix),
  "hashSHA1": () => (/* reexport */ hashSHA1),
  "hashSHA256": () => (/* reexport */ hashSHA256),
  "strToB64": () => (/* reexport */ strToB64)
});

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/types.js
var ConfigEnv;
(function (ConfigEnv) {
    ConfigEnv["LOCAL"] = "local";
    ConfigEnv["PRODUCTION"] = "production";
})(ConfigEnv || (ConfigEnv = {}));
/**
 * Intel services interface definitions
 */
var Intel;
(function (Intel) {
    let HashType;
    (function (HashType) {
        HashType["SHA256"] = "sha256";
        HashType["SHA1"] = "sha1";
        HashType["MD5"] = "md5";
    })(HashType = Intel.HashType || (Intel.HashType = {}));
    let User;
    (function (User) {
        let Password;
        (function (Password) {
            let PasswordStatus;
            (function (PasswordStatus) {
                PasswordStatus[PasswordStatus["BREACHED"] = 0] = "BREACHED";
                PasswordStatus[PasswordStatus["UNBREACHED"] = 1] = "UNBREACHED";
                PasswordStatus[PasswordStatus["INCONCLUSIVE"] = 2] = "INCONCLUSIVE";
            })(PasswordStatus = Password.PasswordStatus || (Password.PasswordStatus = {}));
        })(Password = User.Password || (User.Password = {}));
    })(User = Intel.User || (Intel.User = {}));
})(Intel || (Intel = {}));
/**
 * Vault services interface definitions
 */
var types_Vault;
(function (Vault) {
    let KeyPurpose;
    (function (KeyPurpose) {
        KeyPurpose["SIGNING"] = "signing";
        KeyPurpose["ENCRYPTION"] = "encryption";
        KeyPurpose["JWT"] = "jwt";
    })(KeyPurpose = Vault.KeyPurpose || (Vault.KeyPurpose = {}));
    let AsymmetricAlgorithm;
    (function (AsymmetricAlgorithm) {
        AsymmetricAlgorithm["Ed25519"] = "ED25519";
        AsymmetricAlgorithm["RSA2048_PKCS1V15_SHA256"] = "RSA-PKCS1V15-2048-SHA256";
        AsymmetricAlgorithm["RSA2048_OAEP_SHA256"] = "RSA-OAEP-2048-SHA256";
        AsymmetricAlgorithm["ES256"] = "ES256";
        AsymmetricAlgorithm["ES384"] = "ES384";
        AsymmetricAlgorithm["ES512"] = "ES512";
        AsymmetricAlgorithm["ES256K"] = "ES256K";
        AsymmetricAlgorithm["RSA2048_OAEP_SHA1"] = "RSA-OAEP-2048-SHA1";
        AsymmetricAlgorithm["RSA2048_OAEP_SHA512"] = "RSA-OAEP-2048-SHA512";
        AsymmetricAlgorithm["RSA3072_OAEP_SHA1"] = "RSA-OAEP-3072-SHA1";
        AsymmetricAlgorithm["RSA3072_OAEP_SHA256"] = "RSA-OAEP-3072-SHA256";
        AsymmetricAlgorithm["RSA3072_OAEP_SHA512"] = "RSA-OAEP-3072-SHA512";
        AsymmetricAlgorithm["RSA4096_OAEP_SHA1"] = "RSA-OAEP-4096-SHA1";
        AsymmetricAlgorithm["RSA4096_OAEP_SHA256"] = "RSA-OAEP-4096-SHA256";
        AsymmetricAlgorithm["RSA4096_OAEP_SHA512"] = "RSA-OAEP-4096-SHA512";
        AsymmetricAlgorithm["RSA2048_PSS_SHA256"] = "RSA-PSS-2048-SHA256";
        AsymmetricAlgorithm["RSA3072_PSS_SHA256"] = "RSA-PSS-3072-SHA256";
        AsymmetricAlgorithm["RSA4096_PSS_SHA256"] = "RSA-PSS-4096-SHA256";
        AsymmetricAlgorithm["RSA4096_PSS_SHA512"] = "RSA-PSS-4096-SHA512";
        AsymmetricAlgorithm["RSA"] = "RSA-PKCS1V15-2048-SHA256";
    })(AsymmetricAlgorithm = Vault.AsymmetricAlgorithm || (Vault.AsymmetricAlgorithm = {}));
    let SymmetricAlgorithm;
    (function (SymmetricAlgorithm) {
        SymmetricAlgorithm["HS256"] = "HS256";
        SymmetricAlgorithm["HS384"] = "HS384";
        SymmetricAlgorithm["HS512"] = "HS512";
        SymmetricAlgorithm["AES128_CFB"] = "AES-CFB-128";
        SymmetricAlgorithm["AES256_CFB"] = "AES-CFB-256";
        SymmetricAlgorithm["AES256_GCM"] = "AES-GCM-256";
        SymmetricAlgorithm["AES"] = "AES-CFB-128";
    })(SymmetricAlgorithm = Vault.SymmetricAlgorithm || (Vault.SymmetricAlgorithm = {}));
    let ItemType;
    (function (ItemType) {
        ItemType["ASYMMETRIC_KEY"] = "asymmetric_key";
        ItemType["SYMMETRIC_KEY"] = "symmetric_key";
        ItemType["SECRET"] = "secret";
        ItemType["PANGEA_TOKEN"] = "pangea_token";
    })(ItemType = Vault.ItemType || (Vault.ItemType = {}));
    let ItemState;
    (function (ItemState) {
        ItemState["ENABLED"] = "ENABLED";
        ItemState["DISABLED"] = "disabled";
    })(ItemState = Vault.ItemState || (Vault.ItemState = {}));
    let ItemVersionState;
    (function (ItemVersionState) {
        ItemVersionState["ACTIVE"] = "active";
        ItemVersionState["DEACTIVATED"] = "deactivated";
        ItemVersionState["SUSPENDED"] = "suspended";
        ItemVersionState["COMPROMISED"] = "compromised";
        ItemVersionState["DESTROYED"] = "destroyed";
    })(ItemVersionState = Vault.ItemVersionState || (Vault.ItemVersionState = {}));
    let ItemOrder;
    (function (ItemOrder) {
        ItemOrder["ASC"] = "asc";
        ItemOrder["DESC"] = "desc";
    })(ItemOrder = Vault.ItemOrder || (Vault.ItemOrder = {}));
    let ItemOrderBy;
    (function (ItemOrderBy) {
        ItemOrderBy["TYPE"] = "type";
        ItemOrderBy["CREATED_AT"] = "created_at";
        ItemOrderBy["DESTROYED_AT"] = "destroyed_at";
        ItemOrderBy["PURPOSE"] = "purpose";
        ItemOrderBy["EXPIRATION"] = "expiration";
        ItemOrderBy["LAST_ROTATED"] = "last_rotated";
        ItemOrderBy["NEXT_ROTATION"] = "next_rotation";
        ItemOrderBy["NAME"] = "name";
        ItemOrderBy["FOLDER"] = "folder";
        ItemOrderBy["VERSION"] = "version";
    })(ItemOrderBy = Vault.ItemOrderBy || (Vault.ItemOrderBy = {}));
    let Secret;
    (function (Secret) {
        Secret.Algorithm = {
            BASE32: "base32",
        };
    })(Secret = Vault.Secret || (Vault.Secret = {}));
})(types_Vault || (types_Vault = {}));
var AuthN;
(function (AuthN) {
    let IDProvider;
    (function (IDProvider) {
        IDProvider["FACEBOOK"] = "facebook";
        IDProvider["GITHUB"] = "github";
        IDProvider["GOOGLE"] = "google";
        IDProvider["MICROSOFT_ONLINE"] = "microsoftonline";
        IDProvider["PASSWORD"] = "password";
    })(IDProvider = AuthN.IDProvider || (AuthN.IDProvider = {}));
    let ItemOrder;
    (function (ItemOrder) {
        ItemOrder["ASC"] = "asc";
        ItemOrder["DESC"] = "desc";
    })(ItemOrder = AuthN.ItemOrder || (AuthN.ItemOrder = {}));
    let MFAProvider;
    (function (MFAProvider) {
        MFAProvider["TOTP"] = "totp";
        MFAProvider["EMAIL_OTP"] = "email_otp";
        MFAProvider["SMS_OTP"] = "sms_otp";
    })(MFAProvider = AuthN.MFAProvider || (AuthN.MFAProvider = {}));
    let FlowType;
    (function (FlowType) {
        FlowType["SIGNIN"] = "signin";
        FlowType["SIGNUP"] = "signup";
    })(FlowType = AuthN.FlowType || (AuthN.FlowType = {}));
    let TokenType;
    (function (TokenType) {
        TokenType["USER"] = "user";
        TokenType["SERVICE"] = "service";
        TokenType["CLIENT"] = "client";
        TokenType["SESSION"] = "session";
    })(TokenType = AuthN.TokenType || (AuthN.TokenType = {}));
    let Flow;
    (function (Flow) {
        let Step;
        (function (Step) {
            Step["START"] = "start";
            Step["VERIFY_CAPTCHA"] = "verify/captcha";
            Step["SIGNUP"] = "signup";
            Step["VERIFY_EMAIL"] = "verify/email";
            Step["VERIFY_PASSWORD"] = "verify/password";
            Step["VERIFY_SOCIAL"] = "verify/social";
            Step["ENROLL_MFA_START"] = "enroll/mfa/start";
            Step["ENROLL_MFA_COMPLETE"] = "enroll/mfa/complete";
            Step["VERIFY_MFA_START"] = "verify/mfa/start";
            Step["VERIFY_MFA_COMPLETE"] = "verify/mfa/complete";
            Step["COMPLETE"] = "complete";
        })(Step = Flow.Step || (Flow.Step = {}));
    })(Flow = AuthN.Flow || (AuthN.Flow = {}));
    let User;
    (function (User) {
        let ListOrderBy;
        (function (ListOrderBy) {
            ListOrderBy["ID"] = "id";
            ListOrderBy["CREATED_AT"] = "created_at";
            ListOrderBy["LAST_LOGIN_AT"] = "last_login_at";
            ListOrderBy["EMAIL"] = "email";
        })(ListOrderBy = User.ListOrderBy || (User.ListOrderBy = {}));
        let Invite;
        (function (Invite) {
            let OrderBy;
            (function (OrderBy) {
                OrderBy["ID"] = "id";
                OrderBy["CREATED_AT"] = "created_at";
                OrderBy["TYPE"] = "type";
                OrderBy["EXPIRE"] = "expire";
                OrderBy["CALLBACK"] = "callback";
                OrderBy["STATE"] = "state";
                OrderBy["EMAIL"] = "email";
                OrderBy["INVITER"] = "inviter";
                OrderBy["INVITE_ORG"] = "invite_org";
            })(OrderBy = Invite.OrderBy || (Invite.OrderBy = {}));
        })(Invite = User.Invite || (User.Invite = {}));
    })(User = AuthN.User || (AuthN.User = {}));
})(AuthN || (AuthN = {}));

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/config.js

const version = "2.0.0";
class PangeaConfig {
    constructor(options) {
        Object.defineProperty(this, "domain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "pangea.cloud"
        });
        Object.defineProperty(this, "environment", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ConfigEnv.PRODUCTION
        });
        Object.defineProperty(this, "configID", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "insecure", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "requestRetries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3
        });
        Object.defineProperty(this, "requestTimeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5000
        });
        Object.defineProperty(this, "queuedRetryEnabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "queuedRetries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 4
        });
        Object.defineProperty(this, "pollResultTimeoutMs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 60 * 1000
        });
        Object.defineProperty(this, "customUserAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.assign(this, options);
    }
}
/* harmony default export */ const dist_config = (PangeaConfig);

;// CONCATENATED MODULE: external "node:process"
const external_node_process_namespaceObject = require("node:process");
;// CONCATENATED MODULE: external "node:util"
const external_node_util_namespaceObject = require("node:util");
;// CONCATENATED MODULE: external "node:tls"
const external_node_tls_namespaceObject = require("node:tls");
;// CONCATENATED MODULE: external "node:http"
const external_node_http_namespaceObject = require("node:http");
;// CONCATENATED MODULE: external "node:https"
const external_node_https_namespaceObject = require("node:https");
;// CONCATENATED MODULE: ./node_modules/@sindresorhus/is/dist/index.js
const typedArrayTypeNames = [
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
    'BigInt64Array',
    'BigUint64Array',
];
function isTypedArrayName(name) {
    return typedArrayTypeNames.includes(name);
}
const objectTypeNames = [
    'Function',
    'Generator',
    'AsyncGenerator',
    'GeneratorFunction',
    'AsyncGeneratorFunction',
    'AsyncFunction',
    'Observable',
    'Array',
    'Buffer',
    'Blob',
    'Object',
    'RegExp',
    'Date',
    'Error',
    'Map',
    'Set',
    'WeakMap',
    'WeakSet',
    'WeakRef',
    'ArrayBuffer',
    'SharedArrayBuffer',
    'DataView',
    'Promise',
    'URL',
    'FormData',
    'URLSearchParams',
    'HTMLElement',
    'NaN',
    ...typedArrayTypeNames,
];
function isObjectTypeName(name) {
    return objectTypeNames.includes(name);
}
const primitiveTypeNames = [
    'null',
    'undefined',
    'string',
    'number',
    'bigint',
    'boolean',
    'symbol',
];
function isPrimitiveTypeName(name) {
    return primitiveTypeNames.includes(name);
}
// eslint-disable-next-line @typescript-eslint/ban-types
function isOfType(type) {
    return (value) => typeof value === type;
}
const { toString: dist_toString } = Object.prototype;
const getObjectType = (value) => {
    const objectTypeName = dist_toString.call(value).slice(8, -1);
    if (/HTML\w+Element/.test(objectTypeName) && is.domElement(value)) {
        return 'HTMLElement';
    }
    if (isObjectTypeName(objectTypeName)) {
        return objectTypeName;
    }
    return undefined;
};
const isObjectOfType = (type) => (value) => getObjectType(value) === type;
function is(value) {
    if (value === null) {
        return 'null';
    }
    switch (typeof value) {
        case 'undefined': {
            return 'undefined';
        }
        case 'string': {
            return 'string';
        }
        case 'number': {
            return Number.isNaN(value) ? 'NaN' : 'number';
        }
        case 'boolean': {
            return 'boolean';
        }
        case 'function': {
            return 'Function';
        }
        case 'bigint': {
            return 'bigint';
        }
        case 'symbol': {
            return 'symbol';
        }
        default:
    }
    if (is.observable(value)) {
        return 'Observable';
    }
    if (is.array(value)) {
        return 'Array';
    }
    if (is.buffer(value)) {
        return 'Buffer';
    }
    const tagType = getObjectType(value);
    if (tagType) {
        return tagType;
    }
    if (value instanceof String || value instanceof Boolean || value instanceof Number) {
        throw new TypeError('Please don\'t use object wrappers for primitive types');
    }
    return 'Object';
}
is.undefined = isOfType('undefined');
is.string = isOfType('string');
const isNumberType = isOfType('number');
is.number = (value) => isNumberType(value) && !is.nan(value);
is.positiveNumber = (value) => is.number(value) && value > 0;
is.negativeNumber = (value) => is.number(value) && value < 0;
is.bigint = isOfType('bigint');
// eslint-disable-next-line @typescript-eslint/ban-types
is.function_ = isOfType('function');
// eslint-disable-next-line @typescript-eslint/ban-types
is.null_ = (value) => value === null;
is.class_ = (value) => is.function_(value) && value.toString().startsWith('class ');
is.boolean = (value) => value === true || value === false;
is.symbol = isOfType('symbol');
is.numericString = (value) => is.string(value) && !is.emptyStringOrWhitespace(value) && !Number.isNaN(Number(value));
is.array = (value, assertion) => {
    if (!Array.isArray(value)) {
        return false;
    }
    if (!is.function_(assertion)) {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return value.every(element => assertion(element));
};
// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
is.buffer = (value) => value?.constructor?.isBuffer?.(value) ?? false;
is.blob = (value) => isObjectOfType('Blob')(value);
is.nullOrUndefined = (value) => is.null_(value) || is.undefined(value); // eslint-disable-line @typescript-eslint/ban-types
is.object = (value) => !is.null_(value) && (typeof value === 'object' || is.function_(value)); // eslint-disable-line @typescript-eslint/ban-types
is.iterable = (value) => is.function_(value?.[Symbol.iterator]);
is.asyncIterable = (value) => is.function_(value?.[Symbol.asyncIterator]);
is.generator = (value) => is.iterable(value) && is.function_(value?.next) && is.function_(value?.throw);
is.asyncGenerator = (value) => is.asyncIterable(value) && is.function_(value.next) && is.function_(value.throw);
is.nativePromise = (value) => isObjectOfType('Promise')(value);
const hasPromiseApi = (value) => is.function_(value?.then)
    && is.function_(value?.catch);
is.promise = (value) => is.nativePromise(value) || hasPromiseApi(value);
is.generatorFunction = isObjectOfType('GeneratorFunction');
is.asyncGeneratorFunction = (value) => getObjectType(value) === 'AsyncGeneratorFunction';
is.asyncFunction = (value) => getObjectType(value) === 'AsyncFunction';
// eslint-disable-next-line no-prototype-builtins, @typescript-eslint/ban-types
is.boundFunction = (value) => is.function_(value) && !value.hasOwnProperty('prototype');
is.regExp = isObjectOfType('RegExp');
is.date = isObjectOfType('Date');
is.error = isObjectOfType('Error');
is.map = (value) => isObjectOfType('Map')(value);
is.set = (value) => isObjectOfType('Set')(value);
is.weakMap = (value) => isObjectOfType('WeakMap')(value); // eslint-disable-line @typescript-eslint/ban-types
is.weakSet = (value) => isObjectOfType('WeakSet')(value); // eslint-disable-line @typescript-eslint/ban-types
is.weakRef = (value) => isObjectOfType('WeakRef')(value); // eslint-disable-line @typescript-eslint/ban-types
is.int8Array = isObjectOfType('Int8Array');
is.uint8Array = isObjectOfType('Uint8Array');
is.uint8ClampedArray = isObjectOfType('Uint8ClampedArray');
is.int16Array = isObjectOfType('Int16Array');
is.uint16Array = isObjectOfType('Uint16Array');
is.int32Array = isObjectOfType('Int32Array');
is.uint32Array = isObjectOfType('Uint32Array');
is.float32Array = isObjectOfType('Float32Array');
is.float64Array = isObjectOfType('Float64Array');
is.bigInt64Array = isObjectOfType('BigInt64Array');
is.bigUint64Array = isObjectOfType('BigUint64Array');
is.arrayBuffer = isObjectOfType('ArrayBuffer');
is.sharedArrayBuffer = isObjectOfType('SharedArrayBuffer');
is.dataView = isObjectOfType('DataView');
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
is.enumCase = (value, targetEnum) => Object.values(targetEnum).includes(value);
is.directInstanceOf = (instance, class_) => Object.getPrototypeOf(instance) === class_.prototype;
is.urlInstance = (value) => isObjectOfType('URL')(value);
is.urlString = (value) => {
    if (!is.string(value)) {
        return false;
    }
    try {
        new URL(value); // eslint-disable-line no-new
        return true;
    }
    catch {
        return false;
    }
};
// Example: `is.truthy = (value: unknown): value is (not false | not 0 | not '' | not undefined | not null) => Boolean(value);`
is.truthy = (value) => Boolean(value); // eslint-disable-line unicorn/prefer-native-coercion-functions
// Example: `is.falsy = (value: unknown): value is (not true | 0 | '' | undefined | null) => Boolean(value);`
is.falsy = (value) => !value;
is.nan = (value) => Number.isNaN(value);
is.primitive = (value) => is.null_(value) || isPrimitiveTypeName(typeof value);
is.integer = (value) => Number.isInteger(value);
is.safeInteger = (value) => Number.isSafeInteger(value);
is.plainObject = (value) => {
    // From: https://github.com/sindresorhus/is-plain-obj/blob/main/index.js
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const prototype = Object.getPrototypeOf(value);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
};
is.typedArray = (value) => isTypedArrayName(getObjectType(value));
const isValidLength = (value) => is.safeInteger(value) && value >= 0;
is.arrayLike = (value) => !is.nullOrUndefined(value) && !is.function_(value) && isValidLength(value.length);
is.tupleLike = (value, guards) => {
    if (is.array(guards) && is.array(value) && guards.length === value.length) {
        return guards.every((guard, index) => guard(value[index]));
    }
    return false;
};
is.inRange = (value, range) => {
    if (is.number(range)) {
        return value >= Math.min(0, range) && value <= Math.max(range, 0);
    }
    if (is.array(range) && range.length === 2) {
        return value >= Math.min(...range) && value <= Math.max(...range);
    }
    throw new TypeError(`Invalid range: ${JSON.stringify(range)}`);
};
// eslint-disable-next-line @typescript-eslint/naming-convention
const NODE_TYPE_ELEMENT = 1;
// eslint-disable-next-line @typescript-eslint/naming-convention
const DOM_PROPERTIES_TO_CHECK = [
    'innerHTML',
    'ownerDocument',
    'style',
    'attributes',
    'nodeValue',
];
is.domElement = (value) => is.object(value)
    && value.nodeType === NODE_TYPE_ELEMENT
    && is.string(value.nodeName)
    && !is.plainObject(value)
    && DOM_PROPERTIES_TO_CHECK.every(property => property in value);
is.observable = (value) => {
    if (!value) {
        return false;
    }
    // eslint-disable-next-line no-use-extend-native/no-use-extend-native, @typescript-eslint/no-unsafe-call
    if (value === value[Symbol.observable]?.()) {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (value === value['@@observable']?.()) {
        return true;
    }
    return false;
};
is.nodeStream = (value) => is.object(value) && is.function_(value.pipe) && !is.observable(value);
is.infinite = (value) => value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY;
const isAbsoluteMod2 = (remainder) => (value) => is.integer(value) && Math.abs(value % 2) === remainder;
is.evenInteger = isAbsoluteMod2(0);
is.oddInteger = isAbsoluteMod2(1);
is.emptyArray = (value) => is.array(value) && value.length === 0;
is.nonEmptyArray = (value) => is.array(value) && value.length > 0;
is.emptyString = (value) => is.string(value) && value.length === 0;
const isWhiteSpaceString = (value) => is.string(value) && !/\S/.test(value);
is.emptyStringOrWhitespace = (value) => is.emptyString(value) || isWhiteSpaceString(value);
// TODO: Use `not ''` when the `not` operator is available.
is.nonEmptyString = (value) => is.string(value) && value.length > 0;
// TODO: Use `not ''` when the `not` operator is available.
is.nonEmptyStringAndNotWhitespace = (value) => is.string(value) && !is.emptyStringOrWhitespace(value);
// eslint-disable-next-line unicorn/no-array-callback-reference
is.emptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0;
// TODO: Use `not` operator here to remove `Map` and `Set` from type guard:
// - https://github.com/Microsoft/TypeScript/pull/29317
// eslint-disable-next-line unicorn/no-array-callback-reference
is.nonEmptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length > 0;
is.emptySet = (value) => is.set(value) && value.size === 0;
is.nonEmptySet = (value) => is.set(value) && value.size > 0;
// eslint-disable-next-line unicorn/no-array-callback-reference
is.emptyMap = (value) => is.map(value) && value.size === 0;
// eslint-disable-next-line unicorn/no-array-callback-reference
is.nonEmptyMap = (value) => is.map(value) && value.size > 0;
// `PropertyKey` is any value that can be used as an object key (string, number, or symbol)
is.propertyKey = (value) => is.any([is.string, is.number, is.symbol], value);
is.formData = (value) => isObjectOfType('FormData')(value);
is.urlSearchParams = (value) => isObjectOfType('URLSearchParams')(value);
const predicateOnArray = (method, predicate, values) => {
    if (!is.function_(predicate)) {
        throw new TypeError(`Invalid predicate: ${JSON.stringify(predicate)}`);
    }
    if (values.length === 0) {
        throw new TypeError('Invalid number of values');
    }
    return method.call(values, predicate);
};
is.any = (predicate, ...values) => {
    const predicates = is.array(predicate) ? predicate : [predicate];
    return predicates.some(singlePredicate => predicateOnArray(Array.prototype.some, singlePredicate, values));
};
is.all = (predicate, ...values) => predicateOnArray(Array.prototype.every, predicate, values);
const assertType = (condition, description, value, options = {}) => {
    if (!condition) {
        const { multipleValues } = options;
        const valuesMessage = multipleValues
            ? `received values of types ${[
                ...new Set(value.map(singleValue => `\`${is(singleValue)}\``)),
            ].join(', ')}`
            : `received value of type \`${is(value)}\``;
        throw new TypeError(`Expected value which is \`${description}\`, ${valuesMessage}.`);
    }
};
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
const assert = {
    // Unknowns.
    undefined: (value) => assertType(is.undefined(value), 'undefined', value),
    string: (value) => assertType(is.string(value), 'string', value),
    number: (value) => assertType(is.number(value), 'number', value),
    positiveNumber: (value) => assertType(is.positiveNumber(value), "positive number" /* AssertionTypeDescription.positiveNumber */, value),
    negativeNumber: (value) => assertType(is.negativeNumber(value), "negative number" /* AssertionTypeDescription.negativeNumber */, value),
    bigint: (value) => assertType(is.bigint(value), 'bigint', value),
    // eslint-disable-next-line @typescript-eslint/ban-types
    function_: (value) => assertType(is.function_(value), 'Function', value),
    null_: (value) => assertType(is.null_(value), 'null', value),
    class_: (value) => assertType(is.class_(value), "Class" /* AssertionTypeDescription.class_ */, value),
    boolean: (value) => assertType(is.boolean(value), 'boolean', value),
    symbol: (value) => assertType(is.symbol(value), 'symbol', value),
    numericString: (value) => assertType(is.numericString(value), "string with a number" /* AssertionTypeDescription.numericString */, value),
    array: (value, assertion) => {
        const assert = assertType;
        assert(is.array(value), 'Array', value);
        if (assertion) {
            // eslint-disable-next-line unicorn/no-array-for-each, unicorn/no-array-callback-reference
            value.forEach(assertion);
        }
    },
    buffer: (value) => assertType(is.buffer(value), 'Buffer', value),
    blob: (value) => assertType(is.blob(value), 'Blob', value),
    nullOrUndefined: (value) => assertType(is.nullOrUndefined(value), "null or undefined" /* AssertionTypeDescription.nullOrUndefined */, value),
    object: (value) => assertType(is.object(value), 'Object', value),
    iterable: (value) => assertType(is.iterable(value), "Iterable" /* AssertionTypeDescription.iterable */, value),
    asyncIterable: (value) => assertType(is.asyncIterable(value), "AsyncIterable" /* AssertionTypeDescription.asyncIterable */, value),
    generator: (value) => assertType(is.generator(value), 'Generator', value),
    asyncGenerator: (value) => assertType(is.asyncGenerator(value), 'AsyncGenerator', value),
    nativePromise: (value) => assertType(is.nativePromise(value), "native Promise" /* AssertionTypeDescription.nativePromise */, value),
    promise: (value) => assertType(is.promise(value), 'Promise', value),
    generatorFunction: (value) => assertType(is.generatorFunction(value), 'GeneratorFunction', value),
    asyncGeneratorFunction: (value) => assertType(is.asyncGeneratorFunction(value), 'AsyncGeneratorFunction', value),
    // eslint-disable-next-line @typescript-eslint/ban-types
    asyncFunction: (value) => assertType(is.asyncFunction(value), 'AsyncFunction', value),
    // eslint-disable-next-line @typescript-eslint/ban-types
    boundFunction: (value) => assertType(is.boundFunction(value), 'Function', value),
    regExp: (value) => assertType(is.regExp(value), 'RegExp', value),
    date: (value) => assertType(is.date(value), 'Date', value),
    error: (value) => assertType(is.error(value), 'Error', value),
    map: (value) => assertType(is.map(value), 'Map', value),
    set: (value) => assertType(is.set(value), 'Set', value),
    weakMap: (value) => assertType(is.weakMap(value), 'WeakMap', value),
    weakSet: (value) => assertType(is.weakSet(value), 'WeakSet', value),
    weakRef: (value) => assertType(is.weakRef(value), 'WeakRef', value),
    int8Array: (value) => assertType(is.int8Array(value), 'Int8Array', value),
    uint8Array: (value) => assertType(is.uint8Array(value), 'Uint8Array', value),
    uint8ClampedArray: (value) => assertType(is.uint8ClampedArray(value), 'Uint8ClampedArray', value),
    int16Array: (value) => assertType(is.int16Array(value), 'Int16Array', value),
    uint16Array: (value) => assertType(is.uint16Array(value), 'Uint16Array', value),
    int32Array: (value) => assertType(is.int32Array(value), 'Int32Array', value),
    uint32Array: (value) => assertType(is.uint32Array(value), 'Uint32Array', value),
    float32Array: (value) => assertType(is.float32Array(value), 'Float32Array', value),
    float64Array: (value) => assertType(is.float64Array(value), 'Float64Array', value),
    bigInt64Array: (value) => assertType(is.bigInt64Array(value), 'BigInt64Array', value),
    bigUint64Array: (value) => assertType(is.bigUint64Array(value), 'BigUint64Array', value),
    arrayBuffer: (value) => assertType(is.arrayBuffer(value), 'ArrayBuffer', value),
    sharedArrayBuffer: (value) => assertType(is.sharedArrayBuffer(value), 'SharedArrayBuffer', value),
    dataView: (value) => assertType(is.dataView(value), 'DataView', value),
    enumCase: (value, targetEnum) => assertType(is.enumCase(value, targetEnum), 'EnumCase', value),
    urlInstance: (value) => assertType(is.urlInstance(value), 'URL', value),
    urlString: (value) => assertType(is.urlString(value), "string with a URL" /* AssertionTypeDescription.urlString */, value),
    truthy: (value) => assertType(is.truthy(value), "truthy" /* AssertionTypeDescription.truthy */, value),
    falsy: (value) => assertType(is.falsy(value), "falsy" /* AssertionTypeDescription.falsy */, value),
    nan: (value) => assertType(is.nan(value), "NaN" /* AssertionTypeDescription.nan */, value),
    primitive: (value) => assertType(is.primitive(value), "primitive" /* AssertionTypeDescription.primitive */, value),
    integer: (value) => assertType(is.integer(value), "integer" /* AssertionTypeDescription.integer */, value),
    safeInteger: (value) => assertType(is.safeInteger(value), "integer" /* AssertionTypeDescription.safeInteger */, value),
    plainObject: (value) => assertType(is.plainObject(value), "plain object" /* AssertionTypeDescription.plainObject */, value),
    typedArray: (value) => assertType(is.typedArray(value), "TypedArray" /* AssertionTypeDescription.typedArray */, value),
    arrayLike: (value) => assertType(is.arrayLike(value), "array-like" /* AssertionTypeDescription.arrayLike */, value),
    tupleLike: (value, guards) => assertType(is.tupleLike(value, guards), "tuple-like" /* AssertionTypeDescription.tupleLike */, value),
    domElement: (value) => assertType(is.domElement(value), "HTMLElement" /* AssertionTypeDescription.domElement */, value),
    observable: (value) => assertType(is.observable(value), 'Observable', value),
    nodeStream: (value) => assertType(is.nodeStream(value), "Node.js Stream" /* AssertionTypeDescription.nodeStream */, value),
    infinite: (value) => assertType(is.infinite(value), "infinite number" /* AssertionTypeDescription.infinite */, value),
    emptyArray: (value) => assertType(is.emptyArray(value), "empty array" /* AssertionTypeDescription.emptyArray */, value),
    nonEmptyArray: (value) => assertType(is.nonEmptyArray(value), "non-empty array" /* AssertionTypeDescription.nonEmptyArray */, value),
    emptyString: (value) => assertType(is.emptyString(value), "empty string" /* AssertionTypeDescription.emptyString */, value),
    emptyStringOrWhitespace: (value) => assertType(is.emptyStringOrWhitespace(value), "empty string or whitespace" /* AssertionTypeDescription.emptyStringOrWhitespace */, value),
    nonEmptyString: (value) => assertType(is.nonEmptyString(value), "non-empty string" /* AssertionTypeDescription.nonEmptyString */, value),
    nonEmptyStringAndNotWhitespace: (value) => assertType(is.nonEmptyStringAndNotWhitespace(value), "non-empty string and not whitespace" /* AssertionTypeDescription.nonEmptyStringAndNotWhitespace */, value),
    emptyObject: (value) => assertType(is.emptyObject(value), "empty object" /* AssertionTypeDescription.emptyObject */, value),
    nonEmptyObject: (value) => assertType(is.nonEmptyObject(value), "non-empty object" /* AssertionTypeDescription.nonEmptyObject */, value),
    emptySet: (value) => assertType(is.emptySet(value), "empty set" /* AssertionTypeDescription.emptySet */, value),
    nonEmptySet: (value) => assertType(is.nonEmptySet(value), "non-empty set" /* AssertionTypeDescription.nonEmptySet */, value),
    emptyMap: (value) => assertType(is.emptyMap(value), "empty map" /* AssertionTypeDescription.emptyMap */, value),
    nonEmptyMap: (value) => assertType(is.nonEmptyMap(value), "non-empty map" /* AssertionTypeDescription.nonEmptyMap */, value),
    propertyKey: (value) => assertType(is.propertyKey(value), 'PropertyKey', value),
    formData: (value) => assertType(is.formData(value), 'FormData', value),
    urlSearchParams: (value) => assertType(is.urlSearchParams(value), 'URLSearchParams', value),
    // Numbers.
    evenInteger: (value) => assertType(is.evenInteger(value), "even integer" /* AssertionTypeDescription.evenInteger */, value),
    oddInteger: (value) => assertType(is.oddInteger(value), "odd integer" /* AssertionTypeDescription.oddInteger */, value),
    // Two arguments.
    directInstanceOf: (instance, class_) => assertType(is.directInstanceOf(instance, class_), "T" /* AssertionTypeDescription.directInstanceOf */, instance),
    inRange: (value, range) => assertType(is.inRange(value, range), "in range" /* AssertionTypeDescription.inRange */, value),
    // Variadic functions.
    any: (predicate, ...values) => assertType(is.any(predicate, ...values), "predicate returns truthy for any value" /* AssertionTypeDescription.any */, values, { multipleValues: true }),
    all: (predicate, ...values) => assertType(is.all(predicate, ...values), "predicate returns truthy for all values" /* AssertionTypeDescription.all */, values, { multipleValues: true }),
};
/* eslint-enable @typescript-eslint/no-confusing-void-expression */
// Some few keywords are reserved, but we'll populate them for Node.js users
// See https://github.com/Microsoft/TypeScript/issues/2536
Object.defineProperties(is, {
    class: {
        value: is.class_,
    },
    function: {
        value: is.function_,
    },
    null: {
        value: is.null_,
    },
});
Object.defineProperties(assert, {
    class: {
        value: assert.class_,
    },
    function: {
        value: assert.function_,
    },
    null: {
        value: assert.null_,
    },
});
/* harmony default export */ const dist = (is);

;// CONCATENATED MODULE: ./node_modules/lowercase-keys/index.js
function lowercaseKeys(object) {
	return Object.fromEntries(Object.entries(object).map(([key, value]) => [key.toLowerCase(), value]));
}

;// CONCATENATED MODULE: external "node:dns"
const external_node_dns_namespaceObject = require("node:dns");
;// CONCATENATED MODULE: external "node:os"
const external_node_os_namespaceObject = require("node:os");
;// CONCATENATED MODULE: ./node_modules/cacheable-lookup/source/index.js




const {Resolver: AsyncResolver} = external_node_dns_namespaceObject.promises;

const kCacheableLookupCreateConnection = Symbol('cacheableLookupCreateConnection');
const kCacheableLookupInstance = Symbol('cacheableLookupInstance');
const kExpires = Symbol('expires');

const supportsALL = typeof external_node_dns_namespaceObject.ALL === 'number';

const verifyAgent = agent => {
	if (!(agent && typeof agent.createConnection === 'function')) {
		throw new Error('Expected an Agent instance as the first argument');
	}
};

const map4to6 = entries => {
	for (const entry of entries) {
		if (entry.family === 6) {
			continue;
		}

		entry.address = `::ffff:${entry.address}`;
		entry.family = 6;
	}
};

const getIfaceInfo = () => {
	let has4 = false;
	let has6 = false;

	for (const device of Object.values(external_node_os_namespaceObject.networkInterfaces())) {
		for (const iface of device) {
			if (iface.internal) {
				continue;
			}

			if (iface.family === 'IPv6') {
				has6 = true;
			} else {
				has4 = true;
			}

			if (has4 && has6) {
				return {has4, has6};
			}
		}
	}

	return {has4, has6};
};

const isIterable = map => {
	return Symbol.iterator in map;
};

const ignoreNoResultErrors = dnsPromise => {
	return dnsPromise.catch(error => {
		if (
			error.code === 'ENODATA' ||
			error.code === 'ENOTFOUND' ||
			error.code === 'ENOENT' // Windows: name exists, but not this record type
		) {
			return [];
		}

		throw error;
	});
};

const ttl = {ttl: true};
const source_all = {all: true};
const all4 = {all: true, family: 4};
const all6 = {all: true, family: 6};

class CacheableLookup {
	constructor({
		cache = new Map(),
		maxTtl = Infinity,
		fallbackDuration = 3600,
		errorTtl = 0.15,
		resolver = new AsyncResolver(),
		lookup = external_node_dns_namespaceObject.lookup
	} = {}) {
		this.maxTtl = maxTtl;
		this.errorTtl = errorTtl;

		this._cache = cache;
		this._resolver = resolver;
		this._dnsLookup = lookup && (0,external_node_util_namespaceObject.promisify)(lookup);
		this.stats = {
			cache: 0,
			query: 0
		};

		if (this._resolver instanceof AsyncResolver) {
			this._resolve4 = this._resolver.resolve4.bind(this._resolver);
			this._resolve6 = this._resolver.resolve6.bind(this._resolver);
		} else {
			this._resolve4 = (0,external_node_util_namespaceObject.promisify)(this._resolver.resolve4.bind(this._resolver));
			this._resolve6 = (0,external_node_util_namespaceObject.promisify)(this._resolver.resolve6.bind(this._resolver));
		}

		this._iface = getIfaceInfo();

		this._pending = {};
		this._nextRemovalTime = false;
		this._hostnamesToFallback = new Set();

		this.fallbackDuration = fallbackDuration;

		if (fallbackDuration > 0) {
			const interval = setInterval(() => {
				this._hostnamesToFallback.clear();
			}, fallbackDuration * 1000);

			/* istanbul ignore next: There is no `interval.unref()` when running inside an Electron renderer */
			if (interval.unref) {
				interval.unref();
			}

			this._fallbackInterval = interval;
		}

		this.lookup = this.lookup.bind(this);
		this.lookupAsync = this.lookupAsync.bind(this);
	}

	set servers(servers) {
		this.clear();

		this._resolver.setServers(servers);
	}

	get servers() {
		return this._resolver.getServers();
	}

	lookup(hostname, options, callback) {
		if (typeof options === 'function') {
			callback = options;
			options = {};
		} else if (typeof options === 'number') {
			options = {
				family: options
			};
		}

		if (!callback) {
			throw new Error('Callback must be a function.');
		}

		// eslint-disable-next-line promise/prefer-await-to-then
		this.lookupAsync(hostname, options).then(result => {
			if (options.all) {
				callback(null, result);
			} else {
				callback(null, result.address, result.family, result.expires, result.ttl, result.source);
			}
		}, callback);
	}

	async lookupAsync(hostname, options = {}) {
		if (typeof options === 'number') {
			options = {
				family: options
			};
		}

		let cached = await this.query(hostname);

		if (options.family === 6) {
			const filtered = cached.filter(entry => entry.family === 6);

			if (options.hints & external_node_dns_namespaceObject.V4MAPPED) {
				if ((supportsALL && options.hints & external_node_dns_namespaceObject.ALL) || filtered.length === 0) {
					map4to6(cached);
				} else {
					cached = filtered;
				}
			} else {
				cached = filtered;
			}
		} else if (options.family === 4) {
			cached = cached.filter(entry => entry.family === 4);
		}

		if (options.hints & external_node_dns_namespaceObject.ADDRCONFIG) {
			const {_iface} = this;
			cached = cached.filter(entry => entry.family === 6 ? _iface.has6 : _iface.has4);
		}

		if (cached.length === 0) {
			const error = new Error(`cacheableLookup ENOTFOUND ${hostname}`);
			error.code = 'ENOTFOUND';
			error.hostname = hostname;

			throw error;
		}

		if (options.all) {
			return cached;
		}

		return cached[0];
	}

	async query(hostname) {
		let source = 'cache';
		let cached = await this._cache.get(hostname);

		if (cached) {
			this.stats.cache++;
		}

		if (!cached) {
			const pending = this._pending[hostname];
			if (pending) {
				this.stats.cache++;
				cached = await pending;
			} else {
				source = 'query';
				const newPromise = this.queryAndCache(hostname);
				this._pending[hostname] = newPromise;
				this.stats.query++;
				try {
					cached = await newPromise;
				} finally {
					delete this._pending[hostname];
				}
			}
		}

		cached = cached.map(entry => {
			return {...entry, source};
		});

		return cached;
	}

	async _resolve(hostname) {
		// ANY is unsafe as it doesn't trigger new queries in the underlying server.
		const [A, AAAA] = await Promise.all([
			ignoreNoResultErrors(this._resolve4(hostname, ttl)),
			ignoreNoResultErrors(this._resolve6(hostname, ttl))
		]);

		let aTtl = 0;
		let aaaaTtl = 0;
		let cacheTtl = 0;

		const now = Date.now();

		for (const entry of A) {
			entry.family = 4;
			entry.expires = now + (entry.ttl * 1000);

			aTtl = Math.max(aTtl, entry.ttl);
		}

		for (const entry of AAAA) {
			entry.family = 6;
			entry.expires = now + (entry.ttl * 1000);

			aaaaTtl = Math.max(aaaaTtl, entry.ttl);
		}

		if (A.length > 0) {
			if (AAAA.length > 0) {
				cacheTtl = Math.min(aTtl, aaaaTtl);
			} else {
				cacheTtl = aTtl;
			}
		} else {
			cacheTtl = aaaaTtl;
		}

		return {
			entries: [
				...A,
				...AAAA
			],
			cacheTtl
		};
	}

	async _lookup(hostname) {
		try {
			const [A, AAAA] = await Promise.all([
				// Passing {all: true} doesn't return all IPv4 and IPv6 entries.
				// See https://github.com/szmarczak/cacheable-lookup/issues/42
				ignoreNoResultErrors(this._dnsLookup(hostname, all4)),
				ignoreNoResultErrors(this._dnsLookup(hostname, all6))
			]);

			return {
				entries: [
					...A,
					...AAAA
				],
				cacheTtl: 0
			};
		} catch {
			return {
				entries: [],
				cacheTtl: 0
			};
		}
	}

	async _set(hostname, data, cacheTtl) {
		if (this.maxTtl > 0 && cacheTtl > 0) {
			cacheTtl = Math.min(cacheTtl, this.maxTtl) * 1000;
			data[kExpires] = Date.now() + cacheTtl;

			try {
				await this._cache.set(hostname, data, cacheTtl);
			} catch (error) {
				this.lookupAsync = async () => {
					const cacheError = new Error('Cache Error. Please recreate the CacheableLookup instance.');
					cacheError.cause = error;

					throw cacheError;
				};
			}

			if (isIterable(this._cache)) {
				this._tick(cacheTtl);
			}
		}
	}

	async queryAndCache(hostname) {
		if (this._hostnamesToFallback.has(hostname)) {
			return this._dnsLookup(hostname, source_all);
		}

		let query = await this._resolve(hostname);

		if (query.entries.length === 0 && this._dnsLookup) {
			query = await this._lookup(hostname);

			if (query.entries.length !== 0 && this.fallbackDuration > 0) {
				// Use `dns.lookup(...)` for that particular hostname
				this._hostnamesToFallback.add(hostname);
			}
		}

		const cacheTtl = query.entries.length === 0 ? this.errorTtl : query.cacheTtl;
		await this._set(hostname, query.entries, cacheTtl);

		return query.entries;
	}

	_tick(ms) {
		const nextRemovalTime = this._nextRemovalTime;

		if (!nextRemovalTime || ms < nextRemovalTime) {
			clearTimeout(this._removalTimeout);

			this._nextRemovalTime = ms;

			this._removalTimeout = setTimeout(() => {
				this._nextRemovalTime = false;

				let nextExpiry = Infinity;

				const now = Date.now();

				for (const [hostname, entries] of this._cache) {
					const expires = entries[kExpires];

					if (now >= expires) {
						this._cache.delete(hostname);
					} else if (expires < nextExpiry) {
						nextExpiry = expires;
					}
				}

				if (nextExpiry !== Infinity) {
					this._tick(nextExpiry - now);
				}
			}, ms);

			/* istanbul ignore next: There is no `timeout.unref()` when running inside an Electron renderer */
			if (this._removalTimeout.unref) {
				this._removalTimeout.unref();
			}
		}
	}

	install(agent) {
		verifyAgent(agent);

		if (kCacheableLookupCreateConnection in agent) {
			throw new Error('CacheableLookup has been already installed');
		}

		agent[kCacheableLookupCreateConnection] = agent.createConnection;
		agent[kCacheableLookupInstance] = this;

		agent.createConnection = (options, callback) => {
			if (!('lookup' in options)) {
				options.lookup = this.lookup;
			}

			return agent[kCacheableLookupCreateConnection](options, callback);
		};
	}

	uninstall(agent) {
		verifyAgent(agent);

		if (agent[kCacheableLookupCreateConnection]) {
			if (agent[kCacheableLookupInstance] !== this) {
				throw new Error('The agent is not owned by this CacheableLookup instance');
			}

			agent.createConnection = agent[kCacheableLookupCreateConnection];

			delete agent[kCacheableLookupCreateConnection];
			delete agent[kCacheableLookupInstance];
		}
	}

	updateInterfaceInfo() {
		const {_iface} = this;

		this._iface = getIfaceInfo();

		if ((_iface.has4 && !this._iface.has4) || (_iface.has6 && !this._iface.has6)) {
			this._cache.clear();
		}
	}

	clear(hostname) {
		if (hostname) {
			this._cache.delete(hostname);
			return;
		}

		this._cache.clear();
	}
}

// EXTERNAL MODULE: ./node_modules/http2-wrapper/source/index.js
var source = __nccwpck_require__(4645);
;// CONCATENATED MODULE: ./node_modules/form-data-encoder/lib/util/isFunction.js
const isFunction = (value) => (typeof value === "function");

;// CONCATENATED MODULE: ./node_modules/form-data-encoder/lib/util/isFormData.js

const isFormData = (value) => Boolean(value
    && isFunction(value.constructor)
    && value[Symbol.toStringTag] === "FormData"
    && isFunction(value.append)
    && isFunction(value.getAll)
    && isFunction(value.entries)
    && isFunction(value[Symbol.iterator]));

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/parse-link-header.js
function parseLinkHeader(link) {
    const parsed = [];
    const items = link.split(',');
    for (const item of items) {
        // https://tools.ietf.org/html/rfc5988#section-5
        const [rawUriReference, ...rawLinkParameters] = item.split(';');
        const trimmedUriReference = rawUriReference.trim();
        // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
        if (trimmedUriReference[0] !== '<' || trimmedUriReference[trimmedUriReference.length - 1] !== '>') {
            throw new Error(`Invalid format of the Link header reference: ${trimmedUriReference}`);
        }
        const reference = trimmedUriReference.slice(1, -1);
        const parameters = {};
        if (rawLinkParameters.length === 0) {
            throw new Error(`Unexpected end of Link header parameters: ${rawLinkParameters.join(';')}`);
        }
        for (const rawParameter of rawLinkParameters) {
            const trimmedRawParameter = rawParameter.trim();
            const center = trimmedRawParameter.indexOf('=');
            if (center === -1) {
                throw new Error(`Failed to parse Link header: ${link}`);
            }
            const name = trimmedRawParameter.slice(0, center).trim();
            const value = trimmedRawParameter.slice(center + 1).trim();
            parameters[name] = value;
        }
        parsed.push({
            reference,
            parameters,
        });
    }
    return parsed;
}

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/options.js



// DO NOT use destructuring for `https.request` and `http.request` as it's not compatible with `nock`.








const [major, minor] = external_node_process_namespaceObject.versions.node.split('.').map(Number);
function validateSearchParameters(searchParameters) {
    // eslint-disable-next-line guard-for-in
    for (const key in searchParameters) {
        const value = searchParameters[key];
        assert.any([dist.string, dist.number, dist.boolean, dist.null_, dist.undefined], value);
    }
}
const globalCache = new Map();
let globalDnsCache;
const getGlobalDnsCache = () => {
    if (globalDnsCache) {
        return globalDnsCache;
    }
    globalDnsCache = new CacheableLookup();
    return globalDnsCache;
};
const defaultInternals = {
    request: undefined,
    agent: {
        http: undefined,
        https: undefined,
        http2: undefined,
    },
    h2session: undefined,
    decompress: true,
    timeout: {
        connect: undefined,
        lookup: undefined,
        read: undefined,
        request: undefined,
        response: undefined,
        secureConnect: undefined,
        send: undefined,
        socket: undefined,
    },
    prefixUrl: '',
    body: undefined,
    form: undefined,
    json: undefined,
    cookieJar: undefined,
    ignoreInvalidCookies: false,
    searchParams: undefined,
    dnsLookup: undefined,
    dnsCache: undefined,
    context: {},
    hooks: {
        init: [],
        beforeRequest: [],
        beforeError: [],
        beforeRedirect: [],
        beforeRetry: [],
        afterResponse: [],
    },
    followRedirect: true,
    maxRedirects: 10,
    cache: undefined,
    throwHttpErrors: true,
    username: '',
    password: '',
    http2: false,
    allowGetBody: false,
    headers: {
        'user-agent': 'got (https://github.com/sindresorhus/got)',
    },
    methodRewriting: false,
    dnsLookupIpVersion: undefined,
    parseJson: JSON.parse,
    stringifyJson: JSON.stringify,
    retry: {
        limit: 2,
        methods: [
            'GET',
            'PUT',
            'HEAD',
            'DELETE',
            'OPTIONS',
            'TRACE',
        ],
        statusCodes: [
            408,
            413,
            429,
            500,
            502,
            503,
            504,
            521,
            522,
            524,
        ],
        errorCodes: [
            'ETIMEDOUT',
            'ECONNRESET',
            'EADDRINUSE',
            'ECONNREFUSED',
            'EPIPE',
            'ENOTFOUND',
            'ENETUNREACH',
            'EAI_AGAIN',
        ],
        maxRetryAfter: undefined,
        calculateDelay: ({ computedValue }) => computedValue,
        backoffLimit: Number.POSITIVE_INFINITY,
        noise: 100,
    },
    localAddress: undefined,
    method: 'GET',
    createConnection: undefined,
    cacheOptions: {
        shared: undefined,
        cacheHeuristic: undefined,
        immutableMinTimeToLive: undefined,
        ignoreCargoCult: undefined,
    },
    https: {
        alpnProtocols: undefined,
        rejectUnauthorized: undefined,
        checkServerIdentity: undefined,
        certificateAuthority: undefined,
        key: undefined,
        certificate: undefined,
        passphrase: undefined,
        pfx: undefined,
        ciphers: undefined,
        honorCipherOrder: undefined,
        minVersion: undefined,
        maxVersion: undefined,
        signatureAlgorithms: undefined,
        tlsSessionLifetime: undefined,
        dhparam: undefined,
        ecdhCurve: undefined,
        certificateRevocationLists: undefined,
    },
    encoding: undefined,
    resolveBodyOnly: false,
    isStream: false,
    responseType: 'text',
    url: undefined,
    pagination: {
        transform(response) {
            if (response.request.options.responseType === 'json') {
                return response.body;
            }
            return JSON.parse(response.body);
        },
        paginate({ response }) {
            const rawLinkHeader = response.headers.link;
            if (typeof rawLinkHeader !== 'string' || rawLinkHeader.trim() === '') {
                return false;
            }
            const parsed = parseLinkHeader(rawLinkHeader);
            const next = parsed.find(entry => entry.parameters.rel === 'next' || entry.parameters.rel === '"next"');
            if (next) {
                return {
                    url: new URL(next.reference, response.url),
                };
            }
            return false;
        },
        filter: () => true,
        shouldContinue: () => true,
        countLimit: Number.POSITIVE_INFINITY,
        backoff: 0,
        requestLimit: 10000,
        stackAllItems: false,
    },
    setHost: true,
    maxHeaderSize: undefined,
    signal: undefined,
    enableUnixSockets: false,
};
const cloneInternals = (internals) => {
    const { hooks, retry } = internals;
    const result = {
        ...internals,
        context: { ...internals.context },
        cacheOptions: { ...internals.cacheOptions },
        https: { ...internals.https },
        agent: { ...internals.agent },
        headers: { ...internals.headers },
        retry: {
            ...retry,
            errorCodes: [...retry.errorCodes],
            methods: [...retry.methods],
            statusCodes: [...retry.statusCodes],
        },
        timeout: { ...internals.timeout },
        hooks: {
            init: [...hooks.init],
            beforeRequest: [...hooks.beforeRequest],
            beforeError: [...hooks.beforeError],
            beforeRedirect: [...hooks.beforeRedirect],
            beforeRetry: [...hooks.beforeRetry],
            afterResponse: [...hooks.afterResponse],
        },
        searchParams: internals.searchParams ? new URLSearchParams(internals.searchParams) : undefined,
        pagination: { ...internals.pagination },
    };
    if (result.url !== undefined) {
        result.prefixUrl = '';
    }
    return result;
};
const cloneRaw = (raw) => {
    const { hooks, retry } = raw;
    const result = { ...raw };
    if (dist.object(raw.context)) {
        result.context = { ...raw.context };
    }
    if (dist.object(raw.cacheOptions)) {
        result.cacheOptions = { ...raw.cacheOptions };
    }
    if (dist.object(raw.https)) {
        result.https = { ...raw.https };
    }
    if (dist.object(raw.cacheOptions)) {
        result.cacheOptions = { ...result.cacheOptions };
    }
    if (dist.object(raw.agent)) {
        result.agent = { ...raw.agent };
    }
    if (dist.object(raw.headers)) {
        result.headers = { ...raw.headers };
    }
    if (dist.object(retry)) {
        result.retry = { ...retry };
        if (dist.array(retry.errorCodes)) {
            result.retry.errorCodes = [...retry.errorCodes];
        }
        if (dist.array(retry.methods)) {
            result.retry.methods = [...retry.methods];
        }
        if (dist.array(retry.statusCodes)) {
            result.retry.statusCodes = [...retry.statusCodes];
        }
    }
    if (dist.object(raw.timeout)) {
        result.timeout = { ...raw.timeout };
    }
    if (dist.object(hooks)) {
        result.hooks = {
            ...hooks,
        };
        if (dist.array(hooks.init)) {
            result.hooks.init = [...hooks.init];
        }
        if (dist.array(hooks.beforeRequest)) {
            result.hooks.beforeRequest = [...hooks.beforeRequest];
        }
        if (dist.array(hooks.beforeError)) {
            result.hooks.beforeError = [...hooks.beforeError];
        }
        if (dist.array(hooks.beforeRedirect)) {
            result.hooks.beforeRedirect = [...hooks.beforeRedirect];
        }
        if (dist.array(hooks.beforeRetry)) {
            result.hooks.beforeRetry = [...hooks.beforeRetry];
        }
        if (dist.array(hooks.afterResponse)) {
            result.hooks.afterResponse = [...hooks.afterResponse];
        }
    }
    // TODO: raw.searchParams
    if (dist.object(raw.pagination)) {
        result.pagination = { ...raw.pagination };
    }
    return result;
};
const getHttp2TimeoutOption = (internals) => {
    const delays = [internals.timeout.socket, internals.timeout.connect, internals.timeout.lookup, internals.timeout.request, internals.timeout.secureConnect].filter(delay => typeof delay === 'number');
    if (delays.length > 0) {
        return Math.min(...delays);
    }
    return undefined;
};
const init = (options, withOptions, self) => {
    const initHooks = options.hooks?.init;
    if (initHooks) {
        for (const hook of initHooks) {
            hook(withOptions, self);
        }
    }
};
class Options {
    constructor(input, options, defaults) {
        Object.defineProperty(this, "_unixOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_internals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_merging", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_init", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        assert.any([dist.string, dist.urlInstance, dist.object, dist.undefined], input);
        assert.any([dist.object, dist.undefined], options);
        assert.any([dist.object, dist.undefined], defaults);
        if (input instanceof Options || options instanceof Options) {
            throw new TypeError('The defaults must be passed as the third argument');
        }
        this._internals = cloneInternals(defaults?._internals ?? defaults ?? defaultInternals);
        this._init = [...(defaults?._init ?? [])];
        this._merging = false;
        this._unixOptions = undefined;
        // This rule allows `finally` to be considered more important.
        // Meaning no matter the error thrown in the `try` block,
        // if `finally` throws then the `finally` error will be thrown.
        //
        // Yes, we want this. If we set `url` first, then the `url.searchParams`
        // would get merged. Instead we set the `searchParams` first, then
        // `url.searchParams` is overwritten as expected.
        //
        /* eslint-disable no-unsafe-finally */
        try {
            if (dist.plainObject(input)) {
                try {
                    this.merge(input);
                    this.merge(options);
                }
                finally {
                    this.url = input.url;
                }
            }
            else {
                try {
                    this.merge(options);
                }
                finally {
                    if (options?.url !== undefined) {
                        if (input === undefined) {
                            this.url = options.url;
                        }
                        else {
                            throw new TypeError('The `url` option is mutually exclusive with the `input` argument');
                        }
                    }
                    else if (input !== undefined) {
                        this.url = input;
                    }
                }
            }
        }
        catch (error) {
            error.options = this;
            throw error;
        }
        /* eslint-enable no-unsafe-finally */
    }
    merge(options) {
        if (!options) {
            return;
        }
        if (options instanceof Options) {
            for (const init of options._init) {
                this.merge(init);
            }
            return;
        }
        options = cloneRaw(options);
        init(this, options, this);
        init(options, options, this);
        this._merging = true;
        // Always merge `isStream` first
        if ('isStream' in options) {
            this.isStream = options.isStream;
        }
        try {
            let push = false;
            for (const key in options) {
                // `got.extend()` options
                if (key === 'mutableDefaults' || key === 'handlers') {
                    continue;
                }
                // Never merge `url`
                if (key === 'url') {
                    continue;
                }
                if (!(key in this)) {
                    throw new Error(`Unexpected option: ${key}`);
                }
                // @ts-expect-error Type 'unknown' is not assignable to type 'never'.
                const value = options[key];
                if (value === undefined) {
                    continue;
                }
                // @ts-expect-error Type 'unknown' is not assignable to type 'never'.
                this[key] = value;
                push = true;
            }
            if (push) {
                this._init.push(options);
            }
        }
        finally {
            this._merging = false;
        }
    }
    /**
    Custom request function.
    The main purpose of this is to [support HTTP2 using a wrapper](https://github.com/szmarczak/http2-wrapper).

    @default http.request | https.request
    */
    get request() {
        return this._internals.request;
    }
    set request(value) {
        assert.any([dist.function_, dist.undefined], value);
        this._internals.request = value;
    }
    /**
    An object representing `http`, `https` and `http2` keys for [`http.Agent`](https://nodejs.org/api/http.html#http_class_http_agent), [`https.Agent`](https://nodejs.org/api/https.html#https_class_https_agent) and [`http2wrapper.Agent`](https://github.com/szmarczak/http2-wrapper#new-http2agentoptions) instance.
    This is necessary because a request to one protocol might redirect to another.
    In such a scenario, Got will switch over to the right protocol agent for you.

    If a key is not present, it will default to a global agent.

    @example
    ```
    import got from 'got';
    import HttpAgent from 'agentkeepalive';

    const {HttpsAgent} = HttpAgent;

    await got('https://sindresorhus.com', {
        agent: {
            http: new HttpAgent(),
            https: new HttpsAgent()
        }
    });
    ```
    */
    get agent() {
        return this._internals.agent;
    }
    set agent(value) {
        assert.plainObject(value);
        // eslint-disable-next-line guard-for-in
        for (const key in value) {
            if (!(key in this._internals.agent)) {
                throw new TypeError(`Unexpected agent option: ${key}`);
            }
            // @ts-expect-error - No idea why `value[key]` doesn't work here.
            assert.any([dist.object, dist.undefined], value[key]);
        }
        if (this._merging) {
            Object.assign(this._internals.agent, value);
        }
        else {
            this._internals.agent = { ...value };
        }
    }
    get h2session() {
        return this._internals.h2session;
    }
    set h2session(value) {
        this._internals.h2session = value;
    }
    /**
    Decompress the response automatically.

    This will set the `accept-encoding` header to `gzip, deflate, br` unless you set it yourself.

    If this is disabled, a compressed response is returned as a `Buffer`.
    This may be useful if you want to handle decompression yourself or stream the raw compressed data.

    @default true
    */
    get decompress() {
        return this._internals.decompress;
    }
    set decompress(value) {
        assert.boolean(value);
        this._internals.decompress = value;
    }
    /**
    Milliseconds to wait for the server to end the response before aborting the request with `got.TimeoutError` error (a.k.a. `request` property).
    By default, there's no timeout.

    This also accepts an `object` with the following fields to constrain the duration of each phase of the request lifecycle:

    - `lookup` starts when a socket is assigned and ends when the hostname has been resolved.
        Does not apply when using a Unix domain socket.
    - `connect` starts when `lookup` completes (or when the socket is assigned if lookup does not apply to the request) and ends when the socket is connected.
    - `secureConnect` starts when `connect` completes and ends when the handshaking process completes (HTTPS only).
    - `socket` starts when the socket is connected. See [request.setTimeout](https://nodejs.org/api/http.html#http_request_settimeout_timeout_callback).
    - `response` starts when the request has been written to the socket and ends when the response headers are received.
    - `send` starts when the socket is connected and ends with the request has been written to the socket.
    - `request` starts when the request is initiated and ends when the response's end event fires.
    */
    get timeout() {
        // We always return `Delays` here.
        // It has to be `Delays | number`, otherwise TypeScript will error because the getter and the setter have incompatible types.
        return this._internals.timeout;
    }
    set timeout(value) {
        assert.plainObject(value);
        // eslint-disable-next-line guard-for-in
        for (const key in value) {
            if (!(key in this._internals.timeout)) {
                throw new Error(`Unexpected timeout option: ${key}`);
            }
            // @ts-expect-error - No idea why `value[key]` doesn't work here.
            assert.any([dist.number, dist.undefined], value[key]);
        }
        if (this._merging) {
            Object.assign(this._internals.timeout, value);
        }
        else {
            this._internals.timeout = { ...value };
        }
    }
    /**
    When specified, `prefixUrl` will be prepended to `url`.
    The prefix can be any valid URL, either relative or absolute.
    A trailing slash `/` is optional - one will be added automatically.

    __Note__: `prefixUrl` will be ignored if the `url` argument is a URL instance.

    __Note__: Leading slashes in `input` are disallowed when using this option to enforce consistency and avoid confusion.
    For example, when the prefix URL is `https://example.com/foo` and the input is `/bar`, there's ambiguity whether the resulting URL would become `https://example.com/foo/bar` or `https://example.com/bar`.
    The latter is used by browsers.

    __Tip__: Useful when used with `got.extend()` to create niche-specific Got instances.

    __Tip__: You can change `prefixUrl` using hooks as long as the URL still includes the `prefixUrl`.
    If the URL doesn't include it anymore, it will throw.

    @example
    ```
    import got from 'got';

    await got('unicorn', {prefixUrl: 'https://cats.com'});
    //=> 'https://cats.com/unicorn'

    const instance = got.extend({
        prefixUrl: 'https://google.com'
    });

    await instance('unicorn', {
        hooks: {
            beforeRequest: [
                options => {
                    options.prefixUrl = 'https://cats.com';
                }
            ]
        }
    });
    //=> 'https://cats.com/unicorn'
    ```
    */
    get prefixUrl() {
        // We always return `string` here.
        // It has to be `string | URL`, otherwise TypeScript will error because the getter and the setter have incompatible types.
        return this._internals.prefixUrl;
    }
    set prefixUrl(value) {
        assert.any([dist.string, dist.urlInstance], value);
        if (value === '') {
            this._internals.prefixUrl = '';
            return;
        }
        value = value.toString();
        if (!value.endsWith('/')) {
            value += '/';
        }
        if (this._internals.prefixUrl && this._internals.url) {
            const { href } = this._internals.url;
            this._internals.url.href = value + href.slice(this._internals.prefixUrl.length);
        }
        this._internals.prefixUrl = value;
    }
    /**
    __Note #1__: The `body` option cannot be used with the `json` or `form` option.

    __Note #2__: If you provide this option, `got.stream()` will be read-only.

    __Note #3__: If you provide a payload with the `GET` or `HEAD` method, it will throw a `TypeError` unless the method is `GET` and the `allowGetBody` option is set to `true`.

    __Note #4__: This option is not enumerable and will not be merged with the instance defaults.

    The `content-length` header will be automatically set if `body` is a `string` / `Buffer` / [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) / [`form-data` instance](https://github.com/form-data/form-data), and `content-length` and `transfer-encoding` are not manually set in `options.headers`.

    Since Got 12, the `content-length` is not automatically set when `body` is a `fs.createReadStream`.
    */
    get body() {
        return this._internals.body;
    }
    set body(value) {
        assert.any([dist.string, dist.buffer, dist.nodeStream, dist.generator, dist.asyncGenerator, isFormData, dist.undefined], value);
        if (dist.nodeStream(value)) {
            assert.truthy(value.readable);
        }
        if (value !== undefined) {
            assert.undefined(this._internals.form);
            assert.undefined(this._internals.json);
        }
        this._internals.body = value;
    }
    /**
    The form body is converted to a query string using [`(new URLSearchParams(object)).toString()`](https://nodejs.org/api/url.html#url_constructor_new_urlsearchparams_obj).

    If the `Content-Type` header is not present, it will be set to `application/x-www-form-urlencoded`.

    __Note #1__: If you provide this option, `got.stream()` will be read-only.

    __Note #2__: This option is not enumerable and will not be merged with the instance defaults.
    */
    get form() {
        return this._internals.form;
    }
    set form(value) {
        assert.any([dist.plainObject, dist.undefined], value);
        if (value !== undefined) {
            assert.undefined(this._internals.body);
            assert.undefined(this._internals.json);
        }
        this._internals.form = value;
    }
    /**
    JSON body. If the `Content-Type` header is not set, it will be set to `application/json`.

    __Note #1__: If you provide this option, `got.stream()` will be read-only.

    __Note #2__: This option is not enumerable and will not be merged with the instance defaults.
    */
    get json() {
        return this._internals.json;
    }
    set json(value) {
        if (value !== undefined) {
            assert.undefined(this._internals.body);
            assert.undefined(this._internals.form);
        }
        this._internals.json = value;
    }
    /**
    The URL to request, as a string, a [`https.request` options object](https://nodejs.org/api/https.html#https_https_request_options_callback), or a [WHATWG `URL`](https://nodejs.org/api/url.html#url_class_url).

    Properties from `options` will override properties in the parsed `url`.

    If no protocol is specified, it will throw a `TypeError`.

    __Note__: The query string is **not** parsed as search params.

    @example
    ```
    await got('https://example.com/?query=a b'); //=> https://example.com/?query=a%20b
    await got('https://example.com/', {searchParams: {query: 'a b'}}); //=> https://example.com/?query=a+b

    // The query string is overridden by `searchParams`
    await got('https://example.com/?query=a b', {searchParams: {query: 'a b'}}); //=> https://example.com/?query=a+b
    ```
    */
    get url() {
        return this._internals.url;
    }
    set url(value) {
        assert.any([dist.string, dist.urlInstance, dist.undefined], value);
        if (value === undefined) {
            this._internals.url = undefined;
            return;
        }
        if (dist.string(value) && value.startsWith('/')) {
            throw new Error('`url` must not start with a slash');
        }
        const urlString = `${this.prefixUrl}${value.toString()}`;
        const url = new URL(urlString);
        this._internals.url = url;
        if (url.protocol === 'unix:') {
            url.href = `http://unix${url.pathname}${url.search}`;
        }
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            const error = new Error(`Unsupported protocol: ${url.protocol}`);
            error.code = 'ERR_UNSUPPORTED_PROTOCOL';
            throw error;
        }
        if (this._internals.username) {
            url.username = this._internals.username;
            this._internals.username = '';
        }
        if (this._internals.password) {
            url.password = this._internals.password;
            this._internals.password = '';
        }
        if (this._internals.searchParams) {
            url.search = this._internals.searchParams.toString();
            this._internals.searchParams = undefined;
        }
        if (url.hostname === 'unix') {
            if (!this._internals.enableUnixSockets) {
                throw new Error('Using UNIX domain sockets but option `enableUnixSockets` is not enabled');
            }
            const matches = /(?<socketPath>.+?):(?<path>.+)/.exec(`${url.pathname}${url.search}`);
            if (matches?.groups) {
                const { socketPath, path } = matches.groups;
                this._unixOptions = {
                    socketPath,
                    path,
                    host: '',
                };
            }
            else {
                this._unixOptions = undefined;
            }
            return;
        }
        this._unixOptions = undefined;
    }
    /**
    Cookie support. You don't have to care about parsing or how to store them.

    __Note__: If you provide this option, `options.headers.cookie` will be overridden.
    */
    get cookieJar() {
        return this._internals.cookieJar;
    }
    set cookieJar(value) {
        assert.any([dist.object, dist.undefined], value);
        if (value === undefined) {
            this._internals.cookieJar = undefined;
            return;
        }
        let { setCookie, getCookieString } = value;
        assert.function_(setCookie);
        assert.function_(getCookieString);
        /* istanbul ignore next: Horrible `tough-cookie` v3 check */
        if (setCookie.length === 4 && getCookieString.length === 0) {
            setCookie = (0,external_node_util_namespaceObject.promisify)(setCookie.bind(value));
            getCookieString = (0,external_node_util_namespaceObject.promisify)(getCookieString.bind(value));
            this._internals.cookieJar = {
                setCookie,
                getCookieString: getCookieString,
            };
        }
        else {
            this._internals.cookieJar = value;
        }
    }
    /**
    You can abort the `request` using [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

    @example
    ```
    import got from 'got';

    const abortController = new AbortController();

    const request = got('https://httpbin.org/anything', {
        signal: abortController.signal
    });

    setTimeout(() => {
        abortController.abort();
    }, 100);
    ```
    */
    get signal() {
        return this._internals.signal;
    }
    set signal(value) {
        assert.object(value);
        this._internals.signal = value;
    }
    /**
    Ignore invalid cookies instead of throwing an error.
    Only useful when the `cookieJar` option has been set. Not recommended.

    @default false
    */
    get ignoreInvalidCookies() {
        return this._internals.ignoreInvalidCookies;
    }
    set ignoreInvalidCookies(value) {
        assert.boolean(value);
        this._internals.ignoreInvalidCookies = value;
    }
    /**
    Query string that will be added to the request URL.
    This will override the query string in `url`.

    If you need to pass in an array, you can do it using a `URLSearchParams` instance.

    @example
    ```
    import got from 'got';

    const searchParams = new URLSearchParams([['key', 'a'], ['key', 'b']]);

    await got('https://example.com', {searchParams});

    console.log(searchParams.toString());
    //=> 'key=a&key=b'
    ```
    */
    get searchParams() {
        if (this._internals.url) {
            return this._internals.url.searchParams;
        }
        if (this._internals.searchParams === undefined) {
            this._internals.searchParams = new URLSearchParams();
        }
        return this._internals.searchParams;
    }
    set searchParams(value) {
        assert.any([dist.string, dist.object, dist.undefined], value);
        const url = this._internals.url;
        if (value === undefined) {
            this._internals.searchParams = undefined;
            if (url) {
                url.search = '';
            }
            return;
        }
        const searchParameters = this.searchParams;
        let updated;
        if (dist.string(value)) {
            updated = new URLSearchParams(value);
        }
        else if (value instanceof URLSearchParams) {
            updated = value;
        }
        else {
            validateSearchParameters(value);
            updated = new URLSearchParams();
            // eslint-disable-next-line guard-for-in
            for (const key in value) {
                const entry = value[key];
                if (entry === null) {
                    updated.append(key, '');
                }
                else if (entry === undefined) {
                    searchParameters.delete(key);
                }
                else {
                    updated.append(key, entry);
                }
            }
        }
        if (this._merging) {
            // These keys will be replaced
            for (const key of updated.keys()) {
                searchParameters.delete(key);
            }
            for (const [key, value] of updated) {
                searchParameters.append(key, value);
            }
        }
        else if (url) {
            url.search = searchParameters.toString();
        }
        else {
            this._internals.searchParams = searchParameters;
        }
    }
    get searchParameters() {
        throw new Error('The `searchParameters` option does not exist. Use `searchParams` instead.');
    }
    set searchParameters(_value) {
        throw new Error('The `searchParameters` option does not exist. Use `searchParams` instead.');
    }
    get dnsLookup() {
        return this._internals.dnsLookup;
    }
    set dnsLookup(value) {
        assert.any([dist.function_, dist.undefined], value);
        this._internals.dnsLookup = value;
    }
    /**
    An instance of [`CacheableLookup`](https://github.com/szmarczak/cacheable-lookup) used for making DNS lookups.
    Useful when making lots of requests to different *public* hostnames.

    `CacheableLookup` uses `dns.resolver4(..)` and `dns.resolver6(...)` under the hood and fall backs to `dns.lookup(...)` when the first two fail, which may lead to additional delay.

    __Note__: This should stay disabled when making requests to internal hostnames such as `localhost`, `database.local` etc.

    @default false
    */
    get dnsCache() {
        return this._internals.dnsCache;
    }
    set dnsCache(value) {
        assert.any([dist.object, dist.boolean, dist.undefined], value);
        if (value === true) {
            this._internals.dnsCache = getGlobalDnsCache();
        }
        else if (value === false) {
            this._internals.dnsCache = undefined;
        }
        else {
            this._internals.dnsCache = value;
        }
    }
    /**
    User data. `context` is shallow merged and enumerable. If it contains non-enumerable properties they will NOT be merged.

    @example
    ```
    import got from 'got';

    const instance = got.extend({
        hooks: {
            beforeRequest: [
                options => {
                    if (!options.context || !options.context.token) {
                        throw new Error('Token required');
                    }

                    options.headers.token = options.context.token;
                }
            ]
        }
    });

    const context = {
        token: 'secret'
    };

    const response = await instance('https://httpbin.org/headers', {context});

    // Let's see the headers
    console.log(response.body);
    ```
    */
    get context() {
        return this._internals.context;
    }
    set context(value) {
        assert.object(value);
        if (this._merging) {
            Object.assign(this._internals.context, value);
        }
        else {
            this._internals.context = { ...value };
        }
    }
    /**
    Hooks allow modifications during the request lifecycle.
    Hook functions may be async and are run serially.
    */
    get hooks() {
        return this._internals.hooks;
    }
    set hooks(value) {
        assert.object(value);
        // eslint-disable-next-line guard-for-in
        for (const knownHookEvent in value) {
            if (!(knownHookEvent in this._internals.hooks)) {
                throw new Error(`Unexpected hook event: ${knownHookEvent}`);
            }
            const typedKnownHookEvent = knownHookEvent;
            const hooks = value[typedKnownHookEvent];
            assert.any([dist.array, dist.undefined], hooks);
            if (hooks) {
                for (const hook of hooks) {
                    assert.function_(hook);
                }
            }
            if (this._merging) {
                if (hooks) {
                    // @ts-expect-error FIXME
                    this._internals.hooks[typedKnownHookEvent].push(...hooks);
                }
            }
            else {
                if (!hooks) {
                    throw new Error(`Missing hook event: ${knownHookEvent}`);
                }
                // @ts-expect-error FIXME
                this._internals.hooks[knownHookEvent] = [...hooks];
            }
        }
    }
    /**
    Defines if redirect responses should be followed automatically.

    Note that if a `303` is sent by the server in response to any request type (`POST`, `DELETE`, etc.), Got will automatically request the resource pointed to in the location header via `GET`.
    This is in accordance with [the spec](https://tools.ietf.org/html/rfc7231#section-6.4.4). You can optionally turn on this behavior also for other redirect codes - see `methodRewriting`.

    @default true
    */
    get followRedirect() {
        return this._internals.followRedirect;
    }
    set followRedirect(value) {
        assert.boolean(value);
        this._internals.followRedirect = value;
    }
    get followRedirects() {
        throw new TypeError('The `followRedirects` option does not exist. Use `followRedirect` instead.');
    }
    set followRedirects(_value) {
        throw new TypeError('The `followRedirects` option does not exist. Use `followRedirect` instead.');
    }
    /**
    If exceeded, the request will be aborted and a `MaxRedirectsError` will be thrown.

    @default 10
    */
    get maxRedirects() {
        return this._internals.maxRedirects;
    }
    set maxRedirects(value) {
        assert.number(value);
        this._internals.maxRedirects = value;
    }
    /**
    A cache adapter instance for storing cached response data.

    @default false
    */
    get cache() {
        return this._internals.cache;
    }
    set cache(value) {
        assert.any([dist.object, dist.string, dist.boolean, dist.undefined], value);
        if (value === true) {
            this._internals.cache = globalCache;
        }
        else if (value === false) {
            this._internals.cache = undefined;
        }
        else {
            this._internals.cache = value;
        }
    }
    /**
    Determines if a `got.HTTPError` is thrown for unsuccessful responses.

    If this is disabled, requests that encounter an error status code will be resolved with the `response` instead of throwing.
    This may be useful if you are checking for resource availability and are expecting error responses.

    @default true
    */
    get throwHttpErrors() {
        return this._internals.throwHttpErrors;
    }
    set throwHttpErrors(value) {
        assert.boolean(value);
        this._internals.throwHttpErrors = value;
    }
    get username() {
        const url = this._internals.url;
        const value = url ? url.username : this._internals.username;
        return decodeURIComponent(value);
    }
    set username(value) {
        assert.string(value);
        const url = this._internals.url;
        const fixedValue = encodeURIComponent(value);
        if (url) {
            url.username = fixedValue;
        }
        else {
            this._internals.username = fixedValue;
        }
    }
    get password() {
        const url = this._internals.url;
        const value = url ? url.password : this._internals.password;
        return decodeURIComponent(value);
    }
    set password(value) {
        assert.string(value);
        const url = this._internals.url;
        const fixedValue = encodeURIComponent(value);
        if (url) {
            url.password = fixedValue;
        }
        else {
            this._internals.password = fixedValue;
        }
    }
    /**
    If set to `true`, Got will additionally accept HTTP2 requests.

    It will choose either HTTP/1.1 or HTTP/2 depending on the ALPN protocol.

    __Note__: This option requires Node.js 15.10.0 or newer as HTTP/2 support on older Node.js versions is very buggy.

    __Note__: Overriding `options.request` will disable HTTP2 support.

    @default false

    @example
    ```
    import got from 'got';

    const {headers} = await got('https://nghttp2.org/httpbin/anything', {http2: true});

    console.log(headers.via);
    //=> '2 nghttpx'
    ```
    */
    get http2() {
        return this._internals.http2;
    }
    set http2(value) {
        assert.boolean(value);
        this._internals.http2 = value;
    }
    /**
    Set this to `true` to allow sending body for the `GET` method.
    However, the [HTTP/2 specification](https://tools.ietf.org/html/rfc7540#section-8.1.3) says that `An HTTP GET request includes request header fields and no payload body`, therefore when using the HTTP/2 protocol this option will have no effect.
    This option is only meant to interact with non-compliant servers when you have no other choice.

    __Note__: The [RFC 7231](https://tools.ietf.org/html/rfc7231#section-4.3.1) doesn't specify any particular behavior for the GET method having a payload, therefore __it's considered an [anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern)__.

    @default false
    */
    get allowGetBody() {
        return this._internals.allowGetBody;
    }
    set allowGetBody(value) {
        assert.boolean(value);
        this._internals.allowGetBody = value;
    }
    /**
    Request headers.

    Existing headers will be overwritten. Headers set to `undefined` will be omitted.

    @default {}
    */
    get headers() {
        return this._internals.headers;
    }
    set headers(value) {
        assert.plainObject(value);
        if (this._merging) {
            Object.assign(this._internals.headers, lowercaseKeys(value));
        }
        else {
            this._internals.headers = lowercaseKeys(value);
        }
    }
    /**
    Specifies if the HTTP request method should be [rewritten as `GET`](https://tools.ietf.org/html/rfc7231#section-6.4) on redirects.

    As the [specification](https://tools.ietf.org/html/rfc7231#section-6.4) prefers to rewrite the HTTP method only on `303` responses, this is Got's default behavior.
    Setting `methodRewriting` to `true` will also rewrite `301` and `302` responses, as allowed by the spec. This is the behavior followed by `curl` and browsers.

    __Note__: Got never performs method rewriting on `307` and `308` responses, as this is [explicitly prohibited by the specification](https://www.rfc-editor.org/rfc/rfc7231#section-6.4.7).

    @default false
    */
    get methodRewriting() {
        return this._internals.methodRewriting;
    }
    set methodRewriting(value) {
        assert.boolean(value);
        this._internals.methodRewriting = value;
    }
    /**
    Indicates which DNS record family to use.

    Values:
    - `undefined`: IPv4 (if present) or IPv6
    - `4`: Only IPv4
    - `6`: Only IPv6

    @default undefined
    */
    get dnsLookupIpVersion() {
        return this._internals.dnsLookupIpVersion;
    }
    set dnsLookupIpVersion(value) {
        if (value !== undefined && value !== 4 && value !== 6) {
            throw new TypeError(`Invalid DNS lookup IP version: ${value}`);
        }
        this._internals.dnsLookupIpVersion = value;
    }
    /**
    A function used to parse JSON responses.

    @example
    ```
    import got from 'got';
    import Bourne from '@hapi/bourne';

    const parsed = await got('https://example.com', {
        parseJson: text => Bourne.parse(text)
    }).json();

    console.log(parsed);
    ```
    */
    get parseJson() {
        return this._internals.parseJson;
    }
    set parseJson(value) {
        assert.function_(value);
        this._internals.parseJson = value;
    }
    /**
    A function used to stringify the body of JSON requests.

    @example
    ```
    import got from 'got';

    await got.post('https://example.com', {
        stringifyJson: object => JSON.stringify(object, (key, value) => {
            if (key.startsWith('_')) {
                return;
            }

            return value;
        }),
        json: {
            some: 'payload',
            _ignoreMe: 1234
        }
    });
    ```

    @example
    ```
    import got from 'got';

    await got.post('https://example.com', {
        stringifyJson: object => JSON.stringify(object, (key, value) => {
            if (typeof value === 'number') {
                return value.toString();
            }

            return value;
        }),
        json: {
            some: 'payload',
            number: 1
        }
    });
    ```
    */
    get stringifyJson() {
        return this._internals.stringifyJson;
    }
    set stringifyJson(value) {
        assert.function_(value);
        this._internals.stringifyJson = value;
    }
    /**
    An object representing `limit`, `calculateDelay`, `methods`, `statusCodes`, `maxRetryAfter` and `errorCodes` fields for maximum retry count, retry handler, allowed methods, allowed status codes, maximum [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) time and allowed error codes.

    Delays between retries counts with function `1000 * Math.pow(2, retry) + Math.random() * 100`, where `retry` is attempt number (starts from 1).

    The `calculateDelay` property is a `function` that receives an object with `attemptCount`, `retryOptions`, `error` and `computedValue` properties for current retry count, the retry options, error and default computed value.
    The function must return a delay in milliseconds (or a Promise resolving with it) (`0` return value cancels retry).

    By default, it retries *only* on the specified methods, status codes, and on these network errors:

    - `ETIMEDOUT`: One of the [timeout](#timeout) limits were reached.
    - `ECONNRESET`: Connection was forcibly closed by a peer.
    - `EADDRINUSE`: Could not bind to any free port.
    - `ECONNREFUSED`: Connection was refused by the server.
    - `EPIPE`: The remote side of the stream being written has been closed.
    - `ENOTFOUND`: Couldn't resolve the hostname to an IP address.
    - `ENETUNREACH`: No internet connection.
    - `EAI_AGAIN`: DNS lookup timed out.

    __Note__: If `maxRetryAfter` is set to `undefined`, it will use `options.timeout`.
    __Note__: If [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header is greater than `maxRetryAfter`, it will cancel the request.
    */
    get retry() {
        return this._internals.retry;
    }
    set retry(value) {
        assert.plainObject(value);
        assert.any([dist.function_, dist.undefined], value.calculateDelay);
        assert.any([dist.number, dist.undefined], value.maxRetryAfter);
        assert.any([dist.number, dist.undefined], value.limit);
        assert.any([dist.array, dist.undefined], value.methods);
        assert.any([dist.array, dist.undefined], value.statusCodes);
        assert.any([dist.array, dist.undefined], value.errorCodes);
        assert.any([dist.number, dist.undefined], value.noise);
        if (value.noise && Math.abs(value.noise) > 100) {
            throw new Error(`The maximum acceptable retry noise is +/- 100ms, got ${value.noise}`);
        }
        for (const key in value) {
            if (!(key in this._internals.retry)) {
                throw new Error(`Unexpected retry option: ${key}`);
            }
        }
        if (this._merging) {
            Object.assign(this._internals.retry, value);
        }
        else {
            this._internals.retry = { ...value };
        }
        const { retry } = this._internals;
        retry.methods = [...new Set(retry.methods.map(method => method.toUpperCase()))];
        retry.statusCodes = [...new Set(retry.statusCodes)];
        retry.errorCodes = [...new Set(retry.errorCodes)];
    }
    /**
    From `http.RequestOptions`.

    The IP address used to send the request from.
    */
    get localAddress() {
        return this._internals.localAddress;
    }
    set localAddress(value) {
        assert.any([dist.string, dist.undefined], value);
        this._internals.localAddress = value;
    }
    /**
    The HTTP method used to make the request.

    @default 'GET'
    */
    get method() {
        return this._internals.method;
    }
    set method(value) {
        assert.string(value);
        this._internals.method = value.toUpperCase();
    }
    get createConnection() {
        return this._internals.createConnection;
    }
    set createConnection(value) {
        assert.any([dist.function_, dist.undefined], value);
        this._internals.createConnection = value;
    }
    /**
    From `http-cache-semantics`

    @default {}
    */
    get cacheOptions() {
        return this._internals.cacheOptions;
    }
    set cacheOptions(value) {
        assert.plainObject(value);
        assert.any([dist.boolean, dist.undefined], value.shared);
        assert.any([dist.number, dist.undefined], value.cacheHeuristic);
        assert.any([dist.number, dist.undefined], value.immutableMinTimeToLive);
        assert.any([dist.boolean, dist.undefined], value.ignoreCargoCult);
        for (const key in value) {
            if (!(key in this._internals.cacheOptions)) {
                throw new Error(`Cache option \`${key}\` does not exist`);
            }
        }
        if (this._merging) {
            Object.assign(this._internals.cacheOptions, value);
        }
        else {
            this._internals.cacheOptions = { ...value };
        }
    }
    /**
    Options for the advanced HTTPS API.
    */
    get https() {
        return this._internals.https;
    }
    set https(value) {
        assert.plainObject(value);
        assert.any([dist.boolean, dist.undefined], value.rejectUnauthorized);
        assert.any([dist.function_, dist.undefined], value.checkServerIdentity);
        assert.any([dist.string, dist.object, dist.array, dist.undefined], value.certificateAuthority);
        assert.any([dist.string, dist.object, dist.array, dist.undefined], value.key);
        assert.any([dist.string, dist.object, dist.array, dist.undefined], value.certificate);
        assert.any([dist.string, dist.undefined], value.passphrase);
        assert.any([dist.string, dist.buffer, dist.array, dist.undefined], value.pfx);
        assert.any([dist.array, dist.undefined], value.alpnProtocols);
        assert.any([dist.string, dist.undefined], value.ciphers);
        assert.any([dist.string, dist.buffer, dist.undefined], value.dhparam);
        assert.any([dist.string, dist.undefined], value.signatureAlgorithms);
        assert.any([dist.string, dist.undefined], value.minVersion);
        assert.any([dist.string, dist.undefined], value.maxVersion);
        assert.any([dist.boolean, dist.undefined], value.honorCipherOrder);
        assert.any([dist.number, dist.undefined], value.tlsSessionLifetime);
        assert.any([dist.string, dist.undefined], value.ecdhCurve);
        assert.any([dist.string, dist.buffer, dist.array, dist.undefined], value.certificateRevocationLists);
        for (const key in value) {
            if (!(key in this._internals.https)) {
                throw new Error(`HTTPS option \`${key}\` does not exist`);
            }
        }
        if (this._merging) {
            Object.assign(this._internals.https, value);
        }
        else {
            this._internals.https = { ...value };
        }
    }
    /**
    [Encoding](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) to be used on `setEncoding` of the response data.

    To get a [`Buffer`](https://nodejs.org/api/buffer.html), you need to set `responseType` to `buffer` instead.
    Don't set this option to `null`.

    __Note__: This doesn't affect streams! Instead, you need to do `got.stream(...).setEncoding(encoding)`.

    @default 'utf-8'
    */
    get encoding() {
        return this._internals.encoding;
    }
    set encoding(value) {
        if (value === null) {
            throw new TypeError('To get a Buffer, set `options.responseType` to `buffer` instead');
        }
        assert.any([dist.string, dist.undefined], value);
        this._internals.encoding = value;
    }
    /**
    When set to `true` the promise will return the Response body instead of the Response object.

    @default false
    */
    get resolveBodyOnly() {
        return this._internals.resolveBodyOnly;
    }
    set resolveBodyOnly(value) {
        assert.boolean(value);
        this._internals.resolveBodyOnly = value;
    }
    /**
    Returns a `Stream` instead of a `Promise`.
    This is equivalent to calling `got.stream(url, options?)`.

    @default false
    */
    get isStream() {
        return this._internals.isStream;
    }
    set isStream(value) {
        assert.boolean(value);
        this._internals.isStream = value;
    }
    /**
    The parsing method.

    The promise also has `.text()`, `.json()` and `.buffer()` methods which return another Got promise for the parsed body.

    It's like setting the options to `{responseType: 'json', resolveBodyOnly: true}` but without affecting the main Got promise.

    __Note__: When using streams, this option is ignored.

    @example
    ```
    const responsePromise = got(url);
    const bufferPromise = responsePromise.buffer();
    const jsonPromise = responsePromise.json();

    const [response, buffer, json] = Promise.all([responsePromise, bufferPromise, jsonPromise]);
    // `response` is an instance of Got Response
    // `buffer` is an instance of Buffer
    // `json` is an object
    ```

    @example
    ```
    // This
    const body = await got(url).json();

    // is semantically the same as this
    const body = await got(url, {responseType: 'json', resolveBodyOnly: true});
    ```
    */
    get responseType() {
        return this._internals.responseType;
    }
    set responseType(value) {
        if (value === undefined) {
            this._internals.responseType = 'text';
            return;
        }
        if (value !== 'text' && value !== 'buffer' && value !== 'json') {
            throw new Error(`Invalid \`responseType\` option: ${value}`);
        }
        this._internals.responseType = value;
    }
    get pagination() {
        return this._internals.pagination;
    }
    set pagination(value) {
        assert.object(value);
        if (this._merging) {
            Object.assign(this._internals.pagination, value);
        }
        else {
            this._internals.pagination = value;
        }
    }
    get auth() {
        throw new Error('Parameter `auth` is deprecated. Use `username` / `password` instead.');
    }
    set auth(_value) {
        throw new Error('Parameter `auth` is deprecated. Use `username` / `password` instead.');
    }
    get setHost() {
        return this._internals.setHost;
    }
    set setHost(value) {
        assert.boolean(value);
        this._internals.setHost = value;
    }
    get maxHeaderSize() {
        return this._internals.maxHeaderSize;
    }
    set maxHeaderSize(value) {
        assert.any([dist.number, dist.undefined], value);
        this._internals.maxHeaderSize = value;
    }
    get enableUnixSockets() {
        return this._internals.enableUnixSockets;
    }
    set enableUnixSockets(value) {
        assert.boolean(value);
        this._internals.enableUnixSockets = value;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    toJSON() {
        return { ...this._internals };
    }
    [Symbol.for('nodejs.util.inspect.custom')](_depth, options) {
        return (0,external_node_util_namespaceObject.inspect)(this._internals, options);
    }
    createNativeRequestOptions() {
        const internals = this._internals;
        const url = internals.url;
        let agent;
        if (url.protocol === 'https:') {
            agent = internals.http2 ? internals.agent : internals.agent.https;
        }
        else {
            agent = internals.agent.http;
        }
        const { https } = internals;
        let { pfx } = https;
        if (dist.array(pfx) && dist.plainObject(pfx[0])) {
            pfx = pfx.map(object => ({
                buf: object.buffer,
                passphrase: object.passphrase,
            }));
        }
        return {
            ...internals.cacheOptions,
            ...this._unixOptions,
            // HTTPS options
            // eslint-disable-next-line @typescript-eslint/naming-convention
            ALPNProtocols: https.alpnProtocols,
            ca: https.certificateAuthority,
            cert: https.certificate,
            key: https.key,
            passphrase: https.passphrase,
            pfx: https.pfx,
            rejectUnauthorized: https.rejectUnauthorized,
            checkServerIdentity: https.checkServerIdentity ?? external_node_tls_namespaceObject.checkServerIdentity,
            ciphers: https.ciphers,
            honorCipherOrder: https.honorCipherOrder,
            minVersion: https.minVersion,
            maxVersion: https.maxVersion,
            sigalgs: https.signatureAlgorithms,
            sessionTimeout: https.tlsSessionLifetime,
            dhparam: https.dhparam,
            ecdhCurve: https.ecdhCurve,
            crl: https.certificateRevocationLists,
            // HTTP options
            lookup: internals.dnsLookup ?? internals.dnsCache?.lookup,
            family: internals.dnsLookupIpVersion,
            agent,
            setHost: internals.setHost,
            method: internals.method,
            maxHeaderSize: internals.maxHeaderSize,
            localAddress: internals.localAddress,
            headers: internals.headers,
            createConnection: internals.createConnection,
            timeout: internals.http2 ? getHttp2TimeoutOption(internals) : undefined,
            // HTTP/2 options
            h2session: internals.h2session,
        };
    }
    getRequestFunction() {
        const url = this._internals.url;
        const { request } = this._internals;
        if (!request && url) {
            return this.getFallbackRequestFunction();
        }
        return request;
    }
    getFallbackRequestFunction() {
        const url = this._internals.url;
        if (!url) {
            return;
        }
        if (url.protocol === 'https:') {
            if (this._internals.http2) {
                if (major < 15 || (major === 15 && minor < 10)) {
                    const error = new Error('To use the `http2` option, install Node.js 15.10.0 or above');
                    error.code = 'EUNSUPPORTED';
                    throw error;
                }
                return source.auto;
            }
            return external_node_https_namespaceObject.request;
        }
        return external_node_http_namespaceObject.request;
    }
    freeze() {
        const options = this._internals;
        Object.freeze(options);
        Object.freeze(options.hooks);
        Object.freeze(options.hooks.afterResponse);
        Object.freeze(options.hooks.beforeError);
        Object.freeze(options.hooks.beforeRedirect);
        Object.freeze(options.hooks.beforeRequest);
        Object.freeze(options.hooks.beforeRetry);
        Object.freeze(options.hooks.init);
        Object.freeze(options.https);
        Object.freeze(options.cacheOptions);
        Object.freeze(options.agent);
        Object.freeze(options.headers);
        Object.freeze(options.timeout);
        Object.freeze(options.retry);
        Object.freeze(options.retry.errorCodes);
        Object.freeze(options.retry.methods);
        Object.freeze(options.retry.statusCodes);
    }
}

;// CONCATENATED MODULE: external "node:events"
const external_node_events_namespaceObject = require("node:events");
;// CONCATENATED MODULE: ./node_modules/p-cancelable/index.js
class CancelError extends Error {
	constructor(reason) {
		super(reason || 'Promise was canceled');
		this.name = 'CancelError';
	}

	get isCanceled() {
		return true;
	}
}

// TODO: Use private class fields when ESLint 8 is out.

class PCancelable {
	static fn(userFunction) {
		return (...arguments_) => {
			return new PCancelable((resolve, reject, onCancel) => {
				arguments_.push(onCancel);
				// eslint-disable-next-line promise/prefer-await-to-then
				userFunction(...arguments_).then(resolve, reject);
			});
		};
	}

	constructor(executor) {
		this._cancelHandlers = [];
		this._isPending = true;
		this._isCanceled = false;
		this._rejectOnCancel = true;

		this._promise = new Promise((resolve, reject) => {
			this._reject = reject;

			const onResolve = value => {
				if (!this._isCanceled || !onCancel.shouldReject) {
					this._isPending = false;
					resolve(value);
				}
			};

			const onReject = error => {
				this._isPending = false;
				reject(error);
			};

			const onCancel = handler => {
				if (!this._isPending) {
					throw new Error('The `onCancel` handler was attached after the promise settled.');
				}

				this._cancelHandlers.push(handler);
			};

			Object.defineProperties(onCancel, {
				shouldReject: {
					get: () => this._rejectOnCancel,
					set: boolean => {
						this._rejectOnCancel = boolean;
					}
				}
			});

			executor(onResolve, onReject, onCancel);
		});
	}

	then(onFulfilled, onRejected) {
		// eslint-disable-next-line promise/prefer-await-to-then
		return this._promise.then(onFulfilled, onRejected);
	}

	catch(onRejected) {
		// eslint-disable-next-line promise/prefer-await-to-then
		return this._promise.catch(onRejected);
	}

	finally(onFinally) {
		// eslint-disable-next-line promise/prefer-await-to-then
		return this._promise.finally(onFinally);
	}

	cancel(reason) {
		if (!this._isPending || this._isCanceled) {
			return;
		}

		this._isCanceled = true;

		if (this._cancelHandlers.length > 0) {
			try {
				for (const handler of this._cancelHandlers) {
					handler();
				}
			} catch (error) {
				this._reject(error);
				return;
			}
		}

		if (this._rejectOnCancel) {
			this._reject(new CancelError(reason));
		}
	}

	get isCanceled() {
		return this._isCanceled;
	}
}

Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/errors.js

// A hacky check to prevent circular references.
function isRequest(x) {
    return dist.object(x) && '_onResponse' in x;
}
/**
An error to be thrown when a request fails.
Contains a `code` property with error class code, like `ECONNREFUSED`.
*/
class RequestError extends Error {
    constructor(message, error, self) {
        super(message);
        Object.defineProperty(this, "input", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "stack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "response", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "request", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Error.captureStackTrace(this, this.constructor);
        this.name = 'RequestError';
        this.code = error.code ?? 'ERR_GOT_REQUEST_ERROR';
        this.input = error.input;
        if (isRequest(self)) {
            Object.defineProperty(this, 'request', {
                enumerable: false,
                value: self,
            });
            Object.defineProperty(this, 'response', {
                enumerable: false,
                value: self.response,
            });
            this.options = self.options;
        }
        else {
            this.options = self;
        }
        this.timings = this.request?.timings;
        // Recover the original stacktrace
        if (dist.string(error.stack) && dist.string(this.stack)) {
            const indexOfMessage = this.stack.indexOf(this.message) + this.message.length;
            const thisStackTrace = this.stack.slice(indexOfMessage).split('\n').reverse();
            const errorStackTrace = error.stack.slice(error.stack.indexOf(error.message) + error.message.length).split('\n').reverse();
            // Remove duplicated traces
            while (errorStackTrace.length > 0 && errorStackTrace[0] === thisStackTrace[0]) {
                thisStackTrace.shift();
            }
            this.stack = `${this.stack.slice(0, indexOfMessage)}${thisStackTrace.reverse().join('\n')}${errorStackTrace.reverse().join('\n')}`;
        }
    }
}
/**
An error to be thrown when the server redirects you more than ten times.
Includes a `response` property.
*/
class MaxRedirectsError extends RequestError {
    constructor(request) {
        super(`Redirected ${request.options.maxRedirects} times. Aborting.`, {}, request);
        this.name = 'MaxRedirectsError';
        this.code = 'ERR_TOO_MANY_REDIRECTS';
    }
}
/**
An error to be thrown when the server response code is not 2xx nor 3xx if `options.followRedirect` is `true`, but always except for 304.
Includes a `response` property.
*/
// eslint-disable-next-line @typescript-eslint/naming-convention
class HTTPError extends RequestError {
    constructor(response) {
        super(`Response code ${response.statusCode} (${response.statusMessage})`, {}, response.request);
        this.name = 'HTTPError';
        this.code = 'ERR_NON_2XX_3XX_RESPONSE';
    }
}
/**
An error to be thrown when a cache method fails.
For example, if the database goes down or there's a filesystem error.
*/
class CacheError extends RequestError {
    constructor(error, request) {
        super(error.message, error, request);
        this.name = 'CacheError';
        this.code = this.code === 'ERR_GOT_REQUEST_ERROR' ? 'ERR_CACHE_ACCESS' : this.code;
    }
}
/**
An error to be thrown when the request body is a stream and an error occurs while reading from that stream.
*/
class UploadError extends RequestError {
    constructor(error, request) {
        super(error.message, error, request);
        this.name = 'UploadError';
        this.code = this.code === 'ERR_GOT_REQUEST_ERROR' ? 'ERR_UPLOAD' : this.code;
    }
}
/**
An error to be thrown when the request is aborted due to a timeout.
Includes an `event` and `timings` property.
*/
class TimeoutError extends RequestError {
    constructor(error, timings, request) {
        super(error.message, error, request);
        Object.defineProperty(this, "timings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "event", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = 'TimeoutError';
        this.event = error.event;
        this.timings = timings;
    }
}
/**
An error to be thrown when reading from response stream fails.
*/
class ReadError extends RequestError {
    constructor(error, request) {
        super(error.message, error, request);
        this.name = 'ReadError';
        this.code = this.code === 'ERR_GOT_REQUEST_ERROR' ? 'ERR_READING_RESPONSE_STREAM' : this.code;
    }
}
/**
An error which always triggers a new retry when thrown.
*/
class RetryError extends RequestError {
    constructor(request) {
        super('Retrying', {}, request);
        this.name = 'RetryError';
        this.code = 'ERR_RETRYING';
    }
}
/**
An error to be thrown when the request is aborted by AbortController.
*/
class AbortError extends RequestError {
    constructor(request) {
        super('This operation was aborted.', {}, request);
        this.code = 'ERR_ABORTED';
        this.name = 'AbortError';
    }
}

;// CONCATENATED MODULE: external "node:buffer"
const external_node_buffer_namespaceObject = require("node:buffer");
;// CONCATENATED MODULE: external "node:stream"
const external_node_stream_namespaceObject = require("node:stream");
// EXTERNAL MODULE: external "events"
var external_events_ = __nccwpck_require__(2361);
// EXTERNAL MODULE: external "util"
var external_util_ = __nccwpck_require__(3837);
// EXTERNAL MODULE: ./node_modules/defer-to-connect/dist/source/index.js
var dist_source = __nccwpck_require__(6214);
;// CONCATENATED MODULE: ./node_modules/@szmarczak/http-timer/dist/source/index.js



const timer = (request) => {
    if (request.timings) {
        return request.timings;
    }
    const timings = {
        start: Date.now(),
        socket: undefined,
        lookup: undefined,
        connect: undefined,
        secureConnect: undefined,
        upload: undefined,
        response: undefined,
        end: undefined,
        error: undefined,
        abort: undefined,
        phases: {
            wait: undefined,
            dns: undefined,
            tcp: undefined,
            tls: undefined,
            request: undefined,
            firstByte: undefined,
            download: undefined,
            total: undefined,
        },
    };
    request.timings = timings;
    const handleError = (origin) => {
        origin.once(external_events_.errorMonitor, () => {
            timings.error = Date.now();
            timings.phases.total = timings.error - timings.start;
        });
    };
    handleError(request);
    const onAbort = () => {
        timings.abort = Date.now();
        timings.phases.total = timings.abort - timings.start;
    };
    request.prependOnceListener('abort', onAbort);
    const onSocket = (socket) => {
        timings.socket = Date.now();
        timings.phases.wait = timings.socket - timings.start;
        if (external_util_.types.isProxy(socket)) {
            return;
        }
        const lookupListener = () => {
            timings.lookup = Date.now();
            timings.phases.dns = timings.lookup - timings.socket;
        };
        socket.prependOnceListener('lookup', lookupListener);
        dist_source(socket, {
            connect: () => {
                timings.connect = Date.now();
                if (timings.lookup === undefined) {
                    socket.removeListener('lookup', lookupListener);
                    timings.lookup = timings.connect;
                    timings.phases.dns = timings.lookup - timings.socket;
                }
                timings.phases.tcp = timings.connect - timings.lookup;
            },
            secureConnect: () => {
                timings.secureConnect = Date.now();
                timings.phases.tls = timings.secureConnect - timings.connect;
            },
        });
    };
    if (request.socket) {
        onSocket(request.socket);
    }
    else {
        request.prependOnceListener('socket', onSocket);
    }
    const onUpload = () => {
        timings.upload = Date.now();
        timings.phases.request = timings.upload - (timings.secureConnect ?? timings.connect);
    };
    if (request.writableFinished) {
        onUpload();
    }
    else {
        request.prependOnceListener('finish', onUpload);
    }
    request.prependOnceListener('response', (response) => {
        timings.response = Date.now();
        timings.phases.firstByte = timings.response - timings.upload;
        response.timings = timings;
        handleError(response);
        response.prependOnceListener('end', () => {
            request.off('abort', onAbort);
            response.off('aborted', onAbort);
            if (timings.phases.total) {
                // Aborted or errored
                return;
            }
            timings.end = Date.now();
            timings.phases.download = timings.end - timings.response;
            timings.phases.total = timings.end - timings.start;
        });
        response.prependOnceListener('aborted', onAbort);
    });
    return timings;
};
/* harmony default export */ const http_timer_dist_source = (timer);

;// CONCATENATED MODULE: external "node:url"
const external_node_url_namespaceObject = require("node:url");
;// CONCATENATED MODULE: external "node:crypto"
const external_node_crypto_namespaceObject = require("node:crypto");
;// CONCATENATED MODULE: ./node_modules/normalize-url/index.js
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
const DATA_URL_DEFAULT_MIME_TYPE = 'text/plain';
const DATA_URL_DEFAULT_CHARSET = 'us-ascii';

const testParameter = (name, filters) => filters.some(filter => filter instanceof RegExp ? filter.test(name) : filter === name);

const supportedProtocols = new Set([
	'https:',
	'http:',
	'file:',
]);

const hasCustomProtocol = urlString => {
	try {
		const {protocol} = new URL(urlString);
		return protocol.endsWith(':') && !supportedProtocols.has(protocol);
	} catch {
		return false;
	}
};

const normalizeDataURL = (urlString, {stripHash}) => {
	const match = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(urlString);

	if (!match) {
		throw new Error(`Invalid URL: ${urlString}`);
	}

	let {type, data, hash} = match.groups;
	const mediaType = type.split(';');
	hash = stripHash ? '' : hash;

	let isBase64 = false;
	if (mediaType[mediaType.length - 1] === 'base64') {
		mediaType.pop();
		isBase64 = true;
	}

	// Lowercase MIME type
	const mimeType = mediaType.shift()?.toLowerCase() ?? '';
	const attributes = mediaType
		.map(attribute => {
			let [key, value = ''] = attribute.split('=').map(string => string.trim());

			// Lowercase `charset`
			if (key === 'charset') {
				value = value.toLowerCase();

				if (value === DATA_URL_DEFAULT_CHARSET) {
					return '';
				}
			}

			return `${key}${value ? `=${value}` : ''}`;
		})
		.filter(Boolean);

	const normalizedMediaType = [
		...attributes,
	];

	if (isBase64) {
		normalizedMediaType.push('base64');
	}

	if (normalizedMediaType.length > 0 || (mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE)) {
		normalizedMediaType.unshift(mimeType);
	}

	return `data:${normalizedMediaType.join(';')},${isBase64 ? data.trim() : data}${hash ? `#${hash}` : ''}`;
};

function normalizeUrl(urlString, options) {
	options = {
		defaultProtocol: 'http',
		normalizeProtocol: true,
		forceHttp: false,
		forceHttps: false,
		stripAuthentication: true,
		stripHash: false,
		stripTextFragment: true,
		stripWWW: true,
		removeQueryParameters: [/^utm_\w+/i],
		removeTrailingSlash: true,
		removeSingleSlash: true,
		removeDirectoryIndex: false,
		removeExplicitPort: false,
		sortQueryParameters: true,
		...options,
	};

	// Legacy: Append `:` to the protocol if missing.
	if (typeof options.defaultProtocol === 'string' && !options.defaultProtocol.endsWith(':')) {
		options.defaultProtocol = `${options.defaultProtocol}:`;
	}

	urlString = urlString.trim();

	// Data URL
	if (/^data:/i.test(urlString)) {
		return normalizeDataURL(urlString, options);
	}

	if (hasCustomProtocol(urlString)) {
		return urlString;
	}

	const hasRelativeProtocol = urlString.startsWith('//');
	const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);

	// Prepend protocol
	if (!isRelativeUrl) {
		urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
	}

	const urlObject = new URL(urlString);

	if (options.forceHttp && options.forceHttps) {
		throw new Error('The `forceHttp` and `forceHttps` options cannot be used together');
	}

	if (options.forceHttp && urlObject.protocol === 'https:') {
		urlObject.protocol = 'http:';
	}

	if (options.forceHttps && urlObject.protocol === 'http:') {
		urlObject.protocol = 'https:';
	}

	// Remove auth
	if (options.stripAuthentication) {
		urlObject.username = '';
		urlObject.password = '';
	}

	// Remove hash
	if (options.stripHash) {
		urlObject.hash = '';
	} else if (options.stripTextFragment) {
		urlObject.hash = urlObject.hash.replace(/#?:~:text.*?$/i, '');
	}

	// Remove duplicate slashes if not preceded by a protocol
	// NOTE: This could be implemented using a single negative lookbehind
	// regex, but we avoid that to maintain compatibility with older js engines
	// which do not have support for that feature.
	if (urlObject.pathname) {
		// TODO: Replace everything below with `urlObject.pathname = urlObject.pathname.replace(/(?<!\b[a-z][a-z\d+\-.]{1,50}:)\/{2,}/g, '/');` when Safari supports negative lookbehind.

		// Split the string by occurrences of this protocol regex, and perform
		// duplicate-slash replacement on the strings between those occurrences
		// (if any).
		const protocolRegex = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;

		let lastIndex = 0;
		let result = '';
		for (;;) {
			const match = protocolRegex.exec(urlObject.pathname);
			if (!match) {
				break;
			}

			const protocol = match[0];
			const protocolAtIndex = match.index;
			const intermediate = urlObject.pathname.slice(lastIndex, protocolAtIndex);

			result += intermediate.replace(/\/{2,}/g, '/');
			result += protocol;
			lastIndex = protocolAtIndex + protocol.length;
		}

		const remnant = urlObject.pathname.slice(lastIndex, urlObject.pathname.length);
		result += remnant.replace(/\/{2,}/g, '/');

		urlObject.pathname = result;
	}

	// Decode URI octets
	if (urlObject.pathname) {
		try {
			urlObject.pathname = decodeURI(urlObject.pathname);
		} catch {}
	}

	// Remove directory index
	if (options.removeDirectoryIndex === true) {
		options.removeDirectoryIndex = [/^index\.[a-z]+$/];
	}

	if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
		let pathComponents = urlObject.pathname.split('/');
		const lastComponent = pathComponents[pathComponents.length - 1];

		if (testParameter(lastComponent, options.removeDirectoryIndex)) {
			pathComponents = pathComponents.slice(0, -1);
			urlObject.pathname = pathComponents.slice(1).join('/') + '/';
		}
	}

	if (urlObject.hostname) {
		// Remove trailing dot
		urlObject.hostname = urlObject.hostname.replace(/\.$/, '');

		// Remove `www.`
		if (options.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(urlObject.hostname)) {
			// Each label should be max 63 at length (min: 1).
			// Source: https://en.wikipedia.org/wiki/Hostname#Restrictions_on_valid_host_names
			// Each TLD should be up to 63 characters long (min: 2).
			// It is technically possible to have a single character TLD, but none currently exist.
			urlObject.hostname = urlObject.hostname.replace(/^www\./, '');
		}
	}

	// Remove query unwanted parameters
	if (Array.isArray(options.removeQueryParameters)) {
		// eslint-disable-next-line unicorn/no-useless-spread -- We are intentionally spreading to get a copy.
		for (const key of [...urlObject.searchParams.keys()]) {
			if (testParameter(key, options.removeQueryParameters)) {
				urlObject.searchParams.delete(key);
			}
		}
	}

	if (!Array.isArray(options.keepQueryParameters) && options.removeQueryParameters === true) {
		urlObject.search = '';
	}

	// Keep wanted query parameters
	if (Array.isArray(options.keepQueryParameters) && options.keepQueryParameters.length > 0) {
		// eslint-disable-next-line unicorn/no-useless-spread -- We are intentionally spreading to get a copy.
		for (const key of [...urlObject.searchParams.keys()]) {
			if (!testParameter(key, options.keepQueryParameters)) {
				urlObject.searchParams.delete(key);
			}
		}
	}

	// Sort query parameters
	if (options.sortQueryParameters) {
		urlObject.searchParams.sort();

		// Calling `.sort()` encodes the search parameters, so we need to decode them again.
		try {
			urlObject.search = decodeURIComponent(urlObject.search);
		} catch {}
	}

	if (options.removeTrailingSlash) {
		urlObject.pathname = urlObject.pathname.replace(/\/$/, '');
	}

	// Remove an explicit port number, excluding a default port number, if applicable
	if (options.removeExplicitPort && urlObject.port) {
		urlObject.port = '';
	}

	const oldUrlString = urlString;

	// Take advantage of many of the Node `url` normalizations
	urlString = urlObject.toString();

	if (!options.removeSingleSlash && urlObject.pathname === '/' && !oldUrlString.endsWith('/') && urlObject.hash === '') {
		urlString = urlString.replace(/\/$/, '');
	}

	// Remove ending `/` unless removeSingleSlash is false
	if ((options.removeTrailingSlash || urlObject.pathname === '/') && urlObject.hash === '' && options.removeSingleSlash) {
		urlString = urlString.replace(/\/$/, '');
	}

	// Restore relative protocol, if applicable
	if (hasRelativeProtocol && !options.normalizeProtocol) {
		urlString = urlString.replace(/^http:\/\//, '//');
	}

	// Remove http/https
	if (options.stripProtocol) {
		urlString = urlString.replace(/^(?:https?:)?\/\//, '');
	}

	return urlString;
}

// EXTERNAL MODULE: ./node_modules/get-stream/index.js
var get_stream = __nccwpck_require__(1766);
// EXTERNAL MODULE: ./node_modules/http-cache-semantics/index.js
var http_cache_semantics = __nccwpck_require__(1002);
;// CONCATENATED MODULE: ./node_modules/responselike/index.js



class Response extends external_node_stream_namespaceObject.Readable {
	statusCode;
	headers;
	body;
	url;

	constructor({statusCode, headers, body, url}) {
		if (typeof statusCode !== 'number') {
			throw new TypeError('Argument `statusCode` should be a number');
		}

		if (typeof headers !== 'object') {
			throw new TypeError('Argument `headers` should be an object');
		}

		if (!(body instanceof Uint8Array)) {
			throw new TypeError('Argument `body` should be a buffer');
		}

		if (typeof url !== 'string') {
			throw new TypeError('Argument `url` should be a string');
		}

		super({
			read() {
				this.push(body);
				this.push(null);
			},
		});

		this.statusCode = statusCode;
		this.headers = lowercaseKeys(headers);
		this.body = body;
		this.url = url;
	}
}

// EXTERNAL MODULE: ./node_modules/keyv/src/index.js
var src = __nccwpck_require__(1531);
;// CONCATENATED MODULE: ./node_modules/mimic-response/index.js
// We define these manually to ensure they're always copied
// even if they would move up the prototype chain
// https://nodejs.org/api/http.html#http_class_http_incomingmessage
const knownProperties = [
	'aborted',
	'complete',
	'headers',
	'httpVersion',
	'httpVersionMinor',
	'httpVersionMajor',
	'method',
	'rawHeaders',
	'rawTrailers',
	'setTimeout',
	'socket',
	'statusCode',
	'statusMessage',
	'trailers',
	'url',
];

function mimicResponse(fromStream, toStream) {
	if (toStream._readableState.autoDestroy) {
		throw new Error('The second stream must have the `autoDestroy` option set to `false`');
	}

	const fromProperties = new Set([...Object.keys(fromStream), ...knownProperties]);

	const properties = {};

	for (const property of fromProperties) {
		// Don't overwrite existing properties.
		if (property in toStream) {
			continue;
		}

		properties[property] = {
			get() {
				const value = fromStream[property];
				const isFunction = typeof value === 'function';

				return isFunction ? value.bind(fromStream) : value;
			},
			set(value) {
				fromStream[property] = value;
			},
			enumerable: true,
			configurable: false,
		};
	}

	Object.defineProperties(toStream, properties);

	fromStream.once('aborted', () => {
		toStream.destroy();

		toStream.emit('aborted');
	});

	fromStream.once('close', () => {
		if (fromStream.complete) {
			if (toStream.readable) {
				toStream.once('end', () => {
					toStream.emit('close');
				});
			} else {
				toStream.emit('close');
			}
		} else {
			toStream.emit('close');
		}
	});

	return toStream;
}

;// CONCATENATED MODULE: ./node_modules/cacheable-request/dist/types.js
// Type definitions for cacheable-request 6.0
// Project: https://github.com/lukechilds/cacheable-request#readme
// Definitions by: BendingBender <https://github.com/BendingBender>
//                 Paul Melnikow <https://github.com/paulmelnikow>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3
class types_RequestError extends Error {
    constructor(error) {
        super(error.message);
        Object.assign(this, error);
    }
}
class types_CacheError extends Error {
    constructor(error) {
        super(error.message);
        Object.assign(this, error);
    }
}
//# sourceMappingURL=types.js.map
;// CONCATENATED MODULE: ./node_modules/cacheable-request/dist/index.js











class CacheableRequest {
    constructor(cacheRequest, cacheAdapter) {
        this.hooks = new Map();
        this.request = () => (options, cb) => {
            let url;
            if (typeof options === 'string') {
                url = normalizeUrlObject(external_node_url_namespaceObject.parse(options));
                options = {};
            }
            else if (options instanceof external_node_url_namespaceObject.URL) {
                url = normalizeUrlObject(external_node_url_namespaceObject.parse(options.toString()));
                options = {};
            }
            else {
                const [pathname, ...searchParts] = (options.path ?? '').split('?');
                const search = searchParts.length > 0
                    ? `?${searchParts.join('?')}`
                    : '';
                url = normalizeUrlObject({ ...options, pathname, search });
            }
            options = {
                headers: {},
                method: 'GET',
                cache: true,
                strictTtl: false,
                automaticFailover: false,
                ...options,
                ...urlObjectToRequestOptions(url),
            };
            options.headers = Object.fromEntries(entries(options.headers).map(([key, value]) => [key.toLowerCase(), value]));
            const ee = new external_node_events_namespaceObject();
            const normalizedUrlString = normalizeUrl(external_node_url_namespaceObject.format(url), {
                stripWWW: false,
                removeTrailingSlash: false,
                stripAuthentication: false,
            });
            let key = `${options.method}:${normalizedUrlString}`;
            // POST, PATCH, and PUT requests may be cached, depending on the response
            // cache-control headers. As a result, the body of the request should be
            // added to the cache key in order to avoid collisions.
            if (options.body && options.method !== undefined && ['POST', 'PATCH', 'PUT'].includes(options.method)) {
                if (options.body instanceof external_node_stream_namespaceObject.Readable) {
                    // Streamed bodies should completely skip the cache because they may
                    // or may not be hashable and in either case the stream would need to
                    // close before the cache key could be generated.
                    options.cache = false;
                }
                else {
                    key += `:${external_node_crypto_namespaceObject.createHash('md5').update(options.body).digest('hex')}`;
                }
            }
            let revalidate = false;
            let madeRequest = false;
            const makeRequest = (options_) => {
                madeRequest = true;
                let requestErrored = false;
                let requestErrorCallback = () => { };
                const requestErrorPromise = new Promise(resolve => {
                    requestErrorCallback = () => {
                        if (!requestErrored) {
                            requestErrored = true;
                            resolve();
                        }
                    };
                });
                const handler = async (response) => {
                    if (revalidate) {
                        response.status = response.statusCode;
                        const revalidatedPolicy = http_cache_semantics.fromObject(revalidate.cachePolicy).revalidatedPolicy(options_, response);
                        if (!revalidatedPolicy.modified) {
                            response.resume();
                            await new Promise(resolve => {
                                // Skipping 'error' handler cause 'error' event should't be emitted for 304 response
                                response
                                    .once('end', resolve);
                            });
                            const headers = convertHeaders(revalidatedPolicy.policy.responseHeaders());
                            response = new Response({ statusCode: revalidate.statusCode, headers, body: revalidate.body, url: revalidate.url });
                            response.cachePolicy = revalidatedPolicy.policy;
                            response.fromCache = true;
                        }
                    }
                    if (!response.fromCache) {
                        response.cachePolicy = new http_cache_semantics(options_, response, options_);
                        response.fromCache = false;
                    }
                    let clonedResponse;
                    if (options_.cache && response.cachePolicy.storable()) {
                        clonedResponse = cloneResponse(response);
                        (async () => {
                            try {
                                const bodyPromise = get_stream.buffer(response);
                                await Promise.race([
                                    requestErrorPromise,
                                    new Promise(resolve => response.once('end', resolve)),
                                    new Promise(resolve => response.once('close', resolve)), // eslint-disable-line no-promise-executor-return
                                ]);
                                const body = await bodyPromise;
                                let value = {
                                    url: response.url,
                                    statusCode: response.fromCache ? revalidate.statusCode : response.statusCode,
                                    body,
                                    cachePolicy: response.cachePolicy.toObject(),
                                };
                                let ttl = options_.strictTtl ? response.cachePolicy.timeToLive() : undefined;
                                if (options_.maxTtl) {
                                    ttl = ttl ? Math.min(ttl, options_.maxTtl) : options_.maxTtl;
                                }
                                if (this.hooks.size > 0) {
                                    /* eslint-disable no-await-in-loop */
                                    for (const key_ of this.hooks.keys()) {
                                        value = await this.runHook(key_, value, response);
                                    }
                                    /* eslint-enable no-await-in-loop */
                                }
                                await this.cache.set(key, value, ttl);
                            }
                            catch (error) {
                                ee.emit('error', new types_CacheError(error));
                            }
                        })();
                    }
                    else if (options_.cache && revalidate) {
                        (async () => {
                            try {
                                await this.cache.delete(key);
                            }
                            catch (error) {
                                ee.emit('error', new types_CacheError(error));
                            }
                        })();
                    }
                    ee.emit('response', clonedResponse ?? response);
                    if (typeof cb === 'function') {
                        cb(clonedResponse ?? response);
                    }
                };
                try {
                    const request_ = this.cacheRequest(options_, handler);
                    request_.once('error', requestErrorCallback);
                    request_.once('abort', requestErrorCallback);
                    request_.once('destroy', requestErrorCallback);
                    ee.emit('request', request_);
                }
                catch (error) {
                    ee.emit('error', new types_RequestError(error));
                }
            };
            (async () => {
                const get = async (options_) => {
                    await Promise.resolve();
                    const cacheEntry = options_.cache ? await this.cache.get(key) : undefined;
                    if (cacheEntry === undefined && !options_.forceRefresh) {
                        makeRequest(options_);
                        return;
                    }
                    const policy = http_cache_semantics.fromObject(cacheEntry.cachePolicy);
                    if (policy.satisfiesWithoutRevalidation(options_) && !options_.forceRefresh) {
                        const headers = convertHeaders(policy.responseHeaders());
                        const response = new Response({ statusCode: cacheEntry.statusCode, headers, body: cacheEntry.body, url: cacheEntry.url });
                        response.cachePolicy = policy;
                        response.fromCache = true;
                        ee.emit('response', response);
                        if (typeof cb === 'function') {
                            cb(response);
                        }
                    }
                    else if (policy.satisfiesWithoutRevalidation(options_) && Date.now() >= policy.timeToLive() && options_.forceRefresh) {
                        await this.cache.delete(key);
                        options_.headers = policy.revalidationHeaders(options_);
                        makeRequest(options_);
                    }
                    else {
                        revalidate = cacheEntry;
                        options_.headers = policy.revalidationHeaders(options_);
                        makeRequest(options_);
                    }
                };
                const errorHandler = (error) => ee.emit('error', new types_CacheError(error));
                if (this.cache instanceof src) {
                    const cachek = this.cache;
                    cachek.once('error', errorHandler);
                    ee.on('error', () => cachek.removeListener('error', errorHandler));
                    ee.on('response', () => cachek.removeListener('error', errorHandler));
                }
                try {
                    await get(options);
                }
                catch (error) {
                    if (options.automaticFailover && !madeRequest) {
                        makeRequest(options);
                    }
                    ee.emit('error', new types_CacheError(error));
                }
            })();
            return ee;
        };
        this.addHook = (name, fn) => {
            if (!this.hooks.has(name)) {
                this.hooks.set(name, fn);
            }
        };
        this.removeHook = (name) => this.hooks.delete(name);
        this.getHook = (name) => this.hooks.get(name);
        this.runHook = async (name, ...args) => this.hooks.get(name)?.(...args);
        if (cacheAdapter instanceof src) {
            this.cache = cacheAdapter;
        }
        else if (typeof cacheAdapter === 'string') {
            this.cache = new src({
                uri: cacheAdapter,
                namespace: 'cacheable-request',
            });
        }
        else {
            this.cache = new src({
                store: cacheAdapter,
                namespace: 'cacheable-request',
            });
        }
        this.request = this.request.bind(this);
        this.cacheRequest = cacheRequest;
    }
}
const entries = Object.entries;
const cloneResponse = (response) => {
    const clone = new external_node_stream_namespaceObject.PassThrough({ autoDestroy: false });
    mimicResponse(response, clone);
    return response.pipe(clone);
};
const urlObjectToRequestOptions = (url) => {
    const options = { ...url };
    options.path = `${url.pathname || '/'}${url.search || ''}`;
    delete options.pathname;
    delete options.search;
    return options;
};
const normalizeUrlObject = (url) => 
// If url was parsed by url.parse or new URL:
// - hostname will be set
// - host will be hostname[:port]
// - port will be set if it was explicit in the parsed string
// Otherwise, url was from request options:
// - hostname or host may be set
// - host shall not have port encoded
({
    protocol: url.protocol,
    auth: url.auth,
    hostname: url.hostname || url.host || 'localhost',
    port: url.port,
    pathname: url.pathname,
    search: url.search,
});
const convertHeaders = (headers) => {
    const result = [];
    for (const name of Object.keys(headers)) {
        result[name.toLowerCase()] = headers[name];
    }
    return result;
};
/* harmony default export */ const cacheable_request_dist = (CacheableRequest);

const onResponse = 'onResponse';
//# sourceMappingURL=index.js.map
// EXTERNAL MODULE: ./node_modules/decompress-response/index.js
var decompress_response = __nccwpck_require__(2391);
;// CONCATENATED MODULE: ./node_modules/form-data-encoder/lib/util/getStreamIterator.js

const isAsyncIterable = (value) => (isFunction(value[Symbol.asyncIterator]));
async function* readStream(readable) {
    const reader = readable.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        yield value;
    }
}
const getStreamIterator = (source) => {
    if (isAsyncIterable(source)) {
        return source;
    }
    if (isFunction(source.getReader)) {
        return readStream(source);
    }
    throw new TypeError("Unsupported data source: Expected either ReadableStream or async iterable.");
};

;// CONCATENATED MODULE: ./node_modules/form-data-encoder/lib/util/createBoundary.js
const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
function createBoundary() {
    let size = 16;
    let res = "";
    while (size--) {
        res += alphabet[(Math.random() * alphabet.length) << 0];
    }
    return res;
}

;// CONCATENATED MODULE: ./node_modules/form-data-encoder/lib/util/normalizeValue.js
const normalizeValue = (value) => String(value)
    .replace(/\r|\n/g, (match, i, str) => {
    if ((match === "\r" && str[i + 1] !== "\n")
        || (match === "\n" && str[i - 1] !== "\r")) {
        return "\r\n";
    }
    return match;
});

;// CONCATENATED MODULE: ./node_modules/form-data-encoder/lib/util/isPlainObject.js
const getType = (value) => (Object.prototype.toString.call(value).slice(8, -1).toLowerCase());
function isPlainObject(value) {
    if (getType(value) !== "object") {
        return false;
    }
    const pp = Object.getPrototypeOf(value);
    if (pp === null || pp === undefined) {
        return true;
    }
    const Ctor = pp.constructor && pp.constructor.toString();
    return Ctor === Object.toString();
}

;// CONCATENATED MODULE: ./node_modules/form-data-encoder/lib/util/proxyHeaders.js
function getProperty(target, prop) {
    if (typeof prop === "string") {
        for (const [name, value] of Object.entries(target)) {
            if (prop.toLowerCase() === name.toLowerCase()) {
                return value;
            }
        }
    }
    return undefined;
}
const proxyHeaders = (object) => new Proxy(object, {
    get: (target, prop) => getProperty(target, prop),
    has: (target, prop) => getProperty(target, prop) !== undefined
});

;// CONCATENATED MODULE: ./node_modules/form-data-encoder/lib/util/escapeName.js
const escapeName = (name) => String(name)
    .replace(/\r/g, "%0D")
    .replace(/\n/g, "%0A")
    .replace(/"/g, "%22");

;// CONCATENATED MODULE: ./node_modules/form-data-encoder/lib/util/isFile.js

const isFile = (value) => Boolean(value
    && typeof value === "object"
    && isFunction(value.constructor)
    && value[Symbol.toStringTag] === "File"
    && isFunction(value.stream)
    && value.name != null);
const isFileLike = (/* unused pure expression or super */ null && (isFile));

;// CONCATENATED MODULE: ./node_modules/form-data-encoder/lib/FormDataEncoder.js
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FormDataEncoder_instances, _FormDataEncoder_CRLF, _FormDataEncoder_CRLF_BYTES, _FormDataEncoder_CRLF_BYTES_LENGTH, _FormDataEncoder_DASHES, _FormDataEncoder_encoder, _FormDataEncoder_footer, _FormDataEncoder_form, _FormDataEncoder_options, _FormDataEncoder_getFieldHeader, _FormDataEncoder_getContentLength;








const defaultOptions = {
    enableAdditionalHeaders: false
};
const readonlyProp = { writable: false, configurable: false };
class FormDataEncoder {
    constructor(form, boundaryOrOptions, options) {
        _FormDataEncoder_instances.add(this);
        _FormDataEncoder_CRLF.set(this, "\r\n");
        _FormDataEncoder_CRLF_BYTES.set(this, void 0);
        _FormDataEncoder_CRLF_BYTES_LENGTH.set(this, void 0);
        _FormDataEncoder_DASHES.set(this, "-".repeat(2));
        _FormDataEncoder_encoder.set(this, new TextEncoder());
        _FormDataEncoder_footer.set(this, void 0);
        _FormDataEncoder_form.set(this, void 0);
        _FormDataEncoder_options.set(this, void 0);
        if (!isFormData(form)) {
            throw new TypeError("Expected first argument to be a FormData instance.");
        }
        let boundary;
        if (isPlainObject(boundaryOrOptions)) {
            options = boundaryOrOptions;
        }
        else {
            boundary = boundaryOrOptions;
        }
        if (!boundary) {
            boundary = createBoundary();
        }
        if (typeof boundary !== "string") {
            throw new TypeError("Expected boundary argument to be a string.");
        }
        if (options && !isPlainObject(options)) {
            throw new TypeError("Expected options argument to be an object.");
        }
        __classPrivateFieldSet(this, _FormDataEncoder_form, Array.from(form.entries()), "f");
        __classPrivateFieldSet(this, _FormDataEncoder_options, { ...defaultOptions, ...options }, "f");
        __classPrivateFieldSet(this, _FormDataEncoder_CRLF_BYTES, __classPrivateFieldGet(this, _FormDataEncoder_encoder, "f").encode(__classPrivateFieldGet(this, _FormDataEncoder_CRLF, "f")), "f");
        __classPrivateFieldSet(this, _FormDataEncoder_CRLF_BYTES_LENGTH, __classPrivateFieldGet(this, _FormDataEncoder_CRLF_BYTES, "f").byteLength, "f");
        this.boundary = `form-data-boundary-${boundary}`;
        this.contentType = `multipart/form-data; boundary=${this.boundary}`;
        __classPrivateFieldSet(this, _FormDataEncoder_footer, __classPrivateFieldGet(this, _FormDataEncoder_encoder, "f").encode(`${__classPrivateFieldGet(this, _FormDataEncoder_DASHES, "f")}${this.boundary}${__classPrivateFieldGet(this, _FormDataEncoder_DASHES, "f")}${__classPrivateFieldGet(this, _FormDataEncoder_CRLF, "f").repeat(2)}`), "f");
        const headers = {
            "Content-Type": this.contentType
        };
        const contentLength = __classPrivateFieldGet(this, _FormDataEncoder_instances, "m", _FormDataEncoder_getContentLength).call(this);
        if (contentLength) {
            this.contentLength = contentLength;
            headers["Content-Length"] = contentLength;
        }
        this.headers = proxyHeaders(Object.freeze(headers));
        Object.defineProperties(this, {
            boundary: readonlyProp,
            contentType: readonlyProp,
            contentLength: readonlyProp,
            headers: readonlyProp
        });
    }
    getContentLength() {
        return this.contentLength == null ? undefined : Number(this.contentLength);
    }
    *values() {
        for (const [name, raw] of __classPrivateFieldGet(this, _FormDataEncoder_form, "f")) {
            const value = isFile(raw) ? raw : __classPrivateFieldGet(this, _FormDataEncoder_encoder, "f").encode(normalizeValue(raw));
            yield __classPrivateFieldGet(this, _FormDataEncoder_instances, "m", _FormDataEncoder_getFieldHeader).call(this, name, value);
            yield value;
            yield __classPrivateFieldGet(this, _FormDataEncoder_CRLF_BYTES, "f");
        }
        yield __classPrivateFieldGet(this, _FormDataEncoder_footer, "f");
    }
    async *encode() {
        for (const part of this.values()) {
            if (isFile(part)) {
                yield* getStreamIterator(part.stream());
            }
            else {
                yield part;
            }
        }
    }
    [(_FormDataEncoder_CRLF = new WeakMap(), _FormDataEncoder_CRLF_BYTES = new WeakMap(), _FormDataEncoder_CRLF_BYTES_LENGTH = new WeakMap(), _FormDataEncoder_DASHES = new WeakMap(), _FormDataEncoder_encoder = new WeakMap(), _FormDataEncoder_footer = new WeakMap(), _FormDataEncoder_form = new WeakMap(), _FormDataEncoder_options = new WeakMap(), _FormDataEncoder_instances = new WeakSet(), _FormDataEncoder_getFieldHeader = function _FormDataEncoder_getFieldHeader(name, value) {
        let header = "";
        header += `${__classPrivateFieldGet(this, _FormDataEncoder_DASHES, "f")}${this.boundary}${__classPrivateFieldGet(this, _FormDataEncoder_CRLF, "f")}`;
        header += `Content-Disposition: form-data; name="${escapeName(name)}"`;
        if (isFile(value)) {
            header += `; filename="${escapeName(value.name)}"${__classPrivateFieldGet(this, _FormDataEncoder_CRLF, "f")}`;
            header += `Content-Type: ${value.type || "application/octet-stream"}`;
        }
        const size = isFile(value) ? value.size : value.byteLength;
        if (__classPrivateFieldGet(this, _FormDataEncoder_options, "f").enableAdditionalHeaders === true
            && size != null
            && !isNaN(size)) {
            header += `${__classPrivateFieldGet(this, _FormDataEncoder_CRLF, "f")}Content-Length: ${isFile(value) ? value.size : value.byteLength}`;
        }
        return __classPrivateFieldGet(this, _FormDataEncoder_encoder, "f").encode(`${header}${__classPrivateFieldGet(this, _FormDataEncoder_CRLF, "f").repeat(2)}`);
    }, _FormDataEncoder_getContentLength = function _FormDataEncoder_getContentLength() {
        let length = 0;
        for (const [name, raw] of __classPrivateFieldGet(this, _FormDataEncoder_form, "f")) {
            const value = isFile(raw) ? raw : __classPrivateFieldGet(this, _FormDataEncoder_encoder, "f").encode(normalizeValue(raw));
            const size = isFile(value) ? value.size : value.byteLength;
            if (size == null || isNaN(size)) {
                return undefined;
            }
            length += __classPrivateFieldGet(this, _FormDataEncoder_instances, "m", _FormDataEncoder_getFieldHeader).call(this, name, value).byteLength;
            length += size;
            length += __classPrivateFieldGet(this, _FormDataEncoder_CRLF_BYTES_LENGTH, "f");
        }
        return String(length + __classPrivateFieldGet(this, _FormDataEncoder_footer, "f").byteLength);
    }, Symbol.iterator)]() {
        return this.values();
    }
    [Symbol.asyncIterator]() {
        return this.encode();
    }
}

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/utils/is-form-data.js

function is_form_data_isFormData(body) {
    return dist.nodeStream(body) && dist.function_(body.getBoundary);
}

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/utils/get-body-size.js




async function getBodySize(body, headers) {
    if (headers && 'content-length' in headers) {
        return Number(headers['content-length']);
    }
    if (!body) {
        return 0;
    }
    if (dist.string(body)) {
        return external_node_buffer_namespaceObject.Buffer.byteLength(body);
    }
    if (dist.buffer(body)) {
        return body.length;
    }
    if (is_form_data_isFormData(body)) {
        return (0,external_node_util_namespaceObject.promisify)(body.getLength.bind(body))();
    }
    return undefined;
}

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/utils/proxy-events.js
function proxyEvents(from, to, events) {
    const eventFunctions = {};
    for (const event of events) {
        const eventFunction = (...args) => {
            to.emit(event, ...args);
        };
        eventFunctions[event] = eventFunction;
        from.on(event, eventFunction);
    }
    return () => {
        for (const [event, eventFunction] of Object.entries(eventFunctions)) {
            from.off(event, eventFunction);
        }
    };
}

;// CONCATENATED MODULE: external "node:net"
const external_node_net_namespaceObject = require("node:net");
;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/utils/unhandle.js
// When attaching listeners, it's very easy to forget about them.
// Especially if you do error handling and set timeouts.
// So instead of checking if it's proper to throw an error on every timeout ever,
// use this simple tool which will remove all listeners you have attached.
function unhandle() {
    const handlers = [];
    return {
        once(origin, event, fn) {
            origin.once(event, fn);
            handlers.push({ origin, event, fn });
        },
        unhandleAll() {
            for (const handler of handlers) {
                const { origin, event, fn } = handler;
                origin.removeListener(event, fn);
            }
            handlers.length = 0;
        },
    };
}

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/timed-out.js


const reentry = Symbol('reentry');
const noop = () => { };
class timed_out_TimeoutError extends Error {
    constructor(threshold, event) {
        super(`Timeout awaiting '${event}' for ${threshold}ms`);
        Object.defineProperty(this, "event", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: event
        });
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = 'TimeoutError';
        this.code = 'ETIMEDOUT';
    }
}
function timedOut(request, delays, options) {
    if (reentry in request) {
        return noop;
    }
    request[reentry] = true;
    const cancelers = [];
    const { once, unhandleAll } = unhandle();
    const addTimeout = (delay, callback, event) => {
        const timeout = setTimeout(callback, delay, delay, event);
        timeout.unref?.();
        const cancel = () => {
            clearTimeout(timeout);
        };
        cancelers.push(cancel);
        return cancel;
    };
    const { host, hostname } = options;
    const timeoutHandler = (delay, event) => {
        request.destroy(new timed_out_TimeoutError(delay, event));
    };
    const cancelTimeouts = () => {
        for (const cancel of cancelers) {
            cancel();
        }
        unhandleAll();
    };
    request.once('error', error => {
        cancelTimeouts();
        // Save original behavior
        /* istanbul ignore next */
        if (request.listenerCount('error') === 0) {
            throw error;
        }
    });
    if (delays.request !== undefined) {
        const cancelTimeout = addTimeout(delays.request, timeoutHandler, 'request');
        once(request, 'response', (response) => {
            once(response, 'end', cancelTimeout);
        });
    }
    if (delays.socket !== undefined) {
        const { socket } = delays;
        const socketTimeoutHandler = () => {
            timeoutHandler(socket, 'socket');
        };
        request.setTimeout(socket, socketTimeoutHandler);
        // `request.setTimeout(0)` causes a memory leak.
        // We can just remove the listener and forget about the timer - it's unreffed.
        // See https://github.com/sindresorhus/got/issues/690
        cancelers.push(() => {
            request.removeListener('timeout', socketTimeoutHandler);
        });
    }
    const hasLookup = delays.lookup !== undefined;
    const hasConnect = delays.connect !== undefined;
    const hasSecureConnect = delays.secureConnect !== undefined;
    const hasSend = delays.send !== undefined;
    if (hasLookup || hasConnect || hasSecureConnect || hasSend) {
        once(request, 'socket', (socket) => {
            const { socketPath } = request;
            /* istanbul ignore next: hard to test */
            if (socket.connecting) {
                const hasPath = Boolean(socketPath ?? external_node_net_namespaceObject.isIP(hostname ?? host ?? '') !== 0);
                if (hasLookup && !hasPath && socket.address().address === undefined) {
                    const cancelTimeout = addTimeout(delays.lookup, timeoutHandler, 'lookup');
                    once(socket, 'lookup', cancelTimeout);
                }
                if (hasConnect) {
                    const timeConnect = () => addTimeout(delays.connect, timeoutHandler, 'connect');
                    if (hasPath) {
                        once(socket, 'connect', timeConnect());
                    }
                    else {
                        once(socket, 'lookup', (error) => {
                            if (error === null) {
                                once(socket, 'connect', timeConnect());
                            }
                        });
                    }
                }
                if (hasSecureConnect && options.protocol === 'https:') {
                    once(socket, 'connect', () => {
                        const cancelTimeout = addTimeout(delays.secureConnect, timeoutHandler, 'secureConnect');
                        once(socket, 'secureConnect', cancelTimeout);
                    });
                }
            }
            if (hasSend) {
                const timeRequest = () => addTimeout(delays.send, timeoutHandler, 'send');
                /* istanbul ignore next: hard to test */
                if (socket.connecting) {
                    once(socket, 'connect', () => {
                        once(request, 'upload-complete', timeRequest());
                    });
                }
                else {
                    once(request, 'upload-complete', timeRequest());
                }
            }
        });
    }
    if (delays.response !== undefined) {
        once(request, 'upload-complete', () => {
            const cancelTimeout = addTimeout(delays.response, timeoutHandler, 'response');
            once(request, 'response', cancelTimeout);
        });
    }
    if (delays.read !== undefined) {
        once(request, 'response', (response) => {
            const cancelTimeout = addTimeout(delays.read, timeoutHandler, 'read');
            once(response, 'end', cancelTimeout);
        });
    }
    return cancelTimeouts;
}

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/utils/url-to-options.js

function urlToOptions(url) {
    // Cast to URL
    url = url;
    const options = {
        protocol: url.protocol,
        hostname: dist.string(url.hostname) && url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname,
        host: url.host,
        hash: url.hash,
        search: url.search,
        pathname: url.pathname,
        href: url.href,
        path: `${url.pathname || ''}${url.search || ''}`,
    };
    if (dist.string(url.port) && url.port.length > 0) {
        options.port = Number(url.port);
    }
    if (url.username || url.password) {
        options.auth = `${url.username || ''}:${url.password || ''}`;
    }
    return options;
}

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/utils/weakable-map.js
class WeakableMap {
    constructor() {
        Object.defineProperty(this, "weakMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "map", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.weakMap = new WeakMap();
        this.map = new Map();
    }
    set(key, value) {
        if (typeof key === 'object') {
            this.weakMap.set(key, value);
        }
        else {
            this.map.set(key, value);
        }
    }
    get(key) {
        if (typeof key === 'object') {
            return this.weakMap.get(key);
        }
        return this.map.get(key);
    }
    has(key) {
        if (typeof key === 'object') {
            return this.weakMap.has(key);
        }
        return this.map.has(key);
    }
}

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/calculate-retry-delay.js
const calculateRetryDelay = ({ attemptCount, retryOptions, error, retryAfter, computedValue, }) => {
    if (error.name === 'RetryError') {
        return 1;
    }
    if (attemptCount > retryOptions.limit) {
        return 0;
    }
    const hasMethod = retryOptions.methods.includes(error.options.method);
    const hasErrorCode = retryOptions.errorCodes.includes(error.code);
    const hasStatusCode = error.response && retryOptions.statusCodes.includes(error.response.statusCode);
    if (!hasMethod || (!hasErrorCode && !hasStatusCode)) {
        return 0;
    }
    if (error.response) {
        if (retryAfter) {
            // In this case `computedValue` is `options.request.timeout`
            if (retryAfter > computedValue) {
                return 0;
            }
            return retryAfter;
        }
        if (error.response.statusCode === 413) {
            return 0;
        }
    }
    const noise = Math.random() * retryOptions.noise;
    return Math.min(((2 ** (attemptCount - 1)) * 1000), retryOptions.backoffLimit) + noise;
};
/* harmony default export */ const calculate_retry_delay = (calculateRetryDelay);

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/response.js

const isResponseOk = (response) => {
    const { statusCode } = response;
    const limitStatusCode = response.request.options.followRedirect ? 299 : 399;
    return (statusCode >= 200 && statusCode <= limitStatusCode) || statusCode === 304;
};
/**
An error to be thrown when server response code is 2xx, and parsing body fails.
Includes a `response` property.
*/
class ParseError extends RequestError {
    constructor(error, response) {
        const { options } = response.request;
        super(`${error.message} in "${options.url.toString()}"`, error, response.request);
        this.name = 'ParseError';
        this.code = 'ERR_BODY_PARSE_FAILURE';
    }
}
const parseBody = (response, responseType, parseJson, encoding) => {
    const { rawBody } = response;
    try {
        if (responseType === 'text') {
            return rawBody.toString(encoding);
        }
        if (responseType === 'json') {
            return rawBody.length === 0 ? '' : parseJson(rawBody.toString(encoding));
        }
        if (responseType === 'buffer') {
            return rawBody;
        }
    }
    catch (error) {
        throw new ParseError(error, response);
    }
    throw new ParseError({
        message: `Unknown body type '${responseType}'`,
        name: 'Error',
    }, response);
};

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/utils/is-client-request.js
function isClientRequest(clientRequest) {
    return clientRequest.writable && !clientRequest.writableEnded;
}
/* harmony default export */ const is_client_request = (isClientRequest);

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/utils/is-unix-socket-url.js
// eslint-disable-next-line @typescript-eslint/naming-convention
function isUnixSocketURL(url) {
    return url.protocol === 'unix:' || url.hostname === 'unix';
}

;// CONCATENATED MODULE: ./node_modules/got/dist/source/core/index.js






















const { buffer: getStreamAsBuffer } = get_stream;
const supportsBrotli = dist.string(external_node_process_namespaceObject.versions.brotli);
const methodsWithoutBody = new Set(['GET', 'HEAD']);
const cacheableStore = new WeakableMap();
const redirectCodes = new Set([300, 301, 302, 303, 304, 307, 308]);
const proxiedRequestEvents = [
    'socket',
    'connect',
    'continue',
    'information',
    'upgrade',
];
const core_noop = () => { };
class Request extends external_node_stream_namespaceObject.Duplex {
    constructor(url, options, defaults) {
        super({
            // Don't destroy immediately, as the error may be emitted on unsuccessful retry
            autoDestroy: false,
            // It needs to be zero because we're just proxying the data to another stream
            highWaterMark: 0,
        });
        // @ts-expect-error - Ignoring for now.
        Object.defineProperty(this, 'constructor', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_noPipe", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // @ts-expect-error https://github.com/microsoft/TypeScript/issues/9568
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "response", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "requestUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "redirectUrls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "retryCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_stopRetry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_downloadedSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_uploadedSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_stopReading", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_pipedServerResponses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_request", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_responseSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_bodySize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_unproxyEvents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_isFromCache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_cannotHaveBody", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_triggerRead", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_cancelTimeouts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_removeListeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_nativeResponse", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_flushed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_aborted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // We need this because `this._request` if `undefined` when using cache
        Object.defineProperty(this, "_requestInitialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._downloadedSize = 0;
        this._uploadedSize = 0;
        this._stopReading = false;
        this._pipedServerResponses = new Set();
        this._cannotHaveBody = false;
        this._unproxyEvents = core_noop;
        this._triggerRead = false;
        this._cancelTimeouts = core_noop;
        this._removeListeners = core_noop;
        this._jobs = [];
        this._flushed = false;
        this._requestInitialized = false;
        this._aborted = false;
        this.redirectUrls = [];
        this.retryCount = 0;
        this._stopRetry = core_noop;
        this.on('pipe', (source) => {
            if (source?.headers) {
                Object.assign(this.options.headers, source.headers);
            }
        });
        this.on('newListener', event => {
            if (event === 'retry' && this.listenerCount('retry') > 0) {
                throw new Error('A retry listener has been attached already.');
            }
        });
        try {
            this.options = new Options(url, options, defaults);
            if (!this.options.url) {
                if (this.options.prefixUrl === '') {
                    throw new TypeError('Missing `url` property');
                }
                this.options.url = '';
            }
            this.requestUrl = this.options.url;
        }
        catch (error) {
            const { options } = error;
            if (options) {
                this.options = options;
            }
            this.flush = async () => {
                this.flush = async () => { };
                this.destroy(error);
            };
            return;
        }
        // Important! If you replace `body` in a handler with another stream, make sure it's readable first.
        // The below is run only once.
        const { body } = this.options;
        if (dist.nodeStream(body)) {
            body.once('error', error => {
                if (this._flushed) {
                    this._beforeError(new UploadError(error, this));
                }
                else {
                    this.flush = async () => {
                        this.flush = async () => { };
                        this._beforeError(new UploadError(error, this));
                    };
                }
            });
        }
        if (this.options.signal) {
            const abort = () => {
                this.destroy(new AbortError(this));
            };
            if (this.options.signal.aborted) {
                abort();
            }
            else {
                this.options.signal.addEventListener('abort', abort);
                this._removeListeners = () => {
                    this.options.signal?.removeEventListener('abort', abort);
                };
            }
        }
    }
    async flush() {
        if (this._flushed) {
            return;
        }
        this._flushed = true;
        try {
            await this._finalizeBody();
            if (this.destroyed) {
                return;
            }
            await this._makeRequest();
            if (this.destroyed) {
                this._request?.destroy();
                return;
            }
            // Queued writes etc.
            for (const job of this._jobs) {
                job();
            }
            // Prevent memory leak
            this._jobs.length = 0;
            this._requestInitialized = true;
        }
        catch (error) {
            this._beforeError(error);
        }
    }
    _beforeError(error) {
        if (this._stopReading) {
            return;
        }
        const { response, options } = this;
        const attemptCount = this.retryCount + (error.name === 'RetryError' ? 0 : 1);
        this._stopReading = true;
        if (!(error instanceof RequestError)) {
            error = new RequestError(error.message, error, this);
        }
        const typedError = error;
        void (async () => {
            // Node.js parser is really weird.
            // It emits post-request Parse Errors on the same instance as previous request. WTF.
            // Therefore we need to check if it has been destroyed as well.
            //
            // Furthermore, Node.js 16 `response.destroy()` doesn't immediately destroy the socket,
            // but makes the response unreadable. So we additionally need to check `response.readable`.
            if (response?.readable && !response.rawBody && !this._request?.socket?.destroyed) {
                // @types/node has incorrect typings. `setEncoding` accepts `null` as well.
                response.setEncoding(this.readableEncoding);
                const success = await this._setRawBody(response);
                if (success) {
                    response.body = response.rawBody.toString();
                }
            }
            if (this.listenerCount('retry') !== 0) {
                let backoff;
                try {
                    let retryAfter;
                    if (response && 'retry-after' in response.headers) {
                        retryAfter = Number(response.headers['retry-after']);
                        if (Number.isNaN(retryAfter)) {
                            retryAfter = Date.parse(response.headers['retry-after']) - Date.now();
                            if (retryAfter <= 0) {
                                retryAfter = 1;
                            }
                        }
                        else {
                            retryAfter *= 1000;
                        }
                    }
                    const retryOptions = options.retry;
                    backoff = await retryOptions.calculateDelay({
                        attemptCount,
                        retryOptions,
                        error: typedError,
                        retryAfter,
                        computedValue: calculate_retry_delay({
                            attemptCount,
                            retryOptions,
                            error: typedError,
                            retryAfter,
                            computedValue: retryOptions.maxRetryAfter ?? options.timeout.request ?? Number.POSITIVE_INFINITY,
                        }),
                    });
                }
                catch (error_) {
                    void this._error(new RequestError(error_.message, error_, this));
                    return;
                }
                if (backoff) {
                    await new Promise(resolve => {
                        const timeout = setTimeout(resolve, backoff);
                        this._stopRetry = () => {
                            clearTimeout(timeout);
                            resolve();
                        };
                    });
                    // Something forced us to abort the retry
                    if (this.destroyed) {
                        return;
                    }
                    try {
                        for (const hook of this.options.hooks.beforeRetry) {
                            // eslint-disable-next-line no-await-in-loop
                            await hook(typedError, this.retryCount + 1);
                        }
                    }
                    catch (error_) {
                        void this._error(new RequestError(error_.message, error, this));
                        return;
                    }
                    // Something forced us to abort the retry
                    if (this.destroyed) {
                        return;
                    }
                    this.destroy();
                    this.emit('retry', this.retryCount + 1, error, (updatedOptions) => {
                        const request = new Request(options.url, updatedOptions, options);
                        request.retryCount = this.retryCount + 1;
                        external_node_process_namespaceObject.nextTick(() => {
                            void request.flush();
                        });
                        return request;
                    });
                    return;
                }
            }
            void this._error(typedError);
        })();
    }
    _read() {
        this._triggerRead = true;
        const { response } = this;
        if (response && !this._stopReading) {
            // We cannot put this in the `if` above
            // because `.read()` also triggers the `end` event
            if (response.readableLength) {
                this._triggerRead = false;
            }
            let data;
            while ((data = response.read()) !== null) {
                this._downloadedSize += data.length; // eslint-disable-line @typescript-eslint/restrict-plus-operands
                const progress = this.downloadProgress;
                if (progress.percent < 1) {
                    this.emit('downloadProgress', progress);
                }
                this.push(data);
            }
        }
    }
    _write(chunk, encoding, callback) {
        const write = () => {
            this._writeRequest(chunk, encoding, callback);
        };
        if (this._requestInitialized) {
            write();
        }
        else {
            this._jobs.push(write);
        }
    }
    _final(callback) {
        const endRequest = () => {
            // We need to check if `this._request` is present,
            // because it isn't when we use cache.
            if (!this._request || this._request.destroyed) {
                callback();
                return;
            }
            this._request.end((error) => {
                // The request has been destroyed before `_final` finished.
                // See https://github.com/nodejs/node/issues/39356
                if (this._request._writableState?.errored) {
                    return;
                }
                if (!error) {
                    this._bodySize = this._uploadedSize;
                    this.emit('uploadProgress', this.uploadProgress);
                    this._request.emit('upload-complete');
                }
                callback(error);
            });
        };
        if (this._requestInitialized) {
            endRequest();
        }
        else {
            this._jobs.push(endRequest);
        }
    }
    _destroy(error, callback) {
        this._stopReading = true;
        this.flush = async () => { };
        // Prevent further retries
        this._stopRetry();
        this._cancelTimeouts();
        this._removeListeners();
        if (this.options) {
            const { body } = this.options;
            if (dist.nodeStream(body)) {
                body.destroy();
            }
        }
        if (this._request) {
            this._request.destroy();
        }
        if (error !== null && !dist.undefined(error) && !(error instanceof RequestError)) {
            error = new RequestError(error.message, error, this);
        }
        callback(error);
    }
    pipe(destination, options) {
        if (destination instanceof external_node_http_namespaceObject.ServerResponse) {
            this._pipedServerResponses.add(destination);
        }
        return super.pipe(destination, options);
    }
    unpipe(destination) {
        if (destination instanceof external_node_http_namespaceObject.ServerResponse) {
            this._pipedServerResponses.delete(destination);
        }
        super.unpipe(destination);
        return this;
    }
    async _finalizeBody() {
        const { options } = this;
        const { headers } = options;
        const isForm = !dist.undefined(options.form);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const isJSON = !dist.undefined(options.json);
        const isBody = !dist.undefined(options.body);
        const cannotHaveBody = methodsWithoutBody.has(options.method) && !(options.method === 'GET' && options.allowGetBody);
        this._cannotHaveBody = cannotHaveBody;
        if (isForm || isJSON || isBody) {
            if (cannotHaveBody) {
                throw new TypeError(`The \`${options.method}\` method cannot be used with a body`);
            }
            // Serialize body
            const noContentType = !dist.string(headers['content-type']);
            if (isBody) {
                // Body is spec-compliant FormData
                if (isFormData(options.body)) {
                    const encoder = new FormDataEncoder(options.body);
                    if (noContentType) {
                        headers['content-type'] = encoder.headers['Content-Type'];
                    }
                    if ('Content-Length' in encoder.headers) {
                        headers['content-length'] = encoder.headers['Content-Length'];
                    }
                    options.body = encoder.encode();
                }
                // Special case for https://github.com/form-data/form-data
                if (is_form_data_isFormData(options.body) && noContentType) {
                    headers['content-type'] = `multipart/form-data; boundary=${options.body.getBoundary()}`;
                }
            }
            else if (isForm) {
                if (noContentType) {
                    headers['content-type'] = 'application/x-www-form-urlencoded';
                }
                const { form } = options;
                options.form = undefined;
                options.body = (new URLSearchParams(form)).toString();
            }
            else {
                if (noContentType) {
                    headers['content-type'] = 'application/json';
                }
                const { json } = options;
                options.json = undefined;
                options.body = options.stringifyJson(json);
            }
            const uploadBodySize = await getBodySize(options.body, options.headers);
            // See https://tools.ietf.org/html/rfc7230#section-3.3.2
            // A user agent SHOULD send a Content-Length in a request message when
            // no Transfer-Encoding is sent and the request method defines a meaning
            // for an enclosed payload body.  For example, a Content-Length header
            // field is normally sent in a POST request even when the value is 0
            // (indicating an empty payload body).  A user agent SHOULD NOT send a
            // Content-Length header field when the request message does not contain
            // a payload body and the method semantics do not anticipate such a
            // body.
            if (dist.undefined(headers['content-length']) && dist.undefined(headers['transfer-encoding']) && !cannotHaveBody && !dist.undefined(uploadBodySize)) {
                headers['content-length'] = String(uploadBodySize);
            }
        }
        if (options.responseType === 'json' && !('accept' in options.headers)) {
            options.headers.accept = 'application/json';
        }
        this._bodySize = Number(headers['content-length']) || undefined;
    }
    async _onResponseBase(response) {
        // This will be called e.g. when using cache so we need to check if this request has been aborted.
        if (this.isAborted) {
            return;
        }
        const { options } = this;
        const { url } = options;
        this._nativeResponse = response;
        if (options.decompress) {
            response = decompress_response(response);
        }
        const statusCode = response.statusCode;
        const typedResponse = response;
        typedResponse.statusMessage = typedResponse.statusMessage ?? external_node_http_namespaceObject.STATUS_CODES[statusCode];
        typedResponse.url = options.url.toString();
        typedResponse.requestUrl = this.requestUrl;
        typedResponse.redirectUrls = this.redirectUrls;
        typedResponse.request = this;
        typedResponse.isFromCache = this._nativeResponse.fromCache ?? false;
        typedResponse.ip = this.ip;
        typedResponse.retryCount = this.retryCount;
        typedResponse.ok = isResponseOk(typedResponse);
        this._isFromCache = typedResponse.isFromCache;
        this._responseSize = Number(response.headers['content-length']) || undefined;
        this.response = typedResponse;
        response.once('end', () => {
            this._responseSize = this._downloadedSize;
            this.emit('downloadProgress', this.downloadProgress);
        });
        response.once('error', (error) => {
            this._aborted = true;
            // Force clean-up, because some packages don't do this.
            // TODO: Fix decompress-response
            response.destroy();
            this._beforeError(new ReadError(error, this));
        });
        response.once('aborted', () => {
            this._aborted = true;
            this._beforeError(new ReadError({
                name: 'Error',
                message: 'The server aborted pending request',
                code: 'ECONNRESET',
            }, this));
        });
        this.emit('downloadProgress', this.downloadProgress);
        const rawCookies = response.headers['set-cookie'];
        if (dist.object(options.cookieJar) && rawCookies) {
            let promises = rawCookies.map(async (rawCookie) => options.cookieJar.setCookie(rawCookie, url.toString()));
            if (options.ignoreInvalidCookies) {
                promises = promises.map(async (promise) => {
                    try {
                        await promise;
                    }
                    catch { }
                });
            }
            try {
                await Promise.all(promises);
            }
            catch (error) {
                this._beforeError(error);
                return;
            }
        }
        // The above is running a promise, therefore we need to check if this request has been aborted yet again.
        if (this.isAborted) {
            return;
        }
        if (options.followRedirect && response.headers.location && redirectCodes.has(statusCode)) {
            // We're being redirected, we don't care about the response.
            // It'd be best to abort the request, but we can't because
            // we would have to sacrifice the TCP connection. We don't want that.
            response.resume();
            this._cancelTimeouts();
            this._unproxyEvents();
            if (this.redirectUrls.length >= options.maxRedirects) {
                this._beforeError(new MaxRedirectsError(this));
                return;
            }
            this._request = undefined;
            const updatedOptions = new Options(undefined, undefined, this.options);
            const serverRequestedGet = statusCode === 303 && updatedOptions.method !== 'GET' && updatedOptions.method !== 'HEAD';
            const canRewrite = statusCode !== 307 && statusCode !== 308;
            const userRequestedGet = updatedOptions.methodRewriting && canRewrite;
            if (serverRequestedGet || userRequestedGet) {
                updatedOptions.method = 'GET';
                updatedOptions.body = undefined;
                updatedOptions.json = undefined;
                updatedOptions.form = undefined;
                delete updatedOptions.headers['content-length'];
            }
            try {
                // We need this in order to support UTF-8
                const redirectBuffer = external_node_buffer_namespaceObject.Buffer.from(response.headers.location, 'binary').toString();
                const redirectUrl = new URL(redirectBuffer, url);
                if (!isUnixSocketURL(url) && isUnixSocketURL(redirectUrl)) {
                    this._beforeError(new RequestError('Cannot redirect to UNIX socket', {}, this));
                    return;
                }
                // Redirecting to a different site, clear sensitive data.
                if (redirectUrl.hostname !== url.hostname || redirectUrl.port !== url.port) {
                    if ('host' in updatedOptions.headers) {
                        delete updatedOptions.headers.host;
                    }
                    if ('cookie' in updatedOptions.headers) {
                        delete updatedOptions.headers.cookie;
                    }
                    if ('authorization' in updatedOptions.headers) {
                        delete updatedOptions.headers.authorization;
                    }
                    if (updatedOptions.username || updatedOptions.password) {
                        updatedOptions.username = '';
                        updatedOptions.password = '';
                    }
                }
                else {
                    redirectUrl.username = updatedOptions.username;
                    redirectUrl.password = updatedOptions.password;
                }
                this.redirectUrls.push(redirectUrl);
                updatedOptions.prefixUrl = '';
                updatedOptions.url = redirectUrl;
                for (const hook of updatedOptions.hooks.beforeRedirect) {
                    // eslint-disable-next-line no-await-in-loop
                    await hook(updatedOptions, typedResponse);
                }
                this.emit('redirect', updatedOptions, typedResponse);
                this.options = updatedOptions;
                await this._makeRequest();
            }
            catch (error) {
                this._beforeError(error);
                return;
            }
            return;
        }
        // `HTTPError`s always have `error.response.body` defined.
        // Therefore we cannot retry if `options.throwHttpErrors` is false.
        // On the last retry, if `options.throwHttpErrors` is false, we would need to return the body,
        // but that wouldn't be possible since the body would be already read in `error.response.body`.
        if (options.isStream && options.throwHttpErrors && !isResponseOk(typedResponse)) {
            this._beforeError(new HTTPError(typedResponse));
            return;
        }
        response.on('readable', () => {
            if (this._triggerRead) {
                this._read();
            }
        });
        this.on('resume', () => {
            response.resume();
        });
        this.on('pause', () => {
            response.pause();
        });
        response.once('end', () => {
            this.push(null);
        });
        if (this._noPipe) {
            const success = await this._setRawBody();
            if (success) {
                this.emit('response', response);
            }
            return;
        }
        this.emit('response', response);
        for (const destination of this._pipedServerResponses) {
            if (destination.headersSent) {
                continue;
            }
            // eslint-disable-next-line guard-for-in
            for (const key in response.headers) {
                const isAllowed = options.decompress ? key !== 'content-encoding' : true;
                const value = response.headers[key];
                if (isAllowed) {
                    destination.setHeader(key, value);
                }
            }
            destination.statusCode = statusCode;
        }
    }
    async _setRawBody(from = this) {
        if (from.readableEnded) {
            return false;
        }
        try {
            // Errors are emitted via the `error` event
            const rawBody = await getStreamAsBuffer(from);
            // TODO: Switch to this:
            // let rawBody = await from.toArray();
            // rawBody = Buffer.concat(rawBody);
            // On retry Request is destroyed with no error, therefore the above will successfully resolve.
            // So in order to check if this was really successfull, we need to check if it has been properly ended.
            if (!this.isAborted) {
                this.response.rawBody = rawBody;
                return true;
            }
        }
        catch { }
        return false;
    }
    async _onResponse(response) {
        try {
            await this._onResponseBase(response);
        }
        catch (error) {
            /* istanbul ignore next: better safe than sorry */
            this._beforeError(error);
        }
    }
    _onRequest(request) {
        const { options } = this;
        const { timeout, url } = options;
        http_timer_dist_source(request);
        if (this.options.http2) {
            // Unset stream timeout, as the `timeout` option was used only for connection timeout.
            request.setTimeout(0);
        }
        this._cancelTimeouts = timedOut(request, timeout, url);
        const responseEventName = options.cache ? 'cacheableResponse' : 'response';
        request.once(responseEventName, (response) => {
            void this._onResponse(response);
        });
        request.once('error', (error) => {
            this._aborted = true;
            // Force clean-up, because some packages (e.g. nock) don't do this.
            request.destroy();
            error = error instanceof timed_out_TimeoutError ? new TimeoutError(error, this.timings, this) : new RequestError(error.message, error, this);
            this._beforeError(error);
        });
        this._unproxyEvents = proxyEvents(request, this, proxiedRequestEvents);
        this._request = request;
        this.emit('uploadProgress', this.uploadProgress);
        this._sendBody();
        this.emit('request', request);
    }
    async _asyncWrite(chunk) {
        return new Promise((resolve, reject) => {
            super.write(chunk, error => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
    _sendBody() {
        // Send body
        const { body } = this.options;
        const currentRequest = this.redirectUrls.length === 0 ? this : this._request ?? this;
        if (dist.nodeStream(body)) {
            body.pipe(currentRequest);
        }
        else if (dist.generator(body) || dist.asyncGenerator(body)) {
            (async () => {
                try {
                    for await (const chunk of body) {
                        await this._asyncWrite(chunk);
                    }
                    super.end();
                }
                catch (error) {
                    this._beforeError(error);
                }
            })();
        }
        else if (!dist.undefined(body)) {
            this._writeRequest(body, undefined, () => { });
            currentRequest.end();
        }
        else if (this._cannotHaveBody || this._noPipe) {
            currentRequest.end();
        }
    }
    _prepareCache(cache) {
        if (!cacheableStore.has(cache)) {
            const cacheableRequest = new cacheable_request_dist(((requestOptions, handler) => {
                const result = requestOptions._request(requestOptions, handler);
                // TODO: remove this when `cacheable-request` supports async request functions.
                if (dist.promise(result)) {
                    // We only need to implement the error handler in order to support HTTP2 caching.
                    // The result will be a promise anyway.
                    // @ts-expect-error ignore
                    result.once = (event, handler) => {
                        if (event === 'error') {
                            (async () => {
                                try {
                                    await result;
                                }
                                catch (error) {
                                    handler(error);
                                }
                            })();
                        }
                        else if (event === 'abort') {
                            // The empty catch is needed here in case when
                            // it rejects before it's `await`ed in `_makeRequest`.
                            (async () => {
                                try {
                                    const request = (await result);
                                    request.once('abort', handler);
                                }
                                catch { }
                            })();
                        }
                        else {
                            /* istanbul ignore next: safety check */
                            throw new Error(`Unknown HTTP2 promise event: ${event}`);
                        }
                        return result;
                    };
                }
                return result;
            }), cache);
            cacheableStore.set(cache, cacheableRequest.request());
        }
    }
    async _createCacheableRequest(url, options) {
        return new Promise((resolve, reject) => {
            // TODO: Remove `utils/url-to-options.ts` when `cacheable-request` is fixed
            Object.assign(options, urlToOptions(url));
            let request;
            // TODO: Fix `cacheable-response`. This is ugly.
            const cacheRequest = cacheableStore.get(options.cache)(options, async (response) => {
                response._readableState.autoDestroy = false;
                if (request) {
                    const fix = () => {
                        if (response.req) {
                            response.complete = response.req.res.complete;
                        }
                    };
                    response.prependOnceListener('end', fix);
                    fix();
                    (await request).emit('cacheableResponse', response);
                }
                resolve(response);
            });
            cacheRequest.once('error', reject);
            cacheRequest.once('request', async (requestOrPromise) => {
                request = requestOrPromise;
                resolve(request);
            });
        });
    }
    async _makeRequest() {
        const { options } = this;
        const { headers, username, password } = options;
        const cookieJar = options.cookieJar;
        for (const key in headers) {
            if (dist.undefined(headers[key])) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete headers[key];
            }
            else if (dist.null_(headers[key])) {
                throw new TypeError(`Use \`undefined\` instead of \`null\` to delete the \`${key}\` header`);
            }
        }
        if (options.decompress && dist.undefined(headers['accept-encoding'])) {
            headers['accept-encoding'] = supportsBrotli ? 'gzip, deflate, br' : 'gzip, deflate';
        }
        if (username || password) {
            const credentials = external_node_buffer_namespaceObject.Buffer.from(`${username}:${password}`).toString('base64');
            headers.authorization = `Basic ${credentials}`;
        }
        // Set cookies
        if (cookieJar) {
            const cookieString = await cookieJar.getCookieString(options.url.toString());
            if (dist.nonEmptyString(cookieString)) {
                headers.cookie = cookieString;
            }
        }
        // Reset `prefixUrl`
        options.prefixUrl = '';
        let request;
        for (const hook of options.hooks.beforeRequest) {
            // eslint-disable-next-line no-await-in-loop
            const result = await hook(options);
            if (!dist.undefined(result)) {
                // @ts-expect-error Skip the type mismatch to support abstract responses
                request = () => result;
                break;
            }
        }
        if (!request) {
            request = options.getRequestFunction();
        }
        const url = options.url;
        this._requestOptions = options.createNativeRequestOptions();
        if (options.cache) {
            this._requestOptions._request = request;
            this._requestOptions.cache = options.cache;
            this._requestOptions.body = options.body;
            this._prepareCache(options.cache);
        }
        // Cache support
        const fn = options.cache ? this._createCacheableRequest : request;
        try {
            // We can't do `await fn(...)`,
            // because stream `error` event can be emitted before `Promise.resolve()`.
            let requestOrResponse = fn(url, this._requestOptions);
            if (dist.promise(requestOrResponse)) {
                requestOrResponse = await requestOrResponse;
            }
            // Fallback
            if (dist.undefined(requestOrResponse)) {
                requestOrResponse = options.getFallbackRequestFunction()(url, this._requestOptions);
                if (dist.promise(requestOrResponse)) {
                    requestOrResponse = await requestOrResponse;
                }
            }
            if (is_client_request(requestOrResponse)) {
                this._onRequest(requestOrResponse);
            }
            else if (this.writable) {
                this.once('finish', () => {
                    void this._onResponse(requestOrResponse);
                });
                this._sendBody();
            }
            else {
                void this._onResponse(requestOrResponse);
            }
        }
        catch (error) {
            if (error instanceof types_CacheError) {
                throw new CacheError(error, this);
            }
            throw error;
        }
    }
    async _error(error) {
        try {
            if (error instanceof HTTPError && !this.options.throwHttpErrors) {
                // This branch can be reached only when using the Promise API
                // Skip calling the hooks on purpose.
                // See https://github.com/sindresorhus/got/issues/2103
            }
            else {
                for (const hook of this.options.hooks.beforeError) {
                    // eslint-disable-next-line no-await-in-loop
                    error = await hook(error);
                }
            }
        }
        catch (error_) {
            error = new RequestError(error_.message, error_, this);
        }
        this.destroy(error);
    }
    _writeRequest(chunk, encoding, callback) {
        if (!this._request || this._request.destroyed) {
            // Probably the `ClientRequest` instance will throw
            return;
        }
        this._request.write(chunk, encoding, (error) => {
            // The `!destroyed` check is required to prevent `uploadProgress` being emitted after the stream was destroyed
            if (!error && !this._request.destroyed) {
                this._uploadedSize += external_node_buffer_namespaceObject.Buffer.byteLength(chunk, encoding);
                const progress = this.uploadProgress;
                if (progress.percent < 1) {
                    this.emit('uploadProgress', progress);
                }
            }
            callback(error);
        });
    }
    /**
    The remote IP address.
    */
    get ip() {
        return this.socket?.remoteAddress;
    }
    /**
    Indicates whether the request has been aborted or not.
    */
    get isAborted() {
        return this._aborted;
    }
    get socket() {
        return this._request?.socket ?? undefined;
    }
    /**
    Progress event for downloading (receiving a response).
    */
    get downloadProgress() {
        let percent;
        if (this._responseSize) {
            percent = this._downloadedSize / this._responseSize;
        }
        else if (this._responseSize === this._downloadedSize) {
            percent = 1;
        }
        else {
            percent = 0;
        }
        return {
            percent,
            transferred: this._downloadedSize,
            total: this._responseSize,
        };
    }
    /**
    Progress event for uploading (sending a request).
    */
    get uploadProgress() {
        let percent;
        if (this._bodySize) {
            percent = this._uploadedSize / this._bodySize;
        }
        else if (this._bodySize === this._uploadedSize) {
            percent = 1;
        }
        else {
            percent = 0;
        }
        return {
            percent,
            transferred: this._uploadedSize,
            total: this._bodySize,
        };
    }
    /**
    The object contains the following properties:

    - `start` - Time when the request started.
    - `socket` - Time when a socket was assigned to the request.
    - `lookup` - Time when the DNS lookup finished.
    - `connect` - Time when the socket successfully connected.
    - `secureConnect` - Time when the socket securely connected.
    - `upload` - Time when the request finished uploading.
    - `response` - Time when the request fired `response` event.
    - `end` - Time when the response fired `end` event.
    - `error` - Time when the request fired `error` event.
    - `abort` - Time when the request fired `abort` event.
    - `phases`
        - `wait` - `timings.socket - timings.start`
        - `dns` - `timings.lookup - timings.socket`
        - `tcp` - `timings.connect - timings.lookup`
        - `tls` - `timings.secureConnect - timings.connect`
        - `request` - `timings.upload - (timings.secureConnect || timings.connect)`
        - `firstByte` - `timings.response - timings.upload`
        - `download` - `timings.end - timings.response`
        - `total` - `(timings.end || timings.error || timings.abort) - timings.start`

    If something has not been measured yet, it will be `undefined`.

    __Note__: The time is a `number` representing the milliseconds elapsed since the UNIX epoch.
    */
    get timings() {
        return this._request?.timings;
    }
    /**
    Whether the response was retrieved from the cache.
    */
    get isFromCache() {
        return this._isFromCache;
    }
    get reusedSocket() {
        return this._request?.reusedSocket;
    }
}

;// CONCATENATED MODULE: ./node_modules/got/dist/source/as-promise/types.js

/**
An error to be thrown when the request is aborted with `.cancel()`.
*/
class types_CancelError extends RequestError {
    constructor(request) {
        super('Promise was canceled', {}, request);
        this.name = 'CancelError';
        this.code = 'ERR_CANCELED';
    }
    /**
    Whether the promise is canceled.
    */
    get isCanceled() {
        return true;
    }
}

;// CONCATENATED MODULE: ./node_modules/got/dist/source/as-promise/index.js








const as_promise_proxiedRequestEvents = [
    'request',
    'response',
    'redirect',
    'uploadProgress',
    'downloadProgress',
];
function asPromise(firstRequest) {
    let globalRequest;
    let globalResponse;
    let normalizedOptions;
    const emitter = new external_node_events_namespaceObject.EventEmitter();
    const promise = new PCancelable((resolve, reject, onCancel) => {
        onCancel(() => {
            globalRequest.destroy();
        });
        onCancel.shouldReject = false;
        onCancel(() => {
            reject(new types_CancelError(globalRequest));
        });
        const makeRequest = (retryCount) => {
            // Errors when a new request is made after the promise settles.
            // Used to detect a race condition.
            // See https://github.com/sindresorhus/got/issues/1489
            onCancel(() => { });
            const request = firstRequest ?? new Request(undefined, undefined, normalizedOptions);
            request.retryCount = retryCount;
            request._noPipe = true;
            globalRequest = request;
            request.once('response', async (response) => {
                // Parse body
                const contentEncoding = (response.headers['content-encoding'] ?? '').toLowerCase();
                const isCompressed = contentEncoding === 'gzip' || contentEncoding === 'deflate' || contentEncoding === 'br';
                const { options } = request;
                if (isCompressed && !options.decompress) {
                    response.body = response.rawBody;
                }
                else {
                    try {
                        response.body = parseBody(response, options.responseType, options.parseJson, options.encoding);
                    }
                    catch (error) {
                        // Fall back to `utf8`
                        response.body = response.rawBody.toString();
                        if (isResponseOk(response)) {
                            request._beforeError(error);
                            return;
                        }
                    }
                }
                try {
                    const hooks = options.hooks.afterResponse;
                    for (const [index, hook] of hooks.entries()) {
                        // @ts-expect-error TS doesn't notice that CancelableRequest is a Promise
                        // eslint-disable-next-line no-await-in-loop
                        response = await hook(response, async (updatedOptions) => {
                            options.merge(updatedOptions);
                            options.prefixUrl = '';
                            if (updatedOptions.url) {
                                options.url = updatedOptions.url;
                            }
                            // Remove any further hooks for that request, because we'll call them anyway.
                            // The loop continues. We don't want duplicates (asPromise recursion).
                            options.hooks.afterResponse = options.hooks.afterResponse.slice(0, index);
                            throw new RetryError(request);
                        });
                        if (!(dist.object(response) && dist.number(response.statusCode) && !dist.nullOrUndefined(response.body))) {
                            throw new TypeError('The `afterResponse` hook returned an invalid value');
                        }
                    }
                }
                catch (error) {
                    request._beforeError(error);
                    return;
                }
                globalResponse = response;
                if (!isResponseOk(response)) {
                    request._beforeError(new HTTPError(response));
                    return;
                }
                request.destroy();
                resolve(request.options.resolveBodyOnly ? response.body : response);
            });
            const onError = (error) => {
                if (promise.isCanceled) {
                    return;
                }
                const { options } = request;
                if (error instanceof HTTPError && !options.throwHttpErrors) {
                    const { response } = error;
                    request.destroy();
                    resolve(request.options.resolveBodyOnly ? response.body : response);
                    return;
                }
                reject(error);
            };
            request.once('error', onError);
            const previousBody = request.options?.body;
            request.once('retry', (newRetryCount, error) => {
                firstRequest = undefined;
                const newBody = request.options.body;
                if (previousBody === newBody && dist.nodeStream(newBody)) {
                    error.message = 'Cannot retry with consumed body stream';
                    onError(error);
                    return;
                }
                // This is needed! We need to reuse `request.options` because they can get modified!
                // For example, by calling `promise.json()`.
                normalizedOptions = request.options;
                makeRequest(newRetryCount);
            });
            proxyEvents(request, emitter, as_promise_proxiedRequestEvents);
            if (dist.undefined(firstRequest)) {
                void request.flush();
            }
        };
        makeRequest(0);
    });
    promise.on = (event, fn) => {
        emitter.on(event, fn);
        return promise;
    };
    promise.off = (event, fn) => {
        emitter.off(event, fn);
        return promise;
    };
    const shortcut = (responseType) => {
        const newPromise = (async () => {
            // Wait until downloading has ended
            await promise;
            const { options } = globalResponse.request;
            return parseBody(globalResponse, responseType, options.parseJson, options.encoding);
        })();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        Object.defineProperties(newPromise, Object.getOwnPropertyDescriptors(promise));
        return newPromise;
    };
    promise.json = () => {
        if (globalRequest.options) {
            const { headers } = globalRequest.options;
            if (!globalRequest.writableFinished && !('accept' in headers)) {
                headers.accept = 'application/json';
            }
        }
        return shortcut('json');
    };
    promise.buffer = () => shortcut('buffer');
    promise.text = () => shortcut('text');
    return promise;
}

;// CONCATENATED MODULE: ./node_modules/got/dist/source/create.js




// The `delay` package weighs 10KB (!)
const delay = async (ms) => new Promise(resolve => {
    setTimeout(resolve, ms);
});
const isGotInstance = (value) => dist.function_(value);
const aliases = [
    'get',
    'post',
    'put',
    'patch',
    'head',
    'delete',
];
const create = (defaults) => {
    defaults = {
        options: new Options(undefined, undefined, defaults.options),
        handlers: [...defaults.handlers],
        mutableDefaults: defaults.mutableDefaults,
    };
    Object.defineProperty(defaults, 'mutableDefaults', {
        enumerable: true,
        configurable: false,
        writable: false,
    });
    // Got interface
    const got = ((url, options, defaultOptions = defaults.options) => {
        const request = new Request(url, options, defaultOptions);
        let promise;
        const lastHandler = (normalized) => {
            // Note: `options` is `undefined` when `new Options(...)` fails
            request.options = normalized;
            request._noPipe = !normalized.isStream;
            void request.flush();
            if (normalized.isStream) {
                return request;
            }
            if (!promise) {
                promise = asPromise(request);
            }
            return promise;
        };
        let iteration = 0;
        const iterateHandlers = (newOptions) => {
            const handler = defaults.handlers[iteration++] ?? lastHandler;
            const result = handler(newOptions, iterateHandlers);
            if (dist.promise(result) && !request.options.isStream) {
                if (!promise) {
                    promise = asPromise(request);
                }
                if (result !== promise) {
                    const descriptors = Object.getOwnPropertyDescriptors(promise);
                    for (const key in descriptors) {
                        if (key in result) {
                            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                            delete descriptors[key];
                        }
                    }
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    Object.defineProperties(result, descriptors);
                    result.cancel = promise.cancel;
                }
            }
            return result;
        };
        return iterateHandlers(request.options);
    });
    got.extend = (...instancesOrOptions) => {
        const options = new Options(undefined, undefined, defaults.options);
        const handlers = [...defaults.handlers];
        let mutableDefaults;
        for (const value of instancesOrOptions) {
            if (isGotInstance(value)) {
                options.merge(value.defaults.options);
                handlers.push(...value.defaults.handlers);
                mutableDefaults = value.defaults.mutableDefaults;
            }
            else {
                options.merge(value);
                if (value.handlers) {
                    handlers.push(...value.handlers);
                }
                mutableDefaults = value.mutableDefaults;
            }
        }
        return create({
            options,
            handlers,
            mutableDefaults: Boolean(mutableDefaults),
        });
    };
    // Pagination
    const paginateEach = (async function* (url, options) {
        let normalizedOptions = new Options(url, options, defaults.options);
        normalizedOptions.resolveBodyOnly = false;
        const { pagination } = normalizedOptions;
        assert.function_(pagination.transform);
        assert.function_(pagination.shouldContinue);
        assert.function_(pagination.filter);
        assert.function_(pagination.paginate);
        assert.number(pagination.countLimit);
        assert.number(pagination.requestLimit);
        assert.number(pagination.backoff);
        const allItems = [];
        let { countLimit } = pagination;
        let numberOfRequests = 0;
        while (numberOfRequests < pagination.requestLimit) {
            if (numberOfRequests !== 0) {
                // eslint-disable-next-line no-await-in-loop
                await delay(pagination.backoff);
            }
            // eslint-disable-next-line no-await-in-loop
            const response = (await got(undefined, undefined, normalizedOptions));
            // eslint-disable-next-line no-await-in-loop
            const parsed = await pagination.transform(response);
            const currentItems = [];
            assert.array(parsed);
            for (const item of parsed) {
                if (pagination.filter({ item, currentItems, allItems })) {
                    if (!pagination.shouldContinue({ item, currentItems, allItems })) {
                        return;
                    }
                    yield item;
                    if (pagination.stackAllItems) {
                        allItems.push(item);
                    }
                    currentItems.push(item);
                    if (--countLimit <= 0) {
                        return;
                    }
                }
            }
            const optionsToMerge = pagination.paginate({
                response,
                currentItems,
                allItems,
            });
            if (optionsToMerge === false) {
                return;
            }
            if (optionsToMerge === response.request.options) {
                normalizedOptions = response.request.options;
            }
            else {
                normalizedOptions.merge(optionsToMerge);
                assert.any([dist.urlInstance, dist.undefined], optionsToMerge.url);
                if (optionsToMerge.url !== undefined) {
                    normalizedOptions.prefixUrl = '';
                    normalizedOptions.url = optionsToMerge.url;
                }
            }
            numberOfRequests++;
        }
    });
    got.paginate = paginateEach;
    got.paginate.all = (async (url, options) => {
        const results = [];
        for await (const item of paginateEach(url, options)) {
            results.push(item);
        }
        return results;
    });
    // For those who like very descriptive names
    got.paginate.each = paginateEach;
    // Stream API
    got.stream = ((url, options) => got(url, { ...options, isStream: true }));
    // Shortcuts
    for (const method of aliases) {
        got[method] = ((url, options) => got(url, { ...options, method }));
        got.stream[method] = ((url, options) => got(url, { ...options, method, isStream: true }));
    }
    if (!defaults.mutableDefaults) {
        Object.freeze(defaults.handlers);
        defaults.options.freeze();
    }
    Object.defineProperty(got, 'defaults', {
        value: defaults,
        writable: false,
        configurable: false,
        enumerable: true,
    });
    return got;
};
/* harmony default export */ const source_create = (create);

;// CONCATENATED MODULE: ./node_modules/got/dist/source/index.js


const defaults = {
    options: new Options(),
    handlers: [],
    mutableDefaults: false,
};
const got = source_create(defaults);
/* harmony default export */ const got_dist_source = (got);












// EXTERNAL MODULE: ./node_modules/form-data/lib/form_data.js
var form_data = __nccwpck_require__(4334);
// EXTERNAL MODULE: external "fs"
var external_fs_ = __nccwpck_require__(7147);
;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/errors.js
var errors_PangeaErrors;
(function (PangeaErrors) {
    class PangeaError extends Error {
        constructor(message) {
            super(message);
            this.name = "PangeaGeneralError";
        }
    }
    PangeaErrors.PangeaError = PangeaError;
    class AuditError extends PangeaError {
        constructor(message) {
            super(message);
            this.name = "PangeaAuditError";
        }
    }
    PangeaErrors.AuditError = AuditError;
    class AuditEventError extends AuditError {
        constructor(message, envelope) {
            super(message);
            Object.defineProperty(this, "envelope", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            this.name = "PangeaAuditEventError";
            this.envelope = envelope;
        }
    }
    PangeaErrors.AuditEventError = AuditEventError;
    class APIError extends Error {
        constructor(message, response) {
            super(message);
            Object.defineProperty(this, "response", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            this.name = "PangeanAPIError";
            response.result = response.result;
            this.response = response;
        }
        get pangeaResponse() {
            return this.response;
        }
        get summary() {
            return this.response.summary;
        }
        get errors() {
            return this.response.result?.errors || [];
        }
        toString() {
            let ret = "Summary: ";
            ret += this.response.summary + "\n";
            (this.response.result?.errors || []).forEach((ef) => {
                ret += "\t" + ef.detail + "\n";
            });
            return ret;
        }
    }
    PangeaErrors.APIError = APIError;
    //Pangea Validation Errors denoting issues with an API request
    class ValidationError extends APIError {
        constructor(message, response) {
            super(message, response);
            this.name = "ValidationError";
        }
    }
    PangeaErrors.ValidationError = ValidationError;
    //Too many requests were made
    class RateLimiteError extends APIError {
        constructor(message, response) {
            super(message, response);
            this.name = "RateLimiteError";
        }
    }
    PangeaErrors.RateLimiteError = RateLimiteError;
    class NotFound extends APIError {
        constructor(url, response) {
            super("Resource " + url + " not found", response);
            this.name = "NotFound";
        }
    }
    PangeaErrors.NotFound = NotFound;
    //API usage requires payment"""
    class NoCreditError extends APIError {
        constructor(message, response) {
            super(message, response);
            this.name = "NoCreditError";
        }
    }
    PangeaErrors.NoCreditError = NoCreditError;
    //User is not authorized to access a given resource
    class UnauthorizedError extends APIError {
        constructor(serviceName, response) {
            let message = "User is not authorized to access service " + serviceName;
            super(message, response);
            this.name = "UnauthorizedError";
        }
    }
    PangeaErrors.UnauthorizedError = UnauthorizedError;
    // Service not enabled
    class ServiceNotEnabledError extends APIError {
        constructor(serviceName, response) {
            let message = String(serviceName) +
                " is not enabled. Go to console.pangea.cloud/service/{service_name} to enable";
            super(message, response);
            this.name = "ServiceNotEnabledError";
        }
    }
    PangeaErrors.ServiceNotEnabledError = ServiceNotEnabledError;
    // No config ID was provided in either token scopes or explicitly
    class MissingConfigID extends APIError {
        constructor(serviceName, response) {
            let message = "Token did not contain a config scope for service " +
                serviceName +
                ". Create a new token or provide a config ID explicitly in the service base";
            super(message, response);
            this.name = "ServiceNotEnabledError";
        }
    }
    PangeaErrors.MissingConfigID = MissingConfigID;
    // Downstream provider error
    class ProviderError extends APIError {
        constructor(message, response) {
            super(message, response);
            this.name = "ProviderError";
        }
    }
    PangeaErrors.ProviderError = ProviderError;
    // A pangea service error
    class InternalServerError extends APIError {
        constructor(response) {
            const message = `summary: ${response.summary}. request_id: ${response.request_id}. request_time: ${response.request_time}. response_time: ${response.response_time}`;
            super(message, response);
            this.name = "InternalServerError";
        }
    }
    PangeaErrors.InternalServerError = InternalServerError;
    // Accepted request exception. Async response
    class AcceptedRequestException extends APIError {
        constructor(response) {
            const message = `summary: ${response.summary}. request_id: ${response.request_id}.`;
            super(message, response);
            Object.defineProperty(this, "request_id", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            this.request_id = response.request_id;
            this.name = "AcceptedRequestException";
        }
    }
    PangeaErrors.AcceptedRequestException = AcceptedRequestException;
    // Service is not currently available
    class ServiceNotAvailableError extends APIError {
        constructor(message, response) {
            super(message, response);
            this.name = "ServiceNotAvailableError";
        }
    }
    PangeaErrors.ServiceNotAvailableError = ServiceNotAvailableError;
    class InvalidPayloadReceived extends APIError {
        constructor(message, response) {
            super(message, response);
            this.name = "InvalidPayloadReceived";
        }
    }
    PangeaErrors.InvalidPayloadReceived = InvalidPayloadReceived;
    class ForbiddenVaultOperation extends APIError {
        constructor(message, response) {
            super(message, response);
            this.name = "ForbiddenVaultOperation";
        }
    }
    PangeaErrors.ForbiddenVaultOperation = ForbiddenVaultOperation;
})(errors_PangeaErrors || (errors_PangeaErrors = {}));

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/response.js
const SupportedJSONFields = ["message", "new", "old"];
/**
 * Pangea Response object
 */
class ResponseObject {
    constructor(body) {
        Object.defineProperty(this, "request_id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidPayloadReceived"
        });
        Object.defineProperty(this, "request_time", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidPayloadReceived"
        });
        Object.defineProperty(this, "response_time", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidPayloadReceived"
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidPayloadReceived"
        });
        Object.defineProperty(this, "result", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "summary", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidPayloadReceived"
        });
        Object.assign(this, body);
    }
}
class PangeaResponse extends ResponseObject {
    constructor(response) {
        const obj = JSON.parse(JSON.stringify(response.body), parseJSONfields);
        super(obj);
        Object.defineProperty(this, "gotResponse", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "success", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.gotResponse = response;
        this.success = this.status === "Success";
        this.result = this.result == null ? {} : this.result;
    }
    // Return raw Pangea API response body
    body() {
        return this.gotResponse?.body;
    }
    // Return SDK PangeaResponse object as JSON (excluded raw API response body)
    toJSON() {
        return JSON.stringify({ ...this, gotResponse: undefined }, null, "  ");
    }
}
function parseJSONfields(key, value) {
    if (SupportedJSONFields.includes(key) && typeof value === "string") {
        try {
            // @ts-ignore
            const obj = JSON.parse(value);
            return obj;
        }
        catch (e) {
            return value;
        }
    }
    else {
        return value;
    }
}
/* harmony default export */ const response = (PangeaResponse);

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/request.js







const request_delay = async (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});
class PangeaRequest {
    constructor(serviceName, token, config, isMultiConfigSupported = false) {
        Object.defineProperty(this, "serviceName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "extraHeaders", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isMultiConfigSupported", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        if (!serviceName)
            throw new Error("A serviceName is required");
        if (!token)
            throw new Error("A token is required");
        this.serviceName = serviceName;
        this.token = token;
        this.config = new dist_config({ ...config });
        this.setCustomUserAgent(config.customUserAgent);
        this.extraHeaders = {};
        this.isMultiConfigSupported = isMultiConfigSupported;
    }
    checkConfigID(data) {
        if (this.isMultiConfigSupported && this.config.configID && data.config_id === undefined) {
            data.config_id = this.config.configID;
        }
    }
    async post(endpoint, data, options = {}) {
        const url = this.getUrl(endpoint);
        this.checkConfigID(data);
        const request = new Options({
            headers: this.getHeaders(),
            json: data,
            retry: { limit: this.config.requestRetries },
            responseType: "json",
        });
        return await this.doPost(url, request, options);
    }
    async postMultipart(endpoint, data, filepath, options = {}) {
        const url = this.getUrl(endpoint);
        const form = new form_data();
        this.checkConfigID(data);
        form.append("request", JSON.stringify(data), { contentType: "application/json" });
        form.append("upload", external_fs_.createReadStream(filepath), {
            contentType: "application/octet-stream",
        });
        const request = new Options({
            headers: this.getHeaders(),
            body: form,
            retry: { limit: this.config.requestRetries },
            responseType: "json",
        });
        return await this.doPost(url, request, options);
    }
    async doPost(url, request, options = {}) {
        try {
            const apiCall = (await got_dist_source.post(url, request));
            let pangeaResponse = new PangeaResponse(apiCall);
            if (pangeaResponse.gotResponse?.statusCode === 202 && this.config.queuedRetryEnabled) {
                if (options.pollResultSync) {
                    pangeaResponse = await this.handleAsync(pangeaResponse);
                }
                return this.checkResponse(pangeaResponse);
            }
            return this.checkResponse(pangeaResponse);
        }
        catch (error) {
            if (error instanceof HTTPError) {
                // This MUST throw and error
                return this.checkResponse(new PangeaResponse(error.response));
            }
            // TODO: add handling of lower level errors?
            throw error;
        }
    }
    async get(endpoint, checkResponse = true) {
        const url = this.getUrl(endpoint);
        const options = new Options({
            headers: this.getHeaders(),
            retry: { limit: this.config.requestRetries },
            responseType: "json",
        });
        try {
            const response = (await got_dist_source.get(url, options));
            const pangeaResponse = new PangeaResponse(response);
            return checkResponse ? this.checkResponse(pangeaResponse) : pangeaResponse;
        }
        catch (error) {
            if (error instanceof HTTPError) {
                // This MUST throw and error
                const pangeaResponse = new PangeaResponse(error.response);
                return checkResponse ? this.checkResponse(pangeaResponse) : pangeaResponse;
            }
            // TODO: add handling of lower level errors?
            throw error;
        }
    }
    getDelay(retryCount, start) {
        let delay = retryCount * retryCount * 1000;
        const now = Date.now();
        if (now + delay > start + this.config.pollResultTimeoutMs) {
            delay = start + this.config.pollResultTimeoutMs - now;
        }
        return delay;
    }
    reachTimeout(start) {
        const now = Date.now();
        return start + this.config.pollResultTimeoutMs <= now;
    }
    async pollResult(requestId, checkResponse = true) {
        const path = `request/${requestId}`;
        // eslint-disable-next-line no-await-in-loop
        return await this.get(path, checkResponse);
    }
    async handleAsync(pangeaResponse) {
        let retryCount = 0;
        const start = Date.now();
        const body = pangeaResponse.gotResponse?.body;
        const requestId = body?.request_id;
        while (pangeaResponse.gotResponse?.statusCode === 202 && !this.reachTimeout(start)) {
            retryCount += 1;
            const waitTime = this.getDelay(retryCount, start);
            // eslint-disable-next-line no-await-in-loop
            await request_delay(waitTime);
            pangeaResponse = await this.pollResult(requestId, false);
        }
        return pangeaResponse;
    }
    setExtraHeaders(headers) {
        this.extraHeaders = { ...headers };
    }
    setCustomUserAgent(customUserAgent) {
        this.config.customUserAgent = customUserAgent;
        this.userAgent = `pangea-node/${version}`;
        if (this.config.customUserAgent) {
            this.userAgent += ` ${this.config.customUserAgent}`;
        }
    }
    getUrl(path) {
        let url;
        if (this.config.domain.startsWith("http://") || this.config.domain.startsWith("https://")) {
            url = `${this.config.domain}/${path}`;
        }
        else {
            const schema = this.config?.insecure === true ? "http://" : "https://";
            if (this.config?.environment == ConfigEnv.LOCAL) {
                url = `${schema}${this.config.domain}/${path}`;
            }
            else {
                url = `${schema}${this.serviceName}.${this.config.domain}/${path}`;
            }
        }
        return url;
    }
    getHeaders() {
        const headers = {};
        const pangeaHeaders = {
            "User-Agent": this.userAgent,
            Authorization: `Bearer ${this.token}`,
        };
        if (Object.keys(this.extraHeaders).length > 0) {
            Object.assign(headers, this.extraHeaders);
        }
        // We want to overwrite extraHeaders if user set some of pangea headers values.
        Object.assign(headers, pangeaHeaders);
        return headers;
    }
    checkResponse(response) {
        if (response.success) {
            return response;
        }
        switch (response.status) {
            case "ValidationError":
                throw new errors_PangeaErrors.ValidationError(response.summary, response);
            case "TooManyRequests":
                throw new errors_PangeaErrors.RateLimiteError(response.summary, response);
            case "NoCredit":
                throw new errors_PangeaErrors.NoCreditError(response.summary, response);
            case "Unauthorized":
                throw new errors_PangeaErrors.UnauthorizedError(this.serviceName, response);
            case "ServiceNotEnabled":
                throw new errors_PangeaErrors.ServiceNotAvailableError(this.serviceName, response);
            case "ProviderError":
                throw new errors_PangeaErrors.ProviderError(response.summary, response);
            case "MissingConfigIDScope":
            case "MissingConfigID":
                throw new errors_PangeaErrors.MissingConfigID(this.serviceName, response);
            case "ServiceNotAvailable":
                throw new errors_PangeaErrors.ServiceNotAvailableError(this.serviceName, response);
            case "InvalidPayloadReceived":
                throw new errors_PangeaErrors.InvalidPayloadReceived(response.summary, response);
            case "ForbiddenVaultOperation":
                throw new errors_PangeaErrors.ForbiddenVaultOperation(response.summary, response);
            case "NotFound":
                throw new errors_PangeaErrors.NotFound(response.gotResponse?.requestUrl !== undefined
                    ? response.gotResponse.requestUrl.toString()
                    : "", response);
            case "InternalError":
                throw new errors_PangeaErrors.InternalServerError(response);
            case "Accepted":
                throw new errors_PangeaErrors.AcceptedRequestException(response);
            default:
                throw new errors_PangeaErrors.APIError(response.status, response);
        }
    }
}
/* harmony default export */ const request = (PangeaRequest);

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/base.js


class BaseService {
    /*
    Required:
      - serviceName: name of the service
      - token: a token to use with the service
  
    Optional:
      - config: a PangeaConfig object, uses defaults if non passed
    */
    constructor(serviceName, token, config) {
        Object.defineProperty(this, "serviceName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isMultiConfigSupported", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apiVersion", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "request_", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        if (!serviceName)
            throw new Error("A serviceName is required");
        if (!token)
            throw new Error("A token is required");
        this.serviceName = serviceName;
        this.apiVersion = "v1";
        this.token = token;
        this.config = new dist_config({ ...config }) || new dist_config();
    }
    async get(endpoint) {
        const fullpath = `${this.apiVersion}/${endpoint}`;
        return await this.request.get(fullpath);
    }
    async post(endpoint, data, options = {}) {
        const fullpath = `${this.apiVersion}/${endpoint}`;
        return await this.request.post(fullpath, data, options);
    }
    async postMultipart(endpoint, data, filepath, options = {}) {
        const fullpath = `${this.apiVersion}/${endpoint}`;
        return await this.request.postMultipart(fullpath, data, filepath, options);
    }
    async pollResult(request_id) {
        return await this.request.pollResult(request_id, true);
    }
    get request() {
        if (this.request_) {
            return this.request_;
        }
        this.request_ = new request(this.serviceName, this.token, this.config, this.isMultiConfigSupported);
        return this.request_;
    }
}
/* harmony default export */ const base = (BaseService);

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/utils/arweave.js
// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

const ARWEAVE_BASE_URL = "https://arweave.net";
const ARWEAVE_GRAPHQL_URL = `${ARWEAVE_BASE_URL}/graphql`;
const arweaveTransactionUrl = (transactionId) => {
    return `${ARWEAVE_BASE_URL}/${transactionId}/`;
};
const getArweavePublishedRoots = async (treeName, treeSizes, fetchRoot) => {
    if (!treeSizes.length)
        return {};
    const query = `
{
    transactions(
        tags: [
            {
                name: "tree_size"
                values: [${treeSizes.map((size) => `"${size}"`).join(", ")}]
            },
            {
                name: "tree_name"
                values: ["${treeName}"]
            }
        ]
    ) {
        edges {
            node {
                id
                tags {
                    name
                    value
                }
            }
        }
    }
}
    `;
    const options = new Options({
        json: { query },
        responseType: "json",
    });
    const response = (await got_dist_source.post(ARWEAVE_GRAPHQL_URL, options));
    if (response.statusCode !== 200)
        return {};
    const publishedRoots = {};
    const body = response.body;
    const edges = body?.data?.transactions?.edges ?? [];
    for (let idx = 0; idx < edges.length; idx++) {
        const edge = edges[idx];
        const nodeId = edge?.node?.id;
        const tags = edge?.node?.tags ?? [];
        const treeSizeTags = tags.filter((tag) => tag?.name === "tree_size");
        if (!treeSizeTags.length)
            continue;
        const treeSize = treeSizeTags[0]?.value;
        const transactionUrl = arweaveTransactionUrl(nodeId);
        const response = await got_dist_source.get({ url: transactionUrl });
        if (response.statusCode !== 200 || response.statusMessage === "Pending") {
            continue;
        }
        // @ts-ignore
        publishedRoots[treeSize] = {
            ...JSON.parse(response.body),
            transactionId: nodeId,
        };
    }
    for (let idx = 0; idx < treeSizes.length; idx++) {
        const treeSize = treeSizes[idx];
        if (treeSize && !(treeSize in publishedRoots)) {
            const root = await fetchRoot(treeSize).catch((err) => {
                console.log("Failed to fetch server roots", err);
            });
            if (root) {
                publishedRoots[treeSize] = {
                    ...root,
                };
            }
        }
    }
    return publishedRoots;
};

// EXTERNAL MODULE: ./node_modules/crypto-js/index.js
var crypto_js = __nccwpck_require__(4134);
// EXTERNAL MODULE: ./node_modules/merkle-tools/merkletools.js
var merkletools = __nccwpck_require__(4485);
;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/utils/signer.js




const allowedKeyTypes = (/* unused pure expression or super */ null && (["ed25519"]));
/**
 * Signer class to sign event in AuditService
 */
class Signer {
    constructor(privateKeyFilename) {
        Object.defineProperty(this, "privateKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.privateKey = createPrivateKey(fs.readFileSync(privateKeyFilename));
    }
    /**
     * @summary Sign data with private key and ED25519 algorithm
     * @description Fetch paginated results of a previously executed search
     * @param {String} data - data to be signed
     * @returns {string} - signature encoded in base64
     * @example
     * const signature = signer.sign("This is my message to sign")
     */
    sign(data) {
        if (!this.privateKey.asymmetricKeyType ||
            !allowedKeyTypes.includes(this.privateKey.asymmetricKeyType)) {
            throw new PangeaErrors.PangeaError(`Key type not supported: ${this.privateKey.asymmetricKeyType}`);
        }
        const bytes = Buffer.from(data);
        const signature = sign(null, bytes, this.privateKey);
        return signature.toString("base64");
    }
    /**
     * @summary Get public key of signer
     * @description create public key from signer's private key and return it
     * @returns {string} - public key encoded in base64
     * @example
     * const publicKey = signer.getPublicKey()
     */
    getPublicKey() {
        const pubKey = createPublicKey(this.privateKey);
        const pem = pubKey.export({ format: "pem", type: "spki" });
        return String(pem);
    }
    getAlgorithm() {
        switch (this.privateKey.asymmetricKeyType) {
            case "ed25519":
                return Vault.AsymmetricAlgorithm.Ed25519;
            default:
                return undefined;
        }
    }
}
/**
 * Verifier class to check event signature in AuditService
 */
class Verifier {
    /**
     * @summary Verify signature data
     * @description Check if data and signature correspond with public key
     * @param {String} data - data to be verified
     * @param {String} signB64 - base64 encoded signature from data
     * @param {String} publicKeyInput - base64 encoded or pem data public key
     * @returns {String} - True if signature correspond with public key, false otherwise
     * @example
     * const result = verifier.verify("")
     */
    verify(data, signB64, publicKeyInput) {
        let pubKey;
        const bytes = Buffer.from(data);
        const signBytes = Buffer.from(signB64, "base64");
        if (publicKeyInput.startsWith("-----")) {
            pubKey = (0,external_node_crypto_namespaceObject.createPublicKey)(publicKeyInput);
        }
        else {
            const publicKeyB64urlSafe = Buffer.from(publicKeyInput, "base64").toString("base64url");
            const rawKey = {
                crv: "Ed25519",
                x: publicKeyB64urlSafe,
                kty: "OKP",
            };
            try {
                const pubKey = (0,external_node_crypto_namespaceObject.createPublicKey)({
                    key: rawKey,
                    format: "jwk",
                });
                return (0,external_node_crypto_namespaceObject.verify)(null, bytes, pubKey, signBytes);
            }
            catch {
                return false;
            }
        }
        return pubKey != undefined ? (0,external_node_crypto_namespaceObject.verify)(null, bytes, pubKey, signBytes) : false;
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/utils/utils.js

function orderKeysRecursive(obj) {
    const orderedEntries = Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]));
    orderedEntries.forEach((value) => {
        if (value[1] instanceof Object) {
            value[1] = orderKeysRecursive(value[1]);
        }
    });
    const orderedObj = Object.fromEntries(orderedEntries);
    return orderedObj;
}
var replacer = function (key, value) {
    if (this[key] instanceof Date) {
        return this[key].toISOString();
    }
    return value;
};
function eventOrderAndStringifySubfields(obj) {
    const orderedEntries = Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]));
    orderedEntries.forEach((value) => {
        if (value[1] instanceof Date) {
            value[1] = value[1].toISOString();
        }
        else if (value[1] instanceof Object) {
            value[1] = JSON.stringify(value[1], replacer); // This is to stringify JSON objects in the same way server do
        }
    });
    const orderedObj = Object.fromEntries(orderedEntries);
    return orderedObj;
}
function canonicalize(obj) {
    return JSON.stringify(orderKeysRecursive(obj), replacer);
}
function canonicalizeEnvelope(obj) {
    const objCopy = JSON.parse(JSON.stringify(obj));
    if (objCopy.event !== undefined) {
        objCopy.event = eventOrderAndStringifySubfields(objCopy.event);
    }
    return canonicalize(objCopy);
}
function canonicalizeEvent(obj) {
    return canonicalize(eventOrderAndStringifySubfields(obj));
}
function strToB64(data) {
    return Buffer.from(data, "utf8").toString("base64");
}
function b64toStr(data) {
    return Buffer.from(data, "base64").toString("utf8");
}
function hashSHA256(data) {
    var sha256 = crypto_js.algo.SHA256.create();
    sha256.update(data);
    return sha256.finalize().toString();
}
function hashSHA1(data) {
    var sha1 = crypto_js.algo.SHA1.create();
    sha1.update(data);
    return sha1.finalize().toString();
}
function getHashPrefix(hash, len = 5) {
    return hash.substring(0, len);
}
const TestEnvironment = {
    DEVELOP: "DEV",
    LIVE: "LVE",
    STAGING: "STG",
};
function loadEnvVar(name) {
    const value = process.env[name];
    if (value === undefined) {
        throw new Error(`${name} environment variable need to be set`);
    }
    return value;
}
function getTestDomain(environment) {
    const name = "PANGEA_INTEGRATION_DOMAIN_" + environment;
    return loadEnvVar(name);
}
function getTestToken(environment) {
    const name = "PANGEA_INTEGRATION_TOKEN_" + environment;
    return loadEnvVar(name);
}
function getVaultSignatureTestToken(environment) {
    const name = "PANGEA_INTEGRATION_VAULT_TOKEN_" + environment;
    return loadEnvVar(name);
}
function getMultiConfigTestToken(environment) {
    const name = "PANGEA_INTEGRATION_MULTI_CONFIG_TOKEN_" + environment;
    return loadEnvVar(name);
}
function getConfigID(environment, service, configNumber) {
    const name = `PANGEA_${service.toUpperCase()}_CONFIG_ID_${configNumber}_` + environment;
    return loadEnvVar(name);
}
function getCustomSchemaTestToken(environment) {
    const name = "PANGEA_INTEGRATION_CUSTOM_SCHEMA_TOKEN_" + environment;
    return process.env[name] || "";
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/utils/verification.js
// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation




// @ts-ignore
const merkleTools = new merkletools();
function verifyLogHash(envelope, hash) {
    var sha256 = crypto_js.algo.SHA256.create();
    sha256.update(canonicalizeEnvelope(envelope));
    const calcHash = sha256.finalize().toString();
    return calcHash == hash;
}
const decodeHash = (value) => {
    return crypto_js.enc.Hex.parse(value);
};
const hashPair = (hash1, hash2) => {
    var sha256 = crypto_js.algo.SHA256.create();
    sha256.update(hash1);
    sha256.update(hash2);
    return sha256.finalize().toString();
};
const decodeProof = (data) => {
    const proof = [];
    data.split(",").forEach((item) => {
        const parts = item.split(":");
        proof.push({
            side: parts[0] == "l" ? "left" : "right",
            nodeHash: decodeHash(parts[1] || ""),
        });
    });
    return proof;
};
const constructProof = (data) => {
    if (data === "") {
        return [];
    }
    // @ts-ignore
    const proofs = data.split(",").map((item) => {
        const parts = item.split(":");
        if (parts.length >= 2) {
            const side = parts[0] == "l" ? "left" : "right";
            return {
                [side]: parts[1],
            };
        }
    });
    return proofs;
};
const decodeRootProof = (data) => {
    const rootProof = [];
    data.forEach((item) => {
        const [nodeHash, ...proofData] = item.split(",");
        rootProof.push({
            nodeHash: decodeHash(nodeHash?.split(":")[1] || ""),
            proof: decodeProof(proofData.join(",")),
        });
    });
    return rootProof;
};
const verifyLogProof = (initialNodeHash, rootHash, proofs) => {
    let nodeHash = initialNodeHash;
    for (let idx = 0; idx < proofs.length; idx++) {
        const proofHash = proofs[idx]?.nodeHash || "";
        nodeHash = decodeHash(proofs[idx]?.side === "left" ? hashPair(proofHash, nodeHash) : hashPair(nodeHash, proofHash));
    }
    return nodeHash.toString() === rootHash.toString();
};
const verifyLogMembershipProof = ({ log, newUnpublishedRootHash, }) => {
    if (!log.hash || log.membership_proof === undefined || newUnpublishedRootHash === undefined) {
        return "none";
    }
    const proofs = constructProof(log.membership_proof);
    return merkleTools.validateProof(
    // @ts-ignore
    proofs, log.hash, newUnpublishedRootHash)
        ? "pass"
        : "fail";
};
const verifyRecordMembershipProof = ({ record, root, }) => {
    if (!record.hash || record.membership_proof === undefined || root === undefined) {
        return "none";
    }
    const proofs = constructProof(record.membership_proof);
    return merkleTools.validateProof(
    // @ts-ignore
    proofs, record.hash, root.root_hash)
        ? "pass"
        : "fail";
};
const verifyLogConsistencyProof = ({ log, newUnpublishedRoot, prevUnpublishedRoot, }) => {
    if (log.consistency_proof !== undefined &&
        newUnpublishedRoot !== undefined &&
        prevUnpublishedRoot !== undefined) {
        return verifyConsistencyProof({
            newRootEncHash: newUnpublishedRoot,
            prevRootEncHash: prevUnpublishedRoot,
            consistencyProof: log.consistency_proof,
        })
            ? "pass"
            : "fail";
    }
    return "none";
};
const verifyConsistencyProof = ({ newRootEncHash, prevRootEncHash, consistencyProof, }) => {
    if (!newRootEncHash || !prevRootEncHash || !consistencyProof) {
        return false;
    }
    const prevRootHash = decodeHash(prevRootEncHash);
    const newRootHash = decodeHash(newRootEncHash);
    const proofs = decodeRootProof(consistencyProof);
    let rootHash = proofs[0]?.nodeHash || "";
    proofs.forEach((rootProof, idx) => {
        if (idx === 0)
            return;
        rootHash = decodeHash(hashPair(rootProof.nodeHash, rootHash));
    });
    if (rootHash.toString() !== prevRootHash.toString()) {
        return false;
    }
    for (var idx = 0; idx < proofs.length; idx++) {
        const rootProof = proofs[idx];
        if (!rootProof || !verifyLogProof(rootProof.nodeHash, newRootHash, rootProof.proof)) {
            return false;
        }
    }
    return true;
};
const verifyRecordConsistencyProof = ({ publishedRoots, record, }) => {
    // If not published should not verify consistency.
    if (!record.published) {
        return "none";
    }
    const leafIndex = Number(record.leaf_index);
    const newRoot = publishedRoots[leafIndex + 1];
    const prevRoot = publishedRoots[leafIndex];
    if (leafIndex == 0) {
        return "pass";
    }
    if (!newRoot || !prevRoot) {
        return "none";
    }
    return verifyConsistencyProof({
        newRootEncHash: newRoot.root_hash,
        prevRootEncHash: prevRoot.root_hash,
        consistencyProof: newRoot.consistency_proof,
    })
        ? "pass"
        : "fail";
};
const verifySignature = (envelope) => {
    // both undefined so "none" verification
    if (envelope?.signature === undefined && envelope?.public_key === undefined) {
        return "none";
    }
    // Just one undefined it's an error, so "fail"
    if (envelope?.signature === undefined || envelope?.public_key === undefined) {
        return "fail";
    }
    let pubKey = envelope.public_key;
    try {
        // Try to parse json for new public_key struct
        // @ts-ignore
        const obj = JSON.parse(pubKey);
        pubKey = obj["key"];
        if (pubKey === undefined) {
            return "fail";
        }
    }
    catch (e) {
        // If fails to parse, it's old format (just public key as string)
        pubKey = envelope.public_key;
    }
    const v = new Verifier();
    var data = canonicalizeEvent(envelope.event);
    return v.verify(data, envelope.signature, pubKey) ? "pass" : "fail";
};

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/audit.js





/**
 * AuditService class provides methods for interacting with the Audit Service
 * @extends BaseService
 */
class AuditService extends base {
    constructor(token, config, tenantID = undefined) {
        super("audit", token, config);
        Object.defineProperty(this, "publishedRoots", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "prevUnpublishedRootHash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tenantID", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.publishedRoots = {};
        this.publishedRoots = {};
        this.isMultiConfigSupported = true;
        this.apiVersion = "v1";
        this.prevUnpublishedRootHash = undefined;
        this.tenantID = tenantID;
    }
    /**
     * @summary Log an entry
     * @description Create a log entry in the Secure Audit Log.
     * @operationId audit_post_v1_log
     * @param {Object} content - A structured event describing an auditable activity. Supported fields are:
     *   - actor (string): Record who performed the auditable activity.
     *   - action (string): The auditable action that occurred.
     *   - status (string): Record whether or not the activity was successful.
     *   - source (string): Used to record the location from where an activity occurred.
     *   - target (string): Used to record the specific record that was targeted by the auditable activity.
     *   - message (string|object): A message describing a detailed account of what happened.
     *     This can be recorded as free-form text or as a JSON-formatted string.
     *   - new (string|object): The value of a record after it was changed.
     *   - old (string|object): The value of a record before it was changed.
     *   - tenant_id (string): Used to record the tenant associated with this activity.
     * @param {Object} options - Log options. The following log options are supported:
     *   - verbose (bool): Return a verbose response, including the canonical event hash and received_at time.
     * @returns {Promise} - A promise representing an async call to the log endpoint.
     * @example
     * ```js
     * const auditData = {
     *   action: "add_employee",
     *   actor: user,
     *   target: data.email,
     *   status: "error",
     *   message: `Resume denied - sanctioned country from ${clientIp}`,
     *   source: "web",
     * };
     *
     * const logResponse = await audit.log(auditData);
     * ```
     */
    async log(event, options = {}) {
        // Set tenant_id field if unset
        if (event.tenant_id === undefined && this.tenantID !== undefined) {
            event.tenant_id = this.tenantID;
        }
        event = eventOrderAndStringifySubfields(event);
        const data = { event: event };
        if (options.signer) {
            const signer = options.signer;
            const signature = signer.sign(canonicalizeEvent(event));
            const pubKey = signer.getPublicKey();
            const algorithm = signer.getAlgorithm();
            let publicKeyInfo = {};
            if (options.publicKeyInfo) {
                Object.assign(publicKeyInfo, options.publicKeyInfo);
            }
            publicKeyInfo["key"] = pubKey;
            publicKeyInfo["algorithm"] = algorithm;
            data.signature = signature;
            data.public_key = JSON.stringify(publicKeyInfo);
        }
        if (options?.verbose) {
            data.verbose = options.verbose;
        }
        if (options?.verify) {
            data.verbose = true;
            if (this.prevUnpublishedRootHash != undefined) {
                data.prev_root = this.prevUnpublishedRootHash;
            }
        }
        const response = await this.post("log", data);
        return this.processLogResponse(response, options);
    }
    async processLogResponse(response, options) {
        if (!response.success) {
            return response;
        }
        let newUnpublishedRootHash = response.result.unpublished_root;
        if (!options?.skipEventVerification) {
            this.verifyHash(response.result.envelope, response.result.hash);
            response.result.signature_verification = verifySignature(response.result.envelope);
        }
        if (options?.verify) {
            response.result.membership_verification = verifyLogMembershipProof({
                log: response.result,
                newUnpublishedRootHash: newUnpublishedRootHash,
            });
            response.result.consistency_verification = verifyLogConsistencyProof({
                log: response.result,
                newUnpublishedRoot: newUnpublishedRootHash,
                prevUnpublishedRoot: this.prevUnpublishedRootHash,
            });
        }
        if (newUnpublishedRootHash !== undefined) {
            this.prevUnpublishedRootHash = newUnpublishedRootHash;
        }
        return response;
    }
    verifyHash(envelope, hash) {
        if (envelope === undefined || hash === undefined) {
            return;
        }
        if (!verifyLogHash(envelope, hash)) {
            throw new errors_PangeaErrors.AuditEventError("Error: Fail event hash verification. Hash: " + hash, envelope);
        }
    }
    /**
     * @summary Search the log
     * @description Search for events that match the provided search criteria.
     * @operationId audit_post_v1_search
     * @param {String} query - Natural search string; list of keywords with optional
     *   `<option>:<value>` qualifiers. The following optional qualifiers are supported:
     *   - action:
     *   - actor:
     *   - message:
     *   - new:
     *   - old:
     *   - status:
     *   - target:
     * @param {Object} options - Search options. The following search options are supported:
     *   - limit (number): Maximum number of records to return per page.
     *   - start (string): The start of the time range to perform the search on.
     *   - end (string): The end of the time range to perform the search on. All records up to the latest if left out.
     *   - sources (array): A list of sources that the search can apply to. If empty or not provided, matches only the default source.
     * @returns {Promise} - A promise representing an async call to the search endpoint
     * @example
     * ```js
     * const response = await audit.search(
     *   "add_employee:Gumby"
     * );
     * ```
     */
    async search(query, queryOptions, options) {
        const defaults = {
            limit: 20,
            order: "desc",
            order_by: "received_at",
        };
        const payload = { query };
        Object.assign(payload, defaults);
        Object.assign(payload, queryOptions);
        if (options?.verifyConsistency) {
            payload.verbose = true;
        }
        const response = await this.post("search", payload);
        return this.processSearchResponse(response, options);
    }
    /**
     * @summary Results of a search
     * @description Fetch paginated results of a previously executed search.
     * @operationId audit_post_v1_results
     * @param {String} id - The id of a successful search
     * @param {number} limit (default 20) - The number of results returned
     * @param {number} offset (default 0) - The starting position of the first returned result
     * @param {boolean} verifyResponse (default false) - Verify consistency and membership proof of every record
     * @returns {Promise} - A promise representing an async call to the results endpoint
     * @example
     * ```js
     * const response = await audit.results(
     *   "pas_sqilrhruwu54uggihqj3aie24wrctakr",
     *   50,
     *   100
     * );
     * ```
     */
    async results(id, limit = 20, offset = 0, options) {
        if (!id) {
            throw new Error("Missing required `id` parameter");
        }
        const payload = {
            id,
            limit,
            offset,
        };
        const response = await this.post("results", payload);
        return this.processSearchResponse(response, options);
    }
    /**
     * @summary Tamperproof verification
     * @description Returns current root hash and consistency proof.
     * @operationId audit_post_v1_root
     * @param {number} size - The size of the tree (the number of records)
     * @returns {Promise} - A promise representing an async call to the endpoint
     * @example
     * ```js
     * const response = audit.root(7);
     * ```
     */
    root(size = 0) {
        const data = {};
        if (size > 0) {
            data.tree_size = size;
        }
        return this.post("root", data);
    }
    async processSearchResponse(response, options) {
        if (!response.success) {
            return response;
        }
        const localRoot = async (treeSize) => {
            const response = await this.root(treeSize);
            const root = response.result.data;
            return root;
        };
        if (!options?.skipEventVerification) {
            response.result.events.forEach((record) => {
                this.verifyHash(record.envelope, record.hash);
                record.signature_verification = verifySignature(record.envelope);
            });
        }
        if (options?.verifyConsistency) {
            const root = response.result.root;
            if (root !== undefined) {
                const treeName = root?.tree_name;
                const treeSizes = new Set();
                treeSizes.add(root?.size ?? 0);
                response.result.events.forEach((record) => {
                    if (record.leaf_index !== undefined) {
                        const idx = Number(record.leaf_index);
                        treeSizes.add(idx + 1);
                        if (idx > 0) {
                            treeSizes.add(idx);
                        }
                    }
                });
                this.publishedRoots = await getArweavePublishedRoots(treeName, Array.from(treeSizes), localRoot);
            }
            response.result.events.forEach((record) => {
                record.membership_verification = verifyRecordMembershipProof({
                    root: record.published ? root : response.result.unpublished_root,
                    record: record,
                });
                record.consistency_verification = verifyRecordConsistencyProof({
                    publishedRoots: this.publishedRoots,
                    record: record,
                });
            });
        }
        return response;
    }
}
/* harmony default export */ const audit = (AuditService);

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/user/profile.js

class UserProfile extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/user/profile/get
    /**
     * @summary Get user
     * @description Get user's information by identity or email.
     * @operationId authn_post_v1_user_profile_get
     * @param {Object} data - Must include either an `email` or `id`:
     *   - email (string): An email address
     *   - id (string): The identity of a user or a service
     * @returns {Promise<PangeaResponse<AuthN.User.Profile.GetResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.user.getProfile(
     *   {
     *     email: "joe.user@email.com",
     *   }
     * );
     * ```
     */
    getProfile(data) {
        return this.post("user/profile/get", data);
    }
    // authn::/v1/user/profile/update
    /**
     * @summary Update user
     * @description Update user's information by identity or email.
     * @operationId authn_post_v1_user_profile_update
     * @param {Object} data - Must include either an `email` OR `id` AND `profile`:
     *   - email (string): An email address
     *   - id (string): The identity of a user or a service
     *   - profile (object): Updates to a user profile
     * @returns {Promise<PangeaResponse<AuthN.User.Profile.UpdateResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.user.profile.update(
     *   {
     *     email: "joe.user@email.com",
     *     profile: {
     *       phone: "18085550173",
     *     },
     *   }
     * );
     * ```
     */
    update(data) {
        return this.post("user/profile/update", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/user/invites.js

class UserInvites extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/user/invite/list
    /**
     * @summary List invites
     * @description Look up active invites for the userpool.
     * @operationId authn_post_v1_user_invite_list
     * @param {Object} request - Supported options:
     *   - filter (object)
     *   - last (string): Reflected value from a previous response to
     * obtain the next page of results.
     *   - order (AuthN.ItemOrder): Order results asc(ending) or desc(ending).
     *   - order_by (AuthN.User.Invite.OrderBy): Which field to order results by.
     *   - size (number): Maximum results to include in the response.
     * @returns {Promise<PangeaResponse<AuthN.User.Invite.ListResult>>} - A list of pending user invitations
     * @example
     * ```js
     * const response = await authn.user.invites.list(
     *   {
     *     order: AuthN.ItemOrder.ASC,
     *     order_by: AuthN.User.Invite.OrderBy.ID,
     *     size: 20,
     *   }
     * );
     * ```
     */
    list(request) {
        const options = request || {};
        return this.post("user/invite/list", options);
    }
    // authn::/v1/user/invite/delete
    /**
     * @summary Delete Invite
     * @description Delete a user invitation.
     * @operationId authn_post_v1_user_invite_delete
     * @param {String} id - A one-time ticket
     * @returns {Promise<PangeaResponse<{}>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * await authn.user.invites.delete(
     *   "pmc_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a"
     * );
     * ```
     */
    delete(id) {
        const data = {
            id,
        };
        return this.post("user/invite/delete", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/user/login.js

class UserLogin extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/user/login/password
    /**
     * @summary Login with a password
     * @description Login a user with a password and return the user's token and information.
     * @operationId authn_post_v1_user_login_password
     * @param {String} email - An email address
     * @param {String} password - The user's password
     * @param {Object} options - Supported options:
     *   -  extra_profile (object): A user profile as a collection of string properties
     * @returns {Promise<PangeaResponse<AuthN.User.Login.LoginResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.user.login.password(
     *   "joe.user@email.com",
     *   "My1s+Password",
     *   {
     *     extra_profile: {
     *       first_name: "Joe",
     *       last_name: "User",
     *     },
     *   }
     * );
     * ```
     */
    password(email, password, options = {}) {
        const data = {
            email: email,
            password: password,
        };
        Object.assign(data, options);
        return this.post("user/login/password", data);
    }
    // authn::/v1/user/login/social
    /**
     * @summary Login with a social provider
     * @description Login a user by their social ID and return the user's token and information.
     * @operationId authn_post_v1_user_login_social
     * @param {AuthN.IDProvider} provider - Social identity provider for authenticating a user's identity
     * @param {String} email - An email address
     * @param {String} socialID - User's social ID with the provider
     * @param {Object} options - Supported options:
     *   -  extra_profile (object): A user profile as a collection of string properties
     * @returns {Promise<PangeaResponse<AuthN.User.Login.LoginResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.user.login.social(
     *   AuthN.IDProvider.GOOGLE,
     *   "joe.user@email.com",
     *   "My1s+Password",
     *   {
     *     extra_profile: {
     *       first_name: "Joe",
     *       last_name: "User",
     *     },
     *   }
     * );
     * ```
     */
    social(provider, email, socialID, options = {}) {
        const data = {
            provider: provider,
            email: email,
            social_id: socialID,
        };
        Object.assign(data, options);
        return this.post("user/login/social", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/user/mfa.js

class UserMFA extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/user/mfa/delete
    /**
     * @summary Delete MFA Enrollment
     * @description Delete MFA enrollment for a user.
     * @operationId authn_post_v1_user_mfa_delete
     * @param {String} userID - The identity of a user or a service
     * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for authenticating
     * a user's identity
     * @returns {Promise<PangeaResponse<{}>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * await authn.user.mfa.delete(
     *   "pui_zgp532cx6opljeavvllmbi3iwmq72f7f",
     *   AuthN.MFAProvider.TOTP
     * );
     * ```
     */
    delete(userID, mfaProvider) {
        const data = {
            user_id: userID,
            mfa_provider: mfaProvider,
        };
        return this.post("user/mfa/delete", data);
    }
    // authn::/v1/user/mfa/enroll
    /**
     * @summary Enroll In MFA
     * @description Enroll in MFA for a user by proving the user has access to an MFA verification code.
     * @operationId authn_post_v1_user_mfa_enroll
     * @param {String} userID - The identity of a user or a service
     * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for authenticating
     * a user's identity
     * @param {String} code - A six digit MFA code
     * @returns {Promise<PangeaResponse<{}>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * await authn.user.mfa.enroll(
     *   "pui_zgp532cx6opljeavvllmbi3iwmq72f7f",
     *   AuthN.MFAProvider.TOTP,
     *   "999999"
     * );
     * ```
     */
    enroll(userID, mfaProvider, code) {
        const data = {
            user_id: userID,
            mfa_provider: mfaProvider,
            code: code,
        };
        return this.post("user/mfa/enroll", data);
    }
    // authn::/v1/user/mfa/start
    /**
     * @summary Start MFA Verification
     * @description Start MFA verification for a user, generating a new one-time code,
     * and sending it if necessary. When enrolling TOTP, this returns the TOTP secret.
     * @operationId authn_post_v1_user_mfa_start
     * @param {String} userID - The identity of a user or a service
     * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for authenticating
     * a user's identity
     * @param {Object} options - Supported options:
     *   - enroll (boolean)
     *   - phone (string): A phone number
     * @returns {Promise<PangeaResponse<AuthN.User.MFA.StartResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.user.mfa.start(
     *   "pui_zgp532cx6opljeavvllmbi3iwmq72f7f",
     *   AuthN.MFAProvider.SMS_OTP,
     *   { phone: "1-808-555-0173" }
     * );
     * ```
     */
    start(userID, mfaProvider, options) {
        const data = {
            user_id: userID,
            mfa_provider: mfaProvider,
        };
        Object.assign(data, options);
        return this.post("user/mfa/start", data);
    }
    // authn::/v1/user/mfa/verify
    /**
     * @summary Verify An MFA Code
     * @description Verify that the user has access to an MFA verification code.
     * @operationId authn_post_v1_user_mfa_verify
     * @param {String} userID - The identity of a user or a service
     * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for authenticating
     * a user's identity
     * @param {String} code - A six digit MFA code
     * @returns {Promise<PangeaResponse<{}>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * await authn.user.mfa.verify(
     *   "pui_zgp532cx6opljeavvllmbi3iwmq72f7f",
     *   AuthN.MFAProvider.TOTP,
     *   "999999"
     * );
     * ```
     */
    verify(userID, mfaProvider, code) {
        const data = {
            user_id: userID,
            mfa_provider: mfaProvider,
            code: code,
        };
        return this.post("user/mfa/verify", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/user/password.js

class UserPassword extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/user/password/reset
    /**
     * @summary Password Reset
     * @description Manually reset a user's password.
     * @operationId authn_post_v1_user_password_reset
     * @param {Object} data - Required fields:
     *   - user_id (string): The identity of a user or a service
     *   - new_password (string)
     * @returns {Promise<PangeaResponse<{}>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * await authn.user.password.reset(
     *   {
     *     user_id: "pui_zgp532cx6opljeavvllmbi3iwmq72f7f",
     *     new_password: "My2n+Password",
     *   }
     * );
     * ```
     */
    reset(data) {
        return this.post("user/password/reset", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/user/index.js






class User extends base {
    constructor(token, config) {
        super("authn", token, config);
        Object.defineProperty(this, "profile", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "invites", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "login", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mfa", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "password", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.apiVersion = "v1";
        this.profile = new UserProfile(token, config);
        this.invites = new UserInvites(token, config);
        this.login = new UserLogin(token, config);
        this.mfa = new UserMFA(token, config);
        this.password = new UserPassword(token, config);
    }
    // authn::/v1/user/delete
    /**
     * @summary Delete User
     * @description Delete a user.
     * @operationId authn_post_v1_user_delete
     * @param {Object} request - Supported options:
     *   - email (string): An email address
     *   - id (string): The identity of a user or a service
     * @returns {Promise<PangeaResponse<{}>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * await authn.user.delete(
     *   { email: "example@example.com" }
     * );
     */
    delete(request) {
        return this.post("user/delete", request);
    }
    // authn::/v1/user/create
    /**
     * @summary Create User
     * @description Create a user.
     * @operationId authn_post_v1_user_create
     * @param {String} email - An email address
     * @param {String} authenticator - A provider-specific authenticator,
     * such as a password or a social identity.
     * @param {AuthN.IDProvider} idProvider - Mechanism for authenticating a
     * user's identity
     * @param {Object} options - Supported options:
     *   - verified (boolean):  True if the user's email has been verified
     *   - require_mfa (boolean): True if the user must use MFA
     * during authentication
     *   - profile (object): A user profile as a collection of string properties
     *   - scopes (string[]): A list of scopes
     * @returns {Promise<PangeaResponse<AuthN.User.CreateResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.user.create(
     *   "joe.user@email.com",
     *   "My1s+Password",
     *   AuthN.IDProvider.PASSWORD,
     *   {
     *     verified: false,
     *     require_mfa: false,
     *     profile: {
     *       first_name: "Joe",
     *       last_name: "User",
     *     }
     *     scopes: ["scope1", "scope2"],
     *   }
     * );
     * ```
     */
    create(email, authenticator, idProvider, { verified, require_mfa, profile, scopes } = {}) {
        const data = {
            email: email,
            authenticator: authenticator,
            id_provider: idProvider,
        };
        if (typeof verified === "boolean")
            data.verified = verified;
        if (typeof require_mfa === "boolean")
            data.require_mfa = require_mfa;
        if (profile)
            data.profile = profile;
        if (scopes)
            data.scopes = scopes;
        return this.post("user/create", data);
    }
    // authn::/v1/user/invite
    /**
     * @summary Invite User
     * @description Send an invitation to a user.
     * @operationId authn_post_v1_user_invite
     * @param {String} inviter - An email address
     * @param {String} email - An email address
     * @param {String} callback - A login callback URI
     * @param {String} state - State tracking string fo login callbacks
     * @param {Object} options - Supported options:
     *   - require_mfa (boolean): Require the user to authenticate with MFA
     * @returns {Promise<PangeaResponse<AuthN.User.InviteResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.user.invite(
     *   "admin@email.com",
     *   "joe.user@email.com",
     *   "/callback",
     *   "pcb_zurr3lkcwdp5keq73htsfpcii5k4zgm7",
     *   { require_mfa: false }
     * );
     * ```
     */
    invite(inviter, email, callback, state, options = {}) {
        const data = {
            inviter,
            email,
            callback,
            state,
        };
        Object.assign(data, options);
        return this.post("user/invite", data);
    }
    // authn::/v1/user/list
    /**
     * @summary List Users
     * @description Look up users by scopes.
     * @operationId authn_post_v1_user_list
     * @param {Object} options - Supported options:
     *   - filter (object)
     *   - last (string): Reflected value from a previous response to
     * obtain the next page of results.
     *   - order (AuthN.ItemOrder): Order results asc(ending) or desc(ending).
     *   - order_by (AuthN.User.ListOrderBy): Which field to order results by.
     *   - size (number): Maximum results to include in the response.
     * @returns {Promise<PangeaResponse<AuthN.User.ListResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.user.list(
     *   {
     *     order: AuthN.ItemOrder.ASC,
     *     order_by: AuthN.User.ListOrderBy.ID,
     *     size: 20,
     *   }
     * );
     * ```
     */
    list(request) {
        request.use_new = true;
        return this.post("user/list", request);
    }
    // authn::/v1/user/verify
    /**
     * @summary Verify User
     * @description Verify a user's primary authentication.
     * @operationId authn_post_v1_user_verify
     * @param {AuthN.IDProvider} idProvider - Mechanism for authenticating a
     * user's identity
     * @param {String} email - An email address
     * @param {String} authenticator - A provider-specific authenticator,
     * such as a password or a social identity.
     * @returns {Promise<PangeaResponse<AuthN.User.VerifyResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.user.verify(
     *   AuthN.IDProvider.PASSWORD,
     *   "joe.user@email.com",
     *   "My1s+Password"
     * );
     * ```
     */
    verify(idProvider, email, authenticator) {
        const data = {
            id_provider: idProvider,
            email: email,
            authenticator: authenticator,
        };
        return this.post("user/verify", data);
    }
    // authn::/v1/user/update
    /**
     * @summary Update user's settings
     * @description Update user's settings.
     * @operationId authn_post_v1_user_update
     * @param {Object} request - Supported request:
     *   - email (string): An email address
     *   - id (string): The identity of a user or a service
     * @param {Object} options - Supported options:
     *   - authenticator (string): New value for a user's authenticator.
     *   - disabled (boolean): New disabled value.
     * Disabling a user account will prevent them from logging in.
     *   - require_mfa (boolean): New require_mfa value
     *   - verified (boolean): New verified value
     * @returns {Promise<PangeaResponse<AuthN.User.UpdateResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.user.update(
     *   { email: "joe.user@email.com" },
     *   {
     *     disabled: false,
     *     require_mfa: true,
     *   }
     * );
     * ```
     */
    update(request, options) {
        const data = {
            ...request,
            ...options,
        };
        return this.post("user/update", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/flow/enroll/mfa.js

class FlowEnrollMFA extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/flow/enroll/mfa/start
    /**
     * @summary Start MFA Enrollment
     * @description Start the process of enrolling an MFA.
     * @operationId authn_post_v1_flow_enroll_mfa_start
     * @param {String} flowID - An ID for a login or signup flow
     * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for authenticating a user's identity
     * @param {Object} options - Supported options:
     *   - phone (string): A phone number
     * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.flow.enroll.mfa.start(
     *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
     *   AuthN.MFAProvider.SMS_OTP,
     *   { phone: "1-808-555-0173" }
     * );
     * ```
     */
    start(flowID, mfaProvider, options) {
        const data = {
            flow_id: flowID,
            mfa_provider: mfaProvider,
        };
        Object.assign(data, options);
        return this.post("flow/enroll/mfa/start", data);
    }
    // authn::/v1/flow/enroll/mfa/complete
    /**
     * @summary Complete MFA Enrollment
     * @description Complete MFA enrollment by verifying a trial MFA code.
     * @operationId authn_post_v1_flow_enroll_mfa_complete
     * @param {String} flowID - An ID for a login or signup flow
     * @param {Object} options - Supported options:
     *   - code (string): A six digit MFA code
     *   - cancel (boolean)
     * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = authn.flow.enroll.mfa.complete(
     *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
     *   { code: "391423" }
     * );
     * ```
     */
    complete(flowID, options) {
        const data = {
            flow_id: flowID,
        };
        Object.assign(data, options);
        return this.post("flow/enroll/mfa/complete", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/flow/enroll/index.js


class FlowEnroll extends base {
    constructor(token, config) {
        super("authn", token, config);
        Object.defineProperty(this, "mfa", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.apiVersion = "v1";
        this.mfa = new FlowEnrollMFA(token, config);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/flow/signup.js

class FlowSignup extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/flow/signup/password
    /**
     * @summary Password Sign-up
     * @description Signup a new account using a password.
     * @operationId authn_post_v1_flow_signup_password
     * @param {String} flowID - An ID for a login or signup flow
     * @param {String} password - A password
     * @param {String} firstName
     * @param {String} lastName
     * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.flow.signup.password(
     *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
     *   "My1s+Password",
     *   "Joe",
     *   "User"
     * );
     * ```
     */
    password(flowID, password, firstName, lastName) {
        const data = {
            flow_id: flowID,
            password: password,
            first_name: firstName,
            last_name: lastName,
        };
        return this.post("flow/signup/password", data);
    }
    // authn::/v1/flow/signup/social
    /**
     * @summary Social Sign-up
     * @description Signup a new account using a social provider.
     * @operationId authn_post_v1_flow_signup_social
     * @param {String} flowID - An ID for a login or signup flow
     * @param {String} cbState - State tracking string fo login callbacks
     * @param {String} cbCode - A social oauth callback code
     * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.flow.signup.social(
     *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
     *   "pcb_zurr3lkcwdp5keq73htsfpcii5k4zgm7",
     *   "poc_fwg3ul4db1jpivexru3wyj354u9ej5e2"
     * );
     * ```
     */
    social(flowID, cbState, cbCode) {
        const data = {
            flow_id: flowID,
            cb_code: cbCode,
            cb_state: cbState,
        };
        return this.post("flow/signup/social", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/flow/verify/mfa.js

class FlowVerifyMFA extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/flow/verify/mfa/complete
    /**
     * @summary Complete MFA Verification
     * @description Complete MFA verification.
     * @operationId authn_post_v1_flow_verify_mfa_complete
     * @param {String} flowID - An ID for a login or signup flow
     * @param {Object} options - Supported options:
     *   - code (string): A six digit MFA code
     *   - cancel (boolean)
     * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.flow.verify.mfa.complete(
     *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
     *   { code: "391423" }
     * );
     * ```
     */
    complete(flowID, options) {
        const data = {
            flow_id: flowID,
        };
        Object.assign(data, options);
        return this.post("flow/verify/mfa/complete", data);
    }
    // authn::/v1/flow/verify/mfa/start
    /**
     * @summary Start MFA Verification
     * @description Start the process of MFA verification.
     * @operationId authn_post_v1_flow_verify_mfa_start
     * @param {String} flowID - An ID for a login or signup flow
     * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for
     * authenticating a user's identity
     * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.flow.verify.mfa.start(
     *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
     *   AuthN.MFAProvider.TOTP
     * );
     * ```
     */
    start(flowID, mfaProvider) {
        const data = {
            flow_id: flowID,
            mfa_provider: mfaProvider,
        };
        return this.post("flow/verify/mfa/start", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/flow/verify/index.js


class FlowVerify extends base {
    constructor(token, config) {
        super("authn", token, config);
        Object.defineProperty(this, "mfa", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.apiVersion = "v1";
        this.mfa = new FlowVerifyMFA(token, config);
    }
    // authn::/v1/flow/verify/captcha
    /**
     * @summary Verify CAPTCHA
     * @description Verify a CAPTCHA during a signup or signin flow.
     * @operationId authn_post_v1_flow_verify_captcha
     * @param {String} flowID - An ID for a login or signup flow
     * @param {String} code - Code from CAPTCHA
     * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.flow.verify.captcha(
     *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
     *   "SOMEREALLYLONGANDOPAQUESTRINGFROMCAPTCHAVERIFICATION"
     * );
     * ```
     */
    captcha(flowID, code) {
        const data = {
            flow_id: flowID,
            code: code,
        };
        return this.post("flow/verify/captcha", data);
    }
    // authn::/v1/flow/verify/email
    /**
     * @summary Verify Email Address
     * @description Verify an email address during a signup or signin flow.
     * @operationId authn_post_v1_flow_verify_email
     * @param {String} flowID - An ID for a login or signup flow
     * @param {Object} options - Supported options:
     *   - cb_state (string): State tracking string for login callbacks
     *   - cb_code (string): A social oauth callback code
     * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.flow.verify.email(
     *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
     *   {
     *     cb_state: "pcb_zurr3lkcwdp5keq73htsfpcii5k4zgm7",
           cb_code: "poc_fwg3ul4db1jpivexru3wyj354u9ej5e2",
     *   }
     * );
     * ```
     */
    email(flowID, options) {
        const data = {
            flow_id: flowID,
        };
        Object.assign(data, options);
        return this.post("flow/verify/email", data);
    }
    // authn::/v1/flow/verify/password
    /**
     * @summary Password Sign-in
     * @description Sign in with a password.
     * @operationId authn_post_v1_flow_verify_password
     * @param {String} flowID - An ID for a login or signup flow
     * @param {Object} options - Supported options:
     *   - password (string): A password
     *   - reset (boolean): Used to reset a password
     * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.flow.verify.password(
     *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
     *   { password: "My1s+Password" }
     * );
     * ```
     */
    password(flowID, options) {
        const data = {
            flow_id: flowID,
        };
        Object.assign(data, options);
        return this.post("flow/verify/password", data);
    }
    // authn::/v1/flow/verify/social
    /**
     * @summary Social Sign-in
     * @description Signin with a social provider.
     * @operationId authn_post_v1_flow_verify_social
     * @param {String} flowID - An ID for a login or signup flow
     * @param {String} cbState - State tracking string for login callbacks
     * @param {String} cbCode - A social oauth callback code
     * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.flow.verify.social(
     *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
     *   "pcb_zurr3lkcwdp5keq73htsfpcii5k4zgm7",
     *   "poc_fwg3ul4db1jpivexru3wyj354u9ej5e2"
     * );
     * ```
     */
    social(flowID, cbState, cbCode) {
        const data = {
            flow_id: flowID,
            cb_code: cbCode,
            cb_state: cbState,
        };
        return this.post("flow/verify/social", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/flow/reset.js

class FlowReset extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/flow/reset/password
    /**
     * @summary Password Reset
     * @description Reset password during sign-in.
     * @operationId authn_post_v1_flow_reset_password
     * @param {String} flowID - An ID for a login or signup flow
     * @param {String} password - A password
     * @param {Object} options - Supported options:
     *   - cb_state (string): State tracking string for login callbacks
     *   - cb_code (string): A social oauth callback code
     *   - cancel (boolean)
     * @returns {Promise<PangeaResponse<AuthN.Flow.Reset.PasswordResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.flow.reset.password(
     *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
     *   "My1s+Password",
     *   {
     *     cb_state: "pcb_zurr3lkcwdp5keq73htsfpcii5k4zgm7",
     *     cb_code: "poc_fwg3ul4db1jpivexru3wyj354u9ej5e2",
     *   }
     * );
     * ```
     */
    password(flowID, password, options = {}) {
        const data = {
            flow_id: flowID,
            password: password,
        };
        Object.assign(data, options);
        return this.post("flow/reset/password", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/flow/index.js





class Flow extends base {
    constructor(token, config) {
        super("authn", token, config);
        Object.defineProperty(this, "enroll", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "signup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "verify", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "reset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.apiVersion = "v1";
        this.enroll = new FlowEnroll(token, config);
        this.signup = new FlowSignup(token, config);
        this.verify = new FlowVerify(token, config);
        this.reset = new FlowReset(token, config);
    }
    // authn::/v1/flow/complete
    /**
     * @summary Complete Sign-up/in
     * @description Complete a login or signup flow.
     * @operationId authn_post_v1_flow_complete
     * @param {String} flowID - An ID for a login or signup flow
     * @returns {Promise<PangeaResponse<AuthN.Flow.CompleteResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.flow.complete(
     *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh"
     * );
     * ```
     */
    complete(flowID) {
        const data = {
            flow_id: flowID,
        };
        return this.post("flow/complete", data);
    }
    // authn::/v1/flow/start
    /**
     * @summary Start a sign-up/in
     * @description Start a new signup or signin flow.
     * @operationId authn_post_v1_flow_start
     * @param {Object} options - Supported options:
     *   - email (string): An email address
     *   - cb_uri (string http-url): A login callback URI
     *   - flow_types (AuthN.FlowType[]): A list of flow types
     *   - provider (AuthN.IDProvider): Mechanism for authenticating a user's identity
     * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.flow.start(
     *   {
     *     email: "joe.user@email.com",
     *     cb_uri: "https://www.myserver.com/callback",
     *     flow_types: [
     *       AuthN.FlowType.SIGNUP,
     *       AuthN.FlowType.SIGNIN,
     *     ],
     *     provider: AuthN.IDProvider.PASSWORD,
     *   }
     * )
     * ```
     */
    start(options) {
        const data = {};
        Object.assign(data, options);
        return this.post("flow/start", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/client/session.js

class ClientSession extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/client/session/invalidate
    /**
     * @summary Invalidate Session | Client
     * @description Invalidate a session by session ID using a client token.
     * @operationId authn_post_v1_client_session_invalidate
     * @param {String} token - A user token value
     * @param {String} sessionID - An ID for a token
     * @returns {Promise<PangeaResponse<{}>>} - A promise
     * representing an async call to the endpoint. Contains an empty object
     * @example
     * ```js
     * await authn.client.session.invalidate(
     *   "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
     *   "pmt_zppkzrjguxyblaia6itbiesejn7jejnr"
     * );
     * ```
     */
    invalidate(token, sessionID) {
        const data = {
            token: token,
            session_id: sessionID,
        };
        return this.post("client/session/invalidate", data);
    }
    // authn::/v1/client/session/list
    /**
     * @summary List sessions (client token)
     * @description List sessions using a client token.
     * @operationId authn_post_v1_client_session_list
     * @param {String} token - A user token value
     * @param {Object} options - Supported options:
     *   - filter (object): A filter object
     *   - last (string): Reflected value from a previous response to obtain the next page of results.
     *   - order (string): Order results asc(ending) or desc(ending).
     *   - order_by (string): Which field to order results by. One of:
     *     `id`, `created_at`, `type`, `identity`, `email`, `expire`, `active_token_id`
     *   - size (integer): Maximum results to include in the response. Minimum is `1`.
     * @returns {Promise<PangeaResponse<AuthN.Session.ListResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.client.session.list(
     *   "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
     *   { order_by: "id" }
     * );
     * ```
     */
    list(token, options = {}) {
        const data = {
            token,
        };
        Object.assign(data, options);
        return this.post("client/session/list", data);
    }
    // authn::/v1/client/session/logout
    /**
     * @summary Log out (client token)
     * @description Log out the current user's session.
     * @operationId authn_post_v1_client_session_logout
     * @param {String} token - A user token value
     * @returns {Promise<PangeaResponse<{}>>} - A promise
     * representing an async call to the endpoint. Contains an empty object.
     * @example
     * ```js
     * await authn.client.session.logout(
     *   "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a"
     * );
     * ```
     */
    logout(token) {
        return this.post("client/session/logout", { token });
    }
    // authn::/v1/client/session/refresh
    /**
     * @summary Refresh a Session
     * @description Refresh a session token.
     * @operationId authn_post_v1_client_session_refresh
     * @param {String} refreshToken - A refresh token value
     * @param {Object} options -  Supported options:
     *   - user_token (string): A user token value
     * @returns {Promise<PangeaResponse<AuthN.Client.Session.RefreshResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.client.session.refresh(
     *   "ptr_xpkhwpnz2cmegsws737xbsqnmnuwtbm5",
     *   { user_token: "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a" }
     * );
     * ```
     */
    refresh(refreshToken, { user_token }) {
        const data = {
            refresh_token: refreshToken,
        };
        if (user_token)
            data.user_token = user_token;
        return this.post("client/session/refresh", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/client/password.js

class ClientPassword extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/client/password/change
    /**
     * @summary Change a user's password
     * @description Change a user's password given the current password.
     * @operationId authn_post_v1_client_password_change
     * @param {String} token - An user token
     * @param {String} oldPassword - The old password
     * @param {String} newPassword - The new password
     * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint
     * @example
     * ```js
     * const response = await authn.client.password.change(
     *   "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
     *   "hunter2",
     *   "My2n+Password"
     * );
     * ```
     */
    change(token, oldPassword, newPassword) {
        const data = {
            token: token,
            old_password: oldPassword,
            new_password: newPassword,
        };
        return this.post("client/password/change", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/client/token.js

class ClientToken extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/client/token/check
    /**
     * @summary Check a token
     * @description Look up a token and return its contents.
     * @operationId authn_post_v1_client_token_check
     * @param {String} token - A token value
     * @returns {Promise<PangeaResponse<AuthN.Client.Token.CheckResult>>} - A promise
     * representing an async call to the endpoint.
     * @example
     * ```js
     * const response = await authn.client.clientToken.check(
     *   "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
     * );
     * ```
     */
    check(token) {
        const data = {
            token: token,
        };
        return this.post("client/token/check", data);
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/client/index.js




class Client extends base {
    constructor(token, config) {
        super("authn", token, config);
        Object.defineProperty(this, "session", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "password", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clientToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.apiVersion = "v1";
        this.session = new ClientSession(token, config);
        this.password = new ClientPassword(token, config);
        this.clientToken = new ClientToken(token, config);
    }
    // authn::/v1/client/userinfo
    /**
     * @summary Get User (client token)
     * @description Retrieve the logged in user's token and information.
     * @operationId authn_post_v1_client_userinfo
     * @param {String} code - A one-time ticket
     * @returns {Promise<PangeaResponse<AuthN.Client.UserinfoResult>>} - A promise
     * representing an async call to the endpoint
     * @example
     * ```js
     * const response = await authn.client.userinfo(
     *   "pmc_d6chl6qulpn3it34oerwm3cqwsjd6dxw",
     * );
     * ```
     */
    userinfo(code) {
        const data = {
            code: code,
        };
        return this.post("client/userinfo", data);
    }
    // authn::/v1/client/jwks
    /**
     * @summary Get JWT verification keys
     * @description Get JWT verification keys.
     * @operationId authn_post_v1_client_jwks
     * @returns {Promise<PangeaResponse<AuthN.Client.JWKSResult>>} - A promise
     * representing an async call to the endpoint
     * @example
     * ```js
     * const response = await authn.client.jwks();
     * ```
     */
    jwks() {
        return this.post("client/jwks", {});
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/session.js

class Session extends base {
    constructor(token, config) {
        super("authn", token, config);
        this.apiVersion = "v1";
    }
    // authn::/v1/session/invalidate
    /**
     * @summary Invalidate Session
     * @description Invalidate a session by session ID.
     * @operationId authn_post_v1_session_invalidate
     * @param {String} sessionID - An ID for a token
     * @returns {Promise} - A promise representing an async call to
     * the invalidate session endpoint. Contains an empty object.
     * @example
     * ```js
     * await authn.session.invalidate(
     *   "pmt_zppkzrjguxyblaia6itbiesejn7jejnr"
     * );
     * ```
     */
    invalidate(sessionID) {
        return this.post("session/invalidate", { session_id: sessionID });
    }
    // authn::/v1/session/list
    /**
     * @summary List session (service token)
     * @description List sessions.
     * @operationId authn_post_v1_session_list
     * @param {AuthN.Session.ListRequest} request - An object of options:
     *   - filter (object): A filter object
     *   - last (string): Reflected value from a previous response to obtain the next page of results.
     *   - order (string): Order results asc(ending) or desc(ending).
     *   - order_by (string): Which field to order results by. One of:
     *     `id`, `created_at`, `type`, `identity`, `email`, `expire`, `active_token_id`
     *   - size (integer): Maximum results to include in the response. Minimum is `1`.
     * @returns {Promise} - A promise representing an async call to
     * the list session endpoint. Contains an array of sessions.
     * @example
     * ```js
     * const response = await authn.session.list({
     *   order: "desc",
     *   order_by: "created_at"
     * });
     * ```
     */
    list(request = {}) {
        return this.post("session/list", request);
    }
    // authn::/v1/session/logout
    /**
     * @summary Log out (service token)
     * @description Invalidate all sessions belonging to a user.
     * @operationId authn_post_v1_session_logout
     * @param {String} user_id - The identity of a user or a service
     * @returns {Promise} - A promise representing an async call to
     * the session logout endpoint. Contains an empty object.
     * @example
     * ```js
     * await authn.session.logout(
     *   "pui_xpkhwpnz2cmegsws737xbsqnmnuwtvm5"
     * );
     * ```
     */
    logout(user_id) {
        return this.post("session/logout", { user_id });
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/authn/index.js





/**
 * AuthnService class provides methods for interacting with the AuthN Service
 * @extends BaseService
 */
class AuthNService extends base {
    constructor(token, config) {
        super("authn", token, config);
        Object.defineProperty(this, "user", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "flow", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "session", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.apiVersion = "v1";
        this.user = new User(token, config);
        this.flow = new Flow(token, config);
        this.client = new Client(token, config);
        this.session = new Session(token, config);
    }
}
/* harmony default export */ const authn = (AuthNService);

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/embargo.js

/**
 * EmbargoService class provides methods for interacting with the Embargo Service
 * @extends BaseService
 */
class EmbargoService extends base {
    constructor(token, config) {
        super("embargo", token, config);
        this.apiVersion = "v1";
    }
    /**
     * @summary Check IP
     * @description Check an IP against known sanction and trade embargo lists.
     * @operationId embargo_post_v1_ip_check
     * @param {String} ipAddress - Geolocate this IP and check the corresponding country against
     *   the enabled embargo lists.
     * @returns {Promise} - A promise representing an async call to the check endpoint
     * @example
     * ```js
     * const response = await embargo.ipCheck("190.6.64.94");
     * ```
     */
    ipCheck(ipAddress) {
        const data = {
            ip: ipAddress,
        };
        return this.post("ip/check", data);
    }
    /**
     * @summary ISO code check
     * @description Check a country code against known sanction and trade embargo lists.
     * @operationId embargo_post_v1_iso_check
     * @param {String} isoCode - Check the  country against code the enabled embargo lists.
     * @returns {Promise} - A promise representing an async call to the check endpoint
     * @example
     * ```js
     * const response = await embargo.isoCheck("CU");
     * ```
     */
    isoCheck(isoCode) {
        const data = {
            iso_code: isoCode,
        };
        return this.post("iso/check", data);
    }
}
/* harmony default export */ const embargo = (EmbargoService);

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/redact.js

/**
 * RedactService class provides methods for interacting with the Redact Service
 * @extends BaseService
 */
class RedactService extends base {
    constructor(token, config) {
        super("redact", token, config);
        this.apiVersion = "v1";
    }
    /**
     * @summary Redact
     * @description Redact sensitive information from provided text.
     * @operationId redact_post_v1_redact
     * @param {String} text - The text data to redact
     * @param {Object} options - Supported options:
     *   - debug {Boolean} - Setting this value to true will provide a detailed analysis of the redacted
     * data and the rules that caused redaction
     *   - rules {String[]} - An array of redact rule short names
     *   - return_result {Boolean} - Setting this value to false will omit the redacted result only returning count
     * @returns {Promise} - A promise representing an async call to the redact endpoint
     * @example
     * ```js
     * const response = await redact.redact(
     *   "Jenny Jenny... 555-867-5309"
     * );
     * ```
     */
    redact(text, options = {}) {
        let input = {
            text: text,
        };
        Object.assign(input, options);
        return this.post("redact", input);
    }
    /**
     * @summary Redact structured
     * @description Redact sensitive information from structured data (e.g., JSON).
     * @operationId redact_post_v1_redact_structured
     * @param {Object} data - Structured data to redact
     * @param {Object} options - Supported options:
     *   - debug {Boolean} - Setting this value to true will provide a detailed analysis of the redacted
     * data and the rules that caused redaction
     *   - rules {String[]} - An array of redact rule short names
     *   - jsonp {String[]} - JSON path(s) used to identify the specific JSON fields to redact in the
     * structured data. Note: If jsonp parameter is used, the data parameter must be in JSON format.
     *   - format {String} - The format of the structured data to redact. Default: "json"
     *   - return_result {Boolean} - Setting this value to false will omit the redacted result only returning count
     * @returns {Promise} - A promise representing an async call to the redactStructured endpoint
     * @example
     * ```js
     * const response = await redact.redactStructured({
     *   "phone": "555-867-5309"
     * });
     * ```
     */
    redactStructured(data, options = {}) {
        let input = {
            data: data,
        };
        Object.assign(input, options);
        return this.post("redact_structured", input);
    }
}
/* harmony default export */ const redact = (RedactService);

;// CONCATENATED MODULE: external "node:fs"
const external_node_fs_namespaceObject = require("node:fs");
;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/intel.js





const hashType = "sha256";
/**
 * FileIntelService class provides methods for interacting with the File Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://pangea.cloud/docs/api/file-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *     User Console at [https://console.pangea.cloud/service/file-intel](https://console.pangea.cloud/service/file-intel)
 *
 * Examples:
 *    import { PangeaConfig, FileIntelService } from "node-pangea";
 *
 *    const domain = process.env.PANGEA_DOMAIN;
 *    const token = process.env.PANGEA_TOKEN;
 *    const config = new PangeaConfig({ domain });
 *
 *    const fileIntel = new FileIntelService(token, config);
 *    const options = { provider: "reversinglabs", verbose: true };
 *
 *    const response = await fileIntel.lookup("142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e", "sha256", options);
 */
class FileIntelService extends base {
    constructor(token, config) {
        super("file-intel", token, config);
        this.apiVersion = "v1";
    }
    /**
     * @summary Reputation, from file hash
     * @description Retrieve hash-based file reputation from a provider, including an optional detailed report.
     * @param {String} fileHash - Hash of the file to be looked up
     * @param {String} hashType - Type of hash, can be "sha256", "sha" or "md5"
     * @param {Object} options - An object of optional parameters
     * @param {String} options.provider - Provider of the reputation information. ("reversinglabs"). Default provider defined by the configuration.
     * @param {Boolean} options.verbose - Echo back the parameters of the API in the response. Default: verbose=false.
     * @param {Boolean} options.raw - Return additional details from the provider. Default: raw=false.
     * @returns {Promise} - A promise representing an async call to the lookup endpoint.
     * @example
     * ```js
     * const response = await fileIntel.hashReputation(
     *   "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
     *   "sha256",
     *   { provider: "reversinglabs" }
     * );
     * ```
     */
    hashReputation(fileHash, hashType, options) {
        const data = {
            hash: fileHash,
            hash_type: hashType,
        };
        if (options?.provider)
            data.provider = options.provider;
        if (options?.verbose)
            data.verbose = options.verbose;
        if (options?.raw)
            data.raw = options.raw;
        return this.post("reputation", data);
    }
    /**
     * @summary Reputation, from file path
     * @description Retrieve file reputation from a provider, using the file's hash.
     * @operationId file_intel_post_v1_reputation
     * @param {String} filepath - Path to the file to be looked up
     * @param {Object} options - An object of optional parameters. Parameters supported:
     *   - provider {String} - Use reputation data from this provider: "reversinglabs".
     *   Default provider defined by the configuration.
     *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
     *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
     * @returns {Promise} - A promise representing an async call to the lookup endpoint.
     * @example
     * ```js
     * const response = await fileIntel.filepathReputation(
     *   "./myfile.exe",
     *   { provider: "reversinglabs" }
     * );
     * ```
     */
    filepathReputation(filepath, options) {
        const content = (0,external_node_fs_namespaceObject.readFileSync)(filepath);
        const fileHash = (0,external_node_crypto_namespaceObject.createHash)(hashType).update(content).digest("hex");
        const data = {
            hash: fileHash,
            hash_type: hashType,
        };
        if (options?.provider)
            data.provider = options.provider;
        if (options?.verbose)
            data.verbose = options.verbose;
        if (options?.raw)
            data.raw = options.raw;
        return this.post("reputation", data);
    }
}
/**
 * DomainIntelService class provides methods for interacting with the Domain Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://pangea.cloud/docs/api/domain-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *     User Console at [https://console.pangea.cloud/service/domain-intel](https://console.pangea.cloud/service/domain-intel)
 *
 * Examples:
 *  import { PangeaConfig, DomainIntelService } from "node-pangea";
 *
 *  const domain = process.env.PANGEA_DOMAIN;
 *  const token = process.env.PANGEA_TOKEN;
 *  const config = new PangeaConfig({ domain });
 *
 *  const domainIntel = new DomainIntelService(token, config);
 *  const options = { provider: "domaintools", verbose: true };
 *
 *  const response = await domainIntel.lookup("teoghehofuuxo", options);
 */
class DomainIntelService extends base {
    constructor(token, config) {
        super("domain-intel", token, config);
        this.apiVersion = "v1";
    }
    /**
     * @summary Reputation check
     * @description Retrieve reputation for a domain from a provider, including an optional detailed report.
     * @operationId domain_intel_post_v1_reputation
     * @param {String} domain - The domain to be looked up.
     * @param {Object} options - An object of optional parameters. Parameters supported:
     *   - provider {String} - Use reputation data from these providers: "crowdstrike" or "domaintools".
     *   Default provider defined by the configuration.
     *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
     *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
     * @returns {Promise} - A promise representing an async call to the lookup endpoint.
     * @example
     * ```js
     * const response = await domainIntel.reputation(
     *   "google.com"
     * );
     * ```
     */
    reputation(domain, options) {
        const data = {
            domain,
        };
        if (options?.provider)
            data.provider = options.provider;
        if (options?.verbose)
            data.verbose = options.verbose;
        if (options?.raw)
            data.raw = options.raw;
        return this.post("reputation", data);
    }
}
/**
 * IPIntelService class provides methods for interacting with the IP Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://docs.pangea.cloud/docs/api/ip-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *
 * Examples:
 *    import { PangeaConfig, IPIntelService } from "node-pangea";
 *
 *    const domain = process.env.PANGEA_DOMAIN;
 *    const token = process.env.PANGEA_IP_INTEL_TOKEN;
 *    const config = new PangeaConfig({ domain });
 *
 *    const ipIntel = new IPIntelService(token, config);
 *    const options = { provider: "crowdstrike", verbose: true };
 *
 *    const response = await ipIntel.lookup("93.231.182.110", options);
 */
class IPIntelService extends base {
    constructor(token, config) {
        super("ip-intel", token, config);
        this.apiVersion = "v1";
    }
    /**
     * @summary Reputation
     * @description Retrieve a reputation score for an IP address from a provider, including an optional detailed report.
     * @operationId ip_intel_post_v1_reputation
     * @param {String} ip - Geolocate this IP and check the corresponding country against
     * @param {Object} options - An object of optional parameters. Parameters supported:
     *   - provider {String} - Use reputation data from this provider: "crowdstrike".
     *   Default provider defined by the configuration.
     *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
     *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
     * @returns {Promise} - A promise representing an async call to the /reputation endpoint.
     * @example
     * ```js
     * const response = await ipIntel.reputation(
     *   "1.1.1.1",
     *   {
     *     provider: "crowdstrike"
     *   }
     * );
     * ```
     */
    reputation(ip, options) {
        const data = {
            ip,
        };
        if (options?.provider)
            data.provider = options.provider;
        if (options?.verbose)
            data.verbose = options.verbose;
        if (options?.raw)
            data.raw = options.raw;
        return this.post("reputation", data);
    }
    /**
     * @summary Geolocate
     * @description Retrieve geolocation information for an IP address from a provider, including an optional detailed report.
     * @operationId ip_intel_post_v1_geolocate
     * @param {String} ip - The IP to be looked up
     * @param {Object} options - An object of optional parameters. Parameters supported:
     *   - provider {String} - Use geolocation data from this provider: "digitalelement".
     *   Default provider defined by the configuration.
     *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
     *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
     * @returns {Promise} - A promise representing an async call to the geolocate endpoint.
     * @example
     * ```js
     * const response = await ipIntel.geolocate(
     *   "1.1.1.1",
     *   {
     *     provider: "digitalelement"
     *   }
     * );
     * ```
     */
    geolocate(ip, options) {
        const data = {
            ip,
        };
        if (options?.provider)
            data.provider = options.provider;
        if (options?.verbose)
            data.verbose = options.verbose;
        if (options?.raw)
            data.raw = options.raw;
        return this.post("geolocate", data);
    }
    /**
     * @summary Domain
     * @description Retrieve the domain name associated with an IP address.
     * @operationId ip_intel_post_v1_domain
     * @param {String} ip - The IP to be looked up
     * @param {Object} options - An object of optional parameters. Parameters supported:
     *   - provider {String} - Use data from this provider: "digitalelement".
     *   Default provider defined by the configuration.
     *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
     *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
     * @returns {Promise} - A promise representing an async call to the domain endpoint.
     * @example
     * ```js
     * const response = await ipIntel.getDomain(
     *   "1.1.1.1",
     *   {
     *     provider: "digitalelement"
     *   }
     * );
     * ```
     */
    getDomain(ip, options) {
        const data = {
            ip,
        };
        if (options?.provider)
            data.provider = options.provider;
        if (options?.verbose)
            data.verbose = options.verbose;
        if (options?.raw)
            data.raw = options.raw;
        return this.post("domain", data);
    }
    /**
     * @summary VPN
     * @description Determine if an IP address is provided by a VPN service.
     * @operationId ip_intel_post_v1_vpn
     * @param {String} ip - The IP to be looked up
     * @param {Object} options - An object of optional parameters. Parameters supported:
     *   - provider {String} - Use data from this provider: "digitalelement".
     *   Default provider defined by the configuration.
     *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
     *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
     * @returns {Promise} - A promise representing an async call to the vpn endpoint.
     * @example
     * ```js
     * const response = await ipIntel.isVPN(
     *   "1.1.1.1",
     *   {
     *     provider: "digitalelement"
     *   }
     * );
     * ```
     */
    isVPN(ip, options) {
        const data = {
            ip,
        };
        if (options?.provider)
            data.provider = options.provider;
        if (options?.verbose)
            data.verbose = options.verbose;
        if (options?.raw)
            data.raw = options.raw;
        return this.post("vpn", data);
    }
    /**
     * @summary Proxy
     * @description Determine if an IP address is provided by a proxy service.
     * @operationId ip_intel_post_v1_proxy
     * @param {String} ip - The IP to be looked up
     * @param {Object} options - An object of optional parameters. Parameters supported:
     *   - provider {String} - Use data from this provider: "digitalelement".
     *   Default provider defined by the configuration.
     *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
     *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
     * @returns {Promise} - A promise representing an async call to the vpn endpoint.
     * @example
     * ```js
     * const response = await ipIntel.isProxy(
     *   "1.1.1.1",
     *   {
     *     provider: "digitalelement"
     *   }
     * );
     * ```
     */
    isProxy(ip, options) {
        const data = {
            ip,
        };
        if (options?.provider)
            data.provider = options.provider;
        if (options?.verbose)
            data.verbose = options.verbose;
        if (options?.raw)
            data.raw = options.raw;
        return this.post("proxy", data);
    }
}
/**
 * URLIntelService class provides methods for interacting with the URL Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://docs.pangea.cloud/docs/api/file-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *
 * Examples:
 *    import { PangeaConfig, URLIntelService } from "pangea-node-sdk";
 *
 *    const domain = process.env.PANGEA_DOMAIN;
 *    const token = process.env.PANGEA_TOKEN;
 *    const config = new PangeaConfig({ domain });
 *
 *    const urlIntel = new URLIntelService(token, config);
 *    const options = { provider: "crowdstrike", verbose: true };
 *
 *    const response = await urlIntel.lookup("http://113.235.101.11:54384", options);
 */
class URLIntelService extends base {
    constructor(token, config) {
        super("url-intel", token, config);
        this.apiVersion = "v1";
    }
    /**
     * @summary Reputation check
     * @description Retrieve a reputation score for a URL from a provider, including an optional detailed report.
     * @operationId url_intel_post_v1_reputation
     * @param {String} url - The URL to be looked up
     * @param {Object} options - An object of optional parameters. Parameters supported:
     *   - provider {String} - Use reputation data from this provider: "crowdstrike".
     *   Default provider defined by the configuration.
     *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
     *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
     * @returns {Promise} - A promise representing an async call to the lookup endpoint.
     * @example
     * ```js
     * const response = await urlIntel.reputation(
     *   "http://113.235.101.11:54384,
     *   {
     *     provider: "crowdstrike"
     *   }
     * );
     * ```
     */
    reputation(url, options) {
        const data = {
            url,
        };
        if (options?.provider)
            data.provider = options.provider;
        if (options?.verbose)
            data.verbose = options.verbose;
        if (options?.raw)
            data.raw = options.raw;
        return this.post("reputation", data);
    }
}
// User
/**
 * UserIntelService class provides methods for interacting with the User Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://docs.pangea.cloud/docs/api/file-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *
 * Examples:
 *    import { PangeaConfig, UserIntelService } from "pangea-node-sdk";
 *
 *    const domain = process.env.PANGEA_DOMAIN;
 *    const token = process.env.PANGEA_TOKEN;
 *    const config = new PangeaConfig({ domain });
 *
 *    const userIntel = new UserIntelService(token, config);
 *    const options = { provider: "spycloud", verbose: true };
 *    const response = await userIntel.passwordBreached(Intel.HashType.SHA256, "5baa6", options);
 */
class UserIntelService extends base {
    constructor(token, config) {
        super("user-intel", token, config);
        this.apiVersion = "v1";
    }
    /**
     * @summary Look up breached users
     * @description Find out if an email address, username, phone number, or IP address was exposed in a security breach.
     * @operationId user_intel_post_v1_user_breached
     * @param {BrechedRequest} request - Request to be send to user/breached endpoint
     * @param {Object} options - An object of optional parameters. Parameters supported:
     *   - provider {String} - Use breached data from this provider: "spycloud".
     *   Default provider defined by the configuration.
     *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
     *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
     * @returns {Promise} - A promise representing an async call to the user/breached endpoint.
     * @example
     *  const request = {phone_number: "8005550123", verbose: true, raw: true };
     *  const response = await userIntel.userBreached(request);
     */
    userBreached(request) {
        return this.post("user/breached", request);
    }
    /**
     * @summary Look up breached passwords
     * @description Find out if a password has been exposed in security breaches by providing a 5 character prefix of the password hash.
     * @operationId user_intel_post_v1_password_breached
     * @param {String} hashType - Hash type to be looked up
     * @param {String} hashPrefix - The prefix of the hash to be looked up.
     * @param {Object} options - An object of optional parameters. Parameters supported:
     *   - provider {String} - Use breached data from this provider: "spycloud".
     *   Default provider defined by the configuration.
     *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
     *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
     * @returns {Promise} - A promise representing an async call to the password/breached endpoint.
     * @example
     * const options = {provider: "spycloud", verbose: true, raw: true };
     * const response = await userIntel.passwordBreached(Intel.HashType.SHA256, "5baa6", options);
     */
    passwordBreached(hashType, hashPrefix, options) {
        const data = {
            hash_type: hashType,
            hash_prefix: hashPrefix,
        };
        Object.assign(data, options);
        return this.post("password/breached", data);
    }
    static isPasswordBreached(response, hash) {
        if (response.result.raw_data === undefined) {
            throw new errors_PangeaErrors.PangeaError("Need raw data to check if hash is breached. Send request with raw=true");
        }
        const hashData = response.result.raw_data[hash];
        if (hashData != undefined) {
            // If hash is present in raw data, it's because it was breached
            return Intel.User.Password.PasswordStatus.BREACHED;
        }
        else if (Object.keys(response.result.raw_data).length >= 1000) {
            // If it's not present, should check if I have all breached hash
            // Server will return a maximum of 1000 hash, so if breached count is greater than that,
            // I can't conclude is password is or is not breached
            return Intel.User.Password.PasswordStatus.INCONCLUSIVE;
        }
        else {
            return Intel.User.Password.PasswordStatus.UNBREACHED;
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/vault.js


/**
 * VaultService class provides methods for interacting with the Vault Service
 * @extends BaseService
 */
class VaultService extends base {
    constructor(token, config) {
        super("vault", token, config);
        this.apiVersion = "v1";
    }
    /**
     * @summary State change
     * @description Change the state of a specific version of a secret or key.
     * @operationId vault_post_v1_state_change
     * @param {String} id - The item ID
     * @param {Vault.ItemVersionState} state - The new state of the item version
     * @param {Vault.StateChangeOptions} options - State change options. The following options are supported:
     *   - version (number): the item version
     *   - destroy_period (string): Period of time for the destruction of a compromised key.
     *     Only valid if state=`compromised`
     * @returns {Promise} - A promise representing an async call to the state change endpoint
     * @example
     * ```js
     * const response = await vault.stateChange(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
     *   Vault.ItemVersionState.DEACTIVATED
     * );
     * ```
     */
    async stateChange(id, state, options = {}) {
        const data = {
            id: id,
            state: state,
        };
        Object.assign(data, options);
        return this.post("state/change", data);
    }
    /**
     * @summary Delete
     * @description Delete a secret or key.
     * @operationId vault_post_v1_delete
     * @param {String} id - The item ID
     * @returns {Promise} - A promise representing an async call to the delete endpoint
     * @example
     * ```js
     * const response = await vault.delete(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5"
     * );
     * ```
     */
    async delete(id) {
        const data = {
            id: id,
        };
        return this.post("delete", data);
    }
    /**
     * @summary Retrieve
     * @description Retrieve a secret or key, and any associated information.
     * @operationId vault_post_v1_get
     * @param {String} id - The item ID
     * @param {Vault.GetOptions} options - The following options are supported:
     *   - version (number | string): The key version(s).
     *     `all` for all versions, `num` for a specific version,
     *      `-num` for the `num` latest versions.
     *   - version_state (Vault.ItemVersionState): The state of the item version
     *   - verbose (boolean): Return metadata and extra fields
     * @returns {Promise} - A promise representing an async call to the get endpoint
     * @example
     * ```js
     * const response = await vault.getItem(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
     *   {
     *     version: 1,
     *     version_state: Vault.ItemVersionState.ACTIVE,
     *     verbose: true,
     *   }
     * );
     * ```
     */
    async getItem(id, options = {}) {
        let data = {
            id: id,
        };
        Object.assign(data, options);
        return this.post("get", data);
    }
    /**
     * @summary List
     * @description Look up a list of secrets, keys and folders, and their associated information.
     * @operationId vault_post_v1_list
     * @param {Object} options - The following options are supported:
     *   - filter (object): A set of filters to help you customize your search. Examples:
     *     `"folder": "/tmp"`, `"tags": "personal"`, `"name__contains": "xxx"`, `"created_at__gt": "2020-02-05T10:00:00Z"`
     *     For metadata, use: `"metadata_": "<value>"`
     *   - last (string): Internal ID returned in the previous look up response. Used for pagination.
     *   - order: (Vault.ItemOrder): Ordering direction
     *   - order_by: (Vault.ItemOrderBy): Property used to order the results
     *   - size: (number): Maximum number of items in the response
     * @returns {Promise} - A promise representing an async call to the list endpoint
     * @example
     * ```js
     * const response = await vault.list(
     *   {
     *     filter: {
     *       folder: "/",
     *       type: "asymmetric_key",
     *       name__contains: "test",
     *       metadata_key1: "value1",
     *       created_at__lt: "2023-12-12T00:00:00Z",
     *     },
     *     last: "WyIvdGVzdF8yMDdfc3ltbWV0cmljLyJd",
     *     order: Vault.ItemOrder.ASC,
     *     order_by: Vault.ItemOrderby.NAME,
     *     size=20,
     *   }
     * );
     * ```
     */
    async list(options = {}) {
        return this.post("list", options);
    }
    /**
     * @summary Update
     * @description Update information associated with a secret or key.
     * @operationId vault_post_v1_update
     * @param {String} id - The item ID
     * @param {Vault.UpdateOptions} options - The following options are supported:
     *   - name (string): The name of this item
     *   - folder (string): The folder where this item is stored
     *   - metadata (object): User-provided metadata
     *   - tags (string[], optional): A list of user-defined tags
     *   - rotation_frequency (string): Period of time between item rotations
     *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
     *   - rotation_grace_period (string): Grace period for the previous version of the Pangea Token
     *   - expiration (string): Expiration timestamp
     *   - item_state (string): The new state of the item.
     * @returns {Promise} - A promise representing an async call to the update endpoint
     * @example
     * ```js
     * const response = await vault.update(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
     *   {
     *     name: "my-very-secret-secret",
     *     folder: "/personal",
     *     metadata: {
     *       "created_by": "John Doe",
     *       "used_in": "Google products"
     *     },
     *     tags: ["irs_2023", "personal"],
     *     rotation_frequency: "10d",
     *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
     *     rotation_grace_period: "1d",
     *     expiration: "2025-01-01T10:00:00Z",
     *     item_state: Vault.ItemState.DISABLED,
     *   }
     * );
     * ```
     */
    async update(id, options = {}) {
        let data = {
            id: id,
        };
        Object.assign(data, options);
        return this.post("update", data);
    }
    /**
     * @summary Secret store
     * @description Import a secret.
     * @operationId vault_post_v1_secret_store 1
     * @param {String} secret - The secret value
     * @param {String} name - The name of this item
     * @param {Vault.Secret.StoreOptions} options - The following options are supported:
     *   - folder (string): The folder where this item is stored
     *   - metadata (object): User-provided metadata
     *   - tags (string[]): A list of user-defined tags
     *   - rotation_frequency (string): Period of time between item rotations
     *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
     *   - expiration (string): Expiration timestamp
     * @returns {Promise} - A promise representing an async call to the secret store endpoint
     * @example
     * ```js
     * const response = await vault.secretStore(
     *   "12sdfgs4543qv@#%$casd",
     *   "my-very-secret-secret",
     *   {
     *     folder: "/personal",
     *     metadata: {
     *       "created_by": "John Doe",
     *       "used_in": "Google products"
     *     },
     *     tags: ["irs_2023", "personal"],
     *     rotation_frequency: "10d",
     *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
     *     expiration: "2025-01-01T10:00:00Z",
     *   }
     * );
     * ```
     */
    async secretStore(secret, name, options = {}) {
        let data = {
            type: types_Vault.ItemType.SECRET,
            secret: secret,
            name: name,
        };
        Object.assign(data, options);
        return this.post("secret/store", data);
    }
    /**
     * @summary Pangea token store
     * @description Import a secret.
     * @operationId vault_post_v1_secret_store 2
     * @param {String} pangeaToken - The pangea token to store
     * @param {String} name - The name of this item
     * @param {Vault.Secret.StoreOptions} options - The following options are supported:
     *   - folder (string): The folder where this item is stored
     *   - metadata (object): User-provided metadata
     *   - tags (string[]): A list of user-defined tags
     *   - rotation_frequency (string): Period of time between item rotations
     *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
     *   - expiration (string): Expiration timestamp
     * @returns {Promise} - A promise representing an async call to the secret store endpoint
     * @example
     * ```js
     * const response = await vault.pangeaTokenStore(
     *   "ptv_x6fdiizbon6j3bsdvnpmwxsz2aan7fqd",
     *   "my-very-secret-secret",
     *   {
     *     folder: "/personal",
     *     metadata: {
     *       "created_by": "John Doe",
     *       "used_in": "Google products"
     *     },
     *     tags: ["irs_2023", "personal"],
     *     rotation_frequency: "10d",
     *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
     *     expiration: "2025-01-01T10:00:00Z",
     *   }
     * );
     * ```
     */
    async pangeaTokenStore(pangeaToken, name, options = {}) {
        let data = {
            type: types_Vault.ItemType.PANGEA_TOKEN,
            secret: pangeaToken,
            name: name,
        };
        Object.assign(data, options);
        return this.post("secret/store", data);
    }
    /**
     * @summary Secret rotate
     * @description Rotate a secret.
     * @operationId vault_post_v1_secret_rotate 1
     * @param {String} id - The item ID
     * @param {String} secret - The secret value
     * @param {Vault.Secret.Secret.RotateOptions} options - The following options are supported:
     *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
     *     Default is `deactivated`.
     * @returns {Promise} - A promise representing an async call to the secret rotate endpoint
     * @example
     * ```js
     * const response = await vault.secretRotate(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
     *   "12sdfgs4543qv@#%$casd",
     *   {
     *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
     *   }
     * );
     * ```
     */
    async secretRotate(id, secret, options = {}) {
        let data = {
            id: id,
            secret: secret,
        };
        Object.assign(data, options);
        return this.post("secret/rotate", data);
    }
    /**
     * @summary Token rotate
     * @description Rotate a Pangea token.
     * @operationId vault_post_v1_secret_rotate 2
     * @param {String} id - The item ID
     * @param {String} rotation_grace_period - Grace period for the previous version of the Pangea Token
     * @returns {Promise} - A promise representing an async call to the secret rotate endpoint
     * @example
     * ```js
     * const response = await vault.pangeaTokenRotate(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
     *   "1d"
     * );
     * ```
     */
    async pangeaTokenRotate(id, rotation_grace_period) {
        let data = {
            id: id,
            rotation_grace_period: rotation_grace_period,
        };
        return this.post("secret/rotate", data);
    }
    /**
     * @summary Symmetric generate
     * @description Generate a symmetric key.
     * @operationId vault_post_v1_key_generate 1
     * @param {Vault.SymmetricAlgorithm} algorithm - The algorithm of the key. Options
     * [listed in Vault documentation](https://pangea.cloud/docs/vault/manage-keys/generate-a-key#generating-a-symmetric-key).
     * @param {Vault.KeyPurpose} purpose - The purpose of this key
     * @param {String} name - The name of this item
     * @param {Vault.Symmetric.GenerateOptions} options - The following options are supported:
     *   - folder (string): The folder where this item is stored
     *   - metadata (object): User-provided metadata
     *   - tags (string[]): A list of user-defined tags
     *   - rotation_frequency (string): Period of time between item rotations, or `never` to disallow rotation
     *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
     *   - expiration (string): Expiration timestamp
     * @returns {Promise} - A promise representing an async call to the key generate endpoint
     * @example
     * ```js
     * const response = await vault.symmetricGenerate(
     *   Vault.SymmetricAlgorithm.AES128_CFB,
     *   Vault.KeyPurpose.ENCRYPTION,
     *   "my-very-secret-secret",
     *   {
     *     folder: "/personal",
     *     metadata: {
     *       "created_by": "John Doe",
     *       "used_in": "Google products"
     *     },
     *     tags: ["irs_2023", "personal"],
     *     rotation_frequency: "10d",
     *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
     *     expiration: "2025-01-01T10:00:00Z",
     *   }
     * );
     * ```
     */
    async symmetricGenerate(algorithm, purpose, name, options = {}) {
        let data = {
            type: types_Vault.ItemType.SYMMETRIC_KEY,
            algorithm: algorithm,
            purpose: purpose,
            name: name,
        };
        Object.assign(data, options);
        return this.post("key/generate", data);
    }
    /**
     * @summary Asymmetric generate
     * @description Generate an asymmetric key.
     * @operationId vault_post_v1_key_generate 2
     * @param {Vault.AsymmetricAlgorithm} algorithm - The algorithm of the key. Options
     * [listed in Vault documentation](https://pangea.cloud/docs/vault/manage-keys/generate-a-key#generating-asymmetric-key-pairs).
     * @param {Vault.KeyPurpose} purpose - The purpose of this key
     * @param {String} name - The name of this item
     * @param {Vault.Asymmetric.GenerateOptions} options - The following options are supported:
     *   - folder (string): The folder where this item is stored
     *   - metadata (object): User-provided metadata
     *   - tags (string[]): A list of user-defined tags
     *   - rotation_frequency (string): Period of time between item rotations, or `never` to disallow rotation
     *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
     *   - expiration (string): Expiration timestamp
     * @returns {Promise} - A promise representing an async call to the key generate endpoint
     * @example
     * ```js
     * const response = await vault.asymmetricGenerate(
     *   Vault.AsymmetricAlgorithm.RSA2048_PKCS1V15_SHA256,
     *   Vault.KeyPurpose.SIGNING,
     *   "my-very-secret-secret",
     *   {
     *     folder: "/personal",
     *     metadata: {
     *       "created_by": "John Doe",
     *       "used_in": "Google products"
     *     },
     *     tags: ["irs_2023", "personal"],
     *     rotation_frequency: "10d",
     *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
     *     expiration: "2025-01-01T10:00:00Z",
     *   }
     * );
     * ```
     */
    async asymmetricGenerate(algorithm, purpose, name, options = {}) {
        let data = {
            type: types_Vault.ItemType.ASYMMETRIC_KEY,
            algorithm: algorithm,
            purpose: purpose,
            name: name,
        };
        Object.assign(data, options);
        return this.post("key/generate", data);
    }
    /**
     * @summary Asymmetric store
     * @description Import an asymmetric key.
     * @operationId vault_post_v1_key_store 1
     * @param {Vault.EncodedPrivateKey} privateKey - The private key in PEM format
     * @param {Vault.EncodedPublicKey} publicKey - The public key in PEM format
     * @param {Vault.AsymmetricAlgorithm} algorithm - The algorithm of the key. Options
     * [listed in Vault documentation](https://pangea.cloud/docs/vault/manage-keys/import-a-key#importing-an-asymmetric-key-pair).
     * @param {Vault.KeyPurpose} purpose - The purpose of this key. `signing`, `encryption`, or `jwt`.
     * @param {String} name - The name of this item
     * @param {Vault.Asymmetric.StoreOptions} options - The following options are supported:
     *   - folder (string): The folder where this item is stored
     *   - metadata (object): User-provided metadata
     *   - tags (string[]): A list of user-defined tags
     *   - rotation_frequency (string): Period of time between item rotations, or `never` to disallow rotation
     *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
     *   - expiration (string): Expiration timestamp
     * @returns {Promise} - A promise representing an async call to the key store endpoint
     * @example
     * ```js
     * const response = await vault.asymmetricStore(
     *   "private key example",
     *   "-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEA8s5JopbEPGBylPBcMK+L5PqHMqPJW/5KYPgBHzZGncc=\n-----END PUBLIC KEY-----",
     *   Vault.AsymmetricAlgorithm.RSA2048_PKCS1V15_SHA256,
     *   Vault.KeyPurpose.SIGNING,
     *   "my-very-secret-secret",
     *   {
     *     folder: "/personal",
     *     metadata: {
     *       "created_by": "John Doe",
     *       "used_in": "Google products"
     *     },
     *     tags: ["irs_2023", "personal"],
     *     rotation_frequency: "10d",
     *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
     *     expiration: "2025-01-01T10:00:00Z",
     *   }
     * );
     * ```
     */
    async asymmetricStore(privateKey, publicKey, algorithm, purpose, name, options = {}) {
        let data = {
            type: types_Vault.ItemType.ASYMMETRIC_KEY,
            private_key: privateKey,
            public_key: publicKey,
            algorithm: algorithm,
            purpose: purpose,
            name: name,
        };
        Object.assign(data, options);
        return this.post("key/store", data);
    }
    /**
     * @summary Symmetric store
     * @description Import a symmetric key.
     * @operationId vault_post_v1_key_store 2
     * @param {String} key - The key material (in base64)
     * @param {Vault.SymmetricAlgorithm} algorithm - The algorithm of the key. Options
     * [listed in Vault documentation](https://pangea.cloud/docs/vault/manage-keys/import-a-key#importing-a-symmetric-key).
     * @param {Vault.KeyPurpose} purpose - The purpose of this key. `encryption` or `jwt`
     * @param {String} name - The name of this item
     * @param {Vault.Asymmetric.StoreOptions} options - The following options are supported:
     *   - folder (string): The folder where this item is stored
     *   - metadata (object): User-provided metadata
     *   - tags (string[]): A list of user-defined tags
     *   - rotation_frequency (string): Period of time between item rotations, or `never` to disallow rotation
     *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
     *   - expiration (string): Expiration timestamp
     * @returns {Promise} - A promise representing an async call to the key store endpoint
     * @example
     * ```js
     * const response = await vault.symmetricStore(
     *   "lJkk0gCLux+Q+rPNqLPEYw==",
     *   Vault.SymmetricAlgorithm.AES128_CFB,
     *   Vault.KeyPurpose.ENCRYPTION,
     *   "my-very-secret-secret",
     *   {
     *     folder: "/personal",
     *     metadata: {
     *       "created_by": "John Doe",
     *       "used_in": "Google products"
     *     },
     *     tags: ["irs_2023", "personal"],
     *     rotation_frequency: "10d",
     *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
     *     expiration: "2025-01-01T10:00:00Z",
     *   }
     * );
     * ```
     */
    async symmetricStore(key, algorithm, purpose, name, options = {}) {
        let data = {
            type: types_Vault.ItemType.SYMMETRIC_KEY,
            key: key,
            algorithm: algorithm,
            purpose: purpose,
            name: name,
        };
        Object.assign(data, options);
        return this.post("key/store", data);
    }
    /**
     * @summary Key rotate
     * @description Manually rotate a symmetric or asymmetric key.
     * @operationId vault_post_v1_key_rotate
     * @param {String} id - The ID of the item
     * @param {Vault.Key.RotateOptions} options - Supported options:
     *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
     *     `deactivated`, `suspended`, or `destroyed`. Default is `deactivated`.
     *   - public_key (string): The public key (in PEM format)
     *   - private_key: (string): The private key (in PEM format)
     *   - key: (string): The key material (in base64)
     * @returns {Promise} - A promise representing an async call to the key rotate endpoint
     * @example
     * ```js
     * const response = await vault.keyRotate(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
     *   {
     *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
     *     key: "lJkk0gCLux+Q+rPNqLPEYw==",
     *   }
     * );
     * ```
     */
    async keyRotate(id, options = {}) {
        let data = {
            id: id,
        };
        Object.assign(data, options);
        return this.post("key/rotate", data);
    }
    /**
     * @summary Encrypt
     * @description Encrypt a message using a key.
     * @operationId vault_post_v1_key_encrypt
     * @param {String} id - The item ID
     * @param {String} plainText - A message to be in encrypted (in base64)
     * @returns {Promise} - A promise representing an async call to the key encrypt endpoint
     * @example
     * ```js
     * const response = await vault.encrypt(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
     *   "lJkk0gCLux+Q+rPNqLPEYw=="
     * );
     * ```
     */
    async encrypt(id, plainText) {
        let data = {
            id: id,
            plain_text: plainText,
        };
        return this.post("key/encrypt", data);
    }
    /**
     * @summary Decrypt
     * @description Decrypt a message using a key.
     * @operationId vault_post_v1_key_decrypt
     * @param {String} id - The item ID
     * @param {String} cipherText - A message encrypted by Vault (in base64)
     * @param {Object} options - Supported options:
     *   - version (number): The item version
     * @returns {Promise} - A promise representing an async call to the key decrypt endpoint
     * @example
     * ```js
     * const response = await vault.decrypt(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
     *   "lJkk0gCLux+Q+rPNqLPEYw==",
     *   1
     * );
     * ```
     */
    async decrypt(id, cipherText, options = {}) {
        let data = {
            id: id,
            cipher_text: cipherText,
        };
        Object.assign(data, options);
        return this.post("key/decrypt", data);
    }
    /**
     * @summary Sign
     * @description Sign a message using a key.
     * @operationId vault_post_v1_key_sign
     * @param {String} id - The item ID
     * @param {String} message - The message to be signed, in base64
     * @returns {Promise} - A promise representing an async call to the key sign endpoint
     * @example
     * ```js
     * const response = await vault.sign(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
     *   "lJkk0gCLux+Q+rPNqLPEYw=="
     * );
     * ```
     */
    async sign(id, message) {
        let data = {
            id: id,
            message: message,
        };
        return this.post("key/sign", data);
    }
    /**
     * @summary Verify
     * @description Verify a signature using a key.
     * @operationId vault_post_v1_key_verify
     * @param {String} id - The item ID
     * @param {String} message - The message to be verified (in base64)
     * @param {String} signature - The message signature (in base64)
     * @param {Vault.Asymmetric.VerifyOptions} options - Supported options:
     *   - version (number): The item version
     * @returns {Promise} - A promise representing an async call to the key verify endpoint
     * @example
     * ```js
     * const response = await vault.verify(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
     *   "lJkk0gCLux+Q+rPNqLPEYw=="
     *   "FfWuT2Mq/+cxa7wIugfhzi7ktZxVf926idJNgBDCysF/knY9B7M6wxqHMMPDEBs86D8OsEGuED21y3J7IGOpCQ==",
     *   1
     * );
     * ```
     */
    async verify(id, message, signature, options = {}) {
        let data = {
            id: id,
            message: message,
            signature: signature,
        };
        Object.assign(data, options);
        return this.post("key/verify", data);
    }
    /**
     * @summary JWT Retrieve
     * @description Retrieve a key in JWK format.
     * @operationId vault_post_v1_get_jwk
     * @param {String} id - The item ID
     * @param {Vault.JWK.GetOptions} options - Supported options:
     *   - version (string): The key version(s). `all` for all versions, `num` for a specific version,
     *     `-num` for the `num` latest versions
     * @returns {Promise} - A promise representing an async call to the get JWK endpoint
     * @example
     * ```js
     * const response = await vault.jwkGet(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5"
     * );
     * ```
     */
    async jwkGet(id, options = {}) {
        let data = {
            id: id,
        };
        Object.assign(data, options);
        return this.post("get/jwk", data);
    }
    /**
     * @summary JWT Sign
     * @description Sign a JSON Web Token (JWT) using a key.
     * @operationId vault_post_v1_key_sign_jwt
     * @param {String} id - The item ID
     * @param {String} payload - The JWT payload (in JSON)
     * @returns {Promise} - A promise representing an async call to the JWT sign endpoint
     * @example
     * ```js
     * const response = await vault.jwtSign(
     *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
     *   "{\"sub\": \"1234567890\",\"name\": \"John Doe\",\"admin\": true}"
     * );
     * ```
     */
    async jwtSign(id, payload) {
        let data = {
            id: id,
            payload: payload,
        };
        return this.post("key/sign/jwt", data);
    }
    /**
     * @summary JWT Verify
     * @description Verify the signature of a JSON Web Token (JWT).
     * @operationId vault_post_v1_key_verify_jwt
     * @param {String} jws - The signed JSON Web Token (JWS)
     * @returns {Promise} - A promise representing an async call to the JWT verify endpoint
     * @example
     * ```js
     * const response = await vault.jwtVerify(
     *   "ewogICJhbGciO..."
     * );
     * ```
     */
    async jwtVerify(jws) {
        let data = {
            jws: jws,
        };
        return this.post("key/verify/jwt", data);
    }
}
/* harmony default export */ const vault = (VaultService);

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/services/index.js







/* harmony default export */ const services = ({
    AuditService: audit,
    AuthNService: authn,
    EmbargoService: embargo,
    BaseService: base,
    RedactService: redact,
    FileIntelService: FileIntelService,
    DomainIntelService: DomainIntelService,
    IPIntelService: IPIntelService,
    URLIntelService: URLIntelService,
    UserIntelService: UserIntelService,
    VaultService: vault,
});

;// CONCATENATED MODULE: ./node_modules/pangea-node-sdk/dist/index.js




// Export all types

// Export all errors


const dist_PangeaConfig = dist_config;
const dist_PangeaRequest = request;
const dist_PangeaResponse = response;
const dist_AuditService = services.AuditService;
const dist_AuthNService = services.AuthNService;
const dist_BaseService = services.BaseService;
const dist_EmbargoService = services.EmbargoService;
const dist_RedactService = services.RedactService;
const dist_FileIntelService = services.FileIntelService;
const dist_DomainIntelService = services.DomainIntelService;
const dist_IPIntelService = services.IPIntelService;
const dist_URLIntelService = services.URLIntelService;
const dist_UserIntelService = services.UserIntelService;
const dist_VaultService = services.VaultService;


/***/ }),

/***/ 3765:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"application/1d-interleaved-parityfec":{"source":"iana"},"application/3gpdash-qoe-report+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/3gpp-ims+xml":{"source":"iana","compressible":true},"application/3gpphal+json":{"source":"iana","compressible":true},"application/3gpphalforms+json":{"source":"iana","compressible":true},"application/a2l":{"source":"iana"},"application/ace+cbor":{"source":"iana"},"application/activemessage":{"source":"iana"},"application/activity+json":{"source":"iana","compressible":true},"application/alto-costmap+json":{"source":"iana","compressible":true},"application/alto-costmapfilter+json":{"source":"iana","compressible":true},"application/alto-directory+json":{"source":"iana","compressible":true},"application/alto-endpointcost+json":{"source":"iana","compressible":true},"application/alto-endpointcostparams+json":{"source":"iana","compressible":true},"application/alto-endpointprop+json":{"source":"iana","compressible":true},"application/alto-endpointpropparams+json":{"source":"iana","compressible":true},"application/alto-error+json":{"source":"iana","compressible":true},"application/alto-networkmap+json":{"source":"iana","compressible":true},"application/alto-networkmapfilter+json":{"source":"iana","compressible":true},"application/alto-updatestreamcontrol+json":{"source":"iana","compressible":true},"application/alto-updatestreamparams+json":{"source":"iana","compressible":true},"application/aml":{"source":"iana"},"application/andrew-inset":{"source":"iana","extensions":["ez"]},"application/applefile":{"source":"iana"},"application/applixware":{"source":"apache","extensions":["aw"]},"application/at+jwt":{"source":"iana"},"application/atf":{"source":"iana"},"application/atfx":{"source":"iana"},"application/atom+xml":{"source":"iana","compressible":true,"extensions":["atom"]},"application/atomcat+xml":{"source":"iana","compressible":true,"extensions":["atomcat"]},"application/atomdeleted+xml":{"source":"iana","compressible":true,"extensions":["atomdeleted"]},"application/atomicmail":{"source":"iana"},"application/atomsvc+xml":{"source":"iana","compressible":true,"extensions":["atomsvc"]},"application/atsc-dwd+xml":{"source":"iana","compressible":true,"extensions":["dwd"]},"application/atsc-dynamic-event-message":{"source":"iana"},"application/atsc-held+xml":{"source":"iana","compressible":true,"extensions":["held"]},"application/atsc-rdt+json":{"source":"iana","compressible":true},"application/atsc-rsat+xml":{"source":"iana","compressible":true,"extensions":["rsat"]},"application/atxml":{"source":"iana"},"application/auth-policy+xml":{"source":"iana","compressible":true},"application/bacnet-xdd+zip":{"source":"iana","compressible":false},"application/batch-smtp":{"source":"iana"},"application/bdoc":{"compressible":false,"extensions":["bdoc"]},"application/beep+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/calendar+json":{"source":"iana","compressible":true},"application/calendar+xml":{"source":"iana","compressible":true,"extensions":["xcs"]},"application/call-completion":{"source":"iana"},"application/cals-1840":{"source":"iana"},"application/captive+json":{"source":"iana","compressible":true},"application/cbor":{"source":"iana"},"application/cbor-seq":{"source":"iana"},"application/cccex":{"source":"iana"},"application/ccmp+xml":{"source":"iana","compressible":true},"application/ccxml+xml":{"source":"iana","compressible":true,"extensions":["ccxml"]},"application/cdfx+xml":{"source":"iana","compressible":true,"extensions":["cdfx"]},"application/cdmi-capability":{"source":"iana","extensions":["cdmia"]},"application/cdmi-container":{"source":"iana","extensions":["cdmic"]},"application/cdmi-domain":{"source":"iana","extensions":["cdmid"]},"application/cdmi-object":{"source":"iana","extensions":["cdmio"]},"application/cdmi-queue":{"source":"iana","extensions":["cdmiq"]},"application/cdni":{"source":"iana"},"application/cea":{"source":"iana"},"application/cea-2018+xml":{"source":"iana","compressible":true},"application/cellml+xml":{"source":"iana","compressible":true},"application/cfw":{"source":"iana"},"application/city+json":{"source":"iana","compressible":true},"application/clr":{"source":"iana"},"application/clue+xml":{"source":"iana","compressible":true},"application/clue_info+xml":{"source":"iana","compressible":true},"application/cms":{"source":"iana"},"application/cnrp+xml":{"source":"iana","compressible":true},"application/coap-group+json":{"source":"iana","compressible":true},"application/coap-payload":{"source":"iana"},"application/commonground":{"source":"iana"},"application/conference-info+xml":{"source":"iana","compressible":true},"application/cose":{"source":"iana"},"application/cose-key":{"source":"iana"},"application/cose-key-set":{"source":"iana"},"application/cpl+xml":{"source":"iana","compressible":true,"extensions":["cpl"]},"application/csrattrs":{"source":"iana"},"application/csta+xml":{"source":"iana","compressible":true},"application/cstadata+xml":{"source":"iana","compressible":true},"application/csvm+json":{"source":"iana","compressible":true},"application/cu-seeme":{"source":"apache","extensions":["cu"]},"application/cwt":{"source":"iana"},"application/cybercash":{"source":"iana"},"application/dart":{"compressible":true},"application/dash+xml":{"source":"iana","compressible":true,"extensions":["mpd"]},"application/dash-patch+xml":{"source":"iana","compressible":true,"extensions":["mpp"]},"application/dashdelta":{"source":"iana"},"application/davmount+xml":{"source":"iana","compressible":true,"extensions":["davmount"]},"application/dca-rft":{"source":"iana"},"application/dcd":{"source":"iana"},"application/dec-dx":{"source":"iana"},"application/dialog-info+xml":{"source":"iana","compressible":true},"application/dicom":{"source":"iana"},"application/dicom+json":{"source":"iana","compressible":true},"application/dicom+xml":{"source":"iana","compressible":true},"application/dii":{"source":"iana"},"application/dit":{"source":"iana"},"application/dns":{"source":"iana"},"application/dns+json":{"source":"iana","compressible":true},"application/dns-message":{"source":"iana"},"application/docbook+xml":{"source":"apache","compressible":true,"extensions":["dbk"]},"application/dots+cbor":{"source":"iana"},"application/dskpp+xml":{"source":"iana","compressible":true},"application/dssc+der":{"source":"iana","extensions":["dssc"]},"application/dssc+xml":{"source":"iana","compressible":true,"extensions":["xdssc"]},"application/dvcs":{"source":"iana"},"application/ecmascript":{"source":"iana","compressible":true,"extensions":["es","ecma"]},"application/edi-consent":{"source":"iana"},"application/edi-x12":{"source":"iana","compressible":false},"application/edifact":{"source":"iana","compressible":false},"application/efi":{"source":"iana"},"application/elm+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/elm+xml":{"source":"iana","compressible":true},"application/emergencycalldata.cap+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/emergencycalldata.comment+xml":{"source":"iana","compressible":true},"application/emergencycalldata.control+xml":{"source":"iana","compressible":true},"application/emergencycalldata.deviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.ecall.msd":{"source":"iana"},"application/emergencycalldata.providerinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.serviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.subscriberinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.veds+xml":{"source":"iana","compressible":true},"application/emma+xml":{"source":"iana","compressible":true,"extensions":["emma"]},"application/emotionml+xml":{"source":"iana","compressible":true,"extensions":["emotionml"]},"application/encaprtp":{"source":"iana"},"application/epp+xml":{"source":"iana","compressible":true},"application/epub+zip":{"source":"iana","compressible":false,"extensions":["epub"]},"application/eshop":{"source":"iana"},"application/exi":{"source":"iana","extensions":["exi"]},"application/expect-ct-report+json":{"source":"iana","compressible":true},"application/express":{"source":"iana","extensions":["exp"]},"application/fastinfoset":{"source":"iana"},"application/fastsoap":{"source":"iana"},"application/fdt+xml":{"source":"iana","compressible":true,"extensions":["fdt"]},"application/fhir+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/fhir+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/fido.trusted-apps+json":{"compressible":true},"application/fits":{"source":"iana"},"application/flexfec":{"source":"iana"},"application/font-sfnt":{"source":"iana"},"application/font-tdpfr":{"source":"iana","extensions":["pfr"]},"application/font-woff":{"source":"iana","compressible":false},"application/framework-attributes+xml":{"source":"iana","compressible":true},"application/geo+json":{"source":"iana","compressible":true,"extensions":["geojson"]},"application/geo+json-seq":{"source":"iana"},"application/geopackage+sqlite3":{"source":"iana"},"application/geoxacml+xml":{"source":"iana","compressible":true},"application/gltf-buffer":{"source":"iana"},"application/gml+xml":{"source":"iana","compressible":true,"extensions":["gml"]},"application/gpx+xml":{"source":"apache","compressible":true,"extensions":["gpx"]},"application/gxf":{"source":"apache","extensions":["gxf"]},"application/gzip":{"source":"iana","compressible":false,"extensions":["gz"]},"application/h224":{"source":"iana"},"application/held+xml":{"source":"iana","compressible":true},"application/hjson":{"extensions":["hjson"]},"application/http":{"source":"iana"},"application/hyperstudio":{"source":"iana","extensions":["stk"]},"application/ibe-key-request+xml":{"source":"iana","compressible":true},"application/ibe-pkg-reply+xml":{"source":"iana","compressible":true},"application/ibe-pp-data":{"source":"iana"},"application/iges":{"source":"iana"},"application/im-iscomposing+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/index":{"source":"iana"},"application/index.cmd":{"source":"iana"},"application/index.obj":{"source":"iana"},"application/index.response":{"source":"iana"},"application/index.vnd":{"source":"iana"},"application/inkml+xml":{"source":"iana","compressible":true,"extensions":["ink","inkml"]},"application/iotp":{"source":"iana"},"application/ipfix":{"source":"iana","extensions":["ipfix"]},"application/ipp":{"source":"iana"},"application/isup":{"source":"iana"},"application/its+xml":{"source":"iana","compressible":true,"extensions":["its"]},"application/java-archive":{"source":"apache","compressible":false,"extensions":["jar","war","ear"]},"application/java-serialized-object":{"source":"apache","compressible":false,"extensions":["ser"]},"application/java-vm":{"source":"apache","compressible":false,"extensions":["class"]},"application/javascript":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js","mjs"]},"application/jf2feed+json":{"source":"iana","compressible":true},"application/jose":{"source":"iana"},"application/jose+json":{"source":"iana","compressible":true},"application/jrd+json":{"source":"iana","compressible":true},"application/jscalendar+json":{"source":"iana","compressible":true},"application/json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},"application/json-patch+json":{"source":"iana","compressible":true},"application/json-seq":{"source":"iana"},"application/json5":{"extensions":["json5"]},"application/jsonml+json":{"source":"apache","compressible":true,"extensions":["jsonml"]},"application/jwk+json":{"source":"iana","compressible":true},"application/jwk-set+json":{"source":"iana","compressible":true},"application/jwt":{"source":"iana"},"application/kpml-request+xml":{"source":"iana","compressible":true},"application/kpml-response+xml":{"source":"iana","compressible":true},"application/ld+json":{"source":"iana","compressible":true,"extensions":["jsonld"]},"application/lgr+xml":{"source":"iana","compressible":true,"extensions":["lgr"]},"application/link-format":{"source":"iana"},"application/load-control+xml":{"source":"iana","compressible":true},"application/lost+xml":{"source":"iana","compressible":true,"extensions":["lostxml"]},"application/lostsync+xml":{"source":"iana","compressible":true},"application/lpf+zip":{"source":"iana","compressible":false},"application/lxf":{"source":"iana"},"application/mac-binhex40":{"source":"iana","extensions":["hqx"]},"application/mac-compactpro":{"source":"apache","extensions":["cpt"]},"application/macwriteii":{"source":"iana"},"application/mads+xml":{"source":"iana","compressible":true,"extensions":["mads"]},"application/manifest+json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},"application/marc":{"source":"iana","extensions":["mrc"]},"application/marcxml+xml":{"source":"iana","compressible":true,"extensions":["mrcx"]},"application/mathematica":{"source":"iana","extensions":["ma","nb","mb"]},"application/mathml+xml":{"source":"iana","compressible":true,"extensions":["mathml"]},"application/mathml-content+xml":{"source":"iana","compressible":true},"application/mathml-presentation+xml":{"source":"iana","compressible":true},"application/mbms-associated-procedure-description+xml":{"source":"iana","compressible":true},"application/mbms-deregister+xml":{"source":"iana","compressible":true},"application/mbms-envelope+xml":{"source":"iana","compressible":true},"application/mbms-msk+xml":{"source":"iana","compressible":true},"application/mbms-msk-response+xml":{"source":"iana","compressible":true},"application/mbms-protection-description+xml":{"source":"iana","compressible":true},"application/mbms-reception-report+xml":{"source":"iana","compressible":true},"application/mbms-register+xml":{"source":"iana","compressible":true},"application/mbms-register-response+xml":{"source":"iana","compressible":true},"application/mbms-schedule+xml":{"source":"iana","compressible":true},"application/mbms-user-service-description+xml":{"source":"iana","compressible":true},"application/mbox":{"source":"iana","extensions":["mbox"]},"application/media-policy-dataset+xml":{"source":"iana","compressible":true,"extensions":["mpf"]},"application/media_control+xml":{"source":"iana","compressible":true},"application/mediaservercontrol+xml":{"source":"iana","compressible":true,"extensions":["mscml"]},"application/merge-patch+json":{"source":"iana","compressible":true},"application/metalink+xml":{"source":"apache","compressible":true,"extensions":["metalink"]},"application/metalink4+xml":{"source":"iana","compressible":true,"extensions":["meta4"]},"application/mets+xml":{"source":"iana","compressible":true,"extensions":["mets"]},"application/mf4":{"source":"iana"},"application/mikey":{"source":"iana"},"application/mipc":{"source":"iana"},"application/missing-blocks+cbor-seq":{"source":"iana"},"application/mmt-aei+xml":{"source":"iana","compressible":true,"extensions":["maei"]},"application/mmt-usd+xml":{"source":"iana","compressible":true,"extensions":["musd"]},"application/mods+xml":{"source":"iana","compressible":true,"extensions":["mods"]},"application/moss-keys":{"source":"iana"},"application/moss-signature":{"source":"iana"},"application/mosskey-data":{"source":"iana"},"application/mosskey-request":{"source":"iana"},"application/mp21":{"source":"iana","extensions":["m21","mp21"]},"application/mp4":{"source":"iana","extensions":["mp4s","m4p"]},"application/mpeg4-generic":{"source":"iana"},"application/mpeg4-iod":{"source":"iana"},"application/mpeg4-iod-xmt":{"source":"iana"},"application/mrb-consumer+xml":{"source":"iana","compressible":true},"application/mrb-publish+xml":{"source":"iana","compressible":true},"application/msc-ivr+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msc-mixer+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msword":{"source":"iana","compressible":false,"extensions":["doc","dot"]},"application/mud+json":{"source":"iana","compressible":true},"application/multipart-core":{"source":"iana"},"application/mxf":{"source":"iana","extensions":["mxf"]},"application/n-quads":{"source":"iana","extensions":["nq"]},"application/n-triples":{"source":"iana","extensions":["nt"]},"application/nasdata":{"source":"iana"},"application/news-checkgroups":{"source":"iana","charset":"US-ASCII"},"application/news-groupinfo":{"source":"iana","charset":"US-ASCII"},"application/news-transmission":{"source":"iana"},"application/nlsml+xml":{"source":"iana","compressible":true},"application/node":{"source":"iana","extensions":["cjs"]},"application/nss":{"source":"iana"},"application/oauth-authz-req+jwt":{"source":"iana"},"application/oblivious-dns-message":{"source":"iana"},"application/ocsp-request":{"source":"iana"},"application/ocsp-response":{"source":"iana"},"application/octet-stream":{"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},"application/oda":{"source":"iana","extensions":["oda"]},"application/odm+xml":{"source":"iana","compressible":true},"application/odx":{"source":"iana"},"application/oebps-package+xml":{"source":"iana","compressible":true,"extensions":["opf"]},"application/ogg":{"source":"iana","compressible":false,"extensions":["ogx"]},"application/omdoc+xml":{"source":"apache","compressible":true,"extensions":["omdoc"]},"application/onenote":{"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},"application/opc-nodeset+xml":{"source":"iana","compressible":true},"application/oscore":{"source":"iana"},"application/oxps":{"source":"iana","extensions":["oxps"]},"application/p21":{"source":"iana"},"application/p21+zip":{"source":"iana","compressible":false},"application/p2p-overlay+xml":{"source":"iana","compressible":true,"extensions":["relo"]},"application/parityfec":{"source":"iana"},"application/passport":{"source":"iana"},"application/patch-ops-error+xml":{"source":"iana","compressible":true,"extensions":["xer"]},"application/pdf":{"source":"iana","compressible":false,"extensions":["pdf"]},"application/pdx":{"source":"iana"},"application/pem-certificate-chain":{"source":"iana"},"application/pgp-encrypted":{"source":"iana","compressible":false,"extensions":["pgp"]},"application/pgp-keys":{"source":"iana","extensions":["asc"]},"application/pgp-signature":{"source":"iana","extensions":["asc","sig"]},"application/pics-rules":{"source":"apache","extensions":["prf"]},"application/pidf+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pidf-diff+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pkcs10":{"source":"iana","extensions":["p10"]},"application/pkcs12":{"source":"iana"},"application/pkcs7-mime":{"source":"iana","extensions":["p7m","p7c"]},"application/pkcs7-signature":{"source":"iana","extensions":["p7s"]},"application/pkcs8":{"source":"iana","extensions":["p8"]},"application/pkcs8-encrypted":{"source":"iana"},"application/pkix-attr-cert":{"source":"iana","extensions":["ac"]},"application/pkix-cert":{"source":"iana","extensions":["cer"]},"application/pkix-crl":{"source":"iana","extensions":["crl"]},"application/pkix-pkipath":{"source":"iana","extensions":["pkipath"]},"application/pkixcmp":{"source":"iana","extensions":["pki"]},"application/pls+xml":{"source":"iana","compressible":true,"extensions":["pls"]},"application/poc-settings+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/postscript":{"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},"application/ppsp-tracker+json":{"source":"iana","compressible":true},"application/problem+json":{"source":"iana","compressible":true},"application/problem+xml":{"source":"iana","compressible":true},"application/provenance+xml":{"source":"iana","compressible":true,"extensions":["provx"]},"application/prs.alvestrand.titrax-sheet":{"source":"iana"},"application/prs.cww":{"source":"iana","extensions":["cww"]},"application/prs.cyn":{"source":"iana","charset":"7-BIT"},"application/prs.hpub+zip":{"source":"iana","compressible":false},"application/prs.nprend":{"source":"iana"},"application/prs.plucker":{"source":"iana"},"application/prs.rdf-xml-crypt":{"source":"iana"},"application/prs.xsf+xml":{"source":"iana","compressible":true},"application/pskc+xml":{"source":"iana","compressible":true,"extensions":["pskcxml"]},"application/pvd+json":{"source":"iana","compressible":true},"application/qsig":{"source":"iana"},"application/raml+yaml":{"compressible":true,"extensions":["raml"]},"application/raptorfec":{"source":"iana"},"application/rdap+json":{"source":"iana","compressible":true},"application/rdf+xml":{"source":"iana","compressible":true,"extensions":["rdf","owl"]},"application/reginfo+xml":{"source":"iana","compressible":true,"extensions":["rif"]},"application/relax-ng-compact-syntax":{"source":"iana","extensions":["rnc"]},"application/remote-printing":{"source":"iana"},"application/reputon+json":{"source":"iana","compressible":true},"application/resource-lists+xml":{"source":"iana","compressible":true,"extensions":["rl"]},"application/resource-lists-diff+xml":{"source":"iana","compressible":true,"extensions":["rld"]},"application/rfc+xml":{"source":"iana","compressible":true},"application/riscos":{"source":"iana"},"application/rlmi+xml":{"source":"iana","compressible":true},"application/rls-services+xml":{"source":"iana","compressible":true,"extensions":["rs"]},"application/route-apd+xml":{"source":"iana","compressible":true,"extensions":["rapd"]},"application/route-s-tsid+xml":{"source":"iana","compressible":true,"extensions":["sls"]},"application/route-usd+xml":{"source":"iana","compressible":true,"extensions":["rusd"]},"application/rpki-ghostbusters":{"source":"iana","extensions":["gbr"]},"application/rpki-manifest":{"source":"iana","extensions":["mft"]},"application/rpki-publication":{"source":"iana"},"application/rpki-roa":{"source":"iana","extensions":["roa"]},"application/rpki-updown":{"source":"iana"},"application/rsd+xml":{"source":"apache","compressible":true,"extensions":["rsd"]},"application/rss+xml":{"source":"apache","compressible":true,"extensions":["rss"]},"application/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"application/rtploopback":{"source":"iana"},"application/rtx":{"source":"iana"},"application/samlassertion+xml":{"source":"iana","compressible":true},"application/samlmetadata+xml":{"source":"iana","compressible":true},"application/sarif+json":{"source":"iana","compressible":true},"application/sarif-external-properties+json":{"source":"iana","compressible":true},"application/sbe":{"source":"iana"},"application/sbml+xml":{"source":"iana","compressible":true,"extensions":["sbml"]},"application/scaip+xml":{"source":"iana","compressible":true},"application/scim+json":{"source":"iana","compressible":true},"application/scvp-cv-request":{"source":"iana","extensions":["scq"]},"application/scvp-cv-response":{"source":"iana","extensions":["scs"]},"application/scvp-vp-request":{"source":"iana","extensions":["spq"]},"application/scvp-vp-response":{"source":"iana","extensions":["spp"]},"application/sdp":{"source":"iana","extensions":["sdp"]},"application/secevent+jwt":{"source":"iana"},"application/senml+cbor":{"source":"iana"},"application/senml+json":{"source":"iana","compressible":true},"application/senml+xml":{"source":"iana","compressible":true,"extensions":["senmlx"]},"application/senml-etch+cbor":{"source":"iana"},"application/senml-etch+json":{"source":"iana","compressible":true},"application/senml-exi":{"source":"iana"},"application/sensml+cbor":{"source":"iana"},"application/sensml+json":{"source":"iana","compressible":true},"application/sensml+xml":{"source":"iana","compressible":true,"extensions":["sensmlx"]},"application/sensml-exi":{"source":"iana"},"application/sep+xml":{"source":"iana","compressible":true},"application/sep-exi":{"source":"iana"},"application/session-info":{"source":"iana"},"application/set-payment":{"source":"iana"},"application/set-payment-initiation":{"source":"iana","extensions":["setpay"]},"application/set-registration":{"source":"iana"},"application/set-registration-initiation":{"source":"iana","extensions":["setreg"]},"application/sgml":{"source":"iana"},"application/sgml-open-catalog":{"source":"iana"},"application/shf+xml":{"source":"iana","compressible":true,"extensions":["shf"]},"application/sieve":{"source":"iana","extensions":["siv","sieve"]},"application/simple-filter+xml":{"source":"iana","compressible":true},"application/simple-message-summary":{"source":"iana"},"application/simplesymbolcontainer":{"source":"iana"},"application/sipc":{"source":"iana"},"application/slate":{"source":"iana"},"application/smil":{"source":"iana"},"application/smil+xml":{"source":"iana","compressible":true,"extensions":["smi","smil"]},"application/smpte336m":{"source":"iana"},"application/soap+fastinfoset":{"source":"iana"},"application/soap+xml":{"source":"iana","compressible":true},"application/sparql-query":{"source":"iana","extensions":["rq"]},"application/sparql-results+xml":{"source":"iana","compressible":true,"extensions":["srx"]},"application/spdx+json":{"source":"iana","compressible":true},"application/spirits-event+xml":{"source":"iana","compressible":true},"application/sql":{"source":"iana"},"application/srgs":{"source":"iana","extensions":["gram"]},"application/srgs+xml":{"source":"iana","compressible":true,"extensions":["grxml"]},"application/sru+xml":{"source":"iana","compressible":true,"extensions":["sru"]},"application/ssdl+xml":{"source":"apache","compressible":true,"extensions":["ssdl"]},"application/ssml+xml":{"source":"iana","compressible":true,"extensions":["ssml"]},"application/stix+json":{"source":"iana","compressible":true},"application/swid+xml":{"source":"iana","compressible":true,"extensions":["swidtag"]},"application/tamp-apex-update":{"source":"iana"},"application/tamp-apex-update-confirm":{"source":"iana"},"application/tamp-community-update":{"source":"iana"},"application/tamp-community-update-confirm":{"source":"iana"},"application/tamp-error":{"source":"iana"},"application/tamp-sequence-adjust":{"source":"iana"},"application/tamp-sequence-adjust-confirm":{"source":"iana"},"application/tamp-status-query":{"source":"iana"},"application/tamp-status-response":{"source":"iana"},"application/tamp-update":{"source":"iana"},"application/tamp-update-confirm":{"source":"iana"},"application/tar":{"compressible":true},"application/taxii+json":{"source":"iana","compressible":true},"application/td+json":{"source":"iana","compressible":true},"application/tei+xml":{"source":"iana","compressible":true,"extensions":["tei","teicorpus"]},"application/tetra_isi":{"source":"iana"},"application/thraud+xml":{"source":"iana","compressible":true,"extensions":["tfi"]},"application/timestamp-query":{"source":"iana"},"application/timestamp-reply":{"source":"iana"},"application/timestamped-data":{"source":"iana","extensions":["tsd"]},"application/tlsrpt+gzip":{"source":"iana"},"application/tlsrpt+json":{"source":"iana","compressible":true},"application/tnauthlist":{"source":"iana"},"application/token-introspection+jwt":{"source":"iana"},"application/toml":{"compressible":true,"extensions":["toml"]},"application/trickle-ice-sdpfrag":{"source":"iana"},"application/trig":{"source":"iana","extensions":["trig"]},"application/ttml+xml":{"source":"iana","compressible":true,"extensions":["ttml"]},"application/tve-trigger":{"source":"iana"},"application/tzif":{"source":"iana"},"application/tzif-leap":{"source":"iana"},"application/ubjson":{"compressible":false,"extensions":["ubj"]},"application/ulpfec":{"source":"iana"},"application/urc-grpsheet+xml":{"source":"iana","compressible":true},"application/urc-ressheet+xml":{"source":"iana","compressible":true,"extensions":["rsheet"]},"application/urc-targetdesc+xml":{"source":"iana","compressible":true,"extensions":["td"]},"application/urc-uisocketdesc+xml":{"source":"iana","compressible":true},"application/vcard+json":{"source":"iana","compressible":true},"application/vcard+xml":{"source":"iana","compressible":true},"application/vemmi":{"source":"iana"},"application/vividence.scriptfile":{"source":"apache"},"application/vnd.1000minds.decision-model+xml":{"source":"iana","compressible":true,"extensions":["1km"]},"application/vnd.3gpp-prose+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-prose-pc3ch+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-v2x-local-service-information":{"source":"iana"},"application/vnd.3gpp.5gnas":{"source":"iana"},"application/vnd.3gpp.access-transfer-events+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.bsf+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gmop+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gtpc":{"source":"iana"},"application/vnd.3gpp.interworking-data":{"source":"iana"},"application/vnd.3gpp.lpp":{"source":"iana"},"application/vnd.3gpp.mc-signalling-ear":{"source":"iana"},"application/vnd.3gpp.mcdata-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-payload":{"source":"iana"},"application/vnd.3gpp.mcdata-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-signalling":{"source":"iana"},"application/vnd.3gpp.mcdata-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-floor-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-signed+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-init-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-transmission-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mid-call+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ngap":{"source":"iana"},"application/vnd.3gpp.pfcp":{"source":"iana"},"application/vnd.3gpp.pic-bw-large":{"source":"iana","extensions":["plb"]},"application/vnd.3gpp.pic-bw-small":{"source":"iana","extensions":["psb"]},"application/vnd.3gpp.pic-bw-var":{"source":"iana","extensions":["pvb"]},"application/vnd.3gpp.s1ap":{"source":"iana"},"application/vnd.3gpp.sms":{"source":"iana"},"application/vnd.3gpp.sms+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-ext+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.state-and-event-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ussd+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.bcmcsinfo+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.sms":{"source":"iana"},"application/vnd.3gpp2.tcap":{"source":"iana","extensions":["tcap"]},"application/vnd.3lightssoftware.imagescal":{"source":"iana"},"application/vnd.3m.post-it-notes":{"source":"iana","extensions":["pwn"]},"application/vnd.accpac.simply.aso":{"source":"iana","extensions":["aso"]},"application/vnd.accpac.simply.imp":{"source":"iana","extensions":["imp"]},"application/vnd.acucobol":{"source":"iana","extensions":["acu"]},"application/vnd.acucorp":{"source":"iana","extensions":["atc","acutc"]},"application/vnd.adobe.air-application-installer-package+zip":{"source":"apache","compressible":false,"extensions":["air"]},"application/vnd.adobe.flash.movie":{"source":"iana"},"application/vnd.adobe.formscentral.fcdt":{"source":"iana","extensions":["fcdt"]},"application/vnd.adobe.fxp":{"source":"iana","extensions":["fxp","fxpl"]},"application/vnd.adobe.partial-upload":{"source":"iana"},"application/vnd.adobe.xdp+xml":{"source":"iana","compressible":true,"extensions":["xdp"]},"application/vnd.adobe.xfdf":{"source":"iana","extensions":["xfdf"]},"application/vnd.aether.imp":{"source":"iana"},"application/vnd.afpc.afplinedata":{"source":"iana"},"application/vnd.afpc.afplinedata-pagedef":{"source":"iana"},"application/vnd.afpc.cmoca-cmresource":{"source":"iana"},"application/vnd.afpc.foca-charset":{"source":"iana"},"application/vnd.afpc.foca-codedfont":{"source":"iana"},"application/vnd.afpc.foca-codepage":{"source":"iana"},"application/vnd.afpc.modca":{"source":"iana"},"application/vnd.afpc.modca-cmtable":{"source":"iana"},"application/vnd.afpc.modca-formdef":{"source":"iana"},"application/vnd.afpc.modca-mediummap":{"source":"iana"},"application/vnd.afpc.modca-objectcontainer":{"source":"iana"},"application/vnd.afpc.modca-overlay":{"source":"iana"},"application/vnd.afpc.modca-pagesegment":{"source":"iana"},"application/vnd.age":{"source":"iana","extensions":["age"]},"application/vnd.ah-barcode":{"source":"iana"},"application/vnd.ahead.space":{"source":"iana","extensions":["ahead"]},"application/vnd.airzip.filesecure.azf":{"source":"iana","extensions":["azf"]},"application/vnd.airzip.filesecure.azs":{"source":"iana","extensions":["azs"]},"application/vnd.amadeus+json":{"source":"iana","compressible":true},"application/vnd.amazon.ebook":{"source":"apache","extensions":["azw"]},"application/vnd.amazon.mobi8-ebook":{"source":"iana"},"application/vnd.americandynamics.acc":{"source":"iana","extensions":["acc"]},"application/vnd.amiga.ami":{"source":"iana","extensions":["ami"]},"application/vnd.amundsen.maze+xml":{"source":"iana","compressible":true},"application/vnd.android.ota":{"source":"iana"},"application/vnd.android.package-archive":{"source":"apache","compressible":false,"extensions":["apk"]},"application/vnd.anki":{"source":"iana"},"application/vnd.anser-web-certificate-issue-initiation":{"source":"iana","extensions":["cii"]},"application/vnd.anser-web-funds-transfer-initiation":{"source":"apache","extensions":["fti"]},"application/vnd.antix.game-component":{"source":"iana","extensions":["atx"]},"application/vnd.apache.arrow.file":{"source":"iana"},"application/vnd.apache.arrow.stream":{"source":"iana"},"application/vnd.apache.thrift.binary":{"source":"iana"},"application/vnd.apache.thrift.compact":{"source":"iana"},"application/vnd.apache.thrift.json":{"source":"iana"},"application/vnd.api+json":{"source":"iana","compressible":true},"application/vnd.aplextor.warrp+json":{"source":"iana","compressible":true},"application/vnd.apothekende.reservation+json":{"source":"iana","compressible":true},"application/vnd.apple.installer+xml":{"source":"iana","compressible":true,"extensions":["mpkg"]},"application/vnd.apple.keynote":{"source":"iana","extensions":["key"]},"application/vnd.apple.mpegurl":{"source":"iana","extensions":["m3u8"]},"application/vnd.apple.numbers":{"source":"iana","extensions":["numbers"]},"application/vnd.apple.pages":{"source":"iana","extensions":["pages"]},"application/vnd.apple.pkpass":{"compressible":false,"extensions":["pkpass"]},"application/vnd.arastra.swi":{"source":"iana"},"application/vnd.aristanetworks.swi":{"source":"iana","extensions":["swi"]},"application/vnd.artisan+json":{"source":"iana","compressible":true},"application/vnd.artsquare":{"source":"iana"},"application/vnd.astraea-software.iota":{"source":"iana","extensions":["iota"]},"application/vnd.audiograph":{"source":"iana","extensions":["aep"]},"application/vnd.autopackage":{"source":"iana"},"application/vnd.avalon+json":{"source":"iana","compressible":true},"application/vnd.avistar+xml":{"source":"iana","compressible":true},"application/vnd.balsamiq.bmml+xml":{"source":"iana","compressible":true,"extensions":["bmml"]},"application/vnd.balsamiq.bmpr":{"source":"iana"},"application/vnd.banana-accounting":{"source":"iana"},"application/vnd.bbf.usp.error":{"source":"iana"},"application/vnd.bbf.usp.msg":{"source":"iana"},"application/vnd.bbf.usp.msg+json":{"source":"iana","compressible":true},"application/vnd.bekitzur-stech+json":{"source":"iana","compressible":true},"application/vnd.bint.med-content":{"source":"iana"},"application/vnd.biopax.rdf+xml":{"source":"iana","compressible":true},"application/vnd.blink-idb-value-wrapper":{"source":"iana"},"application/vnd.blueice.multipass":{"source":"iana","extensions":["mpm"]},"application/vnd.bluetooth.ep.oob":{"source":"iana"},"application/vnd.bluetooth.le.oob":{"source":"iana"},"application/vnd.bmi":{"source":"iana","extensions":["bmi"]},"application/vnd.bpf":{"source":"iana"},"application/vnd.bpf3":{"source":"iana"},"application/vnd.businessobjects":{"source":"iana","extensions":["rep"]},"application/vnd.byu.uapi+json":{"source":"iana","compressible":true},"application/vnd.cab-jscript":{"source":"iana"},"application/vnd.canon-cpdl":{"source":"iana"},"application/vnd.canon-lips":{"source":"iana"},"application/vnd.capasystems-pg+json":{"source":"iana","compressible":true},"application/vnd.cendio.thinlinc.clientconf":{"source":"iana"},"application/vnd.century-systems.tcp_stream":{"source":"iana"},"application/vnd.chemdraw+xml":{"source":"iana","compressible":true,"extensions":["cdxml"]},"application/vnd.chess-pgn":{"source":"iana"},"application/vnd.chipnuts.karaoke-mmd":{"source":"iana","extensions":["mmd"]},"application/vnd.ciedi":{"source":"iana"},"application/vnd.cinderella":{"source":"iana","extensions":["cdy"]},"application/vnd.cirpack.isdn-ext":{"source":"iana"},"application/vnd.citationstyles.style+xml":{"source":"iana","compressible":true,"extensions":["csl"]},"application/vnd.claymore":{"source":"iana","extensions":["cla"]},"application/vnd.cloanto.rp9":{"source":"iana","extensions":["rp9"]},"application/vnd.clonk.c4group":{"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},"application/vnd.cluetrust.cartomobile-config":{"source":"iana","extensions":["c11amc"]},"application/vnd.cluetrust.cartomobile-config-pkg":{"source":"iana","extensions":["c11amz"]},"application/vnd.coffeescript":{"source":"iana"},"application/vnd.collabio.xodocuments.document":{"source":"iana"},"application/vnd.collabio.xodocuments.document-template":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation-template":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet-template":{"source":"iana"},"application/vnd.collection+json":{"source":"iana","compressible":true},"application/vnd.collection.doc+json":{"source":"iana","compressible":true},"application/vnd.collection.next+json":{"source":"iana","compressible":true},"application/vnd.comicbook+zip":{"source":"iana","compressible":false},"application/vnd.comicbook-rar":{"source":"iana"},"application/vnd.commerce-battelle":{"source":"iana"},"application/vnd.commonspace":{"source":"iana","extensions":["csp"]},"application/vnd.contact.cmsg":{"source":"iana","extensions":["cdbcmsg"]},"application/vnd.coreos.ignition+json":{"source":"iana","compressible":true},"application/vnd.cosmocaller":{"source":"iana","extensions":["cmc"]},"application/vnd.crick.clicker":{"source":"iana","extensions":["clkx"]},"application/vnd.crick.clicker.keyboard":{"source":"iana","extensions":["clkk"]},"application/vnd.crick.clicker.palette":{"source":"iana","extensions":["clkp"]},"application/vnd.crick.clicker.template":{"source":"iana","extensions":["clkt"]},"application/vnd.crick.clicker.wordbank":{"source":"iana","extensions":["clkw"]},"application/vnd.criticaltools.wbs+xml":{"source":"iana","compressible":true,"extensions":["wbs"]},"application/vnd.cryptii.pipe+json":{"source":"iana","compressible":true},"application/vnd.crypto-shade-file":{"source":"iana"},"application/vnd.cryptomator.encrypted":{"source":"iana"},"application/vnd.cryptomator.vault":{"source":"iana"},"application/vnd.ctc-posml":{"source":"iana","extensions":["pml"]},"application/vnd.ctct.ws+xml":{"source":"iana","compressible":true},"application/vnd.cups-pdf":{"source":"iana"},"application/vnd.cups-postscript":{"source":"iana"},"application/vnd.cups-ppd":{"source":"iana","extensions":["ppd"]},"application/vnd.cups-raster":{"source":"iana"},"application/vnd.cups-raw":{"source":"iana"},"application/vnd.curl":{"source":"iana"},"application/vnd.curl.car":{"source":"apache","extensions":["car"]},"application/vnd.curl.pcurl":{"source":"apache","extensions":["pcurl"]},"application/vnd.cyan.dean.root+xml":{"source":"iana","compressible":true},"application/vnd.cybank":{"source":"iana"},"application/vnd.cyclonedx+json":{"source":"iana","compressible":true},"application/vnd.cyclonedx+xml":{"source":"iana","compressible":true},"application/vnd.d2l.coursepackage1p0+zip":{"source":"iana","compressible":false},"application/vnd.d3m-dataset":{"source":"iana"},"application/vnd.d3m-problem":{"source":"iana"},"application/vnd.dart":{"source":"iana","compressible":true,"extensions":["dart"]},"application/vnd.data-vision.rdz":{"source":"iana","extensions":["rdz"]},"application/vnd.datapackage+json":{"source":"iana","compressible":true},"application/vnd.dataresource+json":{"source":"iana","compressible":true},"application/vnd.dbf":{"source":"iana","extensions":["dbf"]},"application/vnd.debian.binary-package":{"source":"iana"},"application/vnd.dece.data":{"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},"application/vnd.dece.ttml+xml":{"source":"iana","compressible":true,"extensions":["uvt","uvvt"]},"application/vnd.dece.unspecified":{"source":"iana","extensions":["uvx","uvvx"]},"application/vnd.dece.zip":{"source":"iana","extensions":["uvz","uvvz"]},"application/vnd.denovo.fcselayout-link":{"source":"iana","extensions":["fe_launch"]},"application/vnd.desmume.movie":{"source":"iana"},"application/vnd.dir-bi.plate-dl-nosuffix":{"source":"iana"},"application/vnd.dm.delegation+xml":{"source":"iana","compressible":true},"application/vnd.dna":{"source":"iana","extensions":["dna"]},"application/vnd.document+json":{"source":"iana","compressible":true},"application/vnd.dolby.mlp":{"source":"apache","extensions":["mlp"]},"application/vnd.dolby.mobile.1":{"source":"iana"},"application/vnd.dolby.mobile.2":{"source":"iana"},"application/vnd.doremir.scorecloud-binary-document":{"source":"iana"},"application/vnd.dpgraph":{"source":"iana","extensions":["dpg"]},"application/vnd.dreamfactory":{"source":"iana","extensions":["dfac"]},"application/vnd.drive+json":{"source":"iana","compressible":true},"application/vnd.ds-keypoint":{"source":"apache","extensions":["kpxx"]},"application/vnd.dtg.local":{"source":"iana"},"application/vnd.dtg.local.flash":{"source":"iana"},"application/vnd.dtg.local.html":{"source":"iana"},"application/vnd.dvb.ait":{"source":"iana","extensions":["ait"]},"application/vnd.dvb.dvbisl+xml":{"source":"iana","compressible":true},"application/vnd.dvb.dvbj":{"source":"iana"},"application/vnd.dvb.esgcontainer":{"source":"iana"},"application/vnd.dvb.ipdcdftnotifaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess2":{"source":"iana"},"application/vnd.dvb.ipdcesgpdd":{"source":"iana"},"application/vnd.dvb.ipdcroaming":{"source":"iana"},"application/vnd.dvb.iptv.alfec-base":{"source":"iana"},"application/vnd.dvb.iptv.alfec-enhancement":{"source":"iana"},"application/vnd.dvb.notif-aggregate-root+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-container+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-generic+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-msglist+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-request+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-response+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-init+xml":{"source":"iana","compressible":true},"application/vnd.dvb.pfr":{"source":"iana"},"application/vnd.dvb.service":{"source":"iana","extensions":["svc"]},"application/vnd.dxr":{"source":"iana"},"application/vnd.dynageo":{"source":"iana","extensions":["geo"]},"application/vnd.dzr":{"source":"iana"},"application/vnd.easykaraoke.cdgdownload":{"source":"iana"},"application/vnd.ecdis-update":{"source":"iana"},"application/vnd.ecip.rlp":{"source":"iana"},"application/vnd.eclipse.ditto+json":{"source":"iana","compressible":true},"application/vnd.ecowin.chart":{"source":"iana","extensions":["mag"]},"application/vnd.ecowin.filerequest":{"source":"iana"},"application/vnd.ecowin.fileupdate":{"source":"iana"},"application/vnd.ecowin.series":{"source":"iana"},"application/vnd.ecowin.seriesrequest":{"source":"iana"},"application/vnd.ecowin.seriesupdate":{"source":"iana"},"application/vnd.efi.img":{"source":"iana"},"application/vnd.efi.iso":{"source":"iana"},"application/vnd.emclient.accessrequest+xml":{"source":"iana","compressible":true},"application/vnd.enliven":{"source":"iana","extensions":["nml"]},"application/vnd.enphase.envoy":{"source":"iana"},"application/vnd.eprints.data+xml":{"source":"iana","compressible":true},"application/vnd.epson.esf":{"source":"iana","extensions":["esf"]},"application/vnd.epson.msf":{"source":"iana","extensions":["msf"]},"application/vnd.epson.quickanime":{"source":"iana","extensions":["qam"]},"application/vnd.epson.salt":{"source":"iana","extensions":["slt"]},"application/vnd.epson.ssf":{"source":"iana","extensions":["ssf"]},"application/vnd.ericsson.quickcall":{"source":"iana"},"application/vnd.espass-espass+zip":{"source":"iana","compressible":false},"application/vnd.eszigno3+xml":{"source":"iana","compressible":true,"extensions":["es3","et3"]},"application/vnd.etsi.aoc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.asic-e+zip":{"source":"iana","compressible":false},"application/vnd.etsi.asic-s+zip":{"source":"iana","compressible":false},"application/vnd.etsi.cug+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvcommand+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-bc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-cod+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-npvr+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvservice+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsync+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvueprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mcid+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mheg5":{"source":"iana"},"application/vnd.etsi.overload-control-policy-dataset+xml":{"source":"iana","compressible":true},"application/vnd.etsi.pstn+xml":{"source":"iana","compressible":true},"application/vnd.etsi.sci+xml":{"source":"iana","compressible":true},"application/vnd.etsi.simservs+xml":{"source":"iana","compressible":true},"application/vnd.etsi.timestamp-token":{"source":"iana"},"application/vnd.etsi.tsl+xml":{"source":"iana","compressible":true},"application/vnd.etsi.tsl.der":{"source":"iana"},"application/vnd.eu.kasparian.car+json":{"source":"iana","compressible":true},"application/vnd.eudora.data":{"source":"iana"},"application/vnd.evolv.ecig.profile":{"source":"iana"},"application/vnd.evolv.ecig.settings":{"source":"iana"},"application/vnd.evolv.ecig.theme":{"source":"iana"},"application/vnd.exstream-empower+zip":{"source":"iana","compressible":false},"application/vnd.exstream-package":{"source":"iana"},"application/vnd.ezpix-album":{"source":"iana","extensions":["ez2"]},"application/vnd.ezpix-package":{"source":"iana","extensions":["ez3"]},"application/vnd.f-secure.mobile":{"source":"iana"},"application/vnd.familysearch.gedcom+zip":{"source":"iana","compressible":false},"application/vnd.fastcopy-disk-image":{"source":"iana"},"application/vnd.fdf":{"source":"iana","extensions":["fdf"]},"application/vnd.fdsn.mseed":{"source":"iana","extensions":["mseed"]},"application/vnd.fdsn.seed":{"source":"iana","extensions":["seed","dataless"]},"application/vnd.ffsns":{"source":"iana"},"application/vnd.ficlab.flb+zip":{"source":"iana","compressible":false},"application/vnd.filmit.zfc":{"source":"iana"},"application/vnd.fints":{"source":"iana"},"application/vnd.firemonkeys.cloudcell":{"source":"iana"},"application/vnd.flographit":{"source":"iana","extensions":["gph"]},"application/vnd.fluxtime.clip":{"source":"iana","extensions":["ftc"]},"application/vnd.font-fontforge-sfd":{"source":"iana"},"application/vnd.framemaker":{"source":"iana","extensions":["fm","frame","maker","book"]},"application/vnd.frogans.fnc":{"source":"iana","extensions":["fnc"]},"application/vnd.frogans.ltf":{"source":"iana","extensions":["ltf"]},"application/vnd.fsc.weblaunch":{"source":"iana","extensions":["fsc"]},"application/vnd.fujifilm.fb.docuworks":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.binder":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.container":{"source":"iana"},"application/vnd.fujifilm.fb.jfi+xml":{"source":"iana","compressible":true},"application/vnd.fujitsu.oasys":{"source":"iana","extensions":["oas"]},"application/vnd.fujitsu.oasys2":{"source":"iana","extensions":["oa2"]},"application/vnd.fujitsu.oasys3":{"source":"iana","extensions":["oa3"]},"application/vnd.fujitsu.oasysgp":{"source":"iana","extensions":["fg5"]},"application/vnd.fujitsu.oasysprs":{"source":"iana","extensions":["bh2"]},"application/vnd.fujixerox.art-ex":{"source":"iana"},"application/vnd.fujixerox.art4":{"source":"iana"},"application/vnd.fujixerox.ddd":{"source":"iana","extensions":["ddd"]},"application/vnd.fujixerox.docuworks":{"source":"iana","extensions":["xdw"]},"application/vnd.fujixerox.docuworks.binder":{"source":"iana","extensions":["xbd"]},"application/vnd.fujixerox.docuworks.container":{"source":"iana"},"application/vnd.fujixerox.hbpl":{"source":"iana"},"application/vnd.fut-misnet":{"source":"iana"},"application/vnd.futoin+cbor":{"source":"iana"},"application/vnd.futoin+json":{"source":"iana","compressible":true},"application/vnd.fuzzysheet":{"source":"iana","extensions":["fzs"]},"application/vnd.genomatix.tuxedo":{"source":"iana","extensions":["txd"]},"application/vnd.gentics.grd+json":{"source":"iana","compressible":true},"application/vnd.geo+json":{"source":"iana","compressible":true},"application/vnd.geocube+xml":{"source":"iana","compressible":true},"application/vnd.geogebra.file":{"source":"iana","extensions":["ggb"]},"application/vnd.geogebra.slides":{"source":"iana"},"application/vnd.geogebra.tool":{"source":"iana","extensions":["ggt"]},"application/vnd.geometry-explorer":{"source":"iana","extensions":["gex","gre"]},"application/vnd.geonext":{"source":"iana","extensions":["gxt"]},"application/vnd.geoplan":{"source":"iana","extensions":["g2w"]},"application/vnd.geospace":{"source":"iana","extensions":["g3w"]},"application/vnd.gerber":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt-response":{"source":"iana"},"application/vnd.gmx":{"source":"iana","extensions":["gmx"]},"application/vnd.google-apps.document":{"compressible":false,"extensions":["gdoc"]},"application/vnd.google-apps.presentation":{"compressible":false,"extensions":["gslides"]},"application/vnd.google-apps.spreadsheet":{"compressible":false,"extensions":["gsheet"]},"application/vnd.google-earth.kml+xml":{"source":"iana","compressible":true,"extensions":["kml"]},"application/vnd.google-earth.kmz":{"source":"iana","compressible":false,"extensions":["kmz"]},"application/vnd.gov.sk.e-form+xml":{"source":"iana","compressible":true},"application/vnd.gov.sk.e-form+zip":{"source":"iana","compressible":false},"application/vnd.gov.sk.xmldatacontainer+xml":{"source":"iana","compressible":true},"application/vnd.grafeq":{"source":"iana","extensions":["gqf","gqs"]},"application/vnd.gridmp":{"source":"iana"},"application/vnd.groove-account":{"source":"iana","extensions":["gac"]},"application/vnd.groove-help":{"source":"iana","extensions":["ghf"]},"application/vnd.groove-identity-message":{"source":"iana","extensions":["gim"]},"application/vnd.groove-injector":{"source":"iana","extensions":["grv"]},"application/vnd.groove-tool-message":{"source":"iana","extensions":["gtm"]},"application/vnd.groove-tool-template":{"source":"iana","extensions":["tpl"]},"application/vnd.groove-vcard":{"source":"iana","extensions":["vcg"]},"application/vnd.hal+json":{"source":"iana","compressible":true},"application/vnd.hal+xml":{"source":"iana","compressible":true,"extensions":["hal"]},"application/vnd.handheld-entertainment+xml":{"source":"iana","compressible":true,"extensions":["zmm"]},"application/vnd.hbci":{"source":"iana","extensions":["hbci"]},"application/vnd.hc+json":{"source":"iana","compressible":true},"application/vnd.hcl-bireports":{"source":"iana"},"application/vnd.hdt":{"source":"iana"},"application/vnd.heroku+json":{"source":"iana","compressible":true},"application/vnd.hhe.lesson-player":{"source":"iana","extensions":["les"]},"application/vnd.hl7cda+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hl7v2+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hp-hpgl":{"source":"iana","extensions":["hpgl"]},"application/vnd.hp-hpid":{"source":"iana","extensions":["hpid"]},"application/vnd.hp-hps":{"source":"iana","extensions":["hps"]},"application/vnd.hp-jlyt":{"source":"iana","extensions":["jlt"]},"application/vnd.hp-pcl":{"source":"iana","extensions":["pcl"]},"application/vnd.hp-pclxl":{"source":"iana","extensions":["pclxl"]},"application/vnd.httphone":{"source":"iana"},"application/vnd.hydrostatix.sof-data":{"source":"iana","extensions":["sfd-hdstx"]},"application/vnd.hyper+json":{"source":"iana","compressible":true},"application/vnd.hyper-item+json":{"source":"iana","compressible":true},"application/vnd.hyperdrive+json":{"source":"iana","compressible":true},"application/vnd.hzn-3d-crossword":{"source":"iana"},"application/vnd.ibm.afplinedata":{"source":"iana"},"application/vnd.ibm.electronic-media":{"source":"iana"},"application/vnd.ibm.minipay":{"source":"iana","extensions":["mpy"]},"application/vnd.ibm.modcap":{"source":"iana","extensions":["afp","listafp","list3820"]},"application/vnd.ibm.rights-management":{"source":"iana","extensions":["irm"]},"application/vnd.ibm.secure-container":{"source":"iana","extensions":["sc"]},"application/vnd.iccprofile":{"source":"iana","extensions":["icc","icm"]},"application/vnd.ieee.1905":{"source":"iana"},"application/vnd.igloader":{"source":"iana","extensions":["igl"]},"application/vnd.imagemeter.folder+zip":{"source":"iana","compressible":false},"application/vnd.imagemeter.image+zip":{"source":"iana","compressible":false},"application/vnd.immervision-ivp":{"source":"iana","extensions":["ivp"]},"application/vnd.immervision-ivu":{"source":"iana","extensions":["ivu"]},"application/vnd.ims.imsccv1p1":{"source":"iana"},"application/vnd.ims.imsccv1p2":{"source":"iana"},"application/vnd.ims.imsccv1p3":{"source":"iana"},"application/vnd.ims.lis.v2.result+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolconsumerprofile+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy.id+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings.simple+json":{"source":"iana","compressible":true},"application/vnd.informedcontrol.rms+xml":{"source":"iana","compressible":true},"application/vnd.informix-visionary":{"source":"iana"},"application/vnd.infotech.project":{"source":"iana"},"application/vnd.infotech.project+xml":{"source":"iana","compressible":true},"application/vnd.innopath.wamp.notification":{"source":"iana"},"application/vnd.insors.igm":{"source":"iana","extensions":["igm"]},"application/vnd.intercon.formnet":{"source":"iana","extensions":["xpw","xpx"]},"application/vnd.intergeo":{"source":"iana","extensions":["i2g"]},"application/vnd.intertrust.digibox":{"source":"iana"},"application/vnd.intertrust.nncp":{"source":"iana"},"application/vnd.intu.qbo":{"source":"iana","extensions":["qbo"]},"application/vnd.intu.qfx":{"source":"iana","extensions":["qfx"]},"application/vnd.iptc.g2.catalogitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.conceptitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.knowledgeitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsmessage+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.packageitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.planningitem+xml":{"source":"iana","compressible":true},"application/vnd.ipunplugged.rcprofile":{"source":"iana","extensions":["rcprofile"]},"application/vnd.irepository.package+xml":{"source":"iana","compressible":true,"extensions":["irp"]},"application/vnd.is-xpr":{"source":"iana","extensions":["xpr"]},"application/vnd.isac.fcs":{"source":"iana","extensions":["fcs"]},"application/vnd.iso11783-10+zip":{"source":"iana","compressible":false},"application/vnd.jam":{"source":"iana","extensions":["jam"]},"application/vnd.japannet-directory-service":{"source":"iana"},"application/vnd.japannet-jpnstore-wakeup":{"source":"iana"},"application/vnd.japannet-payment-wakeup":{"source":"iana"},"application/vnd.japannet-registration":{"source":"iana"},"application/vnd.japannet-registration-wakeup":{"source":"iana"},"application/vnd.japannet-setstore-wakeup":{"source":"iana"},"application/vnd.japannet-verification":{"source":"iana"},"application/vnd.japannet-verification-wakeup":{"source":"iana"},"application/vnd.jcp.javame.midlet-rms":{"source":"iana","extensions":["rms"]},"application/vnd.jisp":{"source":"iana","extensions":["jisp"]},"application/vnd.joost.joda-archive":{"source":"iana","extensions":["joda"]},"application/vnd.jsk.isdn-ngn":{"source":"iana"},"application/vnd.kahootz":{"source":"iana","extensions":["ktz","ktr"]},"application/vnd.kde.karbon":{"source":"iana","extensions":["karbon"]},"application/vnd.kde.kchart":{"source":"iana","extensions":["chrt"]},"application/vnd.kde.kformula":{"source":"iana","extensions":["kfo"]},"application/vnd.kde.kivio":{"source":"iana","extensions":["flw"]},"application/vnd.kde.kontour":{"source":"iana","extensions":["kon"]},"application/vnd.kde.kpresenter":{"source":"iana","extensions":["kpr","kpt"]},"application/vnd.kde.kspread":{"source":"iana","extensions":["ksp"]},"application/vnd.kde.kword":{"source":"iana","extensions":["kwd","kwt"]},"application/vnd.kenameaapp":{"source":"iana","extensions":["htke"]},"application/vnd.kidspiration":{"source":"iana","extensions":["kia"]},"application/vnd.kinar":{"source":"iana","extensions":["kne","knp"]},"application/vnd.koan":{"source":"iana","extensions":["skp","skd","skt","skm"]},"application/vnd.kodak-descriptor":{"source":"iana","extensions":["sse"]},"application/vnd.las":{"source":"iana"},"application/vnd.las.las+json":{"source":"iana","compressible":true},"application/vnd.las.las+xml":{"source":"iana","compressible":true,"extensions":["lasxml"]},"application/vnd.laszip":{"source":"iana"},"application/vnd.leap+json":{"source":"iana","compressible":true},"application/vnd.liberty-request+xml":{"source":"iana","compressible":true},"application/vnd.llamagraphics.life-balance.desktop":{"source":"iana","extensions":["lbd"]},"application/vnd.llamagraphics.life-balance.exchange+xml":{"source":"iana","compressible":true,"extensions":["lbe"]},"application/vnd.logipipe.circuit+zip":{"source":"iana","compressible":false},"application/vnd.loom":{"source":"iana"},"application/vnd.lotus-1-2-3":{"source":"iana","extensions":["123"]},"application/vnd.lotus-approach":{"source":"iana","extensions":["apr"]},"application/vnd.lotus-freelance":{"source":"iana","extensions":["pre"]},"application/vnd.lotus-notes":{"source":"iana","extensions":["nsf"]},"application/vnd.lotus-organizer":{"source":"iana","extensions":["org"]},"application/vnd.lotus-screencam":{"source":"iana","extensions":["scm"]},"application/vnd.lotus-wordpro":{"source":"iana","extensions":["lwp"]},"application/vnd.macports.portpkg":{"source":"iana","extensions":["portpkg"]},"application/vnd.mapbox-vector-tile":{"source":"iana","extensions":["mvt"]},"application/vnd.marlin.drm.actiontoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.conftoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.license+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.mdcf":{"source":"iana"},"application/vnd.mason+json":{"source":"iana","compressible":true},"application/vnd.maxar.archive.3tz+zip":{"source":"iana","compressible":false},"application/vnd.maxmind.maxmind-db":{"source":"iana"},"application/vnd.mcd":{"source":"iana","extensions":["mcd"]},"application/vnd.medcalcdata":{"source":"iana","extensions":["mc1"]},"application/vnd.mediastation.cdkey":{"source":"iana","extensions":["cdkey"]},"application/vnd.meridian-slingshot":{"source":"iana"},"application/vnd.mfer":{"source":"iana","extensions":["mwf"]},"application/vnd.mfmp":{"source":"iana","extensions":["mfm"]},"application/vnd.micro+json":{"source":"iana","compressible":true},"application/vnd.micrografx.flo":{"source":"iana","extensions":["flo"]},"application/vnd.micrografx.igx":{"source":"iana","extensions":["igx"]},"application/vnd.microsoft.portable-executable":{"source":"iana"},"application/vnd.microsoft.windows.thumbnail-cache":{"source":"iana"},"application/vnd.miele+json":{"source":"iana","compressible":true},"application/vnd.mif":{"source":"iana","extensions":["mif"]},"application/vnd.minisoft-hp3000-save":{"source":"iana"},"application/vnd.mitsubishi.misty-guard.trustweb":{"source":"iana"},"application/vnd.mobius.daf":{"source":"iana","extensions":["daf"]},"application/vnd.mobius.dis":{"source":"iana","extensions":["dis"]},"application/vnd.mobius.mbk":{"source":"iana","extensions":["mbk"]},"application/vnd.mobius.mqy":{"source":"iana","extensions":["mqy"]},"application/vnd.mobius.msl":{"source":"iana","extensions":["msl"]},"application/vnd.mobius.plc":{"source":"iana","extensions":["plc"]},"application/vnd.mobius.txf":{"source":"iana","extensions":["txf"]},"application/vnd.mophun.application":{"source":"iana","extensions":["mpn"]},"application/vnd.mophun.certificate":{"source":"iana","extensions":["mpc"]},"application/vnd.motorola.flexsuite":{"source":"iana"},"application/vnd.motorola.flexsuite.adsi":{"source":"iana"},"application/vnd.motorola.flexsuite.fis":{"source":"iana"},"application/vnd.motorola.flexsuite.gotap":{"source":"iana"},"application/vnd.motorola.flexsuite.kmr":{"source":"iana"},"application/vnd.motorola.flexsuite.ttc":{"source":"iana"},"application/vnd.motorola.flexsuite.wem":{"source":"iana"},"application/vnd.motorola.iprm":{"source":"iana"},"application/vnd.mozilla.xul+xml":{"source":"iana","compressible":true,"extensions":["xul"]},"application/vnd.ms-3mfdocument":{"source":"iana"},"application/vnd.ms-artgalry":{"source":"iana","extensions":["cil"]},"application/vnd.ms-asf":{"source":"iana"},"application/vnd.ms-cab-compressed":{"source":"iana","extensions":["cab"]},"application/vnd.ms-color.iccprofile":{"source":"apache"},"application/vnd.ms-excel":{"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},"application/vnd.ms-excel.addin.macroenabled.12":{"source":"iana","extensions":["xlam"]},"application/vnd.ms-excel.sheet.binary.macroenabled.12":{"source":"iana","extensions":["xlsb"]},"application/vnd.ms-excel.sheet.macroenabled.12":{"source":"iana","extensions":["xlsm"]},"application/vnd.ms-excel.template.macroenabled.12":{"source":"iana","extensions":["xltm"]},"application/vnd.ms-fontobject":{"source":"iana","compressible":true,"extensions":["eot"]},"application/vnd.ms-htmlhelp":{"source":"iana","extensions":["chm"]},"application/vnd.ms-ims":{"source":"iana","extensions":["ims"]},"application/vnd.ms-lrm":{"source":"iana","extensions":["lrm"]},"application/vnd.ms-office.activex+xml":{"source":"iana","compressible":true},"application/vnd.ms-officetheme":{"source":"iana","extensions":["thmx"]},"application/vnd.ms-opentype":{"source":"apache","compressible":true},"application/vnd.ms-outlook":{"compressible":false,"extensions":["msg"]},"application/vnd.ms-package.obfuscated-opentype":{"source":"apache"},"application/vnd.ms-pki.seccat":{"source":"apache","extensions":["cat"]},"application/vnd.ms-pki.stl":{"source":"apache","extensions":["stl"]},"application/vnd.ms-playready.initiator+xml":{"source":"iana","compressible":true},"application/vnd.ms-powerpoint":{"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},"application/vnd.ms-powerpoint.addin.macroenabled.12":{"source":"iana","extensions":["ppam"]},"application/vnd.ms-powerpoint.presentation.macroenabled.12":{"source":"iana","extensions":["pptm"]},"application/vnd.ms-powerpoint.slide.macroenabled.12":{"source":"iana","extensions":["sldm"]},"application/vnd.ms-powerpoint.slideshow.macroenabled.12":{"source":"iana","extensions":["ppsm"]},"application/vnd.ms-powerpoint.template.macroenabled.12":{"source":"iana","extensions":["potm"]},"application/vnd.ms-printdevicecapabilities+xml":{"source":"iana","compressible":true},"application/vnd.ms-printing.printticket+xml":{"source":"apache","compressible":true},"application/vnd.ms-printschematicket+xml":{"source":"iana","compressible":true},"application/vnd.ms-project":{"source":"iana","extensions":["mpp","mpt"]},"application/vnd.ms-tnef":{"source":"iana"},"application/vnd.ms-windows.devicepairing":{"source":"iana"},"application/vnd.ms-windows.nwprinting.oob":{"source":"iana"},"application/vnd.ms-windows.printerpairing":{"source":"iana"},"application/vnd.ms-windows.wsd.oob":{"source":"iana"},"application/vnd.ms-wmdrm.lic-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.lic-resp":{"source":"iana"},"application/vnd.ms-wmdrm.meter-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.meter-resp":{"source":"iana"},"application/vnd.ms-word.document.macroenabled.12":{"source":"iana","extensions":["docm"]},"application/vnd.ms-word.template.macroenabled.12":{"source":"iana","extensions":["dotm"]},"application/vnd.ms-works":{"source":"iana","extensions":["wps","wks","wcm","wdb"]},"application/vnd.ms-wpl":{"source":"iana","extensions":["wpl"]},"application/vnd.ms-xpsdocument":{"source":"iana","compressible":false,"extensions":["xps"]},"application/vnd.msa-disk-image":{"source":"iana"},"application/vnd.mseq":{"source":"iana","extensions":["mseq"]},"application/vnd.msign":{"source":"iana"},"application/vnd.multiad.creator":{"source":"iana"},"application/vnd.multiad.creator.cif":{"source":"iana"},"application/vnd.music-niff":{"source":"iana"},"application/vnd.musician":{"source":"iana","extensions":["mus"]},"application/vnd.muvee.style":{"source":"iana","extensions":["msty"]},"application/vnd.mynfc":{"source":"iana","extensions":["taglet"]},"application/vnd.nacamar.ybrid+json":{"source":"iana","compressible":true},"application/vnd.ncd.control":{"source":"iana"},"application/vnd.ncd.reference":{"source":"iana"},"application/vnd.nearst.inv+json":{"source":"iana","compressible":true},"application/vnd.nebumind.line":{"source":"iana"},"application/vnd.nervana":{"source":"iana"},"application/vnd.netfpx":{"source":"iana"},"application/vnd.neurolanguage.nlu":{"source":"iana","extensions":["nlu"]},"application/vnd.nimn":{"source":"iana"},"application/vnd.nintendo.nitro.rom":{"source":"iana"},"application/vnd.nintendo.snes.rom":{"source":"iana"},"application/vnd.nitf":{"source":"iana","extensions":["ntf","nitf"]},"application/vnd.noblenet-directory":{"source":"iana","extensions":["nnd"]},"application/vnd.noblenet-sealer":{"source":"iana","extensions":["nns"]},"application/vnd.noblenet-web":{"source":"iana","extensions":["nnw"]},"application/vnd.nokia.catalogs":{"source":"iana"},"application/vnd.nokia.conml+wbxml":{"source":"iana"},"application/vnd.nokia.conml+xml":{"source":"iana","compressible":true},"application/vnd.nokia.iptv.config+xml":{"source":"iana","compressible":true},"application/vnd.nokia.isds-radio-presets":{"source":"iana"},"application/vnd.nokia.landmark+wbxml":{"source":"iana"},"application/vnd.nokia.landmark+xml":{"source":"iana","compressible":true},"application/vnd.nokia.landmarkcollection+xml":{"source":"iana","compressible":true},"application/vnd.nokia.n-gage.ac+xml":{"source":"iana","compressible":true,"extensions":["ac"]},"application/vnd.nokia.n-gage.data":{"source":"iana","extensions":["ngdat"]},"application/vnd.nokia.n-gage.symbian.install":{"source":"iana","extensions":["n-gage"]},"application/vnd.nokia.ncd":{"source":"iana"},"application/vnd.nokia.pcd+wbxml":{"source":"iana"},"application/vnd.nokia.pcd+xml":{"source":"iana","compressible":true},"application/vnd.nokia.radio-preset":{"source":"iana","extensions":["rpst"]},"application/vnd.nokia.radio-presets":{"source":"iana","extensions":["rpss"]},"application/vnd.novadigm.edm":{"source":"iana","extensions":["edm"]},"application/vnd.novadigm.edx":{"source":"iana","extensions":["edx"]},"application/vnd.novadigm.ext":{"source":"iana","extensions":["ext"]},"application/vnd.ntt-local.content-share":{"source":"iana"},"application/vnd.ntt-local.file-transfer":{"source":"iana"},"application/vnd.ntt-local.ogw_remote-access":{"source":"iana"},"application/vnd.ntt-local.sip-ta_remote":{"source":"iana"},"application/vnd.ntt-local.sip-ta_tcp_stream":{"source":"iana"},"application/vnd.oasis.opendocument.chart":{"source":"iana","extensions":["odc"]},"application/vnd.oasis.opendocument.chart-template":{"source":"iana","extensions":["otc"]},"application/vnd.oasis.opendocument.database":{"source":"iana","extensions":["odb"]},"application/vnd.oasis.opendocument.formula":{"source":"iana","extensions":["odf"]},"application/vnd.oasis.opendocument.formula-template":{"source":"iana","extensions":["odft"]},"application/vnd.oasis.opendocument.graphics":{"source":"iana","compressible":false,"extensions":["odg"]},"application/vnd.oasis.opendocument.graphics-template":{"source":"iana","extensions":["otg"]},"application/vnd.oasis.opendocument.image":{"source":"iana","extensions":["odi"]},"application/vnd.oasis.opendocument.image-template":{"source":"iana","extensions":["oti"]},"application/vnd.oasis.opendocument.presentation":{"source":"iana","compressible":false,"extensions":["odp"]},"application/vnd.oasis.opendocument.presentation-template":{"source":"iana","extensions":["otp"]},"application/vnd.oasis.opendocument.spreadsheet":{"source":"iana","compressible":false,"extensions":["ods"]},"application/vnd.oasis.opendocument.spreadsheet-template":{"source":"iana","extensions":["ots"]},"application/vnd.oasis.opendocument.text":{"source":"iana","compressible":false,"extensions":["odt"]},"application/vnd.oasis.opendocument.text-master":{"source":"iana","extensions":["odm"]},"application/vnd.oasis.opendocument.text-template":{"source":"iana","extensions":["ott"]},"application/vnd.oasis.opendocument.text-web":{"source":"iana","extensions":["oth"]},"application/vnd.obn":{"source":"iana"},"application/vnd.ocf+cbor":{"source":"iana"},"application/vnd.oci.image.manifest.v1+json":{"source":"iana","compressible":true},"application/vnd.oftn.l10n+json":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessdownload+xml":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessstreaming+xml":{"source":"iana","compressible":true},"application/vnd.oipf.cspg-hexbinary":{"source":"iana"},"application/vnd.oipf.dae.svg+xml":{"source":"iana","compressible":true},"application/vnd.oipf.dae.xhtml+xml":{"source":"iana","compressible":true},"application/vnd.oipf.mippvcontrolmessage+xml":{"source":"iana","compressible":true},"application/vnd.oipf.pae.gem":{"source":"iana"},"application/vnd.oipf.spdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.oipf.spdlist+xml":{"source":"iana","compressible":true},"application/vnd.oipf.ueprofile+xml":{"source":"iana","compressible":true},"application/vnd.oipf.userprofile+xml":{"source":"iana","compressible":true},"application/vnd.olpc-sugar":{"source":"iana","extensions":["xo"]},"application/vnd.oma-scws-config":{"source":"iana"},"application/vnd.oma-scws-http-request":{"source":"iana"},"application/vnd.oma-scws-http-response":{"source":"iana"},"application/vnd.oma.bcast.associated-procedure-parameter+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.drm-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.imd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.ltkm":{"source":"iana"},"application/vnd.oma.bcast.notification+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.provisioningtrigger":{"source":"iana"},"application/vnd.oma.bcast.sgboot":{"source":"iana"},"application/vnd.oma.bcast.sgdd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sgdu":{"source":"iana"},"application/vnd.oma.bcast.simple-symbol-container":{"source":"iana"},"application/vnd.oma.bcast.smartcard-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sprov+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.stkm":{"source":"iana"},"application/vnd.oma.cab-address-book+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-feature-handler+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-pcc+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-subs-invite+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-user-prefs+xml":{"source":"iana","compressible":true},"application/vnd.oma.dcd":{"source":"iana"},"application/vnd.oma.dcdc":{"source":"iana"},"application/vnd.oma.dd2+xml":{"source":"iana","compressible":true,"extensions":["dd2"]},"application/vnd.oma.drm.risd+xml":{"source":"iana","compressible":true},"application/vnd.oma.group-usage-list+xml":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+cbor":{"source":"iana"},"application/vnd.oma.lwm2m+json":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+tlv":{"source":"iana"},"application/vnd.oma.pal+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.detailed-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.final-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.groups+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.invocation-descriptor+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.optimized-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.push":{"source":"iana"},"application/vnd.oma.scidm.messages+xml":{"source":"iana","compressible":true},"application/vnd.oma.xcap-directory+xml":{"source":"iana","compressible":true},"application/vnd.omads-email+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-file+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-folder+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omaloc-supl-init":{"source":"iana"},"application/vnd.onepager":{"source":"iana"},"application/vnd.onepagertamp":{"source":"iana"},"application/vnd.onepagertamx":{"source":"iana"},"application/vnd.onepagertat":{"source":"iana"},"application/vnd.onepagertatp":{"source":"iana"},"application/vnd.onepagertatx":{"source":"iana"},"application/vnd.openblox.game+xml":{"source":"iana","compressible":true,"extensions":["obgx"]},"application/vnd.openblox.game-binary":{"source":"iana"},"application/vnd.openeye.oeb":{"source":"iana"},"application/vnd.openofficeorg.extension":{"source":"apache","extensions":["oxt"]},"application/vnd.openstreetmap.data+xml":{"source":"iana","compressible":true,"extensions":["osm"]},"application/vnd.opentimestamps.ots":{"source":"iana"},"application/vnd.openxmlformats-officedocument.custom-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.customxmlproperties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawing+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chart+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.extended-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presentation":{"source":"iana","compressible":false,"extensions":["pptx"]},"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slide":{"source":"iana","extensions":["sldx"]},"application/vnd.openxmlformats-officedocument.presentationml.slide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideshow":{"source":"iana","extensions":["ppsx"]},"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tags+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.template":{"source":"iana","extensions":["potx"]},"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":{"source":"iana","compressible":false,"extensions":["xlsx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.template":{"source":"iana","extensions":["xltx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.theme+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.themeoverride+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.vmldrawing":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document":{"source":"iana","compressible":false,"extensions":["docx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.template":{"source":"iana","extensions":["dotx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.core-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.relationships+xml":{"source":"iana","compressible":true},"application/vnd.oracle.resource+json":{"source":"iana","compressible":true},"application/vnd.orange.indata":{"source":"iana"},"application/vnd.osa.netdeploy":{"source":"iana"},"application/vnd.osgeo.mapguide.package":{"source":"iana","extensions":["mgp"]},"application/vnd.osgi.bundle":{"source":"iana"},"application/vnd.osgi.dp":{"source":"iana","extensions":["dp"]},"application/vnd.osgi.subsystem":{"source":"iana","extensions":["esa"]},"application/vnd.otps.ct-kip+xml":{"source":"iana","compressible":true},"application/vnd.oxli.countgraph":{"source":"iana"},"application/vnd.pagerduty+json":{"source":"iana","compressible":true},"application/vnd.palm":{"source":"iana","extensions":["pdb","pqa","oprc"]},"application/vnd.panoply":{"source":"iana"},"application/vnd.paos.xml":{"source":"iana"},"application/vnd.patentdive":{"source":"iana"},"application/vnd.patientecommsdoc":{"source":"iana"},"application/vnd.pawaafile":{"source":"iana","extensions":["paw"]},"application/vnd.pcos":{"source":"iana"},"application/vnd.pg.format":{"source":"iana","extensions":["str"]},"application/vnd.pg.osasli":{"source":"iana","extensions":["ei6"]},"application/vnd.piaccess.application-licence":{"source":"iana"},"application/vnd.picsel":{"source":"iana","extensions":["efif"]},"application/vnd.pmi.widget":{"source":"iana","extensions":["wg"]},"application/vnd.poc.group-advertisement+xml":{"source":"iana","compressible":true},"application/vnd.pocketlearn":{"source":"iana","extensions":["plf"]},"application/vnd.powerbuilder6":{"source":"iana","extensions":["pbd"]},"application/vnd.powerbuilder6-s":{"source":"iana"},"application/vnd.powerbuilder7":{"source":"iana"},"application/vnd.powerbuilder7-s":{"source":"iana"},"application/vnd.powerbuilder75":{"source":"iana"},"application/vnd.powerbuilder75-s":{"source":"iana"},"application/vnd.preminet":{"source":"iana"},"application/vnd.previewsystems.box":{"source":"iana","extensions":["box"]},"application/vnd.proteus.magazine":{"source":"iana","extensions":["mgz"]},"application/vnd.psfs":{"source":"iana"},"application/vnd.publishare-delta-tree":{"source":"iana","extensions":["qps"]},"application/vnd.pvi.ptid1":{"source":"iana","extensions":["ptid"]},"application/vnd.pwg-multiplexed":{"source":"iana"},"application/vnd.pwg-xhtml-print+xml":{"source":"iana","compressible":true},"application/vnd.qualcomm.brew-app-res":{"source":"iana"},"application/vnd.quarantainenet":{"source":"iana"},"application/vnd.quark.quarkxpress":{"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},"application/vnd.quobject-quoxdocument":{"source":"iana"},"application/vnd.radisys.moml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conn+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-stream+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-base+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-detect+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-sendrecv+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-group+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-speech+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-transform+xml":{"source":"iana","compressible":true},"application/vnd.rainstor.data":{"source":"iana"},"application/vnd.rapid":{"source":"iana"},"application/vnd.rar":{"source":"iana","extensions":["rar"]},"application/vnd.realvnc.bed":{"source":"iana","extensions":["bed"]},"application/vnd.recordare.musicxml":{"source":"iana","extensions":["mxl"]},"application/vnd.recordare.musicxml+xml":{"source":"iana","compressible":true,"extensions":["musicxml"]},"application/vnd.renlearn.rlprint":{"source":"iana"},"application/vnd.resilient.logic":{"source":"iana"},"application/vnd.restful+json":{"source":"iana","compressible":true},"application/vnd.rig.cryptonote":{"source":"iana","extensions":["cryptonote"]},"application/vnd.rim.cod":{"source":"apache","extensions":["cod"]},"application/vnd.rn-realmedia":{"source":"apache","extensions":["rm"]},"application/vnd.rn-realmedia-vbr":{"source":"apache","extensions":["rmvb"]},"application/vnd.route66.link66+xml":{"source":"iana","compressible":true,"extensions":["link66"]},"application/vnd.rs-274x":{"source":"iana"},"application/vnd.ruckus.download":{"source":"iana"},"application/vnd.s3sms":{"source":"iana"},"application/vnd.sailingtracker.track":{"source":"iana","extensions":["st"]},"application/vnd.sar":{"source":"iana"},"application/vnd.sbm.cid":{"source":"iana"},"application/vnd.sbm.mid2":{"source":"iana"},"application/vnd.scribus":{"source":"iana"},"application/vnd.sealed.3df":{"source":"iana"},"application/vnd.sealed.csf":{"source":"iana"},"application/vnd.sealed.doc":{"source":"iana"},"application/vnd.sealed.eml":{"source":"iana"},"application/vnd.sealed.mht":{"source":"iana"},"application/vnd.sealed.net":{"source":"iana"},"application/vnd.sealed.ppt":{"source":"iana"},"application/vnd.sealed.tiff":{"source":"iana"},"application/vnd.sealed.xls":{"source":"iana"},"application/vnd.sealedmedia.softseal.html":{"source":"iana"},"application/vnd.sealedmedia.softseal.pdf":{"source":"iana"},"application/vnd.seemail":{"source":"iana","extensions":["see"]},"application/vnd.seis+json":{"source":"iana","compressible":true},"application/vnd.sema":{"source":"iana","extensions":["sema"]},"application/vnd.semd":{"source":"iana","extensions":["semd"]},"application/vnd.semf":{"source":"iana","extensions":["semf"]},"application/vnd.shade-save-file":{"source":"iana"},"application/vnd.shana.informed.formdata":{"source":"iana","extensions":["ifm"]},"application/vnd.shana.informed.formtemplate":{"source":"iana","extensions":["itp"]},"application/vnd.shana.informed.interchange":{"source":"iana","extensions":["iif"]},"application/vnd.shana.informed.package":{"source":"iana","extensions":["ipk"]},"application/vnd.shootproof+json":{"source":"iana","compressible":true},"application/vnd.shopkick+json":{"source":"iana","compressible":true},"application/vnd.shp":{"source":"iana"},"application/vnd.shx":{"source":"iana"},"application/vnd.sigrok.session":{"source":"iana"},"application/vnd.simtech-mindmapper":{"source":"iana","extensions":["twd","twds"]},"application/vnd.siren+json":{"source":"iana","compressible":true},"application/vnd.smaf":{"source":"iana","extensions":["mmf"]},"application/vnd.smart.notebook":{"source":"iana"},"application/vnd.smart.teacher":{"source":"iana","extensions":["teacher"]},"application/vnd.snesdev-page-table":{"source":"iana"},"application/vnd.software602.filler.form+xml":{"source":"iana","compressible":true,"extensions":["fo"]},"application/vnd.software602.filler.form-xml-zip":{"source":"iana"},"application/vnd.solent.sdkm+xml":{"source":"iana","compressible":true,"extensions":["sdkm","sdkd"]},"application/vnd.spotfire.dxp":{"source":"iana","extensions":["dxp"]},"application/vnd.spotfire.sfs":{"source":"iana","extensions":["sfs"]},"application/vnd.sqlite3":{"source":"iana"},"application/vnd.sss-cod":{"source":"iana"},"application/vnd.sss-dtf":{"source":"iana"},"application/vnd.sss-ntf":{"source":"iana"},"application/vnd.stardivision.calc":{"source":"apache","extensions":["sdc"]},"application/vnd.stardivision.draw":{"source":"apache","extensions":["sda"]},"application/vnd.stardivision.impress":{"source":"apache","extensions":["sdd"]},"application/vnd.stardivision.math":{"source":"apache","extensions":["smf"]},"application/vnd.stardivision.writer":{"source":"apache","extensions":["sdw","vor"]},"application/vnd.stardivision.writer-global":{"source":"apache","extensions":["sgl"]},"application/vnd.stepmania.package":{"source":"iana","extensions":["smzip"]},"application/vnd.stepmania.stepchart":{"source":"iana","extensions":["sm"]},"application/vnd.street-stream":{"source":"iana"},"application/vnd.sun.wadl+xml":{"source":"iana","compressible":true,"extensions":["wadl"]},"application/vnd.sun.xml.calc":{"source":"apache","extensions":["sxc"]},"application/vnd.sun.xml.calc.template":{"source":"apache","extensions":["stc"]},"application/vnd.sun.xml.draw":{"source":"apache","extensions":["sxd"]},"application/vnd.sun.xml.draw.template":{"source":"apache","extensions":["std"]},"application/vnd.sun.xml.impress":{"source":"apache","extensions":["sxi"]},"application/vnd.sun.xml.impress.template":{"source":"apache","extensions":["sti"]},"application/vnd.sun.xml.math":{"source":"apache","extensions":["sxm"]},"application/vnd.sun.xml.writer":{"source":"apache","extensions":["sxw"]},"application/vnd.sun.xml.writer.global":{"source":"apache","extensions":["sxg"]},"application/vnd.sun.xml.writer.template":{"source":"apache","extensions":["stw"]},"application/vnd.sus-calendar":{"source":"iana","extensions":["sus","susp"]},"application/vnd.svd":{"source":"iana","extensions":["svd"]},"application/vnd.swiftview-ics":{"source":"iana"},"application/vnd.sycle+xml":{"source":"iana","compressible":true},"application/vnd.syft+json":{"source":"iana","compressible":true},"application/vnd.symbian.install":{"source":"apache","extensions":["sis","sisx"]},"application/vnd.syncml+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xsm"]},"application/vnd.syncml.dm+wbxml":{"source":"iana","charset":"UTF-8","extensions":["bdm"]},"application/vnd.syncml.dm+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xdm"]},"application/vnd.syncml.dm.notification":{"source":"iana"},"application/vnd.syncml.dmddf+wbxml":{"source":"iana"},"application/vnd.syncml.dmddf+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["ddf"]},"application/vnd.syncml.dmtnds+wbxml":{"source":"iana"},"application/vnd.syncml.dmtnds+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.syncml.ds.notification":{"source":"iana"},"application/vnd.tableschema+json":{"source":"iana","compressible":true},"application/vnd.tao.intent-module-archive":{"source":"iana","extensions":["tao"]},"application/vnd.tcpdump.pcap":{"source":"iana","extensions":["pcap","cap","dmp"]},"application/vnd.think-cell.ppttc+json":{"source":"iana","compressible":true},"application/vnd.tmd.mediaflex.api+xml":{"source":"iana","compressible":true},"application/vnd.tml":{"source":"iana"},"application/vnd.tmobile-livetv":{"source":"iana","extensions":["tmo"]},"application/vnd.tri.onesource":{"source":"iana"},"application/vnd.trid.tpt":{"source":"iana","extensions":["tpt"]},"application/vnd.triscape.mxs":{"source":"iana","extensions":["mxs"]},"application/vnd.trueapp":{"source":"iana","extensions":["tra"]},"application/vnd.truedoc":{"source":"iana"},"application/vnd.ubisoft.webplayer":{"source":"iana"},"application/vnd.ufdl":{"source":"iana","extensions":["ufd","ufdl"]},"application/vnd.uiq.theme":{"source":"iana","extensions":["utz"]},"application/vnd.umajin":{"source":"iana","extensions":["umj"]},"application/vnd.unity":{"source":"iana","extensions":["unityweb"]},"application/vnd.uoml+xml":{"source":"iana","compressible":true,"extensions":["uoml"]},"application/vnd.uplanet.alert":{"source":"iana"},"application/vnd.uplanet.alert-wbxml":{"source":"iana"},"application/vnd.uplanet.bearer-choice":{"source":"iana"},"application/vnd.uplanet.bearer-choice-wbxml":{"source":"iana"},"application/vnd.uplanet.cacheop":{"source":"iana"},"application/vnd.uplanet.cacheop-wbxml":{"source":"iana"},"application/vnd.uplanet.channel":{"source":"iana"},"application/vnd.uplanet.channel-wbxml":{"source":"iana"},"application/vnd.uplanet.list":{"source":"iana"},"application/vnd.uplanet.list-wbxml":{"source":"iana"},"application/vnd.uplanet.listcmd":{"source":"iana"},"application/vnd.uplanet.listcmd-wbxml":{"source":"iana"},"application/vnd.uplanet.signal":{"source":"iana"},"application/vnd.uri-map":{"source":"iana"},"application/vnd.valve.source.material":{"source":"iana"},"application/vnd.vcx":{"source":"iana","extensions":["vcx"]},"application/vnd.vd-study":{"source":"iana"},"application/vnd.vectorworks":{"source":"iana"},"application/vnd.vel+json":{"source":"iana","compressible":true},"application/vnd.verimatrix.vcas":{"source":"iana"},"application/vnd.veritone.aion+json":{"source":"iana","compressible":true},"application/vnd.veryant.thin":{"source":"iana"},"application/vnd.ves.encrypted":{"source":"iana"},"application/vnd.vidsoft.vidconference":{"source":"iana"},"application/vnd.visio":{"source":"iana","extensions":["vsd","vst","vss","vsw"]},"application/vnd.visionary":{"source":"iana","extensions":["vis"]},"application/vnd.vividence.scriptfile":{"source":"iana"},"application/vnd.vsf":{"source":"iana","extensions":["vsf"]},"application/vnd.wap.sic":{"source":"iana"},"application/vnd.wap.slc":{"source":"iana"},"application/vnd.wap.wbxml":{"source":"iana","charset":"UTF-8","extensions":["wbxml"]},"application/vnd.wap.wmlc":{"source":"iana","extensions":["wmlc"]},"application/vnd.wap.wmlscriptc":{"source":"iana","extensions":["wmlsc"]},"application/vnd.webturbo":{"source":"iana","extensions":["wtb"]},"application/vnd.wfa.dpp":{"source":"iana"},"application/vnd.wfa.p2p":{"source":"iana"},"application/vnd.wfa.wsc":{"source":"iana"},"application/vnd.windows.devicepairing":{"source":"iana"},"application/vnd.wmc":{"source":"iana"},"application/vnd.wmf.bootstrap":{"source":"iana"},"application/vnd.wolfram.mathematica":{"source":"iana"},"application/vnd.wolfram.mathematica.package":{"source":"iana"},"application/vnd.wolfram.player":{"source":"iana","extensions":["nbp"]},"application/vnd.wordperfect":{"source":"iana","extensions":["wpd"]},"application/vnd.wqd":{"source":"iana","extensions":["wqd"]},"application/vnd.wrq-hp3000-labelled":{"source":"iana"},"application/vnd.wt.stf":{"source":"iana","extensions":["stf"]},"application/vnd.wv.csp+wbxml":{"source":"iana"},"application/vnd.wv.csp+xml":{"source":"iana","compressible":true},"application/vnd.wv.ssp+xml":{"source":"iana","compressible":true},"application/vnd.xacml+json":{"source":"iana","compressible":true},"application/vnd.xara":{"source":"iana","extensions":["xar"]},"application/vnd.xfdl":{"source":"iana","extensions":["xfdl"]},"application/vnd.xfdl.webform":{"source":"iana"},"application/vnd.xmi+xml":{"source":"iana","compressible":true},"application/vnd.xmpie.cpkg":{"source":"iana"},"application/vnd.xmpie.dpkg":{"source":"iana"},"application/vnd.xmpie.plan":{"source":"iana"},"application/vnd.xmpie.ppkg":{"source":"iana"},"application/vnd.xmpie.xlim":{"source":"iana"},"application/vnd.yamaha.hv-dic":{"source":"iana","extensions":["hvd"]},"application/vnd.yamaha.hv-script":{"source":"iana","extensions":["hvs"]},"application/vnd.yamaha.hv-voice":{"source":"iana","extensions":["hvp"]},"application/vnd.yamaha.openscoreformat":{"source":"iana","extensions":["osf"]},"application/vnd.yamaha.openscoreformat.osfpvg+xml":{"source":"iana","compressible":true,"extensions":["osfpvg"]},"application/vnd.yamaha.remote-setup":{"source":"iana"},"application/vnd.yamaha.smaf-audio":{"source":"iana","extensions":["saf"]},"application/vnd.yamaha.smaf-phrase":{"source":"iana","extensions":["spf"]},"application/vnd.yamaha.through-ngn":{"source":"iana"},"application/vnd.yamaha.tunnel-udpencap":{"source":"iana"},"application/vnd.yaoweme":{"source":"iana"},"application/vnd.yellowriver-custom-menu":{"source":"iana","extensions":["cmp"]},"application/vnd.youtube.yt":{"source":"iana"},"application/vnd.zul":{"source":"iana","extensions":["zir","zirz"]},"application/vnd.zzazz.deck+xml":{"source":"iana","compressible":true,"extensions":["zaz"]},"application/voicexml+xml":{"source":"iana","compressible":true,"extensions":["vxml"]},"application/voucher-cms+json":{"source":"iana","compressible":true},"application/vq-rtcpxr":{"source":"iana"},"application/wasm":{"source":"iana","compressible":true,"extensions":["wasm"]},"application/watcherinfo+xml":{"source":"iana","compressible":true,"extensions":["wif"]},"application/webpush-options+json":{"source":"iana","compressible":true},"application/whoispp-query":{"source":"iana"},"application/whoispp-response":{"source":"iana"},"application/widget":{"source":"iana","extensions":["wgt"]},"application/winhlp":{"source":"apache","extensions":["hlp"]},"application/wita":{"source":"iana"},"application/wordperfect5.1":{"source":"iana"},"application/wsdl+xml":{"source":"iana","compressible":true,"extensions":["wsdl"]},"application/wspolicy+xml":{"source":"iana","compressible":true,"extensions":["wspolicy"]},"application/x-7z-compressed":{"source":"apache","compressible":false,"extensions":["7z"]},"application/x-abiword":{"source":"apache","extensions":["abw"]},"application/x-ace-compressed":{"source":"apache","extensions":["ace"]},"application/x-amf":{"source":"apache"},"application/x-apple-diskimage":{"source":"apache","extensions":["dmg"]},"application/x-arj":{"compressible":false,"extensions":["arj"]},"application/x-authorware-bin":{"source":"apache","extensions":["aab","x32","u32","vox"]},"application/x-authorware-map":{"source":"apache","extensions":["aam"]},"application/x-authorware-seg":{"source":"apache","extensions":["aas"]},"application/x-bcpio":{"source":"apache","extensions":["bcpio"]},"application/x-bdoc":{"compressible":false,"extensions":["bdoc"]},"application/x-bittorrent":{"source":"apache","extensions":["torrent"]},"application/x-blorb":{"source":"apache","extensions":["blb","blorb"]},"application/x-bzip":{"source":"apache","compressible":false,"extensions":["bz"]},"application/x-bzip2":{"source":"apache","compressible":false,"extensions":["bz2","boz"]},"application/x-cbr":{"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},"application/x-cdlink":{"source":"apache","extensions":["vcd"]},"application/x-cfs-compressed":{"source":"apache","extensions":["cfs"]},"application/x-chat":{"source":"apache","extensions":["chat"]},"application/x-chess-pgn":{"source":"apache","extensions":["pgn"]},"application/x-chrome-extension":{"extensions":["crx"]},"application/x-cocoa":{"source":"nginx","extensions":["cco"]},"application/x-compress":{"source":"apache"},"application/x-conference":{"source":"apache","extensions":["nsc"]},"application/x-cpio":{"source":"apache","extensions":["cpio"]},"application/x-csh":{"source":"apache","extensions":["csh"]},"application/x-deb":{"compressible":false},"application/x-debian-package":{"source":"apache","extensions":["deb","udeb"]},"application/x-dgc-compressed":{"source":"apache","extensions":["dgc"]},"application/x-director":{"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},"application/x-doom":{"source":"apache","extensions":["wad"]},"application/x-dtbncx+xml":{"source":"apache","compressible":true,"extensions":["ncx"]},"application/x-dtbook+xml":{"source":"apache","compressible":true,"extensions":["dtb"]},"application/x-dtbresource+xml":{"source":"apache","compressible":true,"extensions":["res"]},"application/x-dvi":{"source":"apache","compressible":false,"extensions":["dvi"]},"application/x-envoy":{"source":"apache","extensions":["evy"]},"application/x-eva":{"source":"apache","extensions":["eva"]},"application/x-font-bdf":{"source":"apache","extensions":["bdf"]},"application/x-font-dos":{"source":"apache"},"application/x-font-framemaker":{"source":"apache"},"application/x-font-ghostscript":{"source":"apache","extensions":["gsf"]},"application/x-font-libgrx":{"source":"apache"},"application/x-font-linux-psf":{"source":"apache","extensions":["psf"]},"application/x-font-pcf":{"source":"apache","extensions":["pcf"]},"application/x-font-snf":{"source":"apache","extensions":["snf"]},"application/x-font-speedo":{"source":"apache"},"application/x-font-sunos-news":{"source":"apache"},"application/x-font-type1":{"source":"apache","extensions":["pfa","pfb","pfm","afm"]},"application/x-font-vfont":{"source":"apache"},"application/x-freearc":{"source":"apache","extensions":["arc"]},"application/x-futuresplash":{"source":"apache","extensions":["spl"]},"application/x-gca-compressed":{"source":"apache","extensions":["gca"]},"application/x-glulx":{"source":"apache","extensions":["ulx"]},"application/x-gnumeric":{"source":"apache","extensions":["gnumeric"]},"application/x-gramps-xml":{"source":"apache","extensions":["gramps"]},"application/x-gtar":{"source":"apache","extensions":["gtar"]},"application/x-gzip":{"source":"apache"},"application/x-hdf":{"source":"apache","extensions":["hdf"]},"application/x-httpd-php":{"compressible":true,"extensions":["php"]},"application/x-install-instructions":{"source":"apache","extensions":["install"]},"application/x-iso9660-image":{"source":"apache","extensions":["iso"]},"application/x-iwork-keynote-sffkey":{"extensions":["key"]},"application/x-iwork-numbers-sffnumbers":{"extensions":["numbers"]},"application/x-iwork-pages-sffpages":{"extensions":["pages"]},"application/x-java-archive-diff":{"source":"nginx","extensions":["jardiff"]},"application/x-java-jnlp-file":{"source":"apache","compressible":false,"extensions":["jnlp"]},"application/x-javascript":{"compressible":true},"application/x-keepass2":{"extensions":["kdbx"]},"application/x-latex":{"source":"apache","compressible":false,"extensions":["latex"]},"application/x-lua-bytecode":{"extensions":["luac"]},"application/x-lzh-compressed":{"source":"apache","extensions":["lzh","lha"]},"application/x-makeself":{"source":"nginx","extensions":["run"]},"application/x-mie":{"source":"apache","extensions":["mie"]},"application/x-mobipocket-ebook":{"source":"apache","extensions":["prc","mobi"]},"application/x-mpegurl":{"compressible":false},"application/x-ms-application":{"source":"apache","extensions":["application"]},"application/x-ms-shortcut":{"source":"apache","extensions":["lnk"]},"application/x-ms-wmd":{"source":"apache","extensions":["wmd"]},"application/x-ms-wmz":{"source":"apache","extensions":["wmz"]},"application/x-ms-xbap":{"source":"apache","extensions":["xbap"]},"application/x-msaccess":{"source":"apache","extensions":["mdb"]},"application/x-msbinder":{"source":"apache","extensions":["obd"]},"application/x-mscardfile":{"source":"apache","extensions":["crd"]},"application/x-msclip":{"source":"apache","extensions":["clp"]},"application/x-msdos-program":{"extensions":["exe"]},"application/x-msdownload":{"source":"apache","extensions":["exe","dll","com","bat","msi"]},"application/x-msmediaview":{"source":"apache","extensions":["mvb","m13","m14"]},"application/x-msmetafile":{"source":"apache","extensions":["wmf","wmz","emf","emz"]},"application/x-msmoney":{"source":"apache","extensions":["mny"]},"application/x-mspublisher":{"source":"apache","extensions":["pub"]},"application/x-msschedule":{"source":"apache","extensions":["scd"]},"application/x-msterminal":{"source":"apache","extensions":["trm"]},"application/x-mswrite":{"source":"apache","extensions":["wri"]},"application/x-netcdf":{"source":"apache","extensions":["nc","cdf"]},"application/x-ns-proxy-autoconfig":{"compressible":true,"extensions":["pac"]},"application/x-nzb":{"source":"apache","extensions":["nzb"]},"application/x-perl":{"source":"nginx","extensions":["pl","pm"]},"application/x-pilot":{"source":"nginx","extensions":["prc","pdb"]},"application/x-pkcs12":{"source":"apache","compressible":false,"extensions":["p12","pfx"]},"application/x-pkcs7-certificates":{"source":"apache","extensions":["p7b","spc"]},"application/x-pkcs7-certreqresp":{"source":"apache","extensions":["p7r"]},"application/x-pki-message":{"source":"iana"},"application/x-rar-compressed":{"source":"apache","compressible":false,"extensions":["rar"]},"application/x-redhat-package-manager":{"source":"nginx","extensions":["rpm"]},"application/x-research-info-systems":{"source":"apache","extensions":["ris"]},"application/x-sea":{"source":"nginx","extensions":["sea"]},"application/x-sh":{"source":"apache","compressible":true,"extensions":["sh"]},"application/x-shar":{"source":"apache","extensions":["shar"]},"application/x-shockwave-flash":{"source":"apache","compressible":false,"extensions":["swf"]},"application/x-silverlight-app":{"source":"apache","extensions":["xap"]},"application/x-sql":{"source":"apache","extensions":["sql"]},"application/x-stuffit":{"source":"apache","compressible":false,"extensions":["sit"]},"application/x-stuffitx":{"source":"apache","extensions":["sitx"]},"application/x-subrip":{"source":"apache","extensions":["srt"]},"application/x-sv4cpio":{"source":"apache","extensions":["sv4cpio"]},"application/x-sv4crc":{"source":"apache","extensions":["sv4crc"]},"application/x-t3vm-image":{"source":"apache","extensions":["t3"]},"application/x-tads":{"source":"apache","extensions":["gam"]},"application/x-tar":{"source":"apache","compressible":true,"extensions":["tar"]},"application/x-tcl":{"source":"apache","extensions":["tcl","tk"]},"application/x-tex":{"source":"apache","extensions":["tex"]},"application/x-tex-tfm":{"source":"apache","extensions":["tfm"]},"application/x-texinfo":{"source":"apache","extensions":["texinfo","texi"]},"application/x-tgif":{"source":"apache","extensions":["obj"]},"application/x-ustar":{"source":"apache","extensions":["ustar"]},"application/x-virtualbox-hdd":{"compressible":true,"extensions":["hdd"]},"application/x-virtualbox-ova":{"compressible":true,"extensions":["ova"]},"application/x-virtualbox-ovf":{"compressible":true,"extensions":["ovf"]},"application/x-virtualbox-vbox":{"compressible":true,"extensions":["vbox"]},"application/x-virtualbox-vbox-extpack":{"compressible":false,"extensions":["vbox-extpack"]},"application/x-virtualbox-vdi":{"compressible":true,"extensions":["vdi"]},"application/x-virtualbox-vhd":{"compressible":true,"extensions":["vhd"]},"application/x-virtualbox-vmdk":{"compressible":true,"extensions":["vmdk"]},"application/x-wais-source":{"source":"apache","extensions":["src"]},"application/x-web-app-manifest+json":{"compressible":true,"extensions":["webapp"]},"application/x-www-form-urlencoded":{"source":"iana","compressible":true},"application/x-x509-ca-cert":{"source":"iana","extensions":["der","crt","pem"]},"application/x-x509-ca-ra-cert":{"source":"iana"},"application/x-x509-next-ca-cert":{"source":"iana"},"application/x-xfig":{"source":"apache","extensions":["fig"]},"application/x-xliff+xml":{"source":"apache","compressible":true,"extensions":["xlf"]},"application/x-xpinstall":{"source":"apache","compressible":false,"extensions":["xpi"]},"application/x-xz":{"source":"apache","extensions":["xz"]},"application/x-zmachine":{"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},"application/x400-bp":{"source":"iana"},"application/xacml+xml":{"source":"iana","compressible":true},"application/xaml+xml":{"source":"apache","compressible":true,"extensions":["xaml"]},"application/xcap-att+xml":{"source":"iana","compressible":true,"extensions":["xav"]},"application/xcap-caps+xml":{"source":"iana","compressible":true,"extensions":["xca"]},"application/xcap-diff+xml":{"source":"iana","compressible":true,"extensions":["xdf"]},"application/xcap-el+xml":{"source":"iana","compressible":true,"extensions":["xel"]},"application/xcap-error+xml":{"source":"iana","compressible":true},"application/xcap-ns+xml":{"source":"iana","compressible":true,"extensions":["xns"]},"application/xcon-conference-info+xml":{"source":"iana","compressible":true},"application/xcon-conference-info-diff+xml":{"source":"iana","compressible":true},"application/xenc+xml":{"source":"iana","compressible":true,"extensions":["xenc"]},"application/xhtml+xml":{"source":"iana","compressible":true,"extensions":["xhtml","xht"]},"application/xhtml-voice+xml":{"source":"apache","compressible":true},"application/xliff+xml":{"source":"iana","compressible":true,"extensions":["xlf"]},"application/xml":{"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},"application/xml-dtd":{"source":"iana","compressible":true,"extensions":["dtd"]},"application/xml-external-parsed-entity":{"source":"iana"},"application/xml-patch+xml":{"source":"iana","compressible":true},"application/xmpp+xml":{"source":"iana","compressible":true},"application/xop+xml":{"source":"iana","compressible":true,"extensions":["xop"]},"application/xproc+xml":{"source":"apache","compressible":true,"extensions":["xpl"]},"application/xslt+xml":{"source":"iana","compressible":true,"extensions":["xsl","xslt"]},"application/xspf+xml":{"source":"apache","compressible":true,"extensions":["xspf"]},"application/xv+xml":{"source":"iana","compressible":true,"extensions":["mxml","xhvml","xvml","xvm"]},"application/yang":{"source":"iana","extensions":["yang"]},"application/yang-data+json":{"source":"iana","compressible":true},"application/yang-data+xml":{"source":"iana","compressible":true},"application/yang-patch+json":{"source":"iana","compressible":true},"application/yang-patch+xml":{"source":"iana","compressible":true},"application/yin+xml":{"source":"iana","compressible":true,"extensions":["yin"]},"application/zip":{"source":"iana","compressible":false,"extensions":["zip"]},"application/zlib":{"source":"iana"},"application/zstd":{"source":"iana"},"audio/1d-interleaved-parityfec":{"source":"iana"},"audio/32kadpcm":{"source":"iana"},"audio/3gpp":{"source":"iana","compressible":false,"extensions":["3gpp"]},"audio/3gpp2":{"source":"iana"},"audio/aac":{"source":"iana"},"audio/ac3":{"source":"iana"},"audio/adpcm":{"source":"apache","extensions":["adp"]},"audio/amr":{"source":"iana","extensions":["amr"]},"audio/amr-wb":{"source":"iana"},"audio/amr-wb+":{"source":"iana"},"audio/aptx":{"source":"iana"},"audio/asc":{"source":"iana"},"audio/atrac-advanced-lossless":{"source":"iana"},"audio/atrac-x":{"source":"iana"},"audio/atrac3":{"source":"iana"},"audio/basic":{"source":"iana","compressible":false,"extensions":["au","snd"]},"audio/bv16":{"source":"iana"},"audio/bv32":{"source":"iana"},"audio/clearmode":{"source":"iana"},"audio/cn":{"source":"iana"},"audio/dat12":{"source":"iana"},"audio/dls":{"source":"iana"},"audio/dsr-es201108":{"source":"iana"},"audio/dsr-es202050":{"source":"iana"},"audio/dsr-es202211":{"source":"iana"},"audio/dsr-es202212":{"source":"iana"},"audio/dv":{"source":"iana"},"audio/dvi4":{"source":"iana"},"audio/eac3":{"source":"iana"},"audio/encaprtp":{"source":"iana"},"audio/evrc":{"source":"iana"},"audio/evrc-qcp":{"source":"iana"},"audio/evrc0":{"source":"iana"},"audio/evrc1":{"source":"iana"},"audio/evrcb":{"source":"iana"},"audio/evrcb0":{"source":"iana"},"audio/evrcb1":{"source":"iana"},"audio/evrcnw":{"source":"iana"},"audio/evrcnw0":{"source":"iana"},"audio/evrcnw1":{"source":"iana"},"audio/evrcwb":{"source":"iana"},"audio/evrcwb0":{"source":"iana"},"audio/evrcwb1":{"source":"iana"},"audio/evs":{"source":"iana"},"audio/flexfec":{"source":"iana"},"audio/fwdred":{"source":"iana"},"audio/g711-0":{"source":"iana"},"audio/g719":{"source":"iana"},"audio/g722":{"source":"iana"},"audio/g7221":{"source":"iana"},"audio/g723":{"source":"iana"},"audio/g726-16":{"source":"iana"},"audio/g726-24":{"source":"iana"},"audio/g726-32":{"source":"iana"},"audio/g726-40":{"source":"iana"},"audio/g728":{"source":"iana"},"audio/g729":{"source":"iana"},"audio/g7291":{"source":"iana"},"audio/g729d":{"source":"iana"},"audio/g729e":{"source":"iana"},"audio/gsm":{"source":"iana"},"audio/gsm-efr":{"source":"iana"},"audio/gsm-hr-08":{"source":"iana"},"audio/ilbc":{"source":"iana"},"audio/ip-mr_v2.5":{"source":"iana"},"audio/isac":{"source":"apache"},"audio/l16":{"source":"iana"},"audio/l20":{"source":"iana"},"audio/l24":{"source":"iana","compressible":false},"audio/l8":{"source":"iana"},"audio/lpc":{"source":"iana"},"audio/melp":{"source":"iana"},"audio/melp1200":{"source":"iana"},"audio/melp2400":{"source":"iana"},"audio/melp600":{"source":"iana"},"audio/mhas":{"source":"iana"},"audio/midi":{"source":"apache","extensions":["mid","midi","kar","rmi"]},"audio/mobile-xmf":{"source":"iana","extensions":["mxmf"]},"audio/mp3":{"compressible":false,"extensions":["mp3"]},"audio/mp4":{"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},"audio/mp4a-latm":{"source":"iana"},"audio/mpa":{"source":"iana"},"audio/mpa-robust":{"source":"iana"},"audio/mpeg":{"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},"audio/mpeg4-generic":{"source":"iana"},"audio/musepack":{"source":"apache"},"audio/ogg":{"source":"iana","compressible":false,"extensions":["oga","ogg","spx","opus"]},"audio/opus":{"source":"iana"},"audio/parityfec":{"source":"iana"},"audio/pcma":{"source":"iana"},"audio/pcma-wb":{"source":"iana"},"audio/pcmu":{"source":"iana"},"audio/pcmu-wb":{"source":"iana"},"audio/prs.sid":{"source":"iana"},"audio/qcelp":{"source":"iana"},"audio/raptorfec":{"source":"iana"},"audio/red":{"source":"iana"},"audio/rtp-enc-aescm128":{"source":"iana"},"audio/rtp-midi":{"source":"iana"},"audio/rtploopback":{"source":"iana"},"audio/rtx":{"source":"iana"},"audio/s3m":{"source":"apache","extensions":["s3m"]},"audio/scip":{"source":"iana"},"audio/silk":{"source":"apache","extensions":["sil"]},"audio/smv":{"source":"iana"},"audio/smv-qcp":{"source":"iana"},"audio/smv0":{"source":"iana"},"audio/sofa":{"source":"iana"},"audio/sp-midi":{"source":"iana"},"audio/speex":{"source":"iana"},"audio/t140c":{"source":"iana"},"audio/t38":{"source":"iana"},"audio/telephone-event":{"source":"iana"},"audio/tetra_acelp":{"source":"iana"},"audio/tetra_acelp_bb":{"source":"iana"},"audio/tone":{"source":"iana"},"audio/tsvcis":{"source":"iana"},"audio/uemclip":{"source":"iana"},"audio/ulpfec":{"source":"iana"},"audio/usac":{"source":"iana"},"audio/vdvi":{"source":"iana"},"audio/vmr-wb":{"source":"iana"},"audio/vnd.3gpp.iufp":{"source":"iana"},"audio/vnd.4sb":{"source":"iana"},"audio/vnd.audiokoz":{"source":"iana"},"audio/vnd.celp":{"source":"iana"},"audio/vnd.cisco.nse":{"source":"iana"},"audio/vnd.cmles.radio-events":{"source":"iana"},"audio/vnd.cns.anp1":{"source":"iana"},"audio/vnd.cns.inf1":{"source":"iana"},"audio/vnd.dece.audio":{"source":"iana","extensions":["uva","uvva"]},"audio/vnd.digital-winds":{"source":"iana","extensions":["eol"]},"audio/vnd.dlna.adts":{"source":"iana"},"audio/vnd.dolby.heaac.1":{"source":"iana"},"audio/vnd.dolby.heaac.2":{"source":"iana"},"audio/vnd.dolby.mlp":{"source":"iana"},"audio/vnd.dolby.mps":{"source":"iana"},"audio/vnd.dolby.pl2":{"source":"iana"},"audio/vnd.dolby.pl2x":{"source":"iana"},"audio/vnd.dolby.pl2z":{"source":"iana"},"audio/vnd.dolby.pulse.1":{"source":"iana"},"audio/vnd.dra":{"source":"iana","extensions":["dra"]},"audio/vnd.dts":{"source":"iana","extensions":["dts"]},"audio/vnd.dts.hd":{"source":"iana","extensions":["dtshd"]},"audio/vnd.dts.uhd":{"source":"iana"},"audio/vnd.dvb.file":{"source":"iana"},"audio/vnd.everad.plj":{"source":"iana"},"audio/vnd.hns.audio":{"source":"iana"},"audio/vnd.lucent.voice":{"source":"iana","extensions":["lvp"]},"audio/vnd.ms-playready.media.pya":{"source":"iana","extensions":["pya"]},"audio/vnd.nokia.mobile-xmf":{"source":"iana"},"audio/vnd.nortel.vbk":{"source":"iana"},"audio/vnd.nuera.ecelp4800":{"source":"iana","extensions":["ecelp4800"]},"audio/vnd.nuera.ecelp7470":{"source":"iana","extensions":["ecelp7470"]},"audio/vnd.nuera.ecelp9600":{"source":"iana","extensions":["ecelp9600"]},"audio/vnd.octel.sbc":{"source":"iana"},"audio/vnd.presonus.multitrack":{"source":"iana"},"audio/vnd.qcelp":{"source":"iana"},"audio/vnd.rhetorex.32kadpcm":{"source":"iana"},"audio/vnd.rip":{"source":"iana","extensions":["rip"]},"audio/vnd.rn-realaudio":{"compressible":false},"audio/vnd.sealedmedia.softseal.mpeg":{"source":"iana"},"audio/vnd.vmx.cvsd":{"source":"iana"},"audio/vnd.wave":{"compressible":false},"audio/vorbis":{"source":"iana","compressible":false},"audio/vorbis-config":{"source":"iana"},"audio/wav":{"compressible":false,"extensions":["wav"]},"audio/wave":{"compressible":false,"extensions":["wav"]},"audio/webm":{"source":"apache","compressible":false,"extensions":["weba"]},"audio/x-aac":{"source":"apache","compressible":false,"extensions":["aac"]},"audio/x-aiff":{"source":"apache","extensions":["aif","aiff","aifc"]},"audio/x-caf":{"source":"apache","compressible":false,"extensions":["caf"]},"audio/x-flac":{"source":"apache","extensions":["flac"]},"audio/x-m4a":{"source":"nginx","extensions":["m4a"]},"audio/x-matroska":{"source":"apache","extensions":["mka"]},"audio/x-mpegurl":{"source":"apache","extensions":["m3u"]},"audio/x-ms-wax":{"source":"apache","extensions":["wax"]},"audio/x-ms-wma":{"source":"apache","extensions":["wma"]},"audio/x-pn-realaudio":{"source":"apache","extensions":["ram","ra"]},"audio/x-pn-realaudio-plugin":{"source":"apache","extensions":["rmp"]},"audio/x-realaudio":{"source":"nginx","extensions":["ra"]},"audio/x-tta":{"source":"apache"},"audio/x-wav":{"source":"apache","extensions":["wav"]},"audio/xm":{"source":"apache","extensions":["xm"]},"chemical/x-cdx":{"source":"apache","extensions":["cdx"]},"chemical/x-cif":{"source":"apache","extensions":["cif"]},"chemical/x-cmdf":{"source":"apache","extensions":["cmdf"]},"chemical/x-cml":{"source":"apache","extensions":["cml"]},"chemical/x-csml":{"source":"apache","extensions":["csml"]},"chemical/x-pdb":{"source":"apache"},"chemical/x-xyz":{"source":"apache","extensions":["xyz"]},"font/collection":{"source":"iana","extensions":["ttc"]},"font/otf":{"source":"iana","compressible":true,"extensions":["otf"]},"font/sfnt":{"source":"iana"},"font/ttf":{"source":"iana","compressible":true,"extensions":["ttf"]},"font/woff":{"source":"iana","extensions":["woff"]},"font/woff2":{"source":"iana","extensions":["woff2"]},"image/aces":{"source":"iana","extensions":["exr"]},"image/apng":{"compressible":false,"extensions":["apng"]},"image/avci":{"source":"iana","extensions":["avci"]},"image/avcs":{"source":"iana","extensions":["avcs"]},"image/avif":{"source":"iana","compressible":false,"extensions":["avif"]},"image/bmp":{"source":"iana","compressible":true,"extensions":["bmp"]},"image/cgm":{"source":"iana","extensions":["cgm"]},"image/dicom-rle":{"source":"iana","extensions":["drle"]},"image/emf":{"source":"iana","extensions":["emf"]},"image/fits":{"source":"iana","extensions":["fits"]},"image/g3fax":{"source":"iana","extensions":["g3"]},"image/gif":{"source":"iana","compressible":false,"extensions":["gif"]},"image/heic":{"source":"iana","extensions":["heic"]},"image/heic-sequence":{"source":"iana","extensions":["heics"]},"image/heif":{"source":"iana","extensions":["heif"]},"image/heif-sequence":{"source":"iana","extensions":["heifs"]},"image/hej2k":{"source":"iana","extensions":["hej2"]},"image/hsj2":{"source":"iana","extensions":["hsj2"]},"image/ief":{"source":"iana","extensions":["ief"]},"image/jls":{"source":"iana","extensions":["jls"]},"image/jp2":{"source":"iana","compressible":false,"extensions":["jp2","jpg2"]},"image/jpeg":{"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},"image/jph":{"source":"iana","extensions":["jph"]},"image/jphc":{"source":"iana","extensions":["jhc"]},"image/jpm":{"source":"iana","compressible":false,"extensions":["jpm"]},"image/jpx":{"source":"iana","compressible":false,"extensions":["jpx","jpf"]},"image/jxr":{"source":"iana","extensions":["jxr"]},"image/jxra":{"source":"iana","extensions":["jxra"]},"image/jxrs":{"source":"iana","extensions":["jxrs"]},"image/jxs":{"source":"iana","extensions":["jxs"]},"image/jxsc":{"source":"iana","extensions":["jxsc"]},"image/jxsi":{"source":"iana","extensions":["jxsi"]},"image/jxss":{"source":"iana","extensions":["jxss"]},"image/ktx":{"source":"iana","extensions":["ktx"]},"image/ktx2":{"source":"iana","extensions":["ktx2"]},"image/naplps":{"source":"iana"},"image/pjpeg":{"compressible":false},"image/png":{"source":"iana","compressible":false,"extensions":["png"]},"image/prs.btif":{"source":"iana","extensions":["btif"]},"image/prs.pti":{"source":"iana","extensions":["pti"]},"image/pwg-raster":{"source":"iana"},"image/sgi":{"source":"apache","extensions":["sgi"]},"image/svg+xml":{"source":"iana","compressible":true,"extensions":["svg","svgz"]},"image/t38":{"source":"iana","extensions":["t38"]},"image/tiff":{"source":"iana","compressible":false,"extensions":["tif","tiff"]},"image/tiff-fx":{"source":"iana","extensions":["tfx"]},"image/vnd.adobe.photoshop":{"source":"iana","compressible":true,"extensions":["psd"]},"image/vnd.airzip.accelerator.azv":{"source":"iana","extensions":["azv"]},"image/vnd.cns.inf2":{"source":"iana"},"image/vnd.dece.graphic":{"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},"image/vnd.djvu":{"source":"iana","extensions":["djvu","djv"]},"image/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"image/vnd.dwg":{"source":"iana","extensions":["dwg"]},"image/vnd.dxf":{"source":"iana","extensions":["dxf"]},"image/vnd.fastbidsheet":{"source":"iana","extensions":["fbs"]},"image/vnd.fpx":{"source":"iana","extensions":["fpx"]},"image/vnd.fst":{"source":"iana","extensions":["fst"]},"image/vnd.fujixerox.edmics-mmr":{"source":"iana","extensions":["mmr"]},"image/vnd.fujixerox.edmics-rlc":{"source":"iana","extensions":["rlc"]},"image/vnd.globalgraphics.pgb":{"source":"iana"},"image/vnd.microsoft.icon":{"source":"iana","compressible":true,"extensions":["ico"]},"image/vnd.mix":{"source":"iana"},"image/vnd.mozilla.apng":{"source":"iana"},"image/vnd.ms-dds":{"compressible":true,"extensions":["dds"]},"image/vnd.ms-modi":{"source":"iana","extensions":["mdi"]},"image/vnd.ms-photo":{"source":"apache","extensions":["wdp"]},"image/vnd.net-fpx":{"source":"iana","extensions":["npx"]},"image/vnd.pco.b16":{"source":"iana","extensions":["b16"]},"image/vnd.radiance":{"source":"iana"},"image/vnd.sealed.png":{"source":"iana"},"image/vnd.sealedmedia.softseal.gif":{"source":"iana"},"image/vnd.sealedmedia.softseal.jpg":{"source":"iana"},"image/vnd.svf":{"source":"iana"},"image/vnd.tencent.tap":{"source":"iana","extensions":["tap"]},"image/vnd.valve.source.texture":{"source":"iana","extensions":["vtf"]},"image/vnd.wap.wbmp":{"source":"iana","extensions":["wbmp"]},"image/vnd.xiff":{"source":"iana","extensions":["xif"]},"image/vnd.zbrush.pcx":{"source":"iana","extensions":["pcx"]},"image/webp":{"source":"apache","extensions":["webp"]},"image/wmf":{"source":"iana","extensions":["wmf"]},"image/x-3ds":{"source":"apache","extensions":["3ds"]},"image/x-cmu-raster":{"source":"apache","extensions":["ras"]},"image/x-cmx":{"source":"apache","extensions":["cmx"]},"image/x-freehand":{"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},"image/x-icon":{"source":"apache","compressible":true,"extensions":["ico"]},"image/x-jng":{"source":"nginx","extensions":["jng"]},"image/x-mrsid-image":{"source":"apache","extensions":["sid"]},"image/x-ms-bmp":{"source":"nginx","compressible":true,"extensions":["bmp"]},"image/x-pcx":{"source":"apache","extensions":["pcx"]},"image/x-pict":{"source":"apache","extensions":["pic","pct"]},"image/x-portable-anymap":{"source":"apache","extensions":["pnm"]},"image/x-portable-bitmap":{"source":"apache","extensions":["pbm"]},"image/x-portable-graymap":{"source":"apache","extensions":["pgm"]},"image/x-portable-pixmap":{"source":"apache","extensions":["ppm"]},"image/x-rgb":{"source":"apache","extensions":["rgb"]},"image/x-tga":{"source":"apache","extensions":["tga"]},"image/x-xbitmap":{"source":"apache","extensions":["xbm"]},"image/x-xcf":{"compressible":false},"image/x-xpixmap":{"source":"apache","extensions":["xpm"]},"image/x-xwindowdump":{"source":"apache","extensions":["xwd"]},"message/cpim":{"source":"iana"},"message/delivery-status":{"source":"iana"},"message/disposition-notification":{"source":"iana","extensions":["disposition-notification"]},"message/external-body":{"source":"iana"},"message/feedback-report":{"source":"iana"},"message/global":{"source":"iana","extensions":["u8msg"]},"message/global-delivery-status":{"source":"iana","extensions":["u8dsn"]},"message/global-disposition-notification":{"source":"iana","extensions":["u8mdn"]},"message/global-headers":{"source":"iana","extensions":["u8hdr"]},"message/http":{"source":"iana","compressible":false},"message/imdn+xml":{"source":"iana","compressible":true},"message/news":{"source":"iana"},"message/partial":{"source":"iana","compressible":false},"message/rfc822":{"source":"iana","compressible":true,"extensions":["eml","mime"]},"message/s-http":{"source":"iana"},"message/sip":{"source":"iana"},"message/sipfrag":{"source":"iana"},"message/tracking-status":{"source":"iana"},"message/vnd.si.simp":{"source":"iana"},"message/vnd.wfa.wsc":{"source":"iana","extensions":["wsc"]},"model/3mf":{"source":"iana","extensions":["3mf"]},"model/e57":{"source":"iana"},"model/gltf+json":{"source":"iana","compressible":true,"extensions":["gltf"]},"model/gltf-binary":{"source":"iana","compressible":true,"extensions":["glb"]},"model/iges":{"source":"iana","compressible":false,"extensions":["igs","iges"]},"model/mesh":{"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},"model/mtl":{"source":"iana","extensions":["mtl"]},"model/obj":{"source":"iana","extensions":["obj"]},"model/step":{"source":"iana"},"model/step+xml":{"source":"iana","compressible":true,"extensions":["stpx"]},"model/step+zip":{"source":"iana","compressible":false,"extensions":["stpz"]},"model/step-xml+zip":{"source":"iana","compressible":false,"extensions":["stpxz"]},"model/stl":{"source":"iana","extensions":["stl"]},"model/vnd.collada+xml":{"source":"iana","compressible":true,"extensions":["dae"]},"model/vnd.dwf":{"source":"iana","extensions":["dwf"]},"model/vnd.flatland.3dml":{"source":"iana"},"model/vnd.gdl":{"source":"iana","extensions":["gdl"]},"model/vnd.gs-gdl":{"source":"apache"},"model/vnd.gs.gdl":{"source":"iana"},"model/vnd.gtw":{"source":"iana","extensions":["gtw"]},"model/vnd.moml+xml":{"source":"iana","compressible":true},"model/vnd.mts":{"source":"iana","extensions":["mts"]},"model/vnd.opengex":{"source":"iana","extensions":["ogex"]},"model/vnd.parasolid.transmit.binary":{"source":"iana","extensions":["x_b"]},"model/vnd.parasolid.transmit.text":{"source":"iana","extensions":["x_t"]},"model/vnd.pytha.pyox":{"source":"iana"},"model/vnd.rosette.annotated-data-model":{"source":"iana"},"model/vnd.sap.vds":{"source":"iana","extensions":["vds"]},"model/vnd.usdz+zip":{"source":"iana","compressible":false,"extensions":["usdz"]},"model/vnd.valve.source.compiled-map":{"source":"iana","extensions":["bsp"]},"model/vnd.vtu":{"source":"iana","extensions":["vtu"]},"model/vrml":{"source":"iana","compressible":false,"extensions":["wrl","vrml"]},"model/x3d+binary":{"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},"model/x3d+fastinfoset":{"source":"iana","extensions":["x3db"]},"model/x3d+vrml":{"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},"model/x3d+xml":{"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},"model/x3d-vrml":{"source":"iana","extensions":["x3dv"]},"multipart/alternative":{"source":"iana","compressible":false},"multipart/appledouble":{"source":"iana"},"multipart/byteranges":{"source":"iana"},"multipart/digest":{"source":"iana"},"multipart/encrypted":{"source":"iana","compressible":false},"multipart/form-data":{"source":"iana","compressible":false},"multipart/header-set":{"source":"iana"},"multipart/mixed":{"source":"iana"},"multipart/multilingual":{"source":"iana"},"multipart/parallel":{"source":"iana"},"multipart/related":{"source":"iana","compressible":false},"multipart/report":{"source":"iana"},"multipart/signed":{"source":"iana","compressible":false},"multipart/vnd.bint.med-plus":{"source":"iana"},"multipart/voice-message":{"source":"iana"},"multipart/x-mixed-replace":{"source":"iana"},"text/1d-interleaved-parityfec":{"source":"iana"},"text/cache-manifest":{"source":"iana","compressible":true,"extensions":["appcache","manifest"]},"text/calendar":{"source":"iana","extensions":["ics","ifb"]},"text/calender":{"compressible":true},"text/cmd":{"compressible":true},"text/coffeescript":{"extensions":["coffee","litcoffee"]},"text/cql":{"source":"iana"},"text/cql-expression":{"source":"iana"},"text/cql-identifier":{"source":"iana"},"text/css":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["css"]},"text/csv":{"source":"iana","compressible":true,"extensions":["csv"]},"text/csv-schema":{"source":"iana"},"text/directory":{"source":"iana"},"text/dns":{"source":"iana"},"text/ecmascript":{"source":"iana"},"text/encaprtp":{"source":"iana"},"text/enriched":{"source":"iana"},"text/fhirpath":{"source":"iana"},"text/flexfec":{"source":"iana"},"text/fwdred":{"source":"iana"},"text/gff3":{"source":"iana"},"text/grammar-ref-list":{"source":"iana"},"text/html":{"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},"text/jade":{"extensions":["jade"]},"text/javascript":{"source":"iana","compressible":true},"text/jcr-cnd":{"source":"iana"},"text/jsx":{"compressible":true,"extensions":["jsx"]},"text/less":{"compressible":true,"extensions":["less"]},"text/markdown":{"source":"iana","compressible":true,"extensions":["markdown","md"]},"text/mathml":{"source":"nginx","extensions":["mml"]},"text/mdx":{"compressible":true,"extensions":["mdx"]},"text/mizar":{"source":"iana"},"text/n3":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["n3"]},"text/parameters":{"source":"iana","charset":"UTF-8"},"text/parityfec":{"source":"iana"},"text/plain":{"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},"text/provenance-notation":{"source":"iana","charset":"UTF-8"},"text/prs.fallenstein.rst":{"source":"iana"},"text/prs.lines.tag":{"source":"iana","extensions":["dsc"]},"text/prs.prop.logic":{"source":"iana"},"text/raptorfec":{"source":"iana"},"text/red":{"source":"iana"},"text/rfc822-headers":{"source":"iana"},"text/richtext":{"source":"iana","compressible":true,"extensions":["rtx"]},"text/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"text/rtp-enc-aescm128":{"source":"iana"},"text/rtploopback":{"source":"iana"},"text/rtx":{"source":"iana"},"text/sgml":{"source":"iana","extensions":["sgml","sgm"]},"text/shaclc":{"source":"iana"},"text/shex":{"source":"iana","extensions":["shex"]},"text/slim":{"extensions":["slim","slm"]},"text/spdx":{"source":"iana","extensions":["spdx"]},"text/strings":{"source":"iana"},"text/stylus":{"extensions":["stylus","styl"]},"text/t140":{"source":"iana"},"text/tab-separated-values":{"source":"iana","compressible":true,"extensions":["tsv"]},"text/troff":{"source":"iana","extensions":["t","tr","roff","man","me","ms"]},"text/turtle":{"source":"iana","charset":"UTF-8","extensions":["ttl"]},"text/ulpfec":{"source":"iana"},"text/uri-list":{"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},"text/vcard":{"source":"iana","compressible":true,"extensions":["vcard"]},"text/vnd.a":{"source":"iana"},"text/vnd.abc":{"source":"iana"},"text/vnd.ascii-art":{"source":"iana"},"text/vnd.curl":{"source":"iana","extensions":["curl"]},"text/vnd.curl.dcurl":{"source":"apache","extensions":["dcurl"]},"text/vnd.curl.mcurl":{"source":"apache","extensions":["mcurl"]},"text/vnd.curl.scurl":{"source":"apache","extensions":["scurl"]},"text/vnd.debian.copyright":{"source":"iana","charset":"UTF-8"},"text/vnd.dmclientscript":{"source":"iana"},"text/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"text/vnd.esmertec.theme-descriptor":{"source":"iana","charset":"UTF-8"},"text/vnd.familysearch.gedcom":{"source":"iana","extensions":["ged"]},"text/vnd.ficlab.flt":{"source":"iana"},"text/vnd.fly":{"source":"iana","extensions":["fly"]},"text/vnd.fmi.flexstor":{"source":"iana","extensions":["flx"]},"text/vnd.gml":{"source":"iana"},"text/vnd.graphviz":{"source":"iana","extensions":["gv"]},"text/vnd.hans":{"source":"iana"},"text/vnd.hgl":{"source":"iana"},"text/vnd.in3d.3dml":{"source":"iana","extensions":["3dml"]},"text/vnd.in3d.spot":{"source":"iana","extensions":["spot"]},"text/vnd.iptc.newsml":{"source":"iana"},"text/vnd.iptc.nitf":{"source":"iana"},"text/vnd.latex-z":{"source":"iana"},"text/vnd.motorola.reflex":{"source":"iana"},"text/vnd.ms-mediapackage":{"source":"iana"},"text/vnd.net2phone.commcenter.command":{"source":"iana"},"text/vnd.radisys.msml-basic-layout":{"source":"iana"},"text/vnd.senx.warpscript":{"source":"iana"},"text/vnd.si.uricatalogue":{"source":"iana"},"text/vnd.sosi":{"source":"iana"},"text/vnd.sun.j2me.app-descriptor":{"source":"iana","charset":"UTF-8","extensions":["jad"]},"text/vnd.trolltech.linguist":{"source":"iana","charset":"UTF-8"},"text/vnd.wap.si":{"source":"iana"},"text/vnd.wap.sl":{"source":"iana"},"text/vnd.wap.wml":{"source":"iana","extensions":["wml"]},"text/vnd.wap.wmlscript":{"source":"iana","extensions":["wmls"]},"text/vtt":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["vtt"]},"text/x-asm":{"source":"apache","extensions":["s","asm"]},"text/x-c":{"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},"text/x-component":{"source":"nginx","extensions":["htc"]},"text/x-fortran":{"source":"apache","extensions":["f","for","f77","f90"]},"text/x-gwt-rpc":{"compressible":true},"text/x-handlebars-template":{"extensions":["hbs"]},"text/x-java-source":{"source":"apache","extensions":["java"]},"text/x-jquery-tmpl":{"compressible":true},"text/x-lua":{"extensions":["lua"]},"text/x-markdown":{"compressible":true,"extensions":["mkd"]},"text/x-nfo":{"source":"apache","extensions":["nfo"]},"text/x-opml":{"source":"apache","extensions":["opml"]},"text/x-org":{"compressible":true,"extensions":["org"]},"text/x-pascal":{"source":"apache","extensions":["p","pas"]},"text/x-processing":{"compressible":true,"extensions":["pde"]},"text/x-sass":{"extensions":["sass"]},"text/x-scss":{"extensions":["scss"]},"text/x-setext":{"source":"apache","extensions":["etx"]},"text/x-sfv":{"source":"apache","extensions":["sfv"]},"text/x-suse-ymp":{"compressible":true,"extensions":["ymp"]},"text/x-uuencode":{"source":"apache","extensions":["uu"]},"text/x-vcalendar":{"source":"apache","extensions":["vcs"]},"text/x-vcard":{"source":"apache","extensions":["vcf"]},"text/xml":{"source":"iana","compressible":true,"extensions":["xml"]},"text/xml-external-parsed-entity":{"source":"iana"},"text/yaml":{"compressible":true,"extensions":["yaml","yml"]},"video/1d-interleaved-parityfec":{"source":"iana"},"video/3gpp":{"source":"iana","extensions":["3gp","3gpp"]},"video/3gpp-tt":{"source":"iana"},"video/3gpp2":{"source":"iana","extensions":["3g2"]},"video/av1":{"source":"iana"},"video/bmpeg":{"source":"iana"},"video/bt656":{"source":"iana"},"video/celb":{"source":"iana"},"video/dv":{"source":"iana"},"video/encaprtp":{"source":"iana"},"video/ffv1":{"source":"iana"},"video/flexfec":{"source":"iana"},"video/h261":{"source":"iana","extensions":["h261"]},"video/h263":{"source":"iana","extensions":["h263"]},"video/h263-1998":{"source":"iana"},"video/h263-2000":{"source":"iana"},"video/h264":{"source":"iana","extensions":["h264"]},"video/h264-rcdo":{"source":"iana"},"video/h264-svc":{"source":"iana"},"video/h265":{"source":"iana"},"video/iso.segment":{"source":"iana","extensions":["m4s"]},"video/jpeg":{"source":"iana","extensions":["jpgv"]},"video/jpeg2000":{"source":"iana"},"video/jpm":{"source":"apache","extensions":["jpm","jpgm"]},"video/jxsv":{"source":"iana"},"video/mj2":{"source":"iana","extensions":["mj2","mjp2"]},"video/mp1s":{"source":"iana"},"video/mp2p":{"source":"iana"},"video/mp2t":{"source":"iana","extensions":["ts"]},"video/mp4":{"source":"iana","compressible":false,"extensions":["mp4","mp4v","mpg4"]},"video/mp4v-es":{"source":"iana"},"video/mpeg":{"source":"iana","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},"video/mpeg4-generic":{"source":"iana"},"video/mpv":{"source":"iana"},"video/nv":{"source":"iana"},"video/ogg":{"source":"iana","compressible":false,"extensions":["ogv"]},"video/parityfec":{"source":"iana"},"video/pointer":{"source":"iana"},"video/quicktime":{"source":"iana","compressible":false,"extensions":["qt","mov"]},"video/raptorfec":{"source":"iana"},"video/raw":{"source":"iana"},"video/rtp-enc-aescm128":{"source":"iana"},"video/rtploopback":{"source":"iana"},"video/rtx":{"source":"iana"},"video/scip":{"source":"iana"},"video/smpte291":{"source":"iana"},"video/smpte292m":{"source":"iana"},"video/ulpfec":{"source":"iana"},"video/vc1":{"source":"iana"},"video/vc2":{"source":"iana"},"video/vnd.cctv":{"source":"iana"},"video/vnd.dece.hd":{"source":"iana","extensions":["uvh","uvvh"]},"video/vnd.dece.mobile":{"source":"iana","extensions":["uvm","uvvm"]},"video/vnd.dece.mp4":{"source":"iana"},"video/vnd.dece.pd":{"source":"iana","extensions":["uvp","uvvp"]},"video/vnd.dece.sd":{"source":"iana","extensions":["uvs","uvvs"]},"video/vnd.dece.video":{"source":"iana","extensions":["uvv","uvvv"]},"video/vnd.directv.mpeg":{"source":"iana"},"video/vnd.directv.mpeg-tts":{"source":"iana"},"video/vnd.dlna.mpeg-tts":{"source":"iana"},"video/vnd.dvb.file":{"source":"iana","extensions":["dvb"]},"video/vnd.fvt":{"source":"iana","extensions":["fvt"]},"video/vnd.hns.video":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.ttsavc":{"source":"iana"},"video/vnd.iptvforum.ttsmpeg2":{"source":"iana"},"video/vnd.motorola.video":{"source":"iana"},"video/vnd.motorola.videop":{"source":"iana"},"video/vnd.mpegurl":{"source":"iana","extensions":["mxu","m4u"]},"video/vnd.ms-playready.media.pyv":{"source":"iana","extensions":["pyv"]},"video/vnd.nokia.interleaved-multimedia":{"source":"iana"},"video/vnd.nokia.mp4vr":{"source":"iana"},"video/vnd.nokia.videovoip":{"source":"iana"},"video/vnd.objectvideo":{"source":"iana"},"video/vnd.radgamettools.bink":{"source":"iana"},"video/vnd.radgamettools.smacker":{"source":"iana"},"video/vnd.sealed.mpeg1":{"source":"iana"},"video/vnd.sealed.mpeg4":{"source":"iana"},"video/vnd.sealed.swf":{"source":"iana"},"video/vnd.sealedmedia.softseal.mov":{"source":"iana"},"video/vnd.uvvu.mp4":{"source":"iana","extensions":["uvu","uvvu"]},"video/vnd.vivo":{"source":"iana","extensions":["viv"]},"video/vnd.youtube.yt":{"source":"iana"},"video/vp8":{"source":"iana"},"video/vp9":{"source":"iana"},"video/webm":{"source":"apache","compressible":false,"extensions":["webm"]},"video/x-f4v":{"source":"apache","extensions":["f4v"]},"video/x-fli":{"source":"apache","extensions":["fli"]},"video/x-flv":{"source":"apache","compressible":false,"extensions":["flv"]},"video/x-m4v":{"source":"apache","extensions":["m4v"]},"video/x-matroska":{"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},"video/x-mng":{"source":"apache","extensions":["mng"]},"video/x-ms-asf":{"source":"apache","extensions":["asf","asx"]},"video/x-ms-vob":{"source":"apache","extensions":["vob"]},"video/x-ms-wm":{"source":"apache","extensions":["wm"]},"video/x-ms-wmv":{"source":"apache","compressible":false,"extensions":["wmv"]},"video/x-ms-wmx":{"source":"apache","extensions":["wmx"]},"video/x-ms-wvx":{"source":"apache","extensions":["wvx"]},"video/x-msvideo":{"source":"apache","extensions":["avi"]},"video/x-sgi-movie":{"source":"apache","extensions":["movie"]},"video/x-smv":{"source":"apache","extensions":["smv"]},"x-conference/x-cooltalk":{"source":"apache","extensions":["ice"]},"x-shader/x-fragment":{"compressible":true},"x-shader/x-vertex":{"compressible":true}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(2186);
const github = __nccwpck_require__(716);
const pangea = __nccwpck_require__(9449);

const token = core.getInput('token');
const config = new pangea.PangeaConfig({ domain: core.getInput('domain')});
const audit = new pangea.AuditService(token, config);
const context = github.context;

// most @actions toolkit packages have async methods
async function run() {
  const data = {
    action: context.action,
    actor: context.actor,
    message: core.getInput('text'),
    source: "GitHub Action",
  };

  try{
    core.info('githubcontext '+context)
    core.info('Logging: '+data.message);
    const logResponse = await audit.log(data, {verbose: true});
    core.info('Response: '+logResponse.result);
    core.setOutput('results', logResponse.result);
  } catch (err) {
    if (err instanceof pangea.PangeaErrors.APIError) {
      core.setFailed(err.summary, err.pangeaResponse);
    } else {
      core.setFailed(err);
    }
  }
}
run();

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map