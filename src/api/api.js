import moment from "moment";
import axiosInstance from "./axios";

// API calling - user message sending
export const sendMessage = async (userMessage, sessionId) => {
  console.log("sendMessage 호출:", userMessage, sessionId);
  try {
    const response = await axiosInstance.post("/sendMessage", {
      userMessage,
      sessionId,
    });

    return response.data;
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
};

// API calling - event sending
export const sendEvent = async (event, sessionId) => {
  try {
    const response = await axiosInstance.post("/sendMessage", {
      event,
      sessionId,
    });

    return response.data;
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
};

// Bot responses parsing
export const parseBotResponses = (botResponses) => {
  const parsedMessages = [];

  botResponses.forEach((botResponse) => {
    // text
    if (botResponse.text && botResponse.text.text[0]) {
      parsedMessages.push({
        type: "bot",
        text: botResponse.text.text[0],
        createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        error: false,
      });
    }

    // payload
    if (
      botResponse.payload &&
      botResponse.payload.fields &&
      botResponse.payload.fields.richContent &&
      botResponse.payload.fields.richContent.listValue
    ) {
      const listValue = botResponse.payload.fields.richContent.listValue;

      if (Array.isArray(listValue.values)) {
        const buttons = listValue.values
          .map((listValueItem) => {
            return listValueItem.listValue?.values?.map((buttonItem) => {
              try {
                const text =
                  buttonItem.structValue?.fields?.text?.stringValue ||
                  "버튼 없음";
                const event =
                  buttonItem.structValue?.fields?.event?.structValue?.fields
                    ?.event?.stringValue || null;
                const anchor =
                  buttonItem.structValue?.fields?.anchor?.structValue?.fields
                    ?.href.stringValue || null;
                return { text, event, anchor };
              } catch (err) {
                console.error("버튼 처리 중 오류:", err);
                return { text: "버튼 없음", event: null, anchor: null };
              }
            });
          })
          .flat();

        parsedMessages.push({
          type: "bot",
          buttons: buttons,
          createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
      } else {
        console.warn("listValue.values가 배열이 아닙니다.");
      }
    } else {
      console.warn("알 수 없는 응답 구조: ", botResponse);
    }
  });

  return parsedMessages;
};
