import React, {useState} from 'react'
import './App.css'
import {graphql, FragmentType, getFragmentData} from './gql';

import {useQuery} from "urql";

import {GhReposDocument} from "./gql/graphql.ts";
import {Avatar, AvatarGroup, Button, Card, CardContent, CardHeader} from "@mui/material";
//import {useGhReposQuery} from "./gql/graphql.ts";

export const RepoFragment = graphql(/* GraphQL */ `
    fragment RepoItem on Repository {
        nameWithOwner
        url
        stargazerCount
        stargazers(first: 50, orderBy: { field: STARRED_AT, direction: DESC }) {
            edges {
                starredAt
                node {
                    name
                    avatarUrl
                }
            }
            
        }
      }
`)

const Repo = (props: {
  repo: FragmentType<typeof RepoFragment>
}) => {

  const repo = getFragmentData( RepoFragment, props.repo);

  return (
      <Card key={repo.url} >
          <CardHeader title={<a href={repo.url}>{repo.nameWithOwner}</a>} />
          <CardContent>
              <h4>{repo.stargazerCount} Stargazers!</h4>
              <AvatarGroup max={50} >
                  {repo.stargazers.edges?.map(s =>
                      <Avatar src={s?.node.avatarUrl} alt={s?.node.name ?? ''} key={s?.node.name}/>)}
              </AvatarGroup>
          </CardContent>
      </Card>
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
                <Button variant="contained" onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </Button>

            </div>

        </>
    )
}

export default App
