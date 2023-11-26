import { Variants } from "framer-motion";

export const RoundComponentVariants: Variants = {
  initial: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export const TextVariants: Variants = {
  initial: {
    opacity: 0,
    y: 5,
    transition: { duration: 0.5 },
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.2 },
  },
  exit: {
    opacity: 0,
    y: 5,
    transition: { duration: 0.5 },
  },
};
