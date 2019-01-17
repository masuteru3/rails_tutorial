import { Config } from '@cli-engine/config';
export interface ConfigJSON {
    schema: 1;
    install?: string;
    skipAnalytics?: boolean;
}
export default class UserConfig {
    private config;
    private needsSave;
    private body;
    private mtime?;
    private saving?;
    private _init;
    constructor(config: Config);
    install: string;
    readonly skipAnalytics: boolean;
    init(): Promise<void>;
    private readonly debug;
    private readonly file;
    private save();
    private read();
    private migrate();
    private canWrite();
    private getLastUpdated();
    private genInstall();
}
