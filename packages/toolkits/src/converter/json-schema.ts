import {TableSchema} from '../table-schema/types';
import preprocess from './helper';

interface Property {
  title: string;
  type: string;
  'x-component'?: string;
  'x-decorator'?: string;
}

const StringType = [
  // MySQL
  'char', 'varchar', 'tinytext',
  // PostgreSQL
  'character', 'character varying',
];

const LongStringType = [
  'text', 'mediumtext', 'longtext',
];

const NumberType = [
  // MySQL
  'int', 'tinyint', 'smallint', 'mediumint', 'bigint', 'float', 'double',
  // PostgreSQL
  'integer', 'real', 'double precision',
];

const DateTimeType = [
  'datetime', 'timestamp',
  'timestamp with timezone', 'timestamp without timezone',
];

const TimeType = ['time', 'time with timezone', 'time without timezone'];

function getSchemaTypeByDefType(type: string) {
  if (NumberType.includes(type)) {
    return 'number';
  }
  return 'string';
}

function getFormByType(type: string) {
  if (StringType.includes(type)) {
    return {'x-component': 'Input'};
  }
  if (LongStringType.includes(type)) {
    return {'x-component': 'Textarea'};
  }
  if (type === 'boolean') {
    return {'x-component': 'Radio'};
  }

  if (NumberType.includes(type)) {
    return {'x-component': 'InputNumber'};
  }
  if (type === 'date') {
    return {'x-component': 'DatePicker'};
  }
  if (DateTimeType.includes(type)) {
    return {'x-component': 'DatePicker', 'x-component-props': {'showTime': true}};
  }
  if (TimeType.includes(type)) {
    return {'x-component': 'TimePicker'};
  }
  if (type === 'year') {
    return {'x-component': 'DatePicker', 'x-component-props': {'picker': 'year'}};
  }
  return {'x-component': 'Input'};
}

export function schemaToJsonSchema(table: TableSchema) {
  const {columns} = preprocess(table);
  const properties = columns.reduce((curr, col) => {
    const key = col.alias || col.name;
    curr[key] = {
      title: col.comment || key,
      type: getSchemaTypeByDefType(col.type),
    };
    return curr;
  }, {} as Record<string, Property>);
  return {
    type: 'object',
    properties,
  };
}

export function schemaToFormily(table: TableSchema) {
  const {columns} = preprocess(table);
  const properties = columns.reduce((curr, col) => {
    const key = col.alias || col.name;
    curr[key] = {
      'title': col.comment || key,
      'type': getSchemaTypeByDefType(col.type),
      'x-decorator': 'FormItem',
      ...getFormByType(col.type),
    };
    return curr;
  }, {} as Record<string, Property>);
  return {
    'type': 'object',
    'properties': properties,
  };
};
