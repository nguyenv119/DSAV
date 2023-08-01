import { resetAllBarColors, greenify } from "../CommonMethods/commonMethods";
import {    PRIMARY_COLOR,
            SECONDARY_COLOR,
            SAMESIZE_COLOR,
            DONE_COLOR
        } from "../../SortingVisualizer/SortingVisualizer";

const LARGER_COLOR = "#f44336";
const SMALLER_COLOR = "#50af50";
const MIN_SOFAR_COLOR = "#8338EC";

/** The selectionSort function we are exporting with the animation array */
export function selectionSortExp(array, 
                                arrayBars, 
                                getSpeedCallback, 
                                comparisons, 
                                updateComparisons,
                                isPausedCallback,
                                updateHighlight) {

    return new Promise((resolve) => {
        resetAllBarColors(arrayBars, PRIMARY_COLOR);        
        const [lines, animations, arr] = getSelectionSortAnimationArray(array.slice());
        animate(lines, 0, animations, arrayBars, 0, array.length, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, () => resolve(arr));
    });
}

function getSelectionSortAnimationArray(arr) {
    const animations = [];
    const lines = [];
    if (arr.length <= 1) return arr;
    selectionSort(arr, lines, animations)
    return [lines, animations, arr];
}

/** 
 * --> Idea is that we should have one color highlighting the
 * smallestValueSoFar, probably super pink
 * 
 * 0: --> Then through every comparison, we can highlight the other
 * bar as a SECONDARY_COLOR
 * 
 * 1: --> We pass in the index of the small, large index:
 *      [small, large]
 * 
 * 2: --> We pass in the values of the small, large index:
 *      [smallVal, largeVal]
 *    --> If its smaller, set green, smallestSoFar red
 *    --> If its larger, set red, smallestSoFar green
 * 
 * 3: --> Switch color for new smallestSoFar if necesarry
 * But for the next step, we pass in the value of the i'th index
 * (the index that is sorted), and the value of the smallestValSoFar
 * 
 * 4: --> Change bar heights at the end, change back to primary, then change sortedSoFar index to DONE_COLOR
 * 
 * --> Like bubbleSort, for every sorted spot we should have it DONE_COLOR
 * 
 */
function selectionSort(array, lines, animations) {
    if (array == null) return null;
    if (array.length == 1) return array;

    for (let i = 0; i < array.length - 1; i++) {
        lines.push(["YES", 5]);

        let min = i;
        lines.push(["YES", 6]);

        for (let j = i + 1; j < array.length; j++) {
            lines.push(["YES", 8]); /** Will be stage 4: ignore */

            /** Initial comparison between smallestSoFar and j*/
            animations.push([min, j]);

            /** Pass these indices into arrayBars to see which one larger, then switch COLORS */
            if (array[j] < array[min]) {
                lines.push(["YES", 10]); /** Stage 0, compare indices */
                lines.push(["YES", 10]); /** Stage 2, compare values */

                animations.push([j, min]);
                animations.push([array[j], array[min]]);
                animations.push([array[i], array[j]]);

                min = j;
                lines.push(["YES", 11]); /** Stage 3, highlight min */
            } else {
                animations.push([min, j]);
                animations.push([array[min], array[j]]);
                animations.push([array[i], array[min]]);

                lines.push(["YES", 10]); /** Stage 0, compare indices */
                lines.push(["YES", 10]); /** Stage 2, compare values */
                lines.push(["NO", 10]); /** Stage 3, highlight min */
            }
            animations.push([i, min]);
        }
        /** Pass in values to switch bars at the end 
         * If our original pick at index i was the smallest, 
         * simply switch the color.
         * ? These will be stage 4 */
        lines.push(["NO", 8]);
        if (min != i) {
            lines.push(["YES", 15]); 
            [array[min], array[i]] = [array[i], array[min]];
            lines.push(["YES", 16]); /** Stage 4: swap values */
        } else {
            lines.push(["YES", 15]);
            lines.push(["NO", 15]); /** Stage 4: dont swap values */
        }
    }
    /** Final element of animation to highlight the last index as
     * automatically sorted */
    animations.push([array.length - 1, 0]);
}

