import React, { useEffect, useState, useCallback , useRef , Fragment} from "react";
import { useQuery } from "@apollo/client";
import "../../App.css";
import './pageContent.css';
import styled from "styled-components";
import { GetFeedInput, GetFeedResponse, GET_FEED, Mission} from "../../Graphql/Queries";
import Colors from '../../constants/Colors';
import { ReactComponent as GiftIcon } from "../../assets/svgs/gift.svg";
import { ReactComponent as PlayBtn } from "../../assets/svgs/playBtn.svg";
import { ReactComponent as Facebook } from "../../assets/svgs/facebook.svg";
import { ReactComponent as Instagram } from "../../assets/svgs/insta.svg";
import moment from 'moment';
// import { Translator, Translate } from "react-auto-translate";

const FullWidthContainer = styled.div`
  padding: 0px 16px;
  max-width: inherit;
  padding-bottom: 30px;
`;

const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 40px;
`;

const LanguageButton = styled.button<{active?:boolean}>`
    background-color: ${({active}) => active ? Colors.main.blue_light : Colors.main.gray};
    border-radius: 8px;
    padding: 4px 9px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 28px;
    border: none;
    margin-right: 11px;
    cursor: pointer
`;

const Card = styled.div`
    width: 100%;
    margin-top: 26px;
    background-color: ${Colors.main.gray};
    border-bottom-left-radius :8px;
    border-bottom-right-radius :8px;
    padding-bottom: 8px;
`;

const ImageContainer = styled.img`
  height: 228px;
  width: 100%;
  object-fit: cover;
`;

const VideoContainer = styled.video`
  height: 228px;
  width: 100%;
  object-fit: cover;
`;

const RewardButton = styled.button`
  background-color: ${Colors.main.white};
  border-radius: 8px;
  padding: 4px 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px auto;
  height: 34px;
  width: 95%;
  border: none;
  cursor: pointer;
`;

const RelativeContainer = styled.div`
    position: relative;
`;

const PlayButton = styled(PlayBtn)`
    position: absolute;
    left: 40%;
    bottom:40%;
    cursor: pointer;
`;

const CashTypeContainer = styled.span`
  border-radius: 8px;
  height: 24px;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding:0px 8px;
  position: absolute;
  top: 8px;
  right: 8px;
`;

const Dot = styled.div`
    height: 2px;
    width: 2px;
    border-radius: ${2 * 0.5}px;
    background-color: ${Colors.main.black};
    margin: 0px 4px;
