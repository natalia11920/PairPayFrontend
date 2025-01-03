import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link as NextUILink,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
} from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdownComponent";
import { Icon } from "@iconify/react";

const NavbarComponent = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar
      isBordered
      isBlurred
      className="backdrop-blur-md backdrop-saturate-150 border-b border-divider h-16"
    >
      <NavbarBrand>
        <NextUILink
          className="font-bold text-inherit flex items-center gap-2"
          as={Link}
          to="/home"
        >
          <Icon
            icon="mdi:cash-multiple"
            className="text-secondary"
            width={24}
            height={24}
          />
          <span className="text-secondary">PairPay</span>
        </NextUILink>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem className="flex items-center gap-4">
          <ThemeSwitcher />
          {!isLoggedIn() ? (
            <>
              <NextUILink color="foreground" as={Link} to="/login">
                Login
              </NextUILink>
              <Button as={Link} to="/register" color="secondary" variant="flat">
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <NotificationDropdown />
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    size="sm"
                    icon={user?.name}
                    alt={user?.name}
                    name={user?.name}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem
                    key="profile"
                    className="h-14 gap-2"
                    textValue="Signed in as"
                  >
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{user?.mail}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="settings"
                    startContent={<Icon icon="mdi:cog" />}
                    onPress={() => navigate("settings")}
                  >
                    Settings
                  </DropdownItem>
                  <DropdownItem
                    key="bills"
                    startContent={<Icon icon="mdi:file-document-multiple" />}
                    onPress={() => navigate("bills")}
                  >
                    Bills
                  </DropdownItem>
                  <DropdownItem
                    key="friends"
                    startContent={<Icon icon="mdi:account-group" />}
                    onPress={() => navigate("friends")}
                  >
                    Friends
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    startContent={<Icon icon="mdi:logout" />}
                    onPress={logout}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComponent;
