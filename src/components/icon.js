import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class Icon extends Component {
  render() {
    const { prefix, name, color, style, className } = this.props;
    return (
      <FontAwesomeIcon
        icon={[prefix || 'fas', name]}
        color={color || 'white'}
        style={{ marginRight: '0.4em', ...style }}
        className={className}
      />
    );
  }
}

class IThemedIcon extends Component {
  render() {
    return (
      <Icon {...this.props} color={this.props.theme === 'light' ? 'black' : 'white'} />
    );
  }
}

const mapStateToProps = state => ({
  theme: state.theme
});

export const ThemedIcon = connect(mapStateToProps)(IThemedIcon);
