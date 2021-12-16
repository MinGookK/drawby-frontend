import React, { Fragment } from "react";
import { useParams } from "react-router";
import { gql, useQuery } from "@apollo/client";
import { Grid, Icon, Icons, SmallPicture } from "./Common/GridPictures";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontSpan } from "./Common/Commons";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";

const HashtagName = styled(FontSpan)`
  margin: 30px 0 16px;
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
  let hashtagTopic;
  if (contest) {
    const contestArr = hashtagName.split(" ");
    hashtagTopic =
      "#" + contestArr[0] + "_" + contestArr[1] + "_" + contestArr[2];
  } else {
    hashtagTopic = hashtagName;
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
  return (
    <Fragment>
      {!noTitle && <HashtagName>{`#${hashtagName}`}</HashtagName>}

      {!loading && data && data.seeHashtag && (
        <InfiniteScroll
          dataLength={data.seeHashtag.pictures}
          next={onLoadMore}
          hasMore={true}
        >
          <Grid small>
            {data?.seeHashtag?.pictures.map(picture => (
              <SmallPicture key={picture.id} small="158.8px" bg={picture.file}>
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
        </InfiniteScroll>
      )}
    </Fragment>
  );
}

export default GridPictures;
