import React from 'react';

import { Post } from 'classes';
import {
  Form,
  FieldRow,
  Field,
  DynamicField,
  Label,
  TextInput,
  Select,
  ShortTextArea,
  LongTextArea
} from 'components/form';
import { FileSelector, ASPECT_RATIO } from 'components/form/fileselector';
import DatePicker from 'components/form/picker/datepicker';
import { Fader } from 'components/transitioner';
import css from 'styles/pages/Posts.module.scss';

const NUMBER_OF_CONTENT_IMAGES = 6;

const PostForm = (props) => {
  const { post, domains, handlers, isCreateOperation, isLoaded } = props;
  const { handleText, handleDate, handleFile, handleContentImages } = handlers;

  return (
    <Fader determinant={isLoaded} duration={500} hollow={true}>
      <Form {...props} previewText={post.content}>
        <FieldRow>
          <Field sm={8}>
            <Label>Title:</Label>
            <TextInput
              name={'title'}
              value={post.title}
              onChange={handleText}
              placeholder={'Enter the title'}
            />
          </Field>
          <Field sm={4}>
            <Label>Type:</Label>
            <Select
              name={'type'}
              items={Post.typeList}
              value={post.type}
              onChange={handleText}
              placeholder={'Select post type'}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field>
            <Label>Content:</Label>
            <LongTextArea
              name={'content'}
              value={post.content}
              onChange={handleText}
              placeholder={"Write out the post's content..."}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <DynamicField
            md={8}
            precondition={Post.isPage(post.type)}
            dependency={post.type}>
            <Label>Domain</Label>
            <Select
              name={'domainId'}
              items={domains}
              value={post.domainId}
              onChange={handleText}
              placeholder={'Select page domain'}
            />
          </DynamicField>
        </FieldRow>
        <FieldRow>
          <Field md={6}>
            <Label>Status:</Label>
            <Select
              name={'status'}
              items={Post.statusList}
              value={post.status}
              onChange={handleText}
            />
          </Field>
          <DynamicField
            md={6}
            precondition={Post.isPublish(post.status)}
            dependency={post.status}>
            <Label>Date Published:</Label>
            <DatePicker
              name={'datePublished'}
              date={post.datePublished}
              onConfirm={(e) => handleDate(e, 'datePublished')}
              placeholderText={'Select the publish date...'}
            />
          </DynamicField>
        </FieldRow>
        <FieldRow>
          <Field>
            <Label>Excerpt:</Label>
            <ShortTextArea
              name={'excerpt'}
              value={post.excerpt}
              onChange={handleText}
              placeholder={"Enter the post's excerpt..."}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field sm={6}>
            <Label>Image:</Label>
            <FileSelector
              image={post.image.source}
              isCreateOperation={isCreateOperation}
              onChange={handleFile}
              aspectRatio={ASPECT_RATIO.WIDE}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field>
            <Label>Content Images:</Label>
            <div className={css['content-images-wrapper']}>
              <ContentImages
                post={post}
                isCreateOperation={isCreateOperation}
                handleContentImages={handleContentImages}
              />
            </div>
          </Field>
        </FieldRow>
      </Form>
    </Fader>
  );
};

const ContentImages = ({ post, isCreateOperation, handleContentImages }) => {
  const contentImages = [];
  for (let i = 0; i < NUMBER_OF_CONTENT_IMAGES; i++) {
    let source;
    try {
      source = post.contentImages[`image${i}`].source;
    } catch {
      source = null;
    }
    contentImages.push(
      <FileSelector
        key={i}
        image={source}
        isCreateOperation={isCreateOperation}
        onChange={(img) => handleContentImages(img, i)}
        aspectRatio={ASPECT_RATIO.WIDE}
        // className={css['content-images-selector']}
      />
    );
  }
  return contentImages;
};

export default PostForm;
