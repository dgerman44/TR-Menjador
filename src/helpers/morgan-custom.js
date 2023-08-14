/**
 * morgan is a powerful module to log requests.
 * I love the 'dev' predefined format, specially its ability to 
 * produce colored status codes.
 * I wanted to enhace the 'dev' log format adding the currently logged user, 
 * but without loosing this wonderful coloring of the status codes.
 * So I had to copy here their implementation, jut to modify it a bit.
 */
import morgan from 'morgan';

const colorFunctions = {};

morgan.token('user', req => {
    return req.user ? req.user.email : 'undefined'
});

const morgan_custom = function (tokens, req, res) {
    // get the status code if response written
    const status = headersSent(res)
        ? res.statusCode
        : undefined;

    const color = status >= 500 ? 31 // red
        : status >= 400 ? 33 // yellow
            : status >= 300 ? 36 // cyan
                : status >= 200 ? 32 // green
                    : 0 // no color

    let fn = colorFunctions[color];
    if (!fn) {
        fn = colorFunctions[color] = morgan.compile('\x1b[0m:method :url \x1b[' + 
        color + 'm:status\x1b[0m :response-time ms - :res[content-length] (:user)\x1b[0m');
    }
    return fn(tokens, req, res)
}

function headersSent(res) {
    // istanbul ignore next: node.js 0.8 support
    return typeof res.headersSent !== 'boolean'
        ? Boolean(res._header)
        : res.headersSent
}

export default morgan_custom;
