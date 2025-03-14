import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import StyledButton from "components/StyleButton";

function App() {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    fetch("/ingredient/hello")
      .then((response) => {
        return response.json();
      })
      .then(function (data) {
        setMessage(data);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ul>
          {message.map((text, index) => (
            <li key={`${index}-${text}`}>{text}</li>
          ))}
        </ul>
      </header>
      <StyledButton>다음</StyledButton>
    </div>
  );
}

export default App;
