import {useState} from 'react'
import './App.css'

import {Button} from "@mui/material";
import {Repo} from "./repo.tsx";
import {isDefined} from "./utils.ts";

import {useGhReposQuery} from "./gql/graphql.ts";


function App() {
    const [count, setCount] = useState(0)

    // // URQL hook for getting GitHub repositories with star count
    // const [result] = useQuery({
    //     query: GhReposDocument,
    // })

    const [result] = useGhReposQuery();

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
