import { describe, expect, it } from "vitest";

import {
  attachVectorWorker,
  type WorkerIncomingMessage,
  type WorkerOutgoingMessage,
} from "./vector-worker";
import { createSimulationRunner } from "../lib/simulation";

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
  it("suppresses accepted-vector progress emitted within 100 milliseconds", () => {
    const harness = createHarness();
    harness.send({ type: "start", options: { ...options, maxVectors: 5 } });
    harness.runAll();

    const progress = harness.messages.filter(({ message }) => message.type === "progress");
    expect(progress).toHaveLength(1);
    expect(progress[0].message).toMatchObject({
      type: "progress",
      payload: { vectorsFound: 1 },
    });
    expect(harness.messages.at(-1)?.message).toMatchObject({
      type: "complete",
      payload: { stopReason: "vector-cap", vectorsFound: 5 },
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

  it("normalizes scheduled chunk errors and accepts a subsequent start", () => {
    const messages: WorkerOutgoingMessage[] = [];
    const scheduled: Array<() => void> = [];
    let listener: MessageListener | undefined;
    let runnerCount = 0;

    attachVectorWorker(
      {
        addEventListener: (_type, nextListener) => {
          listener = nextListener;
        },
        postMessage: (message) => messages.push(message),
      },
      {
        schedule: (callback) => scheduled.push(callback),
        createRunner: (...arguments_) => {
          runnerCount += 1;
          if (runnerCount === 1) {
            return {
              runChunk: () => {
                throw "chunk exploded";
              },
            };
          }
          return createSimulationRunner(...arguments_);
        },
      },
    );

    listener?.({ data: { type: "start", options } } as MessageEvent<WorkerIncomingMessage>);
    scheduled.shift()?.();
    listener?.({
      data: { type: "start", options: { ...options, maxVectors: 1 } },
    } as MessageEvent<WorkerIncomingMessage>);
    while (scheduled.length > 0) {
      scheduled.shift()?.();
    }

    expect(messages[0]).toEqual({
      type: "error",
      payload: { message: "Unexpected simulation error" },
    });
    expect(messages.at(-1)).toMatchObject({
      type: "complete",
      payload: { stopReason: "vector-cap", vectorsFound: 1 },
    });
    expect(runnerCount).toBe(2);
  });
});
