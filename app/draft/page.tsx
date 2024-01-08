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
import React, { useState, useEffect, useMemo } from "react";
import { parseISO, format } from "date-fns";
// import { useAppSelector, useAppDispatch, useAppStore } from "../../lip/hooks";
import Navbar from "../component/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  increment,
  decrement,
} from "../GlobalRedux/Features/counter/counterSlice";
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
export default function page() {
  const [current, setCurrent] = useState<string>("1");
  const [pageSize, setPageSize] = useState<string>("10");
  const [dateTimeStart, setDateTimeStart] = useState<string>("");
  const [dateTimeEnd, setDateTimeEnd] = useState<string>("");
  const [postList, setDraftList] = useState<postList[]>([]);
  const [loading, setLoding] = useState<boolean>(false);
  const id_post = useSelector((state) => state.counter.id);
  const ferch = useSelector((state) => state.counter.get_data);
  async function fetchData() {
    try {
      setLoding(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/posts/draft?page=${current}&limit=${pageSize}&start_date=${dateTimeStart}&end_date=${dateTimeEnd}`
      );
      setDraftList(data.posts);
      setLoding(false);
    } catch (error) {
      setLoding(false);
      throw new Error("Error");
    }
  }
  function Date({ dateString }: date) {
    const date = parseISO(dateString);
    return <time dateTime={dateString}>{format(date, "dd-MM-yyyy K.m")}</time>;
  }
  useEffect(() => {
    fetchData();
  }, [id_post, ferch]);
  async function deletePost(id: string) {
    let array = [...postList];
    setLoding(true);
    try {
      const { data } = await axios.delete(
        `https://post-api.opensource-technology.com/api/posts/${id}`
      );
      let index = array.findIndex((element) => element.id == id);
      array.splice(index, 1);
      setDraftList(array);
      setLoding(false);
    } catch (error) {
      setLoding(false);
      throw new Error("Error");
    }
  }
  interface publish {
    content: string;
    published: boolean;
    title: string;
  }
  interface post {
    content: string;
    created_at: string;
    id: string;
    published: boolean;
    title: string;
  }
  async function publishPost(val: post) {
    let text = "confirm to publish";
    if (window.confirm(text) == true) {
      try {
        let array = [...postList];
        let payload: publish = {
          content: val.content,
          published: true,
          title: val.title,
        };
        const { data } = await axios.patch(
          `https://post-api.opensource-technology.com/api/posts/${val.id}`,
          payload
        );
        let index = array.findIndex((element) => element.id == val.id);
        array.splice(index, 1);
        setDraftList(array);
      } catch (err) {
        throw new Error("Error");
      }
    }
  }
  async function editPost(val: post) {
    // try {
    //   let payload: publish = {
    //     content: val.content,
    //     published: false,
    //     title: val.title,
    //   };
    //   console.log(payload);
    //   return;
    //   const { data } = await axios.patch(
    //     `https://post-api.opensource-technology.com/api/posts/${val.id}`,
    //     payload
    //   );
    // } catch (err) {
    //   throw new Error("Error");
    // }
  }
  const dispatch = useDispatch();
  interface data {
    content: string;
    title: string;
  }
  type id = string | undefined | null;
  const pull_data = async (payload: data, typeForm: string, id: id) => {
    try {
      setLoding(true);
      if (typeForm == "edit") {
        let body = {
          content: payload.content,
          published: false,
          title: payload.title,
        };
        const { data } = await axios.patch(
          `${process.env.NEXT_PUBLIC_URL}/posts/${id}`,
          body
        );
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/posts`,
          payload
        );
        let clone = {
          id: data.id,
          title: data.title,
          content: data.content,
          published: data.published,
          created_at: data.created_at,
        };
        setDraftList((oldArray) => [...oldArray, clone]);
      }
      fetchData();
      setLoding(false);
    } catch (error) {
      setLoding(false);
      throw new Error("Error");
    }
  };
  return (
    <>
      <Navbar func={pull_data}></Navbar>
      <div className="container mx-auto px-4">
        {loading ? (
          "loading"
        ) : (
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
                        <Col xs={24} md={15}>
                          <Date dateString={val.created_at} />
                        </Col>
                        <Col xs={5} md={3}>
                          <Button
                            block
                            onClick={() => {
                              dispatch(increment(val));
                            }}
                          >
                            Edit
                          </Button>
                        </Col>
                        <Col xs={7} md={3}>
                          <Button
                            block
                            onClick={() => {
                              publishPost(val);
                            }}
                          >
                            Published
                          </Button>
                        </Col>
                        <Col xs={5} md={3}>
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
        )}
      </div>
      ;
    </>
  );
}
