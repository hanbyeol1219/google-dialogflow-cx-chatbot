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
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: `권오형 대표는 건국대학교 신산업융합학과 겸임교수, (주)모리아타운과 모리아컨설팅의 대표이사, 디지털융합교육원 석좌교수로 활동 중입니다. \n삼성전자 연구원과 (주)오픈타운 대표이사를 지낸 그는 2018년 대한민국 신지식인상, 2021년 The Marquis Who’s Who 등재, 매일경제 BEST 벤처 수상 등 다수의 상을 수상하며 업계에서 인정받아 왔습니다.\n베스트셀러 저서 <a href='https://product.kyobobook.co.kr/detail/S000202612253' target='_blank'>[AI 챗GPT 시대 ESG 지속가능경영보고서 작성 실무]</a>와 <a href='https://product.kyobobook.co.kr/detail/S000201054376' target='_blank'>[이것이 챗GPT다]</a>를 집필하였으며, 중소기업학회 등 여러 학회에서 활발히 활동하고 있습니다.\n
연락처\n• 010-3174-9347\n• tongkennom@gmail.com`,
    },
  ]);
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
      text: "권오형 대표 소개",
      type: "message",
      // event: "introduction_event",
    },
    {
      text: "연락처",
      type: "message",
      // event: "introduction_event",
    },
    {
      text: "학력",
      type: "message",
      // event: "button2_event",
    },
    {
      text: "경력",
      type: "message",
      // event: "button3_event",
    },
    {
      text: "수상",
      type: "message",
      // event: "button4_event",
    },
    {
      text: "논문",
      type: "message",
      // event: "button5_event",
    },
    {
      text: "학회",
      type: "message",
      // event: "button5_event",
    },
    {
      text: "저서",
      type: "message",
      // event: "button5_event",
    },
  ];

  // Dialogflow API 필요 변수
  const sessionId = useRef(uuid());

  const handleSendMessage = async (message) => {
    if (!message || message.trim() === "") return;

    setUserMessage("");

    if (
      messages.length > 1 &&
      messages[messages.length - 1].buttons &&
      messages[messages.length - 1].buttons.some(
        (button) => button.text === message
      )
    ) {
      const button = messages[messages.length - 1].buttons.find(
        (button) => button.text === message
      );
      handleButtonClick(button);
      return;
    }

    // if (buttons.some((button) => button.text === userMessage)) {
    //   const button = buttons.find((button) => button.text === userMessage);
    //   handleButtonClick(button);
    //   return;
    // }

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: message,
        createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
    ]);

    try {
      const botResponses = await sendMessage(
        `${name}님의 ` + message,
        // message,
        sessionId.current
      );
      console.log("botResponses:", botResponses);
      const parsedMessages = parseBotResponses(botResponses);
      console.log("parsedMessages:", parsedMessages);
      setMessages((prev) => [...prev, ...parsedMessages]);
    } catch (error) {
      console.error("API 호출 오류:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요.",
          createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          error: true,
        },
      ]);
    }
  };

  // 버튼 클릭 → 이벤트
  const handleButtonClick = async (button) => {
    if (button.type === "message") {
      handleSendMessage(button.text);
      return;
    }

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
            text: "서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요.",
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
      handleSendMessage(userMessage);
    }
  };

  useEffect(() => {
    if (inputRef.current && window.innerWidth > 768) {
      inputRef.current.focus();
    }
  }, [messages]);

  useLayoutEffect(() => {
    if (inputRef.current && window.innerWidth > 768) {
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

  const sendDefaultIntroduction = async () => {
    try {
      const botResponses = await sendEvent(
        "default_introduction",
        sessionId.current
      );
      const parsedMessages = parseBotResponses(botResponses);
      setMessages((prev) => [...prev, ...parsedMessages]);
    } catch (error) {
      console.error("API 호출 오류:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요.",
          createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          error: true,
        },
      ]);
    }
  };

  useEffect(() => {
    sendDefaultIntroduction();
    // const fetchBotResponse = async () => {
    //   try {
    //     const botResponse = await sendMessage(
    //       `${name}정보로 간단한 소개를 해주세요.`,
    //       sessionId.current
    //     );
    //     const parsedMessages = parseBotResponses(botResponse);
    //     setMessages((prev) => [...prev, ...parsedMessages]);
    //   } catch (error) {
    //     console.error("API 호출 오류:", error);
    //     setMessages((prev) => [
    //       ...prev,
    //       {
    //         type: "bot",
    //         text: "서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요.",
    //         createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    //         error: true,
    //       },
    //     ]);
    //   }
    // };

    // fetchBotResponse();
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
                  dangerouslySetInnerHTML={{ __html: message.text }}
                />
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
          <S.ChatbotInputButton onClick={() => handleSendMessage(userMessage)}>
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
