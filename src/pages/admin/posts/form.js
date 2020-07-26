import React, { Component} from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

// import Textarea from 'react-textarea-autosize';
import { zForm } from 'zavid-modules';
import css from '~/styles/app.scss';

const { Label, TextInput, LongTextArea } = zForm;

class PostForm extends Component {
  render(){
    const { post, heading, confirmText, onConfirm, onCancel, handlers, operation, theme } = this.props;
    const { handleText, handleDate, handleImage } = handlers;

    return (
      <Container className={css.container}>
        <h2>{heading}</h2>

        <Row>
          <Col md={6}>
            <Label className={css.label}>Title:</Label>
            <TextInput
              name={'title'}
              className={css.input}
              value={post.title}
              onChange={handleText} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Label className={css.label}>Description:</Label>
            <LongTextArea
              name={'description'}
              className={css.textarea}
              value={post.description}
              onChange={handleText} />
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

const mapStateToProps = state => ({
  theme: state.theme
});

export default connect(mapStateToProps)(PostForm);