import { describe, it, expect } from "vitest";
import type { metaDataInterface } from "../metaDataInterface";

describe("metaDataInterface", () => {
  it("accepts a fully populated valid object", () => {
    const data: metaDataInterface = {
      number: 42,
      title: "Fix critical bug in auth flow",
      user: {
        login: "octocat",
        avatar_url: "https://avatars.githubusercontent.com/u/583231",
      },
      changed_files: 7,
    };

    expect(data.number).toBe(42);
    expect(data.title).toBe("Fix critical bug in auth flow");
    expect(data.user.login).toBe("octocat");
    expect(data.user.avatar_url).toBe(
      "https://avatars.githubusercontent.com/u/583231"
    );
    expect(data.changed_files).toBe(7);
  });

  it("accepts zero as a valid value for number and changed_files", () => {
    const data: metaDataInterface = {
      number: 0,
      title: "",
      user: {
        login: "",
        avatar_url: "",
      },
      changed_files: 0,
    };

    expect(data.number).toBe(0);
    expect(data.changed_files).toBe(0);
  });

  it("matches the initial default state used in the Home component", () => {
    const defaultState: metaDataInterface = {
      number: 0,
      title: "",
      user: {
        login: "",
        avatar_url: "",
      },
      changed_files: 0,
    };

    expect(defaultState.number).toBe(0);
    expect(defaultState.title).toBe("");
    expect(defaultState.user.login).toBe("");
    expect(defaultState.user.avatar_url).toBe("");
    expect(defaultState.changed_files).toBe(0);
  });

  it("stores large PR numbers correctly", () => {
    const data: metaDataInterface = {
      number: 999999,
      title: "Massive refactor",
      user: {
        login: "dev-user",
        avatar_url: "https://example.com/avatar.png",
      },
      changed_files: 500,
    };

    expect(data.number).toBe(999999);
    expect(data.changed_files).toBe(500);
  });

  it("preserves special characters in title and login", () => {
    const data: metaDataInterface = {
      number: 1,
      title: "feat: add support for <br> tags & entities",
      user: {
        login: "user-with-dashes_and_underscores",
        avatar_url: "https://example.com/a?s=100&v=4",
      },
      changed_files: 1,
    };

    expect(data.title).toBe("feat: add support for <br> tags & entities");
    expect(data.user.login).toBe("user-with-dashes_and_underscores");
    expect(data.user.avatar_url).toBe("https://example.com/a?s=100&v=4");
  });

  it("correctly stores all user sub-object fields independently", () => {
    const user = {
      login: "test-login",
      avatar_url: "https://avatars.example.com/1",
    };
    const data: metaDataInterface = {
      number: 10,
      title: "Test PR",
      user,
      changed_files: 3,
    };

    expect(data.user).toEqual({
      login: "test-login",
      avatar_url: "https://avatars.example.com/1",
    });
  });

  it("number field is a numeric type (not a string)", () => {
    const data: metaDataInterface = {
      number: 123,
      title: "PR title",
      user: { login: "user", avatar_url: "" },
      changed_files: 2,
    };

    expect(typeof data.number).toBe("number");
    expect(typeof data.changed_files).toBe("number");
  });

  it("title and login are string types", () => {
    const data: metaDataInterface = {
      number: 5,
      title: "Some title",
      user: { login: "some-user", avatar_url: "https://example.com/img.png" },
      changed_files: 1,
    };

    expect(typeof data.title).toBe("string");
    expect(typeof data.user.login).toBe("string");
    expect(typeof data.user.avatar_url).toBe("string");
  });
});