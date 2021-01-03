import React, { useEffect, useRef, useState } from 'react';

import { FilterTheme, FilterThemeOption, Theme, ThemeOption } from 'classes';
import {
  ButtonSpacer,
  CancelButton,
  DeleteButton
} from 'src/components/button';
import { Paragraph } from 'src/components/text';
import css from 'src/styles/components/Modal.module.scss';

import { createCanvasFromContent, downloadImage } from './canvas';
import { Field, FieldRow, Switch } from './form';
import { RadioGroup } from './form/radio';
import { Responsive } from './layout';
import { Modal, ModalProps } from './modal';

export const Curator = ({ content, closeFunction, visible }: CuratorProps) => {
  const [contentTheme, setContentTheme] = useState(ThemeOption.DARK);
  const [filterTheme, setFilterTheme] = useState(FilterThemeOption.PURPLE);
  const [imageSource, setImageSource] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    drawCanvas();
    setCanvasMinHeight();
  }, [visible, contentTheme, filterTheme]);

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
  const toggleFilterTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTheme(e.target.value as FilterThemeOption);
  };

  /** Redraw the canvas with new properties. */
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const content = textRef.current;
    if (canvas !== null && content !== null) {
      createCanvasFromContent(
        canvas,
        content,
        contentTheme,
        filterTheme,
        setImageSource
      );
    }
  };

  /** Download the canvas as an image. */
  const downloadCanvasAsImage = () => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      downloadImage(canvas.toDataURL());
    }
  };

  return (
    <Modal
      visible={visible}
      onHide={closeFunction}
      dialogClassName={'curator-dialog'}
      modalBody={
        <>
          <canvas ref={canvasRef} className={css['curator-canvas']} hidden />
          <img src={imageSource} className={css['curator-image']} />
          <div ref={textRef} hidden>
            <Paragraph>{content}</Paragraph>
          </div>
          <FieldRow className={css['curator-options']}>
            <Field xs={8}>
              <label className={css['curator-label']}>Filter:</label>
              <RadioGroup
                name={'filterTheme'}
                value={filterTheme}
                defaultValue={FilterThemeOption.PURPLE}
                options={FilterTheme.OPTIONS}
                onChange={toggleFilterTheme}
                grid={true}
              />
            </Field>
            <Field xs={4}>
              <label className={css['curator-label']}>Theme:</label>
              <Switch
                onChange={toggleContentTheme}
                checked={!Theme.isLight(contentTheme)}
                checkedIcon={'moon'}
                uncheckedIcon={'sun'}
              />
            </Field>
          </FieldRow>
          <Responsive
            mobileView={
              <div className={css['curator-tip']}>
                Note: Long-press on the image to save it to your camera roll.
              </div>
            }
          />
        </>
      }
      modalFooter={
        <ButtonSpacer>
          <Responsive
            defaultView={
              <>
                <DeleteButton onClick={downloadCanvasAsImage}>
                  Download
                </DeleteButton>
                <CancelButton onClick={closeFunction}>Cancel</CancelButton>
              </>
            }
            mobileView={
              <CancelButton onClick={closeFunction}>Close</CancelButton>
            }
          />
        </ButtonSpacer>
      }
    />
  );
};

interface CuratorProps extends ModalProps {
  content: string;
  closeFunction: () => void;
}
