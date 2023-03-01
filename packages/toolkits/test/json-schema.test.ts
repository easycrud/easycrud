import {schemaToFormily, schemaToJsonSchema} from '../src/converter';
import {getUserDef} from './helper';
import {expect, test} from '@jest/globals';

test('schemaToJsonSchema', async () => {
  expect(schemaToJsonSchema(await getUserDef())).toStrictEqual({
    'type': 'object',
    'properties': {
      'id': {
        'type': 'number',
        'title': 'id',
      },
      'username': {
        'type': 'string',
        'title': '用户名',
      },
      'email': {
        'type': 'string',
        'title': '邮箱',
      },
      'password': {
        'type': 'string',
        'title': '密码',
      },
      'updateTime': {
        'type': 'string',
        'title': '更新时间',
      },
    },
  });
});

test('schemaToFormily', async () => {
  expect(schemaToFormily(await getUserDef())).toStrictEqual({
    'type': 'object',
    'properties': {
      'id': {
        'type': 'number',
        'title': 'id',
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
      },
      'username': {
        'type': 'string',
        'title': '用户名',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      'email': {
        'type': 'string',
        'title': '邮箱',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      'password': {
        'type': 'string',
        'title': '密码',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      'updateTime': {
        'type': 'string',
        'title': '更新时间',
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker',
        'x-component-props': {'showTime': true},
      },
    },
  });
});
