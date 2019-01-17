import { Hook } from '@cli-engine/engine';
export default class AnalyticsUpdateHook extends Hook<'update'> {
    run(): Promise<void>;
}
