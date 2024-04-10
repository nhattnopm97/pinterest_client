import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Pin from "./Pin";
import "../css/MainBoard.css";
import axios from "axios";
function MainBoard(props) {
  const [pinLoad, setPinLoad] = useState([]);
  const [collection, setCollection] = useState(null);
  const [detailCollection, setDetailCollection] = useState([]);
  const [pagination, setPagination] = useState(0);

  //Check user login
  const loadUserLogin = async () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      axios({
        method: "GET",
        url: "http://localhost:3579/api/v1/user/" + userLocal.id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          console.log(response.data);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      console.log("Chưa đăng nhập!");
    }
  };
  useEffect(() => {
    loadUserLogin();
  }, []);

  const loadPin = async () => {
    try {
      let response = await axios.get(
        "http://localhost:3579/api/v1/pin/pagination/" + pagination
      );
      console.log(response);
      response.data.pin.sort((a, b) => {
        return 0.5 - Math.random();
      });
      let pin = [...pinLoad, ...response.data.pin];
      setPinLoad(pin);
      let newPage = pagination + 1;
      console.log(newPage);
      setPagination(newPage);
    } catch (error) {
      console.log(error);
    }
  };

  //Chỉ lấy tên của collection
  const loadCollections = () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      axios({
        method: "GET",
        url: "http://localhost:3579/api/v1/collection/name/" + userLocal.id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          setCollection(response.data.collection);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      console.log("Chưa đăng nhập!");
    }
  };

  //lấy cả id và link của collection
  const loadDetailCollections = () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      axios({
        method: "GET",
        url: "http://localhost:3579/api/v1/collection/" + userLocal.id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          setDetailCollection(response.data.detailCollection[0]);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      console.log("Chưa đăng nhập!");
    }
  };

  const [loadMore, setLoadMore] = useState(true);
  const getData = (a) => {
    loadPin();
  };

  const scrollView = () => {
    const mainBoardcontainer = document.getElementById("mainBoardcontainer");
    if (props.scrollable) {
      // list has fixed height
      mainBoardcontainer.addEventListener("scroll", (e) => {
        const el = e.target;
        if (el.scrollTop + el.clientHeight === el.scrollHeight) {
          setLoadMore(true);
        }
      });
    } else {
      // list has auto height
      window.addEventListener("scroll", () => {
        if (
          window.scrollY + window.innerHeight + 10 >
          mainBoardcontainer.clientHeight + mainBoardcontainer.offsetTop
        ) {
          setLoadMore(true);
        }
      });
    }
  };

  useEffect(() => {
    scrollView();
  }, [loadMore]);

  useEffect(() => {
    const mainBoardcontainer = document.getElementById("mainBoardcontainer");

    if (
      mainBoardcontainer.clientHeight <= window.innerHeight &&
      mainBoardcontainer.clientHeight
    ) {
      setLoadMore(true);
    }
  }, [props.state]);

  useEffect(() => {
    getData(loadMore);
    setLoadMore(false);
  }, [loadMore]);

  useEffect(() => {
    loadPin();
    loadCollections();
    loadDetailCollections();
  }, []);
  return (
    <Wrapper>
      <Container className="mainBoardcontainer" id="mainBoardcontainer">
        {pinLoad?.map((pin, i) => (
          <Pin
            detailCollection={detailCollection}
            key={i}
            pin={pin}
            collection={collection}
            loadCollections={loadCollections}
            loadDetailCollections={loadDetailCollections}
            setDetailCollection={setDetailCollection}
          />
        ))}
      </Container>
    </Wrapper>
  );
}

export default MainBoard;

const Wrapper = styled.div`
  background-color: white;
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 15px;
  justify-content: center;
`;

const Container = styled.div`
  column-gap: 1px;
  height: 100%;
  background-color: white;
  overflow-y: auto hidden;
`;
