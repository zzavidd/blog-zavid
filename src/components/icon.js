import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class Icon extends Component {
  render(){
    const { prefix, name, color, style, className } = this.props;
    return (
      <FontAwesomeIcon
        icon={[prefix || 'fas', name]}
        color={color || 'white'}
        style={{ marginRight: '0.4em', ...style }}
        className={className} />
    ) 
  }
}