`;

const languageEnum = {
    spanish:'es',
    english:'en'
}

const missionType = {
  instagram: "IGStoryMission",
  facebook: "FBPostMission",
};

interface GroupedMissions {
  date: any;
  missions: [Mission]
}

const updateMetaTagContent = (updateObject:any) => {
   Object.keys(updateObject).map((item) =>{
     document.getElementsByTagName("META")[parseInt(item)].attributes[1].value = updateObject[item];
   })
}


const PageContent = () => {
    const [activeLanguage, setActiveLanguage] = useState(languageEnum.english);
    const [missionsFeed, setMissionsFeed]:[Mission]|any = useState([]);
    const [missionLimit, setMissionsLimit] = useState(4);
    const [hasNextPage, setHasNextPage]:boolean |any = useState(false);

    
        const { data ,loading, error} = useQuery<GetFeedResponse, GetFeedInput>(GET_FEED, {
        variables: { limit: missionLimit, offset: 0 },
        });

         useEffect(() => {
           if (!loading && !error) {
             setMissionsFeed(data?.getFeed?.items);
             setHasNextPage(data?.getFeed?.hasNextPage);
           }
         }, [missionLimit,loading,error,data]);

         const observer = useRef<any>();

         const lastMissoionElementRef = useCallback(
           (node) => {
             if (loading) return;
             if (observer.current) observer?.current?.disconnect();
             observer.current = new IntersectionObserver((entries) => {
               if (entries[0].isIntersecting && hasNextPage) {
                 setMissionsLimit((prevPageNumber) => prevPageNumber + 4);
               }
             });
             if (node) observer.current.observe(node);
           },
           [loading, hasNextPage]
         );

         const groups = missionsFeed.reduce((groups:any, game:Mission) => {
           const date = game.date.split("T")[0];
           if (!groups[date]) {
             groups[date] = [];
           }
           groups[date].push(game);
           return groups;
         }, {});

         const missionGroupArrays = Object.keys(groups).map((date) => {
           return {
             date,
             missions: groups[date],
           };
         });

  

    return (
        <FullWidthContainer>
          <RowContainer>
            <LanguageButton
              onClick={() => setActiveLanguage(languageEnum.english)}
              active={activeLanguage === languageEnum.english}
            >
              <p className="language_text">English</p>
            </LanguageButton>
            <LanguageButton
              onClick={() => setActiveLanguage(languageEnum.spanish)}
              active={activeLanguage === languageEnum.spanish}
            >
              <p className="language_text">Spanish</p>
            </LanguageButton>
          </RowContainer>

          {
          missionGroupArrays.map((feed: GroupedMissions, index: number) => {
            return (
              <Fragment key={index + 'groupItem'}>
                <p className="date_text">{moment(feed.date).format('D MMMM YYYY')}</p>
                {
                  feed.missions.map((mission:any,indexNumber:number)=>{
                      if (indexNumber === missionGroupArrays[missionGroupArrays.length - 1].missions.length - 1) {
                        const params = {
                          4: mission?.title,
                          5: mission?.image?.src || mission?.image?.src2x || mission?.video?.src,
                          6: mission?.title,
                          7: mission?.image?.scr || mission?.image?.src2x  || mission?.video?.src,
                        };
                          updateMetaTagContent(params);
                        return (
                          <Card key={indexNumber+'lastFeedItem'} ref={lastMissoionElementRef}>
                            <RelativeContainer>
                              <CashTypeContainer>
                                <p className="cash_text">Cash</p>
                                <Dot />
                                {mission.__typename === missionType.facebook ? (
                                  <Facebook />
                                ) : (
                                  <Instagram />
                                )}
                              </CashTypeContainer>
                              {mission?.image ? (
                                <ImageContainer
                                  src={mission?.image?.src}
                                  alt={mission?.image?.alt}
                                />
                              ) : (
                                <>
                                  <VideoContainer>
                                    <source
                                      src={mission?.video?.src}
                                      type="video/mp4"
                                    />
                                  </VideoContainer>
                                  <PlayButton />
                                </>
                              )}
                            </RelativeContainer>
                            <p className="card_title">{mission?.title}</p>
                            <RewardButton>
                              <GiftIcon />
                              <p className="bold_reward_text">Reward</p>
                              <p className="amount_text">
                                $ {mission?.cashReward}
                              </p>
                            </RewardButton>
                          </Card>
                        );
                      } else {
                        return (
                          <Card key={indexNumber + 'nonLastFeedItems'}>
                            <RelativeContainer>
                              <CashTypeContainer>
                                <p className="cash_text">Cash</p>
                                <Dot />
                                {mission.__typename === missionType.facebook ? (
                                  <Facebook />
                                ) : (
                                  <Instagram />
                                )}
                              </CashTypeContainer>
                              {mission?.image ? (
                                <ImageContainer
                                  src={mission?.image?.src}
                                  alt={mission?.image?.alt}
                                />
                              ) : (
                                <>
                                  <VideoContainer>
                                    <source
                                      src={mission?.video?.src}
                                      type="video/mp4"
                                    />
                                  </VideoContainer>
                                  <PlayButton />
                                </>
                              )}
                            </RelativeContainer>
                            <p className="card_title">{mission?.title}</p>
                            <RewardButton>
                              <GiftIcon />
                              <p className="bold_reward_text">Reward</p>
                              <p className="amount_text">
                                $ {mission?.cashReward}
                              </p>
                            </RewardButton>
                          </Card>
                        );
                      }
                  })  
                }
              </Fragment>
            );
          })}

          {loading && <p className="loader">Loading....</p>}
        </FullWidthContainer>
    );
}

export default PageContent;