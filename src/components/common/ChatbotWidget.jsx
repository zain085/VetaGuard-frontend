import { useState, useRef, useEffect } from "react";
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiTrash2,
  FiAlertCircle,
} from "react-icons/fi";
import { chatbotService } from "../../services/chatbot.service";
import Logo from "./Logo";

const WELCOME_MESSAGE =
  "Hi! I'm the VetaGuard Assistant 🐾 Ask me about pet care, appointments, adoption, or how VetaGuard works. For emergencies, please contact a vet directly.";

const MAX_HISTORY_TURNS = 12;

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: WELCOME_MESSAGE,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, sending]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleSend = async (e) => {
    e.preventDefault();

    const trimmed = input.trim();

    if (!trimmed || sending) return;

    const userMessage = {
      role: "user",
      content: trimmed,
    };

    // Messages that will be displayed in the UI.
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setSending(true);

    try {
      /*
       * Don't send the welcome message to Gemini.
       *
       * Also don't send the current message as history because
       * it is already sent separately as the `message` argument.
       */
      const history = messages
        .filter(
          (message) =>
            message.role === "user" || message.role === "assistant"
        )
        .filter(
          (message) =>
            !(
              message.role === "assistant" &&
              message.content === WELCOME_MESSAGE
            )
        )
        .slice(-MAX_HISTORY_TURNS);

      const response = await chatbotService.sendMessage(
        trimmed,
        history
      );

      const reply = response?.data?.reply;

      if (!reply || typeof reply !== "string") {
        throw new Error("The AI returned an invalid response.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply.trim(),
        },
      ]);
    } catch (err) {
      console.error("VetaGuard chatbot error:", err);

      const status = err?.response?.status;

      let friendlyMessage =
        "Something went wrong. Please try again.";

      if (status === 429) {
        friendlyMessage =
          "Too many messages right now. Please wait a moment and try again.";
      } else if (status === 502) {
        friendlyMessage =
          "The AI assistant is temporarily unavailable. Please try again shortly.";
      } else if (status === 400) {
        friendlyMessage =
          err?.response?.data?.message ||
          "Please check your message and try again.";
      } else if (!err?.response) {
        friendlyMessage =
          "Unable to connect to the AI assistant. Please check your connection and try again.";
      }

      setError(
        err?.friendlyMessage ||
          err?.response?.data?.message ||
          friendlyMessage
      );
    } finally {
      setSending(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content: WELCOME_MESSAGE,
      },
    ]);

    setInput("");
    setError("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <>
      {/* Chat Toggle */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={
          open ? "Close chat assistant" : "Open chat assistant"
        }
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-lg theme-transition">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-surface-elevated px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <Logo className="h-6 w-6 shrink-0" />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text">
                  VetaGuard Assistant
                </p>

                <p className="text-xs text-text-muted">
                  Informational only, not a vet
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear chat"
              title="Clear chat"
              className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-bg hover:text-danger focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <FiTrash2 size={16} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
            aria-live="polite"
          >
            {messages.length === 0 && (
              <p className="mt-6 text-center text-sm text-text-muted">
                Ask a question to get started.
              </p>
            )}

            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-primary text-white"
                    : "mr-auto border border-border bg-surface-elevated text-text"
                }`}
              >
                {message.content}
              </div>
            ))}

            {/* Typing Indicator */}
            {sending && (
              <div
                className="mr-auto flex items-center gap-1 rounded-lg border border-border bg-surface-elevated px-3 py-2"
                aria-label="Assistant is typing"
              >
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted" />
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger"
                role="alert"
              >
                <FiAlertCircle className="mt-0.5 shrink-0" />

                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pet care, appointments..."
              maxLength={1000}
              disabled={sending}
              autoComplete="off"
              aria-label="Message VetaGuard Assistant"
              className="flex-1 rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              title="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}