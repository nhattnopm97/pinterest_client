import React, { useEffect, useState } from "react";
import styled from "styled-components";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "../css/pin.css";
import UploadIcon from "@mui/icons-material/Upload";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Modalbox from "./Modalbox";
import { Link } from "react-router-dom";
import axios from "axios";
import EditCollection from "./EditCollection";

function Pin(
  {detailCollection,
  pin,
  collection,
  loadCollections,
  loadDetailCollections,
  setDetailCollection}
) {
  const [openModal, setOpenModal] = useState(false);
  const [openCreateTable, setOpenCreateTable] = useState(false);

  const handleShow = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenModal(true);
  };

  const handleSave = (event, newNameCollection) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("newNameCollection", newNameCollection);
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    console.log(userLocal);
    if (userLocal !== null) {
      let newName = "";
      if (newNameCollection === undefined) {
        newName =
          collection && collection.length > 0
            ? collection[0]?.name
            : "Bảng mới";

        console.log("newName", newName);
      } else {
        newName = newNameCollection;
      }
      axios({
        method: "POST",
        url: "http://localhost:3579/api/v1/collection/",
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
        data: {
          name: newName,
          user_id: userLocal.id,
          pin_id: pin.id,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          let newDetailsss = [...detailCollection];
          newDetailsss.push({
            name: newName,
            link: pin.link,
            pin_id: pin.id,
          });

          setDetailCollection(newDetailsss);
          // alert(`${response.data.message}`);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      console.log("Chưa đăng nhập!");
      alert("Bạn chưa đăng nhập!");
    }
  };

  const handleUnSaved = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    let findCollection = detailCollection.filter(
      (collection) => collection.pin_id === pin.id
    );
    console.log("findCollection", findCollection);
    if (userLocal !== null) {
      axios({
        method: "DELETE",
        url: "http://localhost:3579/api/v1/collection/" + pin.id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
        data: {
          name: findCollection[0]?.name,
          user_id: userLocal.id,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          let filterDetailCollection = detailCollection.filter(
            (pin) => pin.pin_id !== pin.id
          );
          console.log(filterDetailCollection);
          setDetailCollection(filterDetailCollection);
          // alert(`${response.data.message}`);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      alert("Bạn chưa đăng nhập");
    }
  };

  return (
    <Wrapper>
      {openCreateTable === true ? (
        <EditCollection
          open={openCreateTable}
          setOpen={setOpenCreateTable}
          pin={pin}
          loadCollections={loadCollections}
          loadDetailCollections={loadDetailCollections}
        />
      ) : (
        <></>
      )}
      <Container>
        <Link to={`/detailimg/${pin.id}`}>
          <img src={pin?.link} alt="" />
          <div className="button-container">
            {!detailCollection?.find(
              (collection) => collection?.pin_id === pin?.id
            ) ? (
              <div className="collectiona" onClick={handleShow}>
                {collection === null || collection?.length === 0
                  ? "Bảng mới"
                  : collection[0]?.name}
                <KeyboardArrowDownIcon />
              </div>
            ) : (
              <Link
                to={`/collectiondetail/${
                  detailCollection?.find(
                    (collection) => collection.pin_id === pin?.id
                  ).name
                }`}
              >
                <div className="collectiona">
                  {
                    detailCollection?.find(
                      (collection) => collection.pin_id === pin?.id
                    ).name
                  }
                </div>
              </Link>
            )}

            {!detailCollection?.find(
              (collection) => collection.pin_id === pin.id
            ) ? (
              <div className="save" onClick={handleSave}>
                Lưu
              </div>
            ) : (
              <div className="saved" onClick={handleUnSaved}>
                Đã lưu
              </div>
            )}

            <div className="upload">
              <UploadIcon />
            </div>
            <div className="more">
              <MoreHorizIcon />
            </div>
          </div>
        </Link>
      </Container>
      {openModal && (
        <Modalbox
          key={`${pin.id}`}
          collection={collection}
          detailCollection={detailCollection}
          setOpenModal={setOpenModal}
          handleSave={handleSave}
          setOpenCreateTable={setOpenCreateTable}
          openCreateTable={openCreateTable}
        />
      )}
    </Wrapper>
  );
}

export default Pin;

const Wrapper = styled.div`
  display: inline-flex;
  overflow: hidden;
  margin-left: 15px;
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
  width: 236px;
  :hover .button-container {
    opacity: 1;
  }

  img {
    display: flex;
    width: 100%;
    cursor: zoom-in;
    object-fit: cover;
    border-radius: 16px;
  }
  .button-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    cursor: zoom-in;
    opacity: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
  }
  .button-container .collectiona {
    color: white;
    cursor: pointer;
    position: absolute;
    top: 5%;
    left: 5%;
  }
  .button-container .save {
    background-color: red;
    padding: 8px 12px;
    border-radius: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    position: absolute;
    top: 5%;
    right: 5%;
  }
  .button-container .saved {
    background-color: rgb(165, 165, 165);
    padding: 8px 12px;
    border-radius: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
    position: absolute;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .button-container .upload {
    color: white;
    cursor: pointer;
    position: absolute;
    bottom: 5%;
    right: 19%;
  }
  .button-container .more {
    color: white;
    cursor: pointer;
    position: absolute;
    bottom: 5%;
    right: 5%;
  }
`;
