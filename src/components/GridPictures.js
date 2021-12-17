import React, { Fragment, useState } from "react";
import { useParams } from "react-router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Grid, Icon, Icons, SmallPicture } from "./Common/GridPictures";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontSpan } from "./Common/Commons";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";
import PictureModal from "./PictureModal";
import {
  FollowBox,
  FollowBtn,
  FOLLOW_HASHTAG,
  HashtagHeader,
  UNFOLLOW_HASHTAG
} from "../screens/HashtagFeed";
import useUser from "../hooks/useUser";

const HashtagName = styled(FontSpan)`
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.44;
  color: #333;
`;

const SEE_HASHTAG = gql`
  query seeHashtag($hashtagName: String!, $skip: Int!, $take: Int!) {
    seeHashtag(hashtagName: $hashtagName) {
      id
      hashtagName
      isFollowing
      pictures(skip: $skip, take: $take) {
        id
        file
        totalComment
        totalLike
      }
    }
  }
`;

function GridPictures({ noTitle, contest }) {
  const { hashtagName } = useParams();
  const { data: userData } = useUser();
  const [showBigPicture, setShowBigPicture] = useState();
  const [bigPictureId, setBigPictureId] = useState();
  let hashtagTopic;
  if (contest) {
    const contestArr = hashtagName.split(" ");
    hashtagTopic =
      "#" + contestArr[0] + "_" + contestArr[1] + "_" + contestArr[2];
  } else {
    hashtagTopic = "#" + hashtagName;
  }
  const { data, loading, fetchMore } = useQuery(SEE_HASHTAG, {
    variables: { hashtagName: hashtagTopic, skip: 0, take: 12 }
  });
  const onLoadMore = () => {
    fetchMore({
      variables: {
        hashtagName: hashtagTopic,
        skip: data.seeHashtag.pictures.length,
        take: 12
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          seeHashtag: {
            id: prev.seeHashtag.id,
            hashtagName: prev.seeHashtag.hashtagName,
            isFollowing: prev.seeHashtag.isFollowing,
            pictures: [
              ...prev.seeHashtag.pictures,
              ...fetchMoreResult.seeHashtag.pictures
            ]
          }
        });
      }
    });
  };

  const onClickSmallPicture = id => {
    setShowBigPicture(true);
    setBigPictureId(id);
  };

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
      {!noTitle && (
        <HashtagHeader>
          <HashtagName>{`#${hashtagName}`}</HashtagName>
          <FollowBox>
            <FollowBtn onClick={() => followEditClick()}>
              {data?.seeHashtag?.isFollowing ? "Unfollow" : "Follow"}
            </FollowBtn>
          </FollowBox>
        </HashtagHeader>
      )}

      {!loading && data && data.seeHashtag && (
        <InfiniteScroll
          dataLength={data.seeHashtag.pictures}
          next={onLoadMore}
          hasMore={true}
        >
          <Grid small>
            {data?.seeHashtag?.pictures.map(picture => (
              <SmallPicture
                onClick={() => onClickSmallPicture(picture.id)}
                key={picture.id}
                small="158.8px"
                bg={picture.file}
              >
                <Icons small="158.8px">
                  <Icon>
                    <FontAwesomeIcon icon={faHeart} color="#ff2b57" />
                    <FontSpan>{picture.totalLike}</FontSpan>
                  </Icon>
                  <Icon>
                    <FontAwesomeIcon icon={faComment} />
                    <FontSpan>{picture.totalComment}</FontSpan>
                  </Icon>
                </Icons>
              </SmallPicture>
            ))}
          </Grid>
          {showBigPicture && (
            <PictureModal
              id={bigPictureId}
              setShowBigPicture={setShowBigPicture}
            />
          )}
        </InfiniteScroll>
      )}
    </Fragment>
  );
}

export default GridPictures;
