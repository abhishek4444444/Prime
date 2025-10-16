import React from 'react';
import { ICONS } from '../constants';

export interface IconProps {
  className?: string;
}

interface Props extends IconProps {
  name: keyof typeof ICONS;
}

export const Icon: React.FC<Props> = ({ name, className }) => {
  const SvgIcon = ICONS[name];
  if (!SvgIcon) {
    return null;
  }
  return <SvgIcon className={className} />;
};
