import React, { Component} from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Textarea from 'react-textarea-autosize';

import css from '~/styles/admin.scss';

export default class PostForm extends Component {
  render(){
    const { post } = this.props;

    const { post, heading, confirmText, onConfirm, onCancel, handlers, operation } = this.props;
    const { handleText, handleDate, handleImage } = handlers;

    return (
      <Container className={css.container}>
        <h2>{heading}</h2>

        <Row>
          <Col md={6}>
            <label className={css.label}>Title:</label>
            <input className={css.input} type={'text'} value={post.title} />
          </Col>
        </Row>
        <Row>
          <Col>
            <label className={css.label}>Description:</label>
            <Textarea minRows={4} className={css.textarea} value={post.description} />
          </Col>
        </Row>
        <Row>
          <Col>
            <button onClick={onConfirm}>{confirmText}</button>
            <button onClick={onCancel}>Cancel</button>
          </Col>
        </Row>
      </Container>
    )
  }
}