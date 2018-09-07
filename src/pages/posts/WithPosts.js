import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { client } from '../../feathers';
// const image= require('./img/128.gif')

class WithPosts extends Component {
  state = {
    posts: []
  };

  componentDidMount() {
    this.fetchFromRemote();
    client.service('posts').on('created', () => this.fetchFromRemote());
    client.service('posts').on('patched', () => this.fetchFromRemote());
    client.service('posts').on('removed', () => this.fetchFromRemote());
    client.service('users').on('patched', () => this.fetchFromRemote());
  }

  fetchFromRemote = () =>
    client
      .service('posts')
      .find({
        query: {
          $sort: {
            createdAt: -1 // sort them by price descending
          }
        }
      })
      .then(res => this.setState({ posts: res.data }));

  render() {
    const { render } = this.props;
    const { posts } = this.state;

    return <div>{render({ posts })}</div>;
  }
}

WithPosts.propTypes = {
  render: PropTypes.func.isRequired
};

export default WithPosts;