/** Animates the selectionSort */
function animate(
                 lines,
                 linesIdx,
                 animations,
                 arrayBars, 
                 animationsIdx, 
                 BARS, 
                 getSpeedCallback, 
                 comparisons, 
                 updateComparisons, 
                 updateHighlight,
                 isPausedCallback, 
                 resolveCallback) {

    if (isPausedCallback()) {
        setTimeout(() => {
            animate(lines, linesIdx, animations, arrayBars, animationsIdx, BARS, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, resolveCallback);
        }, 1);
        return;
    }

    if (linesIdx >= lines.length) {
        greenify(linesIdx, lines, arrayBars);
        resolveCallback(animations)
        return;
    }

    let nextStepTimeout = 0;
    const highlightedLine = lines[linesIdx];

    /** If we are on the last elment, this means that
     * in the selectionSort, i === array.length - 1,
     * so we just set the bar to DONE_COLOR
     */
    if (animationsIdx === animations.length - 1) {
        const [lastBarIndex, IGNORE] = animations[animationsIdx];
        const lastBarStyle = arrayBars[lastBarIndex].style;
        lastBarStyle.backgroundColor = DONE_COLOR;
        animationsIdx++;
    } 
    else {
        const stage = animationsIdx % 5;
        console.log(stage, highlightedLine);

        /** Always highlight the min */
        if (stage === 3) {
            /** 
             * We have a guarantee that the first element of the animations
             * element is the smallest value. So, just switch heights. 
             * 
             * If we dont need to switch heights -- that jValue is <= minValSoFar,
             * just make both bars NOSWITCH COLOR
             */
            const [indexMinSoFar, indexOther] = animations[animationsIdx - 2];
            const smallerBarStyle = arrayBars[indexMinSoFar].style;
            const largerBarStyle = arrayBars[indexOther].style;

            smallerBarStyle.backgroundColor = MIN_SOFAR_COLOR;
            largerBarStyle.backgroundColor = PRIMARY_COLOR;
            animationsIdx++;
            nextStepTimeout = getSpeedCallback();

        } 
        if (highlightedLine.includes(8)) {
            if (stage === 4 && highlightedLine.includes("YES")) {
                animationsIdx++;
                nextStepTimeout = getSpeedCallback();
            }
        } else if (highlightedLine.includes(15)) {
            const [indexToBeSwapped, indexEnd] = animations[animationsIdx];
            const barSwap = arrayBars[indexToBeSwapped].style;
            
            /** Highlight bars to be switched if we are on the 1st 15 */
            if (lines[linesIdx - 3].includes(10)) {
                const barEnd = arrayBars[indexEnd].style;
                barSwap.backgroundColor = "white";
                barEnd.backgroundColor = "white";
                nextStepTimeout = getSpeedCallback();
            /** If not, highlight it to be pink */
            } else {
                barSwap.backgroundColor = DONE_COLOR;
                animationsIdx++;
            }
        /** Absolutely swap bars */
        } else if (highlightedLine.includes(16)) {
            const [indexToBeSwapped, indexSwap] = animations[animationsIdx];
            const [toBeSwappedVal, smallestFound] = animations[animationsIdx - 1];
            const [indexSmallestFound, IGNORE] = animations[animationsIdx - 3];
            const swapBar = arrayBars[indexToBeSwapped].style;
            const smallestFoundBar = arrayBars[indexSmallestFound].style;

            /* 
            * If the smallestFound is not our initial i'th element
            * We swap heights and change both the colors
            * --> Makes most recently sorted index DONE_COLOR
            * --> Revert the other swapped value back to PRIMARY
            */
            if (indexToBeSwapped !== indexSmallestFound) {
                [swapBar.height, smallestFoundBar.height] = [`${smallestFound}px`, `${toBeSwappedVal}px`];
                smallestFoundBar.backgroundColor = PRIMARY_COLOR;
            }
            swapBar.backgroundColor = DONE_COLOR;
            nextStepTimeout = getSpeedCallback();
            animationsIdx++;
        } else {
            if (highlightedLine.includes(10)) {
                /** Stage 0, compare indices */
                if (stage === 0) {
                    const [barOneIdx, barTwoIdx] = animations[animationsIdx];
                    const barOneStyle = arrayBars[barOneIdx].style;
                    const barTwoStyle = arrayBars[barTwoIdx].style;  
        
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                    barTwoStyle.backgroundColor = SECONDARY_COLOR;
                    animationsIdx += 2;
                    nextStepTimeout = getSpeedCallback();
    
                /** Stage 2, compare values */
                } else if (stage === 2) {
                    const [indexMinSoFar, indexJ] = animations[animationsIdx - 1];
                    const [minSoFarVal, jVal] = animations[animationsIdx];
    
                    /*
                    ? If two bars have the same height, set to yellow */
                    const smallerBarStyle = arrayBars[indexMinSoFar].style;
                    const largerBarStyle = arrayBars[indexJ].style; 
                    if (minSoFarVal === jVal) {
                        smallerBarStyle.backgroundColor = SAMESIZE_COLOR;
                        largerBarStyle.backgroundColor = SAMESIZE_COLOR;
                    }
                    else {
                        smallerBarStyle.backgroundColor = SMALLER_COLOR;
                        largerBarStyle.backgroundColor = LARGER_COLOR;
                    }
                    updateComparisons(comparisons + 1)
                    comparisons++;
                    animationsIdx++;
                    nextStepTimeout = getSpeedCallback();
                } 
            } 
        }
    }
    nextStepTimeout = getSpeedCallback(); 
    updateHighlight(highlightedLine);
    linesIdx++;
    setTimeout(() => animate(lines, linesIdx, animations, arrayBars, animationsIdx, BARS, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, resolveCallback), nextStepTimeout);
}