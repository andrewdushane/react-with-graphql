import React from 'react';
import { lifecycle, compose, withState, withProps, withHandlers } from 'recompose';
import moment from 'moment';

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
            number
            comments(last: 20) {
              nodes {
                body
                id
                publishedAt
              }
            }
          }
        }
      }
    }
  }
}`;

const processViewerQuery = setUser =>
  sendQuery('ViewerQuery', viewerQuery)
    .then(response => response.json())
    .then(json => json.data && setUser(json.data.viewer));

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

const Issue = ({ title, id, comment, onChange, onSubmit, comments, number }) => (
  <div>
    <h3>Issue #{number}: {title}</h3>
    {comments.nodes.length > 0 && <h4>Comments:</h4>}
    {comments.nodes.length > 0 && (
      <ul>
        {comments.nodes.map(({ body, id: commentId, publishedAt }) => (
          <li key={commentId}>
            {body} - {moment(publishedAt).fromNow()}
          </li>
        ))}
      </ul>
    )}
    <form onSubmit={onSubmit}>
      <label htmlFor={`${id}-comment`}>Leave a comment:</label>
      <textarea
        name={`${id}-comment`}
        onChange={onChange}
        value={comment}
        placeholder="Enter your comment here"
      />
      <button type="submit" disabled={!comment}>Send comment</button>
    </form>
  </div>
);

const ConnectedIssue = compose(
  withState('comment', 'setComment', ''),
  withHandlers({
    onChange: ({ setComment }) => ({ target: { value } }) => {
      setComment(value);
    },
    onSubmit: ({ id, comment, setComment, setUser }) => e => {
      e.preventDefault();
      setComment('');
      sendQuery(
        'AddCommentToIssue',
        issueCommentMutation(id, comment)
      ).then(() => processViewerQuery(setUser));
    },
  })
)(Issue);

const Me = ({ login, repos = [], setUser }) => (
  <div className="me">
    <h1>{login}: repositories</h1>
    <ul>
      {repos.map(({ name, id: repoId, issues: { nodes } }) => (
        <li key={repoId}>
          <h2>{name}</h2>
          <ol>
            {nodes.map(issue => (
              <ConnectedIssue
                key={issue.id}
                setUser={setUser}
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
      processViewerQuery(this.props.setUser);
    }
  }),
  withProps(({ user }) => user ? ({
    login: user.login,
    repos: user.repositories.nodes,
  }) : {}),
)(Me);

const App = () => <MeWithData />;

export default App;
