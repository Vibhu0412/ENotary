import React from 'react';
import { ComponentPreview, Previews } from '@react-buddy/ide-toolbox';
import { PaletteTree } from './palette';
import SigneeSignupForm from '@/pages/auth/common/SigneeSignupForm.jsx';

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path='/ComponentPreviews'>
        <ComponentPreviews />
      </ComponentPreview>
      <ComponentPreview path='/SigneeSignupForm'>
        <SigneeSignupForm />
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;