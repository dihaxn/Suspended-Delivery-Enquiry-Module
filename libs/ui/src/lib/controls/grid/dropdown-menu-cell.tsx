import { Button, DropdownMenu } from '@radix-ui/themes';
import * as fa from '@fortawesome/free-solid-svg-icons';
import { Row, Table } from '@tanstack/react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { setSelectedIncident ,setOpenEdit} from '@cookers/store';

const iconMapping: any = {
  menu: fa.faEllipsisV,
};

export interface MenuProps {
  row: Row<any>;
  table: Table<any>;
}

export const DropdownMenuCell = (props: Readonly<MenuProps>) => {
  const dispatch = useDispatch();
  const ViewClick =() =>{ 
    dispatch(setSelectedIncident(props.row.original));
  };
  const EditClick =() =>{ 
    dispatch(setSelectedIncident(props.row.original));
    dispatch(setOpenEdit(true));
  };
  
  return (
    <DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Button >      
    <FontAwesomeIcon icon={iconMapping.menu} size="1x" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item shortcut="⌘ E" onClick={ViewClick}>View</DropdownMenu.Item>
    <DropdownMenu.Item shortcut="⌘ D" onClick={EditClick}>Edit</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>
    <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
      Delete
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
  );
};






