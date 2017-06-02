# React with GraphQL

[GraphQL](http://graphql.org/) is all about developer experience, both for the client and server. Developing React apps can be faster and smoother with a GraphQL API.

This demo project uses the [GitHub v4 GraphQL API](https://developer.github.com/v4/)  
To view the docs, you'll need to join the Early Access program

The GitHub API requires authentication. For simplicity, this app doesn't authorize with oAuth, so you'll need to obtain a token.  
[Create a personal access token here](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)

To run this project:
  - Create a `.env` file at the root of the project.
  - Add your personal access token: `REACT_APP_GITHUB_TOKEN=yourgithubtoken
  - `yarn` or `npm install`
  - `npm start`

This project was created with [Create React App](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md)
