import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  hello: Scalars['String'];
};

export type HelloWorldQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloWorldQuery = { __typename?: 'Query', hello: string };


export const HelloWorldDocument = gql`
    query HelloWorld {
  hello
}
    `;

/**
 * __useHelloWorldQuery__
 *
 * To run a query within a React component, call `useHelloWorldQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelloWorldQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelloWorldQuery({
 *   variables: {
 *   },
 * });
 */
export function useHelloWorldQuery(baseOptions?: Apollo.QueryHookOptions<HelloWorldQuery, HelloWorldQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HelloWorldQuery, HelloWorldQueryVariables>(HelloWorldDocument, options);
      }
export function useHelloWorldLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelloWorldQuery, HelloWorldQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HelloWorldQuery, HelloWorldQueryVariables>(HelloWorldDocument, options);
        }
export type HelloWorldQueryHookResult = ReturnType<typeof useHelloWorldQuery>;
export type HelloWorldLazyQueryHookResult = ReturnType<typeof useHelloWorldLazyQuery>;
export type HelloWorldQueryResult = Apollo.QueryResult<HelloWorldQuery, HelloWorldQueryVariables>;