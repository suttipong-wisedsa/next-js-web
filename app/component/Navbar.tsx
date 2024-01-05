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
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  increment,
  decrement,
} from "../GlobalRedux/Features/counter/counterSlice";
import { useSearchParams } from "next/navigation";
const navigation = [
  { name: "Post", href: "/", current: false },
  { name: "Draft", href: "/draft", current: false },
];
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
function Navbar() {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const type = searchParams.get("type");
  const modal = useSelector((state) => state.counter.modal);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  type payload = {
    Content: string;
    Title: string;
  };
  const onFinish = async (values: payload) => {
    let payload = {
      content: values.Content,
      title: values.Title,
    };
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/posts`,
        payload
      );
      // setPostList(data.posts);
      handleOk();
    } catch (error) {
      throw new Error("Error");
    }
  };
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
  return (
    <div>
      <Modal
        footer={null}
        title="New Post"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
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
                      type="primary"
                      htmlType="reset"
                      style={{ background: "blue", width: "100%" }}
                    >
                      Publish Now
                    </Button>
                  </Col>
                </Row>
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
