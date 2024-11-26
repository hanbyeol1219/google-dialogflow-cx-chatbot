import styled from "styled-components";

export const S = {
  Chatbot: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: #dddddd;
    margin: 0;
    padding: 0;
  `,
  ChatbotContainer: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 500px;
    height: 100%;
    min-width: 314px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    position: relative;

    @media (max-width: 500px) {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
  `,
  ChatbotHeader: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 150px;
    min-height: 150px;
    background: linear-gradient(45deg, #3d9bc7, #94cde4, #489dbe);
    background-size: 200% 200%;
    border-bottom: 1px solid #e0e0e0;
    padding: 0 15px;

    animation: gradientAnimation 10s ease infinite;
    @keyframes gradientAnimation {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `,
  ChatbotHeaderTitle: styled.h1`
    margin: 0;
    padding: 0;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    white-space: pre-line;
    z-index: 100;
  `,
  ChatbotHeaderImagaeBox: styled.div`
    width: 150px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    // @media (max-width: 450px) {
    //   display: none;
    // }
  `,
  ChatbotHeaderImage: styled.img`
    width: 100%;
  `,
  ChatbotMessages: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: ${(props) =>
      props.$isBottomMenuOpen
        ? `calc(100% - ${
            props.$inputHeight + props.$menuHeight + props.$headerHeight
          }px)`
        : `calc(100% - ${props.$headerHeight + props.$inputHeight}px)`};
    padding: 20px;
    padding-bottom: 5px;
    overflow-y: auto;
    background-color: #fff;
    position: relative;

    &::-webkit-scrollbar {
      width: 12px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #c5c5c5;
      border-radius: 10px;
      background-clip: padding-box;
      border: 2px solid transparent;
    }
    &::-webkit-scrollbar-track {
      background-color: #f3f3f3;
      border-radius: 10px;
    }
  `,
  ChatbotMessage: styled.div`
    display: flex;
    justify-content: flex-end;
    flex-direction: ${({ $isUser }) => ($isUser ? "row" : "row-reverse")};
    align-items: flex-end;
    width: 100%;
    margin: 7px 0;
    align-self: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
  `,

  ChatbotMessageText: styled.div`
    background-color: ${({ $isUser }) => ($isUser ? "#cfe5f1" : "#ffffff")};
    color: ${({ $isError }) => ($isError ? "#b90808" : "#000")};
    margin: 0;
    padding: 10px 15px;
    border-radius: 10px;
    max-width: 70%;
    white-space: pre-wrap;
    word-break: break-word;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  `,
  ChatbotMessageTime: styled.div`
    margin: 0;
    padding: 0;
    font-size: 12px;
    color: #888;
    margin-left: ${({ $isUser }) => ($isUser ? "0" : "6px")};
    margin-right: ${({ $isUser }) => ($isUser ? "6px" : "0")};
  `,
  ChatbotInput: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
    background-color: #f5f5f5;
    border-top: 1px solid #e0e0e0;
    padding: 5px 10px;
    position: absolute;
    bottom: ${(props) =>
      props.$isBottomMenuOpen ? `${props.$menuHeight}px` : "0"};
    border-bottom: ${(props) =>
      props.$isBottomMenuOpen ? "1px solid #e0e0e0" : "none"};
    transition: bottom 0.3s ease-in-out;
  `,
  ChatbotInputText: styled.input`
    width: calc(100% - 80px);
    height: 40px;
    padding: 5px 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #e0e0e0;
    outline: none;
    background-color: #fff;
    color: #000;
  `,
  ChatbotInputButton: styled.div`
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  `,
  ChatbotInputButtonIcon: styled.div`
    font-size: 24px;
  `,
  IconWrapper: styled.div`
    display: inline-block;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.$isOpen ? "rotate(45deg)" : "rotate(0deg)")};
  `,

  ChatbotBottomMenuIcon: styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background-color: #f5f5f5;
  `,
  ChatbotBottomMenu: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #f5f5f5;
    position: absolute;
    bottom: 0;
    transform: translateY(${(props) => (props.$isOpen ? "0" : "100%")});
    opacity: ${(props) => (props.$isOpen ? "1" : "0")};
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  `,
  ChatbotBottomMenuItem: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
  `,
  ChatbotButtons: styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    background-color: #ffffff;
    padding: 8px;
    border-radius: 5px;
    max-width: 70%;
    word-wrap: break-word;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  `,

  ChatbotButton: styled.button`
    padding: 8px 12px;
    background-color: #3baad6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #1c8ebb;
    }
  `,
  BasicButtonWrapper: styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
    padding: 10px;
    background-color: #fff;
    z-index: 100;
    overflow-x: auto;
    scroll-behavior: smooth;
    user-select: none;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

    touch-action: pan-x;
    -webkit-overflow-scrolling: touch;
  `,
  BasicButton: styled.button`
    padding: 6px 15px;
    color: #3baad6;
    border: 1px solid #3baad6;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    outline: none;
    white-space: nowrap;
    background-color: #fff;

    &:hover {
      background-color: #3baad6;
      color: white;
      outline: none;
      border: 1px solid #3baad6;
    }
  `,
};
