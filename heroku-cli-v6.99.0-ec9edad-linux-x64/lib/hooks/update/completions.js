"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const engine_1 = require("@cli-engine/engine");
const completions_1 = require("@heroku-cli/command/lib/completions");
const config_1 = require("@oclif/config");
const cli_ux_1 = require("cli-ux");
const debug = require('debug')('heroku:completions');
class CompletionsUpdateHook extends engine_1.Hook {
    constructor(config, options) {
        super(config, options);
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (this.config.windows) {
                    debug('skipping autocomplete on windows');
                }
                else {
                    const plugins = yield this.config.plugins.list();
                    const acPlugin = plugins.find(p => p.name === 'heroku-cli-autocomplete');
                    if (acPlugin) {
                        cli_ux_1.default.action.start('Updating completions');
                        let ac = yield acPlugin.findCommand('autocomplete:buildcache');
                        if (ac)
                            yield ac.run([], this.config);
                        let config = Object.assign(yield config_1.load({ root: __dirname, devPlugins: false }), this.config);
                        yield completions_1.AppCompletion.options({ config });
                        yield completions_1.PipelineCompletion.options({ config });
                        yield completions_1.SpaceCompletion.options({ config });
                        yield completions_1.TeamCompletion.options({ config });
                    }
                    else {
                        debug('skipping autocomplete, not installed');
                    }
                    cli_ux_1.default.done();
                }
            }
            catch (err) {
                debug(err);
            }
        });
    }
}
exports.default = CompletionsUpdateHook;
