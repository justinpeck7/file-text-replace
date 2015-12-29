var fs = require('fs'),
    path = require('path'),
    nameFrom = process.argv[2],
    nameTo = process.argv[3];

var config = {
    ignoreFolders: [],
    extensions: ['.js', '.html']
};

function walk(dir) {
    fs.readdirSync(dir).forEach(name => {
        var fPath = path.join(dir, name),
            stat = fs.statSync(fPath),
            splitFolders = dir.split(path.sep),
            folder = splitFolders.slice(-1)[0];
        if (stat.isFile() && config.extensions.indexOf(path.extname(fPath)) !== -1) {
            rename(fPath);
        } else if (stat.isDirectory() && config.ignoreFolders.indexOf(folder) === -1) {
            walk(fPath);
        }
    });
}

function rename(fPath) {
    fs.readFile(fPath, 'utf8', (err, data) => {
        var reg = new RegExp(nameFrom, 'g'),
            updatedFile = data.replace(reg, nameTo);
        fs.writeFile(fPath, updatedFile, function() {
            console.log('\x1b[32m', 'UPDATED -- ' + fPath, '\x1b[0m');
        });
    });
}

walk(__dirname);
