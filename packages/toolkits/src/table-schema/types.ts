/**
   * Describe a table column using JSON
   */
export interface ColumnDefinition {
  /**
   * Column name
   */
  name: string;
  /**
   * Column type: varchar, int, timestamp, etc.
   */
  type: string;
  /**
   * The length of a column
   */
  length?: number;
  /**
   * If a column is primary key. Default false.
   */
  primary?: boolean;
  /**
   * If a column is set to auto increment. Default false.
   */
  autoIncrement?: boolean;
  /**
   * If a column is nullable.  Default false.
   */
  nullable?: boolean;
  /**
   * The default content of a column
   */
  default?: any;
  /**
   * The comment of a column
   */
  comment?: string;
  /**
   * The content will be set when a column is on updated. Usually 'CURRENT_TIMESTAMP'
   */
  onUpdate?: string;
  /**
   * The alias of a column, usually used in sql statements and response messages.
   */
  alias?: string;
  /**
   * Don't let the column used in APIs or displayed in front end. Default is false.
   */
  hide?: boolean;
}

/**
 * Describe a table index using JSON
 */
export interface IndexDefinition {
  /**
   * The columns to be indexed. It will be ignored if `column` is set.
   */
  columns: string[];
  /**
   * The column to be indexed
   */
  column?: string;
  /**
   * If a index is unique. Default false.
   */
  unique?: boolean;
  /**
   * If a index is primary key. Default false.
   */
  primary?: boolean;
}
export type Index = { [key: string]: IndexDefinition };

type columnFormatter = (col: string) => string;
/**
 * Extra options for table definition
 */
export interface TableOptions {
  /**
   * The database that this table belongs to.
   */
  database?: string;
  /**
   * The method use to format the column names. Default camel.
   * Notice: the alias property will be use first if it is set.
   */
  columnFormatter?: 'snake' | 'camel' | 'kebab' | 'none' | columnFormatter;
  /* The following properties are the extra options for sql statement */
  sql: {
    /**
     * If true, drop table if it exists before create. Default false.
     */
    dropIfExists?: boolean;
    /**
      * Set table engine. Default 'InnoDB'.
      */
    engine?: string;
    /**
      * Set where the auto increment key start from.
      */
    autoIncrement?: number;
  }
}
/**
 * Describe a table using JSON
 */
export interface TableSchema {
  /**
    * The name of a table.
    */
  tableName: string;
  /**
   * The alias of a table.
   */
  alias?: string;
  /**
   * The columns of a table.
   */
  columns: ColumnDefinition[];
  /**
   * The indexes of a table. The oject keys are the index names.
   */
  indexes?: Index;
  /**
   * Extra options for table
   */
  options?: TableOptions;
  /**
   * Primary keys getter
   */
  pk: string[]
}

export type UnstrictTableObject = Omit<Partial<TableSchema>, 'indexes'|'columns'> & {
  columns: ColumnDefinition[];
  indexes?: { [key: string]: Partial<IndexDefinition> }
};
export type UnstrictTableSchema = UnstrictTableObject | ColumnDefinition[] | string;
