import { Modal } from "antd";
import { FiTrash2 } from "react-icons/fi";

interface DeleteConfirmationModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

export default function DeleteConfirmationModal({
  open,
  onCancel,
  onConfirm,
  title = "Delete Item",
  description = "This action cannot be undone.",
  loading = false,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
      closable={false}
    >
      <div className="py-4 text-center">
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <FiTrash2 className="text-red-600" size={28} />
        </div>
        <h3 className="text-xl font-bold dark:text-white">{title}</h3>
        <p className="text-slate-500 dark:text-zinc-400 mt-2 px-4">
          {description}
        </p>
        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-11 rounded-xl font-semibold border dark:text-white dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 h-11 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
