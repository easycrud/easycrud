#!/usr/bin/env node

import {program} from 'commander';
import fs from 'fs';
import pkg from '../../package.json';
import {schemaToMySQL, schemaToPostgreSQL} from '../converter';
import {TableSchema} from '../table-schema';
import {TableSchema as TypeTableSchema} from '../table-schema/types';
const converter: {
  [key: string]: (table: TypeTableSchema) => string;
} = {
  mysql: schemaToMySQL,
  pgsql: schemaToPostgreSQL,
};

program
  .version(pkg.version)
  .option('-p, --path [path]', 'set file path')
  .option('-o, --out [out]', 'set output file path, default stdout')
  .option('-t, --type [type]', 'set db type, just support mysql and pgsql currently')
  .parse(process.argv);

const config: {[key:string]: string} = {
  path: '',
  out: 'stdout',
  type: 'mysql',
};

const options = program.opts();
Object.keys(config).forEach((key) => {
  if (options[key] && typeof options[key] === 'string') {
    config[key] = options[key];
  }
});

if (!config.type) {
  config.type = 'mysql';
}

if (config.path) {
  console.log(`use file path: ${config.path}\n`);
} else {
  console.log(`file path is required\n`);
  process.exit(1);
}

const result: string[] = [];
const tableSchema = new TableSchema();
try {
  const schemas = tableSchema.fromPath(config.path);
  if (Array.isArray(schemas)) {
    schemas.forEach((s) => {
      result.push(converter[config.type](s));
    });
  } else {
    result.push(converter[config.type](schemas));
  }

  if (config.out === 'stdout') {
    console.log(result.join('\n\n'));
    process.exit(1);
  }

  fs.writeFile(config.out, result.join('\n\n'), (err) => {
    if (err) {
      console.log('output file error:', err);
      process.exit(1);
    }
    console.log('output file success:', config.out);
    process.exit(0);
  });
} catch (err) {
  console.log('parse error:', err);
  process.exit(1);
};


