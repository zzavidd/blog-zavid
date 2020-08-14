import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { zDate, zRequest } from 'zavid-modules';

import { cloudinaryBaseUrl } from 'components/image.js';
import { Title } from 'components/text.js';
import css from 'styles/Partials.module.scss';

class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      isLoaded: false
    };
  }

  componentDidMount() {
    this.getRecentPosts();
  }

  /**
   * Get 5 most recent posts
   */
  getRecentPosts() {
    zRequest({
      url: '/posts?limit=5&order=desc',
      method: 'GET',
      onSuccess: (posts) => {
        this.setState({
          posts,
          isLoaded: true
        });
      }
    });
  }

  render() {
    const { theme } = this.props;
    return (
      <Container className={css[`sidebar-${theme}`]}>
        <Title>Recent Posts</Title>
        {this.state.posts.map((post, idx) => (
          <div key={idx}>
            <h5>{post.title}</h5>
            {previewImage(post)}
            <small>{zDate.formatDate(post.date, true)}</small>
            <div>{post.type}</div>
          </div>
        ))}
      </Container>
    );
  }
}

/**
 * Retrieve post image if exists
 * @param {object} post - Reference post to image
 * @returns {React.Component} The component.
 */
const previewImage = (post) => {
  if (!post.image) return null;
  return (
    <img
      src={`${cloudinaryBaseUrl}/w_1280,h_720/${post.image}`}
      alt={post.title}
      className={css.image}
    />
  );
};

const mapStateToProps = (state) => ({
  theme: state.theme
});

export default connect(mapStateToProps)(Sidebar);
