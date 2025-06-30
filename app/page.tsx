import { ChatBox } from "./_components/chat-box";

export default function Home() {
  return (
    <div className="flex justify-center items-center w-full h-screen">
        <div className="flex w-full flex-col items-center justify-center ">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-mono font-semibold">Welcome to Sourcerer</h1>
          <p className="mt-2 mb-8 md:text-lg lg:text-xl">What can I help you with?</p>
          <div className="w-full flex justify-center">
            <ChatBox />
          </div>
        </div>
    </div>
  );
}
