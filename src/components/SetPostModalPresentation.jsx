import React from "react";
import { Button, Modal, Form, InputGroup, FormControl } from "react-bootstrap";
import PropTypes from "prop-types";
import HashTagComponent from "./HashTagComponent";
import { Image, Search } from "../assets/icons";
import { Thumbnail } from "./LoginStyledComponent";

const SetPostModalPresentaion = ({
  title,
  titleEl,
  description,
  descriptionEl,
  tags,
  setTags,
  thumbnail,
  thumbnailEl,
  onHide,
  onClickThumbnail,
  onChangeTitle,
  onChangeDescription,
  onChangeThumbnail,
  onSubmit
}) => (
  <Modal show={true} onHide={onHide} animation={true} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>포스트 등록</Modal.Title>
    </Modal.Header>
    <Modal.Body
      style={{ maxHeight: window.innerHeight - 200, overflowY: "auto" }}
    >
      <Form>
        <Form.Group>
          <Form.Label>썸네일</Form.Label>
          <br />
          {thumbnail ? (
            <Thumbnail
              src={thumbnail}
              height={250}
              onClick={onClickThumbnail}
              alt={"thumbnail"}
            />
          ) : (
            <Image
              style={{
                width: "100%",
                height: 250,
                border: "1px solid #DEE2E6",
                borderRadius: 5
              }}
              onClick={onClickThumbnail}
            />
          )}
          <input
            type="file"
            onChange={onChangeThumbnail}
            ref={thumbnailEl}
            hidden
            accept="image/jpg, image/jpeg, image/png"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>프로그램</Form.Label>
          <InputGroup>
            <FormControl
              placeholder="프로그램을 선택하세요."
              // value={selectedProgram ? selectedProgram.title : ""}
              readOnly
            />
            <InputGroup.Prepend>
              <InputGroup.Text
                // onClick={onClickShowPgmModal}
                style={{
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5
                }}
              >
                <Search style={{ width: 15, height: 15 }} />
              </InputGroup.Text>
            </InputGroup.Prepend>
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>화수</Form.Label>
          <InputGroup>
            <FormControl
              placeholder="프로그램을 선택하세요."
              // value={selectedProgram ? selectedProgram.epiNumber : ""}
              readOnly
            />
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={onChangeTitle}
            isInvalid={title.length > 200}
            ref={titleEl}
          />
          <Form.Text>{title.length} / 200</Form.Text>
          <Form.Control.Feedback type="invalid">
            제목은 200자 이내로 작성하세요.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            rows="5"
            placeholder="내용을 입력하세요."
            value={description}
            onChange={onChangeDescription}
            isInvalid={description.length > 500}
            ref={descriptionEl}
          />
          <Form.Text>{description.length} / 500</Form.Text>
          <Form.Control.Feedback type="invalid">
            내용은 500자 이내로 작성하세요.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>태그</Form.Label>
          <HashTagComponent tags={tags} setTags={setTags} />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onHide}>
        취소
      </Button>
      <Button variant="outline-primary" onClick={onSubmit}>
        등록
      </Button>
    </Modal.Footer>
  </Modal>
);
export default SetPostModalPresentaion;

SetPostModalPresentaion.propTypes = {
  title: PropTypes.string.isRequired,
  titleEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.object })
  ]),
  description: PropTypes.string.isRequired,
  descriptionEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.object })
  ]),
  tags: PropTypes.array.isRequired,
  setTags: PropTypes.func.isRequired,
  thumbnail: PropTypes.string,
  thumbnailEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.object })
  ]),
  onHide: PropTypes.func.isRequired,
  onClickThumbnail: PropTypes.func.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  onChangeDescription: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
