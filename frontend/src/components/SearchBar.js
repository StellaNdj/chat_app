import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { search } from "../endpoints";

const SearchBar = ({onUserSelect}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { token } = useContext(AuthContext);

  const handleSearch = async (e) => {
    e.preventDefault();

    const response = await search({token: token, username: query})
    console.log(response);

    if (response) {
      setResults([response]);
    }
  }

  return (
    <div className="p-2">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for users..."
          className="border rounded-lg p-2 flex-grow"
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg">
          Search
        </button>
      </form>

      {/* Display Search Results */}
      <div className="mt-2">
        {results.map((result) => (
          <div
            key={result.user.id}
            className="cursor-pointer p-2 border-b"
            onClick={() => onUserSelect(result)}
          >
            <p className="font-bold">{result.user.username || result.conversation?.other_user?.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
