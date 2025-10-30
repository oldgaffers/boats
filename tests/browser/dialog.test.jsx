import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import componentMapper from "@data-driven-forms/mui-component-mapper/component-mapper";
import FormTemplate from "@data-driven-forms/mui-component-mapper/form-template";
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Button, Dialog } from "@mui/material";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('dummy component test', () => {
  test('dummy test rendering', async () => {
    const onSubmit = vi.fn();
    const screen = await render(<Dialog open={true}>
      <Button onClick={onSubmit} >Submit</Button>
    </Dialog>);
    await userEvent.click(screen.getByText('Submit'));
    await sleep(10);
    expect(onSubmit).toBeCalled();
  });
});

const validatorMapper = {
  'same-email': () => (
    value, allValues
  ) => (
    value !== allValues.email ?
      'Email does not match' :
      undefined
  )
}

const schema = {
  fields: [{
    component: componentTypes.TEXT_FIELD,
    name: 'name',
    label: 'Your name',
    isRequired: true,
  }, {
    component: componentTypes.TEXT_FIELD,
    name: 'email',
    label: 'Email',
    isRequired: true,
  }, {
    component: componentTypes.TEXT_FIELD,
    name: 'confirm-email',
    label: 'Confirm email',
    type: 'email',
    isRequired: true,
    validate: [{ type: 'same-email' }]
  }, {
    component: componentTypes.CHECKBOX,
    name: 'newsletters',
    label: 'I want to receive newsletter'
  }]
}

const Form = ({ onSubmit }) => (
  <FormRenderer
    schema={schema}
    componentMapper={componentMapper}
    FormTemplate={FormTemplate}
    onSubmit={onSubmit}
    validatorMapper={validatorMapper}
  />);

describe('ddf component test', () => {
  test('dummy test rendering', async () => {
    const onSubmit = vi.fn();
      const screen = await render(<Form onSubmit={onSubmit} />);
      await userEvent.click(screen.getByText('Submit'));
    await sleep(10);
    expect(onSubmit).toBeCalled();
  });
});

const wizard_schema = {
  "fields": [
    {
      "component": "wizard",
      "name": "Rincewind",
      "fields": [
        {
          "title": "Get started with adding source",
          "name": "step-1",
          "nextStep": "google",
          "fields": [
            {
              "component": "textarea",
              "name": "source-name",
              "type": "text",
              "label": "Source name"
            }
          ]
        },
        {
          "name": "google",
          "title": "Configure google",
          "fields": [
            {
              "component": "text-field",
              "name": "google-field",
              "label": "Google field part"
            }
          ]
        }
      ]
    }
  ]
};

const WizardForm = ({ onSubmit }) => {
  const handleSubmit = (values, formApi) => {
    const { initialValues } = formApi.getState();
    onSubmit(values, initialValues);
  }
  return (<FormRenderer
    schema={wizard_schema}
    componentMapper={componentMapper}
    FormTemplate={(props) => (
      <FormTemplate {...props} showFormControls={false} />
    )}
    onSubmit={handleSubmit}
    validatorMapper={validatorMapper}
    initialValues={{ 'source-name': 'Lee & Perrins', 'google-field': 'googleplex' }}
  />);
};

describe('ddf wizard component test', () => {
  test('dummy test rendering', async () => {
    const onSubmit = vi.fn();
      const screen = await render(<WizardForm onSubmit={onSubmit} />);
      await userEvent.click(screen.getByText('Continue'));
      await userEvent.click(screen.getByText('Submit'));
    await sleep(10);
    expect(onSubmit).toBeCalled();
  });
});