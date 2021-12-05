import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";
import UserIcon from "../components/Common/Avatar";
import useUser from "../hooks/useUser";
import Gallery from "../components/Gallery";
import { useNavigate } from "react-router";
import routes from "../routes";
import { FontSpan } from "../components/Common/Commons";

const SUserProfile = styled.div`
  display: flex;
  margin-top: 30px;
  justify-content: space-between;
`;

const UserContainer = styled.div`
  display: flex;
`;

const UserInfo = styled.div`
  margin-left: 60px;
`;

const Username = styled(FontSpan)`
  margin-bottom: 20px;
  padding-top: 14px;
  font-size: 28px;
  line-height: 0.64;
  letter-spacing: normal;
  justify-content: center;
  text-align: left;
  color: #333;
`;

const FollowBox = styled.div`
  display: flex;
  height: 28px;
  padding: 4px 10px;
  border-radius: 17px;
  background-color: #ecf1f6;
`;

const FollowBtn = styled(FontSpan)`
  margin: 4px 10px;
  height: 28px;
  font-size: 14px;
  line-height: 1.29;
  color: #999;
  line-height: 1.29;
`;

const Bio = styled(FontSpan)`
  margin-bottom: 12px;
  font-size: 15px;
  line-height: 1.2;
  color: #797979;
`;

const FollowContainer = styled.div`
  display: flex;
`;

const FollowText = styled(FontSpan)`
  font-size: 14px;
  line-height: 1.29;
  color: #333;
  margin-right: 30px;
`;

const UserPictureContainer = styled.div``;

const Line = styled.div`
  width: 680px;
  height: 2px;
  margin: 40px 0 14px;
  background-color: #eee;
`;

const GalleryBtns = styled.div`
  display: flex;
  gap: 70px;
  justify-content: center;
`;

const GalleryBtn = styled.div`
  display: flex;
`;

const OnLine = styled.div`
  width: 100px;
  height: 2px;
  position: relative;
  bottom: 16px;
  background-color: ${props => (props.color ? "#0e3870" : "#eee")};
`;

const GalleryIcon = styled.img`
  /* width: 16px; */
  height: 16px;
`;

const GalleryText = styled(FontSpan)`
  color: ${props => (props.color ? props.color : "#ccc")};
  margin-left: 6px;
  font-size: 14px;
  line-height: 1.29;
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      username
      email
      avatar
      bio
      pictures {
        id
        caption
        file
        name
        totalLike
      }
      isMe
      totalFollowers
      totalFollowings
      isFollowing
    }
  }
`;

function UserProfile() {
  const navigate = useNavigate();
  const usernameMingo = "dabin";
  const { data: userData } = useUser();
  if (!userData) {
    navigate(routes.home);
  }
  const { data } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: usernameMingo
    }
  });

  const [gallery, setGallery] = useState(0);
  const changeGallery = e => {
    setGallery(e);
  };
  return (
    <Fragment>
      <SUserProfile>
        <UserContainer>
          <UserIcon size="140px" />
          <UserInfo>
            <Username>{data?.seeProfile?.username}</Username>
            <Bio>bio</Bio>
            <FollowContainer>
              <FollowText>팔로워 {data?.seeProfile?.totalFollowers}</FollowText>
              <FollowText>
                팔로잉 {data?.seeProfile?.totalFollowings}{" "}
              </FollowText>
            </FollowContainer>
          </UserInfo>
        </UserContainer>
        <FollowBox>
          <FollowBtn>
            {data?.seeProfile?.isMe
              ? "Edit Profile"
              : data?.seeProfile?.isFollowing
              ? "Unfollow"
              : "Follow"}
          </FollowBtn>
        </FollowBox>
      </SUserProfile>
      <UserPictureContainer>
        <Line />
        <GalleryBtns>
          <div onClick={() => setGallery(0)}>
            <OnLine color={gallery === 0} />
            {gallery === 0 ? (
              <GalleryBtn>
                <GalleryIcon src="/PictureSrc/UserGalleryOn.png" />
                <GalleryText color="#0e3870">개인 갤러리</GalleryText>
              </GalleryBtn>
            ) : (
              <GalleryBtn>
                <GalleryIcon src="/PictureSrc/UserGalleryOff.png" />
                <GalleryText>개인 갤러리</GalleryText>
              </GalleryBtn>
            )}
          </div>
          <div onClick={() => setGallery(1)}>
            <OnLine color={gallery === 1} />
            {gallery === 1 ? (
              <GalleryBtn>
                <GalleryIcon src="/PictureSrc/ContestGalleryOn.png" />
                <GalleryText color="#0e3870">콘테스트 작품</GalleryText>
              </GalleryBtn>
            ) : (
              <GalleryBtn>
                <GalleryIcon src="/PictureSrc/ContestGalleryOff.png" />
                <GalleryText>콘테스트 작품</GalleryText>
              </GalleryBtn>
            )}
          </div>
          <div onClick={() => setGallery(2)}>
            <OnLine color={gallery === 2} />
            {gallery === 2 ? (
              <GalleryBtn>
                <GalleryIcon src="/PictureSrc/BookmarkOn.png" />
                <GalleryText color="#0e3870">북마크한 작품</GalleryText>
              </GalleryBtn>
            ) : (
              <GalleryBtn>
                <GalleryIcon src="/PictureSrc/BookmarkOff.png" />
                <GalleryText>북마크한 작품</GalleryText>
              </GalleryBtn>
            )}
          </div>
        </GalleryBtns>
        {data && gallery === 0 ? (
          <Gallery pictures={data?.seeProfile?.pictures} />
        ) : null}
      </UserPictureContainer>
    </Fragment>
  );
}

export default UserProfile;
