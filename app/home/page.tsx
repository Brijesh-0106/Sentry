"use client";
import { useRef, useState } from "react";
import {
  aiReviewInterface,
  bugInterface,
  fileReviewInterface,
  metaDataInterface,
} from "../utils/metaDataInterface";

export default function Home() {
  const [metaData, setMetaData] = useState<metaDataInterface | null>(null);
  const [showError, setShowError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(false);
  const [aiReview, setAiReview] = useState<aiReviewInterface | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidPR = () => {
    const url = inputRef?.current?.value.trim() || "";
    setIsEmpty(url === ""); // ← track empty
    if (url === "") {
      setShowError(false);
      return;
    }
    const regex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/pull\/\d+$/;
    regex.test(url) ? setShowError(false) : setShowError(true);
  };

  const fetchGithubData = async () => {
    setLoading(true);
    const url = inputRef?.current?.value.trim();
    if (!url) return;
    try {
      const apiUrl = url.replace("github.com", "api.github.com/repos");
      const finalApiUrl = apiUrl.replace("pull", "pulls");
      const resMetaData = await fetch(finalApiUrl);
      const metaData = await resMetaData.json();
      setMetaData(metaData);
      console.log(metaData);

      const resFileChanges = await fetch(finalApiUrl + "/files");
      const fileChanges = await resFileChanges.json();
      console.log(fileChanges);
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metaData, fileChanges }),
      });
      const data = await response.json();

      if (data.success) {
        console.log(data.result);
        setAiReview(JSON.parse(data.result)); // set this in state
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-section flex h-[calc(100vh-7vh)] flex-col px-4 items-center bg-black">
      <div className=" my-6">
        <h3 className="text-center text-2xl pb-2 text-[#cc7bf4]">
          Paste any GitHub PR link below
        </h3>
        <h4 className="text-[#faf9f5] text-center">
          Any public GitHub PR. Instant AI review
        </h4>
      </div>
      <div className="middleContainer px-4 py-4  rounded-2xl w-screen mx-4 bg-zinc-900">
        <div className="flex gap-2 justify-center">
          <div className="flex flex-col">
            <input
              ref={inputRef}
              onChange={() => isValidPR()}
              type="url"
              placeholder="ex. https://github.com/openmrs/openmrs-esm-patient-management/pull/2367"
              className={`max-h-[47.5px] ${!showError ? "border border-zinc-500" : "border-2 border-red-500"} focus:outline-none  text-gray-800 placeholder-gray-300::placeholder focus:text-black w-3xl focus:bg-white text-lg px-4 py-2  bg-[#faf9f5] rounded-lg`}
            />
            {showError && (
              <small className="text-red-500 text-right mt-1">
                <>Please enter a valid GitHub PR URL</>
              </small>
            )}
          </div>
          <button
            disabled={showError || isEmpty}
            onClick={() => fetchGithubData()}
            className={`bg-[#faf9f5] max-h-[47.5px] disabled:bg-gray-200  disabled:hover:text-black  text-black px-5 gap-1 py-2 text-lg cursor-pointer rounded-lg hover:bg-[#cc7bf4] hover:text-[#fff] transition-colors`}
          >
            Review
          </button>
        </div>
        {metaData && (
          <div className="devider">
            <hr className="border-zinc-700 my-6" />
          </div>
        )}
        {metaData && (
          <div className="flex gap-4 justify-center">
            <div className="rightPanel border-white border text-lg px-4 py-3 w-6/10">
              <div className="text-white mt-4">
                <div className="PRcreater flex gap-3">
                  <div>
                    <img
                      alt="UserImage"
                      className="rounded-full"
                      src={metaData?.user.avatar_url}
                      width={44}
                      height={44}
                    />
                  </div>
                  <div className="border-l-4 border-purple-500 w-full bg-zinc-800 px-4 py-2 rounded-r-md flex justify-between  items-center">
                    <span className="font-semibold text-white">
                      by @{metaData?.user.login}
                    </span>
                    <span className="secondary text-zinc-500">
                      {metaData.changed_files} files changes
                    </span>
                  </div>
                </div>
                <div className="my-6">
                  <span className="font-semibold text-lg flex gap-3 items-center">
                    {" "}
                    <span>{metaData.title}</span>{" "}
                    <span className="flex gap-1 items-center text-xl">
                      {metaData.merged ? (
                        <span className="text-purple-700">Merged</span>
                      ) : metaData.state == "open" ? (
                        <span className="text-[#008000]">
                          {metaData.state.charAt(0).toUpperCase() +
                            metaData.state.slice(1)}
                        </span>
                      ) : (
                        <span className="text-red-500">
                          {" "}
                          {metaData.state.charAt(0).toUpperCase() +
                            metaData.state.slice(1)}
                        </span>
                      )}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill={`${metaData.merged ? "purple" : metaData.state == "open" ? "#008000" : "red"}`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5c0-1.65-1.35-3-3-3S2 3.35 2 5c0 1.3.84 2.4 2 2.82v8.37c-1.16.41-2 1.51-2 2.82 0 1.65 1.35 3 3 3s3-1.35 3-3c0-1.3-.84-2.4-2-2.82V7.82C7.16 7.41 8 6.31 8 5M5 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m0 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1M20 16.18V6.5A2.5 2.5 0 0 0 17.5 4H14V2l-4 3 4 3V6h3.5c.28 0 .5.22.5.5v9.68c-1.16.41-2 1.51-2 2.82 0 1.65 1.35 3 3 3s3-1.35 3-3c0-1.3-.84-2.4-2-2.82M19 20c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1" />
                      </svg>
                    </span>
                  </span>
                  <div className="devider my-2">
                    <hr className="border-zinc-700" />
                  </div>
                  {aiReview && (
                    <>
                      {" "}
                      <span className="body text-[#aba7b6]">
                        {aiReview?.summary ||
                          metaData.body ||
                          "No description provided"}
                      </span>
                      <div className="mt-4">Review</div>
                      <div className="devider my-2">
                        <hr className="border-zinc-700" />
                      </div>
                      <div className="text-white mb-4">
                        <div className="h-2 bg-zinc-800 rounded-full">
                          <div
                            className="h-2 bg-green-500 rounded-full transition-all duration-1000"
                            style={{ width: `${aiReview?.score}%` }}
                          />
                        </div>
                        {/* Score - {aiReview?.score} */}
                      </div>
                      <div className="border-l-4 border-red-500 bg-zinc-900 rounded-r-lg p-4">
                        {aiReview.bugs.length > 0 && (
                          <>
                            <span>🐛 Bugs found - {aiReview.bugs.length}</span>
                            <div className="text-[#aba7b6]">
                              {aiReview.bugs.map((bug: bugInterface, ind) => {
                                return (
                                  <>
                                    <h3>{bug.title}</h3>
                                    <p>{bug.description}</p>
                                  </>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="border-l-4 border-yellow-500 mt-4 bg-zinc-900 rounded-r-lg p-4">
                        {aiReview.suggestions.length > 0 && (
                          <>
                            <span>
                              💡Suggestions - {aiReview.suggestions.length}
                            </span>
                            <div className="text-[#aba7b6]">
                              {aiReview.suggestions.map(
                                (bug: bugInterface, ind) => {
                                  return (
                                    <>
                                      <h3>{bug.title}</h3>
                                      <p>{bug.description}</p>
                                    </>
                                  );
                                },
                              )}
                            </div>
                          </>
                        )}
                      </div>{" "}
                      <div className="border-l-4 border-green-500 mt-4 bg-zinc-900 rounded-r-lg p-4">
                        {aiReview.positives.length > 0 && (
                          <>
                            <span>✅ Positives</span>
                            <div className="text-[#aba7b6]">
                              {aiReview.positives.map(
                                (bug: bugInterface, ind) => {
                                  return (
                                    <>
                                      <h3>{bug.title}</h3>
                                      <p>{bug.description}</p>
                                    </>
                                  );
                                },
                              )}
                            </div>
                          </>
                        )}
                      </div>{" "}
                      <div className="mt-4">
                        {aiReview.fileReviews.length > 0 && (
                          <>
                            <span>📂 File Reviews</span>
                            <div className="text-[#aba7b6]">
                              {aiReview.fileReviews.map(
                                (fileReview: fileReviewInterface, ind) => {
                                  return (
                                    <>
                                      <h3>{fileReview.file}</h3>
                                      <p>{fileReview.comment}</p>
                                      <p>
                                        <span
                                          className={`bg-yellow-500/20 text-${fileReview.risk === "High" ? "red" : fileReview.risk === "Medium" ? "yellow" : "green"}-400 text-xs px-2 py-1 rounded-full`}
                                        >
                                          {fileReview.risk}
                                        </span>
                                      </p>
                                    </>
                                  );
                                },
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
