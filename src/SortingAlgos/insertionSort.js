import {resetAllBarColors, greenify} from "./CommonMethods/commonMethods";
import {    PRIMARY_COLOR,
            SECONDARY_COLOR,
            SAMESIZE_COLOR,
            DONE_COLOR } from "../SortingVisualizer/SortingVisualizer";

const SMALLER_COLOR = "#50af50";
const LARGER_COLOR = "#f44336";

/** The insertionSort function we are exporting with the animation array */
export function insertionSortExp(array, arrayBars, getSpeedCallback, comparisons, updateComparisons) {
    return new Promise((resolve) => {
        resetAllBarColors(arrayBars, PRIMARY_COLOR);        
        const [animations, arr] = getInsertionSortAnimationArray(array.slice());
        animate(animations, arrayBars, 0, getSpeedCallback, comparisons, updateComparisons, () => resolve(arr));
    })
}

function getInsertionSortAnimationArray(arr) {
    const animations = [];
    if (arr.length <= 1) return arr;
    insertionSort(arr, animations)
    return [animations, arr];
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
function insertionSort(array, animations) {
    if (array == null) return null;
    if (array.length == 1) return array;

    for (let i = 1; i < array.length; i++) {
        let j = i - 1;

        /** Either we enter the initial switch */
        while (j >= 0 && array[j + 1] < array[j]) {
            animations.push([j + 1, j]);
            animations.push([array[j + 1], array[j]]); // if array[j] > array[j + 1], red, green
            animations.push([]); // If case above, switch heights and array[j] = green, array[j + 1] = red
            animations.push([]); // justSwapped, meaning we change 1 color
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
            j--;
        }
        /**
         * ! Or either we never switched, or if we can't anymore 
         * * Either j = -1, in that case we don't animate
         * * Or invalid, in which this case we do same color and highlight purple
        */
        if (j >= 0) {
            animations.push([j, j + 1]);
            animations.push([array[j], array[j + 1]]); // if array[j] == array[j + 1], yellow both. Else array[j] < array[j + 1] green, red
            animations.push([]); // if case above, highlight purple, purple
            animations.push([]); // did not justSwapped, meaning we change both colors
        }
    }
}

/*
? Animates insertionSort */
function animate(animations, arrayBars, completedAnimations, getSpeedCallback, comparisons, updateComparisons, resolveCallback) {
    if (completedAnimations >= animations.length) {
        greenify(completedAnimations, animations, arrayBars);
        resolveCallback(animations);
        return;
    }

    const i = completedAnimations;
    const stage = i % 4;

    let nextStepTimeout = 0;

    if (stage === 0) {
        const [smallIndex, largeIndex] = animations[i];
        const smallStyle = arrayBars[smallIndex].style;
        const largeStyle = arrayBars[largeIndex].style;    
        
        smallStyle.backgroundColor = SECONDARY_COLOR;
        largeStyle.backgroundColor = SECONDARY_COLOR;
        completedAnimations++;
        nextStepTimeout = getSpeedCallback();
    }

    else if (stage === 1) {
        const [smallerValIndex, largerValIndex] = animations[i - 1];
        const barSmallStyle = arrayBars[smallerValIndex].style;
        const barLargerStyle = arrayBars[largerValIndex].style;    
        
        if (arrayBars[smallerValIndex] === arrayBars[largerValIndex]) {
            barSmallStyle.backgroundColor = SAMESIZE_COLOR;
            barLargerStyle.backgroundColor = SAMESIZE_COLOR;
            updateComparisons(comparisons + 1)
            comparisons++;
        }

        else {
            barSmallStyle.backgroundColor = SMALLER_COLOR;
            barLargerStyle.backgroundColor = LARGER_COLOR;
            updateComparisons(comparisons + 1)
            comparisons++;
        }
        completedAnimations++;
        nextStepTimeout = getSpeedCallback();
    }

    else if (stage === 2) {
        const [smallerVal, largerVal] = animations[i - 1];
        const [smallerValIndex, largerValIndex] = animations[i - 2];
        let barSmallStyle = arrayBars[smallerValIndex].style;
        let barLargerStyle = arrayBars[largerValIndex].style;    

        if (smallerVal === largerVal || smallerValIndex < largerValIndex) {
            barSmallStyle.backgroundColor = DONE_COLOR;
            barLargerStyle.backgroundColor = DONE_COLOR;
        }

        else {
            [barSmallStyle.height, barLargerStyle.height] = [`${largerVal}px`, `${smallerVal}px`]
            barSmallStyle.backgroundColor = LARGER_COLOR;
            barLargerStyle.backgroundColor = SMALLER_COLOR;
        }
        completedAnimations++;
        nextStepTimeout = getSpeedCallback();
    }

    else {
        const [indexNoLongerInUse, indexStillUsing] = animations[i - 3];
        const indexNoLongerInUseStyle = arrayBars[indexNoLongerInUse].style;
        const indexStillUsingStyle = arrayBars[indexStillUsing].style;
        completedAnimations++;
                    
        setTimeout(() => {
            indexNoLongerInUseStyle.backgroundColor = PRIMARY_COLOR;
            indexStillUsingStyle.backgroundColor = PRIMARY_COLOR;
        }, getSpeedCallback());
        nextStepTimeout = getSpeedCallback();
    }
    setTimeout(() => animate(animations, arrayBars, completedAnimations, getSpeedCallback, comparisons, updateComparisons, resolveCallback), nextStepTimeout);
}