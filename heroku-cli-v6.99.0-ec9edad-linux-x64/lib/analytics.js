"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@heroku-cli/command");
const cli_ux_1 = require("cli-ux");
const netrc_parser_1 = require("netrc-parser");
const path = require("path");
const deps_1 = require("./deps");
const debug = require('debug')('heroku:analytics');
class AnalyticsCommand {
    constructor(config) {
        this.config = config;
        this.http = deps_1.default.HTTP.defaults({
            headers: { 'user-agent': config.userAgent },
        });
    }
    _initialAnalyticsJSON() {
        return {
            schema: 1,
            commands: [],
        };
    }
    record(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.init();
            const plugin = opts.Command.plugin;
            if (!plugin) {
                debug('no plugin found for analytics');
                return;
            }
            if (!this.user)
                return;
            let analyticsJSON = yield this._readJSON();
            analyticsJSON.commands.push({
                command: opts.Command.id,
                completion: yield this._acAnalytics(),
                version: this.config.version,
                plugin: plugin.name,
                plugin_version: plugin.version,
                os: this.config.platform,
                shell: this.config.shell,
                valid: true,
                language: 'node',
            });
            yield this._writeJSON(analyticsJSON);
        });
    }
    submit() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.init();
                let user = this.user;
                if (!user)
                    return;
                const local = yield this._readJSON();
                if (local.commands.length === 0)
                    return;
                const body = {
                    schema: local.schema,
                    commands: local.commands,
                    user,
                    install: this.userConfig.install,
                    cli: this.config.name,
                };
                yield this.http.post(this.url, { body });
                yield deps_1.default.file.remove(this.analyticsPath);
            }
            catch (err) {
                debug(err);
                yield deps_1.default.file.remove(this.analyticsPath).catch(err => cli_ux_1.default.warn(err));
            }
        });
    }
    get url() {
        return process.env.HEROKU_ANALYTICS_URL || 'https://cli-analytics.heroku.com/record';
    }
    get analyticsPath() {
        return path.join(this.config.cacheDir, 'analytics.json');
    }
    get usingHerokuAPIKey() {
        const k = process.env.HEROKU_API_KEY;
        return !!(k && k.length > 0);
    }
    get netrcLogin() {
        return netrc_parser_1.default.machines[command_1.vars.apiHost] && netrc_parser_1.default.machines[command_1.vars.apiHost].login;
    }
    get user() {
        if (this.userConfig.skipAnalytics || this.usingHerokuAPIKey)
            return;
        return this.netrcLogin;
    }
    _readJSON() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let analytics = yield deps_1.default.file.readJSON(this.analyticsPath);
                analytics.commands = analytics.commands || [];
                return analytics;
            }
            catch (err) {
                if (err.code !== 'ENOENT')
                    debug(err);
                return this._initialAnalyticsJSON();
            }
        });
    }
    _writeJSON(analyticsJSON) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return deps_1.default.file.outputJSON(this.analyticsPath, analyticsJSON);
        });
    }
    _acAnalytics() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let root = path.join(this.config.cacheDir, 'completions', 'completion_analytics');
            let meta = {
                cmd: deps_1.default.file.exists(path.join(root, 'command')),
                flag: deps_1.default.file.exists(path.join(root, 'flag')),
                value: deps_1.default.file.exists(path.join(root, 'value')),
            };
            let score = 0;
            if (yield meta.cmd)
                score += 1;
            if (yield meta.flag)
                score += 2;
            if (yield meta.value)
                score += 4;
            if (yield deps_1.default.file.exists(root))
                yield deps_1.default.file.remove(root);
            return score;
        });
    }
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield netrc_parser_1.default.load();
            this.userConfig = new deps_1.default.UserConfig(this.config);
            yield this.userConfig.init();
        });
    }
}
exports.default = AnalyticsCommand;
