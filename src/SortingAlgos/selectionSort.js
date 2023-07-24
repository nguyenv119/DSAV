import {resetAllBarColors, greenify} from "./CommonMethods/commonMethods";
import {    PRIMARY_COLOR,
            SECONDARY_COLOR,
            SAMESIZE_COLOR,
            DONE_COLOR
        } from "../SortingVisualizer/SortingVisualizer";

const LARGER_COLOR = "#f44336";
const SMALLER_COLOR = "#50af50";
const MIN_SOFAR_COLOR = "#9a17ff";

/** The selectionSort function we are exporting with the animation array */
export function selectionSortExp(array, 
                                arrayBars, 
                                getSpeedCallback, 
                                comparisons, 
                                updateComparisons,
                                isPausedCallback) {

    return new Promise((resolve) => {
        resetAllBarColors(arrayBars, PRIMARY_COLOR);        
        const [animations, arr] = getSelectionSortAnimationArray(array.slice());
        animate(animations, arrayBars, 0, array.length, getSpeedCallback, comparisons, updateComparisons, isPausedCallback, () => resolve(arr));
    });
}

function getSelectionSortAnimationArray(arr) {
    const animations = [];
    if (arr.length <= 1) return arr;
    selectionSort(arr, animations)
    return [animations, arr];
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
function selectionSort(array, animations) {
    if (array == null) return null;
    if (array.length == 1) return array;

    for (let i = 0; i < array.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < array.length; j++) {
            /** Initial comparison between smallestSoFar and j*/
            animations.push([min, j]);
            /** Pass these indices into arrayBars to see which one larger, then switch COLORS */
            if (array[j] < array[min]) {
                animations.push([j, min]);
                animations.push([array[j], array[min]]);

                /** We push this here so every 3rd stage, 
                 * we check if j has gotten to the end of the 
                 * array yet -- meaning that we are ready to compare 
                 * back to the most recent sorted spot.
                 */
                animations.push([array[i], array[j]]);
                min = j;
            }
            else {
                animations.push([min, j]);
                animations.push([array[min], array[j]]);
                animations.push([array[i], array[min]]);
            }
            animations.push([i, j]);
        }
        /** pass in values to switch bars at the end 
         * If our original pick at index i was the smallest, 
         * simply switch the color
        */
        if (min != i) {
            [array[min], array[i]] = [array[i], array[min]];
        }
        /** Final element of animation to highlight the last index as
         * automatically sorted
         */
    }
    animations.push([array.length - 1, 0]);
}

/** Animates the selectionSort */
function animate(animations,
                 arrayBars, 
                 completedAnimations, 
                 BARS, 
                 getSpeedCallback, 
                 comparisons, 
                 updateComparisons, 
                 isPausedCallback, 
                 resolveCallback) {

    if (completedAnimations >= animations.length) {
        greenify(completedAnimations, animations, arrayBars);
        resolveCallback(animations)
        return;
    }

    if (isPausedCallback()) {
        setTimeout(() => {
            animate(animations, arrayBars, completedAnimations, BARS, getSpeedCallback, comparisons, updateComparisons, isPausedCallback, resolveCallback);
        }, 1);
        return;
    }

    const i = completedAnimations;
    let nextStepTimeout = 0;

    /** If we are on the last elment, this means that
     * in the selectionSort, i === array.length - 1,
     * so we just set the bar to DONE_COLOR
     */
    if (i === animations.length - 1) {
        const [lastBarIndex, IGNORE] = animations[i];
        const lastBarStyle = arrayBars[lastBarIndex].style;
        lastBarStyle.backgroundColor = DONE_COLOR;
        completedAnimations++;
    } else {

        const stage = i % 5;

        if (stage === 0) {
            const [barOneIdx, barTwoIdx] = animations[i];
            const barOneStyle = arrayBars[barOneIdx].style;
            const barTwoStyle = arrayBars[barTwoIdx].style;  

            barOneStyle.backgroundColor = SECONDARY_COLOR;
            barTwoStyle.backgroundColor = SECONDARY_COLOR;
            completedAnimations += 2;
            nextStepTimeout = getSpeedCallback();
        }
        else if (stage === 2) {
            const [indexMinSoFar, indexJ] = animations[i - 1];
            const [minSoFarVal, jVal] = animations[i];

            /*
            ? If two bars have the same height, set to yellow */
            const smallerBarStyle = arrayBars[indexMinSoFar].style;
            const largerBarStyle = arrayBars[indexJ].style; 
            if (minSoFarVal === jVal) {
                smallerBarStyle.backgroundColor = SAMESIZE_COLOR;
                largerBarStyle.backgroundColor = SAMESIZE_COLOR;

                completedAnimations++;
                updateComparisons(comparisons + 1)
                comparisons++;
            }
            else {
                smallerBarStyle.backgroundColor = SMALLER_COLOR;
                largerBarStyle.backgroundColor = LARGER_COLOR;

                updateComparisons(comparisons + 1)
                comparisons++;
                completedAnimations++;
            }
            nextStepTimeout = getSpeedCallback();
        }
        else if (stage === 3) {
            /** 
             * We have a guarantee that the first element of the animations
             * element is the smallest value. So, just switch heights. 
             * 
             * If we dont need to switch heights -- that jValue is <= minValSoFar,
             * just make both bars NOSWITCH COLOR
             */
            const [indexMinSoFar, indexOther] = animations[i - 2];
            const smallerBarStyle = arrayBars[indexMinSoFar].style;
            const largerBarStyle = arrayBars[indexOther].style;

            smallerBarStyle.backgroundColor = MIN_SOFAR_COLOR;
            largerBarStyle.backgroundColor = PRIMARY_COLOR;
            completedAnimations++;
            nextStepTimeout = getSpeedCallback();
        }
        else if (stage === 4) {
            /** We only switch bars when sorting has reached
             * the end of the array. If not, just increase animations,
             * and do nothing
             */
            const [indexToBeSwapped, indexEnd] = animations[i];
            if (indexEnd === BARS - 1) {
                const [toBeSwappedVal, smallestFound] = animations[i - 1];
                const [indexSmallestFound, IGNORE] = animations[i - 3];
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
                completedAnimations++;
            }
            else {
                completedAnimations++;
            }
            nextStepTimeout = getSpeedCallback();
        }
    }
    setTimeout(() => animate(animations, arrayBars, completedAnimations, BARS, getSpeedCallback, comparisons, updateComparisons, isPausedCallback, resolveCallback), nextStepTimeout);
}