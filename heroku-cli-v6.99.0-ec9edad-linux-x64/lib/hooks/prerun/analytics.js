"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hooks_1 = require("@cli-engine/engine/lib/hooks");
const analytics_1 = require("../../analytics");
const debug = require('debug')('heroku:analytics');
class AnalyticsPrerunHook extends hooks_1.Hook {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const analytics = new analytics_1.default(this.config);
                yield analytics.record(this.options);
            }
            catch (err) {
                debug(err);
            }
        });
    }
}
exports.default = AnalyticsPrerunHook;
