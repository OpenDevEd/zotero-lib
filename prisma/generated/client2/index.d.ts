
/**
 * Client
**/

import * as runtime from './runtime/library';
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends Prisma.PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model groups
 * 
 */
export type groups = {
  id: number
  version: number
  itemsVersion: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Model items
 * 
 */
export type items = {
  id: string
  version: number
  data: string
  inconsistent: boolean
  group_id: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

/**
 * Model collections
 * 
 */
export type collections = {
  id: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Model collection_items
 * 
 */
export type collection_items = {
  id: number
  createdAt: Date
  updatedAt: Date
  collection_id: string
  item_id: string
}

/**
 * Model alsoKnownAs
 * 
 */
export type alsoKnownAs = {
  id: number
  item_id: string
  group_id: number
  createdAt: Date
  updatedAt: Date
  data: string
  isDeleted: boolean
}


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Groups
 * const groups = await prisma.groups.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Groups
   * const groups = await prisma.groups.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<this, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">) => Promise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>

      /**
   * `prisma.groups`: Exposes CRUD operations for the **groups** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Groups
    * const groups = await prisma.groups.findMany()
    * ```
    */
  get groups(): Prisma.groupsDelegate<GlobalReject>;

  /**
   * `prisma.items`: Exposes CRUD operations for the **items** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Items
    * const items = await prisma.items.findMany()
    * ```
    */
  get items(): Prisma.itemsDelegate<GlobalReject>;

  /**
   * `prisma.collections`: Exposes CRUD operations for the **collections** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Collections
    * const collections = await prisma.collections.findMany()
    * ```
    */
  get collections(): Prisma.collectionsDelegate<GlobalReject>;

  /**
   * `prisma.collection_items`: Exposes CRUD operations for the **collection_items** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Collection_items
    * const collection_items = await prisma.collection_items.findMany()
    * ```
    */
  get collection_items(): Prisma.collection_itemsDelegate<GlobalReject>;

  /**
   * `prisma.alsoKnownAs`: Exposes CRUD operations for the **alsoKnownAs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AlsoKnownAs
    * const alsoKnownAs = await prisma.alsoKnownAs.findMany()
    * ```
    */
  get alsoKnownAs(): Prisma.alsoKnownAsDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket


  /**
   * Prisma Client JS version: 4.10.1
   * Query Engine version: aead147aa326ccb985dcfed5b065b4fdabd44b19
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: runtime.Types.Utils.LegacyExact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    groups: 'groups',
    items: 'items',
    collections: 'collections',
    collection_items: 'collection_items',
    alsoKnownAs: 'alsoKnownAs'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type GroupsCountOutputType
   */


  export type GroupsCountOutputType = {
    items: number
    alsoKnownAs: number
  }

  export type GroupsCountOutputTypeSelect = {
    items?: boolean
    alsoKnownAs?: boolean
  }

  export type GroupsCountOutputTypeGetPayload<S extends boolean | null | undefined | GroupsCountOutputTypeArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? GroupsCountOutputType :
    S extends undefined ? never :
    S extends { include: any } & (GroupsCountOutputTypeArgs)
    ? GroupsCountOutputType 
    : S extends { select: any } & (GroupsCountOutputTypeArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof GroupsCountOutputType ? GroupsCountOutputType[P] : never
  } 
      : GroupsCountOutputType




  // Custom InputTypes

  /**
   * GroupsCountOutputType without action
   */
  export type GroupsCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the GroupsCountOutputType
     */
    select?: GroupsCountOutputTypeSelect | null
  }



  /**
   * Count Type ItemsCountOutputType
   */


  export type ItemsCountOutputType = {
    collection_items: number
    alsoKnownAs: number
  }

  export type ItemsCountOutputTypeSelect = {
    collection_items?: boolean
    alsoKnownAs?: boolean
  }

  export type ItemsCountOutputTypeGetPayload<S extends boolean | null | undefined | ItemsCountOutputTypeArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? ItemsCountOutputType :
    S extends undefined ? never :
    S extends { include: any } & (ItemsCountOutputTypeArgs)
    ? ItemsCountOutputType 
    : S extends { select: any } & (ItemsCountOutputTypeArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof ItemsCountOutputType ? ItemsCountOutputType[P] : never
  } 
      : ItemsCountOutputType




  // Custom InputTypes

  /**
   * ItemsCountOutputType without action
   */
  export type ItemsCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the ItemsCountOutputType
     */
    select?: ItemsCountOutputTypeSelect | null
  }



  /**
   * Count Type CollectionsCountOutputType
   */


  export type CollectionsCountOutputType = {
    collection_items: number
  }

  export type CollectionsCountOutputTypeSelect = {
    collection_items?: boolean
  }

  export type CollectionsCountOutputTypeGetPayload<S extends boolean | null | undefined | CollectionsCountOutputTypeArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? CollectionsCountOutputType :
    S extends undefined ? never :
    S extends { include: any } & (CollectionsCountOutputTypeArgs)
    ? CollectionsCountOutputType 
    : S extends { select: any } & (CollectionsCountOutputTypeArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof CollectionsCountOutputType ? CollectionsCountOutputType[P] : never
  } 
      : CollectionsCountOutputType




  // Custom InputTypes

  /**
   * CollectionsCountOutputType without action
   */
  export type CollectionsCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the CollectionsCountOutputType
     */
    select?: CollectionsCountOutputTypeSelect | null
  }



  /**
   * Models
   */

  /**
   * Model groups
   */


  export type AggregateGroups = {
    _count: GroupsCountAggregateOutputType | null
    _avg: GroupsAvgAggregateOutputType | null
    _sum: GroupsSumAggregateOutputType | null
    _min: GroupsMinAggregateOutputType | null
    _max: GroupsMaxAggregateOutputType | null
  }

  export type GroupsAvgAggregateOutputType = {
    id: number | null
    version: number | null
    itemsVersion: number | null
  }

  export type GroupsSumAggregateOutputType = {
    id: number | null
    version: number | null
    itemsVersion: number | null
  }

  export type GroupsMinAggregateOutputType = {
    id: number | null
    version: number | null
    itemsVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GroupsMaxAggregateOutputType = {
    id: number | null
    version: number | null
    itemsVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GroupsCountAggregateOutputType = {
    id: number
    version: number
    itemsVersion: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GroupsAvgAggregateInputType = {
    id?: true
    version?: true
    itemsVersion?: true
  }

  export type GroupsSumAggregateInputType = {
    id?: true
    version?: true
    itemsVersion?: true
  }

  export type GroupsMinAggregateInputType = {
    id?: true
    version?: true
    itemsVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GroupsMaxAggregateInputType = {
    id?: true
    version?: true
    itemsVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GroupsCountAggregateInputType = {
    id?: true
    version?: true
    itemsVersion?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GroupsAggregateArgs = {
    /**
     * Filter which groups to aggregate.
     */
    where?: groupsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of groups to fetch.
     */
    orderBy?: Enumerable<groupsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: groupsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` groups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` groups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned groups
    **/
    _count?: true | GroupsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GroupsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GroupsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroupsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroupsMaxAggregateInputType
  }

  export type GetGroupsAggregateType<T extends GroupsAggregateArgs> = {
        [P in keyof T & keyof AggregateGroups]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroups[P]>
      : GetScalarType<T[P], AggregateGroups[P]>
  }




  export type GroupsGroupByArgs = {
    where?: groupsWhereInput
    orderBy?: Enumerable<groupsOrderByWithAggregationInput>
    by: GroupsScalarFieldEnum[]
    having?: groupsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroupsCountAggregateInputType | true
    _avg?: GroupsAvgAggregateInputType
    _sum?: GroupsSumAggregateInputType
    _min?: GroupsMinAggregateInputType
    _max?: GroupsMaxAggregateInputType
  }


  export type GroupsGroupByOutputType = {
    id: number
    version: number
    itemsVersion: number
    createdAt: Date
    updatedAt: Date
    _count: GroupsCountAggregateOutputType | null
    _avg: GroupsAvgAggregateOutputType | null
    _sum: GroupsSumAggregateOutputType | null
    _min: GroupsMinAggregateOutputType | null
    _max: GroupsMaxAggregateOutputType | null
  }

  type GetGroupsGroupByPayload<T extends GroupsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<GroupsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroupsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroupsGroupByOutputType[P]>
            : GetScalarType<T[P], GroupsGroupByOutputType[P]>
        }
      >
    >


  export type groupsSelect = {
    id?: boolean
    version?: boolean
    itemsVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    items?: boolean | groups$itemsArgs
    alsoKnownAs?: boolean | groups$alsoKnownAsArgs
    _count?: boolean | GroupsCountOutputTypeArgs
  }


  export type groupsInclude = {
    items?: boolean | groups$itemsArgs
    alsoKnownAs?: boolean | groups$alsoKnownAsArgs
    _count?: boolean | GroupsCountOutputTypeArgs
  }

  export type groupsGetPayload<S extends boolean | null | undefined | groupsArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? groups :
    S extends undefined ? never :
    S extends { include: any } & (groupsArgs | groupsFindManyArgs)
    ? groups  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'items' ? Array < itemsGetPayload<S['include'][P]>>  :
        P extends 'alsoKnownAs' ? Array < alsoKnownAsGetPayload<S['include'][P]>>  :
        P extends '_count' ? GroupsCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (groupsArgs | groupsFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'items' ? Array < itemsGetPayload<S['select'][P]>>  :
        P extends 'alsoKnownAs' ? Array < alsoKnownAsGetPayload<S['select'][P]>>  :
        P extends '_count' ? GroupsCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof groups ? groups[P] : never
  } 
      : groups


  type groupsCountArgs = 
    Omit<groupsFindManyArgs, 'select' | 'include'> & {
      select?: GroupsCountAggregateInputType | true
    }

  export interface groupsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Groups that matches the filter.
     * @param {groupsFindUniqueArgs} args - Arguments to find a Groups
     * @example
     * // Get one Groups
     * const groups = await prisma.groups.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends groupsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, groupsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'groups'> extends True ? Prisma__groupsClient<groupsGetPayload<T>> : Prisma__groupsClient<groupsGetPayload<T> | null, null>

    /**
     * Find one Groups that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {groupsFindUniqueOrThrowArgs} args - Arguments to find a Groups
     * @example
     * // Get one Groups
     * const groups = await prisma.groups.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends groupsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, groupsFindUniqueOrThrowArgs>
    ): Prisma__groupsClient<groupsGetPayload<T>>

    /**
     * Find the first Groups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {groupsFindFirstArgs} args - Arguments to find a Groups
     * @example
     * // Get one Groups
     * const groups = await prisma.groups.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends groupsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, groupsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'groups'> extends True ? Prisma__groupsClient<groupsGetPayload<T>> : Prisma__groupsClient<groupsGetPayload<T> | null, null>

    /**
     * Find the first Groups that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {groupsFindFirstOrThrowArgs} args - Arguments to find a Groups
     * @example
     * // Get one Groups
     * const groups = await prisma.groups.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends groupsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, groupsFindFirstOrThrowArgs>
    ): Prisma__groupsClient<groupsGetPayload<T>>

    /**
     * Find zero or more Groups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {groupsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Groups
     * const groups = await prisma.groups.findMany()
     * 
     * // Get first 10 Groups
     * const groups = await prisma.groups.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groupsWithIdOnly = await prisma.groups.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends groupsFindManyArgs>(
      args?: SelectSubset<T, groupsFindManyArgs>
    ): Prisma.PrismaPromise<Array<groupsGetPayload<T>>>

    /**
     * Create a Groups.
     * @param {groupsCreateArgs} args - Arguments to create a Groups.
     * @example
     * // Create one Groups
     * const Groups = await prisma.groups.create({
     *   data: {
     *     // ... data to create a Groups
     *   }
     * })
     * 
    **/
    create<T extends groupsCreateArgs>(
      args: SelectSubset<T, groupsCreateArgs>
    ): Prisma__groupsClient<groupsGetPayload<T>>

    /**
     * Delete a Groups.
     * @param {groupsDeleteArgs} args - Arguments to delete one Groups.
     * @example
     * // Delete one Groups
     * const Groups = await prisma.groups.delete({
     *   where: {
     *     // ... filter to delete one Groups
     *   }
     * })
     * 
    **/
    delete<T extends groupsDeleteArgs>(
      args: SelectSubset<T, groupsDeleteArgs>
    ): Prisma__groupsClient<groupsGetPayload<T>>

    /**
     * Update one Groups.
     * @param {groupsUpdateArgs} args - Arguments to update one Groups.
     * @example
     * // Update one Groups
     * const groups = await prisma.groups.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends groupsUpdateArgs>(
      args: SelectSubset<T, groupsUpdateArgs>
    ): Prisma__groupsClient<groupsGetPayload<T>>

    /**
     * Delete zero or more Groups.
     * @param {groupsDeleteManyArgs} args - Arguments to filter Groups to delete.
     * @example
     * // Delete a few Groups
     * const { count } = await prisma.groups.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends groupsDeleteManyArgs>(
      args?: SelectSubset<T, groupsDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Groups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {groupsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Groups
     * const groups = await prisma.groups.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends groupsUpdateManyArgs>(
      args: SelectSubset<T, groupsUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Groups.
     * @param {groupsUpsertArgs} args - Arguments to update or create a Groups.
     * @example
     * // Update or create a Groups
     * const groups = await prisma.groups.upsert({
     *   create: {
     *     // ... data to create a Groups
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Groups we want to update
     *   }
     * })
    **/
    upsert<T extends groupsUpsertArgs>(
      args: SelectSubset<T, groupsUpsertArgs>
    ): Prisma__groupsClient<groupsGetPayload<T>>

    /**
     * Count the number of Groups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {groupsCountArgs} args - Arguments to filter Groups to count.
     * @example
     * // Count the number of Groups
     * const count = await prisma.groups.count({
     *   where: {
     *     // ... the filter for the Groups we want to count
     *   }
     * })
    **/
    count<T extends groupsCountArgs>(
      args?: Subset<T, groupsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroupsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Groups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GroupsAggregateArgs>(args: Subset<T, GroupsAggregateArgs>): Prisma.PrismaPromise<GetGroupsAggregateType<T>>

    /**
     * Group by Groups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GroupsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroupsGroupByArgs['orderBy'] }
        : { orderBy?: GroupsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GroupsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroupsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for groups.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__groupsClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    items<T extends groups$itemsArgs= {}>(args?: Subset<T, groups$itemsArgs>): Prisma.PrismaPromise<Array<itemsGetPayload<T>>| Null>;

    alsoKnownAs<T extends groups$alsoKnownAsArgs= {}>(args?: Subset<T, groups$alsoKnownAsArgs>): Prisma.PrismaPromise<Array<alsoKnownAsGetPayload<T>>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * groups base type for findUnique actions
   */
  export type groupsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: groupsInclude | null
    /**
     * Filter, which groups to fetch.
     */
    where: groupsWhereUniqueInput
  }

  /**
   * groups findUnique
   */
  export interface groupsFindUniqueArgs extends groupsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * groups findUniqueOrThrow
   */
  export type groupsFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: groupsInclude | null
    /**
     * Filter, which groups to fetch.
     */
    where: groupsWhereUniqueInput
  }


  /**
   * groups base type for findFirst actions
   */
  export type groupsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: groupsInclude | null
    /**
     * Filter, which groups to fetch.
     */
    where?: groupsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of groups to fetch.
     */
    orderBy?: Enumerable<groupsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for groups.
     */
    cursor?: groupsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` groups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` groups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of groups.
     */
    distinct?: Enumerable<GroupsScalarFieldEnum>
  }

  /**
   * groups findFirst
   */
  export interface groupsFindFirstArgs extends groupsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * groups findFirstOrThrow
   */
  export type groupsFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: groupsInclude | null
    /**
     * Filter, which groups to fetch.
     */
    where?: groupsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of groups to fetch.
     */
    orderBy?: Enumerable<groupsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for groups.
     */
    cursor?: groupsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` groups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` groups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of groups.
     */
    distinct?: Enumerable<GroupsScalarFieldEnum>
  }


  /**
   * groups findMany
   */
  export type groupsFindManyArgs = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: groupsInclude | null
    /**
     * Filter, which groups to fetch.
     */
    where?: groupsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of groups to fetch.
     */
    orderBy?: Enumerable<groupsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing groups.
     */
    cursor?: groupsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` groups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` groups.
     */
    skip?: number
    distinct?: Enumerable<GroupsScalarFieldEnum>
  }


  /**
   * groups create
   */
  export type groupsCreateArgs = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: groupsInclude | null
    /**
     * The data needed to create a groups.
     */
    data: XOR<groupsCreateInput, groupsUncheckedCreateInput>
  }


  /**
   * groups update
   */
  export type groupsUpdateArgs = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: groupsInclude | null
    /**
     * The data needed to update a groups.
     */
    data: XOR<groupsUpdateInput, groupsUncheckedUpdateInput>
    /**
     * Choose, which groups to update.
     */
    where: groupsWhereUniqueInput
  }


  /**
   * groups updateMany
   */
  export type groupsUpdateManyArgs = {
    /**
     * The data used to update groups.
     */
    data: XOR<groupsUpdateManyMutationInput, groupsUncheckedUpdateManyInput>
    /**
     * Filter which groups to update
     */
    where?: groupsWhereInput
  }


  /**
   * groups upsert
   */
  export type groupsUpsertArgs = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: groupsInclude | null
    /**
     * The filter to search for the groups to update in case it exists.
     */
    where: groupsWhereUniqueInput
    /**
     * In case the groups found by the `where` argument doesn't exist, create a new groups with this data.
     */
    create: XOR<groupsCreateInput, groupsUncheckedCreateInput>
    /**
     * In case the groups was found with the provided `where` argument, update it with this data.
     */
    update: XOR<groupsUpdateInput, groupsUncheckedUpdateInput>
  }


  /**
   * groups delete
   */
  export type groupsDeleteArgs = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: groupsInclude | null
    /**
     * Filter which groups to delete.
     */
    where: groupsWhereUniqueInput
  }


  /**
   * groups deleteMany
   */
  export type groupsDeleteManyArgs = {
    /**
     * Filter which groups to delete
     */
    where?: groupsWhereInput
  }


  /**
   * groups.items
   */
  export type groups$itemsArgs = {
    /**
     * Select specific fields to fetch from the items
     */
    select?: itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: itemsInclude | null
    where?: itemsWhereInput
    orderBy?: Enumerable<itemsOrderByWithRelationInput>
    cursor?: itemsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<ItemsScalarFieldEnum>
  }


  /**
   * groups.alsoKnownAs
   */
  export type groups$alsoKnownAsArgs = {
    /**
     * Select specific fields to fetch from the alsoKnownAs
     */
    select?: alsoKnownAsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: alsoKnownAsInclude | null
    where?: alsoKnownAsWhereInput
    orderBy?: Enumerable<alsoKnownAsOrderByWithRelationInput>
    cursor?: alsoKnownAsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<AlsoKnownAsScalarFieldEnum>
  }


  /**
   * groups without action
   */
  export type groupsArgs = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: groupsInclude | null
  }



  /**
   * Model items
   */


  export type AggregateItems = {
    _count: ItemsCountAggregateOutputType | null
    _avg: ItemsAvgAggregateOutputType | null
    _sum: ItemsSumAggregateOutputType | null
    _min: ItemsMinAggregateOutputType | null
    _max: ItemsMaxAggregateOutputType | null
  }

  export type ItemsAvgAggregateOutputType = {
    version: number | null
    group_id: number | null
  }

  export type ItemsSumAggregateOutputType = {
    version: number | null
    group_id: number | null
  }

  export type ItemsMinAggregateOutputType = {
    id: string | null
    version: number | null
    data: string | null
    inconsistent: boolean | null
    group_id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    isDeleted: boolean | null
  }

  export type ItemsMaxAggregateOutputType = {
    id: string | null
    version: number | null
    data: string | null
    inconsistent: boolean | null
    group_id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    isDeleted: boolean | null
  }

  export type ItemsCountAggregateOutputType = {
    id: number
    version: number
    data: number
    inconsistent: number
    group_id: number
    createdAt: number
    updatedAt: number
    isDeleted: number
    _all: number
  }


  export type ItemsAvgAggregateInputType = {
    version?: true
    group_id?: true
  }

  export type ItemsSumAggregateInputType = {
    version?: true
    group_id?: true
  }

  export type ItemsMinAggregateInputType = {
    id?: true
    version?: true
    data?: true
    inconsistent?: true
    group_id?: true
    createdAt?: true
    updatedAt?: true
    isDeleted?: true
  }

  export type ItemsMaxAggregateInputType = {
    id?: true
    version?: true
    data?: true
    inconsistent?: true
    group_id?: true
    createdAt?: true
    updatedAt?: true
    isDeleted?: true
  }

  export type ItemsCountAggregateInputType = {
    id?: true
    version?: true
    data?: true
    inconsistent?: true
    group_id?: true
    createdAt?: true
    updatedAt?: true
    isDeleted?: true
    _all?: true
  }

  export type ItemsAggregateArgs = {
    /**
     * Filter which items to aggregate.
     */
    where?: itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of items to fetch.
     */
    orderBy?: Enumerable<itemsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned items
    **/
    _count?: true | ItemsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItemsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItemsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItemsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItemsMaxAggregateInputType
  }

  export type GetItemsAggregateType<T extends ItemsAggregateArgs> = {
        [P in keyof T & keyof AggregateItems]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItems[P]>
      : GetScalarType<T[P], AggregateItems[P]>
  }




  export type ItemsGroupByArgs = {
    where?: itemsWhereInput
    orderBy?: Enumerable<itemsOrderByWithAggregationInput>
    by: ItemsScalarFieldEnum[]
    having?: itemsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItemsCountAggregateInputType | true
    _avg?: ItemsAvgAggregateInputType
    _sum?: ItemsSumAggregateInputType
    _min?: ItemsMinAggregateInputType
    _max?: ItemsMaxAggregateInputType
  }


  export type ItemsGroupByOutputType = {
    id: string
    version: number
    data: string
    inconsistent: boolean
    group_id: number
    createdAt: Date
    updatedAt: Date
    isDeleted: boolean
    _count: ItemsCountAggregateOutputType | null
    _avg: ItemsAvgAggregateOutputType | null
    _sum: ItemsSumAggregateOutputType | null
    _min: ItemsMinAggregateOutputType | null
    _max: ItemsMaxAggregateOutputType | null
  }

  type GetItemsGroupByPayload<T extends ItemsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<ItemsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItemsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItemsGroupByOutputType[P]>
            : GetScalarType<T[P], ItemsGroupByOutputType[P]>
        }
      >
    >


  export type itemsSelect = {
    id?: boolean
    version?: boolean
    data?: boolean
    inconsistent?: boolean
    group_id?: boolean
    group?: boolean | groupsArgs
    createdAt?: boolean
    updatedAt?: boolean
    isDeleted?: boolean
    collection_items?: boolean | items$collection_itemsArgs
    alsoKnownAs?: boolean | items$alsoKnownAsArgs
    _count?: boolean | ItemsCountOutputTypeArgs
  }


  export type itemsInclude = {
    group?: boolean | groupsArgs
    collection_items?: boolean | items$collection_itemsArgs
    alsoKnownAs?: boolean | items$alsoKnownAsArgs
    _count?: boolean | ItemsCountOutputTypeArgs
  }

  export type itemsGetPayload<S extends boolean | null | undefined | itemsArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? items :
    S extends undefined ? never :
    S extends { include: any } & (itemsArgs | itemsFindManyArgs)
    ? items  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'group' ? groupsGetPayload<S['include'][P]> :
        P extends 'collection_items' ? Array < collection_itemsGetPayload<S['include'][P]>>  :
        P extends 'alsoKnownAs' ? Array < alsoKnownAsGetPayload<S['include'][P]>>  :
        P extends '_count' ? ItemsCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (itemsArgs | itemsFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'group' ? groupsGetPayload<S['select'][P]> :
        P extends 'collection_items' ? Array < collection_itemsGetPayload<S['select'][P]>>  :
        P extends 'alsoKnownAs' ? Array < alsoKnownAsGetPayload<S['select'][P]>>  :
        P extends '_count' ? ItemsCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof items ? items[P] : never
  } 
      : items


  type itemsCountArgs = 
    Omit<itemsFindManyArgs, 'select' | 'include'> & {
      select?: ItemsCountAggregateInputType | true
    }

  export interface itemsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Items that matches the filter.
     * @param {itemsFindUniqueArgs} args - Arguments to find a Items
     * @example
     * // Get one Items
     * const items = await prisma.items.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends itemsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, itemsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'items'> extends True ? Prisma__itemsClient<itemsGetPayload<T>> : Prisma__itemsClient<itemsGetPayload<T> | null, null>

    /**
     * Find one Items that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {itemsFindUniqueOrThrowArgs} args - Arguments to find a Items
     * @example
     * // Get one Items
     * const items = await prisma.items.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends itemsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, itemsFindUniqueOrThrowArgs>
    ): Prisma__itemsClient<itemsGetPayload<T>>

    /**
     * Find the first Items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {itemsFindFirstArgs} args - Arguments to find a Items
     * @example
     * // Get one Items
     * const items = await prisma.items.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends itemsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, itemsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'items'> extends True ? Prisma__itemsClient<itemsGetPayload<T>> : Prisma__itemsClient<itemsGetPayload<T> | null, null>

    /**
     * Find the first Items that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {itemsFindFirstOrThrowArgs} args - Arguments to find a Items
     * @example
     * // Get one Items
     * const items = await prisma.items.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends itemsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, itemsFindFirstOrThrowArgs>
    ): Prisma__itemsClient<itemsGetPayload<T>>

    /**
     * Find zero or more Items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {itemsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Items
     * const items = await prisma.items.findMany()
     * 
     * // Get first 10 Items
     * const items = await prisma.items.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itemsWithIdOnly = await prisma.items.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends itemsFindManyArgs>(
      args?: SelectSubset<T, itemsFindManyArgs>
    ): Prisma.PrismaPromise<Array<itemsGetPayload<T>>>

    /**
     * Create a Items.
     * @param {itemsCreateArgs} args - Arguments to create a Items.
     * @example
     * // Create one Items
     * const Items = await prisma.items.create({
     *   data: {
     *     // ... data to create a Items
     *   }
     * })
     * 
    **/
    create<T extends itemsCreateArgs>(
      args: SelectSubset<T, itemsCreateArgs>
    ): Prisma__itemsClient<itemsGetPayload<T>>

    /**
     * Delete a Items.
     * @param {itemsDeleteArgs} args - Arguments to delete one Items.
     * @example
     * // Delete one Items
     * const Items = await prisma.items.delete({
     *   where: {
     *     // ... filter to delete one Items
     *   }
     * })
     * 
    **/
    delete<T extends itemsDeleteArgs>(
      args: SelectSubset<T, itemsDeleteArgs>
    ): Prisma__itemsClient<itemsGetPayload<T>>

    /**
     * Update one Items.
     * @param {itemsUpdateArgs} args - Arguments to update one Items.
     * @example
     * // Update one Items
     * const items = await prisma.items.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends itemsUpdateArgs>(
      args: SelectSubset<T, itemsUpdateArgs>
    ): Prisma__itemsClient<itemsGetPayload<T>>

    /**
     * Delete zero or more Items.
     * @param {itemsDeleteManyArgs} args - Arguments to filter Items to delete.
     * @example
     * // Delete a few Items
     * const { count } = await prisma.items.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends itemsDeleteManyArgs>(
      args?: SelectSubset<T, itemsDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {itemsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Items
     * const items = await prisma.items.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends itemsUpdateManyArgs>(
      args: SelectSubset<T, itemsUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Items.
     * @param {itemsUpsertArgs} args - Arguments to update or create a Items.
     * @example
     * // Update or create a Items
     * const items = await prisma.items.upsert({
     *   create: {
     *     // ... data to create a Items
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Items we want to update
     *   }
     * })
    **/
    upsert<T extends itemsUpsertArgs>(
      args: SelectSubset<T, itemsUpsertArgs>
    ): Prisma__itemsClient<itemsGetPayload<T>>

    /**
     * Count the number of Items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {itemsCountArgs} args - Arguments to filter Items to count.
     * @example
     * // Count the number of Items
     * const count = await prisma.items.count({
     *   where: {
     *     // ... the filter for the Items we want to count
     *   }
     * })
    **/
    count<T extends itemsCountArgs>(
      args?: Subset<T, itemsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItemsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ItemsAggregateArgs>(args: Subset<T, ItemsAggregateArgs>): Prisma.PrismaPromise<GetItemsAggregateType<T>>

    /**
     * Group by Items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ItemsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItemsGroupByArgs['orderBy'] }
        : { orderBy?: ItemsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ItemsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for items.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__itemsClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    group<T extends groupsArgs= {}>(args?: Subset<T, groupsArgs>): Prisma__groupsClient<groupsGetPayload<T> | Null>;

    collection_items<T extends items$collection_itemsArgs= {}>(args?: Subset<T, items$collection_itemsArgs>): Prisma.PrismaPromise<Array<collection_itemsGetPayload<T>>| Null>;

    alsoKnownAs<T extends items$alsoKnownAsArgs= {}>(args?: Subset<T, items$alsoKnownAsArgs>): Prisma.PrismaPromise<Array<alsoKnownAsGetPayload<T>>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * items base type for findUnique actions
   */
  export type itemsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the items
     */
    select?: itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: itemsInclude | null
    /**
     * Filter, which items to fetch.
     */
    where: itemsWhereUniqueInput
  }

  /**
   * items findUnique
   */
  export interface itemsFindUniqueArgs extends itemsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * items findUniqueOrThrow
   */
  export type itemsFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the items
     */
    select?: itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: itemsInclude | null
    /**
     * Filter, which items to fetch.
     */
    where: itemsWhereUniqueInput
  }


  /**
   * items base type for findFirst actions
   */
  export type itemsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the items
     */
    select?: itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: itemsInclude | null
    /**
     * Filter, which items to fetch.
     */
    where?: itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of items to fetch.
     */
    orderBy?: Enumerable<itemsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for items.
     */
    cursor?: itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of items.
     */
    distinct?: Enumerable<ItemsScalarFieldEnum>
  }

  /**
   * items findFirst
   */
  export interface itemsFindFirstArgs extends itemsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * items findFirstOrThrow
   */
  export type itemsFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the items
     */
    select?: itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: itemsInclude | null
    /**
     * Filter, which items to fetch.
     */
    where?: itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of items to fetch.
     */
    orderBy?: Enumerable<itemsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for items.
     */
    cursor?: itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of items.
     */
    distinct?: Enumerable<ItemsScalarFieldEnum>
  }


  /**
   * items findMany
   */
  export type itemsFindManyArgs = {
    /**
     * Select specific fields to fetch from the items
     */
    select?: itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: itemsInclude | null
    /**
     * Filter, which items to fetch.
     */
    where?: itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of items to fetch.
     */
    orderBy?: Enumerable<itemsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing items.
     */
    cursor?: itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` items.
     */
    skip?: number
    distinct?: Enumerable<ItemsScalarFieldEnum>
  }


  /**
   * items create
   */
  export type itemsCreateArgs = {
    /**
     * Select specific fields to fetch from the items
     */
    select?: itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: itemsInclude | null
    /**
     * The data needed to create a items.
     */
    data: XOR<itemsCreateInput, itemsUncheckedCreateInput>
  }


  /**
   * items update
   */
  export type itemsUpdateArgs = {
    /**
     * Select specific fields to fetch from the items
     */
    select?: itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: itemsInclude | null
    /**
     * The data needed to update a items.
     */
    data: XOR<itemsUpdateInput, itemsUncheckedUpdateInput>
    /**
     * Choose, which items to update.
     */
    where: itemsWhereUniqueInput
  }


  /**
   * items updateMany
   */
  export type itemsUpdateManyArgs = {
    /**
     * The data used to update items.
     */
    data: XOR<itemsUpdateManyMutationInput, itemsUncheckedUpdateManyInput>
    /**
     * Filter which items to update
     */
    where?: itemsWhereInput
  }


  /**
   * items upsert
   */
  export type itemsUpsertArgs = {
    /**
     * Select specific fields to fetch from the items
     */
    select?: itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: itemsInclude | null
    /**
     * The filter to search for the items to update in case it exists.
     */
    where: itemsWhereUniqueInput
    /**
     * In case the items found by the `where` argument doesn't exist, create a new items with this data.
     */
    create: XOR<itemsCreateInput, itemsUncheckedCreateInput>
    /**
     * In case the items was found with the provided `where` argument, update it with this data.
     */
    update: XOR<itemsUpdateInput, itemsUncheckedUpdateInput>
  }


  /**
   * items delete
   */
  export type itemsDeleteArgs = {
    /**
     * Select specific fields to fetch from the items
     */
    select?: itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: itemsInclude | null
    /**
     * Filter which items to delete.
     */
    where: itemsWhereUniqueInput
  }


  /**
   * items deleteMany
   */
  export type itemsDeleteManyArgs = {
    /**
     * Filter which items to delete
     */
    where?: itemsWhereInput
  }


  /**
   * items.collection_items
   */
  export type items$collection_itemsArgs = {
    /**
     * Select specific fields to fetch from the collection_items
     */
    select?: collection_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collection_itemsInclude | null
    where?: collection_itemsWhereInput
    orderBy?: Enumerable<collection_itemsOrderByWithRelationInput>
    cursor?: collection_itemsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<Collection_itemsScalarFieldEnum>
  }


  /**
   * items.alsoKnownAs
   */
  export type items$alsoKnownAsArgs = {
    /**
     * Select specific fields to fetch from the alsoKnownAs
     */
    select?: alsoKnownAsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: alsoKnownAsInclude | null
    where?: alsoKnownAsWhereInput
    orderBy?: Enumerable<alsoKnownAsOrderByWithRelationInput>
    cursor?: alsoKnownAsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<AlsoKnownAsScalarFieldEnum>
  }


  /**
   * items without action
   */
  export type itemsArgs = {
    /**
     * Select specific fields to fetch from the items
     */
    select?: itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: itemsInclude | null
  }



  /**
   * Model collections
   */


  export type AggregateCollections = {
    _count: CollectionsCountAggregateOutputType | null
    _min: CollectionsMinAggregateOutputType | null
    _max: CollectionsMaxAggregateOutputType | null
  }

  export type CollectionsMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CollectionsMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CollectionsCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CollectionsMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CollectionsMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CollectionsCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CollectionsAggregateArgs = {
    /**
     * Filter which collections to aggregate.
     */
    where?: collectionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of collections to fetch.
     */
    orderBy?: Enumerable<collectionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: collectionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned collections
    **/
    _count?: true | CollectionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CollectionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CollectionsMaxAggregateInputType
  }

  export type GetCollectionsAggregateType<T extends CollectionsAggregateArgs> = {
        [P in keyof T & keyof AggregateCollections]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCollections[P]>
      : GetScalarType<T[P], AggregateCollections[P]>
  }




  export type CollectionsGroupByArgs = {
    where?: collectionsWhereInput
    orderBy?: Enumerable<collectionsOrderByWithAggregationInput>
    by: CollectionsScalarFieldEnum[]
    having?: collectionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CollectionsCountAggregateInputType | true
    _min?: CollectionsMinAggregateInputType
    _max?: CollectionsMaxAggregateInputType
  }


  export type CollectionsGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    _count: CollectionsCountAggregateOutputType | null
    _min: CollectionsMinAggregateOutputType | null
    _max: CollectionsMaxAggregateOutputType | null
  }

  type GetCollectionsGroupByPayload<T extends CollectionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<CollectionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CollectionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CollectionsGroupByOutputType[P]>
            : GetScalarType<T[P], CollectionsGroupByOutputType[P]>
        }
      >
    >


  export type collectionsSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    collection_items?: boolean | collections$collection_itemsArgs
    _count?: boolean | CollectionsCountOutputTypeArgs
  }


  export type collectionsInclude = {
    collection_items?: boolean | collections$collection_itemsArgs
    _count?: boolean | CollectionsCountOutputTypeArgs
  }

  export type collectionsGetPayload<S extends boolean | null | undefined | collectionsArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? collections :
    S extends undefined ? never :
    S extends { include: any } & (collectionsArgs | collectionsFindManyArgs)
    ? collections  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'collection_items' ? Array < collection_itemsGetPayload<S['include'][P]>>  :
        P extends '_count' ? CollectionsCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (collectionsArgs | collectionsFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'collection_items' ? Array < collection_itemsGetPayload<S['select'][P]>>  :
        P extends '_count' ? CollectionsCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof collections ? collections[P] : never
  } 
      : collections


  type collectionsCountArgs = 
    Omit<collectionsFindManyArgs, 'select' | 'include'> & {
      select?: CollectionsCountAggregateInputType | true
    }

  export interface collectionsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Collections that matches the filter.
     * @param {collectionsFindUniqueArgs} args - Arguments to find a Collections
     * @example
     * // Get one Collections
     * const collections = await prisma.collections.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends collectionsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, collectionsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'collections'> extends True ? Prisma__collectionsClient<collectionsGetPayload<T>> : Prisma__collectionsClient<collectionsGetPayload<T> | null, null>

    /**
     * Find one Collections that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {collectionsFindUniqueOrThrowArgs} args - Arguments to find a Collections
     * @example
     * // Get one Collections
     * const collections = await prisma.collections.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends collectionsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, collectionsFindUniqueOrThrowArgs>
    ): Prisma__collectionsClient<collectionsGetPayload<T>>

    /**
     * Find the first Collections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {collectionsFindFirstArgs} args - Arguments to find a Collections
     * @example
     * // Get one Collections
     * const collections = await prisma.collections.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends collectionsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, collectionsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'collections'> extends True ? Prisma__collectionsClient<collectionsGetPayload<T>> : Prisma__collectionsClient<collectionsGetPayload<T> | null, null>

    /**
     * Find the first Collections that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {collectionsFindFirstOrThrowArgs} args - Arguments to find a Collections
     * @example
     * // Get one Collections
     * const collections = await prisma.collections.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends collectionsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, collectionsFindFirstOrThrowArgs>
    ): Prisma__collectionsClient<collectionsGetPayload<T>>

    /**
     * Find zero or more Collections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {collectionsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Collections
     * const collections = await prisma.collections.findMany()
     * 
     * // Get first 10 Collections
     * const collections = await prisma.collections.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const collectionsWithIdOnly = await prisma.collections.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends collectionsFindManyArgs>(
      args?: SelectSubset<T, collectionsFindManyArgs>
    ): Prisma.PrismaPromise<Array<collectionsGetPayload<T>>>

    /**
     * Create a Collections.
     * @param {collectionsCreateArgs} args - Arguments to create a Collections.
     * @example
     * // Create one Collections
     * const Collections = await prisma.collections.create({
     *   data: {
     *     // ... data to create a Collections
     *   }
     * })
     * 
    **/
    create<T extends collectionsCreateArgs>(
      args: SelectSubset<T, collectionsCreateArgs>
    ): Prisma__collectionsClient<collectionsGetPayload<T>>

    /**
     * Delete a Collections.
     * @param {collectionsDeleteArgs} args - Arguments to delete one Collections.
     * @example
     * // Delete one Collections
     * const Collections = await prisma.collections.delete({
     *   where: {
     *     // ... filter to delete one Collections
     *   }
     * })
     * 
    **/
    delete<T extends collectionsDeleteArgs>(
      args: SelectSubset<T, collectionsDeleteArgs>
    ): Prisma__collectionsClient<collectionsGetPayload<T>>

    /**
     * Update one Collections.
     * @param {collectionsUpdateArgs} args - Arguments to update one Collections.
     * @example
     * // Update one Collections
     * const collections = await prisma.collections.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends collectionsUpdateArgs>(
      args: SelectSubset<T, collectionsUpdateArgs>
    ): Prisma__collectionsClient<collectionsGetPayload<T>>

    /**
     * Delete zero or more Collections.
     * @param {collectionsDeleteManyArgs} args - Arguments to filter Collections to delete.
     * @example
     * // Delete a few Collections
     * const { count } = await prisma.collections.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends collectionsDeleteManyArgs>(
      args?: SelectSubset<T, collectionsDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Collections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {collectionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Collections
     * const collections = await prisma.collections.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends collectionsUpdateManyArgs>(
      args: SelectSubset<T, collectionsUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Collections.
     * @param {collectionsUpsertArgs} args - Arguments to update or create a Collections.
     * @example
     * // Update or create a Collections
     * const collections = await prisma.collections.upsert({
     *   create: {
     *     // ... data to create a Collections
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Collections we want to update
     *   }
     * })
    **/
    upsert<T extends collectionsUpsertArgs>(
      args: SelectSubset<T, collectionsUpsertArgs>
    ): Prisma__collectionsClient<collectionsGetPayload<T>>

    /**
     * Count the number of Collections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {collectionsCountArgs} args - Arguments to filter Collections to count.
     * @example
     * // Count the number of Collections
     * const count = await prisma.collections.count({
     *   where: {
     *     // ... the filter for the Collections we want to count
     *   }
     * })
    **/
    count<T extends collectionsCountArgs>(
      args?: Subset<T, collectionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CollectionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Collections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CollectionsAggregateArgs>(args: Subset<T, CollectionsAggregateArgs>): Prisma.PrismaPromise<GetCollectionsAggregateType<T>>

    /**
     * Group by Collections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CollectionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CollectionsGroupByArgs['orderBy'] }
        : { orderBy?: CollectionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CollectionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCollectionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for collections.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__collectionsClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    collection_items<T extends collections$collection_itemsArgs= {}>(args?: Subset<T, collections$collection_itemsArgs>): Prisma.PrismaPromise<Array<collection_itemsGetPayload<T>>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * collections base type for findUnique actions
   */
  export type collectionsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the collections
     */
    select?: collectionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collectionsInclude | null
    /**
     * Filter, which collections to fetch.
     */
    where: collectionsWhereUniqueInput
  }

  /**
   * collections findUnique
   */
  export interface collectionsFindUniqueArgs extends collectionsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * collections findUniqueOrThrow
   */
  export type collectionsFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the collections
     */
    select?: collectionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collectionsInclude | null
    /**
     * Filter, which collections to fetch.
     */
    where: collectionsWhereUniqueInput
  }


  /**
   * collections base type for findFirst actions
   */
  export type collectionsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the collections
     */
    select?: collectionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collectionsInclude | null
    /**
     * Filter, which collections to fetch.
     */
    where?: collectionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of collections to fetch.
     */
    orderBy?: Enumerable<collectionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for collections.
     */
    cursor?: collectionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of collections.
     */
    distinct?: Enumerable<CollectionsScalarFieldEnum>
  }

  /**
   * collections findFirst
   */
  export interface collectionsFindFirstArgs extends collectionsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * collections findFirstOrThrow
   */
  export type collectionsFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the collections
     */
    select?: collectionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collectionsInclude | null
    /**
     * Filter, which collections to fetch.
     */
    where?: collectionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of collections to fetch.
     */
    orderBy?: Enumerable<collectionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for collections.
     */
    cursor?: collectionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of collections.
     */
    distinct?: Enumerable<CollectionsScalarFieldEnum>
  }


  /**
   * collections findMany
   */
  export type collectionsFindManyArgs = {
    /**
     * Select specific fields to fetch from the collections
     */
    select?: collectionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collectionsInclude | null
    /**
     * Filter, which collections to fetch.
     */
    where?: collectionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of collections to fetch.
     */
    orderBy?: Enumerable<collectionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing collections.
     */
    cursor?: collectionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` collections.
     */
    skip?: number
    distinct?: Enumerable<CollectionsScalarFieldEnum>
  }


  /**
   * collections create
   */
  export type collectionsCreateArgs = {
    /**
     * Select specific fields to fetch from the collections
     */
    select?: collectionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collectionsInclude | null
    /**
     * The data needed to create a collections.
     */
    data: XOR<collectionsCreateInput, collectionsUncheckedCreateInput>
  }


  /**
   * collections update
   */
  export type collectionsUpdateArgs = {
    /**
     * Select specific fields to fetch from the collections
     */
    select?: collectionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collectionsInclude | null
    /**
     * The data needed to update a collections.
     */
    data: XOR<collectionsUpdateInput, collectionsUncheckedUpdateInput>
    /**
     * Choose, which collections to update.
     */
    where: collectionsWhereUniqueInput
  }


  /**
   * collections updateMany
   */
  export type collectionsUpdateManyArgs = {
    /**
     * The data used to update collections.
     */
    data: XOR<collectionsUpdateManyMutationInput, collectionsUncheckedUpdateManyInput>
    /**
     * Filter which collections to update
     */
    where?: collectionsWhereInput
  }


  /**
   * collections upsert
   */
  export type collectionsUpsertArgs = {
    /**
     * Select specific fields to fetch from the collections
     */
    select?: collectionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collectionsInclude | null
    /**
     * The filter to search for the collections to update in case it exists.
     */
    where: collectionsWhereUniqueInput
    /**
     * In case the collections found by the `where` argument doesn't exist, create a new collections with this data.
     */
    create: XOR<collectionsCreateInput, collectionsUncheckedCreateInput>
    /**
     * In case the collections was found with the provided `where` argument, update it with this data.
     */
    update: XOR<collectionsUpdateInput, collectionsUncheckedUpdateInput>
  }


  /**
   * collections delete
   */
  export type collectionsDeleteArgs = {
    /**
     * Select specific fields to fetch from the collections
     */
    select?: collectionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collectionsInclude | null
    /**
     * Filter which collections to delete.
     */
    where: collectionsWhereUniqueInput
  }


  /**
   * collections deleteMany
   */
  export type collectionsDeleteManyArgs = {
    /**
     * Filter which collections to delete
     */
    where?: collectionsWhereInput
  }


  /**
   * collections.collection_items
   */
  export type collections$collection_itemsArgs = {
    /**
     * Select specific fields to fetch from the collection_items
     */
    select?: collection_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collection_itemsInclude | null
    where?: collection_itemsWhereInput
    orderBy?: Enumerable<collection_itemsOrderByWithRelationInput>
    cursor?: collection_itemsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<Collection_itemsScalarFieldEnum>
  }


  /**
   * collections without action
   */
  export type collectionsArgs = {
    /**
     * Select specific fields to fetch from the collections
     */
    select?: collectionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collectionsInclude | null
  }



  /**
   * Model collection_items
   */


  export type AggregateCollection_items = {
    _count: Collection_itemsCountAggregateOutputType | null
    _avg: Collection_itemsAvgAggregateOutputType | null
    _sum: Collection_itemsSumAggregateOutputType | null
    _min: Collection_itemsMinAggregateOutputType | null
    _max: Collection_itemsMaxAggregateOutputType | null
  }

  export type Collection_itemsAvgAggregateOutputType = {
    id: number | null
  }

  export type Collection_itemsSumAggregateOutputType = {
    id: number | null
  }

  export type Collection_itemsMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    collection_id: string | null
    item_id: string | null
  }

  export type Collection_itemsMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    collection_id: string | null
    item_id: string | null
  }

  export type Collection_itemsCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    collection_id: number
    item_id: number
    _all: number
  }


  export type Collection_itemsAvgAggregateInputType = {
    id?: true
  }

  export type Collection_itemsSumAggregateInputType = {
    id?: true
  }

  export type Collection_itemsMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    collection_id?: true
    item_id?: true
  }

  export type Collection_itemsMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    collection_id?: true
    item_id?: true
  }

  export type Collection_itemsCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    collection_id?: true
    item_id?: true
    _all?: true
  }

  export type Collection_itemsAggregateArgs = {
    /**
     * Filter which collection_items to aggregate.
     */
    where?: collection_itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of collection_items to fetch.
     */
    orderBy?: Enumerable<collection_itemsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: collection_itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` collection_items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` collection_items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned collection_items
    **/
    _count?: true | Collection_itemsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Collection_itemsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Collection_itemsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Collection_itemsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Collection_itemsMaxAggregateInputType
  }

  export type GetCollection_itemsAggregateType<T extends Collection_itemsAggregateArgs> = {
        [P in keyof T & keyof AggregateCollection_items]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCollection_items[P]>
      : GetScalarType<T[P], AggregateCollection_items[P]>
  }




  export type Collection_itemsGroupByArgs = {
    where?: collection_itemsWhereInput
    orderBy?: Enumerable<collection_itemsOrderByWithAggregationInput>
    by: Collection_itemsScalarFieldEnum[]
    having?: collection_itemsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Collection_itemsCountAggregateInputType | true
    _avg?: Collection_itemsAvgAggregateInputType
    _sum?: Collection_itemsSumAggregateInputType
    _min?: Collection_itemsMinAggregateInputType
    _max?: Collection_itemsMaxAggregateInputType
  }


  export type Collection_itemsGroupByOutputType = {
    id: number
    createdAt: Date
    updatedAt: Date
    collection_id: string
    item_id: string
    _count: Collection_itemsCountAggregateOutputType | null
    _avg: Collection_itemsAvgAggregateOutputType | null
    _sum: Collection_itemsSumAggregateOutputType | null
    _min: Collection_itemsMinAggregateOutputType | null
    _max: Collection_itemsMaxAggregateOutputType | null
  }

  type GetCollection_itemsGroupByPayload<T extends Collection_itemsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<Collection_itemsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Collection_itemsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Collection_itemsGroupByOutputType[P]>
            : GetScalarType<T[P], Collection_itemsGroupByOutputType[P]>
        }
      >
    >


  export type collection_itemsSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    collection_id?: boolean
    collection?: boolean | collectionsArgs
    item_id?: boolean
    item?: boolean | itemsArgs
  }


  export type collection_itemsInclude = {
    collection?: boolean | collectionsArgs
    item?: boolean | itemsArgs
  }

  export type collection_itemsGetPayload<S extends boolean | null | undefined | collection_itemsArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? collection_items :
    S extends undefined ? never :
    S extends { include: any } & (collection_itemsArgs | collection_itemsFindManyArgs)
    ? collection_items  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'collection' ? collectionsGetPayload<S['include'][P]> :
        P extends 'item' ? itemsGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (collection_itemsArgs | collection_itemsFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'collection' ? collectionsGetPayload<S['select'][P]> :
        P extends 'item' ? itemsGetPayload<S['select'][P]> :  P extends keyof collection_items ? collection_items[P] : never
  } 
      : collection_items


  type collection_itemsCountArgs = 
    Omit<collection_itemsFindManyArgs, 'select' | 'include'> & {
      select?: Collection_itemsCountAggregateInputType | true
    }

  export interface collection_itemsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Collection_items that matches the filter.
     * @param {collection_itemsFindUniqueArgs} args - Arguments to find a Collection_items
     * @example
     * // Get one Collection_items
     * const collection_items = await prisma.collection_items.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends collection_itemsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, collection_itemsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'collection_items'> extends True ? Prisma__collection_itemsClient<collection_itemsGetPayload<T>> : Prisma__collection_itemsClient<collection_itemsGetPayload<T> | null, null>

    /**
     * Find one Collection_items that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {collection_itemsFindUniqueOrThrowArgs} args - Arguments to find a Collection_items
     * @example
     * // Get one Collection_items
     * const collection_items = await prisma.collection_items.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends collection_itemsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, collection_itemsFindUniqueOrThrowArgs>
    ): Prisma__collection_itemsClient<collection_itemsGetPayload<T>>

    /**
     * Find the first Collection_items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {collection_itemsFindFirstArgs} args - Arguments to find a Collection_items
     * @example
     * // Get one Collection_items
     * const collection_items = await prisma.collection_items.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends collection_itemsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, collection_itemsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'collection_items'> extends True ? Prisma__collection_itemsClient<collection_itemsGetPayload<T>> : Prisma__collection_itemsClient<collection_itemsGetPayload<T> | null, null>

    /**
     * Find the first Collection_items that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {collection_itemsFindFirstOrThrowArgs} args - Arguments to find a Collection_items
     * @example
     * // Get one Collection_items
     * const collection_items = await prisma.collection_items.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends collection_itemsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, collection_itemsFindFirstOrThrowArgs>
    ): Prisma__collection_itemsClient<collection_itemsGetPayload<T>>

    /**
     * Find zero or more Collection_items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {collection_itemsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Collection_items
     * const collection_items = await prisma.collection_items.findMany()
     * 
     * // Get first 10 Collection_items
     * const collection_items = await prisma.collection_items.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const collection_itemsWithIdOnly = await prisma.collection_items.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends collection_itemsFindManyArgs>(
      args?: SelectSubset<T, collection_itemsFindManyArgs>
    ): Prisma.PrismaPromise<Array<collection_itemsGetPayload<T>>>

    /**
     * Create a Collection_items.
     * @param {collection_itemsCreateArgs} args - Arguments to create a Collection_items.
     * @example
     * // Create one Collection_items
     * const Collection_items = await prisma.collection_items.create({
     *   data: {
     *     // ... data to create a Collection_items
     *   }
     * })
     * 
    **/
    create<T extends collection_itemsCreateArgs>(
      args: SelectSubset<T, collection_itemsCreateArgs>
    ): Prisma__collection_itemsClient<collection_itemsGetPayload<T>>

    /**
     * Delete a Collection_items.
     * @param {collection_itemsDeleteArgs} args - Arguments to delete one Collection_items.
     * @example
     * // Delete one Collection_items
     * const Collection_items = await prisma.collection_items.delete({
     *   where: {
     *     // ... filter to delete one Collection_items
     *   }
     * })
     * 
    **/
    delete<T extends collection_itemsDeleteArgs>(
      args: SelectSubset<T, collection_itemsDeleteArgs>
    ): Prisma__collection_itemsClient<collection_itemsGetPayload<T>>

    /**
     * Update one Collection_items.
     * @param {collection_itemsUpdateArgs} args - Arguments to update one Collection_items.
     * @example
     * // Update one Collection_items
     * const collection_items = await prisma.collection_items.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends collection_itemsUpdateArgs>(
      args: SelectSubset<T, collection_itemsUpdateArgs>
    ): Prisma__collection_itemsClient<collection_itemsGetPayload<T>>

    /**
     * Delete zero or more Collection_items.
     * @param {collection_itemsDeleteManyArgs} args - Arguments to filter Collection_items to delete.
     * @example
     * // Delete a few Collection_items
     * const { count } = await prisma.collection_items.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends collection_itemsDeleteManyArgs>(
      args?: SelectSubset<T, collection_itemsDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Collection_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {collection_itemsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Collection_items
     * const collection_items = await prisma.collection_items.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends collection_itemsUpdateManyArgs>(
      args: SelectSubset<T, collection_itemsUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Collection_items.
     * @param {collection_itemsUpsertArgs} args - Arguments to update or create a Collection_items.
     * @example
     * // Update or create a Collection_items
     * const collection_items = await prisma.collection_items.upsert({
     *   create: {
     *     // ... data to create a Collection_items
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Collection_items we want to update
     *   }
     * })
    **/
    upsert<T extends collection_itemsUpsertArgs>(
      args: SelectSubset<T, collection_itemsUpsertArgs>
    ): Prisma__collection_itemsClient<collection_itemsGetPayload<T>>

    /**
     * Count the number of Collection_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {collection_itemsCountArgs} args - Arguments to filter Collection_items to count.
     * @example
     * // Count the number of Collection_items
     * const count = await prisma.collection_items.count({
     *   where: {
     *     // ... the filter for the Collection_items we want to count
     *   }
     * })
    **/
    count<T extends collection_itemsCountArgs>(
      args?: Subset<T, collection_itemsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Collection_itemsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Collection_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Collection_itemsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Collection_itemsAggregateArgs>(args: Subset<T, Collection_itemsAggregateArgs>): Prisma.PrismaPromise<GetCollection_itemsAggregateType<T>>

    /**
     * Group by Collection_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Collection_itemsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends Collection_itemsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Collection_itemsGroupByArgs['orderBy'] }
        : { orderBy?: Collection_itemsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, Collection_itemsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCollection_itemsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for collection_items.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__collection_itemsClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    collection<T extends collectionsArgs= {}>(args?: Subset<T, collectionsArgs>): Prisma__collectionsClient<collectionsGetPayload<T> | Null>;

    item<T extends itemsArgs= {}>(args?: Subset<T, itemsArgs>): Prisma__itemsClient<itemsGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * collection_items base type for findUnique actions
   */
  export type collection_itemsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the collection_items
     */
    select?: collection_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collection_itemsInclude | null
    /**
     * Filter, which collection_items to fetch.
     */
    where: collection_itemsWhereUniqueInput
  }

  /**
   * collection_items findUnique
   */
  export interface collection_itemsFindUniqueArgs extends collection_itemsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * collection_items findUniqueOrThrow
   */
  export type collection_itemsFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the collection_items
     */
    select?: collection_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collection_itemsInclude | null
    /**
     * Filter, which collection_items to fetch.
     */
    where: collection_itemsWhereUniqueInput
  }


  /**
   * collection_items base type for findFirst actions
   */
  export type collection_itemsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the collection_items
     */
    select?: collection_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collection_itemsInclude | null
    /**
     * Filter, which collection_items to fetch.
     */
    where?: collection_itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of collection_items to fetch.
     */
    orderBy?: Enumerable<collection_itemsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for collection_items.
     */
    cursor?: collection_itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` collection_items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` collection_items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of collection_items.
     */
    distinct?: Enumerable<Collection_itemsScalarFieldEnum>
  }

  /**
   * collection_items findFirst
   */
  export interface collection_itemsFindFirstArgs extends collection_itemsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * collection_items findFirstOrThrow
   */
  export type collection_itemsFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the collection_items
     */
    select?: collection_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collection_itemsInclude | null
    /**
     * Filter, which collection_items to fetch.
     */
    where?: collection_itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of collection_items to fetch.
     */
    orderBy?: Enumerable<collection_itemsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for collection_items.
     */
    cursor?: collection_itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` collection_items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` collection_items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of collection_items.
     */
    distinct?: Enumerable<Collection_itemsScalarFieldEnum>
  }


  /**
   * collection_items findMany
   */
  export type collection_itemsFindManyArgs = {
    /**
     * Select specific fields to fetch from the collection_items
     */
    select?: collection_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collection_itemsInclude | null
    /**
     * Filter, which collection_items to fetch.
     */
    where?: collection_itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of collection_items to fetch.
     */
    orderBy?: Enumerable<collection_itemsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing collection_items.
     */
    cursor?: collection_itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` collection_items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` collection_items.
     */
    skip?: number
    distinct?: Enumerable<Collection_itemsScalarFieldEnum>
  }


  /**
   * collection_items create
   */
  export type collection_itemsCreateArgs = {
    /**
     * Select specific fields to fetch from the collection_items
     */
    select?: collection_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collection_itemsInclude | null
    /**
     * The data needed to create a collection_items.
     */
    data: XOR<collection_itemsCreateInput, collection_itemsUncheckedCreateInput>
  }


  /**
   * collection_items update
   */
  export type collection_itemsUpdateArgs = {
    /**
     * Select specific fields to fetch from the collection_items
     */
    select?: collection_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collection_itemsInclude | null
    /**
     * The data needed to update a collection_items.
     */
    data: XOR<collection_itemsUpdateInput, collection_itemsUncheckedUpdateInput>
    /**
     * Choose, which collection_items to update.
     */
    where: collection_itemsWhereUniqueInput
  }


  /**
   * collection_items updateMany
   */
  export type collection_itemsUpdateManyArgs = {
    /**
     * The data used to update collection_items.
     */
    data: XOR<collection_itemsUpdateManyMutationInput, collection_itemsUncheckedUpdateManyInput>
    /**
     * Filter which collection_items to update
     */
    where?: collection_itemsWhereInput
  }


  /**
   * collection_items upsert
   */
  export type collection_itemsUpsertArgs = {
    /**
     * Select specific fields to fetch from the collection_items
     */
    select?: collection_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collection_itemsInclude | null
    /**
     * The filter to search for the collection_items to update in case it exists.
     */
    where: collection_itemsWhereUniqueInput
    /**
     * In case the collection_items found by the `where` argument doesn't exist, create a new collection_items with this data.
     */
    create: XOR<collection_itemsCreateInput, collection_itemsUncheckedCreateInput>
    /**
     * In case the collection_items was found with the provided `where` argument, update it with this data.
     */
    update: XOR<collection_itemsUpdateInput, collection_itemsUncheckedUpdateInput>
  }


  /**
   * collection_items delete
   */
  export type collection_itemsDeleteArgs = {
    /**
     * Select specific fields to fetch from the collection_items
     */
    select?: collection_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collection_itemsInclude | null
    /**
     * Filter which collection_items to delete.
     */
    where: collection_itemsWhereUniqueInput
  }


  /**
   * collection_items deleteMany
   */
  export type collection_itemsDeleteManyArgs = {
    /**
     * Filter which collection_items to delete
     */
    where?: collection_itemsWhereInput
  }


  /**
   * collection_items without action
   */
  export type collection_itemsArgs = {
    /**
     * Select specific fields to fetch from the collection_items
     */
    select?: collection_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: collection_itemsInclude | null
  }



  /**
   * Model alsoKnownAs
   */


  export type AggregateAlsoKnownAs = {
    _count: AlsoKnownAsCountAggregateOutputType | null
    _avg: AlsoKnownAsAvgAggregateOutputType | null
    _sum: AlsoKnownAsSumAggregateOutputType | null
    _min: AlsoKnownAsMinAggregateOutputType | null
    _max: AlsoKnownAsMaxAggregateOutputType | null
  }

  export type AlsoKnownAsAvgAggregateOutputType = {
    id: number | null
    group_id: number | null
  }

  export type AlsoKnownAsSumAggregateOutputType = {
    id: number | null
    group_id: number | null
  }

  export type AlsoKnownAsMinAggregateOutputType = {
    id: number | null
    item_id: string | null
    group_id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    data: string | null
    isDeleted: boolean | null
  }

  export type AlsoKnownAsMaxAggregateOutputType = {
    id: number | null
    item_id: string | null
    group_id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    data: string | null
    isDeleted: boolean | null
  }

  export type AlsoKnownAsCountAggregateOutputType = {
    id: number
    item_id: number
    group_id: number
    createdAt: number
    updatedAt: number
    data: number
    isDeleted: number
    _all: number
  }


  export type AlsoKnownAsAvgAggregateInputType = {
    id?: true
    group_id?: true
  }

  export type AlsoKnownAsSumAggregateInputType = {
    id?: true
    group_id?: true
  }

  export type AlsoKnownAsMinAggregateInputType = {
    id?: true
    item_id?: true
    group_id?: true
    createdAt?: true
    updatedAt?: true
    data?: true
    isDeleted?: true
  }

  export type AlsoKnownAsMaxAggregateInputType = {
    id?: true
    item_id?: true
    group_id?: true
    createdAt?: true
    updatedAt?: true
    data?: true
    isDeleted?: true
  }

  export type AlsoKnownAsCountAggregateInputType = {
    id?: true
    item_id?: true
    group_id?: true
    createdAt?: true
    updatedAt?: true
    data?: true
    isDeleted?: true
    _all?: true
  }

  export type AlsoKnownAsAggregateArgs = {
    /**
     * Filter which alsoKnownAs to aggregate.
     */
    where?: alsoKnownAsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of alsoKnownAs to fetch.
     */
    orderBy?: Enumerable<alsoKnownAsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: alsoKnownAsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` alsoKnownAs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` alsoKnownAs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned alsoKnownAs
    **/
    _count?: true | AlsoKnownAsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AlsoKnownAsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AlsoKnownAsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlsoKnownAsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlsoKnownAsMaxAggregateInputType
  }

  export type GetAlsoKnownAsAggregateType<T extends AlsoKnownAsAggregateArgs> = {
        [P in keyof T & keyof AggregateAlsoKnownAs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlsoKnownAs[P]>
      : GetScalarType<T[P], AggregateAlsoKnownAs[P]>
  }




  export type AlsoKnownAsGroupByArgs = {
    where?: alsoKnownAsWhereInput
    orderBy?: Enumerable<alsoKnownAsOrderByWithAggregationInput>
    by: AlsoKnownAsScalarFieldEnum[]
    having?: alsoKnownAsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlsoKnownAsCountAggregateInputType | true
    _avg?: AlsoKnownAsAvgAggregateInputType
    _sum?: AlsoKnownAsSumAggregateInputType
    _min?: AlsoKnownAsMinAggregateInputType
    _max?: AlsoKnownAsMaxAggregateInputType
  }


  export type AlsoKnownAsGroupByOutputType = {
    id: number
    item_id: string
    group_id: number
    createdAt: Date
    updatedAt: Date
    data: string
    isDeleted: boolean
    _count: AlsoKnownAsCountAggregateOutputType | null
    _avg: AlsoKnownAsAvgAggregateOutputType | null
    _sum: AlsoKnownAsSumAggregateOutputType | null
    _min: AlsoKnownAsMinAggregateOutputType | null
    _max: AlsoKnownAsMaxAggregateOutputType | null
  }

  type GetAlsoKnownAsGroupByPayload<T extends AlsoKnownAsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<AlsoKnownAsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlsoKnownAsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlsoKnownAsGroupByOutputType[P]>
            : GetScalarType<T[P], AlsoKnownAsGroupByOutputType[P]>
        }
      >
    >


  export type alsoKnownAsSelect = {
    id?: boolean
    item_id?: boolean
    item?: boolean | itemsArgs
    group_id?: boolean
    group?: boolean | groupsArgs
    createdAt?: boolean
    updatedAt?: boolean
    data?: boolean
    isDeleted?: boolean
  }


  export type alsoKnownAsInclude = {
    item?: boolean | itemsArgs
    group?: boolean | groupsArgs
  }

  export type alsoKnownAsGetPayload<S extends boolean | null | undefined | alsoKnownAsArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? alsoKnownAs :
    S extends undefined ? never :
    S extends { include: any } & (alsoKnownAsArgs | alsoKnownAsFindManyArgs)
    ? alsoKnownAs  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'item' ? itemsGetPayload<S['include'][P]> :
        P extends 'group' ? groupsGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (alsoKnownAsArgs | alsoKnownAsFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'item' ? itemsGetPayload<S['select'][P]> :
        P extends 'group' ? groupsGetPayload<S['select'][P]> :  P extends keyof alsoKnownAs ? alsoKnownAs[P] : never
  } 
      : alsoKnownAs


  type alsoKnownAsCountArgs = 
    Omit<alsoKnownAsFindManyArgs, 'select' | 'include'> & {
      select?: AlsoKnownAsCountAggregateInputType | true
    }

  export interface alsoKnownAsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one AlsoKnownAs that matches the filter.
     * @param {alsoKnownAsFindUniqueArgs} args - Arguments to find a AlsoKnownAs
     * @example
     * // Get one AlsoKnownAs
     * const alsoKnownAs = await prisma.alsoKnownAs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends alsoKnownAsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, alsoKnownAsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'alsoKnownAs'> extends True ? Prisma__alsoKnownAsClient<alsoKnownAsGetPayload<T>> : Prisma__alsoKnownAsClient<alsoKnownAsGetPayload<T> | null, null>

    /**
     * Find one AlsoKnownAs that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {alsoKnownAsFindUniqueOrThrowArgs} args - Arguments to find a AlsoKnownAs
     * @example
     * // Get one AlsoKnownAs
     * const alsoKnownAs = await prisma.alsoKnownAs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends alsoKnownAsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, alsoKnownAsFindUniqueOrThrowArgs>
    ): Prisma__alsoKnownAsClient<alsoKnownAsGetPayload<T>>

    /**
     * Find the first AlsoKnownAs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {alsoKnownAsFindFirstArgs} args - Arguments to find a AlsoKnownAs
     * @example
     * // Get one AlsoKnownAs
     * const alsoKnownAs = await prisma.alsoKnownAs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends alsoKnownAsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, alsoKnownAsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'alsoKnownAs'> extends True ? Prisma__alsoKnownAsClient<alsoKnownAsGetPayload<T>> : Prisma__alsoKnownAsClient<alsoKnownAsGetPayload<T> | null, null>

    /**
     * Find the first AlsoKnownAs that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {alsoKnownAsFindFirstOrThrowArgs} args - Arguments to find a AlsoKnownAs
     * @example
     * // Get one AlsoKnownAs
     * const alsoKnownAs = await prisma.alsoKnownAs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends alsoKnownAsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, alsoKnownAsFindFirstOrThrowArgs>
    ): Prisma__alsoKnownAsClient<alsoKnownAsGetPayload<T>>

    /**
     * Find zero or more AlsoKnownAs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {alsoKnownAsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AlsoKnownAs
     * const alsoKnownAs = await prisma.alsoKnownAs.findMany()
     * 
     * // Get first 10 AlsoKnownAs
     * const alsoKnownAs = await prisma.alsoKnownAs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const alsoKnownAsWithIdOnly = await prisma.alsoKnownAs.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends alsoKnownAsFindManyArgs>(
      args?: SelectSubset<T, alsoKnownAsFindManyArgs>
    ): Prisma.PrismaPromise<Array<alsoKnownAsGetPayload<T>>>

    /**
     * Create a AlsoKnownAs.
     * @param {alsoKnownAsCreateArgs} args - Arguments to create a AlsoKnownAs.
     * @example
     * // Create one AlsoKnownAs
     * const AlsoKnownAs = await prisma.alsoKnownAs.create({
     *   data: {
     *     // ... data to create a AlsoKnownAs
     *   }
     * })
     * 
    **/
    create<T extends alsoKnownAsCreateArgs>(
      args: SelectSubset<T, alsoKnownAsCreateArgs>
    ): Prisma__alsoKnownAsClient<alsoKnownAsGetPayload<T>>

    /**
     * Delete a AlsoKnownAs.
     * @param {alsoKnownAsDeleteArgs} args - Arguments to delete one AlsoKnownAs.
     * @example
     * // Delete one AlsoKnownAs
     * const AlsoKnownAs = await prisma.alsoKnownAs.delete({
     *   where: {
     *     // ... filter to delete one AlsoKnownAs
     *   }
     * })
     * 
    **/
    delete<T extends alsoKnownAsDeleteArgs>(
      args: SelectSubset<T, alsoKnownAsDeleteArgs>
    ): Prisma__alsoKnownAsClient<alsoKnownAsGetPayload<T>>

    /**
     * Update one AlsoKnownAs.
     * @param {alsoKnownAsUpdateArgs} args - Arguments to update one AlsoKnownAs.
     * @example
     * // Update one AlsoKnownAs
     * const alsoKnownAs = await prisma.alsoKnownAs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends alsoKnownAsUpdateArgs>(
      args: SelectSubset<T, alsoKnownAsUpdateArgs>
    ): Prisma__alsoKnownAsClient<alsoKnownAsGetPayload<T>>

    /**
     * Delete zero or more AlsoKnownAs.
     * @param {alsoKnownAsDeleteManyArgs} args - Arguments to filter AlsoKnownAs to delete.
     * @example
     * // Delete a few AlsoKnownAs
     * const { count } = await prisma.alsoKnownAs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends alsoKnownAsDeleteManyArgs>(
      args?: SelectSubset<T, alsoKnownAsDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AlsoKnownAs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {alsoKnownAsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AlsoKnownAs
     * const alsoKnownAs = await prisma.alsoKnownAs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends alsoKnownAsUpdateManyArgs>(
      args: SelectSubset<T, alsoKnownAsUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AlsoKnownAs.
     * @param {alsoKnownAsUpsertArgs} args - Arguments to update or create a AlsoKnownAs.
     * @example
     * // Update or create a AlsoKnownAs
     * const alsoKnownAs = await prisma.alsoKnownAs.upsert({
     *   create: {
     *     // ... data to create a AlsoKnownAs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AlsoKnownAs we want to update
     *   }
     * })
    **/
    upsert<T extends alsoKnownAsUpsertArgs>(
      args: SelectSubset<T, alsoKnownAsUpsertArgs>
    ): Prisma__alsoKnownAsClient<alsoKnownAsGetPayload<T>>

    /**
     * Count the number of AlsoKnownAs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {alsoKnownAsCountArgs} args - Arguments to filter AlsoKnownAs to count.
     * @example
     * // Count the number of AlsoKnownAs
     * const count = await prisma.alsoKnownAs.count({
     *   where: {
     *     // ... the filter for the AlsoKnownAs we want to count
     *   }
     * })
    **/
    count<T extends alsoKnownAsCountArgs>(
      args?: Subset<T, alsoKnownAsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlsoKnownAsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AlsoKnownAs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlsoKnownAsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlsoKnownAsAggregateArgs>(args: Subset<T, AlsoKnownAsAggregateArgs>): Prisma.PrismaPromise<GetAlsoKnownAsAggregateType<T>>

    /**
     * Group by AlsoKnownAs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlsoKnownAsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlsoKnownAsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlsoKnownAsGroupByArgs['orderBy'] }
        : { orderBy?: AlsoKnownAsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlsoKnownAsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlsoKnownAsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for alsoKnownAs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__alsoKnownAsClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    item<T extends itemsArgs= {}>(args?: Subset<T, itemsArgs>): Prisma__itemsClient<itemsGetPayload<T> | Null>;

    group<T extends groupsArgs= {}>(args?: Subset<T, groupsArgs>): Prisma__groupsClient<groupsGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * alsoKnownAs base type for findUnique actions
   */
  export type alsoKnownAsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the alsoKnownAs
     */
    select?: alsoKnownAsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: alsoKnownAsInclude | null
    /**
     * Filter, which alsoKnownAs to fetch.
     */
    where: alsoKnownAsWhereUniqueInput
  }

  /**
   * alsoKnownAs findUnique
   */
  export interface alsoKnownAsFindUniqueArgs extends alsoKnownAsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * alsoKnownAs findUniqueOrThrow
   */
  export type alsoKnownAsFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the alsoKnownAs
     */
    select?: alsoKnownAsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: alsoKnownAsInclude | null
    /**
     * Filter, which alsoKnownAs to fetch.
     */
    where: alsoKnownAsWhereUniqueInput
  }


  /**
   * alsoKnownAs base type for findFirst actions
   */
  export type alsoKnownAsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the alsoKnownAs
     */
    select?: alsoKnownAsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: alsoKnownAsInclude | null
    /**
     * Filter, which alsoKnownAs to fetch.
     */
    where?: alsoKnownAsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of alsoKnownAs to fetch.
     */
    orderBy?: Enumerable<alsoKnownAsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for alsoKnownAs.
     */
    cursor?: alsoKnownAsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` alsoKnownAs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` alsoKnownAs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of alsoKnownAs.
     */
    distinct?: Enumerable<AlsoKnownAsScalarFieldEnum>
  }

  /**
   * alsoKnownAs findFirst
   */
  export interface alsoKnownAsFindFirstArgs extends alsoKnownAsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * alsoKnownAs findFirstOrThrow
   */
  export type alsoKnownAsFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the alsoKnownAs
     */
    select?: alsoKnownAsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: alsoKnownAsInclude | null
    /**
     * Filter, which alsoKnownAs to fetch.
     */
    where?: alsoKnownAsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of alsoKnownAs to fetch.
     */
    orderBy?: Enumerable<alsoKnownAsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for alsoKnownAs.
     */
    cursor?: alsoKnownAsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` alsoKnownAs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` alsoKnownAs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of alsoKnownAs.
     */
    distinct?: Enumerable<AlsoKnownAsScalarFieldEnum>
  }


  /**
   * alsoKnownAs findMany
   */
  export type alsoKnownAsFindManyArgs = {
    /**
     * Select specific fields to fetch from the alsoKnownAs
     */
    select?: alsoKnownAsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: alsoKnownAsInclude | null
    /**
     * Filter, which alsoKnownAs to fetch.
     */
    where?: alsoKnownAsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of alsoKnownAs to fetch.
     */
    orderBy?: Enumerable<alsoKnownAsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing alsoKnownAs.
     */
    cursor?: alsoKnownAsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` alsoKnownAs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` alsoKnownAs.
     */
    skip?: number
    distinct?: Enumerable<AlsoKnownAsScalarFieldEnum>
  }


  /**
   * alsoKnownAs create
   */
  export type alsoKnownAsCreateArgs = {
    /**
     * Select specific fields to fetch from the alsoKnownAs
     */
    select?: alsoKnownAsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: alsoKnownAsInclude | null
    /**
     * The data needed to create a alsoKnownAs.
     */
    data: XOR<alsoKnownAsCreateInput, alsoKnownAsUncheckedCreateInput>
  }


  /**
   * alsoKnownAs update
   */
  export type alsoKnownAsUpdateArgs = {
    /**
     * Select specific fields to fetch from the alsoKnownAs
     */
    select?: alsoKnownAsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: alsoKnownAsInclude | null
    /**
     * The data needed to update a alsoKnownAs.
     */
    data: XOR<alsoKnownAsUpdateInput, alsoKnownAsUncheckedUpdateInput>
    /**
     * Choose, which alsoKnownAs to update.
     */
    where: alsoKnownAsWhereUniqueInput
  }


  /**
   * alsoKnownAs updateMany
   */
  export type alsoKnownAsUpdateManyArgs = {
    /**
     * The data used to update alsoKnownAs.
     */
    data: XOR<alsoKnownAsUpdateManyMutationInput, alsoKnownAsUncheckedUpdateManyInput>
    /**
     * Filter which alsoKnownAs to update
     */
    where?: alsoKnownAsWhereInput
  }


  /**
   * alsoKnownAs upsert
   */
  export type alsoKnownAsUpsertArgs = {
    /**
     * Select specific fields to fetch from the alsoKnownAs
     */
    select?: alsoKnownAsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: alsoKnownAsInclude | null
    /**
     * The filter to search for the alsoKnownAs to update in case it exists.
     */
    where: alsoKnownAsWhereUniqueInput
    /**
     * In case the alsoKnownAs found by the `where` argument doesn't exist, create a new alsoKnownAs with this data.
     */
    create: XOR<alsoKnownAsCreateInput, alsoKnownAsUncheckedCreateInput>
    /**
     * In case the alsoKnownAs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<alsoKnownAsUpdateInput, alsoKnownAsUncheckedUpdateInput>
  }


  /**
   * alsoKnownAs delete
   */
  export type alsoKnownAsDeleteArgs = {
    /**
     * Select specific fields to fetch from the alsoKnownAs
     */
    select?: alsoKnownAsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: alsoKnownAsInclude | null
    /**
     * Filter which alsoKnownAs to delete.
     */
    where: alsoKnownAsWhereUniqueInput
  }


  /**
   * alsoKnownAs deleteMany
   */
  export type alsoKnownAsDeleteManyArgs = {
    /**
     * Filter which alsoKnownAs to delete
     */
    where?: alsoKnownAsWhereInput
  }


  /**
   * alsoKnownAs without action
   */
  export type alsoKnownAsArgs = {
    /**
     * Select specific fields to fetch from the alsoKnownAs
     */
    select?: alsoKnownAsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: alsoKnownAsInclude | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const AlsoKnownAsScalarFieldEnum: {
    id: 'id',
    item_id: 'item_id',
    group_id: 'group_id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    data: 'data',
    isDeleted: 'isDeleted'
  };

  export type AlsoKnownAsScalarFieldEnum = (typeof AlsoKnownAsScalarFieldEnum)[keyof typeof AlsoKnownAsScalarFieldEnum]


  export const Collection_itemsScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    collection_id: 'collection_id',
    item_id: 'item_id'
  };

  export type Collection_itemsScalarFieldEnum = (typeof Collection_itemsScalarFieldEnum)[keyof typeof Collection_itemsScalarFieldEnum]


  export const CollectionsScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CollectionsScalarFieldEnum = (typeof CollectionsScalarFieldEnum)[keyof typeof CollectionsScalarFieldEnum]


  export const GroupsScalarFieldEnum: {
    id: 'id',
    version: 'version',
    itemsVersion: 'itemsVersion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GroupsScalarFieldEnum = (typeof GroupsScalarFieldEnum)[keyof typeof GroupsScalarFieldEnum]


  export const ItemsScalarFieldEnum: {
    id: 'id',
    version: 'version',
    data: 'data',
    inconsistent: 'inconsistent',
    group_id: 'group_id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    isDeleted: 'isDeleted'
  };

  export type ItemsScalarFieldEnum = (typeof ItemsScalarFieldEnum)[keyof typeof ItemsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  /**
   * Deep Input Types
   */


  export type groupsWhereInput = {
    AND?: Enumerable<groupsWhereInput>
    OR?: Enumerable<groupsWhereInput>
    NOT?: Enumerable<groupsWhereInput>
    id?: IntFilter | number
    version?: IntFilter | number
    itemsVersion?: IntFilter | number
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    items?: ItemsListRelationFilter
    alsoKnownAs?: AlsoKnownAsListRelationFilter
  }

  export type groupsOrderByWithRelationInput = {
    id?: SortOrder
    version?: SortOrder
    itemsVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    items?: itemsOrderByRelationAggregateInput
    alsoKnownAs?: alsoKnownAsOrderByRelationAggregateInput
  }

  export type groupsWhereUniqueInput = {
    id?: number
  }

  export type groupsOrderByWithAggregationInput = {
    id?: SortOrder
    version?: SortOrder
    itemsVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: groupsCountOrderByAggregateInput
    _avg?: groupsAvgOrderByAggregateInput
    _max?: groupsMaxOrderByAggregateInput
    _min?: groupsMinOrderByAggregateInput
    _sum?: groupsSumOrderByAggregateInput
  }

  export type groupsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<groupsScalarWhereWithAggregatesInput>
    OR?: Enumerable<groupsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<groupsScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    version?: IntWithAggregatesFilter | number
    itemsVersion?: IntWithAggregatesFilter | number
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type itemsWhereInput = {
    AND?: Enumerable<itemsWhereInput>
    OR?: Enumerable<itemsWhereInput>
    NOT?: Enumerable<itemsWhereInput>
    id?: StringFilter | string
    version?: IntFilter | number
    data?: StringFilter | string
    inconsistent?: BoolFilter | boolean
    group_id?: IntFilter | number
    group?: XOR<GroupsRelationFilter, groupsWhereInput>
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    isDeleted?: BoolFilter | boolean
    collection_items?: Collection_itemsListRelationFilter
    alsoKnownAs?: AlsoKnownAsListRelationFilter
  }

  export type itemsOrderByWithRelationInput = {
    id?: SortOrder
    version?: SortOrder
    data?: SortOrder
    inconsistent?: SortOrder
    group_id?: SortOrder
    group?: groupsOrderByWithRelationInput
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isDeleted?: SortOrder
    collection_items?: collection_itemsOrderByRelationAggregateInput
    alsoKnownAs?: alsoKnownAsOrderByRelationAggregateInput
  }

  export type itemsWhereUniqueInput = {
    id?: string
  }

  export type itemsOrderByWithAggregationInput = {
    id?: SortOrder
    version?: SortOrder
    data?: SortOrder
    inconsistent?: SortOrder
    group_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isDeleted?: SortOrder
    _count?: itemsCountOrderByAggregateInput
    _avg?: itemsAvgOrderByAggregateInput
    _max?: itemsMaxOrderByAggregateInput
    _min?: itemsMinOrderByAggregateInput
    _sum?: itemsSumOrderByAggregateInput
  }

  export type itemsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<itemsScalarWhereWithAggregatesInput>
    OR?: Enumerable<itemsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<itemsScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    version?: IntWithAggregatesFilter | number
    data?: StringWithAggregatesFilter | string
    inconsistent?: BoolWithAggregatesFilter | boolean
    group_id?: IntWithAggregatesFilter | number
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    isDeleted?: BoolWithAggregatesFilter | boolean
  }

  export type collectionsWhereInput = {
    AND?: Enumerable<collectionsWhereInput>
    OR?: Enumerable<collectionsWhereInput>
    NOT?: Enumerable<collectionsWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    collection_items?: Collection_itemsListRelationFilter
  }

  export type collectionsOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    collection_items?: collection_itemsOrderByRelationAggregateInput
  }

  export type collectionsWhereUniqueInput = {
    id?: string
  }

  export type collectionsOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: collectionsCountOrderByAggregateInput
    _max?: collectionsMaxOrderByAggregateInput
    _min?: collectionsMinOrderByAggregateInput
  }

  export type collectionsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<collectionsScalarWhereWithAggregatesInput>
    OR?: Enumerable<collectionsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<collectionsScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type collection_itemsWhereInput = {
    AND?: Enumerable<collection_itemsWhereInput>
    OR?: Enumerable<collection_itemsWhereInput>
    NOT?: Enumerable<collection_itemsWhereInput>
    id?: IntFilter | number
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    collection_id?: StringFilter | string
    collection?: XOR<CollectionsRelationFilter, collectionsWhereInput>
    item_id?: StringFilter | string
    item?: XOR<ItemsRelationFilter, itemsWhereInput>
  }

  export type collection_itemsOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    collection_id?: SortOrder
    collection?: collectionsOrderByWithRelationInput
    item_id?: SortOrder
    item?: itemsOrderByWithRelationInput
  }

  export type collection_itemsWhereUniqueInput = {
    id?: number
  }

  export type collection_itemsOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    collection_id?: SortOrder
    item_id?: SortOrder
    _count?: collection_itemsCountOrderByAggregateInput
    _avg?: collection_itemsAvgOrderByAggregateInput
    _max?: collection_itemsMaxOrderByAggregateInput
    _min?: collection_itemsMinOrderByAggregateInput
    _sum?: collection_itemsSumOrderByAggregateInput
  }

  export type collection_itemsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<collection_itemsScalarWhereWithAggregatesInput>
    OR?: Enumerable<collection_itemsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<collection_itemsScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    collection_id?: StringWithAggregatesFilter | string
    item_id?: StringWithAggregatesFilter | string
  }

  export type alsoKnownAsWhereInput = {
    AND?: Enumerable<alsoKnownAsWhereInput>
    OR?: Enumerable<alsoKnownAsWhereInput>
    NOT?: Enumerable<alsoKnownAsWhereInput>
    id?: IntFilter | number
    item_id?: StringFilter | string
    item?: XOR<ItemsRelationFilter, itemsWhereInput>
    group_id?: IntFilter | number
    group?: XOR<GroupsRelationFilter, groupsWhereInput>
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    data?: StringFilter | string
    isDeleted?: BoolFilter | boolean
  }

  export type alsoKnownAsOrderByWithRelationInput = {
    id?: SortOrder
    item_id?: SortOrder
    item?: itemsOrderByWithRelationInput
    group_id?: SortOrder
    group?: groupsOrderByWithRelationInput
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
    isDeleted?: SortOrder
  }

  export type alsoKnownAsWhereUniqueInput = {
    id?: number
  }

  export type alsoKnownAsOrderByWithAggregationInput = {
    id?: SortOrder
    item_id?: SortOrder
    group_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
    isDeleted?: SortOrder
    _count?: alsoKnownAsCountOrderByAggregateInput
    _avg?: alsoKnownAsAvgOrderByAggregateInput
    _max?: alsoKnownAsMaxOrderByAggregateInput
    _min?: alsoKnownAsMinOrderByAggregateInput
    _sum?: alsoKnownAsSumOrderByAggregateInput
  }

  export type alsoKnownAsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<alsoKnownAsScalarWhereWithAggregatesInput>
    OR?: Enumerable<alsoKnownAsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<alsoKnownAsScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    item_id?: StringWithAggregatesFilter | string
    group_id?: IntWithAggregatesFilter | number
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    data?: StringWithAggregatesFilter | string
    isDeleted?: BoolWithAggregatesFilter | boolean
  }

  export type groupsCreateInput = {
    id: number
    version: number
    itemsVersion: number
    createdAt: Date | string
    updatedAt: Date | string
    items?: itemsCreateNestedManyWithoutGroupInput
    alsoKnownAs?: alsoKnownAsCreateNestedManyWithoutGroupInput
  }

  export type groupsUncheckedCreateInput = {
    id: number
    version: number
    itemsVersion: number
    createdAt: Date | string
    updatedAt: Date | string
    items?: itemsUncheckedCreateNestedManyWithoutGroupInput
    alsoKnownAs?: alsoKnownAsUncheckedCreateNestedManyWithoutGroupInput
  }

  export type groupsUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    itemsVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: itemsUpdateManyWithoutGroupNestedInput
    alsoKnownAs?: alsoKnownAsUpdateManyWithoutGroupNestedInput
  }

  export type groupsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    itemsVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: itemsUncheckedUpdateManyWithoutGroupNestedInput
    alsoKnownAs?: alsoKnownAsUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type groupsUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    itemsVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type groupsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    itemsVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type itemsCreateInput = {
    id: string
    version: number
    data: string
    inconsistent: boolean
    group: groupsCreateNestedOneWithoutItemsInput
    createdAt: Date | string
    updatedAt: Date | string
    isDeleted?: boolean
    collection_items?: collection_itemsCreateNestedManyWithoutItemInput
    alsoKnownAs?: alsoKnownAsCreateNestedManyWithoutItemInput
  }

  export type itemsUncheckedCreateInput = {
    id: string
    version: number
    data: string
    inconsistent: boolean
    group_id: number
    createdAt: Date | string
    updatedAt: Date | string
    isDeleted?: boolean
    collection_items?: collection_itemsUncheckedCreateNestedManyWithoutItemInput
    alsoKnownAs?: alsoKnownAsUncheckedCreateNestedManyWithoutItemInput
  }

  export type itemsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    data?: StringFieldUpdateOperationsInput | string
    inconsistent?: BoolFieldUpdateOperationsInput | boolean
    group?: groupsUpdateOneRequiredWithoutItemsNestedInput
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    collection_items?: collection_itemsUpdateManyWithoutItemNestedInput
    alsoKnownAs?: alsoKnownAsUpdateManyWithoutItemNestedInput
  }

  export type itemsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    data?: StringFieldUpdateOperationsInput | string
    inconsistent?: BoolFieldUpdateOperationsInput | boolean
    group_id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    collection_items?: collection_itemsUncheckedUpdateManyWithoutItemNestedInput
    alsoKnownAs?: alsoKnownAsUncheckedUpdateManyWithoutItemNestedInput
  }

  export type itemsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    data?: StringFieldUpdateOperationsInput | string
    inconsistent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type itemsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    data?: StringFieldUpdateOperationsInput | string
    inconsistent?: BoolFieldUpdateOperationsInput | boolean
    group_id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type collectionsCreateInput = {
    id: string
    createdAt: Date | string
    updatedAt: Date | string
    collection_items?: collection_itemsCreateNestedManyWithoutCollectionInput
  }

  export type collectionsUncheckedCreateInput = {
    id: string
    createdAt: Date | string
    updatedAt: Date | string
    collection_items?: collection_itemsUncheckedCreateNestedManyWithoutCollectionInput
  }

  export type collectionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collection_items?: collection_itemsUpdateManyWithoutCollectionNestedInput
  }

  export type collectionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collection_items?: collection_itemsUncheckedUpdateManyWithoutCollectionNestedInput
  }

  export type collectionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type collectionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type collection_itemsCreateInput = {
    createdAt: Date | string
    updatedAt: Date | string
    collection: collectionsCreateNestedOneWithoutCollection_itemsInput
    item: itemsCreateNestedOneWithoutCollection_itemsInput
  }

  export type collection_itemsUncheckedCreateInput = {
    id?: number
    createdAt: Date | string
    updatedAt: Date | string
    collection_id: string
    item_id: string
  }

  export type collection_itemsUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collection?: collectionsUpdateOneRequiredWithoutCollection_itemsNestedInput
    item?: itemsUpdateOneRequiredWithoutCollection_itemsNestedInput
  }

  export type collection_itemsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collection_id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
  }

  export type collection_itemsUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type collection_itemsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collection_id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
  }

  export type alsoKnownAsCreateInput = {
    item: itemsCreateNestedOneWithoutAlsoKnownAsInput
    group: groupsCreateNestedOneWithoutAlsoKnownAsInput
    createdAt: Date | string
    updatedAt: Date | string
    data: string
    isDeleted?: boolean
  }

  export type alsoKnownAsUncheckedCreateInput = {
    id?: number
    item_id: string
    group_id: number
    createdAt: Date | string
    updatedAt: Date | string
    data: string
    isDeleted?: boolean
  }

  export type alsoKnownAsUpdateInput = {
    item?: itemsUpdateOneRequiredWithoutAlsoKnownAsNestedInput
    group?: groupsUpdateOneRequiredWithoutAlsoKnownAsNestedInput
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type alsoKnownAsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_id?: StringFieldUpdateOperationsInput | string
    group_id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type alsoKnownAsUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type alsoKnownAsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_id?: StringFieldUpdateOperationsInput | string
    group_id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type ItemsListRelationFilter = {
    every?: itemsWhereInput
    some?: itemsWhereInput
    none?: itemsWhereInput
  }

  export type AlsoKnownAsListRelationFilter = {
    every?: alsoKnownAsWhereInput
    some?: alsoKnownAsWhereInput
    none?: alsoKnownAsWhereInput
  }

  export type itemsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type alsoKnownAsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type groupsCountOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    itemsVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type groupsAvgOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    itemsVersion?: SortOrder
  }

  export type groupsMaxOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    itemsVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type groupsMinOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    itemsVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type groupsSumOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    itemsVersion?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type GroupsRelationFilter = {
    is?: groupsWhereInput
    isNot?: groupsWhereInput
  }

  export type Collection_itemsListRelationFilter = {
    every?: collection_itemsWhereInput
    some?: collection_itemsWhereInput
    none?: collection_itemsWhereInput
  }

  export type collection_itemsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type itemsCountOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    data?: SortOrder
    inconsistent?: SortOrder
    group_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isDeleted?: SortOrder
  }

  export type itemsAvgOrderByAggregateInput = {
    version?: SortOrder
    group_id?: SortOrder
  }

  export type itemsMaxOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    data?: SortOrder
    inconsistent?: SortOrder
    group_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isDeleted?: SortOrder
  }

  export type itemsMinOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    data?: SortOrder
    inconsistent?: SortOrder
    group_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isDeleted?: SortOrder
  }

  export type itemsSumOrderByAggregateInput = {
    version?: SortOrder
    group_id?: SortOrder
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type BoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type collectionsCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type collectionsMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type collectionsMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollectionsRelationFilter = {
    is?: collectionsWhereInput
    isNot?: collectionsWhereInput
  }

  export type ItemsRelationFilter = {
    is?: itemsWhereInput
    isNot?: itemsWhereInput
  }

  export type collection_itemsCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    collection_id?: SortOrder
    item_id?: SortOrder
  }

  export type collection_itemsAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type collection_itemsMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    collection_id?: SortOrder
    item_id?: SortOrder
  }

  export type collection_itemsMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    collection_id?: SortOrder
    item_id?: SortOrder
  }

  export type collection_itemsSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type alsoKnownAsCountOrderByAggregateInput = {
    id?: SortOrder
    item_id?: SortOrder
    group_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
    isDeleted?: SortOrder
  }

  export type alsoKnownAsAvgOrderByAggregateInput = {
    id?: SortOrder
    group_id?: SortOrder
  }

  export type alsoKnownAsMaxOrderByAggregateInput = {
    id?: SortOrder
    item_id?: SortOrder
    group_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
    isDeleted?: SortOrder
  }

  export type alsoKnownAsMinOrderByAggregateInput = {
    id?: SortOrder
    item_id?: SortOrder
    group_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
    isDeleted?: SortOrder
  }

  export type alsoKnownAsSumOrderByAggregateInput = {
    id?: SortOrder
    group_id?: SortOrder
  }

  export type itemsCreateNestedManyWithoutGroupInput = {
    create?: XOR<Enumerable<itemsCreateWithoutGroupInput>, Enumerable<itemsUncheckedCreateWithoutGroupInput>>
    connectOrCreate?: Enumerable<itemsCreateOrConnectWithoutGroupInput>
    connect?: Enumerable<itemsWhereUniqueInput>
  }

  export type alsoKnownAsCreateNestedManyWithoutGroupInput = {
    create?: XOR<Enumerable<alsoKnownAsCreateWithoutGroupInput>, Enumerable<alsoKnownAsUncheckedCreateWithoutGroupInput>>
    connectOrCreate?: Enumerable<alsoKnownAsCreateOrConnectWithoutGroupInput>
    connect?: Enumerable<alsoKnownAsWhereUniqueInput>
  }

  export type itemsUncheckedCreateNestedManyWithoutGroupInput = {
    create?: XOR<Enumerable<itemsCreateWithoutGroupInput>, Enumerable<itemsUncheckedCreateWithoutGroupInput>>
    connectOrCreate?: Enumerable<itemsCreateOrConnectWithoutGroupInput>
    connect?: Enumerable<itemsWhereUniqueInput>
  }

  export type alsoKnownAsUncheckedCreateNestedManyWithoutGroupInput = {
    create?: XOR<Enumerable<alsoKnownAsCreateWithoutGroupInput>, Enumerable<alsoKnownAsUncheckedCreateWithoutGroupInput>>
    connectOrCreate?: Enumerable<alsoKnownAsCreateOrConnectWithoutGroupInput>
    connect?: Enumerable<alsoKnownAsWhereUniqueInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type itemsUpdateManyWithoutGroupNestedInput = {
    create?: XOR<Enumerable<itemsCreateWithoutGroupInput>, Enumerable<itemsUncheckedCreateWithoutGroupInput>>
    connectOrCreate?: Enumerable<itemsCreateOrConnectWithoutGroupInput>
    upsert?: Enumerable<itemsUpsertWithWhereUniqueWithoutGroupInput>
    set?: Enumerable<itemsWhereUniqueInput>
    disconnect?: Enumerable<itemsWhereUniqueInput>
    delete?: Enumerable<itemsWhereUniqueInput>
    connect?: Enumerable<itemsWhereUniqueInput>
    update?: Enumerable<itemsUpdateWithWhereUniqueWithoutGroupInput>
    updateMany?: Enumerable<itemsUpdateManyWithWhereWithoutGroupInput>
    deleteMany?: Enumerable<itemsScalarWhereInput>
  }

  export type alsoKnownAsUpdateManyWithoutGroupNestedInput = {
    create?: XOR<Enumerable<alsoKnownAsCreateWithoutGroupInput>, Enumerable<alsoKnownAsUncheckedCreateWithoutGroupInput>>
    connectOrCreate?: Enumerable<alsoKnownAsCreateOrConnectWithoutGroupInput>
    upsert?: Enumerable<alsoKnownAsUpsertWithWhereUniqueWithoutGroupInput>
    set?: Enumerable<alsoKnownAsWhereUniqueInput>
    disconnect?: Enumerable<alsoKnownAsWhereUniqueInput>
    delete?: Enumerable<alsoKnownAsWhereUniqueInput>
    connect?: Enumerable<alsoKnownAsWhereUniqueInput>
    update?: Enumerable<alsoKnownAsUpdateWithWhereUniqueWithoutGroupInput>
    updateMany?: Enumerable<alsoKnownAsUpdateManyWithWhereWithoutGroupInput>
    deleteMany?: Enumerable<alsoKnownAsScalarWhereInput>
  }

  export type itemsUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: XOR<Enumerable<itemsCreateWithoutGroupInput>, Enumerable<itemsUncheckedCreateWithoutGroupInput>>
    connectOrCreate?: Enumerable<itemsCreateOrConnectWithoutGroupInput>
    upsert?: Enumerable<itemsUpsertWithWhereUniqueWithoutGroupInput>
    set?: Enumerable<itemsWhereUniqueInput>
    disconnect?: Enumerable<itemsWhereUniqueInput>
    delete?: Enumerable<itemsWhereUniqueInput>
    connect?: Enumerable<itemsWhereUniqueInput>
    update?: Enumerable<itemsUpdateWithWhereUniqueWithoutGroupInput>
    updateMany?: Enumerable<itemsUpdateManyWithWhereWithoutGroupInput>
    deleteMany?: Enumerable<itemsScalarWhereInput>
  }

  export type alsoKnownAsUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: XOR<Enumerable<alsoKnownAsCreateWithoutGroupInput>, Enumerable<alsoKnownAsUncheckedCreateWithoutGroupInput>>
    connectOrCreate?: Enumerable<alsoKnownAsCreateOrConnectWithoutGroupInput>
    upsert?: Enumerable<alsoKnownAsUpsertWithWhereUniqueWithoutGroupInput>
    set?: Enumerable<alsoKnownAsWhereUniqueInput>
    disconnect?: Enumerable<alsoKnownAsWhereUniqueInput>
    delete?: Enumerable<alsoKnownAsWhereUniqueInput>
    connect?: Enumerable<alsoKnownAsWhereUniqueInput>
    update?: Enumerable<alsoKnownAsUpdateWithWhereUniqueWithoutGroupInput>
    updateMany?: Enumerable<alsoKnownAsUpdateManyWithWhereWithoutGroupInput>
    deleteMany?: Enumerable<alsoKnownAsScalarWhereInput>
  }

  export type groupsCreateNestedOneWithoutItemsInput = {
    create?: XOR<groupsCreateWithoutItemsInput, groupsUncheckedCreateWithoutItemsInput>
    connectOrCreate?: groupsCreateOrConnectWithoutItemsInput
    connect?: groupsWhereUniqueInput
  }

  export type collection_itemsCreateNestedManyWithoutItemInput = {
    create?: XOR<Enumerable<collection_itemsCreateWithoutItemInput>, Enumerable<collection_itemsUncheckedCreateWithoutItemInput>>
    connectOrCreate?: Enumerable<collection_itemsCreateOrConnectWithoutItemInput>
    connect?: Enumerable<collection_itemsWhereUniqueInput>
  }

  export type alsoKnownAsCreateNestedManyWithoutItemInput = {
    create?: XOR<Enumerable<alsoKnownAsCreateWithoutItemInput>, Enumerable<alsoKnownAsUncheckedCreateWithoutItemInput>>
    connectOrCreate?: Enumerable<alsoKnownAsCreateOrConnectWithoutItemInput>
    connect?: Enumerable<alsoKnownAsWhereUniqueInput>
  }

  export type collection_itemsUncheckedCreateNestedManyWithoutItemInput = {
    create?: XOR<Enumerable<collection_itemsCreateWithoutItemInput>, Enumerable<collection_itemsUncheckedCreateWithoutItemInput>>
    connectOrCreate?: Enumerable<collection_itemsCreateOrConnectWithoutItemInput>
    connect?: Enumerable<collection_itemsWhereUniqueInput>
  }

  export type alsoKnownAsUncheckedCreateNestedManyWithoutItemInput = {
    create?: XOR<Enumerable<alsoKnownAsCreateWithoutItemInput>, Enumerable<alsoKnownAsUncheckedCreateWithoutItemInput>>
    connectOrCreate?: Enumerable<alsoKnownAsCreateOrConnectWithoutItemInput>
    connect?: Enumerable<alsoKnownAsWhereUniqueInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type groupsUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<groupsCreateWithoutItemsInput, groupsUncheckedCreateWithoutItemsInput>
    connectOrCreate?: groupsCreateOrConnectWithoutItemsInput
    upsert?: groupsUpsertWithoutItemsInput
    connect?: groupsWhereUniqueInput
    update?: XOR<groupsUpdateWithoutItemsInput, groupsUncheckedUpdateWithoutItemsInput>
  }

  export type collection_itemsUpdateManyWithoutItemNestedInput = {
    create?: XOR<Enumerable<collection_itemsCreateWithoutItemInput>, Enumerable<collection_itemsUncheckedCreateWithoutItemInput>>
    connectOrCreate?: Enumerable<collection_itemsCreateOrConnectWithoutItemInput>
    upsert?: Enumerable<collection_itemsUpsertWithWhereUniqueWithoutItemInput>
    set?: Enumerable<collection_itemsWhereUniqueInput>
    disconnect?: Enumerable<collection_itemsWhereUniqueInput>
    delete?: Enumerable<collection_itemsWhereUniqueInput>
    connect?: Enumerable<collection_itemsWhereUniqueInput>
    update?: Enumerable<collection_itemsUpdateWithWhereUniqueWithoutItemInput>
    updateMany?: Enumerable<collection_itemsUpdateManyWithWhereWithoutItemInput>
    deleteMany?: Enumerable<collection_itemsScalarWhereInput>
  }

  export type alsoKnownAsUpdateManyWithoutItemNestedInput = {
    create?: XOR<Enumerable<alsoKnownAsCreateWithoutItemInput>, Enumerable<alsoKnownAsUncheckedCreateWithoutItemInput>>
    connectOrCreate?: Enumerable<alsoKnownAsCreateOrConnectWithoutItemInput>
    upsert?: Enumerable<alsoKnownAsUpsertWithWhereUniqueWithoutItemInput>
    set?: Enumerable<alsoKnownAsWhereUniqueInput>
    disconnect?: Enumerable<alsoKnownAsWhereUniqueInput>
    delete?: Enumerable<alsoKnownAsWhereUniqueInput>
    connect?: Enumerable<alsoKnownAsWhereUniqueInput>
    update?: Enumerable<alsoKnownAsUpdateWithWhereUniqueWithoutItemInput>
    updateMany?: Enumerable<alsoKnownAsUpdateManyWithWhereWithoutItemInput>
    deleteMany?: Enumerable<alsoKnownAsScalarWhereInput>
  }

  export type collection_itemsUncheckedUpdateManyWithoutItemNestedInput = {
    create?: XOR<Enumerable<collection_itemsCreateWithoutItemInput>, Enumerable<collection_itemsUncheckedCreateWithoutItemInput>>
    connectOrCreate?: Enumerable<collection_itemsCreateOrConnectWithoutItemInput>
    upsert?: Enumerable<collection_itemsUpsertWithWhereUniqueWithoutItemInput>
    set?: Enumerable<collection_itemsWhereUniqueInput>
    disconnect?: Enumerable<collection_itemsWhereUniqueInput>
    delete?: Enumerable<collection_itemsWhereUniqueInput>
    connect?: Enumerable<collection_itemsWhereUniqueInput>
    update?: Enumerable<collection_itemsUpdateWithWhereUniqueWithoutItemInput>
    updateMany?: Enumerable<collection_itemsUpdateManyWithWhereWithoutItemInput>
    deleteMany?: Enumerable<collection_itemsScalarWhereInput>
  }

  export type alsoKnownAsUncheckedUpdateManyWithoutItemNestedInput = {
    create?: XOR<Enumerable<alsoKnownAsCreateWithoutItemInput>, Enumerable<alsoKnownAsUncheckedCreateWithoutItemInput>>
    connectOrCreate?: Enumerable<alsoKnownAsCreateOrConnectWithoutItemInput>
    upsert?: Enumerable<alsoKnownAsUpsertWithWhereUniqueWithoutItemInput>
    set?: Enumerable<alsoKnownAsWhereUniqueInput>
    disconnect?: Enumerable<alsoKnownAsWhereUniqueInput>
    delete?: Enumerable<alsoKnownAsWhereUniqueInput>
    connect?: Enumerable<alsoKnownAsWhereUniqueInput>
    update?: Enumerable<alsoKnownAsUpdateWithWhereUniqueWithoutItemInput>
    updateMany?: Enumerable<alsoKnownAsUpdateManyWithWhereWithoutItemInput>
    deleteMany?: Enumerable<alsoKnownAsScalarWhereInput>
  }

  export type collection_itemsCreateNestedManyWithoutCollectionInput = {
    create?: XOR<Enumerable<collection_itemsCreateWithoutCollectionInput>, Enumerable<collection_itemsUncheckedCreateWithoutCollectionInput>>
    connectOrCreate?: Enumerable<collection_itemsCreateOrConnectWithoutCollectionInput>
    connect?: Enumerable<collection_itemsWhereUniqueInput>
  }

  export type collection_itemsUncheckedCreateNestedManyWithoutCollectionInput = {
    create?: XOR<Enumerable<collection_itemsCreateWithoutCollectionInput>, Enumerable<collection_itemsUncheckedCreateWithoutCollectionInput>>
    connectOrCreate?: Enumerable<collection_itemsCreateOrConnectWithoutCollectionInput>
    connect?: Enumerable<collection_itemsWhereUniqueInput>
  }

  export type collection_itemsUpdateManyWithoutCollectionNestedInput = {
    create?: XOR<Enumerable<collection_itemsCreateWithoutCollectionInput>, Enumerable<collection_itemsUncheckedCreateWithoutCollectionInput>>
    connectOrCreate?: Enumerable<collection_itemsCreateOrConnectWithoutCollectionInput>
    upsert?: Enumerable<collection_itemsUpsertWithWhereUniqueWithoutCollectionInput>
    set?: Enumerable<collection_itemsWhereUniqueInput>
    disconnect?: Enumerable<collection_itemsWhereUniqueInput>
    delete?: Enumerable<collection_itemsWhereUniqueInput>
    connect?: Enumerable<collection_itemsWhereUniqueInput>
    update?: Enumerable<collection_itemsUpdateWithWhereUniqueWithoutCollectionInput>
    updateMany?: Enumerable<collection_itemsUpdateManyWithWhereWithoutCollectionInput>
    deleteMany?: Enumerable<collection_itemsScalarWhereInput>
  }

  export type collection_itemsUncheckedUpdateManyWithoutCollectionNestedInput = {
    create?: XOR<Enumerable<collection_itemsCreateWithoutCollectionInput>, Enumerable<collection_itemsUncheckedCreateWithoutCollectionInput>>
    connectOrCreate?: Enumerable<collection_itemsCreateOrConnectWithoutCollectionInput>
    upsert?: Enumerable<collection_itemsUpsertWithWhereUniqueWithoutCollectionInput>
    set?: Enumerable<collection_itemsWhereUniqueInput>
    disconnect?: Enumerable<collection_itemsWhereUniqueInput>
    delete?: Enumerable<collection_itemsWhereUniqueInput>
    connect?: Enumerable<collection_itemsWhereUniqueInput>
    update?: Enumerable<collection_itemsUpdateWithWhereUniqueWithoutCollectionInput>
    updateMany?: Enumerable<collection_itemsUpdateManyWithWhereWithoutCollectionInput>
    deleteMany?: Enumerable<collection_itemsScalarWhereInput>
  }

  export type collectionsCreateNestedOneWithoutCollection_itemsInput = {
    create?: XOR<collectionsCreateWithoutCollection_itemsInput, collectionsUncheckedCreateWithoutCollection_itemsInput>
    connectOrCreate?: collectionsCreateOrConnectWithoutCollection_itemsInput
    connect?: collectionsWhereUniqueInput
  }

  export type itemsCreateNestedOneWithoutCollection_itemsInput = {
    create?: XOR<itemsCreateWithoutCollection_itemsInput, itemsUncheckedCreateWithoutCollection_itemsInput>
    connectOrCreate?: itemsCreateOrConnectWithoutCollection_itemsInput
    connect?: itemsWhereUniqueInput
  }

  export type collectionsUpdateOneRequiredWithoutCollection_itemsNestedInput = {
    create?: XOR<collectionsCreateWithoutCollection_itemsInput, collectionsUncheckedCreateWithoutCollection_itemsInput>
    connectOrCreate?: collectionsCreateOrConnectWithoutCollection_itemsInput
    upsert?: collectionsUpsertWithoutCollection_itemsInput
    connect?: collectionsWhereUniqueInput
    update?: XOR<collectionsUpdateWithoutCollection_itemsInput, collectionsUncheckedUpdateWithoutCollection_itemsInput>
  }

  export type itemsUpdateOneRequiredWithoutCollection_itemsNestedInput = {
    create?: XOR<itemsCreateWithoutCollection_itemsInput, itemsUncheckedCreateWithoutCollection_itemsInput>
    connectOrCreate?: itemsCreateOrConnectWithoutCollection_itemsInput
    upsert?: itemsUpsertWithoutCollection_itemsInput
    connect?: itemsWhereUniqueInput
    update?: XOR<itemsUpdateWithoutCollection_itemsInput, itemsUncheckedUpdateWithoutCollection_itemsInput>
  }

  export type itemsCreateNestedOneWithoutAlsoKnownAsInput = {
    create?: XOR<itemsCreateWithoutAlsoKnownAsInput, itemsUncheckedCreateWithoutAlsoKnownAsInput>
    connectOrCreate?: itemsCreateOrConnectWithoutAlsoKnownAsInput
    connect?: itemsWhereUniqueInput
  }

  export type groupsCreateNestedOneWithoutAlsoKnownAsInput = {
    create?: XOR<groupsCreateWithoutAlsoKnownAsInput, groupsUncheckedCreateWithoutAlsoKnownAsInput>
    connectOrCreate?: groupsCreateOrConnectWithoutAlsoKnownAsInput
    connect?: groupsWhereUniqueInput
  }

  export type itemsUpdateOneRequiredWithoutAlsoKnownAsNestedInput = {
    create?: XOR<itemsCreateWithoutAlsoKnownAsInput, itemsUncheckedCreateWithoutAlsoKnownAsInput>
    connectOrCreate?: itemsCreateOrConnectWithoutAlsoKnownAsInput
    upsert?: itemsUpsertWithoutAlsoKnownAsInput
    connect?: itemsWhereUniqueInput
    update?: XOR<itemsUpdateWithoutAlsoKnownAsInput, itemsUncheckedUpdateWithoutAlsoKnownAsInput>
  }

  export type groupsUpdateOneRequiredWithoutAlsoKnownAsNestedInput = {
    create?: XOR<groupsCreateWithoutAlsoKnownAsInput, groupsUncheckedCreateWithoutAlsoKnownAsInput>
    connectOrCreate?: groupsCreateOrConnectWithoutAlsoKnownAsInput
    upsert?: groupsUpsertWithoutAlsoKnownAsInput
    connect?: groupsWhereUniqueInput
    update?: XOR<groupsUpdateWithoutAlsoKnownAsInput, groupsUncheckedUpdateWithoutAlsoKnownAsInput>
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type itemsCreateWithoutGroupInput = {
    id: string
    version: number
    data: string
    inconsistent: boolean
    createdAt: Date | string
    updatedAt: Date | string
    isDeleted?: boolean
    collection_items?: collection_itemsCreateNestedManyWithoutItemInput
    alsoKnownAs?: alsoKnownAsCreateNestedManyWithoutItemInput
  }

  export type itemsUncheckedCreateWithoutGroupInput = {
    id: string
    version: number
    data: string
    inconsistent: boolean
    createdAt: Date | string
    updatedAt: Date | string
    isDeleted?: boolean
    collection_items?: collection_itemsUncheckedCreateNestedManyWithoutItemInput
    alsoKnownAs?: alsoKnownAsUncheckedCreateNestedManyWithoutItemInput
  }

  export type itemsCreateOrConnectWithoutGroupInput = {
    where: itemsWhereUniqueInput
    create: XOR<itemsCreateWithoutGroupInput, itemsUncheckedCreateWithoutGroupInput>
  }

  export type alsoKnownAsCreateWithoutGroupInput = {
    item: itemsCreateNestedOneWithoutAlsoKnownAsInput
    createdAt: Date | string
    updatedAt: Date | string
    data: string
    isDeleted?: boolean
  }

  export type alsoKnownAsUncheckedCreateWithoutGroupInput = {
    id?: number
    item_id: string
    createdAt: Date | string
    updatedAt: Date | string
    data: string
    isDeleted?: boolean
  }

  export type alsoKnownAsCreateOrConnectWithoutGroupInput = {
    where: alsoKnownAsWhereUniqueInput
    create: XOR<alsoKnownAsCreateWithoutGroupInput, alsoKnownAsUncheckedCreateWithoutGroupInput>
  }

  export type itemsUpsertWithWhereUniqueWithoutGroupInput = {
    where: itemsWhereUniqueInput
    update: XOR<itemsUpdateWithoutGroupInput, itemsUncheckedUpdateWithoutGroupInput>
    create: XOR<itemsCreateWithoutGroupInput, itemsUncheckedCreateWithoutGroupInput>
  }

  export type itemsUpdateWithWhereUniqueWithoutGroupInput = {
    where: itemsWhereUniqueInput
    data: XOR<itemsUpdateWithoutGroupInput, itemsUncheckedUpdateWithoutGroupInput>
  }

  export type itemsUpdateManyWithWhereWithoutGroupInput = {
    where: itemsScalarWhereInput
    data: XOR<itemsUpdateManyMutationInput, itemsUncheckedUpdateManyWithoutItemsInput>
  }

  export type itemsScalarWhereInput = {
    AND?: Enumerable<itemsScalarWhereInput>
    OR?: Enumerable<itemsScalarWhereInput>
    NOT?: Enumerable<itemsScalarWhereInput>
    id?: StringFilter | string
    version?: IntFilter | number
    data?: StringFilter | string
    inconsistent?: BoolFilter | boolean
    group_id?: IntFilter | number
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    isDeleted?: BoolFilter | boolean
  }

  export type alsoKnownAsUpsertWithWhereUniqueWithoutGroupInput = {
    where: alsoKnownAsWhereUniqueInput
    update: XOR<alsoKnownAsUpdateWithoutGroupInput, alsoKnownAsUncheckedUpdateWithoutGroupInput>
    create: XOR<alsoKnownAsCreateWithoutGroupInput, alsoKnownAsUncheckedCreateWithoutGroupInput>
  }

  export type alsoKnownAsUpdateWithWhereUniqueWithoutGroupInput = {
    where: alsoKnownAsWhereUniqueInput
    data: XOR<alsoKnownAsUpdateWithoutGroupInput, alsoKnownAsUncheckedUpdateWithoutGroupInput>
  }

  export type alsoKnownAsUpdateManyWithWhereWithoutGroupInput = {
    where: alsoKnownAsScalarWhereInput
    data: XOR<alsoKnownAsUpdateManyMutationInput, alsoKnownAsUncheckedUpdateManyWithoutAlsoKnownAsInput>
  }

  export type alsoKnownAsScalarWhereInput = {
    AND?: Enumerable<alsoKnownAsScalarWhereInput>
    OR?: Enumerable<alsoKnownAsScalarWhereInput>
    NOT?: Enumerable<alsoKnownAsScalarWhereInput>
    id?: IntFilter | number
    item_id?: StringFilter | string
    group_id?: IntFilter | number
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    data?: StringFilter | string
    isDeleted?: BoolFilter | boolean
  }

  export type groupsCreateWithoutItemsInput = {
    id: number
    version: number
    itemsVersion: number
    createdAt: Date | string
    updatedAt: Date | string
    alsoKnownAs?: alsoKnownAsCreateNestedManyWithoutGroupInput
  }

  export type groupsUncheckedCreateWithoutItemsInput = {
    id: number
    version: number
    itemsVersion: number
    createdAt: Date | string
    updatedAt: Date | string
    alsoKnownAs?: alsoKnownAsUncheckedCreateNestedManyWithoutGroupInput
  }

  export type groupsCreateOrConnectWithoutItemsInput = {
    where: groupsWhereUniqueInput
    create: XOR<groupsCreateWithoutItemsInput, groupsUncheckedCreateWithoutItemsInput>
  }

  export type collection_itemsCreateWithoutItemInput = {
    createdAt: Date | string
    updatedAt: Date | string
    collection: collectionsCreateNestedOneWithoutCollection_itemsInput
  }

  export type collection_itemsUncheckedCreateWithoutItemInput = {
    id?: number
    createdAt: Date | string
    updatedAt: Date | string
    collection_id: string
  }

  export type collection_itemsCreateOrConnectWithoutItemInput = {
    where: collection_itemsWhereUniqueInput
    create: XOR<collection_itemsCreateWithoutItemInput, collection_itemsUncheckedCreateWithoutItemInput>
  }

  export type alsoKnownAsCreateWithoutItemInput = {
    group: groupsCreateNestedOneWithoutAlsoKnownAsInput
    createdAt: Date | string
    updatedAt: Date | string
    data: string
    isDeleted?: boolean
  }

  export type alsoKnownAsUncheckedCreateWithoutItemInput = {
    id?: number
    group_id: number
    createdAt: Date | string
    updatedAt: Date | string
    data: string
    isDeleted?: boolean
  }

  export type alsoKnownAsCreateOrConnectWithoutItemInput = {
    where: alsoKnownAsWhereUniqueInput
    create: XOR<alsoKnownAsCreateWithoutItemInput, alsoKnownAsUncheckedCreateWithoutItemInput>
  }

  export type groupsUpsertWithoutItemsInput = {
    update: XOR<groupsUpdateWithoutItemsInput, groupsUncheckedUpdateWithoutItemsInput>
    create: XOR<groupsCreateWithoutItemsInput, groupsUncheckedCreateWithoutItemsInput>
  }

  export type groupsUpdateWithoutItemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    itemsVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    alsoKnownAs?: alsoKnownAsUpdateManyWithoutGroupNestedInput
  }

  export type groupsUncheckedUpdateWithoutItemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    itemsVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    alsoKnownAs?: alsoKnownAsUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type collection_itemsUpsertWithWhereUniqueWithoutItemInput = {
    where: collection_itemsWhereUniqueInput
    update: XOR<collection_itemsUpdateWithoutItemInput, collection_itemsUncheckedUpdateWithoutItemInput>
    create: XOR<collection_itemsCreateWithoutItemInput, collection_itemsUncheckedCreateWithoutItemInput>
  }

  export type collection_itemsUpdateWithWhereUniqueWithoutItemInput = {
    where: collection_itemsWhereUniqueInput
    data: XOR<collection_itemsUpdateWithoutItemInput, collection_itemsUncheckedUpdateWithoutItemInput>
  }

  export type collection_itemsUpdateManyWithWhereWithoutItemInput = {
    where: collection_itemsScalarWhereInput
    data: XOR<collection_itemsUpdateManyMutationInput, collection_itemsUncheckedUpdateManyWithoutCollection_itemsInput>
  }

  export type collection_itemsScalarWhereInput = {
    AND?: Enumerable<collection_itemsScalarWhereInput>
    OR?: Enumerable<collection_itemsScalarWhereInput>
    NOT?: Enumerable<collection_itemsScalarWhereInput>
    id?: IntFilter | number
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    collection_id?: StringFilter | string
    item_id?: StringFilter | string
  }

  export type alsoKnownAsUpsertWithWhereUniqueWithoutItemInput = {
    where: alsoKnownAsWhereUniqueInput
    update: XOR<alsoKnownAsUpdateWithoutItemInput, alsoKnownAsUncheckedUpdateWithoutItemInput>
    create: XOR<alsoKnownAsCreateWithoutItemInput, alsoKnownAsUncheckedCreateWithoutItemInput>
  }

  export type alsoKnownAsUpdateWithWhereUniqueWithoutItemInput = {
    where: alsoKnownAsWhereUniqueInput
    data: XOR<alsoKnownAsUpdateWithoutItemInput, alsoKnownAsUncheckedUpdateWithoutItemInput>
  }

  export type alsoKnownAsUpdateManyWithWhereWithoutItemInput = {
    where: alsoKnownAsScalarWhereInput
    data: XOR<alsoKnownAsUpdateManyMutationInput, alsoKnownAsUncheckedUpdateManyWithoutAlsoKnownAsInput>
  }

  export type collection_itemsCreateWithoutCollectionInput = {
    createdAt: Date | string
    updatedAt: Date | string
    item: itemsCreateNestedOneWithoutCollection_itemsInput
  }

  export type collection_itemsUncheckedCreateWithoutCollectionInput = {
    id?: number
    createdAt: Date | string
    updatedAt: Date | string
    item_id: string
  }

  export type collection_itemsCreateOrConnectWithoutCollectionInput = {
    where: collection_itemsWhereUniqueInput
    create: XOR<collection_itemsCreateWithoutCollectionInput, collection_itemsUncheckedCreateWithoutCollectionInput>
  }

  export type collection_itemsUpsertWithWhereUniqueWithoutCollectionInput = {
    where: collection_itemsWhereUniqueInput
    update: XOR<collection_itemsUpdateWithoutCollectionInput, collection_itemsUncheckedUpdateWithoutCollectionInput>
    create: XOR<collection_itemsCreateWithoutCollectionInput, collection_itemsUncheckedCreateWithoutCollectionInput>
  }

  export type collection_itemsUpdateWithWhereUniqueWithoutCollectionInput = {
    where: collection_itemsWhereUniqueInput
    data: XOR<collection_itemsUpdateWithoutCollectionInput, collection_itemsUncheckedUpdateWithoutCollectionInput>
  }

  export type collection_itemsUpdateManyWithWhereWithoutCollectionInput = {
    where: collection_itemsScalarWhereInput
    data: XOR<collection_itemsUpdateManyMutationInput, collection_itemsUncheckedUpdateManyWithoutCollection_itemsInput>
  }

  export type collectionsCreateWithoutCollection_itemsInput = {
    id: string
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type collectionsUncheckedCreateWithoutCollection_itemsInput = {
    id: string
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type collectionsCreateOrConnectWithoutCollection_itemsInput = {
    where: collectionsWhereUniqueInput
    create: XOR<collectionsCreateWithoutCollection_itemsInput, collectionsUncheckedCreateWithoutCollection_itemsInput>
  }

  export type itemsCreateWithoutCollection_itemsInput = {
    id: string
    version: number
    data: string
    inconsistent: boolean
    group: groupsCreateNestedOneWithoutItemsInput
    createdAt: Date | string
    updatedAt: Date | string
    isDeleted?: boolean
    alsoKnownAs?: alsoKnownAsCreateNestedManyWithoutItemInput
  }

  export type itemsUncheckedCreateWithoutCollection_itemsInput = {
    id: string
    version: number
    data: string
    inconsistent: boolean
    group_id: number
    createdAt: Date | string
    updatedAt: Date | string
    isDeleted?: boolean
    alsoKnownAs?: alsoKnownAsUncheckedCreateNestedManyWithoutItemInput
  }

  export type itemsCreateOrConnectWithoutCollection_itemsInput = {
    where: itemsWhereUniqueInput
    create: XOR<itemsCreateWithoutCollection_itemsInput, itemsUncheckedCreateWithoutCollection_itemsInput>
  }

  export type collectionsUpsertWithoutCollection_itemsInput = {
    update: XOR<collectionsUpdateWithoutCollection_itemsInput, collectionsUncheckedUpdateWithoutCollection_itemsInput>
    create: XOR<collectionsCreateWithoutCollection_itemsInput, collectionsUncheckedCreateWithoutCollection_itemsInput>
  }

  export type collectionsUpdateWithoutCollection_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type collectionsUncheckedUpdateWithoutCollection_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type itemsUpsertWithoutCollection_itemsInput = {
    update: XOR<itemsUpdateWithoutCollection_itemsInput, itemsUncheckedUpdateWithoutCollection_itemsInput>
    create: XOR<itemsCreateWithoutCollection_itemsInput, itemsUncheckedCreateWithoutCollection_itemsInput>
  }

  export type itemsUpdateWithoutCollection_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    data?: StringFieldUpdateOperationsInput | string
    inconsistent?: BoolFieldUpdateOperationsInput | boolean
    group?: groupsUpdateOneRequiredWithoutItemsNestedInput
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    alsoKnownAs?: alsoKnownAsUpdateManyWithoutItemNestedInput
  }

  export type itemsUncheckedUpdateWithoutCollection_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    data?: StringFieldUpdateOperationsInput | string
    inconsistent?: BoolFieldUpdateOperationsInput | boolean
    group_id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    alsoKnownAs?: alsoKnownAsUncheckedUpdateManyWithoutItemNestedInput
  }

  export type itemsCreateWithoutAlsoKnownAsInput = {
    id: string
    version: number
    data: string
    inconsistent: boolean
    group: groupsCreateNestedOneWithoutItemsInput
    createdAt: Date | string
    updatedAt: Date | string
    isDeleted?: boolean
    collection_items?: collection_itemsCreateNestedManyWithoutItemInput
  }

  export type itemsUncheckedCreateWithoutAlsoKnownAsInput = {
    id: string
    version: number
    data: string
    inconsistent: boolean
    group_id: number
    createdAt: Date | string
    updatedAt: Date | string
    isDeleted?: boolean
    collection_items?: collection_itemsUncheckedCreateNestedManyWithoutItemInput
  }

  export type itemsCreateOrConnectWithoutAlsoKnownAsInput = {
    where: itemsWhereUniqueInput
    create: XOR<itemsCreateWithoutAlsoKnownAsInput, itemsUncheckedCreateWithoutAlsoKnownAsInput>
  }

  export type groupsCreateWithoutAlsoKnownAsInput = {
    id: number
    version: number
    itemsVersion: number
    createdAt: Date | string
    updatedAt: Date | string
    items?: itemsCreateNestedManyWithoutGroupInput
  }

  export type groupsUncheckedCreateWithoutAlsoKnownAsInput = {
    id: number
    version: number
    itemsVersion: number
    createdAt: Date | string
    updatedAt: Date | string
    items?: itemsUncheckedCreateNestedManyWithoutGroupInput
  }

  export type groupsCreateOrConnectWithoutAlsoKnownAsInput = {
    where: groupsWhereUniqueInput
    create: XOR<groupsCreateWithoutAlsoKnownAsInput, groupsUncheckedCreateWithoutAlsoKnownAsInput>
  }

  export type itemsUpsertWithoutAlsoKnownAsInput = {
    update: XOR<itemsUpdateWithoutAlsoKnownAsInput, itemsUncheckedUpdateWithoutAlsoKnownAsInput>
    create: XOR<itemsCreateWithoutAlsoKnownAsInput, itemsUncheckedCreateWithoutAlsoKnownAsInput>
  }

  export type itemsUpdateWithoutAlsoKnownAsInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    data?: StringFieldUpdateOperationsInput | string
    inconsistent?: BoolFieldUpdateOperationsInput | boolean
    group?: groupsUpdateOneRequiredWithoutItemsNestedInput
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    collection_items?: collection_itemsUpdateManyWithoutItemNestedInput
  }

  export type itemsUncheckedUpdateWithoutAlsoKnownAsInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    data?: StringFieldUpdateOperationsInput | string
    inconsistent?: BoolFieldUpdateOperationsInput | boolean
    group_id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    collection_items?: collection_itemsUncheckedUpdateManyWithoutItemNestedInput
  }

  export type groupsUpsertWithoutAlsoKnownAsInput = {
    update: XOR<groupsUpdateWithoutAlsoKnownAsInput, groupsUncheckedUpdateWithoutAlsoKnownAsInput>
    create: XOR<groupsCreateWithoutAlsoKnownAsInput, groupsUncheckedCreateWithoutAlsoKnownAsInput>
  }

  export type groupsUpdateWithoutAlsoKnownAsInput = {
    id?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    itemsVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: itemsUpdateManyWithoutGroupNestedInput
  }

  export type groupsUncheckedUpdateWithoutAlsoKnownAsInput = {
    id?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    itemsVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: itemsUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type itemsUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    data?: StringFieldUpdateOperationsInput | string
    inconsistent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    collection_items?: collection_itemsUpdateManyWithoutItemNestedInput
    alsoKnownAs?: alsoKnownAsUpdateManyWithoutItemNestedInput
  }

  export type itemsUncheckedUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    data?: StringFieldUpdateOperationsInput | string
    inconsistent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    collection_items?: collection_itemsUncheckedUpdateManyWithoutItemNestedInput
    alsoKnownAs?: alsoKnownAsUncheckedUpdateManyWithoutItemNestedInput
  }

  export type itemsUncheckedUpdateManyWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    data?: StringFieldUpdateOperationsInput | string
    inconsistent?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type alsoKnownAsUpdateWithoutGroupInput = {
    item?: itemsUpdateOneRequiredWithoutAlsoKnownAsNestedInput
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type alsoKnownAsUncheckedUpdateWithoutGroupInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type alsoKnownAsUncheckedUpdateManyWithoutAlsoKnownAsInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type collection_itemsUpdateWithoutItemInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collection?: collectionsUpdateOneRequiredWithoutCollection_itemsNestedInput
  }

  export type collection_itemsUncheckedUpdateWithoutItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collection_id?: StringFieldUpdateOperationsInput | string
  }

  export type collection_itemsUncheckedUpdateManyWithoutCollection_itemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collection_id?: StringFieldUpdateOperationsInput | string
  }

  export type alsoKnownAsUpdateWithoutItemInput = {
    group?: groupsUpdateOneRequiredWithoutAlsoKnownAsNestedInput
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type alsoKnownAsUncheckedUpdateWithoutItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    group_id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type collection_itemsUpdateWithoutCollectionInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item?: itemsUpdateOneRequiredWithoutCollection_itemsNestedInput
  }

  export type collection_itemsUncheckedUpdateWithoutCollectionInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item_id?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}