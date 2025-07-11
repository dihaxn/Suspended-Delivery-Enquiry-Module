import { MainNavigation as Navigation } from '@cookers/models';
import { NavConfirmationDialog } from '@cookers/modules/shared';
import { useMainNavigationQuery } from '@cookers/queries';
import { configStore } from '@cookers/store';
import { Box } from '@cookers/ui';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ScrollArea } from '@radix-ui/themes';
import { NavLink } from 'react-router-dom';
import { useNavigationBlock } from '../provider/nav-context-provider';
import './main-navigation.css';

// Define your icon mapping here
const iconMapping: any = {
  analytics: fa.faHourglassEmpty,
  leadsAndCustomers: fa.faAddressCard,
  organisation: fa.faCalendarCheck,
  callCycle: fa.faHandshake,
  activityPlanner: fa.faMoneyBill1,
  salesEnquiry: fa.faComment,
  businessRevTemplate: fa.faMehBlank,
  home: fa.faUser,
  about: fa.faWindowMaximize,
  supplierNCR: fa.faFileCode,
};

export const MainNavigation = () => {
  const { navigationData } = useMainNavigationQuery();
  const { handleNavigation, isDialogOpen, confirmNavigation, cancelNavigation } = useNavigationBlock();
  const onNavigate = (path: string) => {
    handleNavigation(path); // Triggers the confirmation dialog if needed
  };
  return (
    <Box>
      <Box className="logo-block">
        <img src="./assets/cookers-icon.svg" alt="Cookers" />
      </Box>
      <Box className="nav-block">
        <ScrollArea type="auto" scrollbars="vertical">
          <ul>
            {navigationData?.map((nav: Navigation) => (
              <li key={nav.moduleCode}>
                <NavLink
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  to={`/${configStore.appName}${nav.path}`}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default navigation action
                    onNavigate(`/${configStore.appName}${nav.path}`); // Trigger custom navigation logic
                  }}
                >
                  <FontAwesomeIcon icon={iconMapping[nav.icon]} size="1x" />
                  <Box>{nav.moduleDesc}</Box>
                </NavLink>
              </li>
            ))}
          </ul>
        </ScrollArea>
        {isDialogOpen && (
          <NavConfirmationDialog isDialogOpen={isDialogOpen} confirmNavigation={confirmNavigation} cancelNavigation={cancelNavigation} />
        )}
      </Box>
      <Box className="footer-block">
        {/* <Button onClick={handleLogout}>Logout</Button> */}
        <p className="text-lg text-cyan-400">© 2025 Cookers.</p>
      </Box>
    </Box>
  );
};
