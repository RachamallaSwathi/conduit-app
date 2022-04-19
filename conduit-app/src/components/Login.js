import React from "react";
import { Link } from "react-router-dom";
import { validations } from "../utilities/validations";
import { Login_URL } from "../utilities/constants";
import { withRouter } from "react-router";
import UserContext from "../context/UserContext";

class Login extends React.Component {
  constructor(props) {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {
        email: "",
        password: "",
      },
    };
  }
  static contextType = UserContext;
  handleChange = ({ target }) => {
    let { name, value } = target;
    let { errors } = this.state;
    validations(errors, name, value);
    this.setState({ [name]: value, errors });
  };

  handleSubmit = (event) => {
    let { email, password } = this.state;
    event.preventDefault();
    if (password && email) {
      fetch(Login_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ user: { password: password, email } }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then(({ errors }) => {
              return Promise.reject(errors);
            });
          }
          return res.json();
        })
        .then(({ user }) => {
          console.log(user, "From Login");
          this.context.handleUser(user);
          this.setState({ password: "", email: "" });
          this.props.history.push("/articles");
        })
        .catch((error) => {
          this.setState((prevState) => {
            return {
              ...prevState,
              errors: {
                ...prevState.errors,
                email: "Email or Password is incorrect!",
              },
            };
          });
        });
    }
  };

  render() {
    let { email, password } = this.state.errors;
    return (
      <main className="container">
        <section className="login">
          <form onSubmit={this.handleSubmit}>
            <legend>Sign In</legend>

            <fieldset className="flex column">
              <input
                type="text"
                placeholder="Enter Email"
                value={this.state.email}
                name="email"
                onChange={(e) => this.handleChange(e)}
              />
              <span>{email}</span>

              <input
                type="password"
                placeholder="Enter Password"
                value={this.state.password}
                name="password"
                onChange={(e) => this.handleChange(e)}
              />
              <span>{password}</span>

              <input
                type="submit"
                value="Log In"
                className="submit"
                disabled={password || email}
              />
            </fieldset>
            <div className="flex center">
              <Link to="/register">
                <span> New here? </span>
              </Link>
            </div>
          </form>
        </section>
      </main>
    );
  }
}

export default withRouter(Login);