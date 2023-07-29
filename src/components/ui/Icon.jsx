import React from 'react';
import { Icon } from '@iconify/react';
const Icons = ({ icon, className, width, rotate, hFlip, vFlip, color }) => {
  return (
    <>
      <Icon
        width={width}
        rotate={rotate}
        hFlip={hFlip}
        icon={icon}
        className={className}
        vFlip={vFlip}
        color={color}
      />
    </>
  );
};

export default Icons;
