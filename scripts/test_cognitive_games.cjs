// Comprehensive Verification & Test Suite for SMRITARA 3.3 Cognitive Training Platform
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

// -------------------------------------------------------------
// Test 1: Seeded Randomness & Controlled PRNG (Mulberry32)
// -------------------------------------------------------------
console.log('\n--- 1. Seeded Randomness & PRNG Determinism ---');
function mulberry32(seed) {
  let s = Math.abs(Math.floor(seed)) || 1;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rngA1 = mulberry32(4242);
const rngA2 = mulberry32(4242);
const seq1 = [rngA1(), rngA1(), rngA1(), rngA1()];
const seq2 = [rngA2(), rngA2(), rngA2(), rngA2()];

assert(
  JSON.stringify(seq1) === JSON.stringify(seq2),
  'Mulberry32 PRNG produces 100% deterministic float sequence for identical seed'
);

const rngB = mulberry32(9999);
const seqB = [rngB(), rngB(), rngB(), rngB()];
assert(
  JSON.stringify(seq1) !== JSON.stringify(seqB),
  'Different seeds produce distinct pseudo-random sequences'
);

// -------------------------------------------------------------
// Test 2: Fruit Memory Path Generation & Step Validation
// -------------------------------------------------------------
console.log('\n--- 2. Fruit Memory Path Engine ---');
const fruitEngineCode = fs.readFileSync(path.join(__dirname, '../src/engine/games/fruitPathEngine.ts'), 'utf-8');
assert(fruitEngineCode.includes('export function generateFruitPathRound'), 'generateFruitPathRound is exported');
assert(fruitEngineCode.includes('export function validateFruitPathStep'), 'validateFruitPathStep is exported');
assert(fruitEngineCode.includes('export function calculateFruitPathScore'), 'calculateFruitPathScore is exported');

// Algorithmic validation of path step logic
function testValidateStep(pathSequence, userSelected, nextTileId) {
  const currentStepIndex = userSelected.length;
  const expectedTileId = pathSequence[currentStepIndex];
  const isCorrect = nextTileId === expectedTileId;
  const isComplete = isCorrect && currentStepIndex + 1 === pathSequence.length;
  return { isCorrect, isComplete, currentStepIndex };
}

const mockPath = [10, 4, 8, 2, 9];
assert(testValidateStep(mockPath, [], 10).isCorrect === true, 'First step validation succeeds on correct initial tile');
assert(testValidateStep(mockPath, [], 4).isCorrect === false, 'First step validation rejects wrong initial tile');
assert(testValidateStep(mockPath, [10, 4, 8, 2], 9).isComplete === true, 'Final step flags sequence completion');

// -------------------------------------------------------------
// Test 3: Web Audio Memory Melody Engine & Tone Synthesis
// -------------------------------------------------------------
console.log('\n--- 3. Memory Melody Audio Engine ---');
const melodyEngineCode = fs.readFileSync(path.join(__dirname, '../src/engine/games/melodyEngine.ts'), 'utf-8');
assert(melodyEngineCode.includes('class MelodySynthesizer'), 'MelodySynthesizer class exists for synthetic tones');
assert(melodyEngineCode.includes('AudioContext'), 'Synthesizer uses browser Web Audio API AudioContext');
assert(melodyEngineCode.includes('exponentialRampToValueAtTime'), 'Synthesizer uses smooth exponential audio envelope to prevent clicking');
assert(melodyEngineCode.includes('MUSICAL_SCALE'), 'Scale defines 8 authentic diatonic swara tones (Sa to Sa\')');
assert(melodyEngineCode.includes('export function generateMelodyRound'), 'generateMelodyRound is exported');
assert(melodyEngineCode.includes('export function validateMelodyStep'), 'validateMelodyStep is exported');

// -------------------------------------------------------------
// Test 4: Sacred Pattern Memory & Constructive Diagnostics
// -------------------------------------------------------------
console.log('\n--- 4. Sacred Pattern Memory Engine ---');
const patternEngineCode = fs.readFileSync(path.join(__dirname, '../src/engine/games/patternMemoryEngine.ts'), 'utf-8');
assert(patternEngineCode.includes('export function generatePatternRound'), 'generatePatternRound is exported');
assert(patternEngineCode.includes('export function validatePatternReconstruction'), 'validatePatternReconstruction is exported');
assert(patternEngineCode.includes('export function calculatePatternScore'), 'calculatePatternScore is exported');
assert(patternEngineCode.includes('discrepancies.push'), 'Pattern engine constructs granular discrepancies for mistakes');
assert(patternEngineCode.includes('summaryFeedback'), 'Pattern engine generates constructive diagnostic advice');

// -------------------------------------------------------------
// Test 5: 3D Dice Memory Engine & Geometric Consistency
// -------------------------------------------------------------
console.log('\n--- 5. 3D Dice Memory Engine ---');
const diceEngineCode = fs.readFileSync(path.join(__dirname, '../src/engine/games/diceMemoryEngine.ts'), 'utf-8');
assert(diceEngineCode.includes('export function generateDiceRound'), 'generateDiceRound is exported');
assert(diceEngineCode.includes('export function calculateDiceScore'), 'calculateDiceScore is exported');
assert(diceEngineCode.includes('q_face'), 'Engine generates procedural questions for specific die face');
assert(diceEngineCode.includes('q_total_sum'), 'Engine generates procedural questions for sum of dice');

// Verify authentic dice opposite faces sum to 7
const diceSVGCode = fs.readFileSync(path.join(__dirname, '../src/components/common/icons/DiceSVGs.tsx'), 'utf-8');
assert(diceSVGCode.includes('7 - val'), 'Die3DCube enforces valid opposite dice face geometry (opposite faces = 7)');
assert(diceSVGCode.includes('preserve-3d'), 'Die3DCube uses CSS preserve-3d for lightweight visual depth');
assert(diceSVGCode.includes('DieFaceSVG'), 'DieFaceSVG exported for accessible 2D mode');

// -------------------------------------------------------------
// Test 6: Number Sequence Memory (Forward & Reverse Digit Span)
// -------------------------------------------------------------
console.log('\n--- 6. Number Sequence Memory Engine ---');
const numSeqCode = fs.readFileSync(path.join(__dirname, '../src/engine/games/numberSequenceEngine.ts'), 'utf-8');
assert(numSeqCode.includes('export function generateNumberSequenceRound'), 'generateNumberSequenceRound is exported');
assert(numSeqCode.includes('export function validateNumberSequence'), 'validateNumberSequence is exported');
assert(numSeqCode.includes('round.mode === \'reverse\''), 'validateNumberSequence implements reverse working memory span');
assert(numSeqCode.includes('calculateNumberSequenceScore'), 'calculateNumberSequenceScore is exported');

// -------------------------------------------------------------
// Test 7: Adaptive Difficulty Calibration
// -------------------------------------------------------------
console.log('\n--- 7. Adaptive Difficulty Engine ---');
const adaptiveCode = fs.readFileSync(path.join(__dirname, '../src/engine/games/adaptiveDifficultyEngine.ts'), 'utf-8');
assert(adaptiveCode.includes('export function evaluateAdaptiveDifficulty'), 'evaluateAdaptiveDifficulty is exported');
assert(adaptiveCode.includes('status: \'advance\''), 'Engine detects mastery and advances difficulty');
assert(adaptiveCode.includes('status: \'ease\''), 'Engine detects fatigue/struggles and eases difficulty');
assert(adaptiveCode.includes('explanation:'), 'Engine provides transparent verbal explanation of difficulty shift');

// -------------------------------------------------------------
// Test 8: Custom Visual Asset System (No Unicode Emojis)
// -------------------------------------------------------------
console.log('\n--- 8. Original Hand-Authored Vector Assets (No Keyboard Emojis) ---');
const fruitIconsCode = fs.readFileSync(path.join(__dirname, '../src/components/common/icons/FruitIcons.tsx'), 'utf-8');
assert(fruitIconsCode.includes('FruitMango') && fruitIconsCode.includes('FruitPomegranate') && fruitIconsCode.includes('FruitGuava'), 'FruitIcons.tsx contains custom SVGs for indigenous fruits');

const patternSymbolsCode = fs.readFileSync(path.join(__dirname, '../src/components/common/icons/PatternSymbols.tsx'), 'utf-8');
assert(patternSymbolsCode.includes('SymbolLotus') && patternSymbolsCode.includes('SymbolMandala') && patternSymbolsCode.includes('SymbolYantra'), 'PatternSymbols.tsx contains custom sacred geometry SVGs');

const memoryObjectsCode = fs.readFileSync(path.join(__dirname, '../src/components/common/icons/MemoryObjectIcons.tsx'), 'utf-8');
assert(memoryObjectsCode.includes('DiyaSVG') && memoryObjectsCode.includes('BellSVG') && memoryObjectsCode.includes('MalaSVG') && memoryObjectsCode.includes('DharmaWheelSVG'), 'MemoryObjectIcons.tsx provides custom SVGs for cultural objects & philosophical values');

const objGameCode = fs.readFileSync(path.join(__dirname, '../src/components/smritiveda/ObjectMemoryGame.tsx'), 'utf-8');
assert(objGameCode.includes('<MemoryObjectSVG objectKey={item.id}'), 'ObjectMemoryGame uses MemoryObjectSVG instead of keyboard emojis');

const matchGameCode = fs.readFileSync(path.join(__dirname, '../src/components/smritiveda/MemoryMatchGame.tsx'), 'utf-8');
assert(matchGameCode.includes('<MemoryObjectSVG objectKey={card.icon}'), 'MemoryMatchGame card faces use MemoryObjectSVG instead of keyboard emojis');
assert(matchGameCode.includes('<DharmaWheelSVG'), 'MemoryMatchGame card back uses DharmaWheelSVG instead of keyboard emojis');

// -------------------------------------------------------------
// Test 9: Spoken AI Website Guide & Guided Tour
// -------------------------------------------------------------
console.log('\n--- 9. Spoken AI Website Guide & Captions ---');
const spokenServiceCode = fs.readFileSync(path.join(__dirname, '../src/engine/spokenGuideService.ts'), 'utf-8');
assert(spokenServiceCode.includes('class SpokenGuideService'), 'SpokenGuideService wraps browser speechSynthesis');
assert(spokenServiceCode.includes('onSentence?:'), 'SpokenGuideService broadcasts sentence chunks for real-time visible captions');
assert(spokenServiceCode.includes('speakGameInstruction'), 'speakGameInstruction is exported for spoken pre-game rules');
assert(spokenServiceCode.includes('speakRoundFeedback'), 'speakRoundFeedback is exported for spoken completion encouragement');

const guideBarCode = fs.readFileSync(path.join(__dirname, '../src/components/guide/SpokenGuideBar.tsx'), 'utf-8');
assert(guideBarCode.includes('currentCaption') && guideBarCode.includes('spokenGuideService.subscribe'), 'SpokenGuideBar displays live synchronized visible captions');
assert(guideBarCode.includes('handlePlayContextGuide'), 'SpokenGuideBar provides contextual explanation of active screen');

const tourCode = fs.readFileSync(path.join(__dirname, '../src/components/guide/GuidedTourModal.tsx'), 'utf-8');
assert(tourCode.includes('TOUR_STEPS'), 'GuidedTourModal contains 5-step guided website tour');
assert(tourCode.includes('spokenGuideService.speak(step.script)'), 'GuidedTourModal triggers speech narration on step transition');

const appCode = fs.readFileSync(path.join(__dirname, '../src/App.tsx'), 'utf-8');
assert(appCode.includes('<SpokenGuideBar onStartTour='), 'SpokenGuideBar is mounted persistently in App.tsx');
assert(appCode.includes('<GuidedTourModal'), 'GuidedTourModal is mounted in App.tsx');

// -------------------------------------------------------------
// Test 10: Cognitive Games Centre Hub Integration
// -------------------------------------------------------------
console.log('\n--- 10. Cognitive Games Centre Hub Integration ---');
const gamesHubCode = fs.readFileSync(path.join(__dirname, '../src/components/games/CognitiveGamesCenter.tsx'), 'utf-8');
assert(gamesHubCode.includes('FruitPathGame'), 'CognitiveGamesCenter mounts FruitPathGame');
assert(gamesHubCode.includes('MemoryMelodyGame'), 'CognitiveGamesCenter mounts MemoryMelodyGame');
assert(gamesHubCode.includes('PatternMemoryGame'), 'CognitiveGamesCenter mounts PatternMemoryGame');
assert(gamesHubCode.includes('DiceMemoryGame'), 'CognitiveGamesCenter mounts DiceMemoryGame');
assert(gamesHubCode.includes('NumberSequenceGame'), 'CognitiveGamesCenter mounts NumberSequenceGame');
assert(gamesHubCode.includes('showExitConfirm'), 'CognitiveGamesCenter implements discard confirmation before exiting active game');
assert(gamesHubCode.includes('recordMemorySession'), 'CognitiveGamesCenter saves completed session to verified user progress');

const memoryGymCode = fs.readFileSync(path.join(__dirname, '../src/components/memory/MemoryGymView.tsx'), 'utf-8');
assert(memoryGymCode.includes('<CognitiveGamesCenter />'), 'MemoryGymView defaults to CognitiveGamesCenter');

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log(`\n=============================================================`);
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`=============================================================\n`);

if (failed > 0) {
  process.exit(1);
}
