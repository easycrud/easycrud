import {TableSchema} from '../src/table-schema';
import {TableSchema as TypeTableSchema} from '../src/table-schema/types';

export function getUserDef(): TypeTableSchema {
  const tableSchema = new TableSchema;
  return tableSchema.fromPath('test/schemas/user.json') as TypeTableSchema;
};
