import React, { Component} from 'react';
import PostForm from './form';
import { zHandlers, zRequest } from 'zavid-modules';

import { isValidPost } from '~/constants/settings.js';

export default class PostCrud extends Component {
  static async getInitialProps({ query }) {
    return { ...query };
  }

  constructor() {
    super();
    this.state = {
      title: '',
      type: '',
      date: new Date(2020, 1, 1),
      description: '',
      image: '',
      excerpt: '',
    };
  }

  componentDidMount() {
    const { post } = this.props;

    this.setState({
      ...post,
      date: new Date(post.date)
    });
  }

  buildRequest = () => {
    const { title, type, date, description, image, excerpt } = this.state;
    const { operation } = this.props;
    
    const post = {
      title: title.trim(),
      type: type.trim(),
      date: formatISODate(date),
      image,
      description,
      excerpt: excerpt.trim()
    };

    let data;

    if (operation === 'add'){
      data = JSON.stringify({
        post,
        changed: image !== ''
      });
    } else {
      data = JSON.stringify({
        post1: this.props.post,
        post2: post,
        changed: image !== '' && image !== null && !cloudinary.check(image)
      });
    }

    return data;
  }

  /** POST article to the server */
  submitPost = () => {
    if (!isValidPost(this.state)) return;
    const data = this.buildRequest();

    zRequest({
      url:'/post/add',
      method: 'POST',
      body: data,
      onSuccess: () => {
        // TODO: Success alerts on add
        // const { firstname, lastname, backPath } = this.state;
        // setAlert({ type: 'success', message: `You've successfully added member: ${firstname} ${lastname}.` });
        location.href = '/admin/posts';
      }
    });
  }

  /** PUT article on server */
  updatePost = () => {
    if (!isValidPost(this.state)) return;
    const data = this.buildRequest();

    zRequest({
      url: '/post/edit',
      method: 'PUT',
      body: data,
      onSuccess: ({slug}) => {
        // TODO: Success alerts on update
        // const { firstname, lastname, level } = this.state;
        // const isExecutive = level === 'Executive';
        // const backPath = slug === null ? '/team' : isExecutive ? `/executives/${slug}` : `/team/member/${slug}`;

        // setAlert({ type: 'success', message: `You've successfully edited the details of ${firstname} ${lastname}.` });
        // location.href = backPath;
        location.href = '/admin/posts';
      }
    });
  }


  render(){
    const { title, operation } = this.props;
    return (
      <PostForm
        heading={title}
        post={this.state}
        handlers={zHandlers(this)}

        confirmText={operation === 'add' ? 'Submit' : 'Update'}
        onConfirm={operation === 'add' ? this.submitPost : this.updatePost}
        onCancel={() => location.href = '/admin/posts'}

        operation={operation}

        metaTitle={title}
        metaUrl={`/${operation}`} />
    )
  }
}