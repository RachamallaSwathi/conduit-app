import React from "react";
import { Tags_URL } from "../utilities/constants";
import Loader from "./Loader";

class Tags extends React.Component {
  constructor(props) {
    super();
    this.state = {
      allTags: null,
      error: "",
    };
  }

  componentDidMount() {
    fetch(Tags_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ tags }) => {
        this.setState({ allTags: tags, error: "" });
      })
      .catch((err) => {
        this.setState({ error: "Not able to fetch Tags" });
      });
  }

  render() {
    let { error, allTags } = this.state;

    if (error) {
      return <h2>{error}</h2>;
    }
    if (!allTags) {
      return <Loader />;
    }
    return (
      <aside className="aside">
        <h2>Tag Cloud</h2>
        <div className="flex warp">
          {allTags.map((tag) => {
            if (tag !== "") {
              return (
                <span
                  key={tag}
                  className="tag"
                  onClick={(e) => this.props.selectTag(e)}
                  data-value={tag}
                >
                  {tag}
                </span>
              );
            } else {
              return null;
            }
          })}
        </div>
      </aside>
    );
  }
}

export default Tags;