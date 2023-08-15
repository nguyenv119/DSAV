import { resetAllBarColors, greenify } from "../CommonMethods/commonMethods";
import {    PRIMARY_COLOR,
            SECONDARY_COLOR,
            LARGER_COLOR,
            SMALLER_COLOR,
            SAMESIZE_COLOR,
            DONE_COLOR,
        } from "../../SortingVisualizer/SortingVisualizer";
    
const GOOD_COLOR = "#9706ff";

/*
? The bubbleSort function we are exporting with the animation array */
export function bubbleSortExp(array, 
                              arrayBars, 
                              getSpeedCallback, 
                              comparisons, 
                              updateComparisons,
                              isPausedCallback,
                              updateHighlight) {

    return new Promise((resolve) => {
        resetAllBarColors(arrayBars, PRIMARY_COLOR);        
        const [lines, animations, arr] = getBubbleSortArrays(array.slice());
        /*
        ? We need to pass in () => resolve(arr) to
        ? 1. The parameter of arr lets the promise know what to return, the actual sorted array
        ? 2. The callback function requires for the "animate" function to be completed before returning. If we removed the "() =>" JS asynchronous nature would return it immedientally */
        animate(lines, 0, animations, arrayBars, 0, array.length - 1, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, () => resolve(arr));
    });
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
function getBubbleSortArrays(arr) {
    const animations = [];
    const lines = [];  /* Determines which line to highlight in the code */
    if (arr.length <= 1) return arr;
    bubbleSort(arr, lines, animations)
    return [lines, animations, arr];
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
function bubbleSort(array, lines, animations) {
    let didSwap = true;
    lines.push(["YES", 3]);
    let i = array.length;
    lines.push(["YES", 5]);
    while (didSwap && i > 0) {
        lines.push(["YES", 7]);
        didSwap = false;
        lines.push(["YES", 8]);
        for (let j = 0; j < i - 1; ++j) {
            lines.push(["YES", 9]);
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
                lines.push(["YES", 11]); /** Stage 0 comparing indices */
                lines.push(["YES", 11]) /** Stage 1 comparing values  */

                didSwap = true;
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                lines.push(["YES", 13, 14]); /** Stage 2, swapping*/
            /** Stage 2: If its no switch, just keep highlighting the if statement*/
            } else {
                lines.push(["YES", 11]);
                lines.push(["YES", 11]);
                lines.push(["NO", 11]);
            }
        }
        i--;
    }
}

/*
? Animates bubbleSort */
function animate(
                lines,
                linesIdx,
                animations, 
                arrayBars, 
                animationsIdx, 
                toBeSortedIndex, 
                getSpeedCallback, 
                comparisons, 
                updateComparisons, 
                updateHighlight,
                isPausedCallback,
                resolveCallback) {

    /*
    ! If we are paused, we keep calling it. Eventually, when it is unpaused, we will skip this if statement and go
    ! forward. Whenever we pause again, the parameters will be updated. */
    if (isPausedCallback()) {
        setTimeout(() => {
            animate(lines, linesIdx, animations, arrayBars, animationsIdx, toBeSortedIndex, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, resolveCallback);
        }, 1);
        return;
    };
    
    if (linesIdx >= lines.length) {
        /*
        ? Resolves promise when animation is finished */
        greenify(linesIdx, lines, arrayBars);
        resolveCallback(animations) 
        return;
    }    

    let nextStepTimeout = 0;
    const stage = animationsIdx % 3;
    const highlightedLine = lines[linesIdx];
    /** If we compare/swap, swap and then highlight line, or else just highlight line */
    if (highlightedLine.includes(11)) {
        if (stage === 0) {
            const [barOneIdx, barTwoIdx] = animations[animationsIdx];
            const barOneStyle = arrayBars[barOneIdx].style;
            const barTwoStyle = arrayBars[barTwoIdx].style;

            barOneStyle.backgroundColor = SECONDARY_COLOR;
            barTwoStyle.backgroundColor = SECONDARY_COLOR;
            nextStepTimeout = getSpeedCallback(); 
            animationsIdx++;
        } else if (stage === 1) {
            const [indexJ, indexJ1] = animations[animationsIdx - 1];
            const [indexJVal, indexJ1Val] = animations[animationsIdx];

            if (indexJVal === indexJ1Val) {
                const barOneStyle = arrayBars[indexJ].style;
                const barTwoStyle = arrayBars[indexJ1].style;

                barOneStyle.backgroundColor = SAMESIZE_COLOR;
                barTwoStyle.backgroundColor = SAMESIZE_COLOR;
                updateComparisons(comparisons + 1);
                comparisons++;
            } else {
                const smallerBarIndex = (indexJVal < indexJ1Val) ? indexJ : indexJ1;
                const largerBarIndex = (smallerBarIndex === indexJ) ? indexJ1 : indexJ;
                const barOneStyle = arrayBars[smallerBarIndex].style;
                const barTwoStyle = arrayBars[largerBarIndex].style;

                barOneStyle.backgroundColor = SMALLER_COLOR;
                barTwoStyle.backgroundColor = LARGER_COLOR;
                updateComparisons(comparisons + 1);
                comparisons++;
            }
            nextStepTimeout = getSpeedCallback(); 
            animationsIdx++;
        /*
        ? This is when both are purple or the same */
        } else {
            const [indexJ, indexJ1] = animations[animationsIdx - 2];
            
            const barOneStyle = arrayBars[indexJ].style;
            const barTwoStyle = arrayBars[indexJ1].style;
                
            [barOneStyle.backgroundColor, barTwoStyle.backgroundColor] = [GOOD_COLOR, GOOD_COLOR];
            
            setTimeout(() => {
                barOneStyle.backgroundColor = PRIMARY_COLOR;
                barTwoStyle.backgroundColor = PRIMARY_COLOR;
                if (indexJ1 === toBeSortedIndex) {
                    arrayBars[indexJ1].style.backgroundColor = DONE_COLOR;
                    toBeSortedIndex--;
                }
            }, getSpeedCallback())
            nextStepTimeout = getSpeedCallback(); 
            animationsIdx++;
        }
    
    /*
    ? Guaranteed switching */
    } else if (highlightedLine.includes(13)) {
        if (stage === 2) {
            const [indexJ, indexJ1] = animations[animationsIdx - 2];
            const [indexJVal, indexJ1Val] = animations[animationsIdx - 1];
            
            const [smallerBarIndex, largerBarIndex] = indexJVal < indexJ1Val ? [indexJ, indexJ1] : [indexJ1, indexJ];
            const barOneStyle = arrayBars[smallerBarIndex].style;
            const barTwoStyle = arrayBars[largerBarIndex].style;
            
            const [smallerHeight, largerHeight] = indexJVal < indexJ1Val ? [indexJVal, indexJ1Val] : [indexJ1Val, indexJVal];        
    
            [barOneStyle.height, barTwoStyle.height] = [`${largerHeight}px`, `${smallerHeight}px`];
            [barOneStyle.backgroundColor, barTwoStyle.backgroundColor] = [LARGER_COLOR, SMALLER_COLOR];

            
            setTimeout(() => {
                barOneStyle.backgroundColor = PRIMARY_COLOR;
                barTwoStyle.backgroundColor = PRIMARY_COLOR;
                if (indexJ1 === toBeSortedIndex) {
                    arrayBars[indexJ1].style.backgroundColor = DONE_COLOR;
                    toBeSortedIndex--;
                }
            }, getSpeedCallback())
            nextStepTimeout = getSpeedCallback(); 
            animationsIdx++;
        }
    }

    nextStepTimeout = getSpeedCallback(); 
    updateHighlight(highlightedLine);
    linesIdx++;
    setTimeout(() => animate(lines, linesIdx, animations, arrayBars, animationsIdx, toBeSortedIndex, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, resolveCallback), nextStepTimeout);
}