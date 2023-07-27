import {resetAllBarColors, greenify} from "../CommonMethods/commonMethods";
import {    PRIMARY_COLOR,
            SECONDARY_COLOR,
            SAMESIZE_COLOR,
            DONE_COLOR } from "../../SortingVisualizer/SortingVisualizer";

const SMALLER_COLOR = "#50af50";
const LARGER_COLOR = "#f44336";

/** The insertionSort function we are exporting with the animation array */
export function insertionSortExp(array, 
                                arrayBars, 
                                getSpeedCallback, 
                                comparisons, 
                                updateComparisons,
                                isPausedCallback,
                                updateHighlight) {

    return new Promise((resolve) => {
        resetAllBarColors(arrayBars, PRIMARY_COLOR);        
        const [lines, animations, arr] = getInsertionSortAnimationArray(array.slice());
        animate(lines, 0, animations, arrayBars, 0, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, () => resolve(arr));
    })
}

function getInsertionSortAnimationArray(arr) {
    const animations = [];
    const lines = [];
    if (arr.length <= 1) return arr;
    insertionSort(arr, lines, animations)
    return [lines, animations, arr];
}

/** The actual insertionSort 
 * 
 * ! Whether we need to keep going down or not, the animations are still in tuples of 4:
 * Either we switch or we don't
 * 
 * 0: We first need to compare the 2 bars: SECONDARY_COLOR --> pass in indices
 * 1: We highlight which is larger (red) and smaller (green), or same (yellow) --> pass in values
 * 2: Switch values if we need to. If we don't, highlight purple
 * 3: back to primary --> pass in original indices again (order doesnt matter)
 * 
*/
function insertionSort(array, lines, animations) {
    if (array == null) return null;
    if (array.length == 1) return array;

    for (let i = 1; i < array.length; i++) {
        lines.push(["YES", 4]);
        let prevIdx = i - 1;
        lines.push(["YES", 5]);
        /** Either we enter the initial switch */
        while (prevIdx >= 0 && array[prevIdx + 1] < array[prevIdx]) {
            /*
            ? Stage 0: highlight bars */
            lines.push(["YES", 8]); 
            
            animations.push([prevIdx + 1, prevIdx]);
            animations.push([array[prevIdx + 1], array[prevIdx]]); // if prevVal > currVal, red, green
            animations.push([]); // If case above, switch heights and prevVal = green, currVal = red
            animations.push([]); // prevIdxSwapped, meaning we change 1 color
            [array[prevIdx], array[prevIdx + 1]] = [array[prevIdx + 1], array[prevIdx]];
            /*
            ? Stage 1: compare bars, and success */
            lines.push(["YES", 8]);
            /*
            ? Stage 2: swap bars */
            lines.push(["YES", 9]);
            prevIdx--; 
            /*
            ? Stage 3 */
            lines.push(["YES", 10]);
        }
        /**
         * ! Or either we never switched, or if we can't anymore : currVal >= prevVal
         * * Either j = -1, in that case we don't animate
         * * Or invalid, in which this case we do same color and highlight pink
        */
        if (prevIdx >= 0) {
            animations.push([prevIdx, prevIdx + 1]);
            animations.push([array[prevIdx], array[prevIdx + 1]]); // if prevVal == currVal, yellow both. Else prevVal < currVal green, pink
            animations.push([]); // if case above, highlight pink
            animations.push([]); // did not justSwapped, meaning we change both colors
            /*
            ? Stage 0: Compare Bars */
            lines.push(["YES", 8]);
            /*
            ? Stage 1: compare bars (oh no! no swap)*/
            lines.push(["YES", 8]);
            /*
            ? Stage 2: bars pink */
            lines.push(["NO", 8]);
            /*
            ? Stage 3 */
            lines.push(["NO", 8]); 
        } else if (prevIdx < 0) {
            /*
            ! Stage 0: red the while loop */
            lines.push(["NO", 8]);
        }
    }
    lines.push(["NO", 4]);
}

