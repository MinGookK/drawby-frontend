import { gql, useMutation, useQuery } from "@apollo/client";
import { update } from "lodash";
import React, { Fragment, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { FontSpan } from "../components/Common/Commons";
import Picture from "../components/Picture";
import useUser from "../hooks/useUser";

const HashtagTitle = styled(FontSpan)`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.44;
  color: #333;
  width: 580px;
`;

const HashtagHeader = styled.div`
  margin: 30px 0 16px;
  display: flex;
  justify-content: space-between;
`;
const FollowBox = styled.div`
  display: flex;
  height: 28px;
  padding: 4px 10px;
  border-radius: 17px;
  background-color: #fff;
`;
const FollowBtn = styled(FontSpan)`
  margin: 4px 10px;
  height: 28px;
  font-size: 14px;
  line-height: 1.29;
  color: #999;
  line-height: 1.29;
`;

const SEE_HASHTAG = gql`
  query seeHashtag($hashtagName: String!) {
    seeHashtag(hashtagName: $hashtagName) {
      id
      hashtagName
      isFollowing
      pictures {
        id
        file
        name
        author {
          username
          avatar
        }
        caption
        comments {
          id
          payload
          isMine
          isLiked
          createdAt
          author {
            username
            avatar
          }
          nestedComments {
            id
            payload
            isMine
            createdAt
            isLiked
            author {
              avatar
              username
            }
          }
        }
        hashtags {
          id
          hashtagName
        }
        totalComment
        totalLike
        isMine
        isLiked
        isBookmarked
      }
    }
  }
`;

const FOLLOW_HASHTAG = gql`
  mutation followHashtag($hashtagName: String!) {
    followHashtag(hashtagName: $hashtagName) {
      ok
      error
    }
  }
`;

const UNFOLLOW_HASHTAG = gql`
  mutation unfollowHashtag($hashtagName: String!) {
    unfollowHashtag(hashtagName: $hashtagName) {
      ok
      error
    }
  }
`;

function HashtagFeed() {
  const { hashtagName } = useParams();
  const { data: userData } = useUser();
  const { isFollow, setIsFollow } = useState();
  const { data } = useQuery(SEE_HASHTAG, {
    variables: { hashtagName: "#" + hashtagName }
  });
  const [followHashtagMutation] = useMutation(FOLLOW_HASHTAG);
  const [unfollowHashtagMutation] = useMutation(UNFOLLOW_HASHTAG);
  const followHashtagUpdate = (cache, result) => {
    const {
      data: {
        followHashtag: { ok }
      }
    } = result;
    if (!ok) {
      return;
    }
    const newHashtag = {
      __typename: "Hashtag",
      isFollowing: true,
      hashtagName: "#" + hashtagName
    };
    const newCacheHashtag = cache.writeFragment({
      data: newHashtag,
      fragment: gql`
        fragment hashtag on Hashtag {
          isFollowing
          hashtagName
        }
      `
    });
    cache.modify({
      id: `User:${userData.me.username}`,
      fields: {
        followHashtags(prev) {
          return [...prev, newCacheHashtag];
        }
      }
    });
  };
  const unfollowHashtagUpdate = (cache, result) => {
    const {
      data: {
        unfollowHashtag: { ok }
      }
    } = result;
    if (!ok) {
      return;
    }
    const newHashtag = {
      __typename: "Hashtag",
      isFollowing: false,
      hashtagName: "#" + hashtagName
    };
    const newCacheHashtag = cache.writeFragment({
      data: newHashtag,
      fragment: gql`
        fragment hashtag on Hashtag {
          isFollowing
          hashtagName
        }
      `
    });
    cache.modify({
      id: `User:${userData.me.username}`,
      fields: {
        followHashtags(prev) {
          let filtered = prev.filter(
            hashtag => hashtag.__ref !== `Hashtag:#${hashtagName}`
          );
          return filtered;
        }
      }
    });
  };
  const followEditClick = () => {
    if (data?.seeHashtag?.isFollowing) {
      unfollowHashtagMutation({
        variables: { hashtagName: "#" + hashtagName },
        update: unfollowHashtagUpdate
      });
    } else {
      followHashtagMutation({
        variables: { hashtagName: "#" + hashtagName },
        update: followHashtagUpdate
      });
    }
  };
  return (
    <Fragment>
      <HashtagHeader>
        <HashtagTitle>#{hashtagName}</HashtagTitle>
        <FollowBox>
          <FollowBtn onClick={() => followEditClick()}>
            {data?.seeHashtag?.isFollowing ? "Unfollow" : "Follow"}
          </FollowBtn>
        </FollowBox>
      </HashtagHeader>
      {data?.seeHashtag?.pictures.length !== 0 ? (
        data?.seeHashtag?.pictures.map(picture => (
          <Picture key={picture.id} {...picture} />
        ))
      ) : (
        <FontSpan>그림을 업로드 해주세요.</FontSpan>
      )}
    </Fragment>
  );
}

export default HashtagFeed;