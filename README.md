# React with GraphQL

[GraphQL](http://graphql.org/) is all about developer experience, both for the client and server. Developing React apps can be faster and smoother with a GraphQL API.

For large applications, you'll probably want to use a framework, as much of the hard work has been done for you - combining requests, error handling, loading status, etc.  
The two most popular GraphQL frameworks for use with React are:  
  - Facebook's [Relay](https://facebook.github.io/relay/)
  - [Apollo](http://dev.apollodata.com/react/)

## Resources

  - [Queries and mutations](http://graphql.org/learn/queries/)
  - [Thinking in GraphQL](https://facebook.github.io/relay/docs/thinking-in-graphql.html)
  - [graphiql](https://github.com/graphql/graphiql)
  - [GitHub v4 GraphQL API](https://developer.github.com/v4/)


## GitHub GraphQL API

This demo project uses the [GitHub v4 GraphQL API](https://developer.github.com/v4/)  
To view the docs, you'll need to join the Early Access program

The GitHub API requires authentication. For simplicity, this app doesn't authorize with oAuth, so you'll need to obtain a token.  
[Create a personal access token here](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)

## Project details

To run this project:
  - Create a `.env` file at the root of the project.
  - Add your personal access token: `REACT_APP_GITHUB_TOKEN=yourgithubtoken`
  - `yarn` or `npm install`
  - `npm start`

This project was created with [Create React App](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md)