/*
? Animates insertionSort */
function animate(lines,
                linesIdx,
                animations, 
                arrayBars, 
                animationsIdx, 
                getSpeedCallback, 
                comparisons, 
                updateComparisons, 
                updateHighlight,
                isPausedCallback, 
                resolveCallback) {

    if (isPausedCallback()) {
        setTimeout(() => {
            animate(lines, linesIdx, animations, arrayBars, animationsIdx, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, resolveCallback);
        }, 1);
        return;
    }

    if (linesIdx >= lines.length) {
        greenify(linesIdx, lines, arrayBars);
        resolveCallback(animations);
        return;
    }

    let nextStepTimeout = 0;
    const stage = animationsIdx % 4;
    const highlightedLine = lines[linesIdx];
    console.log(stage, highlightedLine);

    if (highlightedLine.includes(8)) {
        if (stage === 0) {
            if (highlightedLine.includes("YES")) {
                const [smallIndex, largeIndex] = animations[animationsIdx];
                const smallStyle = arrayBars[smallIndex].style;
                const largeStyle = arrayBars[largeIndex].style;    
                
                smallStyle.backgroundColor = SECONDARY_COLOR;
                largeStyle.backgroundColor = SECONDARY_COLOR;
                nextStepTimeout = getSpeedCallback();
            } 
            animationsIdx++;
    
        } else if (stage === 1) {
            const [smallerValIndex, largerValIndex] = animations[animationsIdx - 1];
            const barSmallStyle = arrayBars[smallerValIndex].style;
            const barLargerStyle = arrayBars[largerValIndex].style;    
            
            if (arrayBars[smallerValIndex] === arrayBars[largerValIndex]) {
                barSmallStyle.backgroundColor = SAMESIZE_COLOR;
                barLargerStyle.backgroundColor = SAMESIZE_COLOR;
                updateComparisons(comparisons + 1)
                comparisons++;
            } else {
                barSmallStyle.backgroundColor = SMALLER_COLOR;
                barLargerStyle.backgroundColor = LARGER_COLOR;
                updateComparisons(comparisons + 1)
                comparisons++;
            }
            animationsIdx++;
            nextStepTimeout = getSpeedCallback();
    
        } else if (stage === 2) {
            const [smallerVal, largerVal] = animations[animationsIdx - 1];
            const [smallerValIndex, largerValIndex] = animations[animationsIdx - 2];
            let barSmallStyle = arrayBars[smallerValIndex].style;
            let barLargerStyle = arrayBars[largerValIndex].style;    
    
            if (smallerVal === largerVal || smallerValIndex < largerValIndex) {
                barSmallStyle.backgroundColor = DONE_COLOR;
                barLargerStyle.backgroundColor = DONE_COLOR;
            } else {
                [barSmallStyle.height, barLargerStyle.height] = [`${largerVal}px`, `${smallerVal}px`]
                barSmallStyle.backgroundColor = LARGER_COLOR;
                barLargerStyle.backgroundColor = SMALLER_COLOR;
            }
            animationsIdx++;
            nextStepTimeout = getSpeedCallback();
        } else {
            const [indexNoLongerInUse, indexStillUsing] = animations[animationsIdx - 3];
            const indexNoLongerInUseStyle = arrayBars[indexNoLongerInUse].style;
            const indexStillUsingStyle = arrayBars[indexStillUsing].style;
            animationsIdx++;
                        
            setTimeout(() => {
                indexNoLongerInUseStyle.backgroundColor = PRIMARY_COLOR;
                indexStillUsingStyle.backgroundColor = PRIMARY_COLOR;
            }, getSpeedCallback());
            nextStepTimeout = getSpeedCallback();
        }
    } else if (highlightedLine.includes(9)) {
        if (stage === 2) {
            const [smallerVal, largerVal] = animations[animationsIdx - 1];
            const [smallerValIndex, largerValIndex] = animations[animationsIdx - 2];
            let barSmallStyle = arrayBars[smallerValIndex].style;
            let barLargerStyle = arrayBars[largerValIndex].style;    
    
            if (smallerVal === largerVal || smallerValIndex < largerValIndex) {
                barSmallStyle.backgroundColor = DONE_COLOR;
                barLargerStyle.backgroundColor = DONE_COLOR;
            } else {
                [barSmallStyle.height, barLargerStyle.height] = [`${largerVal}px`, `${smallerVal}px`]
                barSmallStyle.backgroundColor = LARGER_COLOR;
                barLargerStyle.backgroundColor = SMALLER_COLOR;
            }
            animationsIdx++;
            nextStepTimeout = getSpeedCallback();
        } 
    } else if (highlightedLine.includes(10)) {
        if (stage === 3) {
            const [indexNoLongerInUse, indexStillUsing] = animations[animationsIdx - 3];
            const indexNoLongerInUseStyle = arrayBars[indexNoLongerInUse].style;
            const indexStillUsingStyle = arrayBars[indexStillUsing].style;
            animationsIdx++;
                        
            setTimeout(() => {
                indexNoLongerInUseStyle.backgroundColor = PRIMARY_COLOR;
                indexStillUsingStyle.backgroundColor = PRIMARY_COLOR;
            }, getSpeedCallback());
            nextStepTimeout = getSpeedCallback();
        }
    }

    nextStepTimeout = getSpeedCallback(); 
    updateHighlight(highlightedLine);
    linesIdx++;
    setTimeout(() => animate(lines, linesIdx, animations, arrayBars, animationsIdx, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, resolveCallback), nextStepTimeout);
}