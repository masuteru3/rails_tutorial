"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const engine_1 = require("@cli-engine/engine");
const child_process_1 = require("child_process");
const cli_ux_1 = require("cli-ux");
const path = require("path");
const fs = require("../../file");
const debug = require('debug')('heroku:completions');
function brew(args, opts = {}) {
    debug('brew %o', args);
    return child_process_1.spawnSync('brew', args, Object.assign({ stdio: 'inherit' }, opts, { encoding: 'utf8' }));
}
class BrewMigrateHook extends engine_1.Hook {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (this.config.platform !== 'darwin')
                    return;
                if (!(yield this.needsMigrate()))
                    return;
                debug('migrating from brew');
                // not on private tap, move to it
                cli_ux_1.default.action.start('Upgrading homebrew formula');
                brew(['tap', 'heroku/brew']);
                brew(['upgrade', 'heroku/brew/heroku']);
                cli_ux_1.default.action.stop();
            }
            catch (err) {
                debug(err);
            }
        });
    }
    get brewRoot() {
        return path.join(process.env.HOMEBREW_PREFIX || '/usr/local');
    }
    get binPath() {
        try {
            return fs.realpathSync(path.join(this.brewRoot, 'bin/heroku'));
        }
        catch (err) {
            if (err.code === 'ENOENT')
                return;
            throw err;
        }
    }
    get cellarPath() {
        if (!this.binPath)
            return;
        if (!this.binPath.startsWith(path.join(this.brewRoot, 'Cellar')))
            return;
        let p = path.resolve(this.binPath, path.dirname(path.relative(this.binPath, path.join(this.brewRoot, 'Cellar/heroku'))));
        return p;
    }
    fetchInstallReceipt() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.cellarPath)
                return;
            return fs.readJSON(path.join(this.cellarPath, 'INSTALL_RECEIPT.json'));
        });
    }
    needsMigrate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let receipt = yield this.fetchInstallReceipt();
            if (!receipt)
                return false;
            return receipt.source.tap === 'homebrew/core';
        });
    }
}
exports.default = BrewMigrateHook;
