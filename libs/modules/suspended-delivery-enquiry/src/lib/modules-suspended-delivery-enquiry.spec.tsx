import { render } from '@testing-library/react';

import ModulesSuspendedDeliveryEnquiry from './modules-suspended-delivery-enquiry';

describe('ModulesSuspendedDeliveryEnquiry', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ModulesSuspendedDeliveryEnquiry />);
    expect(baseElement).toBeTruthy();
  });
});
