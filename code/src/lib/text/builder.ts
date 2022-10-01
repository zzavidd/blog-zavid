import type {
  DeformatTextOptions,
  FormatTextOptions,
  TruncateOptions,
} from 'lib/text/functions';
import {
  applySubstitutions,
  deformatText,
  formatText,
  truncateText,
} from 'lib/text/functions';

export default class zTextBuilder {
  private text: unknown;

  constructor(text: string) {
    this.text = text;
  }

  public formatText(options?: FormatTextOptions): zTextBuilder {
    this.text = formatText(this.text as string, options);
    return this;
  }

  public deformatText(options?: DeformatTextOptions): zTextBuilder {
    this.text = deformatText(this.text as string, options);
    return this;
  }

  public applySubstitutions(
    substitutions: Record<string, string>,
  ): zTextBuilder {
    this.text = applySubstitutions(this.text as string, substitutions);
    return this;
  }

  public truncateText(options?: TruncateOptions): zTextBuilder {
    this.text = truncateText(this.text as string, options);
    return this;
  }

  public build(): unknown {
    return this.text;
  }
}
