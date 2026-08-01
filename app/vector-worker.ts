/// <reference lib="webworker" />

import {
  runSimulation,
  type SimulationOptions,
  type SimulationProgress,
} from "../lib/simulation";

type StartMessage = { type: "start"; options: SimulationOptions };
type CancelMessage = { type: "cancel" };
type IncomingMessage = StartMessage | CancelMessage;
type OutgoingMessage = {
  type: "progress" | "complete" | "error";
  payload: unknown;
};

const worker = self as DedicatedWorkerGlobalScope;
let cancelRequested = false;
let running = false;

worker.addEventListener("message", (event: MessageEvent<IncomingMessage>) => {
  try {
    const message = event.data;
    if (message.type === "cancel") {
      cancelRequested = true;
      return;
    }

    if (message.type !== "start" || running) {
      return;
    }

    running = true;
    cancelRequested = false;
    let lastProgressAt = -Infinity;
    const result = runSimulation(
      message.options,
      (progress) => {
        const now = Date.now();
        if (now - lastProgressAt >= 100) {
          post("progress", progress);
          lastProgressAt = now;
        }
      },
      () => cancelRequested,
    );
    post("complete", result);
  } catch (error) {
    post("error", { message: messageFor(error) });
  } finally {
    running = false;
  }
});

function post(type: OutgoingMessage["type"], payload: unknown): void {
  worker.postMessage({ type, payload } satisfies OutgoingMessage);
}

function messageFor(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected simulation error";
}

export type { SimulationProgress };
