import React from "react";
import { Articles_URL, Local_Storage_Key } from "../utilities/constants";
import Comments from "./Comments";
import UserContext from "../context/UserContext";

class CommentBox extends React.Component {
  constructor(props) {
    super();
    this.state = {
      inputText: "",
      comments: "",
    };
  }
  static contextType = UserContext;
  componentDidMount() {
    this.getComments();
  }

  handleChange = ({ target }) => {
    let { name, value } = target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let slug = this.props.slug;
    let { inputText } = this.state;
    if (inputText) {
      fetch(Articles_URL + "/" + slug + "/comments", {
        method: "POST",
        body: JSON.stringify({ comment: { body: inputText } }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage[Local_Storage_Key],
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
          console.log(data);
          this.setState({ inputText: "", comments: "" }, this.getComments);
        })
        .catch((err) => console.log(err));
    }
  };

  handleDelete = ({ target }) => {
    let { id } = target.dataset;
    console.log(typeof id);
    let slug = this.props.slug;
    fetch(Articles_URL + "/" + slug + "/comments/" + id, {
      method: "DELETE",
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
        this.setState({ comments: "" }, this.getComments);
      })
      .catch((err) => console.log(err));
  };

  getComments = () => {
    let slug = this.props.slug;
    fetch(Articles_URL + "/" + slug + "/comments")
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then(({ comments }) => {
        console.log(comments);
        this.setState({ comments });
      })
      .catch((err) => console.log(err));
  };

  render() {
    let { inputText, comments } = this.state;
    // let loggedInUser = this.props?.user?.username;
    let loggedInUser = this.context.data?.user?.username;
    console.log(loggedInUser, "user");
    console.log(this.context.data.user);
    // let {isLoggedIn} = this.context.data;
    return (
      <>
        {loggedInUser && (
          <div className="comment-box">
            <form onSubmit={this.handleSubmit}>
              <textarea
                rows="3"
                placeholder="Enter Comments"
                value={inputText}
                onChange={this.handleChange}
                name="inputText"
              ></textarea>
              <div className="post-comment flex space-between">
                <img
                  src={this.context.data.user.image}
                  alt={this.context.data.user.username}
                />
                <input type="submit" value="Post Comment" />
              </div>
            </form>
          </div>
        )}

        <div>
          <Comments comments={comments} handleDelete={this.handleDelete} />
        </div>
      </>
    );
  }
}

export default CommentBox;