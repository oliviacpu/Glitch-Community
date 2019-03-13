import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '../src/components/buttons/button';
import TooltipContainer from '../src/components/tooltips/tooltip-container';
import TextInput from '../src/components/fields/text-input';
import TextArea from '../src/components/fields/text-area';
import Image from '../src/components/image/image';

storiesOf('Button', module)
  .add('regular', () => <Button>Hello Button</Button>)
  .add('cta', () => <Button type="cta">CTA Button</Button>)
  .add('small', () => <Button size="small">Small Button</Button>)
  .add('tertiary', () => (
    <Button type="tertiary" size="small">
      Tertiary (Small) Button
    </Button>
  ))
  .add('danger zone', () => (
    <Button type="dangerZone" size="small">
      Destructive Action
    </Button>
  ));

storiesOf('TooltipContainer', module)
  .add('action', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer type="action" id="a-unique-id" target={<Button>Hover or focus me</Button>} tooltip="I'm an action tooltip" />
    </div>
  ))
  .add('info', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer
        type="info"
        id="a-unique-id"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm an info tooltip"
      />
    </div>
  ))
  .add('persistent', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer
        type="info"
        id="a-unique-id"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm a persistent tooltip"
        persistent
      />
    </div>
  ))
  .add('left and top aligned', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer type="action" id="a-unique-id" target={<Button>Hover or focus me</Button>} tooltip="I'm a tooltip" align={['top', 'left']} />
    </div>
  ));

storiesOf('Text Input', module)
  .add('regular', () => (
    <TextInput placeholder="type something!"/>
  ))
  .add('login', () => (
    <TextInput placeholder="type something!" prefix="@"/>
  ))
  .add('search', () => (
    <TextInput type="search" opaque={true} search={true} placeholder="bots, apps, users"/>
  ))
  .add('with error', () => (
    <TextInput placeholder="glitch" error="That team already exists"/>
  ))
  .add('text area', () => (
    <TextArea placeholder="[Something here] doesn't seem appropriate for Glitch because..." error="Reason is required"/>
  ));

storiesOf('Image', module)
  .add('regular', () => (<Image src='https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg' />));