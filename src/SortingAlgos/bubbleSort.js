import {resetAllBarColors, greenify} from "./CommonMethods/commonMethods";
import {    PRIMARY_COLOR,
            SECONDARY_COLOR,
            LARGER_COLOR,
            SMALLER_COLOR,
            SAMESIZE_COLOR,
            DONE_COLOR,
        } from "../SortingVisualizer/SortingVisualizer";

const GOOD_COLOR = "#9706ff";
/** The bubbleSort function we are exporting with the animation array */
export function bubbleSortExp(array, arrayBars, getSpeedCallback, comparisons, updateComparisons) {
    resetAllBarColors(arrayBars, PRIMARY_COLOR);        
    const [res, arr] = getBubbleSortAnimationArray(array.slice());
    animate(res, arrayBars, 0, array.length - 1, getSpeedCallback, comparisons, updateComparisons);
    return [res, arr];
}

/**
 * When comparing two indices add twice to the animations to 
 * animate SECONDARY then switch back.
 * 
 * If we switch, if the element is smaller than the compared element, 
 * the element bubbling up should turn into a different color: TERTIARY
 * --> There, we should pass in the indices and the new heights of the two
 * swapped elements
 */
function getBubbleSortAnimationArray(arr) {
    const animations = [];
    if (arr.length <= 1) return arr;
    bubbleSort(arr, animations)
    return [animations, arr];
}

/* Actual bubbleSort function 
 * 0: comparing 2 INIDCES: SECONDARYCOLOR
 * 1: Determine which color is larger/smaller -> green and red
 * 2: filler (timing purposes), swap bars
 * 
 * At the end of each iteration, since we know that the last
 * index will always have the largest number -- the array will
 * be sorted from the end to the start --> we should color the 
 * sorted parts green as we move along down
*/
function bubbleSort(array, animations) {

    let didSwap = true;
    let i = array.length;
    while (didSwap && i > 0) {
        didSwap = false;
        for (let j = 0; j < i - 1; ++j) {

            /** 
            * Pass in 2 indices for bar comparison 
            * Since array[j]> array[j + 1], 1st index green 
            * If array[j] <= array[j + 1], no swapping just pass heights
            * and animation will make both bars same color: 
            * 
            * --> Yellow if same heights
            * --> Purple if no need swapping
            */
            animations.push([j, j + 1])
            animations.push([array[j], array[j + 1]]);
            animations.push([]);
            if (array[j] > array[j + 1]) {
                didSwap = true;
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
        }
        i--;
    }
}

/** Animates bubbleSort */
function animate(res, arrayBars, completedAnimations, toBeSortedIndex, getSpeedCallback, comparisons, updateComparisons) {
    if (completedAnimations >= res.length) return;

    const i = completedAnimations;
    const stage = i % 3;

    let nextStepTimeout = 0;

    if (stage === 0) {
        const [barOneIdx, barTwoIdx] = res[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;

        barOneStyle.backgroundColor = SECONDARY_COLOR;
        barTwoStyle.backgroundColor = SECONDARY_COLOR;
        completedAnimations++;
        nextStepTimeout = getSpeedCallback();
    } else if (stage === 1) {
        const [indexJ, indexJ1] = res[i - 1];
        const [indexJVal, indexJ1Val] = res[i];

        if (indexJVal === indexJ1Val) {
            const barOneStyle = arrayBars[indexJ].style;
            const barTwoStyle = arrayBars[indexJ1].style;

            barOneStyle.backgroundColor = SAMESIZE_COLOR;
            barTwoStyle.backgroundColor = SAMESIZE_COLOR;
            updateComparisons(comparisons + 1);
            comparisons++;
            nextStepTimeout = getSpeedCallback();
        } else {
            const smallerBarIndex = (indexJVal < indexJ1Val) ? indexJ : indexJ1;
            const largerBarIndex = (smallerBarIndex === indexJ) ? indexJ1 : indexJ;
            const barOneStyle = arrayBars[smallerBarIndex].style;
            const barTwoStyle = arrayBars[largerBarIndex].style;

            barOneStyle.backgroundColor = SMALLER_COLOR;
            barTwoStyle.backgroundColor = LARGER_COLOR;
            updateComparisons(comparisons + 1);
            comparisons++;
            nextStepTimeout = getSpeedCallback();
        }
        completedAnimations++;
        greenify(completedAnimations, res, arrayBars);

    } else {
        const [indexJ, indexJ1] = res[i - 2];
        const [indexJVal, indexJ1Val] = res[i - 1];

        const smallerBarIndex = (indexJVal < indexJ1Val) ? indexJ : indexJ1;
        const largerBarIndex = (smallerBarIndex === indexJ) ? indexJ1 : indexJ;
        const barOneStyle = arrayBars[smallerBarIndex].style;
        const barTwoStyle = arrayBars[largerBarIndex].style;
        const largerHeight = (indexJVal >= indexJ1Val) ? indexJVal : indexJ1Val;
        const smallerHeight = (indexJVal < indexJ1Val) ? indexJVal : indexJ1Val;

        if (indexJVal > indexJ1Val) {
            [barOneStyle.height, barTwoStyle.height] = [`${largerHeight}px`, `${smallerHeight}px`];
            [barOneStyle.backgroundColor, barTwoStyle.backgroundColor] = [LARGER_COLOR, SMALLER_COLOR];
        } else {
            [barOneStyle.backgroundColor, barTwoStyle.backgroundColor] = [GOOD_COLOR, GOOD_COLOR];
        }
        completedAnimations++;

        setTimeout(() => {
            barOneStyle.backgroundColor = PRIMARY_COLOR;
            barTwoStyle.backgroundColor = PRIMARY_COLOR;
            if (indexJ1 === toBeSortedIndex) {
                arrayBars[indexJ1].style.backgroundColor = DONE_COLOR;
                toBeSortedIndex--;
            }
        }, getSpeedCallback())
        
        greenify(completedAnimations, res, arrayBars);
        nextStepTimeout = getSpeedCallback();

    }
    setTimeout(() => animate(res, arrayBars, completedAnimations, toBeSortedIndex, getSpeedCallback, comparisons, updateComparisons), nextStepTimeout);
}




  
  

