import { useEffect } from "react";
import { useRouter } from "next/router";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Scanner() {
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        scanner.clear();
        try {
          const res = await fetch(`/api/lookup?code=${encodeURIComponent(decodedText)}`);
          if (!res.ok) throw new Error("Código não encontrado");
          const data = await res.json();
          router.replace(`https://checkinlegendariosce.softr.app/contacts-details?recordId=${data.recordId}`);
        } catch (error) {
          alert(error.message);
          scanner.render();
        }
      },
      (error) => {
        // pode ignorar erros de leitura momentânea
      }
    );

    return () => {
      scanner.clear();
    };
  }, [router]);

  return <div id="reader" style={{ width: "100%", maxWidth: 320, margin: "auto" }}></div>;
}
