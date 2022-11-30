import React, { useEffect, useRef, useState } from 'react';

import {
  AppTheme,
  FilterShape,
  FilterShapeOption,
  FilterTheme,
  FilterThemeOption,
  Theme,
} from 'classes/theme';
import Checkbox from 'components/Checkbox';
import Input from 'components/Input';
import { Modal } from 'components/Modal';
import { Paragraph } from 'components/Text';
import Canvas from 'constants/canvas';
import Utils from 'constants/utils';
import ZString from 'lib/string';
import { CuratorStyle as CS } from 'styles/Components/Curate.styles';
import FORM from 'styles/Components/Form.styles';
import { ButtonVariant } from 'styles/Variables.styles';

export default function Curator({
  sourceTitle,
  focalText,
  onClose,
  visible,
}: CuratorProps) {
  const [state, setState] = useState({
    contentTheme: AppTheme.DARK,
    filterTheme: FilterThemeOption.PURPLE,
    filterShape: FilterShapeOption.SQUARE,
    imageSource: '',
    isTitleOnly: false,
  });
  const dispatch = Utils.createDispatch(setState);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLPreElement>(null);

  // Redraw the canvas with new properties.
  useEffect(() => {
    (async () => {
      const canvas = canvasRef.current;
      const content = textRef.current;
      if (!canvas || !content) return;

      await Canvas.createFromContent(
        canvas,
        content,
        sourceTitle,
        state.contentTheme,
        state.filterTheme,
        state.filterShape,
        state.isTitleOnly,
        (imageSource) => dispatch({ imageSource }),
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    visible,
    state.contentTheme,
    state.filterTheme,
    state.filterShape,
    state.isTitleOnly,
  ]);

  /** Download the canvas as an image. */
  async function downloadCanvasAsImage() {
    await Canvas.downloadImage(state.imageSource);
  }

  /** Toggle the theme of the image content. */
  function toggleContentTheme() {
    dispatch({ contentTheme: Theme.switchTheme(state.contentTheme) });
  }

  /** Toggle the filter theme of the image background. */
  function toggleFilterTheme(e: React.ChangeEvent<HTMLSelectElement>) {
    dispatch({ filterTheme: e.target.value as FilterThemeOption });
  }

  /** Toggle the filter shape of the image. */
  function toggleFilterShape(e: React.ChangeEvent<HTMLSelectElement>) {
    dispatch({ filterShape: e.target.value as FilterShapeOption });
  }

  /** Toggle whether curation is title only. */
  function toggleTitleOnly(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ isTitleOnly: e.target.checked });
  }

  return (
    <Modal
      visible={visible}
      body={
        <React.Fragment>
          <CS.CanvasBox>
            <CS.Canvas ref={canvasRef} style={{ display: 'none' }} />
            <CS.PreviewImage src={state.imageSource} />
          </CS.CanvasBox>
          <CS.SettingsBox>
            <CS.Tip>
              Tip: Long-press the image to save to your camera roll.
            </CS.Tip>
            <FORM.FieldRow>
              <FORM.Field flex={1}>
                <Checkbox
                  label={'Curate title only'}
                  checked={state.isTitleOnly}
                  onChange={toggleTitleOnly}
                />
              </FORM.Field>
              <FORM.Field flex={1}>
                <Checkbox
                  checked={!Theme.isLight(state.contentTheme)}
                  onChange={toggleContentTheme}
                  label={'Dark theme?'}
                />
              </FORM.Field>
              <Paragraph ref={textRef} hidden>
                {focalText}
              </Paragraph>
            </FORM.FieldRow>
            <FORM.FieldRow>
              <FORM.Field flex={1}>
                <label>Colour:</label>
                <Input.Select
                  value={state.filterTheme}
                  options={FilterTheme.OPTIONS.map((colour) => ({
                    label: ZString.toTitleCase(colour),
                    value: colour,
                  }))}
                  onChange={toggleFilterTheme}
                />
              </FORM.Field>
              <FORM.Field flex={1}>
                <label>Shape:</label>
                <Input.Select
                  name={'filterShape'}
                  value={state.filterShape}
                  options={FilterShape.OPTIONS.map((shape) => ({
                    label: ZString.toTitleCase(shape),
                    value: shape,
                  }))}
                  onChange={toggleFilterShape}
                />
              </FORM.Field>
            </FORM.FieldRow>
          </CS.SettingsBox>
        </React.Fragment>
      }
      footer={
        <React.Fragment>
          <CS.FooterButton
            variant={ButtonVariant.CONFIRM}
            onClick={downloadCanvasAsImage}>
            Download
          </CS.FooterButton>
          <CS.FooterButton variant={ButtonVariant.CANCEL} onClick={onClose}>
            Cancel
          </CS.FooterButton>
        </React.Fragment>
      }
    />
  );
}

interface CuratorProps {
  sourceTitle: string;
  focalText: string;
  visible: boolean;
  onClose: () => void;
}
