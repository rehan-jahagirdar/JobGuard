// client/src/components/BlurText.jsx
import { motion } from 'framer-motion';

export default function BlurText({ text, className = '', delay = 0 }) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(12px)', y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}