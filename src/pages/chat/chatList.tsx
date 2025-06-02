import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  limit,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { BeatLoader } from "react-spinners";

interface ChatData {
  id: string;
  productId: string;
  userId: string;
  sellerId: string;
  createdAt: any;
  lastMessage?: string;
  opponentName?: string;
  opponentProfile?: string;
}

const ChatList = () => {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formatDate = (timestamp: any): string => {
    if (!timestamp?.toDate) return "시간 정보 없음";
    const date = timestamp.toDate();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    let hours = date.getHours();
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    const period = hours < 12 ? "오전" : "오후";
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    return `${year}.${month}.${day} ${period} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchOpponentInfo = async (userId: string) => {
      try {
        const docRef = doc(db, "authors", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            name: data.nickname || "사용자",
            profile: data.profileImage || "/default-profile.png",
          };
        }
      } catch (err) {
        console.error("상대방 정보 로드 실패", err);
      }
      return {
        name: "알 수 없음",
        profile: "/default-profile.png",
      };
    };

    const fetchLastMessage = async (chatId: string) => {
      try {
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const msgData = snapshot.docs[0].data();
          return msgData.text || "";
        }
      } catch (err) {
        console.error("마지막 메시지 로딩 실패", err);
      }
      return "";
    };

    const fetchChatsWithDetails = async (
      docs: any[],
      currentUserId: string
    ) => {
      const chatList: ChatData[] = [];
      for (const docSnap of docs) {
        const data = docSnap.data();
        const isCurrentUserSeller = data.sellerId === currentUserId;
        const opponentId = isCurrentUserSeller ? data.userId : data.sellerId;
        const { name, profile } = await fetchOpponentInfo(opponentId);
        const lastMessage = await fetchLastMessage(docSnap.id);
        chatList.push({
          id: docSnap.id,
          ...data,
          opponentName: name,
          opponentProfile: profile,
          lastMessage,
        });
      }
      return chatList;
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const authorsRef = collection(db, "authors");
        const authorQuery = query(authorsRef, where("uid", "==", user.uid));
        const authorSnapshot = await getDocs(authorQuery);

        let sellerId = user.uid;
        if (!authorSnapshot.empty) {
          sellerId = authorSnapshot.docs[0].id;
        }

        const chatsRef = collection(db, "chats");

        const qUser = query(
          chatsRef,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const qSeller = query(
          chatsRef,
          where("sellerId", "==", sellerId),
          orderBy("createdAt", "desc")
        );

        const [userSnapshot, sellerSnapshot] = await Promise.all([
          getDocs(qUser),
          getDocs(qSeller),
        ]);

        const userChats = await fetchChatsWithDetails(
          userSnapshot.docs,
          user.uid
        );
        const sellerChats = await fetchChatsWithDetails(
          sellerSnapshot.docs,
          sellerId
        );

        const mergedChats = [...userChats];
        sellerChats.forEach((chat) => {
          if (!mergedChats.find((c) => c.id === chat.id)) {
            mergedChats.push(chat);
          }
        });

        mergedChats.sort((a, b) => {
          const timeA = a.createdAt?.toDate
            ? a.createdAt.toDate().getTime()
            : 0;
          const timeB = b.createdAt?.toDate
            ? b.createdAt.toDate().getTime()
            : 0;
          return timeB - timeA;
        });

        setChats(mergedChats);
        setLoading(false);
      } catch (e: any) {
        setError("채팅 로딩 실패: " + e.message);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-20">
        <BeatLoader color="#9CA3AF" size={13} margin={3} />
      </div>
    );

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  if (chats.length === 0)
    return (
      <div className="mt-20 text-center py-10 text-gray-400">
        채팅이 없습니다.
      </div>
    );

  return (
    <div className="w-[1024px] mx-auto mt-20">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() =>
            navigate(`/chatroom/${chat.productId}?sellerId=${chat.sellerId}`)
          }
          className="cursor-pointer p-4 border-b border-gray-200 hover:bg-gray-50 flex justify-between items-start"
        >
          <div className="flex items-start gap-4">
            <img
              src={chat.opponentProfile}
              alt="프로필"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-gray-800">
                {chat.opponentName}
              </div>
              <div className="text-md text-gray-500 mt-1 line-clamp-1">
                {chat.lastMessage || ""}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400 whitespace-nowrap">
            {formatDate(chat.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
