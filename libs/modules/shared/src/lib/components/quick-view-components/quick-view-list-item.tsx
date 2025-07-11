import React, { useCallback, useMemo } from 'react';
import { Box, Flex, Heading, Separator, Spinner, Text } from '@radix-ui/themes';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';

export interface QuickViewListItemInfo {
  label: string;
  value: string;
}

export interface QuickViewListItemProps {
  heading: string | React.ReactNode;
  infoList: QuickViewListItemInfo[];
  showSeparator?: boolean;
  showDetails?: boolean;
  isLoading?: boolean;
  setShowDetails?: (show: boolean) => void;
  isDisabled?: boolean;
  disabledTooltip?: string;
  className?: string;
}

interface InfoListItemProps {
  info: QuickViewListItemInfo;
  showSeparator: boolean;
  isLast: boolean;
}

const InfoListItem: React.FC<InfoListItemProps> = React.memo(({ info, showSeparator, isLast }) => (
  <Flex direction="column" justify="between" gap="2">
    <Flex direction="row" justify="between" gap="2">
      <Text color="gray" className="min-w-[100px] text-ellipsis overflow-hidden" size="2">
        {info.label}
      </Text>
      <Text color="gray" weight="bold" className="text-justify" size="2">
        {info.value}
      </Text>
    </Flex>
    {showSeparator && !isLast && <Separator orientation="horizontal" size="4" color="gray" />}
  </Flex>
));

InfoListItem.displayName = 'InfoListItem';

export const QuickViewListItem: React.FC<QuickViewListItemProps> = React.memo(({ 
  heading, 
  infoList, 
  showSeparator = false, 
  showDetails = true, 
  setShowDetails, 
  isLoading = false, 
  isDisabled = false, 
  disabledTooltip,
  className 
}) => {
  const handleToggleDetails = useCallback((show: boolean) => {
    if (!isDisabled && setShowDetails) {
      setShowDetails(show);
    }
  }, [isDisabled, setShowDetails]);

  const chevronIconProps = useMemo(() => ({
    className: `transition-colors ${isDisabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer hover:text-blue-600'}`
  }), [isDisabled]);

  const renderChevronIcon = useCallback((
    IconComponent: typeof ChevronDownIcon | typeof ChevronUpIcon,
    showState: boolean
  ) => {
    const icon = (
      <IconComponent 
        {...chevronIconProps}
        onClick={isDisabled ? undefined : () => handleToggleDetails(!showState)} 
      />
    );

    if (isDisabled && disabledTooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {icon}
          </TooltipTrigger>
          <TooltipContent>
            <p>{disabledTooltip}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return icon;
  }, [chevronIconProps, isDisabled, disabledTooltip, handleToggleDetails]);

  const headingElement = useMemo(() => {
    return typeof heading === 'string' ? (
      <Heading color="gray" className="uppercase" size="3">
        {heading}
      </Heading>
    ) : (
      heading
    );
  }, [heading]);

  return (
    <Flex gap="3" className={`w-full ${className ?? ''}`} direction="column" p="4" pb="0">
      <Box className="bg-white py-4 rounded-lg border border-gray-200">
        <Flex direction="column" className="px-4" gap="2">
          <Flex direction="row" justify="between" align="center">
            {headingElement}
            <Flex direction="row" align="center" gap="2">
              {isLoading && <Spinner />}
              {!showDetails && setShowDetails && renderChevronIcon(ChevronDownIcon, showDetails)}
              {showDetails && setShowDetails && renderChevronIcon(ChevronUpIcon, showDetails)}
            </Flex>
          </Flex>
          {showDetails && infoList.length > 0 && <Separator orientation="horizontal" size="4" color="gray" />}
          {showDetails && infoList.map((info, index) => (
            <InfoListItem 
              key={`${info.label}-${index}`}
              info={info}
              showSeparator={showSeparator}
              isLast={index === infoList.length - 1}
            />
          ))}
        </Flex>
      </Box>
    </Flex>
  );
});

QuickViewListItem.displayName = 'QuickViewListItem';

export default QuickViewListItem;
