import { useAppStateContext } from '@cookers/providers';
import { useProxyUserQuery } from '@cookers/queries';
import { Avatar, Box, Flex, Heading, Text } from '@cookers/ui';
import { getUserFromLocalStorage } from '@cookers/utils';
import { useMemo, useState } from 'react';
import './header.css';
import { useAuthContext } from '@cookers/auth';
import { DropdownMenu } from '@radix-ui/themes';

export const Header = () => {
  const { currentModule } = useAppStateContext();
  const { proxyUserData } = useProxyUserQuery();
  
  const { firstLetter, name, empId, originator, groupDesc } = getUserFromLocalStorage() || {};

  const filteredProxy = useMemo(() => {
    return proxyUserData.map((user) => ({
      label: `${user.empId} - ${user.name}`,
      value: user.originator,
    }));
  }, [proxyUserData]);
  
  const [selectedProxyUser, setSelectedProxyUser] = useState<string | undefined>(() => {
    const savedProxyUser = localStorage.getItem('proxyUser');
    if (savedProxyUser) {
      const userName = JSON.parse(savedProxyUser).name || '';
      return name === userName ? '' : userName;
    }
    return '';
  });

  const handleProxyChange = (data: string) => {
    const filterData = proxyUserData.filter((item) => item.originator === data);
      const proxyUser = {
        userName: data,
        empId: filterData[0].empId,
        name: filterData[0].name,
        firstLetter:filterData[0].name.charAt(0)
      };
      localStorage.setItem('proxyUser', JSON.stringify(proxyUser));
      setSelectedProxyUser(proxyUser.name);
      window.location.reload();
  };
  const handleResetProxy = () => {  
      const proxyUser = {
        userName: originator,
        empId: empId,
        name: name,
        firstLetter:firstLetter
      };
      localStorage.setItem('proxyUser', JSON.stringify(proxyUser));
   
    window.location.reload();
  };
  const { handleLogout } = useAuthContext();
  return (
    <Box className="header">
      <Flex gap="3">
        <Heading size="4"> {currentModule}</Heading>
      </Flex>

      {/* <Flex gap="3" align="center">
        <SelectField data={filteredProxy} onValueChange={handleProxyChange} setDefaultToPlaceholder={true} defaultValue={selectedProxyUser} />
        <Avatar size="2" variant="solid" color="orange" radius="large" fallback={firstLetter} />
        <Flex direction="column">
          <Text size="2" weight="bold">
            {name}
          </Text>
          <Text size="1" color="gray">
            {groupDesc}
          </Text>
        </Flex>
      </Flex> */}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button className="focus:outline-none">
            <Flex gap="3" align="center">
              <Avatar size="2" variant="solid" color="orange" radius="large" fallback={selectedProxyUser==''?firstLetter:selectedProxyUser?.charAt(0)} />
              <Flex direction="column" align="start">
                <Text size="2" weight="bold">
                {selectedProxyUser==''?name:selectedProxyUser}
                </Text>
                <Text size="1" color="gray">
                {selectedProxyUser==''?groupDesc:"Proxy Mode On"}
                </Text>
              </Flex>
              <DropdownMenu.TriggerIcon />
            </Flex>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sideOffset={5} align="end" className="min-w-[200px]">
        {filteredProxy.length>0 &&(
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Select Proxy</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {filteredProxy.map((item) => (
              
                <DropdownMenu.Item key={item.value} onClick={() => {handleProxyChange(item.value)}}> {item.label}</DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
            )}
           {filteredProxy.length>0 &&(<DropdownMenu.Separator />)}
          {selectedProxyUser!=='' && <DropdownMenu.Item color="blue" onClick={() => {handleResetProxy()}}>Proxy Mode Off</DropdownMenu.Item>}
          {selectedProxyUser!==''  &&(<DropdownMenu.Separator />)}
          <DropdownMenu.Item color="red" onClick={handleLogout}>Logout</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
};
