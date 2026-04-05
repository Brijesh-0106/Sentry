import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../page";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

const buildMockMetaData = (overrides = {}) => ({
  number: 101,
  title: "Add dark mode support",
  user: {
    login: "johndoe",
    avatar_url: "https://avatars.githubusercontent.com/u/1",
  },
  changed_files: 5,
  ...overrides,
});

const setupFetchMock = (metaData = buildMockMetaData()) => {
  mockFetch
    .mockResolvedValueOnce({
      json: async () => metaData,
    } as Response)
    .mockResolvedValueOnce({
      json: async () => [],
    } as Response);
};

describe("Home page - metaData state initialization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default metaData showing PR number 0", () => {
    render(<Home />);
    expect(screen.getByText(/PullRequest - #0/)).toBeInTheDocument();
  });

  it("renders with default empty title in metaData display area", () => {
    render(<Home />);
    // The title div is present but empty (title is "")
    const rightPanel = document.querySelector(".rightPanel");
    expect(rightPanel).toBeInTheDocument();
    // changed_files = 0, user.login = ""
    expect(screen.getByText(/= 0 files/)).toBeInTheDocument();
  });

  it("renders 'by @' with empty login in default state", () => {
    render(<Home />);
    expect(screen.getByText(/by @/)).toBeInTheDocument();
  });

  it("renders the 'Files Changes' heading", () => {
    render(<Home />);
    expect(screen.getByText(/Files Changes/i)).toBeInTheDocument();
  });

  it("renders the 'Review' heading in the right panel", () => {
    render(<Home />);
    // There's both an h1 "Review" and the button "Review" - find the heading
    const reviewHeadings = screen.getAllByText("Review");
    expect(reviewHeadings.length).toBeGreaterThanOrEqual(1);
    // The h1 inside rightPanel
    const rightPanel = document.querySelector(".rightPanel");
    expect(rightPanel?.querySelector("h1")?.textContent).toBe("Review");
  });
});

describe("Home page - metaData display after fetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays PR number from fetched metaData", async () => {
    const user = userEvent.setup();
    const meta = buildMockMetaData({ number: 2367 });
    setupFetchMock(meta);

    render(<Home />);

    const input = screen.getByRole("textbox");
    await user.type(
      input,
      "https://github.com/openmrs/openmrs-esm-patient-management/pull/2367"
    );

    const reviewBtn = screen.getByRole("button", { name: /review/i });
    await user.click(reviewBtn);

    await waitFor(() => {
      expect(screen.getByText(/PullRequest - #2367/)).toBeInTheDocument();
    });
  });

  it("displays PR title from fetched metaData", async () => {
    const user = userEvent.setup();
    const meta = buildMockMetaData({ title: "Add dark mode support" });
    setupFetchMock(meta);

    render(<Home />);

    const input = screen.getByRole("textbox");
    await user.type(
      input,
      "https://github.com/owner/repo/pull/1"
    );

    const reviewBtn = screen.getByRole("button", { name: /review/i });
    await user.click(reviewBtn);

    await waitFor(() => {
      expect(screen.getByText("Add dark mode support")).toBeInTheDocument();
    });
  });

  it("displays user login from fetched metaData", async () => {
    const user = userEvent.setup();
    const meta = buildMockMetaData({ user: { login: "johndoe", avatar_url: "" } });
    setupFetchMock(meta);

    render(<Home />);

    const input = screen.getByRole("textbox");
    await user.type(
      input,
      "https://github.com/owner/repo/pull/1"
    );

    const reviewBtn = screen.getByRole("button", { name: /review/i });
    await user.click(reviewBtn);

    await waitFor(() => {
      expect(screen.getByText(/by @johndoe/)).toBeInTheDocument();
    });
  });

  it("displays changed_files count from fetched metaData", async () => {
    const user = userEvent.setup();
    const meta = buildMockMetaData({ changed_files: 12 });
    setupFetchMock(meta);

    render(<Home />);

    const input = screen.getByRole("textbox");
    await user.type(
      input,
      "https://github.com/owner/repo/pull/1"
    );

    const reviewBtn = screen.getByRole("button", { name: /review/i });
    await user.click(reviewBtn);

    await waitFor(() => {
      expect(screen.getByText(/= 12 files/)).toBeInTheDocument();
    });
  });

  it("calls fetch with the correct API URL (github.com → api.github.com/repos, pull → pulls)", async () => {
    const user = userEvent.setup();
    setupFetchMock();

    render(<Home />);

    const input = screen.getByRole("textbox");
    await user.type(
      input,
      "https://github.com/openmrs/openmrs-esm-patient-management/pull/2367"
    );

    const reviewBtn = screen.getByRole("button", { name: /review/i });
    await user.click(reviewBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/openmrs/openmrs-esm-patient-management/pulls/2367"
      );
    });
  });

  it("calls the /files endpoint in addition to the main PR metadata endpoint", async () => {
    const user = userEvent.setup();
    setupFetchMock();

    render(<Home />);

    const input = screen.getByRole("textbox");
    await user.type(input, "https://github.com/owner/repo/pull/1");

    const reviewBtn = screen.getByRole("button", { name: /review/i });
    await user.click(reviewBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/owner/repo/pulls/1/files"
      );
    });
  });

  it("updates metaData display completely after a successful fetch", async () => {
    const user = userEvent.setup();
    const meta = buildMockMetaData({
      number: 99,
      title: "Comprehensive fix",
      user: { login: "contributor", avatar_url: "" },
      changed_files: 3,
    });
    setupFetchMock(meta);

    render(<Home />);

    // Before fetch: default state
    expect(screen.getByText(/PullRequest - #0/)).toBeInTheDocument();

    const input = screen.getByRole("textbox");
    await user.type(input, "https://github.com/owner/repo/pull/99");

    const reviewBtn = screen.getByRole("button", { name: /review/i });
    await user.click(reviewBtn);

    await waitFor(() => {
      expect(screen.getByText(/PullRequest - #99/)).toBeInTheDocument();
      expect(screen.getByText("Comprehensive fix")).toBeInTheDocument();
      expect(screen.getByText(/by @contributor/)).toBeInTheDocument();
      expect(screen.getByText(/= 3 files/)).toBeInTheDocument();
    });
  });
});

describe("Home page - fetchGithubData edge cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not call fetch when input is empty", async () => {
    const user = userEvent.setup();
    render(<Home />);

    // Button is disabled when input is empty, but let's verify fetch is not called
    // Button should be disabled with isEmpty=true
    const reviewBtn = screen.getByRole("button", { name: /review/i });
    expect(reviewBtn).toBeDisabled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("disables the Review button when input is empty on initial render", () => {
    render(<Home />);
    const reviewBtn = screen.getByRole("button", { name: /review/i });
    expect(reviewBtn).toBeDisabled();
  });

  it("disables the Review button when an invalid URL is entered", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByRole("textbox");
    await user.type(input, "https://example.com/not-a-pr");

    const reviewBtn = screen.getByRole("button", { name: /review/i });
    expect(reviewBtn).toBeDisabled();
  });

  it("enables the Review button when a valid GitHub PR URL is entered", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByRole("textbox");
    await user.type(input, "https://github.com/owner/repo/pull/1");

    const reviewBtn = screen.getByRole("button", { name: /review/i });
    expect(reviewBtn).not.toBeDisabled();
  });

  it("resets metaData display correctly when PR number is 0 (boundary)", () => {
    render(<Home />);
    // Default state has number=0 — should render without crashing
    expect(screen.getByText(/PullRequest - #0/)).toBeInTheDocument();
    expect(screen.getByText(/= 0 files/)).toBeInTheDocument();
  });
});