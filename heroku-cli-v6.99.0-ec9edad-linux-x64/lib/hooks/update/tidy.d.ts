import { Hook } from '@cli-engine/engine';
export default class  extends Hook<'update'> {
    run(): Promise<void>;
    private cleanupPlugins();
}
