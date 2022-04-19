import React from "react";
import { withRouter } from "react-router";
import { Articles_URL, Local_Storage_Key } from "../utilities/constants";

class NewArticle extends React.Component {
  state = {
    title: "",
    description: "",
    tags: "",
    body: "",
    error: "",
  };
  handleChange = ({ target }) => {
    let { name, value } = target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let { title, description, tags, body } = this.state;
    tags = tags.split(",").map((tag) => tag.trim());
    let token = localStorage[Local_Storage_Key];
    console.log(tags, token);

    fetch(Articles_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        article: { title, description, tagList: tags, body },
      }),
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
        this.props.history.push(`/articles/${data.article.slug}`);
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          title: "",
          description: "",
          body: "",
          tags: "",
          error: "",
        });
      });
  };

  render() {
    return (
      <main>
        <section className="new-article container">
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="Enter Title"
              value={this.state.title}
              name="title"
              onChange={(e) => this.handleChange(e)}
            ></input>
            <input
              type="text"
              placeholder="What's this article about?"
              value={this.state.description}
              name="description"
              onChange={(e) => this.handleChange(e)}
            ></input>
            <textarea
              type="text"
              placeholder="Write your article (In markdown format)"
              value={this.state.body}
              rows="6"
              name="body"
              onChange={(e) => this.handleChange(e)}
            ></textarea>
            <input
              type="text"
              placeholder="Enter Tags"
              value={this.state.tags}
              name="tags"
              onChange={(e) => this.handleChange(e)}
            ></input>
            <input type="submit" value="Publish Article" className="submit" />
          </form>
        </section>
      </main>
    );
  }
}
export default withRouter(NewArticle);