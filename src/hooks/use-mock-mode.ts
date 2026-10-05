import { useEffect, useState } from "react";
import { MOCK_EVENT, isMockMode } from "@/lib/config";

export function useMockMode() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const sync = () => setOn(isMockMode());
    sync();
    window.addEventListener(MOCK_EVENT, sync);
    return () => window.removeEventListener(MOCK_EVENT, sync);
  }, []);
  return on;
}
