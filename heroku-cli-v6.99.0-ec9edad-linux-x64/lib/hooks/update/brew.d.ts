import { Hook } from '@cli-engine/engine';
export default class BrewMigrateHook extends Hook<'update'> {
    run(): Promise<void>;
    private readonly brewRoot;
    private readonly binPath;
    private readonly cellarPath;
    private fetchInstallReceipt();
    private needsMigrate();
}
