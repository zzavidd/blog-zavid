import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';

import { InvisibleButton } from '~/components/button.js';
import { ThemedIcon } from '~/components/icon.js';
import { Title } from '~/components/text.js';
import { zDate, zRequest } from 'zavid-modules';
import { cloudinary } from '~/constants/settings.js';

import css from '~/styles/pages/admin.scss';

class AdminPosts extends Component {
  constructor(){
    super();
    this.state = {
      posts: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    this.getPosts();
  }

  /**
   * Get all posts.
   */
  getPosts = () => {
    zRequest({
      url: '/posts?order=desc',
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
    const { isLoaded, posts } = this.state;

    // if (!isLoaded){
    //   return <Loader/>;
    // } else if (users.length === 0) {
    //   return <Empty message={'No users found.'} />;
    // }

    const items = [];

    for (const [index, item] of posts.entries()) {
      items.push(<Post key={index} idx={index} item={item} />);
    }

    const PostTable = () => {
      const headerRow = (
        <div className={css.header}>
          <span>#</span>
          <span>Title</span>
          <span>Type</span>
          <span>Date Written</span>
          <span>Image</span>
          <span></span>
          <span></span>
        </div>
      )

      return (
        <div className={css.grid}>
          {headerRow}
          {items}
        </div>
      );
    };

    return (
      <div className={css.postTabler}>
        <Title className={css.heading}>All Posts</Title>
        <PostTable/>
      </div>
    );
  }
}

// TODO: Bookmark
class Post extends PureComponent {
  render(){
    const { idx, item } = this.props;

    const EditButton = (
      <InvisibleButton onClick={() => location.href = `/admin/posts/edit/${item.id}`}>
        <ThemedIcon name={'pen-alt'} />
      </InvisibleButton>
    );

    // TODO: Make onClick event functional
    const DeleteButton = (
      <InvisibleButton onClick={() => location.href = `/admin/posts/edit/${item.id}`}>
        <ThemedIcon name={'trash-alt'} />
      </InvisibleButton>
    );

    return (
      <div key={idx} className={css.row}>
        <span>{item.id}</span>
        <span>{item.title}</span>
        <span>{item.type}</span>
        <span>{zDate.formatDate(item.date, true)}</span>
        <span>{previewImage(item)}</span>
        <span>{EditButton}</span>
        <span>{DeleteButton}</span>
      </div>
    )
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
      src={`${cloudinary.url}/h_100/${post.image}`}
      alt={post.title}
      className={css.image} />
  )
}

const mapStateToProps = state => ({
  theme: state.theme
});

export default connect(mapStateToProps)(AdminPosts);