import { AnimatePresence, motion } from "framer-motion";
import Button from "./ui/Button.jsx";

function ConfirmDialog({ open, title, description, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-slate-300">{description}</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={onCancel}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={onConfirm}>
                Confirmar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmDialog;
