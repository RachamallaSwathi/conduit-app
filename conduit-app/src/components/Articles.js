import React from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import UserContext from "../context/UserContext";

class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static contextType = UserContext;

  getDate = (date) => {
    let newDate = new Date(date).toISOString().split("T")[0];
    return newDate;
  };

  render() {
    let { isLoggedIn } = this.context.data;

    let { articles, error } = this.props;
    if (error) {
      return <h2>{error}</h2>;
    }

    if (!articles) {
      return <Loader />;
    }
    if (!articles.length) {
      return <h2>No articles found</h2>;
    }
    return (
      <article className="article">
        {articles.map((article) => {
          console.log(article.tagList);
          return (
            <div key={article.slug} className="post">
              <div className="flex space-between">
                <div className="flex item-center">
                  <Link to={`/profiles/${article.author.username}`}>
                    <img
                      src={article.author.image || "smiley.png"}
                      alt={article.author.username}
                    />
                  </Link>
                  <div>
                    <h5>{article.author.username}</h5>
                    <h6>{this.getDate(article.createdAt)}</h6>
                  </div>
                </div>
                <div className="heart">
                  <i
                    className={
                      isLoggedIn
                        ? "fas fa-heart"
                        : article.favorited
                        ? "fas fa-heart"
                        : "far fa-heart"
                    }
                    onClick={(e) => this.props.handleFavorite(e)}
                    data-id={article.favorited}
                    data-slug={article.slug}
                  ></i>
                  <span>{article.favoritesCount}</span>
                </div>
              </div>
              <h2>{article.title}</h2>
              <p>{article.description}</p>
              <div className="flex space-between">
                <Link to={`/articles/${article.slug}`}>
                  <h4>Read More</h4>
                </Link>
                <div>
                  {article.tagList.map((tag) => {
                    return <span className="tag1">{tag}</span>;
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </article>
    );
  }
}

export default Articles;