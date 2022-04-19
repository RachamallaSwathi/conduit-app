import React from "react";
import { Link } from "react-router-dom";
import { Register_URL } from "../utilities/constants";
import { validations } from "../utilities/validations";
import { withRouter } from "react-router";
import UserContext from "../context/UserContext";

class Signup extends React.Component {
  constructor(props) {
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
      errors: {
        username: "",
        password: "",
        email: "",
      },
    };
  }
  static contextType = UserContext;
  handleChange = ({ target }) => {
    let { name, value } = target;
    let errors = this.state.errors;
    validations(errors, name, value);
    this.setState({ [name]: value, errors });
  };

  handleSubmit = (event) => {
    let { email, password, username, errors } = this.state;
    event.preventDefault();
    if (username && password && email) {
      fetch(Register_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ user: { username, password, email } }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((data) => {
              for (let key in data.errors) {
                errors[key] = `${key} ${data.errors[key]}`;
              }
              return Promise.reject(errors);
            });
          }
          return res.json();
        })
        .then(({ user }) => {
          console.log(user);
          // this.props.updateUser(user);
          this.setState({ password: "", email: "", username: "", errors });
          this.props.history.push("/login");
        })
        .catch((errors) => this.setState({ errors }));
    }
  };

  render() {
    let { username, password, email } = this.state.errors;
    return (
      <main className="container">
        <section className="login">
          <form onSubmit={this.handleSubmit}>
            <legend>Sign Up</legend>

            <fieldset className="flex column">
              <input
                type="text"
                placeholder="Enter Username"
                value={this.state.username}
                name="username"
                onChange={(e) => this.handleChange(e)}
              />
              <span>{username}</span>
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
                value="Sign Up"
                className="submit"
                disabled={username || email || password}
              />
            </fieldset>
            <div className="flex center">
              <Link to="/login">
                <span>Already Have an account? </span>
              </Link>
            </div>
          </form>
        </section>
      </main>
    );
  }
}

export default withRouter(Signup);