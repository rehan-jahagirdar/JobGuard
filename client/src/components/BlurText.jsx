import { motion } from 'framer-motion';

export default function BlurText({ text, className = '', delay = 0, el: El = 'span' }) {
  const words = text.split(' ');
  return (
    <El className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(16px)', y: 14 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.58,
            delay: delay + i * 0.09,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block', marginRight: '0.27em' }}
        >
          {word}
        </motion.span>
      ))}
    </El>
  );
}