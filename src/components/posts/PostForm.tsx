"use client";

import "./index.scss";
import { ChangeEvent, MouseEvent, useState } from "react";
import { notoSansKr } from "@/utils/font";
import { useRecoilValue } from "recoil";
import { authAtoms } from "@/atoms/authAtoms";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const PostForm = () => {
  const [body, setBody] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const authUser = useRecoilValue(authAtoms);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleBodyText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleTitleText = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const addNewPost = async () => {
    const res = await axios("/api/post/new", {
      method: "POST",
      data: {
        userId: authUser?.id,
        title,
        body,
        createdAt: new Date().toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    });

    return res.data;
  };

  const mutation = useMutation({
    mutationKey: ["addNewPost"],
    mutationFn: addNewPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (null == authUser) {
      router.push("/signin");
      return;
    } else if (null == body || body?.length <= 0) {
      alert("The body is empty");
      return;
    } else if (null == title || title?.length <= 0) {
      alert("The title is empty");
      return;
    }

    mutation.mutate();
    // setBody(null);
    // setTitle(null);
  };

  return (
    <div className="post-form">
      <textarea
        className={`post-form__textarea ${notoSansKr.className}`}
        id="content"
        name="content"
        placeholder="What is in your mind?"
        onChange={handleBodyText}
        value={body}
      />
      <div className="post-form__button-header">
        <button
          className={`post-form__button ${notoSansKr.className}`}
          onClick={handleSubmit}
        >
          Write
        </button>
        <input
          className={`post-form__input-header ${notoSansKr.className}`}
          id="header"
          name="header"
          placeholder="What title is on your mind?"
          value={title}
          onChange={handleTitleText}
        />
      </div>
    </div>
  );
};

export default PostForm;
