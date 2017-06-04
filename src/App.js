import React from 'react';
import { lifecycle, compose, withState, withProps } from 'recompose';

const gitHubToken = process.env.REACT_APP_GITHUB_TOKEN;

const sendQuery = (operationName, query) =>
  fetch('https://api.github.com/graphql', {
    headers: {
      'Authorization': `basic ${gitHubToken}`,
    },
    method: 'POST',
    body: JSON.stringify({
      operationName,
      query,
    }),
  });

const viewerQuery =
`query ViewerQuery {
  viewer {
    login
    repositories(last: 20) {
      nodes {
        name
        id
        issues(last: 20) {
          nodes {
            title
            id
          }
        }
      }
    }
  }
}`;

const issueCommentMutation = (issueId) =>
`mutation AddCommentToIssue {
  addComment(input:{subjectId:"${issueId}",clientMutationId:"${gitHubToken}",body:"noice"}) {
    subject {
      id
    }
    clientMutationId
    commentEdge {
      node {
        body
      }
    }
  }
}`;

const Me = ({ login, repos = [] }) => (
  <div>
    <h1>{login}</h1>
    <h2>Issues</h2>
    <ul>
      {repos.map(({ name, id: repoId, issues: { nodes } }) => (
        <li key={repoId}>
          <h3>{name}</h3>
          <ol>
            {nodes.map(({ title, id: issueId }) => (
              <li key={issueId}>
                {title}&nbsp;
                <button
                  onClick={() => {
                    sendQuery('AddCommentToIssue', issueCommentMutation(issueId))
                  }}
                >
                  Add comment
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ul>
  </div>
);

const MeWithData = compose(
  withState('user', 'setUser'),
  lifecycle({
    componentDidMount() {
      sendQuery('ViewerQuery', viewerQuery)
        .then(response => response.json())
        .then(json => this.props.setUser(json.data.viewer));
    }
  }),
  withProps(({ user }) => user ? ({
    login: user.login,
    repos: user.repositories.nodes,
  }) : {}),
)(Me);

const App = () => <MeWithData />;

export default App;
