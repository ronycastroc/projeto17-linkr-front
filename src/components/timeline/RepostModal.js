import { useContext, useState } from "react";
import styled from "styled-components";
import { FaRetweet } from "react-icons/fa";
import Modal from "react-modal";
import {} from "../../service/linkrService";
import UserContext from "../../contexts/Usercontext";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#333333",
    borderRadius: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "700",
    fontSize: "34px",
    textAlign: "center",
  },
};

export default function ModalRepost(postId) {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refresh, setRefresh } = useContext(UserContext);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#ffffff";
  }

  function closeModal() {
    setIsOpen(false);
  }

  /* function delPost() {
    const promise = deletePost(postId);
    setLoading(true);
    promise
      .then(() => {
        setIsOpen(false);
        setRefresh(!refresh);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert(`You can only delete you own posts!`);
          setIsOpen(false);
          setLoading(false);
        } else {
          alert(`An error has occurred, the post couldn't be deleted`);
          setIsOpen(false);
          setLoading(false);
        }
      });
  } */

  return (
    <Wrapper>
      <FaRetweet color="white" fontSize={"23px"} onClick={openModal} />
      <RepostsSpan> re-posts</RepostsSpan>
      {loading ? (
        <Modal
          appElement={document.getElementsByClassName("root") || undefined}
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Repost Modal"
          shouldCloseOnOverlayClick={true}
        >
          <Confirmation>
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Loading...</h2>
          </Confirmation>
        </Modal>
      ) : (
        <Modal
          appElement={document.getElementsByClassName("root") || undefined}
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Delete Post Modal"
          shouldCloseOnOverlayClick={true}
        >
          <Confirmation>
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
              Do you want to re-post this link?
            </h2>
          </Confirmation>

          <Options>
            <BackButton onClick={closeModal}>No, cancel</BackButton>
            <ConfirmRepostButton onClick={closeModal}>
              Yes, share!
            </ConfirmRepostButton>
          </Options>
        </Modal>
      )}
    </Wrapper>
  );
}

const Confirmation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55%;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55%;
`;

const ConfirmRepostButton = styled.div`
  width: 135px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1877f2;
  border-radius: 5px;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-left: 20px;
`;

const BackButton = styled.div`
  width: 135px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 5px;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  color: #1877f2;
  border: none;
  cursor: pointer;
`;

const RepostsSpan = styled.span`
  color: white;
  font-size: 13px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
