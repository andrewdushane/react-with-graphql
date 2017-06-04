import React from 'react';
import { lifecycle, compose, withState, withProps, withHandlers } from 'recompose';

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
            comments(last: 20) {
              nodes {
                body
                id
              }
            }
          }
        }
      }
    }
  }
}`;

const issueCommentMutation = (issueId, comment) =>
`mutation AddCommentToIssue {
  addComment(input:{subjectId:"${issueId}",clientMutationId:"${gitHubToken}",body:"${comment}"}) {
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

const Issue = ({ title, id, comment, onChange, onSubmit, comments }) => (
  <form onSubmit={onSubmit}>
    <h3>{title}</h3>
    {comments.nodes.map(({ body, id: commentId }) => (
      <div key={commentId}>
        {body}
      </div>
    ))}
    <textarea name={`${id}-comment`} onChange={onChange} value={comment} />
    <button type="submit">Send comment</button>
  </form>
);

const ConnectedIssue = compose(
  withState('comment', 'setComment', ''),
  withHandlers({
    onChange: ({ setComment }) => ({ target: { value } }) => {
      setComment(value);
    },
    onSubmit: ({ id, comment }) => e => {
      e.preventDefault();
      sendQuery(
        'AddCommentToIssue',
        issueCommentMutation(id, comment)
      );
    },
  })
)(Issue);

const Me = ({ login, repos = [] }) => (
  <div>
    <h1>{login}</h1>
    <ul>
      {repos.map(({ name, id: repoId, issues: { nodes } }) => (
        <li key={repoId}>
          <h2>{name}</h2>
          <ol>
            {nodes.map(issue => (
              <ConnectedIssue
                key={issue.id}
                {...issue}
              />
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
