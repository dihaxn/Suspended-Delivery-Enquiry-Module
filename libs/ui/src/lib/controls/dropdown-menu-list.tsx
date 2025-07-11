import { DropDownMenuItem } from '@cookers/models';
import * as fa from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, DropdownMenu } from '@radix-ui/themes';
import React from 'react';

const iconMapping: Record<string, fa.IconDefinition> = {
  menu: fa.faEllipsisV,
};

type RowDropdownMenuProps = {
  items: DropDownMenuItem[];
  buttonVariant?: 'solid' | 'soft';
  buttonSize?: '1' | '2';
  btnIcon?: React.ReactNode;
};

export const DropdownMenuList: React.FC<RowDropdownMenuProps> = ({ 
  items, 
  buttonVariant = 'solid', 
  buttonSize = '1',
  btnIcon 
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant={buttonVariant} size={buttonSize} color="gray">
          {btnIcon || <FontAwesomeIcon icon={iconMapping.menu} size="1x" />}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map((item) => (
          <React.Fragment key={item.id}>
            <DropdownMenu.Item 
              className='justify-between' 
              shortcut={item.shortcut} 
              color={item.color} 
              onSelect={item.disabled ? undefined : item.action}
              disabled={item.disabled}
            >
              {item.label}
              {item.btnIcon && <span className="float-right">{item.btnIcon}</span>}
            </DropdownMenu.Item>
            {item.isSeparator && <DropdownMenu.Separator />}
          </React.Fragment>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
