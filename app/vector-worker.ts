/// <reference lib="webworker" />

import {
  createSimulationRunner,
  type SimulationOptions,
} from "../lib/simulation";

export type WorkerIncomingMessage =
  | { type: "start"; options: SimulationOptions }
  | { type: "cancel" };

export type WorkerOutgoingMessage = {
  type: "progress" | "complete" | "error";
  payload: unknown;
};

type WorkerScope = {
  addEventListener(
    type: "message",
    listener: (event: MessageEvent<WorkerIncomingMessage>) => void,
  ): void;
  postMessage(message: WorkerOutgoingMessage): void;
};

type WorkerRuntimeOptions = {
  now?: () => number;
  schedule?: (callback: () => void) => void;
  workUnitsPerChunk?: number;
  createRunner?: typeof createSimulationRunner;
};

const DEFAULT_WORK_UNITS_PER_CHUNK = 2_048;

/** Attaches the protocol to a worker-like scope; injectable scheduling keeps it testable. */
export function attachVectorWorker(
  worker: WorkerScope,
  runtime: WorkerRuntimeOptions = {},
): void {
  const now = runtime.now ?? Date.now;
  const schedule = runtime.schedule ?? ((callback) => setTimeout(callback, 0));
  const workUnitsPerChunk = runtime.workUnitsPerChunk ?? DEFAULT_WORK_UNITS_PER_CHUNK;
  const createRunner = runtime.createRunner ?? createSimulationRunner;
  let cancelRequested = false;
  let running = false;

  worker.addEventListener("message", (event) => {
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

    try {
      const runner = createRunner(
        message.options,
        (progress) => {
          const progressAt = now();
          if (progressAt - lastProgressAt >= 100) {
            post(worker, "progress", progress);
            lastProgressAt = progressAt;
          }
        },
        () => cancelRequested,
      );

      const pump = () => {
        try {
          const result = runner.runChunk(workUnitsPerChunk);
          if (result === null) {
            schedule(pump);
          } else {
            post(worker, "complete", result);
            running = false;
          }
        } catch (error) {
          post(worker, "error", { message: messageFor(error) });
          running = false;
        }
      };

      schedule(pump);
    } catch (error) {
      post(worker, "error", { message: messageFor(error) });
      running = false;
    }
  });
}

function post(
  worker: WorkerScope,
  type: WorkerOutgoingMessage["type"],
  payload: unknown,
): void {
  worker.postMessage({ type, payload });
}

function messageFor(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected simulation error";
}

if (typeof self !== "undefined") {
  attachVectorWorker(self as unknown as WorkerScope);
}
