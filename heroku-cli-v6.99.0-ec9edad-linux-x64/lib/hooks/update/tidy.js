"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const engine_1 = require("@cli-engine/engine");
const path = require("path");
const deps_1 = require("../../deps");
const debug = require('debug')('heroku:tidy');
class default_1 extends engine_1.Hook {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield deps_1.default.file.removeEmptyDirs(path.join(this.config.dataDir, 'tmp'));
                if (this.config.configDir !== this.config.dataDir) {
                    yield deps_1.default.file.removeEmptyDirs(this.config.configDir);
                }
                if (this.config.cacheDir !== this.config.dataDir) {
                    yield this.cleanupPlugins();
                }
            }
            catch (err) {
                debug(err);
            }
        });
    }
    cleanupPlugins() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let pluginsDir = path.join(this.config.dataDir, 'plugins');
            if (yield deps_1.default.file.exists(path.join(pluginsDir, 'plugins.json')))
                return;
            let pjson;
            try {
                pjson = yield deps_1.default.file.readJSON(path.join(pluginsDir, 'package.json'));
            }
            catch (err) {
                if (err.code !== 'ENOENT')
                    throw err;
                return;
            }
            if (!pjson.dependencies || pjson.dependencies === {}) {
                yield deps_1.default.file.remove(path.join(pluginsDir));
            }
        });
    }
}
exports.default = default_1;
