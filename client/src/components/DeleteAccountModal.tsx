//cliant/components/DeleteAccountModal.tsx

interface Props {
  onCancel: () => void;
  onDelete: () => void;
}

export default function DeleteAccountModal({ onCancel, onDelete }: Props) {
  return (
    <div className="fixed inset-0 bg-bgTransparentDark flex items-center justify-center z-[200]">
      <div className="bg-white w-[400px] rounded-base shadow-lg p-8 text-center">
        <p className="mb-6 text-lg font-bold">
          Do you really want to delete this Account?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-base bg-noBtn text-white"
          >
            No
          </button>

          <button
            onClick={onDelete}
            className="px-6 py-2 rounded-base bg-deleteBtn text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
