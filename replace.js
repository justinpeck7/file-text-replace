#! /usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    nameFrom = process.argv[2],
    nameTo = process.argv[3],
    total = 0;

if (nameTo === undefined) {
    console.log('\x1b[31m', 'Must specify string to search for and replace', '\x1b[0m');
    console.log('\x1b[35m', 'ftr [FROMTEXT] [TOTEXT]', '\x1b[0m');
    process.exit();
}

var config = {
    ignoreFolders: ['node_modules'],
    extensions: ['.js', '.html', '.md', '.txt', '.json']
};

function walk(dir, cb) {
    fs.readdirSync(dir).forEach(name => {
        var fPath = path.join(dir, name),
            stat = fs.statSync(fPath),
            splitFolders = dir.split(path.sep),
            folder = splitFolders.slice(-1)[0];
        if (stat.isFile() && config.extensions.indexOf(path.extname(fPath)) !== -1) {
            replaceText(fPath);
            total ++;
        } else if (stat.isDirectory() && config.ignoreFolders.indexOf(folder) === -1) {
            walk(fPath);
        }
    });
}

function replaceText(fPath) {
    fs.readFile(fPath, 'utf8', (err, data) => {
        var reg = new RegExp(nameFrom, 'g'),
            updatedFile = data.replace(reg, nameTo);
        fs.writeFile(fPath, updatedFile);
    });
}

walk(process.cwd());
console.log('\x1b[32m', `Updated ${total} files`, '\x1b[0m');
