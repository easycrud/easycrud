import {TableSchema} from '../table-schema/types';

export default function preprocess(table: TableSchema) {
  const columnNames = table.columns.map((c) => c.name);
  if (table.indexes) {
    Object.values(table.indexes).forEach((idx) => {
      idx.columns.forEach((col) => {
        if (!columnNames.includes(col)) {
          throw new Error(`table indexes include column ${col} that does not configuire in columns`);
        }
      });
    });
  }
  const opts = {
    engine: 'InnoDB',
    autoIncrement: 0,
    ...table.options?.sql,
  };
  return {tableName: table.tableName, columns: table.columns, opts};
};
