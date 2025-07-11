import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, IconButton } from '@radix-ui/themes';
import { X } from 'lucide-react';

interface Address {
  assigneeNo: number;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  addressType: string;
}

interface AddressSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  onAddressSelect: (address: Address) => void;
  selectedAddress?: Address;
}

export const AddressSelectionPopup: React.FC<AddressSelectionPopupProps> = ({
  isOpen,
  onClose,
  addresses,
  onAddressSelect,
  selectedAddress,
}) => {
  const [selectedAssigneeNo, setSelectedAssigneeNo] = useState<number | null>(null);



  useEffect(() => {
  if (isOpen) {
    // Only reset if no address is currently selected
    if (!selectedAddress) {
      setSelectedAssigneeNo(null);
    } else {
      // Set the current selection based on selectedAddress prop
      setSelectedAssigneeNo(selectedAddress.assigneeNo);
    }
  }
}, [isOpen, selectedAddress]);

  if (!isOpen) return null;

  const handleOk = () => {
    const selected = addresses.find(addr => addr.assigneeNo === selectedAssigneeNo);
    if (selected) {
      onAddressSelect(selected);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Box className="bg-white rounded-lg shadow-lg max-w-5xl w-full mx-4 min-w-[700px] max-h-[80vh] overflow-hidden">
        <Flex justify="between" align="center" p="4" className="border-b">
          <Heading size="3">Select Address</Heading>
          <IconButton variant="soft" color="amber" radius="full" onClick={onClose}>
            <X width="18" height="18" />
          </IconButton>
        </Flex>

        <div className="p-4 overflow-auto max-h-[60vh]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-center border-b"></th>
                  <th className="p-2 text-center border-b">Address No</th>
                  <th className="p-2 text-center border-b">Name</th>
                  <th className="p-2 text-center border-b">Address</th>
                  <th className="p-2 text-center border-b">City</th>
                  <th className="p-2 text-center border-b">Postal Code</th>
                </tr>
              </thead>
              <tbody>
                {addresses.map((address) => (
                  <tr key={address.assigneeNo} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-center">
                      <input
                        type="radio"
                        name="addressSelect"
                        checked={selectedAssigneeNo === address.assigneeNo}
                        onChange={() => setSelectedAssigneeNo(address.assigneeNo)}
                        aria-label={`Select address ${address.assigneeNo}`}
                      />
                    </td>
                    <td className="p-2 text-center">{address.assigneeNo}</td>
                    <td className="p-2 text-center">{address.name}</td>
                    <td className="p-2 text-center">
                      {address.address1}
                      {address.address2 && (
                        <div className="text-sm text-gray-600">{address.address2}</div>
                      )}
                    </td>
                    <td className="p-2 text-center">{address.city}</td>
                    <td className="p-2 text-center">{address.postcode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Flex justify="end" p="4" className="border-t" gap="2">
          <Button size="2" variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 hover:bg-gray-100">
            Cancel
          </Button>
          <Button size="2" variant="solid" onClick={handleOk} disabled={selectedAssigneeNo === null}>
            Select Address
          </Button>
        </Flex>
      </Box>
    </div>
  );
}; 