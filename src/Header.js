import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import routes from "./routes";
import { useNavigate } from "react-router";
import { isLoggedInVar, logUserOut } from "./Apollo";
import useUser from "./hooks/useUser";
import { useReactiveVar } from "@apollo/client";
import UserIcon from "./components/Common/Avatar";
import { FontSpan } from "./components/Common/Commons";
import { ModalBackground } from "./components/Common/Modal";
import SearchBox from "./components/Header/SearchBar";
const SHeader = styled.header`
  position: fixed;
  top: 0px;
  z-index: 1000;
  width: 100%;
  max-width: 1440px;
  height: 36px;
  padding: 12px 0 12px;
  background: #fff;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.img`
  width: 102.7px;
  height: 30.3px;
  margin-left: 19px;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const BtnContainer = styled.div`
  display: flex;
  margin-right: 40px;
`;

const Button = styled.img`
  cursor: pointer;
  width: 36px;
  margin-right: 10px;
`;

const UserMenuContainer = styled.div`
  position: fixed;
  top: 61px;
  right: 0px;
  width: 280px;
  padding: 12px 5px;
  border-radius: 10px;
  margin-right: 40px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #fff;
`;

const UserMenuBox = styled.div``;

const UserMenuBtns = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserMenuBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 10px;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  :hover {
    background-color: #fafafa;
  }
`;

const UserMenuIcon = styled.img`
  width: 38px;
  height: 38px;
  margin-right: 12px;
`;

const UserMenuArrow = styled.img`
  width: 6px;
  height: 12px;
`;

const UserMenuText = styled(FontSpan)`
  color: #333333;
  font-weight: 300;
  font-size: 15px;
  line-height: 1.33;
`;

export default function Header() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data } = useUser();
  const navigate = useNavigate();
  const goUpload = () => {
    navigate(routes.uploadPhoto);
  };

  const goUserProfile = () => {
    setUserMenu(false);
    navigate(`/profile/${data?.me?.username}`);
  };
  const goUserProfileEdit = () => {
    setUserMenu(false);
    navigate(`/profile/${data?.me?.username}/edit`);
  };

  const goSetting = () => {
    setUserMenu(false);
    navigate(`/setting`);
  };

  const goLogOut = () => {
    setUserMenu(false);
    logUserOut();
    navigate(`/`);
  };

  const [userMenu, setUserMenu] = useState(false);
  const toggleUserMenu = () => {
    setUserMenu(!userMenu);
  };

  function UserMenu() {
    return (
      <UserMenuContainer>
        <UserMenuBox>
          <UserMenuBtns>
            <UserMenuBtn onClick={() => goUserProfile()}>
              <Column>
                <UserMenuIcon src={"/PictureSrc/Copy.png"} />
                <UserMenuText>?????????</UserMenuText>
              </Column>
              <UserMenuArrow src="/PictureSrc/Pass.png" />
            </UserMenuBtn>
            <UserMenuBtn onClick={() => goUserProfileEdit()}>
              <Column>
                <UserMenuIcon src={"/PictureSrc/UserIcon.png"} />
                <UserMenuText>????????? ??????</UserMenuText>
              </Column>
              <UserMenuArrow src="/PictureSrc/Pass.png" />
            </UserMenuBtn>
            <UserMenuBtn onClick={() => goSetting()}>
              <Column>
                <UserMenuIcon src={"/PictureSrc/Setting.png"} />
                <UserMenuText>??????</UserMenuText>
              </Column>
              <UserMenuArrow src="/PictureSrc/Pass.png" />
            </UserMenuBtn>
            <UserMenuBtn onClick={() => goLogOut()}>
              <Column>
                <UserMenuIcon src={"/PictureSrc/LogOut.png"} />
                <UserMenuText>????????????</UserMenuText>
              </Column>
              <UserMenuArrow src="/PictureSrc/Pass.png" />
            </UserMenuBtn>
          </UserMenuBtns>
        </UserMenuBox>
      </UserMenuContainer>
    );
  }

  return (
    <SHeader>
      <Wrapper>
        <Column>
          <Link to={routes.home}>
            <Logo src="/PictureSrc/Logo.png" />
          </Link>
        </Column>
        <Column>
          <SearchBox>?????????</SearchBox>
        </Column>
        {isLoggedIn ? (
          <Column>
            <BtnContainer>
              <Button onClick={goUpload} src="/PictureSrc/Upload.png" />
              <Button src="/PictureSrc/DMHeader.png" />
              <UserIcon
                onClick={toggleUserMenu}
                style={{ cursor: "pointer" }}
                size="36px"
                src={data?.me?.avatar}
              />
            </BtnContainer>
          </Column>
        ) : (
          <Column>
            <Button>?????????</Button>
          </Column>
        )}
      </Wrapper>
      {userMenu && <UserMenu />}
    </SHeader>
  );
}
