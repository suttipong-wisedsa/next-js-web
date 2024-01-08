import {
  Layout,
  Menu,
  Divider,
  Space,
  Button,
  Flex,
  Card,
  Modal,
  Row,
  Col,
  Form,
  Input,
  InputNumber,
} from "antd";
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  increment,
  decrement,
  closeModal,
  deleteArray,
  getData,
} from "../GlobalRedux/Features/counter/counterSlice";
import { useSearchParams } from "next/navigation";
import { error } from "console";
const navigation = [
  { name: "Post", href: "/", current: false },
  { name: "Draft", href: "/draft", current: false },
];
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
function Navbar({ func }: any) {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const type = searchParams.get("type");
  const dispatch = useDispatch();
  const edit = useSelector((state) => state.counter.edit);
  const modal = useSelector((state) => state.counter.modal);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const handleCancelEdit = () => {
    dispatch(closeModal());
    form.resetFields();
  };
  type payload = {
    Content: string;
    Title: string;
  };
  const setData = async () => {
    try {
      const { data } = await axios.get(
        `https://post-api.opensource-technology.com/api/posts/${edit.id}`
      );
      form.setFieldsValue({
        Title: data.title,
        Content: data.content,
      });
    } catch (err) {
      throw new Error("Error");
    }
  };
  useEffect(() => {
    if (modal == false) return;
    setData();
  }, [modal]);

  const onFinish = async (values: payload) => {
    let payload = {
      content: values.Content,
      title: values.Title,
    };
    await func(payload, typeForm, edit.id);
    setIsModalOpen(false);
    handleCancelEdit();
  };
  const typeForm = useMemo(() => (modal == true ? "edit" : "create"), [modal]);
  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  async function deletePost(id: string) {
    try {
      const { data } = await axios.delete(
        `https://post-api.opensource-technology.com/api/posts/${id}`
      );
      dispatch(deleteArray(id));
      dispatch(closeModal());
    } catch (error) {
      throw new Error("Error");
    }
  }
  async function publishPost() {
    try {
      const titleValue = form.getFieldValue("Title");
      const contentValue = form.getFieldValue("Content");
      let payload = {
        content: titleValue,
        title: contentValue,
      };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/posts`,
        payload
      );
      await publishNow(data);
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      throw new Error("Error");
    }
  }
  async function publishNow(item: any) {
    let payload = {
      content: item.content,
      published: true,
      title: item.title,
    };
    const { data } = await axios.patch(
      `https://post-api.opensource-technology.com/api/posts/${item.id}`,
      payload
    );
    dispatch(getData(data));
  }
  return (
    <div>
      <Modal
        footer={null}
        title={modal ? "Edit post" : "New post"}
        open={isModalOpen || modal}
        onOk={handleOk}
        onCancel={modal ? handleCancelEdit : handleCancel}
      >
        <Row gutter={24}>
          <Col sm={24}>
            <p className="font-lg">title</p>
            <Form
              form={form}
              name="nest-messages"
              onFinish={onFinish}
              style={{
                width: "100%",
              }}
              validateMessages={validateMessages}
            >
              <Form.Item
                name={["Title"]}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <p>Content</p>
              <Form.Item
                name={["Content"]}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item>
                {typeForm == "edit" ? (
                  <div>
                    <Row
                      style={{ marginTop: "10px", width: "100%" }}
                      justify="space-between"
                    >
                      <Col span={7}>
                        <Button
                          type="primary"
                          style={{ background: "green", width: "100%" }}
                          htmlType="submit"
                        >
                          Save
                        </Button>
                      </Col>
                      <Col span={7}>
                        <Button
                          type="primary"
                          style={{ background: "red", width: "100%" }}
                          htmlType="reset"
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col span={7}>
                        <Button
                          onClick={() => {
                            deletePost(edit.id);
                          }}
                          type="primary"
                          htmlType="reset"
                          style={{ background: "blue", width: "100%" }}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div>
                    <Row
                      style={{ marginTop: "10px", width: "100%" }}
                      justify="space-between"
                    >
                      <Col span={10}>
                        <Button
                          type="primary"
                          style={{ background: "green", width: "100%" }}
                          htmlType="submit"
                        >
                          Save
                        </Button>
                      </Col>
                      <Col span={10}>
                        <Button
                          type="primary"
                          style={{ background: "red", width: "100%" }}
                          htmlType="reset"
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                    <Row justify="center" className="mt-5">
                      <Col span={10}>
                        <Button
                          onClick={() => {
                            publishPost();
                          }}
                          type="primary"
                          style={{ background: "blue", width: "100%" }}
                        >
                          Publish Now
                        </Button>
                      </Col>
                    </Row>
                  </div>
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
      <div className=" flex p-3 bg-gray-800 shadow-lg justify-between">
        {/* <div className='space-x-4 pt-1 text-center text-white'>WEB Blog</div> */}
        <div className="hidden sm:ml-6 sm:block">
          <div className="flex space-x-4">
            {navigation.map((item) => (
              <Link
                href={`${item.href}?type=${item.name}`}
                key={item.name}
                className={classNames(
                  item.name == type
                    ? "bg-gray-900 text-white px-5"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "rounded-md px-3 py-2 text-sm font-medium px-5"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden sm:ml-6 sm:block">
          <div className="flex space-x-4">
            <Button
              type="primary"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Create Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
