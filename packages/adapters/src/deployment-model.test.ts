import { describe, expect, it } from "vitest";
import { resolveDeploymentModel } from "./deployment-model.js";

describe("resolveDeploymentModel", () => {
  it("pairs the deployment model key with the provider it belongs to", () => {
    const both = { OPENROUTER_API_KEY: "or-key", ANTHROPIC_API_KEY: "sk-ant-key" };
    expect(resolveDeploymentModel(both)).toEqual({
      provider: "openrouter",
      model: "deepseek/deepseek-v4-flash-0731",
      key: "or-key",
    });
    // The whole point: switching the provider switches the key with it.
    expect(resolveDeploymentModel({ ...both, PI_DEFAULT_PROVIDER: "anthropic" })).toEqual({
      provider: "anthropic",
      model: "claude-sonnet-5",
      key: "sk-ant-key",
    });
    // A provider with no key configured yields no key — never another vendor's.
    expect(
      resolveDeploymentModel({ OPENROUTER_API_KEY: "or-key", PI_DEFAULT_PROVIDER: "anthropic" }),
    ).toEqual({ provider: "anthropic", model: "claude-sonnet-5", key: undefined });
  });

  it("supports Local as a deployment default with MiniMax-M3", () => {
    expect(
      resolveDeploymentModel({
        PI_DEFAULT_PROVIDER: "local",
        PI_DEFAULT_MODEL: "MiniMax-M3",
        RAKAZO_LOCAL_MODELS: "MiniMax-M3",
        RAKAZO_LOCAL_MODELS_API_KEY: "sk-local-test",
      }),
    ).toEqual({
      provider: "local",
      model: "MiniMax-M3",
      key: "sk-local-test",
    });
    // Falls back to MINIMAX_API_KEY and the built-in local model id.
    expect(
      resolveDeploymentModel({
        PI_DEFAULT_PROVIDER: "local",
        RAKAZO_LOCAL_MODELS: "MiniMax-M3",
        MINIMAX_API_KEY: "sk-mm-fallback",
      }),
    ).toEqual({
      provider: "local",
      model: "MiniMax-M3",
      key: "sk-mm-fallback",
    });
  });
});
