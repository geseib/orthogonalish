import { describe, expect, it } from "vitest";

import {
  attachVectorWorker,
  type WorkerIncomingMessage,
  type WorkerOutgoingMessage,
} from "./vector-worker";

const options = {
  dimension: 8,
  lowerAngle: 0,
  upperAngle: 180,
  seed: 42,
  maxVectors: 3,
  maxAttempts: 1_000,
  maxMilliseconds: 60_000,
};

type MessageListener = (event: MessageEvent<WorkerIncomingMessage>) => void;

function createHarness() {
  const messages: Array<{ at: number; message: WorkerOutgoingMessage }> = [];
  const scheduled: Array<() => void> = [];
  let listener: MessageListener | undefined;
  let clock = 0;

  attachVectorWorker(
    {
      addEventListener: (_type, nextListener) => {
        listener = nextListener;
      },
      postMessage: (message) => messages.push({ at: clock, message }),
    },
    {
      now: () => clock,
      schedule: (callback) => scheduled.push(callback),
      workUnitsPerChunk: 1,
    },
  );

  return {
    messages,
    send(message: WorkerIncomingMessage) {
      listener?.({ data: message } as MessageEvent<WorkerIncomingMessage>);
    },
    runNext(milliseconds = 0) {
      clock += milliseconds;
      const callback = scheduled.shift();
      expect(callback).toBeTypeOf("function");
      callback?.();
    },
    runAll(millisecondsPerChunk = 0) {
      while (scheduled.length > 0) {
        this.runNext(millisecondsPerChunk);
      }
    },
  };
}

describe("vector worker", () => {
  it("posts progress no more often than every 100 milliseconds and completes", () => {
    const harness = createHarness();
    harness.send({ type: "start", options });
    harness.runAll(25);

    const progress = harness.messages.filter(({ message }) => message.type === "progress");
    expect(progress.length).toBeGreaterThan(0);
    for (let index = 1; index < progress.length; index += 1) {
      expect(progress[index].at - progress[index - 1].at).toBeGreaterThanOrEqual(100);
    }
    expect(harness.messages.at(-1)?.message).toMatchObject({
      type: "complete",
      payload: { stopReason: "vector-cap", vectorsFound: 3 },
    });
  });

  it("yields so a long run can receive cancellation", () => {
    const harness = createHarness();
    harness.send({
      type: "start",
      options: {
        ...options,
        dimension: 10_000,
        lowerAngle: 89.999,
        upperAngle: 90.001,
        maxVectors: 500,
        maxAttempts: 100_000,
      },
    });
    harness.runNext();
    harness.send({ type: "cancel" });
    harness.runAll();

    expect(harness.messages.at(-1)?.message).toMatchObject({
      type: "complete",
      payload: { stopReason: "cancelled" },
    });
  });

  it("normalizes simulation exceptions into error messages", () => {
    const harness = createHarness();
    harness.send({ type: "start", options: { ...options, dimension: 0 } });

    expect(harness.messages).toEqual([
      {
        at: 0,
        message: {
          type: "error",
          payload: { message: "Dimension must be a positive integer." },
        },
      },
    ]);
  });
});
