import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import React from 'react';

// New Loader Component
const FontLoader = () => (
  <motion.div 
    className="flex flex-col items-center justify-center py-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
    <motion.p 
      className="text-indigo-600 font-medium"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      Loading Font...
    </motion.p>
  </motion.div>
);

const FontTester = ({ onClose }) => {
  const [availableFonts, setAvailableFonts] = useState([]);
  const [fontSettings, setFontSettings] = useState({
    family: '',
    size: 36,
    weight: 400,
    italic: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("This is the Font Tester. First upload your font. Then you can apply changes. Developed by @Samy3ND");
  
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);
  const injectedStylesRef = useRef([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 150
      }
    }
  };

  const buttonHover = {
    scale: 1.05,
    boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  };

  const buttonTap = {
    scale: 0.95,
    boxShadow: "0 5px 15px -5px rgba(99, 102, 241, 0.3)"
  };

  // Clean up injected styles
  useEffect(() => {
    return () => {
      injectedStylesRef.current.forEach(styleElement => {
        document.head.removeChild(styleElement);
      });
    };
  }, []);

  // Focus the preview area
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.style.direction = 'ltr';
      previewRef.current.style.unicodeBidi = 'plaintext';
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(previewRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [content, fontSettings.family]);

  const handleInput = (e) => {
    const newText = e.currentTarget.textContent || '';
    setContent(newText);
  };

  const handleFontUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const fontDataUrl = e.target.result;
      const fontName = file.name.split('.').slice(0, -1).join('.');
      const uniqueFontFamily = `user-font-${fontName}-${Date.now()}`;

      const newFontFace = `
        @font-face {
          font-family: '${uniqueFontFamily}';
          src: url(${fontDataUrl});
        }
      `;

      const styleElement = document.createElement('style');
      styleElement.textContent = newFontFace;
      document.head.appendChild(styleElement);
      
      injectedStylesRef.current.push(styleElement);

      const newUserFont = { 
        name: fontName, 
        family: uniqueFontFamily,
        type: 'uploaded'
      };
      
      setTimeout(() => {
        setAvailableFonts(prevFonts => [...prevFonts, newUserFont]);
        setFontSettings(prev => ({ 
          ...prev, 
          family: uniqueFontFamily 
        }));
        setIsLoading(false);
      }, 800); // Simulate processing delay for better UX
    };

    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl h-[85vh] flex flex-col border-2 border-white/20"
          initial={{ y: 50, scale: 0.95, opacity: 0 }}
          animate={{ 
            y: 0, 
            scale: 1, 
            opacity: 1,
            boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)"
          }}
          exit={{ y: 50, scale: 0.95, opacity: 0 }}
          transition={{ 
            type: 'spring', 
            damping: 25, 
            stiffness: 120,
            boxShadow: { duration: 0.5 }
          }}
        >
          {/* Header */}
          <motion.div 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 border-b flex justify-center items-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ delay: 0.1 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-white"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              Font Tester
            </motion.h2>
            
          </motion.div>

          {/* Preview Area */}
          <motion.div
            ref={previewRef}
            contentEditable
            className="flex-1 p-8 outline-none overflow-auto text-gray-900 bg-gradient-to-br from-gray-50 to-white focus:bg-white transition-all duration-300"
            onInput={handleInput}
            style={{
              fontFamily: fontSettings.family,
              fontSize: `${fontSettings.size}px`,
              fontWeight: fontSettings.weight,
              fontStyle: fontSettings.italic ? 'italic' : 'normal',
              lineHeight: '1.5',
              direction: 'ltr',
              unicodeBidi: 'isolate'
            }}
            suppressContentEditableWarning
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isLoading ? <FontLoader /> : content}
          </motion.div>

          {/* Controls Panel */}
          <motion.div 
            className="border-t border-gray-200/50 p-6 bg-gradient-to-b from-white to-gray-50"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Font Upload Section */}
              <motion.div className="md:col-span-3" variants={itemVariants}>
                <motion.label 
                  className="block text-sm font-medium text-gray-700 mb-2"
                  whileHover={{ scale: 1.01 }}
                >
                  {availableFonts.length > 0 ? 'Upload Another Font' : 'Upload Font to Test'}
                </motion.label>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-lg"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    <motion.span
                      animate={{ rotate: isLoading ? 360 : 0 }}
                      transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </motion.span>
                    {availableFonts.length > 0 ? 'Add Font' : 'Upload Font'}
                  </motion.button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFontUpload}
                    className="hidden"
                    accept=".ttf,.otf,.woff,.woff2"
                  />
                  
                  {availableFonts.length > 0 && (
                    <motion.select
                      value={fontSettings.family}
                      onChange={(e) => setFontSettings(prev => ({ ...prev, family: e.target.value }))}
                      className="flex-grow px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white"
                      whileHover={{ scale: 1.01 }}
                      whileFocus={{ scale: 1.02, borderColor: "#6366F1" }}
                    >
                      <option value="">Select a font</option>
                      {availableFonts.map((font) => (
                        <option key={font.family} value={font.family}>{font.name}</option>
                      ))}
                    </motion.select>
                  )}
                </div>
                
                {availableFonts.length > 0 && (
                  <motion.p 
                    className="mt-3 text-xs text-indigo-600 font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Currently testing: <span className="font-bold">{availableFonts.find(f => f.family === fontSettings.family)?.name || 'None'}</span>
                  </motion.p>
                )}
              </motion.div>

              {/* Font Size Slider */}
              <motion.div variants={itemVariants}>
                <motion.label 
                  className="block text-sm font-medium text-gray-700 mb-2"
                  whileHover={{ scale: 1.01 }}
                >
                  Size: <span className="text-indigo-600 font-bold">{fontSettings.size}px</span>
                </motion.label>
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="range"
                    min="8"
                    max="120"
                    value={fontSettings.size}
                    onChange={(e) => setFontSettings(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gradient-to-r from-gray-200 to-indigo-200 rounded-full appearance-none cursor-pointer"
                    disabled={!fontSettings.family}
                  />
                </motion.div>
              </motion.div>

              {/* Font Weight Selector */}
              <motion.div variants={itemVariants}>
                <motion.label 
                  className="block text-sm font-medium text-gray-700 mb-2"
                  whileHover={{ scale: 1.01 }}
                >
                  Weight
                </motion.label>
                <motion.select
                  value={fontSettings.weight}
                  onChange={(e) => setFontSettings(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white"
                  disabled={!fontSettings.family}
                  whileHover={{ scale: 1.01 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
                    <option key={weight} value={weight}>{weight}</option>
                  ))}
                </motion.select>
              </motion.div>

              {/* Italic Toggle */}
              <motion.div className="flex items-center" variants={itemVariants}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={fontSettings.italic}
                      onChange={() => setFontSettings(prev => ({ ...prev, italic: !prev.italic }))}
                      className="sr-only"
                      disabled={!fontSettings.family}
                    />
                    <motion.div 
                      className={`w-12 h-7 rounded-full shadow-inner ${
                        !fontSettings.family ? 'bg-gray-200' : 
                        fontSettings.italic ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gray-300'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                        animate={{ x: fontSettings.italic ? 26 : 4 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 700, 
                          damping: 30 
                        }}
                      />
                    </motion.div>
                  </div>
                  <motion.span 
                    className="text-sm font-medium text-gray-700"
                    whileHover={{ color: "#6366F1" }}
                  >
                    Italic
                  </motion.span>
                </label>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FontTester;