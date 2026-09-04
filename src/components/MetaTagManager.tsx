import React from 'react';
import { useMetaTags } from '../hooks/useMetaTags';

export const MetaTagManager: React.FC = () => {
  useMetaTags();
  return null; // Headless component
};
