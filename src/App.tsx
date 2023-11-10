import {useState} from 'react'
import './App.css'
import {graphql, FragmentType, useFragment} from './gql';

import {useQuery} from "urql";

import {GhReposDocument} from "./gql/graphql.ts";
//import {useGhReposQuery} from "./gql/graphql.ts";

export const RepoFragment = graphql(/* GraphQL */ `
    fragment RepoItem on Repository {
        nameWithOwner
        url
        stargazerCount
      }
`)

const Repo = (props: {
  repo: FragmentType<typeof RepoFragment>
}) => {
  const repo = useFragment( RepoFragment, props.repo);

  return (
      <div key={repo.url}>
          <a href={repo.url}>{repo.nameWithOwner}</a> ({repo.stargazerCount}{' '}
          stars)
      </div>
  )
}


function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

function App() {
    const [count, setCount] = useState(0)

    // // URQL hook for getting GitHub repositories with star count
    const [result] = useQuery({
        query: GhReposDocument,
    })

    // const [result] = useGhReposQuery();

    // Error handling
    if (result.error) {
        return <p>Oh no... {result.error.message}</p>
    }

    // Loading state
    if (result.fetching) {
        return <p>Loading...</p>
    }

    // Display data
    const repositories = result.data?.viewer.repositories.nodes ?? [];
    return (
        <>
            <div>
                <h1>Popular repositories on GitHub for @{result.data?.viewer.login}</h1>
                <div>
                    {repositories.filter(isDefined).map((repo, index) => (
                        <Repo repo={repo} key={index} />
                    ))}
                </div>
                <div dangerouslySetInnerHTML={{__html: result.data?.viewer.bioHTML}} />
            </div>

            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>

            </div>

        </>
    )
}

export default App
