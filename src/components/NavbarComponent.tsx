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
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface Props {}

const NavbarComponent = (props: Props) => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <Navbar className="bg-content1">
      <NavbarBrand>
        <p className="font-bold text-inherit">PairPay</p>
      </NavbarBrand>
      {/* 
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <NextUILink color="foreground">Features</NextUILink>
        </NavbarItem>
        <NavbarItem isActive>
          <NextUILink aria-current="page" color="primary">
            Customers
          </NextUILink>
        </NavbarItem>
        <NavbarItem>
          <NextUILink color="foreground">Integrations</NextUILink>
        </NavbarItem>
      </NavbarContent> */}

      <NavbarContent justify="end">
        <ThemeSwitcher />
        {!isLoggedIn() ? (
          <>
            <NavbarItem>
              <NextUILink color="primary" as={Link} to="/login">
                Login
              </NextUILink>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} to="/register" color="primary" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name="Jason Hughes"
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                className="bg-content1"
              >
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">zoey@example.com</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="team_settings">My bills</DropdownItem>
                <DropdownItem key="analytics">Friends</DropdownItem>
                {/* <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem> */}
                <DropdownItem key="logout" color="danger" onClick={logout}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComponent;
