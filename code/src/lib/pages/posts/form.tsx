import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import type {
  PostContentImageMapping,
  PostDAO,
  PostImage,
  ReactSelectChangeEvent,
  ReactTextAreaChangeEvent,
  Substitutions,
} from 'classes';
import { PostStatic } from 'classes';
import type { GenericFormProps } from 'classes/interfaces/super';
import {
  DynamicField,
  Field,
  FieldRow,
  Form,
  Label,
  LongTextArea,
  NumberInput,
  Select,
  ShortTextArea,
  TextInput,
} from 'src/components/form';
import type { DateType } from 'src/components/form/datepicker';
import DatePicker from 'src/components/form/datepicker';
import { FileSelector, FSAspectRatio } from 'src/components/form/fileselector';
import { Foldable } from 'src/components/form/foldable';
import { cloudinaryBaseUrl } from 'src/components/image';
import type { Handlers } from 'src/lib/hooks';
import { ScreenWidth } from 'src/lib/library';
import css from 'src/styles/pages/Posts.module.scss';

const MAX_NUM_CONTENT_IMAGES = 6;

const PostForm = (props: PostFormProps) => {
  const { post, domains, handlers, isCreateOperation } = props;
  const {
    handleText,
    handleNumber,
    handleTextSave,
    handleSelection,
    handleDate,
    handleFile,
    handleContentImages,
    onTypeChange,
    onStatusChange,
  } = handlers;

  const substitutions: Substitutions = {};
  const contentImages = Object.values(post.contentImages || []);
  contentImages
    .filter((e) => e)
    .forEach(({ source }, key) => {
      if (!source) return;
      if (!source.startsWith('data')) source = `${cloudinaryBaseUrl}/${source}`;
      substitutions[`image${key + 1}`] = `![](${source})`;
    });

  const [isImageVisible, setImageVisible] = useState(false);
  const [isContentImagesVisible, setContentImagesVisible] = useState(false);
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const dispatch = useDispatch();

  const toggleImage = () => {
    setImageVisible(!isImageVisible);
  };

  const toggleContentImages = () => {
    setContentImagesVisible(!isContentImagesVisible);
  };

  const isXXXLarge = useMediaQuery({ query: ScreenWidth.XXXLARGE });
  const fieldSpan = isPreviewVisible ? (isXXXLarge ? 12 : 6) : 6;
  const contentOrder = isPreviewVisible ? (isXXXLarge ? 1 : 2) : 1;

  return (
    <Form
      {...props}
      previewTitle={post.title}
      previewText={post.content}
      substitutions={substitutions}
      onPreviewToggle={setPreviewVisible}
      formClassName={{
        previewOn: css['post-form-pv'],
      }}
      editorClassName={{
        previewOff: css['post-form-editor'],
      }}>
      <FieldRow>
        <Field xl={{ span: fieldSpan, order: contentOrder }}>
          <FieldRow>
            <Field>
              <Label>Content:</Label>
              <LongTextArea
                name={'content'}
                value={post.content!}
                onChange={(e: ReactTextAreaChangeEvent) =>
                  handleTextSave(e, dispatch)
                }
                placeholder={"Write out the post's content..."}
              />
            </Field>
          </FieldRow>
        </Field>
        <Field xl={{ span: fieldSpan, order: contentOrder === 1 ? 2 : 1 }}>
          <FieldRow>
            <Field sm={9}>
              <FieldRow></FieldRow>
              <Label>Title:</Label>
              <TextInput
                name={'title'}
                value={post.title!}
                onChange={handleText}
                placeholder={'Enter the title'}
              />
            </Field>
            <Field sm={3}>
              <Label>Type:</Label>
              <Select
                name={'type'}
                items={PostStatic.TYPES}
                value={post.type}
                onChange={onTypeChange!}
                placeholder={'Select post type'}
              />
            </Field>
          </FieldRow>
          <FieldRow>
            <DynamicField
              sm={4}
              precondition={!PostStatic.isPage(post)}
              dependency={post.type}>
              <Label>Type ID:</Label>
              <NumberInput
                name={'typeId'}
                value={post.typeId!}
                onChange={handleNumber}
                placeholder={'Type ID'}
              />
            </DynamicField>
            <DynamicField
              md={8}
              precondition={PostStatic.isPage(post)}
              dependency={post.type}>
              <Label>Domain</Label>
              <Select
                name={'domainId'}
                items={domains}
                value={post.domainId}
                onChange={handleSelection}
                placeholder={'Select page domain'}
              />
            </DynamicField>
          </FieldRow>
          <FieldRow>
            <Field md={5}>
              <Label>Status:</Label>
              <Select
                name={'status'}
                items={PostStatic.STATUSES}
                value={post.status}
                onChange={onStatusChange}
              />
            </Field>
            <DynamicField
              md={7}
              precondition={PostStatic.isPublish(post)}
              dependency={post.status}>
              <Label>Date Published:</Label>
              <DatePicker
                name={'datePublished'}
                date={post.datePublished!}
                onConfirm={(date: DateType) =>
                  handleDate(date as DateType, 'datePublished')
                }
                placeholderText={'Select the publish date...'}
              />
            </DynamicField>
          </FieldRow>
          <FieldRow>
            <Field>
              <Label>Excerpt:</Label>
              <ShortTextArea
                name={'excerpt'}
                value={post.excerpt!}
                onChange={handleText}
                placeholder={"Enter the post's excerpt..."}
              />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field sm={6}>
              <Foldable
                label={'Upload image'}
                visible={isImageVisible}
                switcher={toggleImage}>
                <Label>Image:</Label>
                <FileSelector
                  image={(post.image as PostImage).source}
                  isCreateOperation={isCreateOperation}
                  onChange={handleFile}
                  aspectRatio={FSAspectRatio.WIDE}
                />
              </Foldable>
            </Field>
          </FieldRow>
          <FieldRow>
            <Field>
              <Foldable
                label={'Upload content images'}
                visible={isContentImagesVisible}
                switcher={toggleContentImages}>
                <Label>Content Images:</Label>
                <div className={css['content-images-wrapper']}>
                  <ContentImages
                    post={post}
                    isCreateOperation={isCreateOperation}
                    handleContentImages={handleContentImages}
                  />
                </div>
              </Foldable>
            </Field>
          </FieldRow>
        </Field>
      </FieldRow>
    </Form>
  );
};

const ContentImages = ({
  post,
  isCreateOperation,
  handleContentImages,
}: PostContentImageInputs) => {
  const contentImages = [];
  for (let i = 0; i < MAX_NUM_CONTENT_IMAGES; i++) {
    const mapping = post.contentImages as PostContentImageMapping;
    const image = mapping[`image${i}`] as PostImage;
    const source = image ? image.source : null;

    contentImages.push(
      <FileSelector
        key={i}
        image={source!}
        isCreateOperation={isCreateOperation}
        onChange={(img) => handleContentImages(img as string, i)}
        aspectRatio={FSAspectRatio.WIDE}
      />,
    );
  }
  return <>{contentImages}</>;
};

export default PostForm;

interface PostFormProps extends GenericFormProps {
  post: PostDAO;
  domains: PostDAO[];
  handlers: Handlers & {
    onTypeChange: (e: ReactSelectChangeEvent) => void;
    onStatusChange: (e: ReactSelectChangeEvent) => void;
  };
  isCreateOperation: boolean;
}

type PostContentImageInputs = {
  post: PostDAO;
  isCreateOperation: boolean;
  handleContentImages: (file: string, i: number) => void;
};
