import { useState, useRef, useCallback } from "react";
import openaiInstance, { model } from "./OpenAI";
import "./styles.css";

export default function App() {
  const [conversation, setConversation] = useState([]);
  // Use this to store the current data to avoid re-painting.
  const messageRef = useRef("");
  const onSubmit = (event) => {
    talkToAI(messageRef.current.value);
    event.preventDefault();
    messageRef.current.value = "";
  };

  const talkToAI = useCallback(
    async (text) => {
      // Insert message at first element.
      conversation.unshift(text);
      setConversation([...conversation]);
      const response = await openaiInstance.createCompletion({
        model: "text-davinci-003",
        prompt:
          "Geef 2 hele korte en 1 langere onderwerpsregels met 1 emoticon erin voor een email als HTML list items (UL/LI) op basis van deze inhoud:" +
          text,
        max_tokens: 150
      });
      console.log(response.data);
      // Append AI message.
      setConversation((currentConversation) => [
        response.data.choices[0].text,
        ...currentConversation
      ]);
    },
    [conversation]
  );

  return (
    <div className="App">
      <h1>Genereer je onderwerpsregel</h1>
      <form onSubmit={onSubmit}>
        Omschrijf hier waar je e-mail over gaat: <br />
        <br />
        <textarea ref={messageRef} />
        <input type="submit" value="verzenden" />
      </form>
      {conversation.map((msg, index) => {
        if ((conversation.length - index + 1) % 2 === 0)
          return (
            <>
              <p class="bold">Omschrijving van jouw e-mail:</p>
              <div dangerouslySetInnerHTML={{ __html: msg }}></div>
              <br />
            </>
          );
        else {
          return (
            <>
              <p class="bold">Laat je inspireren met deze resultaten:</p>
              <div dangerouslySetInnerHTML={{ __html: msg }}></div>
              <br />
            </>
          );
        }
      })}
    </div>
  );
}
