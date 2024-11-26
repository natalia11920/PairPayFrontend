import React from "react";
import { Navbar, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const NavbarComponent: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  return (
    <Navbar isBordered isBlurred={false} className="sticky top-0 bg-primary-100 z-50">
      <div className="flex items-center justify-between w-full">
        <NavbarContent className="flex justify-start">
          <NavbarItem className="hidden lg:flex">
            <p className="font-bold">PairPay</p>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="flex justify-center space-x-4">
          <NavbarItem>
            <Link color="foreground" href="/">
              Strona główna
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/bill">
              Rachunki
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/groups">
              Grupy
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/account">
              Moje konto
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="flex justify-end">
          {isLoggedIn ? (
            <NavbarItem>
              <Button color="primary" variant="flat" onClick={onLogout}>
                Wyloguj
              </Button>
            </NavbarItem>
          ) : (
            <NavbarItem>
              <Button as={Link} color="primary" href="/login" variant="flat">
                Zaloguj
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>
      </div>
    </Navbar>
  );
};

export default NavbarComponent;
