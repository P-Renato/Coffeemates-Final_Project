import React, { useState } from "react";
import CoffeeQuestionRow from "../../components/CoffeeQuestionRow";
import CoffeeQuestionPicker from "../../components/CoffeeQuestionPicker";
import DeleteAccountModal from "../../components/DeleteAccountModal";

export default function SettingPage() {
  const [coverPhoto, setCoverPhoto] = useState<string | null>(
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
  );
  const [profilePhoto, setProfilePhoto] = useState<string | null>(
    "https://example.com/avatar.jpg"
  );

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPhoto(URL.createObjectURL(file));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhoto(URL.createObjectURL(file));
  };

  const [id, setId] = useState("@mariecoffeelove");
  const [name, setName] = useState("Marie");
  const [place, setPlace] = useState("Berlin, Germany");

  const labels = ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"];
  const [selectedQuestions, setSelectedQuestions] = useState<(string | null)[]>([null, null, null, null, null]);
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [showPicker, setShowPicker] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openPicker = (i: number) => {
    setActiveIndex(i);
    setShowPicker(true);
  };

  const selectQuestion = (q: string) => {
    if (activeIndex === null) return;
    const list = [...selectedQuestions];
    list[activeIndex] = q;
    setSelectedQuestions(list);
    setShowPicker(false);
  };

  const isEnabled = (i: number) => (i === 0 ? true : selectedQuestions[i - 1] !== null);

  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="flex font-profile text-profile bg-bg1 min-h-screen">
      <main className="flex-1 p-10 relative">

        {/* Save Button */}
        <button
          className="fixed right-10 top-[340px] bg-saveBtn text-white px-7 py-2 rounded-base hover:opacity-80 z-50"
        >
          Save
        </button>

        {/* Cover & Profile Photo */}
        <div className="relative w-full h-[280px] mb-20">
          <img
            src={coverPhoto ?? ""}
            className="w-full h-full object-cover rounded-base cursor-pointer"
            onClick={() => document.getElementById("coverInput")?.click()}
          />
          <input
            id="coverInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />

          <div className="absolute left-14 -bottom-20 w-[160px] h-[160px] z-50">
            <img
              src={profilePhoto ?? ""}
              className="w-[160px] h-[160px] rounded-full object-cover border-4 border-white shadow-lg cursor-pointer"
              onClick={() => document.getElementById("profileInput")?.click()}
            />
            <input
              id="profileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileChange}
            />
          </div>
        </div>

        {/* Basic Fields */}
        <div className="mt-24 mb-6">
          <label className="font-bold block mb-2">ID:</label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full bg-bg2 border border-greyline rounded-base px-4 py-3"
          />
        </div>

        <div className="mb-6">
          <label className="font-bold block mb-2">Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-bg2 border border-greyline rounded-base px-4 py-3"
          />
        </div>

        <div className="mb-10">
          <label className="font-bold block mb-2">Place:</label>
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="w-full bg-bg2 border border-greyline rounded-base px-4 py-3"
          />
        </div>

        {/* Coffee Profile */}
        <h2 className="text-2xl font-bold mb-3">
          Coffee profile
          <span className="ml-2 text-sm text-gray-600">
            Tell us up to five things you love about coffee.
          </span>
        </h2>

        {labels.map((lbl, i) => (
          <CoffeeQuestionRow
            key={i}
            label={selectedQuestions[i] ?? lbl}
            value={selectedQuestions[i] ?? ""}
            answer={answers[i]}
            disabled={!isEnabled(i)}
            onSelectClick={() => openPicker(i)}
            onAnswerChange={(v) => {
              const arr = [...answers];
              arr[i] = v.slice(0, 50);
              setAnswers(arr);
            }}
          />
        ))}

        {/* Delete Button */}
        <div className="mt-16 mb-24 flex justify-end">
          <button
            onClick={() => setShowDelete(true)}
            className="bg-deleteBtn text-white px-6 py-3 rounded-base hover:opacity-80 z-50"
          >
            Delete your account
          </button>
        </div>
      </main>

      {/* Modals */}
      {showPicker && (
        <CoffeeQuestionPicker
          onSelect={selectQuestion}
          onClose={() => setShowPicker(false)}
        />
      )}
      {showDelete && (
        <DeleteAccountModal
          onCancel={() => setShowDelete(false)}
          onDelete={() => alert("Account deleted (frontend only)")}
        />
      )}
    </div>
  );
}
