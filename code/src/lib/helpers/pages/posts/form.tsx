import React from 'react';
import { useDispatch } from 'react-redux';

// TODO: Turn all components to TypeScript

import {
  PostContentImageMapping,
  PostDAO,
  PostImage,
  PostStatic,
  ReactChangeEvent
} from '../../../../../classes';

import {
  Form,
  FieldRow,
  Field,
  DynamicField,
  Label,
  TextInput,
  NumberInput,
  Select,
  ShortTextArea,
  LongTextArea
} from 'src/components/form';
import {
  FileSelector,
  AspectRatio
} from 'src/components/form/fileselector';
import DatePicker from 'src/components/form/picker/datepicker';
import { cloudinaryBaseUrl } from 'src/components/image';
import { Fader } from 'src/components/transitioner';
import css from 'src/styles/pages/Posts.module.scss';

const NUMBER_OF_CONTENT_IMAGES = 6;

interface PostFormProps {
  isLoaded: boolean;
  post: PostDAO;
  domains: PostDAO[];
  isCreateOperation: boolean;
  handlers: any;
  confirmFunction: Promise<void> | Function;
  confirmButtonText: string;
  cancelFunction: Function;
  isRequestPending: boolean;
}

interface PostContentImageInputs {
  post: PostDAO;
  isCreateOperation: boolean;
  handleContentImages: Function;
}

interface PostImageSubstitutions {
  [key: string]: string;
}

const PostForm = (props: PostFormProps) => {
  const { post, domains, handlers, isCreateOperation, isLoaded } = props;
  const {
    handleText,
    handleTextSave,
    handleDate,
    handleFile,
    handleContentImages,
    setDefaultTypeId
  } = handlers;

  const dispatch = useDispatch();

  const substitutions: PostImageSubstitutions = {};
  const contentImages = Object.values(post.contentImages || []);
  contentImages
    .filter((e) => e)
    .forEach(({ source }, key) => {
      if (!source) return;
      if (!source.startsWith('data')) source = `${cloudinaryBaseUrl}/${source}`;
      substitutions[`image${key + 1}`] = `![](${source})`;
    });

  return (
    <Fader determinant={isLoaded} duration={500} hollow={true}>
      <Form {...props} previewText={post.content} substitutions={substitutions}>
        <FieldRow>
          <Field sm={7}>
            <Label>Title:</Label>
            <TextInput
              name={'title'}
              value={post.title}
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
              onChange={setDefaultTypeId}
              placeholder={'Select post type'}
            />
          </Field>
          <DynamicField
            sm={2}
            precondition={!PostStatic.isPage(post)}
            dependency={post.type}>
            <Label>Type ID:</Label>
            <NumberInput
              name={'typeId'}
              value={post.typeId}
              onChange={handleText}
              placeholder={'Type ID'}
            />
          </DynamicField>
        </FieldRow>
        <FieldRow>
          <Field>
            <Label>Content:</Label>
            <LongTextArea
              name={'content'}
              value={post.content}
              onChange={(e: ReactChangeEvent) => handleTextSave(e, dispatch)}
              placeholder={"Write out the post's content..."}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <DynamicField
            md={8}
            precondition={PostStatic.isPage(post)}
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
              items={PostStatic.STATUSES}
              value={post.status}
              onChange={handleText}
            />
          </Field>
          <DynamicField
            md={6}
            precondition={PostStatic.isPublish(post)}
            dependency={post.status}>
            <Label>Date Published:</Label>
            <DatePicker
              name={'datePublished'}
              date={post.datePublished}
              onConfirm={(e: ReactChangeEvent) =>
                handleDate(e, 'datePublished')
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
              image={(post.image as PostImage).source}
              isCreateOperation={isCreateOperation}
              onChange={handleFile}
              aspectRatio={AspectRatio.WIDE}
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

const ContentImages = ({
  post,
  isCreateOperation,
  handleContentImages
}: PostContentImageInputs): JSX.Element => {
  const contentImages = [];
  for (let i = 0; i < NUMBER_OF_CONTENT_IMAGES; i++) {
    const mapping = post.contentImages as PostContentImageMapping;
    const image = mapping[`image${i}`] as PostImage;
    const source = image ? image.source : null;

    contentImages.push(
      <FileSelector
        key={i}
        image={source}
        isCreateOperation={isCreateOperation}
        onChange={(img: string) => handleContentImages(img, i)}
        aspectRatio={AspectRatio.WIDE}
      />
    );
  }
  return <>{contentImages}</>;
};

export default PostForm;
