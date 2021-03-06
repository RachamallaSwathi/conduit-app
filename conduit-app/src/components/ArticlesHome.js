import React from "react";
import Articles from "./Articles";
import Tags from "./Tags";
import {
  Articles_URL,
  Feed_URL,
  Local_Storage_Key,
} from "../utilities/constants";
import Pagiantion from "./Pagination";
import UserContext from "../context/UserContext";
import Hero from "./Hero";

class ArticlesHome extends React.Component {
  constructor(props) {
    super();

    this.state = {
      articles: null,
      error: "",
      articlesCount: 0,
      articlesPerPage: 10,
      activePageIndex: 1,
      tagSelected: "",
      feedSelected: "",
    };
  }
  static contextType = UserContext;
  componentDidMount() {
    let { isLoggedIn } = this.context.data;
    if (isLoggedIn) {
      this.setState({ feedSelected: "myfeed" }, this.myFeed);
    } else {
      this.setState({ feedSelected: "global" }, this.getArticles);
    }
  }
  componentDidUpdate(_prevProps, prevState) {
    if (
      prevState.activePageIndex !== this.state.activePageIndex ||
      prevState.tagSelected !== this.state.tagSelected
    ) {
      this.getArticles();
    }
  }
  updateCurrentPageIndex = (index) => {
    this.setState(
      { activePageIndex: index },
      this.state.feedSelected === "myfeed" ? this.myFeed : this.getArticles
    );
  };

  getArticles = () => {
    let limit = this.state.articlesPerPage;
    let offset = (this.state.activePageIndex - 1) * 10;
    let tag = this.state.tagSelected;
    let token = localStorage[Local_Storage_Key];
    fetch(
      Articles_URL +
        `/?offset=${offset}&limit=${limit}` +
        (tag && `&tag=${tag}`),
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
        console.log({ data });
        this.setState({
          articles: data.articles,
          articlesCount: data.articlesCount,
        });
      })
      .catch((err) => {
        this.setState({ error: "Not able to fetch Articles" });
      });
  };

  selectTag = ({ target }) => {
    let { value } = target.dataset;
    this.setState({ tagSelected: value }, this.getArticles());
  };

  myFeed = () => {
    let offset = (this.state.activePageIndex - 1) * 10;
    let token = localStorage[Local_Storage_Key];
    fetch(Feed_URL + `?/limit=${this.state.articlesPerPage}&skip=${offset}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data ,"from my feed");
        this.setState({
          articles: data.articles,
          articlesCount: data.articlesCount,
          feedSelected: "myfeed",
          tagSelected: "",
        });
      })

      .catch((err) => this.setState({ error: "Not able to fetch Articles" }));
  };
  handleFavorite = ({ target }) => {
    let { isLoggedIn } = this.context.data;
    let { id, slug } = target.dataset;
    let method = id === "false" ? "POST" : "DELETE";
    console.log(method);
    console.log(id, slug);
    if (isLoggedIn) {
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
          if (this.state.feedSelected === "myfeed") {
            this.myFeed();
          } else {
            this.getArticles();
          }
        })
        .catch((err) => console.log(err));
    }
  };

  render() {
    let { isLoggedIn } = this.context.data;
    let {
      articles,
      error,
      articlesCount,
      articlesPerPage,
      activePageIndex,
      feedSelected,
    } = this.state;

    return (
      <>
        <Hero />
        <main className="container">
          <section className="flex space-between ">
            <div className="col-1">
              <div className="feed-nav flex">
                <span
                  className={feedSelected === "global" ? "green" : "gray"}
                  onClick={() =>
                    this.setState(
                      {
                        tagSelected: "",
                        feedSelected: "global",
                      },
                      this.getArticles
                    )
                  }
                >
                  <i className="fas fa-newspaper"></i>
                  Global Feed
                </span>
                <span
                  className={
                    !isLoggedIn
                      ? "hidden"
                      : feedSelected === "myfeed"
                      ? "green"
                      : "gray"
                  }
                  onClick={this.myFeed}
                >
                  {" "}
                  <i className="fas fa-newspaper"></i>
                  My feed
                </span>
                <div className={this.state.tagSelected ? "visible" : "hidden"}>
                  <span>/</span>
                  <span># {this.state.tagSelected}</span>
                </div>
              </div>
              <Articles
                articles={articles}
                error={error}
                handleFavorite={this.handleFavorite}
              />
            </div>
            <div className="col-2">
              <Tags selectTag={this.selectTag} tag={this.state.tagSelected} />
            </div>
          </section>
          <div>
            <Pagiantion
              articlesCount={articlesCount}
              articlesPerPage={articlesPerPage}
              activePageIndex={activePageIndex}
              updateCurrentPageIndex={this.updateCurrentPageIndex}
            />
          </div>
        </main>
      </>
    );
  }
}

export default ArticlesHome;