import { useState, useEffect } from "react";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const queryClient = useQueryClient();

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

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      text,
    }: {
      commentId: string;
      text: string;
    }) => {
      await updateDoc(doc(db, "posts", postId, "comments", commentId), {
        text,
      });
    },
    onSuccess: () => {
      setEditingId(null);
      setEditedText("");
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
          <p className="text-gray-500 dark:text-gray-300">
            행운의 첫 댓글을 남겨보세요!
          </p>
        )}
        {comments?.map((c) => (
          <li
            key={c.id}
            className="p-2 flex justify-between items-start border-b border-gray-200"
          >
            <div className="flex items-start gap-3 w-full">
              {/* 프로필 */}
              <img
                src={`https://i.pravatar.cc/100?u=${c.id}`}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />

              <div className="flex flex-1 justify-between items-start gap-2">
                {/* 댓글 내용 */}
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-700">
                    {c.nickname}
                  </div>

                  {editingId === c.id ? (
                    <>
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full border border-gray-300 rounded p-1 mt-1"
                        rows={2}
                      />
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() =>
                            updateCommentMutation.mutate({
                              commentId: c.id,
                              text: editedText,
                            })
                          }
                          className="text-sm text-blue-600 hover:underline"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditedText("");
                          }}
                          className="text-sm text-gray-500 hover:underline"
                        >
                          취소
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-gray-800 text-sm mt-1">{c.text}</div>
                      {c.createdAt && (
                        <div className="text-xs text-gray-400 mt-1">
                          {c.createdAt.toLocaleDateString()}{" "}
                          {c.createdAt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/*수정/삭제 */}
                {c.nickname === nickname && editingId !== c.id && (
                  <div className="flex items-center gap-2 text-sm ml-auto whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditedText(c.text);
                      }}
                      className="text-gray-400 text-md"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => deleteCommentMutation.mutate(c.id)}
                      className="text-red-500 text-md"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
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
