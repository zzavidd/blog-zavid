import React, { Component } from 'react';
import css from '~/styles/components/button.scss';

export class InvisibleButton extends Component {
  render(){
    return (
      <button {...this.props} className={css.invisibleButton}>
        {this.props.children}
      </button>
    ) 
  }
}