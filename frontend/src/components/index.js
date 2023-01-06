import React from "react";
import { Nav, NavLink, NavMenu }
    from "./NavbarElements";

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavMenu>
          <NavLink to="/home" activeStyle>
            Home
          </NavLink>
          <NavLink to="/about" activeStyle>
            About
          </NavLink>
          <NavLink to="/sign-in" activeStyle>
            Sign In
          </NavLink>
          <NavLink to="/create-account" activeStyle>
            Create Account
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;