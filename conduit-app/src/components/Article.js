import React from "react";
import Loader from "./Loader";
import { Link, withRouter } from "react-router-dom";
import { Articles_URL, Local_Storage_Key } from "../utilities/constants";
import CommentBox from "./CommentBox";
import UserContext from "../context/UserContext";

class Article extends React.Component {
  constructor(props) {
    super();
    this.state = {
      article: "",
      error: "",
    };
  }
  static contextType = UserContext;
  componentDidMount() {
    this.getArticle();
  }

  getArticle = () => {
    let slug = this.props.match.params.slug;
    fetch(Articles_URL + `/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        this.setState({ article: data.article });
      })
      .catch((err) => {
        this.setState({ error: "Not able to fetch Articles" });
      });
  };

  getDate = (date) => {
    let newDate = new Date(date).toISOString().split("T")[0];
    return newDate;
  };
  handleEdit = () => {
    let { slug } = this.state.article;
    // console.log(this.props, 'Article props from edit');
    this.props.history.push({
      pathname: `/articles/edit/${slug}`,
      article: this.state.article,
    });
  };

  handleDelete = () => {
    let { user } = this.props;
    // console.log(user.username, 'username');
    fetch(Articles_URL + "/" + this.props.match.params.slug, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage[Local_Storage_Key],
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        this.props.history.push(`/profiles/${user.username}`);
      })
      .catch((err) => console.log(err));
  };

  render() {
    if (this.state.info) {
      throw new Error("Something went wrong");
    }
    let { error, article } = this.state;
    let loggedInUser = this.props?.user?.username;
    let { isLoggedIn, user } = this.context.data;
    // let isLoggedIn = this.context.isLoggedIn;
    // let user = this.props?.user;

    if (error) {
      return <h2>{error}</h2>;
    }

    if (!article) {
      return <Loader />;
    }
    let { tagList } = article;

    return (
      <main>
        {/* hero section */}
        <section className="single-article">
          <div className="container">
            <div className="article-info">
              <h2>{article.title}</h2>
            </div>
            <div className="flex space-between item-center">
              <div className="article-profile flex">
                <Link to={`/profiles/${article.author.username}`}>
                  <img
                    src={article.author.image || "smiley.png"}
                    alt={article.author.username}
                  />
                </Link>
                <div>
                  <p>{article.author.username}</p>
                  <p>{this.getDate(article.createdAt)}</p>
                </div>
              </div>
              <div>
                {isLoggedIn && user.username === article.author.username && (
                  <div className="follow-box">
                    <button onClick={this.handleEdit}>
                      <i className="far fa-edit"></i> Edit
                    </button>
                    <button onClick={this.handleDelete}>
                      <i className="far fa-trash-alt"></i> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="container article-body">
          <p>{article.body}</p>
          <div className="flex">
            <div className="flex">
              {tagList.map((tag) => {
                if (!tag) {
                  return null;
                } else {
                  return (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  );
                }
              })}
            </div>
          </div>
        </section>

        {/* article body */}
        <section className="container">
          <div>
            <CommentBox slug={article.slug} />
            {!isLoggedIn && !loggedInUser && (
              <div>
                <h3>
                  Please
                  <Link to="/login" className="red">
                    Login
                  </Link>
                  to Add Comments on the Article
                </h3>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }
}

export default withRouter(Article);