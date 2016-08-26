import { Injectable } from '@angular/core';

export enum LOG_LEVEL {
    ALL = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    NONE = 5
}

@Injectable()
export class LoggerService {

    public logLevel: LOG_LEVEL = LOG_LEVEL.ERROR;

    public group(message?: string, logLevel: LOG_LEVEL = LOG_LEVEL.ERROR) {
        if (this.logLevel <= logLevel) {
            window.console.group.apply(window.console, [message]);
        }
    }

    public groupEnd(logLevel: LOG_LEVEL = LOG_LEVEL.ERROR) {
        if (this.logLevel <= logLevel) {
            window.console.groupEnd.apply(window.console, arguments);
        }
    }

    public debug(...args: any[]) {
        if (this.logLevel <= 1) {
            window.console.debug.apply(window.console, args);
        }
    }

    public info(...args: any[]) {
        if (this.logLevel <= 2) {
            window.console.info.apply(window.console, args);
        }
    }

    public warn(...args: any[]) {
        if (this.logLevel <= 3) {
            window.console.warn.apply(window.console, args);
        }
    }

    public error(...args: any[]) {
        if (this.logLevel <= 4) {
            window.console.error.apply(window.console, args);
        }
    }

    public log(...args: any[]) {
        window.console.info.apply(window.console, args);
    }

}