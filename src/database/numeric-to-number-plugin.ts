import {
  KyselyPlugin,
  PluginTransformQueryArgs,
  PluginTransformResultArgs,
  QueryResult,
  RootOperationNode,
  UnknownRow
} from "kysely";

export class NumericToNumberPlugin implements KyselyPlugin {
  transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    return args.node; // No changes to the query
  };

  async transformResult(
    args: PluginTransformResultArgs
  ): Promise<QueryResult<UnknownRow>> {
    const transformedRows = args.result.rows.map(row => {
      const newRow: Record<string, unknown> = {};
      for (const key in row) {
        const value = row[key];
        newRow[key] =
          typeof value === 'string' && /^\d+(\.\d+)?$/.test(value)
            ? Number(value)
            : value;
      }
      return newRow;
    });

    return {
      ...args.result,
      rows: transformedRows,
    };
  }
}
