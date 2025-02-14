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
    <div className="">
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
        {results.map((result, index) => (
          <div
            key={index}
            className="cursor-pointer p-2 border-b"
            onClick={() => onUserSelect(result)}
          >
            {result.user ? (
                <p className="font-bold">{result.user.username}</p>
              ) : result.conversation ? (
                <p className="font-bold">{result.conversation.other_user.map((user) => user.username)}</p>
              ) : (
                <p className="font-bold">{result.no_user}</p>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
