import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="container">
      <div className="home">
        <h2>Welcome to Conduit App</h2>
        <Link to="/articles">
          <button>View Articles</button>
        </Link>
      </div>
    </main>
  );
}

export default Home;