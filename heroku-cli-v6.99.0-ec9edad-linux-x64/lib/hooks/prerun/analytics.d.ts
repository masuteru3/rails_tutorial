import { Hook } from '@cli-engine/engine/lib/hooks';
export default class AnalyticsPrerunHook extends Hook<'prerun'> {
    run(): Promise<void>;
}
