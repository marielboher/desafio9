import winston, { transports } from "winston";
import {ENV_CONFIG} from "./config.js";

const customLevelsOptions = {
    levels: {
        debug: 4,
        http: 2,
        info: 3,
        warning: 2,
        fatal: 0,
        error: 1,
    },
    colors: {
        debug: 'blue',
        http: 'blue',
        info: 'green',
        warning: 'yellow',
        fatal: 'red',
        error: 'red',
    }
};

winston.addColors(customLevelsOptions.colors);
export const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelsOptions.colors}),
                    winston.format.simple()
                )
            }
        ),
        new winston.transports.File(
            {
                filename: './errors.log', 
                level: 'warning', 
                format: winston.format.simple()
            }
        )
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelsOptions.colors}),
                    winston.format.simple()
                )
            }
        ),
        new winston.transports.File({filename: './errors.log', level: 'warn'})
    ]
});


export const addLogger = (req, res, next) => {
    if (ENV_CONFIG.environment === 'production'){
        req.logger = prodLogger;
    } else {
        req.logger = devLogger;
    }
    req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    next();
};

