import React, { Component } from 'react';

import css from '~/styles/components/text.scss';

export class Title extends Component {
  render(){
    return (
      <div className={css.title}>
        {this.props.children}
      </div>
    )
  }
}

export class Paragraph extends Component {
  render(){
    return (
      <div className={css.paragraph}>
        {this.props.children}
      </div>
    )
  }
}