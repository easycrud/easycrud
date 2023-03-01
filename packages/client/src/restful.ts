import {standardize} from '@easycrud/toolkits';
import {TableSchema, UnstrictTableSchema} from '@easycrud/toolkits/lib/table-schema/types';

export default class Client {
  schema: TableSchema;
  api: string;
  options: RequestInit;

  constructor({schema, api, baseUrl, options}: {
    schema: UnstrictTableSchema;
    api?: string;
    baseUrl: string;
    options?: RequestInit;
  }) {
    this.schema = standardize(schema);
    this.api = api || `${baseUrl}/${this.schema.tableName}`;
    this.options = {
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      ...options,
    };
  }

  getPkParams(record: Record<string, any>) {
    const pk = this.schema.pk;
    const params = pk.map((key) => record[key]);
    return params.join('/');
  }

  async all(filters?: Record<string, any>) {
    const url = `${this.api}?` + new URLSearchParams(filters);
    const response = await fetch(url, this.options);
    const data = await response.json();
    return data;
  }

  async paginate(
    pagination: {page: number, pageSize: number} = {page: 1, pageSize: 20},
    filters?: Record<string, any>,
  ) {
    const {page, pageSize} = pagination;
    const url = `${this.api}?` + new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    });
    const response = await fetch(url, this.options);
    const data = await response.json();
    return data;
  }

  async show(record: Record<string, any>) {
    const url = `${this.api}/${this.getPkParams(record)}`;
    const response = await fetch(url, this.options);
    const data = await response.json();
    return data;
  }

  async store(data: Record<string, any>) {
    const response = await fetch(this.api, {
      ...this.options,
      method: 'POST',
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return res;
  }

  async edit(record: Record<string, any>, data: Record<string, any>) {
    const url = `${this.api}/${this.getPkParams(record)}`;
    const response = await fetch(url, {
      ...this.options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return res;
  }

  async destroy(record: Record<string, any>) {
    const url = `${this.api}/${this.getPkParams(record)}`;
    const response = await fetch(url, {
      ...this.options,
      method: 'DELETE',
    });
    const res = await response.json();
    return res;
  }
}

