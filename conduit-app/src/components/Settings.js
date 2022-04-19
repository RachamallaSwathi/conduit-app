import React from "react";
import { validations } from "../utilities/validations";
import { Local_Storage_Key, User_Verify_URL } from "../utilities/constants";
import { withRouter } from "react-router";
import Loader from "./Loader";
import UserContext from "../context/UserContext";

class Settings extends React.Component {
  constructor(props) {
    super();
    this.state = {
      image: "",
      username: "",
      email: "",
      password: "",
      bio: "",
      errors: {
        username: "",
        email: "",
        password: "",
      },
    };
  }
  static contextType = UserContext;
  componentDidMount() {
    let { image, username, email, bio } = this.context.data.user;
    this.setState({ image, username, email, bio });
  }

  handleChange = ({ target }) => {
    let { name, value } = target;
    let { errors } = this.state;
    validations(errors, name, value);
    this.setState({ [name]: value, errors });
  };

  handleSubmit = (event) => {
    let { username, image, password, email, bio, errors } = this.state;
    event.preventDefault();
    if (username && image && password && email && bio) {
      fetch(User_Verify_URL, {
        method: "PUT",
        body: JSON.stringify({
          user: { username, email, password, bio, image },
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage[Local_Storage_Key],
        },
      })
        .then((res) => {
          // console.log(res);
          if (!res.ok) {
            return res.json().then((data) => {
              for (let key in data.errors) {
                errors[key] = `${key} ${data.errors[key]}`;
              }
              return Promise.reject({ errors });
            });
          }
          return res.json();
        })
        .then((data) => {
          this.props.history.push(`/profiles/${data.user.username}`);
        })
        .catch((err) => this.setState({ errors }));
    }
  };

  render() {
    if (
      !this.state.username &&
      !this.state.email &&
      !this.state.image &&
      !this.state.bio
    ) {
      return <Loader />;
    }
    let { username, email, password } = this.state.errors;

    return (
      <main>
        <section className="setting container">
          <form onSubmit={this.handleSubmit}>
            <legend>Settings</legend>
            <fieldset>
              <input
                type="text"
                placeholder="Image Url"
                value={this.state.image}
                onChange={this.handleChange}
                name="image"
              />

              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
              />
              <span>{username}</span>

              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
              <span>{email}</span>

              <input
                type="password"
                name="password"
                value={this.state.password}
                placeholder="Password"
                onChange={this.handleChange}
              />
              <span>{password}</span>

              <textarea
                value={this.state.bio}
                rows="6"
                name="bio"
                placeholder="Enter your Bio"
                onChange={this.handleChange}
              ></textarea>

              <input type="submit" value="Update" className="submit"></input>
            </fieldset>
          </form>
        </section>
      </main>
    );
  }
}

export default withRouter(Settings);