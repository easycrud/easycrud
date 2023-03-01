import {
  ColumnDefinition,
  UnstrictTableObject,
  UnstrictTableSchema,
  TableSchema as TypeTableSchema,
  IndexDefinition,
  Index,
} from './types';
import * as fs from 'fs';
import * as path from 'path';


export function standardize(
  schema: UnstrictTableSchema, tableName?: string): TypeTableSchema {
  if (typeof schema === 'string') {
    schema = JSON.parse(schema) as UnstrictTableObject | ColumnDefinition[];
  }
  if (Array.isArray(schema)) {
    schema = {
      tableName,
      columns: schema,
    } as UnstrictTableObject;
  }

  // Preprocess
  const columns = schema.columns;
  if (!Array.isArray(columns) || columns.length === 0) {
    throw new Error('table columns configure error');
  }

  const indexes: Index = {};
  const primary = columns.filter((col) => col.primary);
  if (primary.length > 0) {
    // If a column is set as primary, add it into the indexes.
    const pri = primary[0];
    indexes[pri.name] = {
      columns: [pri.name],
      primary: true,
    };
  }
  Object.entries(schema.indexes || {}).forEach(([index, conf]: [string, Partial<IndexDefinition>]) => {
    let columns = conf.columns;
    if (!columns && conf.column) {
      // Set columns using column property so that the column property can be ignored in later processing.
      columns = [conf.column];
    } else {
      // If column and columns are not configured, try to use a column named index key.
      columns = [index];
    }
    // If column and columns are not configured, try to use a column named index key.
    indexes[index] = {
      columns,
      ...conf,
    };
  });
  return {
    tableName: tableName || 'unknown',
    ...schema,
    indexes,
    get pk(): string[] {
      const pk: IndexDefinition[] = Object.values(
        (indexes || {}) as Index,
      )
        .filter((index: IndexDefinition) => index.primary);
      if (pk.length > 0) {
        return pk[0].columns || [];
      }
      return [];
    },
  };
}

export class TableSchema {
  getFileName(filePath: string) {
    const ext = path.extname(filePath);
    const fileName = path.basename(filePath, ext);
    return fileName;
  }

  fromPath(filePath: string) {
    console.log('Parse file path: ', filePath);
    const stat = fs.lstatSync(filePath);
    if (stat.isFile()) {
      return this.fromFile(filePath);
    }
    if (stat.isDirectory()) {
      const files = fs.readdirSync(filePath);
      const dirPath = filePath[filePath.length - 1] === '/' ? filePath : filePath + '/';
      return files.map((file: string) => this.fromFile(dirPath + file));
    }
    throw new Error('The file path is invalid');
  }

  fromFile(filePath: string) {
    const fileName = this.getFileName(filePath);
    let content = fs.readFileSync(filePath, 'utf-8');
    content = JSON.parse(content);
    return this.from({content, tableName: fileName});
  }

  from(opts: {
    content: UnstrictTableSchema;
    tableName?: string;
  }) {
    const {content, tableName} = opts;
    const table = standardize(content, tableName);
    return table;
  }
}
