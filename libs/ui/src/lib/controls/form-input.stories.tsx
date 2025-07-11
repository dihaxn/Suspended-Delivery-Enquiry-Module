import { zodResolver } from '@hookform/resolvers/zod';
import { Meta, StoryObj } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button as RadixButton } from '@radix-ui/themes';
import { Button } from '../shadcn/button';
import { FormInput, InputProps } from './form-input';

// Define a Zod schema for validation
const schema = z.object({
  requiredInput: z.string().min(1, 'This field is required'),
  passwordInput: z.string().min(6, 'Password must be at least 6 characters long'),
});

const meta: Meta<typeof FormInput> = {
  title: 'UI/Controls/FormInput',
  component: FormInput,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['s', 'm', 'l'],
      },
    },
    type: {
      control: {
        type: 'select',
        options: ['text', 'password'],
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormInput>;

const Template = (args: InputProps) => {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      requiredInput: '',
      passwordInput: '',
    },
  });
  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput {...args} />
        <Button variant="outline" type="submit">
          Submit
        </Button>
        <RadixButton name="submitRadixButton" type="submit">
          Button
        </RadixButton>
      </form>
    </FormProvider>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    label: 'Default Input',
    name: 'defaultInput',
    type: 'text',
    size: 'm',
    placeHolder: 'Enter text...',
  },
};

export const RequiredField: Story = {
  render: Template,
  args: {
    label: 'Required Input',
    name: 'requiredInput',
    type: 'text',
    size: 'm',
    placeHolder: 'Enter text...',
    required: 'This field is required',
  },
};

export const PasswordField: Story = {
  render: Template,
  args: {
    label: 'Password Input',
    name: 'passwordInput',
    type: 'password',
    size: 'l',
    placeHolder: 'Enter password...',
  },
};
