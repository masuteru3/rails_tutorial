"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const deps_1 = require("./deps");
const debug = require('debug')('heroku-cli:file');
function exists(f) {
    // debug('exists', f)
    // @ts-ignore
    return deps_1.default.fs.exists(f);
}
exports.exists = exists;
function stat(file) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // debug('stat', file)
        return deps_1.default.fs.stat(file);
    });
}
exports.stat = stat;
function rename(from, to) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        debug('rename', from, to);
        return deps_1.default.fs.rename(from, to);
    });
}
exports.rename = rename;
function remove(file) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!(yield exists(file)))
            return;
        debug('remove', file);
        return deps_1.default.fs.remove(file);
    });
}
exports.remove = remove;
function ls(dir) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let files = yield deps_1.default.fs.readdir(dir);
        let paths = files.map(f => path.join(dir, f));
        return Promise.all(paths.map(path => deps_1.default.fs.stat(path).then(stat => ({ path, stat }))));
    });
}
exports.ls = ls;
function removeEmptyDirs(dir) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let files;
        try {
            files = yield ls(dir);
        }
        catch (err) {
            if (err.code === 'ENOENT')
                return;
            throw err;
        }
        let dirs = files.filter(f => f.stat.isDirectory()).map(f => f.path);
        for (let p of dirs.map(removeEmptyDirs))
            yield p;
        files = yield ls(dir);
        if (!files.length)
            yield remove(dir);
    });
}
exports.removeEmptyDirs = removeEmptyDirs;
function readJSON(file) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        debug('readJSON', file);
        return deps_1.default.fs.readJSON(file);
    });
}
exports.readJSON = readJSON;
function outputJSON(file, data, options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        debug('outputJSON', file);
        return deps_1.default.fs.outputJSON(file, data, Object.assign({ spaces: 2 }, options));
    });
}
exports.outputJSON = outputJSON;
function realpathSync(p) {
    return deps_1.default.fs.realpathSync(p);
}
exports.realpathSync = realpathSync;
