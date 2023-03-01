import {expect, jest, test} from '@jest/globals';
import {TableSchema} from '../src/table-schema';
const tableSchema = new TableSchema();

test('tableSchema.from empty array content', () => {
  expect(() => tableSchema.from({content: [], tableName: 'example'}))
    .toThrowError('table columns configure error');
});

test('tableSchema.from array content', () => {
  const schema = tableSchema.from({
    content: [{
      'name': 'username',
      'type': 'varchar',
      'length': 256,
      'nullable': false,
      'primary': true,
      'default': '',
      'comment': '用户名',
    }],
    tableName: 'example',
  });
  expect(schema).toEqual({
    'tableName': 'example',
    'columns': [{
      'name': 'username',
      'type': 'varchar',
      'length': 256,
      'nullable': false,
      'primary': true,
      'default': '',
      'comment': '用户名',
    }],
    'indexes': {
      username: {
        columns: ['username'],
        primary: true,
      },
    },
    'pk': ['username'],
  });
});

test('tableSchema.from empty object content', () => {
  console.error = jest.fn();
  expect(() => tableSchema.from({content: {columns: []}, tableName: 'example'}))
    .toThrowError('table columns configure error');
});

test('tableSchema.from object content', () => {
  const schema = tableSchema.from({
    content: {
      tableName: 'exampleName',
      columns: [{
        'name': 'username',
        'type': 'varchar',
        'length': 256,
        'nullable': false,
        'primary': true,
        'default': '',
        'comment': '用户名',
      }],
      indexes: {
        test: {
          column: 'username',
        },
      },
    },
    tableName: 'example'});
  expect(schema).toEqual({
    'tableName': 'exampleName',
    'columns': [{
      'name': 'username',
      'type': 'varchar',
      'length': 256,
      'nullable': false,
      'primary': true,
      'default': '',
      'comment': '用户名',
    }],
    'indexes': {
      username: {
        columns: ['username'],
        primary: true,
      },
      test: {
        column: 'username',
        columns: ['username'],
      },
    },
    'pk': ['username'],
  });
});

test('tableSchema.fromPath invalid file path', async () => {
  try {
    tableSchema.fromPath('test/schemas/invalid.json');
  } catch (e) {

  }
});

test('tableSchema.fromPath parse file', async () => {
  const schema = tableSchema.fromPath('test/schemas/example.json');
  expect(schema).toEqual({
    'tableName': 'example',
    'columns': [{
      'name': 'username',
      'type': 'varchar',
      'length': 256,
      'nullable': false,
      'primary': true,
      'default': '',
      'comment': '用户名',
    }],
    'indexes': {
      username: {
        columns: ['username'],
        primary: true,
      },
    },
    'pk': ['username'],
  });
});


test('tableSchema.fromFile parse dir', async () => {
  const schemas = tableSchema.fromPath('test/schemas');
  if (!Array.isArray(schemas)) {
    throw new Error('schemas is not array');
  }
  expect(schemas[0]).toEqual({
    'tableName': 'example',
    'columns': [{
      'name': 'username',
      'type': 'varchar',
      'length': 256,
      'nullable': false,
      'primary': true,
      'default': '',
      'comment': '用户名',
    }],
    'indexes': {
      username: {
        columns: ['username'],
        primary: true,
      },
    },
    'pk': ['username'],
  });
});
