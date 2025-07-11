import React, { useLayoutEffect } from 'react';
import { Box, Flex, Heading, IconButton } from '@radix-ui/themes';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { ModuleBaseLayout, SectionBaseLayout } from '@cookers/ui';
import { MasterFileLogComponent, MasterFileLogFilter } from '@cookers/master-file-log';
import { setMasterFileLogCode, setMasterFileLogMasterFile, setMasterFileLogDisplayName, clearSelectedMasterFileLog } from '@cookers/store';


export interface MasterFileLogPopupProps {
    isOpen: boolean;
    onClose: () => void;
    code: string;
    masterFile: string;
    displayName: string;
}

export const MasterFileLogPopup: React.FC<MasterFileLogPopupProps> = ({
    isOpen,
    onClose,
    code,
    masterFile,
    displayName,
}) => {

    const [resetKey, setResetKey] = React.useState(0);
    const dispatch = useDispatch();

    // Clear immediately when popup opens
    useLayoutEffect(() => {
        if (isOpen) {
            dispatch(clearSelectedMasterFileLog());
            dispatch(setMasterFileLogCode(code));
            dispatch(setMasterFileLogMasterFile(masterFile));
            dispatch(setMasterFileLogDisplayName(displayName));
            // Force component remount by updating resetKey
            setResetKey(prev => prev + 1);
        }
    }, [isOpen, code, masterFile, displayName, dispatch]);

    if (!isOpen) return null;
    
    const main = <SectionBaseLayout main={<MasterFileLogComponent key={`main-${resetKey}`} />} />;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Box className="bg-white rounded-lg shadow-lg max-w-7xl w-full mx-4 min-w-[90vh] max-h-[80vh] overflow-hidden">
                <Flex justify="between" align="center" p="4" className="border-b">
                    <Heading size="3">Master File Log</Heading>
                    <IconButton variant="soft" color="amber" radius="full" onClick={onClose}>
                        <X width="18" height="18" />
                    </IconButton>                </Flex>

                <div className="p-2" style={{ height: '60vh', overflow: 'hidden' }}>
                    <div className="h-full">
                        <ModuleBaseLayout aside={<MasterFileLogFilter key={`filter-${resetKey}`} />} main={main} />
                    </div>
                </div>
            </Box>
        </div>
    );
}; 