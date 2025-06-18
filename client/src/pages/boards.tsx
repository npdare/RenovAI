import DesignBoards from "@/components/design-boards";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Boards() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <DesignBoards />
      </main>
      <Footer />
    </div>
  );
}