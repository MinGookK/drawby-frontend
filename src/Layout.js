import React, { Fragment } from "react";
import Header from "./Header";
import styled from "styled-components";
import Sidebar from "./Sidebar";

const Main = styled.main`
  background-color: ${props => (props.color ? props.color : "#fff")};
  display: flex;
  min-height: 1000vh;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  z-index: 1000;
  position: fixed;
  top: 60px;
  background-color: #eee;
`;

const Feed = styled.div`
  position: absolute;
  top: 61px;
  left: 400px;
`;

export default function Layout({ children }) {
  return (
    <Fragment>
      <Header />
      <Line />
      <Sidebar />
      <Main color={children[0]}>
        <Feed>{children[1]}</Feed>
      </Main>
    </Fragment>
  );
}
