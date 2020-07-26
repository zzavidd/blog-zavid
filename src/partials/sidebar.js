import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container } from 'react-bootstrap';
import { Title } from 'components/text.js';
import { cloudinary } from 'constants/settings.js';

import { zDate, zRequest } from 'zavid-modules';

import css from 'styles/Partials.module.scss';

class Sidebar extends Component {
  constructor(){
    super();
    this.state = {
      posts: [],
      isLoaded: false
    }
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

  render(){
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
 * @param {Object} post - Reference post to image
 */
const previewImage = (post) => {
  if (!post.image) return null;
  return (
    <img
      src={`${cloudinary.url}/w_1280,h_720/${post.image}`}
      alt={post.title}
      className={css.image} />
  )
}

const mapStateToProps = state => ({
  theme: state.theme
});

export default connect(mapStateToProps)(Sidebar);