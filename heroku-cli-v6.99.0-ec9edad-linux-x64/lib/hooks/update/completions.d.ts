import { Hook } from '@cli-engine/engine';
import { Config } from '@cli-engine/engine/lib/config';
import { IHooks } from '@cli-engine/engine/lib/hooks';
export default class CompletionsUpdateHook extends Hook<'update'> {
    protected config: Config;
    constructor(config: Config, options: IHooks['update']);
    run(): Promise<void>;
}
