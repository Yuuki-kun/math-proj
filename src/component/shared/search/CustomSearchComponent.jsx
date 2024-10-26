import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import "./search.css";
const CustomSearchComponent = () => {
  const [searchActivated, setSearchActivated] = React.useState(false);
  const handleActivateSearch = () => {
    setSearchActivated(!searchActivated);
  };

  const searchRef = React.useRef(null);

  React.useEffect(() => {
    if (searchActivated) {
      searchRef.current.focus();
    }
  }, [searchActivated]);

  return (
    <div className="search-area">
      <div
        className={`head-search-icon head-icon ${
          searchActivated ? "search-activated" : ""
        }`}
      >
        <button
          className="search-button"
          onClick={() => handleActivateSearch()}
        >
          <SearchOutlined />
        </button>
      </div>
      <div
        // className={`search-input-container ${
        //   searchActivated ? "search-activated" : ""
        // }`}
        className="search-input-container"
      >
        <input
          ref={searchRef}
          type="text"
          className={`search-input ${
            searchActivated ? "search-activated" : "search-deactivated"
          }`}
          placeholder="Bạn học gì hôm nay?"
        />
      </div>
    </div>
  );
};

export default CustomSearchComponent;
