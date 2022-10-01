import React, { useMemo } from 'react';

import * as zText from 'lib/text';
import TextStyle from 'stylesv2/Components/Text.styles';

export function Paragraph({
  children,
  substitutions,
  ...props
}: ParagraphProps) {
  const text = useMemo(() => {
    if (substitutions) {
      return zText.applySubstitutions(children, substitutions);
    } else {
      return children;
    }
  }, [children, substitutions]);

  return (
    <TextStyle.Collection {...props}>
      {zText.formatText(text)}
    </TextStyle.Collection>
  );
}

interface ParagraphProps extends React.HTMLAttributes<HTMLPreElement> {
  children: string;
  substitutions?: Record<string, string | number>;
}
