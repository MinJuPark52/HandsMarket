import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { CgCloseR } from "react-icons/cg";
import { db } from "../../firebase/firebaseConfig";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BeatLoader } from "react-spinners";

type CommentType = {
  id: string;
  nickname: string;
  text: string;
  createdAt: Date | null;
};

type CommentBoxProps = {
  postId: string;
};

function generateRandomNickname() {
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return `User${randomNum}`;
}

export default function CommentBox({ postId }: CommentBoxProps) {
  const [nickname, setNickname] = useState("");
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  // 닉네임 불러오기
  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname");
    if (savedNickname) {
      setNickname(savedNickname);
    } else {
      const newNick = generateRandomNickname();
      setNickname(newNick);
      localStorage.setItem("nickname", newNick);
    }
  }, []);

  // 댓글 가져오기
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const q = query(
        collection(db, "posts", postId, "comments"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          nickname: d.nickname ?? "익명",
          text: d.text,
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : null,
        } as CommentType;
      });
    },
  });

  // 댓글 추가
  const addCommentMutation = useMutation({
    mutationFn: async (text: string) => {
      await addDoc(collection(db, "posts", postId, "comments"), {
        nickname,
        text,
        createdAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  // 댓글 삭제
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  return (
    <div className="p-2">
      <h3 className="text-lg font-semibold mb-3">댓글</h3>

      {/* 댓글 목록 */}
      <ul className="mb-4">
        {isLoading && (
          <div className="flex justify-center items-center h-20">
            <BeatLoader color="#9CA3AF" size={13} margin={2} />
          </div>
        )}
        {!isLoading && comments?.length === 0 && (
          <p className="text-gray-500">행운의 첫 댓글을 남겨보세요!</p>
        )}
        {comments?.map((c) => (
          <li
            key={c.id}
            className="p-2 flex justify-between items-start border-b border-gray-200"
          >
            <div className="flex items-start gap-3">
              {/* 아바타 이미지 */}
              <img
                src={`https://i.pravatar.cc/100?u=${c.id}`}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />

              {/* 댓글 내용 */}
              <div>
                <div className="font-semibold text-sm text-gray-700">
                  {c.nickname}
                </div>
                <div className="text-gray-800 text-sm mt-1">{c.text}</div>
                {c.createdAt && (
                  <div className="text-xs text-gray-400 mt-1">
                    {c.createdAt.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* 삭제 버튼 */}
            <button
              onClick={() => deleteCommentMutation.mutate(c.id)}
              className="text-red-500 hover:text-red-700 text-lg"
              title="댓글 삭제"
            >
              <CgCloseR />
            </button>
          </li>
        ))}
      </ul>

      {/* 댓글 입력창 */}
      <div className="flex flex-col mb-6 gap-2">
        <div className="flex items-start gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 남겨주세요."
            className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none"
            rows={1}
          />
          <button
            onClick={() => addCommentMutation.mutate(newComment)}
            className="bg-gray-800 text-white px-8 py-2 rounded-md hover:bg-gray-700 transition h-fit"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
