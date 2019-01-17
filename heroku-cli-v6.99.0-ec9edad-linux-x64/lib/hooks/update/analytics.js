"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const engine_1 = require("@cli-engine/engine");
const analytics_1 = require("../../analytics");
const debug = require('debug')('heroku:analytics');
class AnalyticsUpdateHook extends engine_1.Hook {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const analytics = new analytics_1.default(this.config);
                yield analytics.submit();
            }
            catch (err) {
                debug(err);
            }
        });
    }
}
exports.default = AnalyticsUpdateHook;
