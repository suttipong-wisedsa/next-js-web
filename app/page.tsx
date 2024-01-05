"use client";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
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
import { parseISO, format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "./component/Navbar";
import {
  increment,
  decrement,
} from "./GlobalRedux/Features/counter/counterSlice";
const style: React.CSSProperties = { background: "#0092ff", padding: "8px 0" };
interface postList {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
}
type date = {
  dateString: string;
};
const navigation = [
  { name: "Post", href: "/", current: false },
  { name: "Draft", href: "/draft", current: false },
];
import { useSearchParams } from "next/navigation";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function Home() {
  const [current, setCurrent] = useState<string>("1");
  const [pageSize, setPageSize] = useState<string>("10");
  const [dateTimeStart, setDateTimeStart] = useState<string>("");
  const [dateTimeEnd, setDateTimeEnd] = useState<string>("");
  const [postList, setPostList] = useState<postList[]>([]);
  const [loading, setLoding] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const titleValue = form.getFieldValue("Title");
  const contentValue = form.getFieldValue("Content");

  async function fetchData() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/posts?page=${current}&limit=${pageSize}&start_date=${dateTimeStart}&end_date=${dateTimeEnd}}`
      );
      setPostList(data.posts);
    } catch (error) {
      throw new Error("Error");
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  function Date({ dateString }: date) {
    const date = parseISO(dateString);
    return <time dateTime={dateString}>{format(date, "dd-MM-yyyy K.m")}</time>;
  }
  async function editPost(id: string) {
    setLoding(true);
    try {
      const { data } = await axios.get(
        `https://post-api.opensource-technology.com/api/posts/${id}`
      );
      console.log(data);
      setLoding(false);
    } catch (error) {
      setLoding(false);
      throw new Error("Error");
    }
  }

  return (
    <>
      <Navbar></Navbar>
      <div className="container mx-auto px-4">
        <Space
          direction="vertical"
          size="middle"
          style={{ display: "flex" }}
          className="pt-5"
        >
          <Row gutter={24} justify="center">
            <Col className="gutter-row" span={20}>
              <div>
                {postList.map((val: postList, index: number) => (
                  <Card
                    className="mb-3"
                    key={index}
                    title={val.title}
                    bordered={false}
                    style={{ width: "100%" }}
                  >
                    <p className="my-5">{val.content}</p>

                    <Row gutter={24} justify="space-between">
                      <Col xs={10} md={15}>
                        <Date dateString={val.created_at} />
                      </Col>

                      <Col xs={10} md={3}>
                        <Button
                          loading={loading}
                          block
                          danger
                          onClick={() => {
                            editPost(val.id);
                          }}
                        >
                          Edit
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>
        </Space>
      </div>
      ;
    </>
  );
}
