import ChatSection from "./ChatSection";
import LeftMenu from "./LeftMenu";

const Home = () => {
  return (
    <section className="bg-white dark:bg-gray-900 flex-row flex h-screen overflow-hidden ">
      <LeftMenu />

      <ChatSection />
    </section>
  );
};

export default Home;
