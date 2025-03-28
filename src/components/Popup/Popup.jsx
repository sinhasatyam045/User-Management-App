import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Popup = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // ✅ Animations
  const popupVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed bottom-10 right-10 z-50 flex items-center p-4 rounded-md shadow-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={popupVariants}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          {type === 'success' ? (
            <FiCheckCircle className="text-2xl mr-2" />
          ) : (
            <FiXCircle className="text-2xl mr-2" />
          )}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
