import {Avatar, AvatarGroup, Card, CardContent, CardHeader} from "@mui/material";


import {FragmentType, getFragmentData, graphql} from "./gql";
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
export const Repo = (props: {
  repo: FragmentType<typeof RepoFragment>
}) => {

  const repo = getFragmentData(RepoFragment, props.repo);

  return (
    <Card key={repo.url}>
      <CardHeader title={<a href={repo.url}>{repo.nameWithOwner}</a>}/>
      <CardContent>
        <h4>{repo.stargazerCount} Stargazers!</h4>
        <AvatarGroup max={50}>
          {repo.stargazers.edges?.map((s, index) =>
            <Avatar src={s?.node.avatarUrl} alt={s?.node.name ?? ''} key={index}/>)}
        </AvatarGroup>
      </CardContent>
    </Card>
  )
}