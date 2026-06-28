import { QRCodeGenerator } from "@/components/QRCodeGenerator";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center w-full">
      <QRCodeGenerator />
    </main>
  );
}
