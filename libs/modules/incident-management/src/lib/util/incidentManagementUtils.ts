export const colorSelectorByStatusName = (status: string) => {
    return status === 'Closed'
        ? 'green'
        : status === 'Open'
            ? 'amber'
            : status === 'Waiting for Employee Acceptance'
                ? 'blue'
                : status === 'Waiting for Manager Acceptance'
                    ? 'lime'
                    : 'gray';
};