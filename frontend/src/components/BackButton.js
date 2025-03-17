import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoChevronBack } from "react-icons/io5"; // 아이콘 사용

const Pressable = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
`;

const IconContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ pressed }) => (pressed ? 0.55 : 1)};
  transition: opacity 0.2s ease-in-out;
`;

const BackButton = ({ onClick }) => {
  const navigate = useNavigate();

  return (
    <Pressable onClick={onClick} aria-label="뒤로 가기">
      <IconContainer>
        <IoChevronBack size={30} color="#F35C04" />
      </IconContainer>
    </Pressable>
  );
};

export default BackButton;
