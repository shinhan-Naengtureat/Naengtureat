import styled from "styled-components";

const StyledButton = styled.button`
  background-color: orange;
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 15px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  transition: background 0.3s ease;

  &:hover {
    background-color: darkorange;
  }

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

export default StyledButton;
