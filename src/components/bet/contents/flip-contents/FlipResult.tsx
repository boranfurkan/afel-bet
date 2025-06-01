import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useFlipMachine } from '@/contexts/FlipContext';
import FlipContentButton from './FlipContentButton';

const FlipResult = () => {
  const { flipResult, resetGame, selectedSide } = useFlipMachine();

  if (!flipResult) return null;

  const isWin = flipResult.isWin;
  const winAmount = flipResult.winAmount;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const resultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="w-full flex flex-col items-center justify-center gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Result Container */}
      <motion.div
        className="w-full bg-black/30 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center gap-4"
        variants={resultVariants}
      >
        {/* Result Header */}
        <div className="flex items-center gap-3">
          <motion.div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isWin ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
            animate={{
              boxShadow: isWin
                ? [
                    '0 0 0px rgba(34, 197, 94, 0.2)',
                    '0 0 20px rgba(34, 197, 94, 0.4)',
                    '0 0 0px rgba(34, 197, 94, 0.2)',
                  ]
                : [
                    '0 0 0px rgba(239, 68, 68, 0.2)',
                    '0 0 20px rgba(239, 68, 68, 0.4)',
                    '0 0 0px rgba(239, 68, 68, 0.2)',
                  ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Image
              src={`/images/bet/flip/${flipResult.result.toLowerCase()}-icon.png`}
              alt={flipResult.result}
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </motion.div>
          <div className="flex flex-col">
            <motion.h2
              className={`text-2xl font-bold ${
                isWin ? 'text-green-400' : 'text-red-400'
              }`}
              animate={{
                textShadow: isWin
                  ? [
                      '0 0 0px rgba(34, 197, 94, 0.5)',
                      '0 0 10px rgba(34, 197, 94, 0.8)',
                      '0 0 0px rgba(34, 197, 94, 0.5)',
                    ]
                  : [
                      '0 0 0px rgba(239, 68, 68, 0.5)',
                      '0 0 10px rgba(239, 68, 68, 0.8)',
                      '0 0 0px rgba(239, 68, 68, 0.5)',
                    ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {isWin ? 'YOU WON!' : 'YOU LOST!'}
            </motion.h2>
            <div className="text-sm text-gray-400">
              Result: {flipResult.result} - You chose {selectedSide}
            </div>
          </div>
        </div>

        {/* Win Amount (only show if win) */}
        {isWin && (
          <motion.div
            className="bg-green-500/20 w-full rounded-lg p-3 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-gray-400 text-sm">PRIZE</div>
            <motion.div
              className="text-3xl font-bold text-green-400"
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  '0 0 0px rgba(34, 197, 94, 0.5)',
                  '0 0 10px rgba(34, 197, 94, 0.8)',
                  '0 0 0px rgba(34, 197, 94, 0.5)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              +{winAmount.toFixed(2)} SOL
            </motion.div>
          </motion.div>
        )}

        {/* Particles for wins */}
        {isWin && (
          <>
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][
                    i % 4
                  ],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -60, 0],
                  x: [(Math.random() - 0.5) * 40],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random(),
                  ease: 'easeInOut',
                }}
              />
            ))}
          </>
        )}

        {/* Play again button */}
        <motion.div
          className="w-full mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FlipContentButton
            onClick={resetGame}
            className="w-full py-3 text-lg font-bold"
          >
            PLAY AGAIN
          </FlipContentButton>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FlipResult;
