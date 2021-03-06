#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const fs = require('fs')

/**
 * Constants
 */

const file_path = '/tmp/boot.log'

/**
 * Append new log line
 */

if (!fs.existsSync(file_path)) {
  fs.writeFileSync(file_path, new Date() + '\n')
} else {
  fs.appendFileSync(file_path, new Date() + '\n')
}
