import React from "react";
import Loader from "./Loader";
import {
  Articles_URL,
  Profile_URL,
  Local_Storage_Key,
} from "../utilities/constants";
import Articles from "./Articles";
import Pagination from "./Pagination";
import { withRouter, Link } from "react-router-dom";
import UserContext from "../context/UserContext";

class Profile extends React.Component {
  constructor(props) {
    super();
    // console.log(props.user.profile, "User Profile");
    this.state = {
      user: "",
      articles: null,
      articlesCount: null,
      articlesPerPage: 10,
      activePageIndex: 1,
      feedSelected: "author",
      following: "",
      error: "",
    };
  }
  static contextType = UserContext;
  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = () => {
    let { id } = this.props.match.params;
    fetch(Profile_URL + id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage[Local_Storage_Key],
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject();
          });
        }
        return res.json();
      })
      .then(({ profile }) => {
        console.log({ profile });
        this.setState(
          { user: profile, following: profile.following },
          this.getFeedArticles
        );
      })
      .catch((err) => console.log(err));
  };

  componentDidUpdate() {
    let user = this.state.user;
    let { id } = this.props.match.params;
    if (user.username !== id) {
      this.getUserInfo();
    }
  }

  handleClick = ({ target }) => {
    let { id } = target.dataset;
    this.setState({ activePageIndex: id }, this.getFeedArticles);
  };

  updateCurrentPageIndex = (index) => {
    this.setState({ activePageIndex: index }, this.getFeedArticles);
  };

  getFeedArticles = () => {
    let { username } = this.state.user;
    let offset = (this.state.activePageIndex - 1) * 10;
    let token = localStorage[Local_Storage_Key];

    fetch(
      `${Articles_URL}?${this.state.feedSelected}=${username}&limit=${this.state.articlesPerPage}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          articles: data.articles,
          articlesCount: data.articlesCount,
        });
      })
      .catch((err) => {
        this.setState({ error: "Not able to fetch Articles" });
      });
  };
  handleFollow = () => {
    this.getUserInfo();
    let { username } = this.state.user;
    let { following } = this.state;
    let method = following ? "DELETE" : "POST";
    fetch(Profile_URL + "/" + username + "/follow", {
      method: method,
      headers: {
        Authorization: "Bearer " + localStorage[Local_Storage_Key],
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject();
          });
        }
        return res.json();
      })
      .then(({ profile }) => {
        console.log(profile);
        this.setState({ following: profile.following });
      })
      .catch((err) => console.log(err));
  };

  handleFavorite = ({ target }) => {
    let { id, slug } = target.dataset;
    let method = id === "false" ? "POST" : "DELETE";
    console.log(method);
    console.log(id, slug);
    fetch(Articles_URL + "/" + slug + "/favorite", {
      method: method,
      headers: {
        Authorization: "Token " + localStorage[Local_Storage_Key],
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then((data) => {
        this.getFeedArticles();
      })
      .catch((err) => console.log(err));
  };

  render() {
    if (!this.state.user) {
      return <Loader />;
    }
    let { username, image, bio } = this.state.user;
    // let loggedInUser = this.props?.user?.username;
    let loggedInUser = this.context.data?.user?.username;
    let {
      articles,
      error,
      articlesCount,
      activePageIndex,
      articlesPerPage,
      feedSelected,
      following,
    } = this.state;
    return (
      <main>
        <section>
          <div className="profile-banner">
            <div className="container">
              <img src={image} alt={username} />
              <h2>{username}</h2>
              <h3>{bio}</h3>
              <div className="follow-box">
                {loggedInUser && loggedInUser !== username && (
                  <button onClick={this.handleFollow}>
                    <i
                      className={!following ? "fas fa-plus" : "fas fa-minus"}
                    ></i>
                    {!following ? "follow" : "unfollow"}
                  </button>
                )}
                {loggedInUser && loggedInUser === username && (
                  <button>
                    <Link to="/settings">
                      <i className="fas fa-user-edit"></i>Edit Profile
                    </Link>
                  </button>
                )}
              </div>
            </div>
          </div>
          <article>
            <div className="container feed-nav">
              <span
                className={feedSelected === "author" ? "green" : "gray"}
                onClick={() =>
                  this.setState(
                    {
                      feedSelected: "author",
                      activePageIndex: 1,
                    },
                    this.getFeedArticles
                  )
                }
              >
                <i className="fas fa-newspaper"></i>
                Articles written
              </span>
              <span>/</span>
              <span
                className={feedSelected === "favorited" ? "green" : "gray"}
                onClick={() =>
                  this.setState(
                    {
                      feedSelected: "favorited",
                      activePageIndex: 1,
                    },
                    this.getFeedArticles
                  )
                }
              >
                <i className="fas fa-newspaper"></i>
                Favorited
              </span>
            </div>
            <div className="container">
              <Articles
                articles={articles}
                error={error}
                isLoggedIn={this.context.isLoggedIn}
                handleFavorite={this.handleFavorite}
              />
            </div>
          </article>
          <div className="container">
            <Pagination
              articlesCount={articlesCount}
              articlesPerPage={articlesPerPage}
              activePageIndex={activePageIndex}
              handleClick={this.handleClick}
              updateCurrentPageIndex={this.updateCurrentPageIndex}
            />
          </div>
        </section>
      </main>
    );
  }
}

export default withRouter(Profile);