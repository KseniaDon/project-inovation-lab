import { useState, useEffect, useRef, useCallback } from "react";
import func2url from "../../../backend/func2url.json";

export type TkmStage = "form" | "section2" | "section3" | "section4" | "section5" | "section6" | "submit" | "done";

export interface TkmMeta {
  nickname: string;
  vkLink: string;
  department: string;
  activationCode?: string;
}

interface TkmSessionData {
  meta: TkmMeta;
  answers: Record<string, string>;
  stage: TkmStage;
  startedAt: number;
}

const STORAGE_KEY = "tkm_session";
const DURATION_MS = 90 * 60 * 1000;
const TKM_URL = func2url["tkm"];

function loadSession(): TkmSessionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TkmSessionData;
  } catch {
    return null;
  }
}

function saveSession(data: TkmSessionData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearTkmSession() {
  localStorage.removeItem(STORAGE_KEY);
}

function normalizeVk(link: string): string {
  return link.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?(vk\.(ru|com))\/@?/, "").replace(/\/$/, "");
}

export function useTkmSession() {
  const saved = loadSession();

  const [stage, setStageRaw] = useState<TkmStage>(saved?.stage ?? "form");
  const [meta, setMeta] = useState<TkmMeta | null>(saved?.meta ?? null);
  const [answers, setAnswersRaw] = useState<Record<string, string>>(saved?.answers ?? {});
  const [startedAt, setStartedAt] = useState<number | null>(saved?.startedAt ?? null);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (!saved?.startedAt) return DURATION_MS;
    const elapsed = Date.now() - saved.startedAt;
    return Math.max(0, DURATION_MS - elapsed);
  });
  const [expired, setExpired] = useState<boolean>(() => {
    if (!saved?.startedAt) return false;
    return Date.now() - saved.startedAt >= DURATION_MS;
  });

  // Проверяем при загрузке, не сбросил ли администратор сессию
  useEffect(() => {
    const session = loadSession();
    if (!session || session.stage === "form" || session.stage === "done") return;
    const nick = normalizeVk(session.meta.vkLink);
    if (!nick) return;
    fetch(`${TKM_URL}?action=check_reset&nick=${encodeURIComponent(nick)}`)
      .then(r => r.json())
      .then(data => {
        if (data.reset) {
          clearTkmSession();
          setStageRaw("form");
          setMeta(null);
          setAnswersRaw({});
          setStartedAt(null);
          setTimeLeft(DURATION_MS);
          setExpired(false);
        }
      })
      .catch(() => {});
  }, []);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isActive = stage !== "form" && stage !== "done";

  const startTimer = useCallback((at: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const left = Math.max(0, DURATION_MS - (Date.now() - at));
      setTimeLeft(left);
      if (left === 0) {
        setExpired(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (startedAt && !expired) {
      startTimer(startedAt);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startedAt, expired, startTimer]);

  const setStage = useCallback((s: TkmStage) => {
    setStageRaw(s);
  }, []);

  const setAnswers = useCallback((updater: (prev: Record<string, string>) => Record<string, string>) => {
    setAnswersRaw(updater);
  }, []);

  useEffect(() => {
    if (!meta || stage === "form" || stage === "done") return;
    const data: TkmSessionData = {
      meta,
      answers,
      stage,
      startedAt: startedAt ?? Date.now(),
    };
    saveSession(data);
  }, [meta, answers, stage, startedAt]);

  const startSession = useCallback((m: TkmMeta) => {
    const now = Date.now();
    setMeta(m);
    setAnswersRaw({});
    setStartedAt(now);
    setTimeLeft(DURATION_MS);
    setExpired(false);
    setStageRaw("section2");
    const data: TkmSessionData = { meta: m, answers: {}, stage: "section2", startedAt: now };
    saveSession(data);
    startTimer(now);
  }, [startTimer]);

  const mergeAnswers = useCallback((newAnswers: Record<string, string>, nextStage: TkmStage) => {
    setAnswersRaw(prev => {
      const merged = { ...prev, ...newAnswers };
      return merged;
    });
    setStageRaw(nextStage);
  }, []);

  const finishSession = useCallback(() => {
    clearTkmSession();
    setStageRaw("done");
    setStartedAt(null);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const resetSession = useCallback(() => {
    clearTkmSession();
    setStageRaw("form");
    setMeta(null);
    setAnswersRaw({});
    setStartedAt(null);
    setTimeLeft(DURATION_MS);
    setExpired(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    stage,
    setStage,
    meta,
    answers,
    setAnswers,
    timeLeft,
    expired,
    isActive,
    startSession,
    mergeAnswers,
    finishSession,
    resetSession,
  };
}