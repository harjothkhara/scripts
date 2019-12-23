'use strict'

/**
 * Dependencies
 */

const fs = require('fs');
const path = require('path');
const meow = require('meow');
const chalk = require('chalk');
const fse = require('fs-extra');
const showHelp = require('../helpers/showHelp');

/**
 * Constants
 */

const CONFIG_DIR = path.join(process.env.HOME, '.nodemon');

/**
 * Define helpers
 */

function printInitialPrompt() {
  console.log('\n  No monitoring scripts found. Add your first one.');
}

function printUsageRef() {
  console.log('\n  To see usage run \`cast nodemon -h\`\n');
}

function requireFile(file) {
  if (!fse.pathExistsSync(file)) throw new Error(`Missing file: ${file}`);
}

function requireExtname(file, ext) {
  if (path.extname(file) !== ext)
    throw new Error('Invalid file missing .js extension.');
}

function requireFileFormat(file) {
  requireFile(file);
  requireExtname(file, '.js');
}

function printScripts(files) {
  console.log('\n  Listing active nodemon scripts...\n');
  for (let i = 0; i < files.length; i++) {
    console.log(`    ${chalk.bold.green(files[i][0])}`);
    console.log(`    ${files[i][1]}`);
    console.log('');
  }
}

/**
 * Parse args
 */

const cli = meow(`
  Usage
    $ cast nodemon
  
  Options:
    -a, --add FILE   Add a new monitoring script.
    --remove FILE    Remove a monitoring script.
`, {
  description: 'Filesystem monitoring scripts.',
  flags: {
    add: { type: 'string', alias: 'a' },
    remove: { type: 'string' },
  }
});

/**
 * Define script
 */

function nodemon(command = null) {
  showHelp(cli);

  const flags = Object.keys(cli.flags);
  command = command || flags.pop() || 'list';

  fse.mkdirpSync(CONFIG_DIR);

  if (command === 'list' || command === 'l') {
    const files = fs.readdirSync(CONFIG_DIR).map(x => {
      return [x, path.resolve(fs.readlinkSync(path.join(CONFIG_DIR, x)))]
    });
    if (files.length > 0) {
      printScripts(files);
      printUsageRef();
    } else {
      printInitialPrompt();
      printUsageRef();
    }
  } else if (command === 'add' || command === 'a') {
    const file = cli.flags.add;
    const dst = path.join(CONFIG_DIR, path.basename(file));
    requireFileFormat(file);

    console.log(chalk.white.bold(`\n  Adding script: ${dst}\n`));
    fse.ensureSymlinkSync(file, dst);
  } else if (command === 'remove') {
    const file = cli.flags.remove;
    const dst = path.join(CONFIG_DIR, file);
    requireFileFormat(dst);

    console.log(chalk.white.bold(`\n  Removing script: ${dst}\n`));
    fs.unlinkSync(dst);
  }
}

/**
 * Export script
 */

module.exports = nodemon;
