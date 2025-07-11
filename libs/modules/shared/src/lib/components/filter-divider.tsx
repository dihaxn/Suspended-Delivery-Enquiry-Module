import React from 'react';

export const FilterDivider = ({ dividerLabel }: { dividerLabel: string }) => {
  return (
    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border my-5">
      <span className="relative z-10 bg-[#f2f6fa] px-2 text-muted-foreground">{dividerLabel}</span>
    </div>
  );
};

export default FilterDivider;
