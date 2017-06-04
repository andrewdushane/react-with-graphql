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

const usersQuery =
`query UsersQuery {
  organization(login:"github") {
    members(first: 100) {
      edges {
        node {
          name
          avatarUrl
          id
        }
      }
    }
  }
}`;

const viewerQuery =
`query ViewerQuery {
  viewer {
    login
  }
}`;

const Me = ({ login }) => (
  <h1>Your login: {login}</h1>
);

const MeWithData = compose(
  withState('login', 'setLogin', ''),
  lifecycle({
    componentDidMount() {
      sendQuery('ViewerQuery', viewerQuery)
        .then(response => response.json())
        .then(json => this.props.setLogin(json.data.viewer.login));
    }
  })
)(Me);

const App = ({ users }) => (
  <div>
    <MeWithData />
    <h2>Users</h2>
    {users.map(({ name, id }) => <div key={id}>{name}</div>)}
  </div>
);

export default compose(
  withState('users', 'setUsers', []),
  lifecycle({
    componentDidMount() {
      sendQuery('UsersQuery', usersQuery)
        .then(response => response.json())
        .then(json => {
          this.props.setUsers(
            json.data.organization.members.edges.map(({ node }) => node)
          )
        });
    }
  }),
)(App);
