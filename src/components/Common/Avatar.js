import styled from "styled-components";

export const UserIcon = styled.div`
  background-color: ${props => (props.color ? props.color : "blue")};
  width: ${props => (props.size ? props.size : "25px")};
  height: ${props => (props.size ? props.size : "25px")};
  border-radius: 50%;
  cursor: pointer;
`;
// 유저 아바타 받아와서 표현해야함
export default UserIcon;
