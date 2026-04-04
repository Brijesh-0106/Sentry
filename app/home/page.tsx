"use client";
import { useRef, useState } from "react";

export default function Home() {
  const [showError, setShowError] = useState(false); // ← only add this
  const [isEmpty, setIsEmpty] = useState(true); // ← add this
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
    const url = inputRef?.current?.value.trim();
    if (!url) return;
    const apiUrl = url.replace("github.com", "api.github.com/repos");
    const finalApiUrl = apiUrl.replace("pull", "pulls");
    const resMetaData = await fetch(finalApiUrl);
    const metaData = await resMetaData.json();
    console.log(metaData);

    const resFileChanges = await fetch(finalApiUrl + "/files");
    const fileChanges = await resFileChanges.json();
    console.log(fileChanges);
  };

  return (
    <div className="hero-section flex h-[calc(100vh-7vh)] flex-col items-center bg-black">
      <div className=" my-6">
        <h3 className="text-center text-2xl pb-2 text-[#cc7bf4]">
          Paste any GitHub PR link below
        </h3>
        <h4 className="text-[#faf9f5] text-center">
          Any public GitHub PR. Instant AI review
        </h4>
      </div>
      <div className="middleContainer px-4 py-4  rounded-2xl w-2/3 bg-zinc-900">
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
        <div className="devider">
          <hr className="border-zinc-700 my-6" />
        </div>
        <div className="flex">
          <div className="leftPanel text-white w-3/10">
            <h1> Files Changedb</h1>
           </div>
          <div className="rightPanel text-white w-7/10">
            <h1>Review</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
