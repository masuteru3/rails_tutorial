"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const deps_1 = require("./deps");
class UserConfig {
    constructor(config) {
        this.config = config;
        this.needsSave = false;
    }
    get install() {
        return this.body.install || this.genInstall();
    }
    set install(install) {
        this.body.install = install;
        this.needsSave = true;
    }
    get skipAnalytics() {
        if (typeof this.body.skipAnalytics !== 'boolean') {
            this.body.skipAnalytics = false;
            this.needsSave = true;
        }
        return this.body.skipAnalytics;
    }
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.saving;
            if (this._init)
                return this._init;
            return (this._init = (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.debug('init');
                this.body = (yield this.read()) || { schema: 1 };
                if (!this.body.schema) {
                    this.body.schema = 1;
                    this.needsSave = true;
                }
                else if (this.body.schema !== 1)
                    this.body = { schema: 1 };
                // tslint:disable-next-line
                this.install;
                // tslint:disable-next-line
                this.skipAnalytics;
                if (this.needsSave)
                    yield this.save();
            }))());
        });
    }
    get debug() {
        return require('debug')('heroku:user_config');
    }
    get file() {
        return path.join(this.config.dataDir, 'config.json');
    }
    save() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.needsSave)
                return;
            this.needsSave = false;
            this.saving = (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.debug('saving');
                if (!(yield this.canWrite())) {
                    throw new Error('file modified, cannot save');
                }
                yield deps_1.default.file.outputJSON(this.file, this.body);
            }))();
        });
    }
    read() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.migrate();
            try {
                this.mtime = yield this.getLastUpdated();
                let body = yield deps_1.default.file.readJSON(this.file);
                return body;
            }
            catch (err) {
                if (err.code !== 'ENOENT')
                    throw err;
                this.debug('not found');
            }
        });
    }
    migrate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield deps_1.default.file.exists(this.file))
                return;
            let old = path.join(this.config.configDir, 'config.json');
            if (!(yield deps_1.default.file.exists(old)))
                return;
            this.debug('moving config into new place');
            yield deps_1.default.file.rename(old, this.file);
        });
    }
    canWrite() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.mtime)
                return true;
            return (yield this.getLastUpdated()) === this.mtime;
        });
    }
    getLastUpdated() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const stat = yield deps_1.default.file.stat(this.file);
                return stat.mtime.getTime();
            }
            catch (err) {
                if (err.code !== 'ENOENT')
                    throw err;
            }
        });
    }
    genInstall() {
        const uuid = require('uuid/v4');
        this.install = uuid();
        return this.install;
    }
}
exports.default = UserConfig;
