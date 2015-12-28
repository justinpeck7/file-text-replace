var fs = require('fs'),
    path = require('path'),
    nameFrom = process.argv[2],
    nameTo = process.argv[3];

function walk(dir) {
    var splitFolders = dir.split('\\'),
        folder = splitFolders[splitFolders.length - 1];
    if (folder !== 'assets' && folder !== '.git') {
        fs.readdirSync(dir).forEach(name => {
            var fPath = path.join(dir, name);
            var stat = fs.statSync(fPath);
            if (stat.isFile() && path.extname(fPath) === '.js') {
                rename(fPath);
            } else if (stat.isDirectory()) {
                walk(fPath);
            }
        });
    }
}

function rename(fPath) {
    fs.readFile(fPath, 'utf8', (err, data) => {
        var reg = new RegExp(nameFrom, 'g'),
            updatedFile = data.replace(reg, nameTo);
        fs.writeFile(fPath, updatedFile, function() {
            console.log('\x1b[32m', 'UPDATED -- ' + fPath,'\x1b[0m');
        });
    });
}

walk(__dirname);
