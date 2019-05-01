import React from 'react';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';

import { Overlay, OverlaySection, OverlayTitle } from './';

const story = storiesOf('Overlays', module);

story.add('generic', () => (
  <Overlay>
    <OverlaySection type="info">
      <OverlayTitle>
        Title
      </OverlayTitle>
    </OverlaySection>
    <OverlaySection type="actions">
      Content Section 1
    </OverlaySection>
    <OverlaySection type="actions">
      Content Section 2
    </OverlaySection>
  </Overlay>
));