import React, { useEffect, useRef, useState } from 'react';
import { zString } from 'zavid-modules';

import {
  AppTheme,
  FilterThemeOption,
  FilterShapeOption,
  Theme,
  FilterTheme,
  FilterShape,
} from 'classes/theme';
import { ButtonSpacer, CancelButton, DeleteButton } from 'components/button';
import { Responsive } from 'components/library';
import { Paragraph } from 'components/text';
import Canvas from 'constants/canvas';
import css from 'styles/components/Modal.module.scss';

import { Checkbox, Field, FieldRow, Select, Switch } from './form';
import { RadioGroup } from './form/radio';
import type { ModalProps } from './modal';
import { Modal } from './modal';

export function Curator({
  sourceTitle,
  content,
  closeFunction,
  visible,
}: CuratorProps) {
  const [contentTheme, setContentTheme] = useState(AppTheme.DARK);
  const [filterTheme, setFilterTheme] = useState(FilterThemeOption.PURPLE);
  const [filterShape, setFilterShape] = useState(FilterShapeOption.SQUARE);
  const [imageSource, setImageSource] = useState('');
  const [isTitleOnly, setTitleOnly] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    drawCanvas();
    setCanvasMinHeight();
  }, [visible, contentTheme, filterTheme, filterShape, isTitleOnly]);

  /** Set the minimum height of the canvas to prevent blips on redraw. */
  const setCanvasMinHeight = () => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      const height = canvas.offsetHeight * 2;
      canvas.style.minHeight = `${height}px`;
    }
  };

  /** Toggle the theme of the image content. */
  const toggleContentTheme = () => {
    const theme = Theme.switchTheme(contentTheme);
    setContentTheme(theme);
  };

  /** Toggle the filter theme of the image background. */
  const toggleFilterTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterTheme(e.target.value as FilterThemeOption);
  };

  /** Toggle the filter shape of the image. */
  const toggleFilterShape = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterShape(e.target.value as FilterShapeOption);
  };

  /** Toggle whether curation is title only. */
  const toggleTitleOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleOnly(e.target.checked);
  };

  /** Redraw the canvas with new properties. */
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const content = textRef.current;
    if (canvas !== null && content !== null) {
      Canvas.createFromContent(
        canvas,
        content,
        sourceTitle,
        contentTheme,
        filterTheme,
        filterShape,
        setImageSource,
        isTitleOnly,
      );
    }
  };

  /** Download the canvas as an image. */
  async function downloadCanvasAsImage() {
    const image = imageRef.current;
    if (image !== null) {
      await Canvas.downloadImage(image.src);
    }
  }

  return (
    <Modal
      visible={visible}
      onHide={closeFunction}
      dialogClassName={'curator-dialog'}
      modalBody={
        <React.Fragment>
          <canvas ref={canvasRef} className={css['curator-canvas']} hidden />
          <div className={css['curator-image-container']}>
            <img
              src={imageSource}
              className={css['curator-image']}
              ref={imageRef}
            />
            <div className={css['curator-image-footer']}>
              <Checkbox
                label={'Curate title only'}
                checked={isTitleOnly}
                onChange={toggleTitleOnly}
                className={css['curator-check-group']}
                boxClassName={css['curator-check-box']}
              />
              <Responsive
                mobileView={
                  <div className={css['curator-tip']}>
                    Note: Long-press on the image to save it to your camera
                    roll.
                  </div>
                }
              />
            </div>
          </div>
          <div ref={textRef} hidden>
            <Paragraph>{content}</Paragraph>
          </div>
          <FieldRow className={css['curator-options']}>
            <Field xs={5}>
              <label className={css['curator-label']}>Colour:</label>
              <Select
                value={filterTheme}
                items={FilterTheme.OPTIONS.map((colour) => ({
                  label: zString.toTitleCase(colour),
                  value: colour,
                }))}
                onChange={toggleFilterTheme}
                className={css['curator-colour-select']}
              />
            </Field>
            <Field xs={4}>
              <label className={css['curator-label']}>Shape:</label>
              <RadioGroup
                name={'filterShape'}
                value={filterShape}
                options={FilterShape.OPTIONS}
                onChange={toggleFilterShape}
              />
            </Field>
            <Field xs={3}>
              <label className={css['curator-label']}>Theme:</label>
              <Switch
                onChange={toggleContentTheme}
                checked={!Theme.isLight(contentTheme)}
                checkedIcon={'moon'}
                uncheckedIcon={'sun'}
              />
            </Field>
          </FieldRow>
        </React.Fragment>
      }
      modalFooter={
        <ButtonSpacer>
          <Responsive
            defaultView={
              <React.Fragment>
                <DeleteButton onClick={downloadCanvasAsImage}>
                  Download
                </DeleteButton>
                <CancelButton onClick={closeFunction}>Cancel</CancelButton>
              </React.Fragment>
            }
            mobileView={
              <CancelButton
                onClick={closeFunction}
                className={css['curator-close-button']}>
                Close
              </CancelButton>
            }
          />
        </ButtonSpacer>
      }
    />
  );
}

interface CuratorProps extends ModalProps {
  sourceTitle: string;
  content: string;
  closeFunction: () => void;
}
