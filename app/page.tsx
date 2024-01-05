"use client";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Card, Col, Divider, Row, Space, Button } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { parseISO, format } from "date-fns";
import { useAppSelector, useAppDispatch, useAppStore } from "../lip/hooks";
import { useDispatch, useSelector } from "react-redux";
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
export default function Home() {
  const [current, setCurrent] = useState<string>("1");
  const [pageSize, setPageSize] = useState<string>("10");
  const [dateTimeStart, setDateTimeStart] = useState<string>("");
  const [dateTimeEnd, setDateTimeEnd] = useState<string>("");
  const [postList, setPostList] = useState<postList[]>([]);
  const [loading, setLoding] = useState<boolean>(false);
  const count = useSelector((state) => state.counter.value);
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
  async function deletePost(id: string) {
    let array = [...postList];
    setLoding(true);
    try {
      const { data } = await axios.delete(
        `https://post-api.opensource-technology.com/api/posts/${id}`
      );
      let index = array.findIndex((element) => element.id == id);
      array.splice(index, 1);
      setPostList(array);
      setLoding(false);
    } catch (error) {
      setLoding(false);
      throw new Error("Error");
    }
  }
  // const store = useAppStore();
  // const dispatch = useAppDispatch();
  return (
    <>
      <div className="container mx-auto px-4">
        {/* <input onChange={(e) => dispatch(increment())} /> */}
        {count}
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
                            deletePost(val.id);
                          }}
                        >
                          Delete
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
