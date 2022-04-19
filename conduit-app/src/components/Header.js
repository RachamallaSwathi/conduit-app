import { NavLink, withRouter } from "react-router-dom";
import { Local_Storage_Key } from "../utilities/constants";
import { useContext } from "react";
import UserContext from "../context/UserContext";

function Header(props) {
  let userData = useContext(UserContext);
  console.log(userData);
  let { isLoggedIn } = userData.data;
  let { handleLogout } = userData;

  function logout() {
    localStorage.removeItem(Local_Storage_Key);
    handleLogout();
    props.history.push("/articles");
  }
  return (
    <header className="header flex space-between">
      <NavLink to="/">
        <h1>Conduit</h1>
      </NavLink>
      <nav className="flex">
        {isLoggedIn ? <AuthHeader handleLogout={logout} /> : <NonAuthHeader />}
      </nav>
    </header>
  );
}

function AuthHeader(props) {
  let userData = useContext(UserContext);
  let { user } = userData.data;
  let { handleLogout } = props;
  return (
    <nav className="nav flex item-center">
      <NavLink
        to={{
          user: props.user,
          pathname: `/profiles/${user.username}`,
        }}
        activeClassName="active-btn"
      >
        <li>
          <img src={user.image || "smiley.png"} alt={user.username} />
          <span>{user.username}</span>
        </li>
      </NavLink>
      <NavLink to="/articles" activeClassName="active-btn">
        Home
      </NavLink>
      <NavLink to="/new-article" activeClassName="active-btn">
        New Article
      </NavLink>
      <NavLink to="/login" onClick={handleLogout}>
        Logout
      </NavLink>
    </nav>
  );
}
function NonAuthHeader(props) {
  return (
    <nav className="flex non-auth-nav item-center">
      <NavLink to="/articles" activeClassName="btn-active">
        Home
      </NavLink>
      <NavLink to="/register" activeClassName="btn-active">
        Sign-Up
      </NavLink>
      <NavLink to="/login" activeClassName="btn-active">
        Log-In
      </NavLink>
    </nav>
  );
}

export default withRouter(Header);