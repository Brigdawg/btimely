"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const USER_ID_KEY = "btimely_user_id";

interface UserContextValue {
  userId: string | null;
  displayName: string | null;
  isLoading: boolean;
  setDisplayName: (name: string) => Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  userId: null,
  displayName: null,
  isLoading: true,
  setDisplayName: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayNameState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      let id = localStorage.getItem(USER_ID_KEY);

      if (id) {
        const res = await fetch("/api/users", {
          headers: { "x-user-id": id },
        });
        if (res.ok) {
          const data = await res.json();
          setUserId(data.userId);
          setDisplayNameState(data.displayName);
          setIsLoading(false);
          return;
        }
        localStorage.removeItem(USER_ID_KEY);
      }

      const res = await fetch("/api/users", { method: "POST" });
      const data = await res.json();
      localStorage.setItem(USER_ID_KEY, data.userId);
      setUserId(data.userId);
      setDisplayNameState(data.displayName);
      setIsLoading(false);
    }

    init();
  }, []);

  const setDisplayName = useCallback(
    async (name: string) => {
      if (!userId) return;
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "x-user-id": userId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName: name }),
      });
      if (res.ok) {
        const data = await res.json();
        setDisplayNameState(data.displayName);
      }
    },
    [userId]
  );

  return (
    <UserContext.Provider value={{ userId, displayName, isLoading, setDisplayName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function useUserHeaders(): Record<string, string> {
  const { userId } = useUser();
  return useMemo(
    () => (userId ? { "x-user-id": userId } : {}) as Record<string, string>,
    [userId]
  );
}
