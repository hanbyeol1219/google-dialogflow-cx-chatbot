import uuid from "react-uuid";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { S } from "./chatbot.styles";
import { FiSend } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { parseBotResponses, sendEvent, sendMessage } from "../api/api";
import ProfileImage from "../assets/profile-removebg-preview.png";
import PefamImage from "../assets/pefam.png";
import ForcatImage from "../assets/forcat.png";
import CompanyImage from "../assets/company.png";

export const Chatbot = () => {
  const name = useParams().name;
  const [bottomMenuOpen, setBottomMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [menuHeight, setMenuHeight] = useState(0);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const lastMessageRef = useRef(null);
  const bottomMenuRef = useRef(null);
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  const bottomMenus = [
    {
      text: "Moriahtown",
      anchor: "https://www.moriahtown.com/",
      img: CompanyImage,
    },
    {
      text: "Pefam",
      anchor: "https://pefam.co.kr/",
      img: PefamImage,
    },
    {
      text: "Forcat",
      anchor: "https://www.forcat.kr/",
      img: ForcatImage,
    },
  ];
  const buttons = [
    {
      text: "소개",
      event: "button1_event",
    },
    {
      text: "학력",
      event: "button2_event",
    },
    {
      text: "경력",
      event: "button3_event",
    },
    {
      text: "수상",
      event: "button4_event",
    },
    {
      text: "논문",
      event: "button5_event",
    },
    {
      text: "학회",
      event: "button6_event",
    },
    {
      text: "저서",
      event: "button7_event",
    },
  ];

  // Dialogflow API 필요 변수
  const sessionId = useRef(uuid());

  const handleSendMessage = async () => {
    if (userMessage.trim() === "") return;

    setUserMessage("");

    if (
      messages.length > 1 &&
      messages[messages.length - 1].buttons &&
      messages[messages.length - 1].buttons.some(
        (button) => button.text === userMessage
      )
    ) {
      const button = messages[messages.length - 1].buttons.find(
        (button) => button.text === userMessage
      );
      handleButtonClick(button);
      return;
    }

    if (buttons.some((button) => button.text === userMessage)) {
      const button = buttons.find((button) => button.text === userMessage);
      handleButtonClick(button);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userMessage,
        createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
    ]);

    try {
      const botResponses = await sendMessage(userMessage, sessionId.current);
      console.log("botResponses:", botResponses);
      const parsedMessages = parseBotResponses(botResponses);
      setMessages((prev) => [...prev, ...parsedMessages]);
    } catch (error) {
      console.error("API 호출 오류:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "서버와의 통신 중 오류가 발생했습니다.\n다시 시도해주세요.",
          createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          error: true,
        },
      ]);
    }
  };

  const handleButtonClick = async (button) => {
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: button.text,
        createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
    ]);

    if (button.event) {
      try {
        const botResponses = await sendEvent(button.event, sessionId.current);
        const parsedMessages = parseBotResponses(botResponses);
        setMessages((prev) => [...prev, ...parsedMessages]);
      } catch (error) {
        console.error("API 호출 오류:", error);
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "서버와의 통신 중 오류가 발생했습니다.\n다시 시도해주세요.",
            createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            error: true,
          },
        ]);
      }
      return;
    }

    if (button.anchor) {
      window.open(button.anchor, "_blank");
      return;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && userMessage.trim() !== "") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (bottomMenuRef.current) {
      setMenuHeight(bottomMenuRef.current.offsetHeight);
    }
  }, [bottomMenuOpen]);

  useEffect(() => {
    console.log("messages:", messages);
  }, [messages]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages]);

  const handleMouseDown = (e) => {
    isDragging = true;
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging = false;
  };

  const sendWelcomeEvent = async () => {
    try {
      const botResponses = await sendEvent("welcome_event", sessionId.current);
      const parsedMessages = parseBotResponses(botResponses);
      setMessages((prev) => [...prev, ...parsedMessages]);
    } catch (error) {
      console.error("API 호출 오류:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "서버와의 통신 중 오류가 발생했습니다.\n다시 시도해주세요.",
          createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          error: true,
        },
      ]);
    }
  };

  useEffect(() => {
    sendWelcomeEvent();
  }, []);

  return (
    <S.Chatbot>
      <S.ChatbotContainer>
        <S.ChatbotHeader>
          <S.ChatbotHeaderTitle>
            {name
              ? `안녕하세요!\n
            ${name}님의 프로필입니다.`
              : "안녕하세요!"}
          </S.ChatbotHeaderTitle>
          {/* 이미지가 없으면 아예 보이지 않도록 처리 */}
          {ProfileImage && name && (
            <S.ChatbotHeaderImagaeBox>
              <S.ChatbotHeaderImage src={ProfileImage} />
            </S.ChatbotHeaderImagaeBox>
          )}
        </S.ChatbotHeader>
        <S.BasicButtonWrapper
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {buttons.map((button, i) => (
            <S.BasicButton key={i} onClick={() => handleButtonClick(button)}>
              {button.text}
            </S.BasicButton>
          ))}
        </S.BasicButtonWrapper>
        <S.ChatbotMessages
          $isBottomMenuOpen={bottomMenuOpen}
          $menuHeight={menuHeight}
          $inputHeight={60}
          $headerHeight={205}
        >
          {messages.map((message, index) => (
            <S.ChatbotMessage
              key={index}
              $isUser={message.type == "user"}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              <S.ChatbotMessageTime $isUser={message.type == "user"}>
                {moment(message.createTime).format("HH:mm")}
              </S.ChatbotMessageTime>
              {message.text && (
                <S.ChatbotMessageText
                  $isUser={message.type == "user"}
                  $isError={message.error}
                >
                  {message.text}
                </S.ChatbotMessageText>
              )}
              {message.buttons && (
                <S.ChatbotButtons>
                  {message.buttons.map((button, i) => (
                    <S.ChatbotButton
                      key={i}
                      onClick={() => handleButtonClick(button)}
                    >
                      {button.text}
                    </S.ChatbotButton>
                  ))}
                </S.ChatbotButtons>
              )}
            </S.ChatbotMessage>
          ))}
        </S.ChatbotMessages>
        <S.ChatbotInput
          $isBottomMenuOpen={bottomMenuOpen}
          $menuHeight={menuHeight}
        >
          <S.ChatbotBottomMenuIcon
            onClick={() => setBottomMenuOpen(!bottomMenuOpen)}
          >
            <S.IconWrapper $isOpen={bottomMenuOpen}>
              <FaPlus style={{ color: "#585858" }} />
            </S.IconWrapper>
          </S.ChatbotBottomMenuIcon>
          <S.ChatbotInputText
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          <S.ChatbotInputButton onClick={handleSendMessage}>
            <S.ChatbotInputButtonIcon>
              <FiSend style={{ color: "#3baad6" }} />
            </S.ChatbotInputButtonIcon>
          </S.ChatbotInputButton>
        </S.ChatbotInput>
        <S.ChatbotBottomMenu ref={bottomMenuRef} $isOpen={bottomMenuOpen}>
          {bottomMenus.map((menu, i) => (
            <S.ChatbotBottomMenuItem
              key={i}
              onClick={() => handleButtonClick(menu)}
            >
              {menu.img ? (
                <img
                  src={menu.img}
                  style={{
                    height: "35px",
                  }}
                />
              ) : (
                menu.text
              )}
            </S.ChatbotBottomMenuItem>
          ))}
        </S.ChatbotBottomMenu>
      </S.ChatbotContainer>
    </S.Chatbot>
  );
};
