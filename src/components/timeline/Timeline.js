import { useContext, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { editPost, getPublications } from "../../service/linkrService";
import { Publication, AddPublication, EditPublication } from "./Publication.js";
import UserContext from "../../contexts/Usercontext.js";
import HeaderLogout from "../authComponents/HeaderLogout";
import { ReactTagify } from "react-tagify";
import Trending from "../hashtag/Trending";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroller';

export default function Timeline() {
  const [publications, setPublications] = useState("");
  const { refresh, setRefresh } = useContext(UserContext);
  const navigate = useNavigate();
  const [isEditingPostId, setIsEditingPostId] = useState(null);
  const [newText, setNewText] = useState("");
  const [disabled, setDisabled] = useState("");
  const [offset,setOffset]=useState(0);
  const [length,setLength]=useState('')
  const [hasMore,setHasMore]=useState(true)
  
  async function loadPublications(){
   
    getPublications(offset)
      .then((answer) => {
        setPublications([...publications, ...answer.data.urls]);
        setLength(answer.data.length[0].count)
        setOffset(offset+5)
        if(length-offset>0){
          setHasMore(true);
        }else{
          setHasMore(false)
        }
      })
      .catch((error) => {
        alert(
          error
        );
      });
  }
  
  useEffect(loadPublications, [refresh]);

  function navigateToHashtagPage(tag) {
    const hashtag = tag.replace("#", "");
    navigate(`/hashtag/${hashtag}`);
    return;
  }

  function handleEditClick(postId) {
    setIsEditingPostId(postId);
  }

  function handleCancelEdit() {
    setIsEditingPostId(null);
  }

  function handleSendEdit(e, postId) {
    e.preventDefault();
    const body = { newText: newText };
    setDisabled("Disabled");
    editPost(postId, body)
      .then(() => {
        console.log(postId);
        setIsEditingPostId(null);
        setRefresh(!refresh);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert(`You can only edit you own posts!`);
          setIsEditingPostId(null);
        } else {
          alert(
            `There was an error in editing this post. Alterations could not be saved.`
          );
          setDisabled("");
        }

        console.log(postId);
      });
  }

  function handleKeyDown(e, postId) {
    if (e.keyCode === 27) {
      handleCancelEdit();
      console.log(postId);
    }
    if (e.keyCode === 13) {
      handleSendEdit(e, postId);
      console.log(postId);
    }
  }
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditingPostId) {
      inputRef.current.focus();
    }
  }, [isEditingPostId]);

  return (
    <Wrapper>
      <HeaderLogout />

      <WrapperH>
        <Wrapper>
          <Title>
            <h1>Timeline</h1>
          </Title>
          <AddPublication></AddPublication>
          
          <InfiniteScroll
            loader={<h1>Loading...</h1>}
            loadMore={loadPublications}
            pageStart={0}
            useWindow={true}
            hasMore={hasMore}
    
          >
          {publications ? (
            publications.length === 0 ? (
              <Title>
                <h1>There are no posts yet</h1>
              </Title>
            ) : (
              publications.map((value, key) =>
                isEditingPostId === value.id ? (
                  <form onSubmit={handleSendEdit}>
                    <EditPublication
                      key={key}
                      id={value.id}
                      text={
                        <ReactTagify
                          colors="white"
                          tagClicked={(tag) => navigateToHashtagPage(tag)}
                        >
                          {value.text}
                        </ReactTagify>
                      }
                      placeholder={value.text}
                      url={value.url}
                      description={value.description}
                      image={value.image}
                      title={value.title}
                      urlImage={value.urlImage}
                      name={value.name}
                      inputRef={inputRef}
                      handleCancelEdit={handleCancelEdit}
                      handleKeyDown={handleKeyDown}
                      setNewText={setNewText}
                      disabled={disabled}
                    />
                  </form>
                ) : (
                  <Publication
                    key={key}
                    userId={value.userId}
                    id={value.id}
                    text={
                      <ReactTagify
                        colors="white"
                        tagClicked={(tag) => navigateToHashtagPage(tag)}
                      >
                        {value.text}
                      </ReactTagify>
                    }
                    url={value.url}
                    description={value.description}
                    image={value.image}
                    title={value.title}
                    urlImage={value.urlImage}
                    name={value.name}
                    handleEditClick={handleEditClick}
                  ></Publication>
                )
              )
            )
          ) : (
            <Title>
              <h1>Loading...</h1>
            </Title>
          )}
          </InfiniteScroll>
        </Wrapper>
        <Trending onClick={(tag) => navigateToHashtagPage(tag)}></Trending>
        <Wrapper></Wrapper>
      </WrapperH>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const WrapperH = styled.div`
  display: flex;
`;
const Title = styled.div`
  width: 100%;
  margin-top: 100px;
  margin-bottom: 43px;
  h1 {
    font-family: "Oswald";
    font-style: normal;
    font-weight: 700;
    font-size: 43px;
    line-height: 64px;
    color: #ffffff;

    @media (max-width: 650px) {
      margin-left: 5%;
      margin-top: 50px;
    }
  }
`;
